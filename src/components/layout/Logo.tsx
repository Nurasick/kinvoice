import Link from "next/link";
import { cn } from "@/components/ui";

/** The marigold magnet with a K. `tone="enamel"` sets the wordmark in white for the enamel band. */
export function Logo({ href = "/", tone = "paper" }: { href?: string; tone?: "paper" | "enamel" }) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5", tone === "enamel" ? "text-white" : "text-ink")}
    >
      <span
        aria-hidden
        className="grid size-8 place-items-center rounded-full bg-marigold font-display text-sm font-bold text-ink shadow-[0_5px_8px_-3px_rgb(8_18_48/0.45)]"
      >
        K
      </span>
      <span className="font-display text-lg font-bold">Kinvoice</span>
    </Link>
  );
}
