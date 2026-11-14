/**
 * The only place that reads AI env vars. Owner: Olzhas. Server-only.
 */
import "server-only";

export interface AiConfig {
  apiKey: string | null;
  model: string;
  useMock: boolean;
  timeoutMs: number;
}

export function getAiConfig(): AiConfig {
  const apiKey = process.env.OPENAI_API_KEY?.trim() || null;
  return {
    apiKey,
    model: process.env.OPENAI_MODEL?.trim() || "gpt-5-mini",
    useMock: !apiKey || process.env.AI_MOCK === "1",
    timeoutMs: 12_000,
  };
}
