import StatusBadge from "./StatusBadge";
import ConfidenceGauge from "./ConfidenceGauge";
import AnalysisSummary from "./AnalysisSummary";
import DownloadReportButton from "../reports/DownloadReportButton";
import type { AnalysisReport } from "../../types";

interface ResultCardProps {
  report: AnalysisReport;
}

export default function ResultCard({ report }: ResultCardProps) {
  const isAi = report.result.prediction.toLowerCase().includes("ai");

  return (
    <div className={["dashboard-panel flex flex-col gap-4 p-4 sm:gap-5 sm:p-5", isAi ? "panel-threat" : "panel-verified"].join(" ")}>
      <div className="flex flex-col gap-3 border-b border-white/8 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="fp-label-muted">Analysis Report</p>
          <h2 className={`fp-display mt-1 text-xl font-bold sm:text-2xl ${isAi ? "fp-text-threat" : "fp-text-verified"}`}>
            {report.result.prediction}
          </h2>
        </div>
        <StatusBadge isAi={isAi} />
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
        <ConfidenceGauge confidence={report.result.confidence} prediction={report.result.prediction} />
      </div>

      <AnalysisSummary report={report} />

      <DownloadReportButton report={report} />
    </div>
  );
}
