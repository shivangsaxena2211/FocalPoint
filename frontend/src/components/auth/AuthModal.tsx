import { useEffect, useState } from "react";
import { useAuth, type User } from "../../context/AuthContext";

type AuthTab = "login" | "signup";

interface AuthModalProps {
  open: boolean;
  initialTab: AuthTab;
  onClose: () => void;
  onSuccess: (isNew: boolean, user: User) => void;
}

export default function AuthModal({ open, initialTab, onClose, onSuccess }: AuthModalProps) {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<AuthTab>(initialTab);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginEmailErr, setLoginEmailErr] = useState(false);
  const [loginPassErr, setLoginPassErr] = useState(false);

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupNameErr, setSignupNameErr] = useState(false);
  const [signupEmailErr, setSignupEmailErr] = useState("");
  const [signupPassErr, setSignupPassErr] = useState(false);

  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleLogin = () => {
    setLoginEmailErr(false);
    setLoginPassErr(false);

    const users = JSON.parse(localStorage.getItem("lum_users") || "{}") as Record<
      string,
      { name: string; password: string }
    >;
    const normalizedEmail = loginEmail.trim();
    const error = login(loginEmail, loginPassword, rememberMe);
    if (error) {
      if (error.includes("email")) setLoginEmailErr(true);
      else setLoginPassErr(true);
      return;
    }

    onSuccess(false, { name: users[normalizedEmail].name, email: normalizedEmail });
    onClose();
  };

  const handleSignup = () => {
    setSignupNameErr(false);
    setSignupEmailErr("");
    setSignupPassErr(false);

    const normalizedName = signupName.trim();
    const normalizedEmail = signupEmail.trim();

    const error = signup(signupName, signupEmail, signupPassword);
    if (error) {
      if (error.includes("Name")) setSignupNameErr(true);
      else if (error.includes("email") || error.includes("registered")) setSignupEmailErr(error);
      else setSignupPassErr(true);
      return;
    }

    onSuccess(true, { name: normalizedName, email: normalizedEmail });
    onClose();
  };

  return (
    <div
      id="modal-overlay"
      className="open"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-box">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="modal-tabs">
          <button
            type="button"
            className={`tab-btn${tab === "login" ? " active" : ""}`}
            onClick={() => setTab("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`tab-btn${tab === "signup" ? " active" : ""}`}
            onClick={() => setTab("signup")}
          >
            Create Account
          </button>
        </div>

        <div className={`tab-panel${tab === "login" ? " active" : ""}`} id="panel-login">
          <h2 className="modal-title">Welcome back</h2>
          <p className="modal-sub">Sign in to continue your journey.</p>
          <div className="form-group">
            <label htmlFor="login-email">Email address</label>
            <input
              type="email"
              id="login-email"
              placeholder="you@example.com"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
            />
            <div className={`form-error${loginEmailErr ? " visible" : ""}`}>Please enter a valid email.</div>
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              placeholder="••••••••"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
            />
            <div className={`form-error${loginPassErr ? " visible" : ""}`}>Incorrect password.</div>
          </div>
          <div className="remember-row">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <label htmlFor="remember-me">Remember me on this device</label>
          </div>
          <button type="button" className="btn-form" onClick={handleLogin}>
            Sign In
          </button>
          <div className="divider">or</div>
          <p style={{ textAlign: "center", color: "var(--mid)", fontSize: ".84rem" }}>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => setTab("signup")}
              style={{
                color: "var(--gold-lt)",
                textDecoration: "none",
                fontWeight: 600,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Create one →
            </button>
          </p>
        </div>

        <div className={`tab-panel${tab === "signup" ? " active" : ""}`} id="panel-signup">
          <h2 className="modal-title">Create account</h2>
          <p className="modal-sub">Join thousands of creators on FocalPoint.ai.</p>
          <div className="form-group">
            <label htmlFor="signup-name">Full name</label>
            <input
              type="text"
              id="signup-name"
              placeholder="Your name"
              value={signupName}
              onChange={(event) => setSignupName(event.target.value)}
            />
            <div className={`form-error${signupNameErr ? " visible" : ""}`}>Name is required.</div>
          </div>
          <div className="form-group">
            <label htmlFor="signup-email">Email address</label>
            <input
              type="email"
              id="signup-email"
              placeholder="you@example.com"
              value={signupEmail}
              onChange={(event) => setSignupEmail(event.target.value)}
            />
            <div className={`form-error${signupEmailErr ? " visible" : ""}`}>
              {signupEmailErr || "Please enter a valid email."}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input
              type="password"
              id="signup-password"
              placeholder="At least 8 characters"
              value={signupPassword}
              onChange={(event) => setSignupPassword(event.target.value)}
            />
            <div className={`form-error${signupPassErr ? " visible" : ""}`}>
              Password must be at least 8 characters.
            </div>
          </div>
          <button type="button" className="btn-form" onClick={handleSignup} style={{ marginTop: 8 }}>
            Create Account
          </button>
          <div className="divider">or</div>
          <p style={{ textAlign: "center", color: "var(--mid)", fontSize: ".84rem" }}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setTab("login")}
              style={{
                color: "var(--gold-lt)",
                textDecoration: "none",
                fontWeight: 600,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Sign in →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
