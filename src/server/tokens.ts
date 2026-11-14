/**
 * Unguessable tokens for the no-login model. Owner: Nurali.
 * 24 random bytes → 32-char base64url (192 bits of entropy).
 */
import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";

export function newSecretToken(): string {
  return randomBytes(24).toString("base64url");
}

export function newId(): string {
  return randomUUID();
}

/** Edit keys are stored hashed, so a DB leak doesn't hand out edit access. */
export function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}
