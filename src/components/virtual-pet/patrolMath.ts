const DEFAULT_PATROL_SPEED_PX_PER_SECOND = 52;
const MINIMUM_LEG_DURATION_MS = 700;

export function computePatrolTravelDistance(
  habitatWidth: number,
  spriteSize: number,
  horizontalInset: number
): number {
  return Math.max(0, habitatWidth - spriteSize - horizontalInset * 2);
}

export function computePatrolLegDuration(
  currentPosition: number,
  destination: number,
  speedPxPerSecond = DEFAULT_PATROL_SPEED_PX_PER_SECOND
): number {
  if (speedPxPerSecond <= 0) return MINIMUM_LEG_DURATION_MS;

  const distance = Math.abs(destination - currentPosition);
  return Math.max(MINIMUM_LEG_DURATION_MS, Math.round((distance / speedPxPerSecond) * 1000));
}
