/* Plain JavaScript renderer. Compressed films stay in RAM for the entire visit. */
export function unpackFilm(buffer) {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  if (bytes.length < 12 || String.fromCharCode(...bytes.subarray(0, 4)) !== 'PPEG') throw new Error('Invalid film');
  const count = view.getUint32(4, true), gop = view.getUint32(8, true);
  if (!count || count > 1000 || !gop || gop > 12 || 12 + count * 4 > bytes.length) throw new Error('Invalid film index');
  let offset = 12 + count * 4;
  const frames = [];
  for (let i = 0; i < count; i++) {
    const length = view.getUint32(12 + i * 4, true);
    if (!length || offset + length > bytes.length) throw new Error('Truncated film');
    frames.push(bytes.subarray(offset, offset + length));
    offset += length;
  }
  if (offset !== bytes.length) throw new Error('Invalid film length');
  return { frames, gop };
}

export class FilmRenderer {
  constructor(canvases, scenes, mobile, send) {
    this.scenes = scenes;
    this.send = send;
    this.panels = canvases.map(canvas => ({ canvas, context: canvas.getContext('2d', { alpha: false, desynchronized: true }), target: 0, drawn: -1, direction: 1, active: false }));
    this.cacheLimit = mobile ? 8 : 12;
    this.cache = new Map();
    this.failedFrames = new Set();
    this.progressTime = 0;
    this.clips = [];
    this.tickets = new Map();
    this.timestamp = 0;
    this.mode = 'h264';
    this.busy = false;
    this.batch = null;
    this.disposed = false;
    this.generation = 0;
    this.abort = new AbortController();
    this.progress = scenes.map(() => 0);
  }

  async start(forceImages = false) {
    if (forceImages || typeof VideoDecoder === 'undefined') return this.startImages();
    const generation = this.generation;
    try {
      const first = this.scenes[0];
      const config = { codec: first.codec, codedWidth: first.width, codedHeight: first.height, hardwareAcceleration: 'prefer-hardware', optimizeForLatency: true };
      const support = await VideoDecoder.isConfigSupported(config);
      if (!support.supported) return this.startImages();
      if (this.disposed) return;
      this.decoder = new VideoDecoder({ output: frame => this.output(frame), error: () => this.startImages() });
      this.decoder.configure(config);
      await Promise.all(this.scenes.map(async (scene, index) => {
        const buffer = await this.download(scene.url, index, scene.bytes);
        if (this.disposed || this.mode !== 'h264') return;
        this.clips[index] = unpackFilm(buffer);
        this.send({ type: 'film-ready', index });
        this.pump();
      }));
      if (!this.disposed && generation === this.generation) this.send({ type: 'loaded', mode: this.mode });
    } catch (error) {
      if (!this.disposed && generation === this.generation) this.send({ type: 'error', message: 'The films could not finish loading. Reload to try again.' });
    }
  }

  async download(url, index, expected) {
    const response = await fetch(url, { signal: this.abort.signal, cache: 'force-cache' });
    if (!response.ok) throw new Error(`Film ${response.status}`);
    if (!response.body) return response.arrayBuffer();
    const reader = response.body.getReader();
    const chunks = [];
    let length = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      length += value.length;
      this.progress[index] = Math.min(1, length / expected);
      const now = performance.now();
      if (now - this.progressTime > 60) {
        this.progressTime = now;
        this.send({ type: 'progress', progress: this.progress.reduce((a, b) => a + b, 0) / this.scenes.length });
      }
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    return bytes.buffer;
  }

