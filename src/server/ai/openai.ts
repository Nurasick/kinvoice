/**
 * Real OpenAI implementation. Owner: Olzhas.
 *
 * TODO(Olzhas): implement each method with the `openai` SDK:
 *   - structured JSON output, validated with Zod (`DraftEntry` from @/shared/domain)
 *   - timeout from getAiConfig().timeoutMs via AbortSignal
 *   - on any error/invalid output: return { fallback: true, ... } with salvaged fields; never throw
 * Until then it delegates to the mock so the app keeps working with a key set.
 */
import "server-only";
import { mockAi } from "./mock";
import type { AiService } from "./types";

export function createOpenAiService(): AiService {
  return mockAi;
}
