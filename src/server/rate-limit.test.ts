import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  const rule = { limit: 2, windowMs: 60_000 };

  it("allows up to the limit, then blocks with a retry-after until the window resets", () => {
    const check = createRateLimiter();
    expect(check("ip", rule, 0).isAllowed).toBe(true);
    expect(check("ip", rule, 1_000).isAllowed).toBe(true);
    expect(check("ip", rule, 2_000)).toEqual({ isAllowed: false, retryAfterSeconds: 58 });
    expect(check("ip", rule, 60_000).isAllowed).toBe(true);
  });

  it("tracks keys independently", () => {
    const check = createRateLimiter();
    check("a", rule, 0);
    check("a", rule, 0);
    expect(check("a", rule, 0).isAllowed).toBe(false);
    expect(check("b", rule, 0).isAllowed).toBe(true);
  });
});
