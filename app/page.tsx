export default function HomePage() {
  return (
    <main className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent-soft)_0%,_transparent_55%),linear-gradient(180deg,_var(--background)_0%,_var(--surface)_100%)]"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-24">
        <p className="mb-4 font-mono text-sm tracking-[0.2em] text-accent uppercase">
          2.0.0
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-7xl">
          nextjs-stock
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted">
          Live quotes and charts. Scaffold for the 2.0 rewrite — market data and
          UI land in following PRs.
        </p>
        <p className="mt-10 font-mono text-xs text-muted">
          Next.js 16 · TypeScript · Node 24 · Tailwind CSS 4
        </p>
      </div>
    </main>
  );
}
