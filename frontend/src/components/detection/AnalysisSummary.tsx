import type { AnalysisReport } from "../../types";
import { getThreatAssessment } from "../../lib/utils/prediction";

interface AnalysisSummaryProps {
  report: AnalysisReport;
}

export default function AnalysisSummary({ report }: AnalysisSummaryProps) {
  const isAi = report.result.prediction.toLowerCase().includes("ai");

  return (
    <div className="dashboard-panel p-4 sm:p-5">
      <p className="fp-label-muted">Analysis Summary</p>

      <p className="mt-3 text-sm leading-relaxed text-fp-white/80">{report.summary}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <SummaryStat label="Risk Level" value={report.riskLevel} danger={isAi} />
        <SummaryStat label="Signal" value={report.signalStrength} />
        <SummaryStat label="Confidence" value={`${report.result.confidence}%`} className="col-span-2 sm:col-span-1" />
      </div>

      <div className="mt-4 rounded-xl border border-white/8 bg-black/30 px-3 py-3 sm:px-4">
        <p className="fp-label-muted">Threat Assessment</p>
        <p className="mt-2 text-xs leading-relaxed text-fp-mid sm:text-sm">
          {getThreatAssessment(report.result)}
        </p>
      </div>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  danger,
  className = "",
}: {
  label: string;
  value: string;
  danger?: boolean;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-white/8 bg-black/25 px-3 py-2 ${className}`}>
      <p className="font-mono text-[9px] uppercase tracking-wider text-fp-mid">{label}</p>
      <p className={`mt-0.5 font-mono text-xs font-semibold ${danger ? "fp-text-threat" : "text-fp-gold-lt"}`}>
        {value}
      </p>
    </div>
  );
}
