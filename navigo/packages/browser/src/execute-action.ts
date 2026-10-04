import type { Page } from "playwright";
import { INTERACTIVE_SELECTOR } from "@repo/dom";

interface ClickAction {
  type: "click";
  index: number;
}
interface TypeAction {
  type: "type";
  index: number;
  text: string;
}
interface NavigateAction {
  type: "navigate";
  url: string;
}
interface PressAction {
  type: "press";
  index: number;
  key: string;
}
interface DoneAction {
  type: "done";
  message: string;
}
export type Action =
  DoneAction | PressAction | ClickAction | TypeAction | NavigateAction;

async function executeAction(page: Page, action: Action): Promise<void> {
  const Elements = page.locator(INTERACTIVE_SELECTOR);
  switch (action.type) {
    case "click": {
      const element = Elements.nth(action.index);
      await element.click();
      break;
    }
    case "type": {
      const element = Elements.nth(action.index);
      await element.fill(action.text);
      break;
    }
    case "navigate": {
      await page.goto(action.url);
      break;
    }
    case "press": {
      const element = Elements.nth(action.index);
      await element.press(action.key);
      break;
    }
  }
}
