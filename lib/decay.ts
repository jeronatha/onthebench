export const DAILY_DECAY = 0.9;
export const FADING_HINT = 1;
export const ZERO_EPSILON = 0.005;
export const MIN_PAYMENT = 1;

export type ListingState = "ranked" | "fading" | "open";

export function liveValue(lastValue: number, lastPaidAt: Date | string, now = Date.now()): number {
  const paid = typeof lastPaidAt === "string" ? new Date(lastPaidAt).getTime() : lastPaidAt.getTime();
  const hours = Math.max(0, (now - paid) / 3_600_000);
  return lastValue * Math.pow(DAILY_DECAY, hours / 24);
}

/** Ranked until live value hits zero. Below $1 still ranks — just fades visually. */
export function listingState(value: number): ListingState {
  if (value <= ZERO_EPSILON) return "open";
  if (value < FADING_HINT) return "fading";
  return "ranked";
}

export function isRanked(value: number): boolean {
  return value > ZERO_EPSILON;
}

export function remainingFraction(lastValue: number, current: number): number {
  if (lastValue <= 0) return 0;
  return Math.max(0, Math.min(1, current / lastValue));
}

export function formatUsd(value: number): string {
  if (value <= ZERO_EPSILON) return "$0.00";
  return `$${value.toFixed(2)}`;
}
