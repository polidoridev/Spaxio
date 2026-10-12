import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FilmRenderer, type FilmEvent } from "./film-worker";
import manifest from "./films.json";

/** The Private Equity renderer and its 45 ms response, scoped to a React mount. */
export function mountCinema(root: HTMLElement, status: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);
  const sections = Array.from(root.querySelectorAll<HTMLElement>(".cr-luxury-scene"));
  const containers = sections.map(section => section.querySelector<HTMLElement>(".cr-luxury-visual")!);
  const makeCanvases = () => containers.map(container => {
    const canvas = document.createElement("canvas");
    canvas.className = "cr-luxury-canvas";
    container.appendChild(canvas);
    return canvas;
  });
  let canvases = makeCanvases();
  let worker: Worker | undefined, renderer: FilmRenderer | undefined;
  let disposed = false, raf = 0, previousTime = 0;
  let geometry: { top: number; height: number }[] = [], viewport = innerHeight;
  const display: (number | null)[] = sections.map(() => null);
  const mobile = matchMedia("(max-width: 767px)").matches;
  const forceImages = new URLSearchParams(location.search).has("image-frames");
  const receive = (data: FilmEvent) => {
    if (disposed) return;
    if (data.type === "draw") {
      const canvas = canvases[data.index];
      canvas.classList.add("is-ready");
      canvas.dataset.frame = String(data.frame);
      canvas.dataset.mode = data.mode;
      canvas.dataset.cacheFrames = String(data.cacheFrames);
    } else if (data.type === "progress") {
      status.hidden = false;
      status.textContent = `${root.dataset.loading} ${Math.round(data.progress * 100)}%`;
    } else if (data.type === "loaded") {
      status.hidden = true;
      root.dataset.renderer = data.mode;
    } else if (data.type === "error") {
      status.hidden = false;
      status.textContent = root.dataset.error!;
    }
  };
  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(50, previousTime ? now - previousTime : 16.7);
    previousTime = now;
    let moving = false;
    const targets = geometry.map((bounds, index) => {
      const start = index === 0 ? bounds.top : bounds.top - viewport;
      // Complete the last clip before leaving the film collection for the portfolio.
      const end = index === sections.length - 1 ? bounds.top + bounds.height - viewport : bounds.top + bounds.height;
      const progress = Math.max(0, Math.min(1, (scrollY - start) / Math.max(1, end - start)));
      const target = progress * (manifest.scenes[index].count - 1);
      const active = bounds.top < scrollY + viewport && bounds.top + bounds.height > scrollY && !document.hidden;
      let value = display[index];
      if (value === null || !active) value = target;
      else value += (target - value) * (1 - Math.exp(-dt / 45));
      if (Math.abs(value - target) < .15) value = target;
      else if (active) moving = true;
      display[index] = value;
      canvases[index].dataset.target = String(Math.round(value));
      return { frame: Math.round(value), active };
    });
    if (worker) worker.postMessage({ type: "targets", targets });
    else renderer?.update(targets);
    if (moving) schedule(); else previousTime = 0;
  };
  function schedule() { if (!disposed && !raf) raf = requestAnimationFrame(frame); }
  const measure = () => {
    viewport = innerHeight;
    geometry = sections.map(section => { const rect = section.getBoundingClientRect(); return { top: rect.top + scrollY, height: rect.height }; });
    canvases.forEach((canvas, index) => {
      const bounds = containers[index].getBoundingClientRect();
      const scale = Math.min(devicePixelRatio, 2, Math.sqrt((1920 * 1080) / Math.max(1, bounds.width * bounds.height)));
      const width = Math.max(1, Math.round(bounds.width * scale)), height = Math.max(1, Math.round(bounds.height * scale));
      if (worker) worker.postMessage({ type: "resize", index, width, height });
      else renderer?.resize(index, width, height);
    });
    schedule();
  };
  const mainThread = () => {
    worker?.terminate(); worker = undefined;
    canvases.forEach(canvas => canvas.remove());
    canvases = makeCanvases();
    renderer = new FilmRenderer(canvases, manifest.scenes, mobile, receive);
    void renderer.start(forceImages);
    measure();
  };
  try {
    if (!("transferControlToOffscreen" in HTMLCanvasElement.prototype) || typeof Worker === "undefined") mainThread();
    else {
      worker = new Worker("/luxury/film-worker.js", { type: "module" });
      worker.onmessage = ({ data }) => receive(data);
      worker.onerror = () => { if (!disposed) mainThread(); };
      const surfaces = canvases.map(canvas => canvas.transferControlToOffscreen());
      worker.postMessage({ type: "init", canvases: surfaces, scenes: manifest.scenes, mobile, forceImages }, surfaces);
    }
  } catch { mainThread(); }
  const resize = new ResizeObserver(measure);
  sections.forEach(section => resize.observe(section));
  const trigger = ScrollTrigger.create({ start: 0, end: "max", onUpdate: schedule, onRefresh: measure });
  document.addEventListener("visibilitychange", schedule);
  measure();
  return () => {
    disposed = true;
    cancelAnimationFrame(raf); resize.disconnect(); trigger.kill();
    document.removeEventListener("visibilitychange", schedule);
    renderer?.dispose(); worker?.terminate();
    canvases.forEach(canvas => canvas.remove());
  };
}
