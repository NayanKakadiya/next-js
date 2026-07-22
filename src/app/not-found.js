import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/10 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
          404 Error
        </p>
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
          Page not found
        </h1>
        <p className="mb-8 text-base leading-7 text-slate-300 sm:text-lg">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-lg bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400"
          >
            Go back home
          </Link>
          <Link
            href="/product"
            className="rounded-lg border border-white/20 px-5 py-3 font-medium text-white transition hover:bg-white/10"
          >
            Explore products
          </Link>
        </div>
      </div>
    </main>
  );
}
