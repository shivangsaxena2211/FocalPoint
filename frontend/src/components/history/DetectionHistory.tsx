import { formatFileSize, formatShortTime } from "../../lib/utils/format";
import type { DetectionRecord } from "../../types";

interface DetectionHistoryProps {
  history: DetectionRecord[];
  onClear: () => void;
  onRemove: (id: string) => void;
  aiCount: number;
  realCount: number;
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function DetectionHistory({
  history,
  onClear,
  onRemove,
  aiCount,
  realCount,
  collapsed,
  onToggle,
}: DetectionHistoryProps) {
  return (
    <aside className="dashboard-panel flex h-full flex-col overflow-hidden">
      <div className="panel-header flex items-center justify-between px-4 py-3">
        <div>
          <p className="fp-label-muted">Detection History</p>
          <p className="text-xs text-fp-mid">{history.length} scans recorded</p>
        </div>
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="fp-btn-ghost rounded-full px-2 py-1 font-mono text-[10px] uppercase lg:hidden"
          >
            {collapsed ? "Show" : "Hide"}
          </button>
        )}
      </div>

      <div className={`${collapsed ? "hidden" : "block"} lg:block`}>
        <div className="grid grid-cols-2 gap-px border-b border-white/6 bg-white/3">
          <HistoryStat label="AI Detected" value={aiCount} threat />
          <HistoryStat label="Authentic" value={realCount} verified />
        </div>

        <div className="max-h-64 flex-1 overflow-y-auto lg:max-h-[420px]">
          {history.length === 0 ? (
            <p className="px-4 py-8 text-center text-xs text-fp-mid">No scans yet. Run your first analysis.</p>
          ) : (
            <ul className="divide-y divide-white/6">
              {history.map((item) => {
                const isAi = item.result.prediction.toLowerCase().includes("ai");
                return (
                  <li key={item.id} className="group px-4 py-3 transition hover:bg-white/3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-fp-white">{item.file.name}</p>
                        <p className="mt-1 font-mono text-[10px] text-fp-mid">
                          {formatShortTime(item.timestamp)} · {formatFileSize(item.file.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="text-fp-mid opacity-0 transition group-hover:opacity-100 hover:text-fp-rose"
                        aria-label="Remove from history"
                      >
                        ×
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className={[
                          "font-mono text-[10px] font-semibold uppercase",
                          isAi ? "fp-text-threat" : "fp-text-verified",
                        ].join(" ")}
                      >
                        {item.result.prediction}
                      </span>
                      <span className="font-mono text-[10px] text-fp-mid">{item.result.confidence}%</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {history.length > 0 && (
          <div className="border-t border-white/6 p-3">
            <button
              type="button"
              onClick={onClear}
              className="fp-btn-ghost w-full rounded-xl px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-fp-rose hover:border-fp-rose/30 hover:bg-fp-rose/10"
            >
              Clear History
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

function HistoryStat({
  label,
  value,
  threat,
  verified,
}: {
  label: string;
  value: number;
  threat?: boolean;
  verified?: boolean;
}) {
  return (
    <div className="bg-black/25 px-3 py-2 text-center">
      <p className="font-mono text-[9px] uppercase tracking-wider text-fp-mid">{label}</p>
      <p
        className={[
          "mt-0.5 font-mono text-sm font-bold",
          threat ? "fp-text-threat" : verified ? "fp-text-verified" : "",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}
