/**
 * Repository selection. Owner: Nurali.
 * TODO(Nurali): return the Postgres repository when DATABASE_URL is set.
 */
import "server-only";
import { memoryRepository } from "./memory";
import type { Repository } from "./types";

export function getRepository(): Repository {
  return memoryRepository;
}

export type { Repository } from "./types";
