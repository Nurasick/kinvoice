import { describe, expect, it } from "vitest";
import { paypalLink, venmoLink } from "./links";

describe("payment links", () => {
  it("prefills Venmo recipient, amount and note, dropping a leading @", () => {
    const url = new URL(venmoLink("@sarah-k", 21840, "Mom's care, November"));
    expect(url.origin).toBe("https://venmo.com");
    expect(url.searchParams.get("txn")).toBe("pay");
    expect(url.searchParams.get("recipients")).toBe("sarah-k");
    expect(url.searchParams.get("amount")).toBe("218.40");
    expect(url.searchParams.get("note")).toBe("Mom's care, November");
  });

  it("builds a PayPal.Me link with the amount in USD", () => {
    expect(paypalLink("sarahk", 33839)).toBe("https://www.paypal.me/sarahk/338.39USD");
  });

  it("encodes odd PayPal names safely", () => {
    expect(paypalLink("a b/c", 100)).toBe("https://www.paypal.me/a%20b%2Fc/1.00USD");
  });
});
