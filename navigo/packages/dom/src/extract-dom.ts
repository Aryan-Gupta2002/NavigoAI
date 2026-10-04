import type { Page } from "playwright";
import { INTERACTIVE_SELECTOR } from "./constants.js";

interface ExtractedElement {
  index: number;
  tag: string;
  text: string;
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
    const domElements = Array.from(
      document.querySelectorAll(selector),
    );
    const elements = domElements.map<ExtractedElement>((element, index) => {
      return {
        index,
        tag: element.tagName.toLowerCase(),
        text:
          element.textContent == null
            ? ""
            : element.textContent.trim().replace(/\s+/g, " "),
        href: element.getAttribute("href"),
        type: element.getAttribute("type"),
        placeholder: element.getAttribute("placeholder"),
        ariaLabel: element.getAttribute("aria-label"),
      };
    });
    return { title, elements };
  },INTERACTIVE_SELECTOR);
  return extractedDOM;
}
