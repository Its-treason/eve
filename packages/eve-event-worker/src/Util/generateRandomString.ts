export default function generateRandomString(length = 64): string {
  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += String.fromCharCode(65 + Math.floor(Math.random() * 25));
  }

  return randomString;
}
