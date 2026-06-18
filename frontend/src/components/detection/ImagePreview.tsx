interface ImagePreviewProps {
  src: string;
  fileName?: string;
  loading?: boolean;
}

export default function ImagePreview({ src, fileName, loading }: ImagePreviewProps) {
  return (
    <div className="dashboard-panel overflow-hidden">
      <div className="panel-header px-4 py-3">
        <p className="fp-label-muted">Target Preview</p>
        <p className="truncate text-sm font-medium text-fp-white">{fileName ?? "Uploaded image"}</p>
      </div>

      <div className="relative flex items-center justify-center bg-black/40 p-3 sm:p-4">
        <img src={src} alt="Preview" className="max-h-64 w-full rounded-xl object-contain sm:max-h-80" />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
            <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-fp-gold/20">
              <div className="animate-scan-line h-full w-full bg-gradient-to-b from-transparent via-fp-gold to-transparent" />
            </div>
            <div className="relative flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
              <div className="absolute inset-0 animate-radar-sweep rounded-full border border-fp-gold/30 border-t-fp-gold" />
              <span className="fp-label-muted">Scan</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
