export type Scene = { name: string; url: string; count: number; fps: number; width: number; height: number; codec: string; bytes: number; gopSize: number };
export type FilmEvent = { type: string; index: number; frame: number; mode: string; cacheFrames: number; progress: number; message: string };
export class FilmRenderer {
  constructor(canvases: HTMLCanvasElement[], scenes: Scene[], mobile: boolean, send: (event: FilmEvent) => void);
  start(forceImages?: boolean): Promise<void>;
  update(targets: { frame: number; active: boolean }[]): void;
  resize(index: number, width: number, height: number): void;
  dispose(): void;
}
