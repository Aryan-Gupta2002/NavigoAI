import type { Page } from "playwright";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { extractDOM } from "@repo/dom";
import { executeAction } from "@repo/browser";
import { decideAction } from "./decide-action.js";
import { SYSTEM_PROMPT } from "./systemPrompt.js";

const MAX_STEPS = 20;

function describeError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.split("\n")[0] ?? "";
}

export async function runAgent(page: Page, goal: string): Promise<void> {
  // The conversation is accumulated across steps so the model can see what it
  // has already done. Without this every step looks like a fresh start.
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `USER GOAL:\n${goal}` },
  ];

  for (let step = 0; step < MAX_STEPS; step++) {
    console.log(`\n--- Step ${step + 1} ---`);

    const dom = await extractDOM(page);

    messages.push({
      role: "user",
      content: `CURRENT PAGE:\n${JSON.stringify(dom)}`,
    });

    const action = await decideAction(messages);

    console.log("Action:", action);

    if (action.type === "done") {
      console.log("Agent:", action.message);
      return;
    }

    messages.push({ role: "assistant", content: JSON.stringify(action) });

    try {
      await executeAction(page, action);
    } catch (error) {
      console.error("Action failed:", describeError(error));

      messages.push({
        role: "user",
        content: `The previous action failed: ${describeError(error)}. Choose a different action.`,
      });

      continue;
    }

    await page.waitForTimeout(2000);
  }

  throw new Error(`Agent exceeded maximum steps (${MAX_STEPS}).`);
}