/**
 * Dev-only indicator that shows the active Tailwind breakpoint in the top-left
 * corner. Returns null in production so it never ships to users.
 */
export function BreakpointIndicator() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div
      aria-hidden
      className="fixed left-2 top-2 z-50 flex h-6 select-none items-center gap-1 rounded-md bg-slate-900/90 px-2 font-mono text-xs font-bold text-white shadow-lg ring-1 ring-slate-600 backdrop-blur"
    >
      <span className="text-slate-400">bp:</span>
      <span className="sm:hidden">xs</span>
      <span className="hidden sm:inline md:hidden">sm</span>
      <span className="hidden md:inline lg:hidden">md</span>
      <span className="hidden lg:inline xl:hidden">lg</span>
      <span className="hidden xl:inline 2xl:hidden">xl</span>
      <span className="hidden 2xl:inline">2xl</span>
    </div>
  );
}
