export default function createDateInPast(ms: number): Date {
  const date =  new Date(Date.now() - ms);
  date.setHours(0, 0, 0, 0);
  return date;
}
