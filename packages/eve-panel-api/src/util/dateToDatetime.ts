export default function dateToDatetime(date?: Date): string {
  return (date || new Date()).toISOString().slice(0, 19).replace('T', ' ');
}
