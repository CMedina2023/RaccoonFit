/**
 * Stable weekly seed for workout selection. It changes only when the calendar
 * week changes, while preserving deterministic results within the same day.
 */
export function getWeeklyRotationSeed(date: Date, dayIndex: number): number {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const mondayOffset = (local.getDay() + 6) % 7;
  local.setDate(local.getDate() - mondayOffset);
  const firstMonday = new Date(local.getFullYear(), 0, 4);
  firstMonday.setDate(firstMonday.getDate() - ((firstMonday.getDay() + 6) % 7));
  const weekIndex = Math.floor((local.getTime() - firstMonday.getTime()) / 604800000);

  // The weekly increment must be one position in each pool, not a multiple of
  // the number of weekdays (which would repeat pools of seven exercises).
  return local.getFullYear() * 53 + weekIndex + dayIndex * 11;
}
