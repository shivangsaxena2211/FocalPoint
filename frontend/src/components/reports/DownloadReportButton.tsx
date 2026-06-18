import { generatePdfReport } from "../../lib/pdf/generateReport";
import type { AnalysisReport } from "../../types";

interface DownloadReportButtonProps {
  report: AnalysisReport;
}

export default function DownloadReportButton({ report }: DownloadReportButtonProps) {
  return (
    <button
      type="button"
      onClick={() => generatePdfReport(report)}
      className="fp-btn-ghost inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-mono text-xs uppercase tracking-wider"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Download PDF Report
    </button>
  );
}
