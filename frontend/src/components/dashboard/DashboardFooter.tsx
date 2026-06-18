import { APP_VERSION } from "../../constants/config";

export default function DashboardFooter() {
  return (
    <footer className="mt-6 flex flex-col gap-2 border-t border-white/6 pt-4 font-mono text-[10px] uppercase tracking-wider text-fp-mid sm:mt-8 sm:flex-row sm:items-center sm:justify-between">
      <span className="fp-display text-fp-gold-lt">FocalPoint.ai</span>
      <span>Deepfake Detector v{APP_VERSION}</span>
      <span>Endpoint: POST /detect</span>
    </footer>
  );
}
