export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-600" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-lg font-semibold text-slate-900">Loading...</p>
          <p className="text-sm text-slate-500">Please wait while we fetch your content.</p>
        </div>
      </div>
    </div>
  );
}
