import type { Page } from "playwright";

interface ExtractedElement {
  index: number;
  tag: string;
  text: string;
  href: string | null;
  type: string | null;
  placeholder: string | null;
  ariaLabel: string | null;
}
interface ExtractedDOM {
  title: string;
  elements: ExtractedElement[];
}

export async function extractDOM(page: Page): Promise<ExtractedDOM> {
  const extractedDOM = await page.evaluate(() => {
    const title = document.title;
    const domElements = Array.from(
      document.querySelectorAll("a,button,input,textarea,select"),
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
  });
  return extractedDOM;
}
