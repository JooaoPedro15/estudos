import { describe, expect, it } from 'vitest';
import { advancePlayback, STEP_MS } from './lessonPlayback';

describe('lesson playback', () => {
  it('holds position while paused, including inside a traversal', () => {
    expect(advancePlayback({ index: 1, elapsed: 300, playing: false }, 500, 5)).toEqual({ index: 1, elapsed: 300, playing: false });
  });
  it('moves to the next full snapshot', () => {
    expect(advancePlayback({ index: 1, elapsed: STEP_MS - 10, playing: true }, 30, 5)).toEqual({ index: 2, elapsed: 0, playing: true });
  });
  it('stops on the final snapshot and never wraps or exceeds bounds', () => {
    expect(advancePlayback({ index: 4, elapsed: STEP_MS - 10, playing: true }, 30, 5)).toEqual({ index: 4, elapsed: STEP_MS, playing: false });
  });
});
