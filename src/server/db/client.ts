/**
 * Drizzle client over Neon's HTTP driver (stateless; fits serverless). Owner: Nurali.
 */
import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export type Db = NeonHttpDatabase<typeof schema>;

let cached: Db | null = null;

export function getDb(databaseUrl: string): Db {
  cached ??= drizzle({ client: neon(databaseUrl), schema });
  return cached;
}
