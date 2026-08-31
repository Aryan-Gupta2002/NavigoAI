type Evaluate = <T>(fn: () => T) => Promise<T>;

export type InteractiveElement = {
  id: number;
  tag: string;
  text: string;
};

export async function extractDom(
  evaluate: Evaluate
): Promise<InteractiveElement[]> {
  return evaluate(() => {
    let id = 1;

    return Array.from(
      document.querySelectorAll<
        HTMLAnchorElement | HTMLButtonElement | HTMLInputElement
      >("a, button, input, select, textarea")
    ).map((element) => ({
      id: id++,
      tag: element.tagName.toLowerCase(),
      text: (element.textContent ?? "").trim(),
    }));
  });
}