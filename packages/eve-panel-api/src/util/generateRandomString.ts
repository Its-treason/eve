export default function generateRandomString(): string {
  let randomString = '';

  for (let i = 0; i < 64; i++) {
    randomString += String.fromCharCode(65 + Math.floor(Math.random() * 25));
  }

  return randomString;
}
