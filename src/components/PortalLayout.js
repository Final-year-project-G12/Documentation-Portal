import "../styles/global.css";
import Sidebar from "./Sidebar";
import { TermPopover } from "./Terms";

/* ─────────────────────────────────────────────────────────
   PortalLayout.js — App Shell with Glassmorphic Top Nav
   ───────────────────────────────────────────────────────── */

function PortalLayout({ currentPage, onNavigate, children }) {
  return (
    <div className="portal-shell">
      <TermPopover />
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      <div className="portal-content-wrapper">
        {/* Top Floating Glass Navigation Header */}
        <header className="portal-top-bar">


          <div className="top-bar-center">
            <nav className="top-nav-pills">
              <button
                className={`top-nav-btn ${currentPage === "overview" ? "active" : ""}`}
                onClick={() => onNavigate("overview")}
              >
                <span>Overview</span>
              </button>

              <button
                className={`top-nav-btn ${currentPage === "objective1" ? "active" : ""}`}
                onClick={() => onNavigate("objective1")}
              >
                <span>Objective 1</span>
              </button>

              <button
                className={`top-nav-btn ${currentPage === "objective2" ? "active" : ""}`}
                onClick={() => onNavigate("objective2")}
              >
                <span>Objective 2</span>
              </button>
            </nav>
          </div>


        </header>

        {/* Main Content Area */}
        <main className="portal-main">{children}</main>
      </div>
    </div>
  );
}

export default PortalLayout;
