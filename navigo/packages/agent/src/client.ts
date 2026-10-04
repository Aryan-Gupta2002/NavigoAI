import OpenAI from "openai";
export const client = new OpenAI({
  apiKey: process.env.EXPERIENTIAL_LAB_API_KEY,
  baseURL: process.env.EXPERIENTIAL_LAB_BASE_URL,
});

