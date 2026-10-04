import { client } from "./client";
import type { ExtractedDOM } from "../../dom/src/extract-dom";
import type { Action } from "../../browser/src/execute-action";
import { SYSTEM_PROMPT } from "./systemPrompt";

export async function decideAction(
  goal: string,
  dom: ExtractedDOM,
): Promise<Action> {
  const response = await client.chat.completions.create({
    model: "gpt-6-luna",

    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `USER GOAL:
${goal}

CURRENT PAGE:
${JSON.stringify(dom)}`,
      },
    ],

    response_format: {
      type: "json_schema",
      json_schema: {
        name: "browser_action",
        strict: true,

        schema: {
          oneOf: [
            {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  const: "click",
                },
                index: {
                  type: "integer",
                },
              },
              required: ["type", "index"],
              additionalProperties: false,
            },

            {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  const: "type",
                },
                index: {
                  type: "integer",
                },
                text: {
                  type: "string",
                },
              },
              required: ["type", "index", "text"],
              additionalProperties: false,
            },

            {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  const: "press",
                },
                index: {
                  type: "integer",
                },
                key: {
                  type: "string",
                },
              },
              required: ["type", "index", "key"],
              additionalProperties: false,
            },

            {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  const: "navigate",
                },
                url: {
                  type: "string",
                },
              },
              required: ["type", "url"],
              additionalProperties: false,
            },

            {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  const: "done",
                },
                message: {
                  type: "string",
                },
              },
              required: ["type", "message"],
              additionalProperties: false,
            },
          ],
        },
      },
    },
  });

  const content = response.choices[0]?.message.content;

  if (!content) {
    throw new Error("LLM returned an empty response");
  }

  return JSON.parse(content) as Action;
}
