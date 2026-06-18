interface StatusBadgeProps {
  isAi: boolean;
  compact?: boolean;
}

export default function StatusBadge({ isAi, compact }: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full font-mono font-bold uppercase tracking-widest ring-1",
        compact ? "px-2 py-0.5 text-[9px]" : "px-3 py-1 text-xs",
        isAi ? "fp-bg-threat ring-fp-rose/40" : "fp-bg-verified ring-fp-gold/40",
      ].join(" ")}
    >
      <span
        className={[
          "rounded-full",
          compact ? "h-1.5 w-1.5" : "h-2 w-2",
          isAi
            ? "animate-pulse bg-fp-rose shadow-[0_0_8px_rgba(224,98,122,0.8)]"
            : "bg-fp-gold shadow-[0_0_8px_rgba(212,168,83,0.8)]",
        ].join(" ")}
      />
      {isAi ? "Threat Detected" : "Verified Authentic"}
    </span>
  );
}
