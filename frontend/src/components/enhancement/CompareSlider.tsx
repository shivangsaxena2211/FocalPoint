import { useCallback, useRef, useState } from "react";

interface CompareSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function CompareSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
}: CompareSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  }, []);

  const onPointerDown = (event: React.PointerEvent) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePosition(event.clientX);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragging.current) return;
    updatePosition(event.clientX);
  };

  const onPointerUp = (event: React.PointerEvent) => {
    dragging.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div className="dashboard-panel overflow-hidden p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="fp-label-muted">Before & After Comparison</p>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider">
          <span className="text-fp-mid">{beforeLabel}</span>
          <span className="text-fp-gold">↔</span>
          <span className="text-fp-gold-lt">{afterLabel}</span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl border border-white/10 bg-black/40"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <img src={beforeSrc} alt="Original image" className="absolute inset-0 h-full w-full object-contain" draggable={false} />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        >
          <img src={afterSrc} alt="Enhanced result" className="h-full w-full object-contain" draggable={false} />
        </div>

        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${position}%` }}>
          <div className="relative h-full -translate-x-1/2">
            <div className="absolute inset-y-0 w-0.5 bg-gradient-to-b from-fp-gold via-fp-rose to-fp-violet shadow-[0_0_12px_rgba(212,168,83,0.6)]" />
            <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-fp-gold-lt backdrop-blur-md">
              ↔
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-fp-mid">
          {beforeLabel}
        </div>
        <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-fp-gold/20 bg-black/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-fp-gold-lt">
          {afterLabel}
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="compare-slider mt-4 w-full"
        aria-label="Compare before and after enhancement"
      />
      <p className="mt-2 text-center text-xs text-fp-mid">
        Drag the slider to reveal the CodeFormer enhanced image
      </p>
    </div>
  );
}
