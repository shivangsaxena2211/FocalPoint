import type { FileMetadata } from "../../types";
import { formatFileSize, formatTimestamp } from "../../lib/utils/format";

interface FileDetailsProps {
  metadata: FileMetadata;
  status: "ready" | "scanning" | "complete";
}

export default function FileDetails({ metadata, status }: FileDetailsProps) {
  const rows = [
    { label: "Filename", value: metadata.name },
    { label: "Size", value: formatFileSize(metadata.size) },
    { label: "MIME Type", value: metadata.type || "unknown" },
    {
      label: "Dimensions",
      value: metadata.width && metadata.height ? `${metadata.width} × ${metadata.height}px` : "—",
    },
    {
      label: "Modified",
      value: formatTimestamp(new Date(metadata.lastModified).toISOString()),
    },
    {
      label: "Status",
      value: status === "scanning" ? "SCANNING" : status === "complete" ? "ANALYZED" : "READY",
      highlight: status === "scanning",
    },
  ];

  return (
    <div className="dashboard-panel overflow-hidden">
      <div className="panel-header px-4 py-3">
        <p className="fp-label-muted">File Details</p>
      </div>

      <dl className="divide-y divide-white/6">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[110px_1fr] gap-2 px-4 py-2.5 sm:grid-cols-[130px_1fr]">
            <dt className="font-mono text-[10px] uppercase tracking-wider text-fp-mid">{row.label}</dt>
            <dd
              className={[
                "truncate font-mono text-xs",
                row.highlight ? "text-fp-gold-lt" : "text-fp-white/80",
              ].join(" ")}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