  async startImages() {
    if (this.mode === 'webp' || this.disposed) return;
    this.mode = 'webp';
    this.generation++;
    clearTimeout(this.batch?.watchdog);
    clearTimeout(this.batch?.recovery);
    this.batch = null;
    this.busy = false;
    this.tickets.clear();
    if (this.decoder && this.decoder.state !== 'closed') this.decoder.close();
    this.abort.abort();
    this.abort = new AbortController();
    this.cache.forEach(bitmap => bitmap.close());
    this.cache.clear();
    this.clips = [];
    this.progress.fill(0);
    // Compatibility path; all image bytes are also loaded and retained before use.
    const jobs = this.scenes.flatMap((scene, index) => Array.from({ length: Math.ceil(scene.count / 12) }, (_, pack) => ({ scene, index, pack })));
    const totalPacks = jobs.length;
    const imageFrames = this.scenes.map(() => []);
    let completed = 0;
    const runner = async () => {
      for (;;) {
        const job = jobs.shift();
        if (!job || this.disposed) return;
        const response = await fetch(`/luxury/frames-hq/webp/${job.scene.name}/${String(job.pack).padStart(4, '0')}.bin`, { signal: this.abort.signal, cache: 'force-cache' });
        if (!response.ok) throw new Error('Image frames unavailable');
        const buffer = await response.arrayBuffer(), view = new DataView(buffer);
        const count = view.getUint32(4, true);
        let offset = 8 + count * 4;
        for (let i = 0; i < count; i++) {
          const length = view.getUint32(8 + i * 4, true);
          imageFrames[job.index][job.pack * 12 + i] = new Uint8Array(buffer, offset, length);
          offset += length;
        }
        completed++;
        this.send({ type: 'progress', progress: completed / totalPacks });
      }
    };
    try {
      await Promise.all(Array.from({ length: 5 }, runner));
      if (this.disposed) return;
      this.clips = imageFrames.map(frames => ({ frames, gop: 1 }));
      this.send({ type: 'loaded', mode: 'webp' });
      this.pump();
    } catch { if (!this.disposed) this.send({ type: 'error', message: 'The films could not finish loading. Reload to try again.' }); }
  }

  resize(index, width, height) {
    const panel = this.panels[index];
    if (panel.canvas.width === width && panel.canvas.height === height) return;
    panel.canvas.width = width; panel.canvas.height = height; panel.drawn = -1;
    panel.context.imageSmoothingEnabled = true;
    panel.context.imageSmoothingQuality = 'high';
    this.draw(index);
  }

  update(targets) {
    targets.forEach((target, index) => {
      const panel = this.panels[index];
      const frame = Math.max(0, Math.min(this.scenes[index].count - 1, Math.round(target.frame)));
      if (frame !== panel.target) panel.direction = Math.sign(frame - panel.target);
      panel.target = frame; panel.active = target.active;
      if (panel.active) this.draw(index);
    });
    this.pump();
  }

  wants() {
    const result = [];
    const add = (index, frame) => {
      if (frame >= 0 && frame < this.scenes[index].count && this.clips[index]) result.push({ index, frame, key: `${index}:${frame}` });
    };
    this.panels.forEach((p, i) => { if (p.active) add(i, p.target); });
    for (let distance = 1; distance <= 3; distance++) {
      this.panels.forEach((p, i) => { if (p.active) { add(i, p.target + distance * p.direction); if (distance === 1) add(i, p.target - p.direction); } });
    }
    return result.slice(0, this.cacheLimit - 2);
  }

  pump() {
    if (this.busy || this.disposed) return;
    const wants = this.wants();
    const next = wants.find(want => !this.cache.has(want.key) && !this.failedFrames.has(want.key));
    if (!next) return;
    const generation = this.generation;
    this.busy = true;
    if (this.mode === 'webp') {
      const data = this.clips[next.index].frames[next.frame];
      createImageBitmap(new Blob([data], { type: 'image/webp' })).then(bitmap => this.accept(next.index, next.frame, bitmap, generation))
        .catch(() => { this.failedFrames.add(next.key); this.send({ type: 'error', message: 'This film could not be decoded.' }); })
        .finally(() => { if (generation === this.generation) { this.busy = false; this.pump(); } });
      return;
    }
    const clip = this.clips[next.index];
    const first = Math.floor(next.frame / clip.gop) * clip.gop;
    const end = Math.min(first + clip.gop, clip.frames.length);
    const batch = { remaining: end - first, images: [], generation };
    this.batch = batch;
    // Normal output arrives within a frame; drain only a stalled hardware decoder.
    batch.watchdog = setTimeout(() => {
      if (this.batch !== batch || this.disposed || batch.remaining === 0) return;
      this.decoder.flush().catch(() => this.startImages());
      batch.recovery = setTimeout(() => {
        if (this.batch === batch && batch.remaining > 0) this.startImages();
      }, 750);
    }, 250);
    try {
      for (let frame = first; frame < end; frame++) {
        const timestamp = ++this.timestamp * 16667;
        this.tickets.set(timestamp, { index: next.index, frame, batch });
        this.decoder.decode(new EncodedVideoChunk({ type: frame === first ? 'key' : 'delta', timestamp, data: clip.frames[frame] }));
      }
    } catch { this.startImages(); }
  }

