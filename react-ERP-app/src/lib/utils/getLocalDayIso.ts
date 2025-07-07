export function getLocalStartOfDayIso(date: Date) {
  const localStart = new Date(date);
  localStart.setHours(0, 0, 0, 0);
  return localStart.toISOString();
}
