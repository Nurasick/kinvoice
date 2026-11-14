import { BalanceQuery } from "@/shared/api";
import { handle, ok, parseQuery, requireWorkspace } from "@/server/http";
import { getMonthlyBalance } from "@/server/services";

/** GET /api/balance?month=YYYY-MM → MonthlyBalance */
export const GET = handle(async (req: Request) => {
  const view = await requireWorkspace(req);
  const { month } = parseQuery(req, BalanceQuery);
  return ok(await getMonthlyBalance(view, month));
});
