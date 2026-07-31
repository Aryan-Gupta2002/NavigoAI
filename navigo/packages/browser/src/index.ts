import { chromium } from "playwright";

export async function launchBrowser() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  return { browser, page };
}