  output(frame) {
    const ticket = this.tickets.get(frame.timestamp);
    this.tickets.delete(frame.timestamp);
    if (!ticket) { frame.close(); return; }
    const { index, frame: number, batch } = ticket;
    const wanted = this.wants().some(w => w.index === index && w.frame === number);
    if (wanted && batch.generation === this.generation) {
      const image = createImageBitmap(frame).then(bitmap => this.accept(index, number, bitmap, batch.generation)).catch(() => this.failedFrames.add(`${index}:${number}`)).finally(() => frame.close());
      batch.images.push(image);
    } else frame.close();
    if (--batch.remaining === 0) {
      clearTimeout(batch.watchdog); clearTimeout(batch.recovery);
      Promise.allSettled(batch.images).then(() => {
        if (batch.generation !== this.generation) return;
        this.batch = null; this.busy = false; this.pump();
      });
    }
  }

  accept(index, frame, bitmap, generation) {
    if (this.disposed || generation !== this.generation) { bitmap.close(); return; }
    const key = `${index}:${frame}`;
    this.cache.get(key)?.close();
    this.cache.delete(key); this.cache.set(key, bitmap);
    const keep = new Set(this.wants().map(w => w.key));
    while (this.cache.size > this.cacheLimit) {
      const old = [...this.cache.keys()].find(key => !keep.has(key)) ?? this.cache.keys().next().value;
      this.cache.get(old).close(); this.cache.delete(old);
    }
    if (this.panels[index].active) this.draw(index);
  }

  draw(index) {
    const panel = this.panels[index];
    let frame = panel.target;
    if (!this.cache.has(`${index}:${frame}`)) {
      let distance = panel.drawn < 0 ? Infinity : Math.abs(panel.target - panel.drawn);
      frame = panel.drawn;
      for (const key of this.cache.keys()) {
        const [scene, candidate] = key.split(':').map(Number);
        if (scene === index && Math.abs(candidate - panel.target) < distance) { distance = Math.abs(candidate - panel.target); frame = candidate; }
      }
    }
    if (frame < 0 || frame === panel.drawn) return;
    const bitmap = this.cache.get(`${index}:${frame}`);
    if (!bitmap) return;
    const { width, height } = panel.canvas;
    const ratio = width / height;
    let sx = 0, sy = 0, sw = bitmap.width, sh = bitmap.height;
    if (ratio < sw / sh) { sw = sh * ratio; sx = (bitmap.width - sw) * .58; }
    else { sh = sw / ratio; sy = (bitmap.height - sh) * .5; }
    panel.context.drawImage(bitmap, sx, sy, sw, sh, 0, 0, width, height);
    panel.drawn = frame;
    this.send({ type: 'draw', index, frame, target: panel.target, mode: this.mode, cacheFrames: this.cache.size });
  }

  dispose() {
    this.disposed = true; this.generation++; this.abort.abort();
    clearTimeout(this.batch?.watchdog); clearTimeout(this.batch?.recovery);
    if (this.decoder && this.decoder.state !== 'closed') this.decoder.close();
    this.cache.forEach(bitmap => bitmap.close()); this.cache.clear(); this.clips = [];
  }
}

if (typeof document === 'undefined' && typeof self !== 'undefined') {
  let renderer;
  self.onmessage = ({ data }) => {
    if (data.type === 'init') {
      renderer = new FilmRenderer(data.canvases, data.scenes, data.mobile, value => self.postMessage(value));
      renderer.start(data.forceImages);
    } else if (data.type === 'targets') renderer?.update(data.targets);
    else if (data.type === 'resize') renderer?.resize(data.index, data.width, data.height);
    else if (data.type === 'dispose') renderer?.dispose();
  };
}
