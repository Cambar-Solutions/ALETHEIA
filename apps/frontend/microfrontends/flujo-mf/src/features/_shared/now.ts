// Reference "now" for SLA computations.
//
// The seed `enteredAt` values are anchored to ~2026-06-02 so the three SLA
// colors are always visible regardless of the real clock. We use a fixed
// BASE_NOW for deterministic demos; switch to `new Date()` for a live clock.

export const BASE_NOW = new Date('2026-06-02T12:00:00.000Z');

/** Returns the reference clock used across SLA views. */
export function getNow(): Date {
  return BASE_NOW;
}
