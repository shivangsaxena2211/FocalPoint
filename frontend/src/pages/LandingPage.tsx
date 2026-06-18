import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthModal from "../components/auth/AuthModal";
import LiveBackground from "../components/layout/LiveBackground";
import { useAuth } from "../context/AuthContext";
import "../styles/landing.css";

type AuthTab = "login" | "signup";

export default function LandingPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [navScrolled, setNavScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<AuthTab>("signup");
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [welcomeTitle, setWelcomeTitle] = useState("Welcome back! ✦");
  const [welcomeText, setWelcomeText] = useState("You're signed in and ready to create.");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<"/verify" | "/enhance" | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 3500);
  }, []);

  const openModal = useCallback((tab: AuthTab) => {
    setModalTab(tab);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const showWelcome = useCallback((isNew: boolean, name: string) => {
    setWelcomeTitle(isNew ? `Welcome, ${name}! ✦` : `Welcome back, ${name}! ✦`);
    setWelcomeText(
      isNew ? "Your account is ready. Start creating." : "You're signed in and ready to create."
    );
    setWelcomeVisible(true);
    window.setTimeout(() => setWelcomeVisible(false), 5000);
  }, []);

  const handleAuthenticityClick = useCallback(() => {
    if (user) {
      navigate("/verify");
      return;
    }
    setPendingRoute("/verify");
    openModal("signup");
  }, [user, navigate, openModal]);

  const handleEnhancementClick = useCallback(() => {
    if (user) {
      navigate("/enhance");
      return;
    }
    setPendingRoute("/enhance");
    openModal("signup");
  }, [user, navigate, openModal]);

  const handleAuthSuccess = useCallback(
    (isNew: boolean, signedInUser: { name: string; email: string }) => {
      showWelcome(isNew, signedInUser.name);
      showToast(
        isNew ? "🎉 Account created! Welcome to FocalPoint.ai." : "✦ Signed in successfully!"
      );

      if (pendingRoute) {
        const destination = pendingRoute;
        setPendingRoute(null);
        navigate(destination);
      }
    },
    [pendingRoute, navigate, showToast, showWelcome]
  );

  useEffect(() => {
    if (!location.state || typeof location.state !== "object") return;

    const state = location.state as { openAuth?: AuthTab; from?: "/verify" | "/enhance" };
    if (state.openAuth) {
      openModal(state.openAuth);
      if (state.from === "/verify" || state.from === "/enhance") {
        setPendingRoute(state.from);
      }
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate, openModal]);

  useEffect(() => {
    if (!user) return;
    showWelcome(false, user.name);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setPendingRoute(null);
    showToast("You've been signed out.");
  };

  const firstName = user?.name.split(" ")[0] ?? "";
  const avatarInitial = user?.name.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="landing-page">
      <LiveBackground showDots />

      <nav id="navbar" className={navScrolled ? "scrolled" : ""}>
        <button type="button" className="nav-logo" onClick={() => scrollToSection("home")}>
          FocalPoint.ai
        </button>
        <ul className="nav-links">
          <li>
            <a href="#home" onClick={() => scrollToSection("home")}>
              Home
            </a>
          </li>
          <li>
            <a href="#features" onClick={() => scrollToSection("features")}>
              Features
            </a>
          </li>
          <li>
            <a href="#about" onClick={() => scrollToSection("about")}>
              About
            </a>
          </li>
          <li>
            <a href="#contact" onClick={() => scrollToSection("contact")}>
              Contact
            </a>
          </li>
        </ul>
        <div className="nav-actions">
          {!user ? (
            <div id="nav-auth">
              <button type="button" className="btn-ghost" onClick={() => openModal("login")}>
                Sign In
              </button>
              <button type="button" className="btn-primary" onClick={() => openModal("signup")}>
                Get Started
              </button>
            </div>
          ) : (
            <div id="nav-user" className="visible">
              <div className="avatar">{avatarInitial}</div>
              <span id="nav-username">{firstName}</span>
              <button type="button" id="btn-logout" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </nav>

      <main>
        <section id="home">
          <span className="hero-eyebrow">
            <span className="eyebrow-dot" />
            Now in early access
          </span>
          <h1 className="hero-title">
            Where Ideas
            <br />
            <span className="accent">Take Flight.</span>
          </h1>
          <p className="hero-sub">
            FocalPoint.ai is your ultimate AI-powered image verification and enhancement platform.
            Ensure authenticity, elevate quality, and bring your creative visions to life with our
            cutting-edge tools.
          </p>
          <div className="hero-cta">
            <button type="button" className="btn-hero primary" onClick={() => openModal("signup")}>
              Start for free
            </button>
            <button
              type="button"
              className="btn-hero secondary"
              onClick={() => scrollToSection("features")}
            >
              See how it works
            </button>
          </div>
          <div className="scroll-hint">
            <div className="scroll-arrow" />
            <span>Scroll</span>
          </div>
        </section>

        <section id="features">
          <p className="section-label">What we offer</p>
          <h2 className="section-title">
            &quot;Verify authenticity and elevate quality with our advanced AI-powered image analysis
            and enhancement tools.&quot;
          </h2>
          <div className="cards-grid">
            <button type="button" className="card card-action" onClick={handleAuthenticityClick}>
              <div className="card-icon">✦</div>
              <h3>Authenticity Verification</h3>
              <p>
                Our advanced AI algorithms detect and verify the authenticity of images, ensuring
                they are genuine and have not been tampered with.
              </p>
            </button>
            <button type="button" className="card card-action" onClick={handleEnhancementClick}>
              <div className="card-icon">⬡</div>
              <h3>Image Enhancement</h3>
              <p>
                Our AI-powered enhancement tools improve image quality, correct lighting issues, and
                bring out the best in every photo.
              </p>
            </button>
          </div>
        </section>

        <section id="about">
          <p className="section-label">Our story</p>
          <h2 className="section-title">Built by creators, for creators.</h2>
          <p className="about-copy">
            FocalPoint.ai was founded with a mission to empower creators and innovators by providing
            cutting-edge tools that enhance creativity and streamline workflows. Our team is
            passionate about leveraging AI technology to solve real-world problems, ensuring that
            every image you work with is authentic, high-quality, and ready to make an impact.
            <br />
            Kaushal Yadav
            <br />
            Shivang Saxena
            <br />
            Shivansh Tyagi
            <br />
          </p>
        </section>

        <section id="contact">
          <p className="section-label">Get in touch</p>
          <h2 className="section-title">We&apos;d love to hear from you.</h2>
          <p className="contact-copy">
            Questions, feedback, or just want to say hello? Drop us a line.
          </p>
          <button
            type="button"
            className="btn-hero primary"
            onClick={() => showToast("📬 Message sent! We'll be in touch soon.")}
          >
            Send a message
          </button>
        </section>
      </main>

      <footer>
        <div className="logo-sm">FocalPoint.ai</div>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Blog</a>
          <a href="#">Careers</a>
        </div>
        <span>© 2025 FocalPoint.ai Inc.</span>
      </footer>

      <AuthModal
        open={modalOpen}
        initialTab={modalTab}
        onClose={closeModal}
        onSuccess={handleAuthSuccess}
      />

      <div id="welcome-banner" className={welcomeVisible ? "visible" : ""}>
        <button
          type="button"
          className="banner-close"
          onClick={() => setWelcomeVisible(false)}
          aria-label="Close welcome banner"
        >
          ✕
        </button>
        <h4>{welcomeTitle}</h4>
        <p>{welcomeText}</p>
      </div>

      <div id="toast" className={toastVisible ? "show" : ""}>
        {toastMessage}
      </div>
    </div>
  );
}
