/**
 * Fixed-window rate limiter. Owner: Nurali.
 * In-memory per server instance: best-effort abuse protection for the AI budget,
 * not a security boundary. Pure apart from the Map it is given, so it is unit-testable.
 */

export interface RateLimitRule {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  isAllowed: boolean;
  retryAfterSeconds: number;
}

interface Window {
  startedAt: number;
  count: number;
}

const MAX_TRACKED_KEYS = 10_000;

export function createRateLimiter(store: Map<string, Window> = new Map()) {
  return function check(key: string, rule: RateLimitRule, now: number = Date.now()): RateLimitResult {
    const current = store.get(key);
    if (!current || now - current.startedAt >= rule.windowMs) {
      if (store.size >= MAX_TRACKED_KEYS) store.clear(); // crude memory cap
      store.set(key, { startedAt: now, count: 1 });
      return { isAllowed: true, retryAfterSeconds: 0 };
    }
    if (current.count >= rule.limit) {
      const retryAfterSeconds = Math.ceil((current.startedAt + rule.windowMs - now) / 1000);
      return { isAllowed: false, retryAfterSeconds };
    }
    store.set(key, { ...current, count: current.count + 1 });
    return { isAllowed: true, retryAfterSeconds: 0 };
  };
}

/** Per-IP limits for the expensive or spammable endpoints. */
export const RATE_LIMITS: ReadonlyArray<{ prefix: string; rule: RateLimitRule }> = [
  { prefix: "/api/ai/", rule: { limit: 30, windowMs: 60_000 } },
  { prefix: "/api/demo", rule: { limit: 60, windowMs: 60_000 } },
  { prefix: "/api/workspaces", rule: { limit: 10, windowMs: 60_000 } },
];
