import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { APP_NAME } from "../../constants/config";

interface DashboardHeaderProps {
  sectionLabel?: string;
  sectionTitle?: string;
}

export default function DashboardHeader({
  sectionLabel = "Authenticity Verification",
  sectionTitle = APP_NAME,
}: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const firstName = user?.name.split(" ")[0] ?? "";
  const avatarInitial = user?.name.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="fp-dashboard-nav">
      <div className="flex items-center gap-3 sm:gap-4">
        <Link to="/" className="fp-logo-text text-xl no-underline sm:text-2xl">
          FocalPoint.ai
        </Link>
        <div className="hidden border-l border-white/10 pl-4 sm:block">
          <p className="fp-label">{sectionLabel}</p>
          <h1 className="fp-display text-sm font-bold text-fp-white sm:text-base">{sectionTitle}</h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-fp-mid sm:px-3 sm:py-1.5">
          API: localhost:5000
        </span>
        <span className="fp-status-online inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider sm:px-3 sm:py-1.5">
          <span className="fp-pulse-dot h-1.5 w-1.5 animate-pulse rounded-full" />
          Online
        </span>
        {user && (
          <div className="flex items-center gap-2 border-l border-white/10 pl-2 sm:gap-3 sm:pl-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-fp-violet to-fp-gold text-xs font-bold text-white sm:h-9 sm:w-9">
              {avatarInitial}
            </div>
            <span className="hidden text-sm text-fp-mid sm:inline">{firstName}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-semibold text-fp-rose transition hover:opacity-70"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
