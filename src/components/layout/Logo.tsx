import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-ink">
      <span aria-hidden className="grid size-7 place-items-center rounded-lg bg-accent font-display text-sm text-accent-ink">
        K
      </span>
      <span className="font-display text-xl font-medium tracking-tight">Kinvoice</span>
    </Link>
  );
}
