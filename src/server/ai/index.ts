/**
 * AI service entry point. Owner: Olzhas.
 * Routes call getAiService(); it picks mock vs OpenAI from env.
 */
import "server-only";
import { getAiConfig } from "./config";
import { mockAi } from "./mock";
import { createOpenAiService } from "./openai";
import type { AiService } from "./types";

export function getAiService(): AiService {
  return getAiConfig().useMock ? mockAi : createOpenAiService();
}

export type { AiService } from "./types";
