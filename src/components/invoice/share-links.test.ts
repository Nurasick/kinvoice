import { describe, expect, it } from "vitest";
import { personalLink, shareLinks, type ShareInput } from "./share-links";

const base: ShareInput = {
  origin: "https://kinvoice.test",
  token: "tok_123",
  memberId: "m-mike",
  siblingName: "Mike",
  caregiverName: "Sarah",
  parentName: "Mom (Linda)",
  monthName: "November 2026",
  amountCents: 21840,
  email: "mike@example.com",
};

describe("share links", () => {
  it("builds a personal link that opens on the sibling", () => {
    expect(personalLink(base.origin, base.token, base.memberId)).toBe(
      "https://kinvoice.test/i/tok_123?for=m-mike",
    );
  });

  it("writes a short message with the amount and never says owe", () => {
    const { message, url } = shareLinks(base);
    expect(message).toContain("Hi Mike, here's Mom's care for November 2026.");
    expect(message).toContain("Your suggested contribution is $218.40.");
    expect(message.endsWith(url)).toBe(true);
    expect(message.toLowerCase()).not.toContain("owe");
  });

  it("thanks a sibling who already covered their share", () => {
    expect(shareLinks({ ...base, amountCents: 0 }).message).toContain("already covered your share");
  });

  it("encodes the message for Messages, WhatsApp and email", () => {
    const links = shareLinks(base);
    expect(links.sms.startsWith("sms:?&body=Hi%20Mike")).toBe(true);
    expect(links.whatsapp.startsWith("https://wa.me/?text=Hi%20Mike")).toBe(true);
    expect(links.email).toContain(
      "mailto:mike%40example.com?subject=Mom's%20care%2C%20November%202026&body=",
    );
    expect(decodeURIComponent(links.whatsapp.split("text=")[1])).toBe(links.message);
  });

  it("leaves the email recipient empty when unknown", () => {
    expect(shareLinks({ ...base, email: undefined }).email.startsWith("mailto:?subject=")).toBe(true);
  });
});
