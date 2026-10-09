export const isDevelopmentPreview = process.env.NODE_ENV !== 'production';

export function TestPropertyBadge({ className = '' }: { className?: string }) {
  if (!isDevelopmentPreview) return null;

  return (
    <span className={`inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-amber-900 ring-1 ring-inset ring-amber-300 ${className}`}>
      Test property
    </span>
  );
}

export function TestPropertyNotice({ className = '' }: { className?: string }) {
  if (!isDevelopmentPreview) return null;

  return (
    <div
      role="note"
      className={`rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 ${className}`}
    >
      <strong>Development preview:</strong> These are test listings for development and are not confirmed by real property offers.
    </div>
  );
}
