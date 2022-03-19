import { singleton } from 'tsyringe';
import puppeteer, { Browser, Page } from 'puppeteer';

@singleton()
export default class BrowserWrapper {
  private browser?: Browser;

  private async createBrowser(): Promise<void> {
    if (this.browser) {
      return;
    }

    this.browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium',
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox',
      ],
    });
  }

  public async newPage(): Promise<Page> {
    await this.createBrowser();

    return await this.browser.newPage();
  }
}
