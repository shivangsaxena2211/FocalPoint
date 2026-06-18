import LiveBackground from "../components/layout/LiveBackground";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardFooter from "../components/dashboard/DashboardFooter";
import EnhancementWorkspace from "../components/enhancement/EnhancementWorkspace";
import { useEnhancement } from "../hooks/useEnhancement";

export default function EnhancementDashboard() {
  const enhancement = useEnhancement();

  return (
    <div className="fp-dashboard">
      <LiveBackground />

      <div className="fp-dashboard-content mx-auto flex min-h-screen max-w-7xl flex-col px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <DashboardHeader
          sectionLabel="Image Enhancement"
          sectionTitle="CodeFormer Studio"
        />

        <div className="mt-4 flex flex-1 flex-col lg:mt-6">
          <EnhancementWorkspace
            beforeUrl={enhancement.beforeUrl}
            afterUrl={enhancement.afterUrl}
            metadata={enhancement.metadata}
            loading={enhancement.loading}
            error={enhancement.error}
            fileInputRef={enhancement.fileInputRef}
            onFileSelect={enhancement.handleFileSelect}
            onBrowseClick={enhancement.handleBrowseClick}
            onEnhance={enhancement.handleEnhance}
            onClear={enhancement.resetState}
            onDismissError={enhancement.dismissError}
            onDownload={enhancement.downloadEnhanced}
          />
        </div>

        <DashboardFooter />
      </div>
    </div>
  );
}
