import puppeteer, {Browser} from 'puppeteer';

export default async (): Promise<Browser> => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-sandbox',
    ],
  });
  return browser;
};
