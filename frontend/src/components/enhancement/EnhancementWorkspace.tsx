import DropZone from "../detection/DropZone";
import CompareSlider from "./CompareSlider";
import UploadButton from "../ui/UploadButton";
import Spinner from "../ui/Spinner";
import ErrorAlert from "../ui/ErrorAlert";
import type { AppError, FileMetadata } from "../../types";
import type { RefObject } from "react";

interface EnhancementWorkspaceProps {
  beforeUrl: string | null;
  afterUrl: string | null;
  metadata: FileMetadata | null;
  loading: boolean;
  error: AppError | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileSelect: (file: File | null) => void;
  onBrowseClick: () => void;
  onEnhance: () => void;
  onClear: () => void;
  onDismissError: () => void;
  onDownload: () => void;
}

export default function EnhancementWorkspace({
  beforeUrl,
  afterUrl,
  metadata,
  loading,
  error,
  fileInputRef,
  onFileSelect,
  onBrowseClick,
  onEnhance,
  onClear,
  onDismissError,
  onDownload,
}: EnhancementWorkspaceProps) {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-4 sm:gap-5">
      {!beforeUrl && (
        <>
          <div className="dashboard-panel px-4 py-5 text-center sm:px-6">
            <p className="fp-label">Image Enhancement</p>
            <h2 className="fp-display mt-2 text-2xl font-bold text-fp-white sm:text-3xl">
              Restore faces with CodeFormer
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-fp-mid">
              Upload a portrait or AI-generated face. Our backend runs the{" "}
              <span className="text-fp-gold-lt">sczhou/CodeFormer</span> model on Hugging Face to
              enhance details, color, and clarity.
            </p>
          </div>
          <DropZone
            onFileSelect={onFileSelect}
            onBrowseClick={onBrowseClick}
            disabled={loading}
            fileInputRef={fileInputRef}
          />
        </>
      )}

      {error && <ErrorAlert error={error} onDismiss={onDismissError} />}

      {beforeUrl && metadata && (
        <>
          <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-3">
            <div>
              <p className="fp-label-muted">Selected Image</p>
              <p className="truncate text-sm text-fp-white">{metadata.name}</p>
            </div>
            <button
              type="button"
              onClick={onClear}
              disabled={loading}
              className="fp-btn-ghost rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-50"
            >
              New Image
            </button>
          </div>

          {!afterUrl && !loading && (
            <>
              <div className="dashboard-panel overflow-hidden">
                <div className="panel-header px-4 py-3">
                  <p className="fp-label-muted">Original Preview</p>
                </div>
                <div className="flex items-center justify-center bg-black/40 p-4">
                  <img src={beforeUrl} alt="Original" className="max-h-96 w-full rounded-xl object-contain" />
                </div>
              </div>
              <UploadButton onClick={onEnhance} loading={loading} label="Enhance Image" loadingLabel="Enhancing..." />
            </>
          )}

          {loading && (
            <div className="dashboard-panel flex flex-col items-center gap-4 px-6 py-12" role="status">
              <Spinner />
              <div className="text-center">
                <p className="fp-label text-sm">Enhancing with CodeFormer</p>
                <p className="mt-1 text-xs text-fp-mid">
                  Running sczhou/CodeFormer on Hugging Face — this may take up to a minute.
                </p>
              </div>
            </div>
          )}

          {afterUrl && !loading && (
            <>
              <CompareSlider beforeSrc={beforeUrl} afterSrc={afterUrl} />
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={onDownload}
                  className="fp-btn-gradient rounded-2xl px-4 py-3 font-mono text-xs uppercase tracking-widest sm:text-sm"
                >
                  Download Enhanced Image
                </button>
                <button
                  type="button"
                  onClick={onEnhance}
                  className="fp-btn-ghost rounded-2xl px-4 py-3 font-mono text-xs uppercase tracking-wider sm:text-sm"
                >
                  Re-run Enhancement
                </button>
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}
