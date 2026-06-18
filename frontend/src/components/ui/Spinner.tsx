export default function Spinner() {
  return (
    <div className="relative h-14 w-14 sm:h-16 sm:w-16" role="status" aria-label="Loading">
      <div className="absolute inset-0 animate-pulse-ring rounded-full border border-fp-gold/25" />
      <div className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-t-fp-gold border-r-fp-rose" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-1.5 w-1.5 rounded-full bg-fp-gold shadow-[0_0_6px_rgba(212,168,83,0.8)]" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
