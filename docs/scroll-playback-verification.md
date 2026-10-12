# Scroll playback — October 11, 2026

Reference supplied by the user: `/Users/stefano/Desktop/polidori.dev/Websites/Advertisements/PolidoriPrivateEquity`.

The portfolio now uses all six original 60 fps films, verified byte for byte against that site's PPEG files. The original FilmRenderer is retained, with asset URLs scoped under `/luxury`. It uses a worker, an in-memory compressed film collection, a bounded decoded-frame cache, and the original 45 ms response. The layout follows the reference's native document scrolling with 22svh overlapping gradient joins (20svh on mobile). The final clip completes before the portfolio's milestones, work and contact sections.

The React wrapper creates and removes canvas surfaces per mount, including Strict Mode cleanup. ScrollTrigger schedules updates without a React render per frame. Reduced-motion visitors see posters and can explicitly enable the films. The exact original WebP compatibility packs remain available when WebCodecs cannot run; worker failure falls back to the same renderer on the main thread.

Validation in installed Google Chrome through Playwright:

- Desktop wheel forward: first clip advanced from frame 0 to 148.
- Reverse wheel: first clip returned to frame 33.
- All six chapters drew changing frames while in view.
- Contact section remained reachable after the film collection.
- Mobile reduced-motion mode loaded no canvases; explicit opt-in and scrolling drew frame 85.
- `?image-frames` forced the WebP compatibility path; scrolling drew frame 109.
- Blocking the worker request exercised the main-thread fallback; scrolling drew frame 102.
- No page runtime errors in the main browser checks.
- `npm run build`, TypeScript, the five contact validation tests, and `git diff --check` passed.

During testing, Next's dev server blocked the HMR connection from 127.0.0.1. Explicit local development origins were added and the server restarted. Both localhost and 127.0.0.1 were tested afterward.

Local preview: http://localhost:3100. No deployment or live inquiry email was sent as part of this change.
