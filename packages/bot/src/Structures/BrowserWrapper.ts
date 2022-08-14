import { singleton } from 'tsyringe';
import * as puppeteer from 'puppeteer-core';

@singleton()
export default class BrowserWrapper {
  private browser?: puppeteer.Browser;

  private async createBrowser(): Promise<void> {
    if (this.browser) {
      return;
    }

    this.browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox',
      ],
    });
  }

  public async newPage(): Promise<puppeteer.Page> {
    await this.createBrowser();

    const page = await this.browser.newPage();
    setTimeout(() => {
      if (!page.isClosed()) {
        page.close();
      }
    }, 5000);
    
    return page;
  }
}
