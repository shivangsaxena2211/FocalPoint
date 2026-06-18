import type { AppError } from "../../types";

const ERROR_META: Record<
  AppError["code"],
  { title: string; icon: "file" | "type" | "size" | "server" | "network" }
> = {
  NO_FILE: { title: "No File Selected", icon: "file" },
  UNSUPPORTED_TYPE: { title: "Unsupported File Type", icon: "type" },
  FILE_TOO_LARGE: { title: "File Too Large", icon: "size" },
  SERVER_ERROR: { title: "Server Error", icon: "server" },
  NETWORK_ERROR: { title: "Connection Failed", icon: "network" },
  UNKNOWN: { title: "Unexpected Error", icon: "server" },
};

interface ErrorAlertProps {
  error: AppError;
  onDismiss?: () => void;
}

function ErrorIcon({ type }: { type: (typeof ERROR_META)[AppError["code"]]["icon"] }) {
  const paths: Record<typeof type, string> = {
    file: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    type: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    size: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4",
    server: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    network: "M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M8.464 8.464a5 5 0 000 7.072M15.536 8.464a5 5 0 010 7.072M12 12h.01",
  };

  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[type]} />
    </svg>
  );
}

export default function ErrorAlert({ error, onDismiss }: ErrorAlertProps) {
  const meta = ERROR_META[error.code];

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 ring-1 ring-red-500/20"
    >
      <div className="mt-0.5 text-red-400">
        <ErrorIcon type={meta.icon} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-red-500/20 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-red-300">
            {error.code.replace(/_/g, " ")}
          </span>
          <p className="text-sm font-semibold text-red-200">{meta.title}</p>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-red-300/90">{error.message}</p>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded p-1 text-red-400 transition hover:bg-red-500/20 hover:text-red-200"
          aria-label="Dismiss error"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
