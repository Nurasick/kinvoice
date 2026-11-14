/**
 * Repository selection. Owner: Nurali.
 * DATABASE_URL set → Postgres (Neon). Empty → in-memory (local dev and tests; resets on restart).
 */
import "server-only";
import { memoryRepository } from "./memory";
import { createPostgresRepository } from "./postgres";
import type { Repository } from "./types";

let cached: Repository | null = null;

export function getRepository(): Repository {
  if (cached) return cached;
  const url = process.env.DATABASE_URL?.trim();
  cached = url ? createPostgresRepository(url) : memoryRepository;
  return cached;
}

export type { Repository } from "./types";
