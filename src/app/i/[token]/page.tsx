// Owner: Yernur. Public sibling view — no key, no login.
// TODO(Yernur): fetch publicApi.getInvoice(token); message, breakdown, pay buttons, "I've sent it".
export default async function PublicInvoicePage({ params }: PageProps<"/i/[token]">) {
  const { token } = await params;
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold">Care invoice</h1>
      <p className="mt-2 font-mono text-xs opacity-60">token: {token.slice(0, 6)}…</p>
    </main>
  );
}
