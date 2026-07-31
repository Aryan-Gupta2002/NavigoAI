import { launchBrowser } from "./index";

async function main() {
  const { browser, page } = await launchBrowser();

  await page.goto("https://example.com");
  await page.screenshot({ path: "example.png" });

  await browser.close();
}

main();
