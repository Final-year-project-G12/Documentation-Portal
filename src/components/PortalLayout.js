import "../styles/global.css";
import Sidebar from "./Sidebar";

/* ─────────────────────────────────────────────────────────
   PortalLayout.js — App Shell with Glassmorphic Top Nav
   ───────────────────────────────────────────────────────── */

function PortalLayout({ currentPage, onNavigate, children }) {
  const pageTitles = {
    overview: "Project Overview & Review 2 Hub",
    objective1: "Objective 1: Climate-Region-Aware PCM Recommendation",
    objective2: "Objective 2: AI-Driven Storage Design Optimization",
  };

  return (
    <div className="portal-shell">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      <div className="portal-content-wrapper">
        {/* Top Floating Glass Navigation Header */}
        <header className="portal-top-bar">
          <div className="top-bar-left">
            <span className="top-bar-badge">Panel Review 2</span>
            <span className="top-bar-separator">/</span>
            <span className="top-bar-active-page">{pageTitles[currentPage] || "Documentation"}</span>
          </div>

          <div className="top-bar-center">
            <nav className="top-nav-pills">
              <button
                className={`top-nav-btn ${currentPage === "overview" ? "active" : ""}`}
                onClick={() => onNavigate("overview")}
              >
                <span>🏠 Overview</span>
              </button>

              <button
                className={`top-nav-btn ${currentPage === "objective1" ? "active" : ""}`}
                onClick={() => onNavigate("objective1")}
              >
                <span>🎯 Objective 1</span>
                <span className="top-nav-tag complete">100%</span>
              </button>

              <button
                className={`top-nav-btn ${currentPage === "objective2" ? "active" : ""}`}
                onClick={() => onNavigate("objective2")}
              >
                <span>⚡ Objective 2</span>
                <span className="top-nav-tag progress">~92%</span>
              </button>
            </nav>
          </div>

          <div className="top-bar-right">
            <span className="top-bar-status">
              <span className="status-ping" />
              <span>G12 Live Portal</span>
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="portal-main">{children}</main>
      </div>
    </div>
  );
}

export default PortalLayout;
