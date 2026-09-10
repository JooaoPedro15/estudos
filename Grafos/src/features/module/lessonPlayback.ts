import { useEffect, useState } from 'react';

export const STEP_MS = 2200;
export interface PlaybackState { index: number; elapsed: number; playing: boolean }

export function advancePlayback(state: PlaybackState, delta: number, length: number): PlaybackState {
  if (!state.playing) return state;
  const elapsed = state.elapsed + delta;
  if (elapsed < STEP_MS) return { ...state, elapsed };
  if (state.index === length - 1) return { ...state, elapsed: STEP_MS, playing: false };
  return { index: state.index + 1, elapsed: 0, playing: true };
}

/** Local controls only: no global keyboard handlers interfering with exercises. */
export function useLessonPlayback(length: number) {
  const [state, setState] = useState<PlaybackState>({ index: 0, elapsed: STEP_MS, playing: false });
  useEffect(() => {
    if (!state.playing) return;
    let frame: number;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = Math.min(now - last, 100); // Hidden tabs never skip learning steps.
      last = now;
      setState(previous => advancePlayback(previous, delta, length));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [state.playing, length]);
  const goTo = (index: number) => setState({ index: Math.max(0, Math.min(length - 1, index)), elapsed: STEP_MS, playing: false });
  const toggle = () => setState(previous => previous.playing
    ? { ...previous, playing: false }
    : previous.index === length - 1 && previous.elapsed >= STEP_MS
      ? { index: 0, elapsed: 0, playing: true }
      : { ...previous, playing: true });
  return { ...state, progress: Math.min(1, state.elapsed / 850), goTo, toggle };
}
