import type { Page } from "playwright";
import { INTERACTIVE_SELECTOR } from "./constants.js";

interface ExtractedElement {
  index: number;
  tag: string;
  text: string;
  value: string | null;
  href: string | null;
  type: string | null;
  placeholder: string | null;
  ariaLabel: string | null;
}
export interface ExtractedDOM {
  title: string;
  elements: ExtractedElement[];
}

export async function extractDOM(page: Page): Promise<ExtractedDOM> {
  const extractedDOM = await page.evaluate((selector) => {
    const title = document.title;

    // Must mirror Playwright's own visibility rule (non-empty box, not
    // visibility:hidden) so that the indices we hand the model line up with
    // the ones executeAction resolves via locator.filter({ visible: true }).
    const domElements = Array.from(
      document.querySelectorAll(selector),
    ).filter(
      (element) =>
        element.getClientRects().length > 0 &&
        getComputedStyle(element).visibility !== "hidden",
    );

    const elements = domElements.map<ExtractedElement>((element, index) => {
      return {
        index,
        tag: element.tagName.toLowerCase(),
        text:
          element.textContent == null
            ? ""
            : element.textContent.trim().replace(/\s+/g, " "),
        // textContent is always "" for input/textarea; typed text lives in .value.
        value: "value" in element ? String(element.value) : null,
        href: element.getAttribute("href"),
        type: element.getAttribute("type"),
        placeholder: element.getAttribute("placeholder"),
        ariaLabel: element.getAttribute("aria-label"),
      };
    });

    return { title, elements };
  }, INTERACTIVE_SELECTOR);

  return extractedDOM;
}