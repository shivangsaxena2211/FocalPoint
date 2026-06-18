import DropZone from "../detection/DropZone";
import ImagePreview from "../detection/ImagePreview";
import FileDetails from "../detection/FileDetails";
import ResultCard from "../detection/ResultCard";
import UploadButton from "../ui/UploadButton";
import Spinner from "../ui/Spinner";
import ErrorAlert from "../ui/ErrorAlert";
import type { AnalysisReport, AppError, FileMetadata } from "../../types";
import type { RefObject } from "react";

interface AnalysisWorkspaceProps {
  previewUrl: string | null;
  metadata: FileMetadata | null;
  report: AnalysisReport | null;
  loading: boolean;
  error: AppError | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileSelect: (file: File | null) => void;
  onBrowseClick: () => void;
  onDetect: () => void;
  onClear: () => void;
  onDismissError: () => void;
}

export default function AnalysisWorkspace({
  previewUrl,
  metadata,
  report,
  loading,
  error,
  fileInputRef,
  onFileSelect,
  onBrowseClick,
  onDetect,
  onClear,
  onDismissError,
}: AnalysisWorkspaceProps) {
  const fileStatus = loading ? "scanning" : report ? "complete" : "ready";

  return (
    <section className="flex flex-col gap-4 sm:gap-5">
      {!previewUrl && (
        <DropZone
          onFileSelect={onFileSelect}
          onBrowseClick={onBrowseClick}
          disabled={loading}
          fileInputRef={fileInputRef}
        />
      )}

      {error && <ErrorAlert error={error} onDismiss={onDismissError} />}

      {previewUrl && metadata && (
        <>
          <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fp-gold/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-fp-gold" />
              </span>
              <p className="fp-label-muted">Active Scan</p>
            </div>
            <button
              type="button"
              onClick={onClear}
              disabled={loading}
              className="fp-btn-ghost rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-50"
            >
              New Scan
            </button>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <ImagePreview src={previewUrl} fileName={metadata.name} loading={loading} />
            <FileDetails metadata={metadata} status={fileStatus} />
          </div>

          <UploadButton onClick={onDetect} loading={loading} />

          {loading && (
            <div
              className="dashboard-panel flex flex-col items-center gap-4 px-6 py-10"
              role="status"
              aria-live="polite"
            >
              <Spinner />
              <div className="text-center">
                <p className="fp-label text-sm">Scanning Target</p>
                <p className="mt-1 text-xs text-fp-mid">Running deepfake detection pipeline...</p>
              </div>
              <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-fp-gold to-fp-rose" />
              </div>
            </div>
          )}

          {!loading && report && <ResultCard report={report} />}

          {!loading && !report && !error && (
            <div className="dashboard-panel flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fp-violet/15 text-xl text-fp-violet">
                ◎
              </div>
              <div>
                <p className="fp-label-muted">Awaiting Analysis</p>
                <p className="mt-2 text-sm text-fp-mid">Initiate scan to classify the uploaded image</p>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
