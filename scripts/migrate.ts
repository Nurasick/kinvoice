/**
 * Applies SQL migrations in ./drizzle to DATABASE_URL. Owner: Nurali.
 * Runs before `next build` on Vercel (see the "build" script). Skips cleanly when
 * DATABASE_URL is empty, so local builds and CI keep working with the in-memory repo.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { enableLocalNeonProxy } from "../src/server/db/neon-local";

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.info("[migrate] DATABASE_URL not set, skipping migrations");
    return;
  }
  enableLocalNeonProxy();
  await migrate(drizzle({ client: neon(url) }), { migrationsFolder: "./drizzle" });
  console.info("[migrate] migrations applied");
}

main().catch((err: unknown) => {
  console.error("[migrate] failed", err);
  process.exit(1);
});
