import { chromium, type Browser, type Page } from "playwright";

export class BrowserSession {
  private browser: Browser | null = null;
  private page: Page | null = null;
  async start() {
    this.browser = await chromium.launch({
      headless: false,
    });
    this.page = await this.browser.newPage();
  }
  async navigate(url: string) {
    if (!this.page) {
      throw new Error("Browser session has not been started");
    }
    await this.page.goto(url);
  }
  async close() {
    if (this.browser) {
      await this.browser.close();
    }
    this.browser = null;
    this.page = null;
  }
  getPage(): Page {
    if (!this.page) {
      throw new Error("Browser session has not been started");
    }
    return this.page;
  }
}
