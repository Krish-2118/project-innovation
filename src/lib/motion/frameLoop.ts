/**
 * A single shared requestAnimationFrame loop. Tasks run once per frame; a
 * task returns `true` while it still needs further frames (e.g. an easing
 * value that hasn't settled). The loop sleeps when nothing needs it and is
 * woken with `requestFrame()` (e.g. from a scroll or pointer listener).
 */
type FrameTask = () => boolean | void;

const tasks = new Set<FrameTask>();
let rafId = 0;

function tick() {
  rafId = 0;
  let again = false;
  tasks.forEach((task) => {
    if (task()) again = true;
  });
  if (again) requestFrame();
}

export function requestFrame() {
  if (!rafId && tasks.size > 0) rafId = requestAnimationFrame(tick);
}

export function addFrameTask(task: FrameTask) {
  tasks.add(task);
  requestFrame();
  return () => {
    tasks.delete(task);
    if (tasks.size === 0 && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };
}
