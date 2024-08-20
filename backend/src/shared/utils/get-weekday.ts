export function getWeekday(date: Date): string {
  const days = ["sun", "mon", "tue", "wed", "thur", "fri", "sat"]
  return days[date.getDay()]
}
