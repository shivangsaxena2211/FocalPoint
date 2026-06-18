import { useState } from "react";
import type { DragEvent, RefObject } from "react";
import { ALLOWED_EXTENSIONS, MAX_SIZE_MB } from "../../constants/config";

interface DropZoneProps {
  onFileSelect: (file: File | null) => void;
  onBrowseClick: () => void;
  disabled?: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export default function DropZone({
  onFileSelect,
  onBrowseClick,
  disabled,
  fileInputRef,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    onFileSelect(e.dataTransfer.files[0] ?? null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e.target.files?.[0] ?? null);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[
        "dashboard-panel relative px-4 py-10 text-center transition-all sm:px-6 sm:py-14",
        disabled ? "cursor-not-allowed opacity-60" : "",
        isDragging
          ? "border-fp-gold/50 bg-fp-gold/10 ring-1 ring-fp-gold/30"
          : "border-dashed border-white/15",
      ].join(" ")}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled}
      />

      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-fp-gold/15 sm:mb-5 sm:h-16 sm:w-16">
        <svg className="h-7 w-7 text-fp-gold sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>

      <p className="fp-label-muted">Secure Upload Zone</p>
      <p className="fp-display mt-2 text-base font-bold text-fp-white sm:text-xl">
        {isDragging ? "Release to Upload Target" : "Drag & Drop Image File"}
      </p>
      <p className="mt-2 text-xs text-fp-mid sm:text-sm">
        {ALLOWED_EXTENSIONS.map((e) => e.toUpperCase()).join(" · ")} · Max {MAX_SIZE_MB} MB
      </p>

      <button
        type="button"
        onClick={onBrowseClick}
        disabled={disabled}
        className="fp-btn-ghost mt-5 rounded-full px-5 py-2 font-mono text-[10px] uppercase tracking-wider sm:mt-6 sm:text-xs disabled:cursor-not-allowed disabled:opacity-50"
      >
        Select File
      </button>
    </div>
  );
}
