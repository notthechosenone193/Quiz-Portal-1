export const LoadingSpinner = () => (
  <div role="status" className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" aria-hidden="true"></div>
    <span className="sr-only">Loading…</span>
  </div>
);
