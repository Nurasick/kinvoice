/**
 * Test-only switch: point Neon's HTTP driver at a local proxy in front of a throwaway Postgres.
 * Owner: Nurali.
 *
 * Active only when NEON_LOCAL_PROXY is set (CI's postgres-contract job), so production and normal
 * local runs never change. Lets the repository contract tests run against real Postgres through
 * the exact driver production uses, without touching a Neon project.
 */
import { neonConfig } from "@neondatabase/serverless";

export function enableLocalNeonProxy(): boolean {
  const endpoint = process.env.NEON_LOCAL_PROXY?.trim();
  if (!endpoint) return false;
  neonConfig.fetchEndpoint = () => endpoint;
  return true;
}
