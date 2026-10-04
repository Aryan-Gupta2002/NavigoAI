import { BrowserSession } from "@repo/browser";
import { runAgent } from "./run-agent.js";

async function main(): Promise<void> {
  const goal = process.argv.slice(2).join(" ");

  if (!goal) {
    throw new Error("Please provide a goal.");
  }

  const session = new BrowserSession();

  try {
    await session.start();

    const page = session.getPage();

    await runAgent(page, goal);
  } finally {
    await session.close();
  }
}

main().catch((error) => {
  console.error("Agent failed:", error);
  process.exit(1);
});
