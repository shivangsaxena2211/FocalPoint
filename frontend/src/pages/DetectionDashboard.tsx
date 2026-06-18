import LiveBackground from "../components/layout/LiveBackground";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardFooter from "../components/dashboard/DashboardFooter";
import AnalysisWorkspace from "../components/dashboard/AnalysisWorkspace";
import DetectionHistory from "../components/history/DetectionHistory";
import { useCallback, useState } from "react";
import { useDetection } from "../hooks/useDetection";
import { useDetectionHistory } from "../hooks/useDetectionHistory";

export default function DetectionDashboard() {
  const { history, addRecord, removeRecord, clearHistory, aiCount, realCount } = useDetectionHistory();
  const [historyCollapsed, setHistoryCollapsed] = useState(true);

  const onComplete = useCallback(
    (record: Parameters<typeof addRecord>[0]) => {
      addRecord(record);
    },
    [addRecord]
  );

  const detection = useDetection(onComplete);

  return (
    <div className="fp-dashboard">
      <LiveBackground />

      <div className="fp-dashboard-content mx-auto flex min-h-screen max-w-7xl flex-col px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <DashboardHeader />

        <div className="mt-4 grid flex-1 gap-4 lg:mt-6 lg:grid-cols-[1fr_320px] lg:gap-6">
          <AnalysisWorkspace
            previewUrl={detection.previewUrl}
            metadata={detection.metadata}
            report={detection.report}
            loading={detection.loading}
            error={detection.error}
            fileInputRef={detection.fileInputRef}
            onFileSelect={detection.handleFileSelect}
            onBrowseClick={detection.handleBrowseClick}
            onDetect={detection.handleDetect}
            onClear={detection.resetState}
            onDismissError={detection.dismissError}
          />

          <div className="lg:sticky lg:top-6 lg:self-start">
            <DetectionHistory
              history={history}
              onClear={clearHistory}
              onRemove={removeRecord}
              aiCount={aiCount}
              realCount={realCount}
              collapsed={historyCollapsed}
              onToggle={() => setHistoryCollapsed((prev) => !prev)}
            />
          </div>
        </div>

        <DashboardFooter />
      </div>
    </div>
  );
}
