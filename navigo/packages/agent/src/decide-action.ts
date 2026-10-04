import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { client } from "./client.js";
import type { Action } from "@repo/browser";

export async function decideAction(
  messages: ChatCompletionMessageParam[],
): Promise<Action> {
  const response = await client.chat.completions.create({
    model: "gpt-6-luna",

    messages,

    response_format: {
      type: "json_schema",
      json_schema: {
        name: "browser_action",
        strict: true,

        schema: {
          type: "object",

          properties: {
            type: {
              type: "string",
              enum: ["click", "type", "press", "navigate", "done"],
            },
            index: {
              type: ["integer", "null"],
            },
            text: {
              type: ["string", "null"],
            },
            key: {
              type: ["string", "null"],
            },
            url: {
              type: ["string", "null"],
            },
            message: {
              type: ["string", "null"],
            },
          },

          required: ["type", "index", "text", "key", "url", "message"],

          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message.content;

  if (!content) {
    throw new Error("LLM returned an empty response");
  }

  const result = JSON.parse(content);

  switch (result.type) {
    case "click":
      return {
        type: "click",
        index: result.index,
      };

    case "type":
      return {
        type: "type",
        index: result.index,
        text: result.text,
      };

    case "press":
      return {
        type: "press",
        index: result.index,
        key: result.key,
      };

    case "navigate":
      return {
        type: "navigate",
        url: result.url,
      };

    case "done":
      return {
        type: "done",
        message: result.message,
      };

    default:
      throw new Error(`Unknown action type: ${result.type}`);
  }
}
