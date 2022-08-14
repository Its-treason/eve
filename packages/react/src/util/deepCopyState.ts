export default function deepCopyState<T>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}
