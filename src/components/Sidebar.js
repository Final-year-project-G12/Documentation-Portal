import { useState, useEffect, useMemo } from "react";

/* ─────────────────────────────────────────────────────────
   Sidebar.js — Multi-Page & Context-Aware Navigation
   ───────────────────────────────────────────────────────── */

const PAGES = [
  {
    id: "overview",
    label: "Project Overview",
    icon: "🏠",
    badge: "Review 2",
    badgeType: "brand",
  },
  {
    id: "objective1",
    label: "Objective 1: Selection",
    icon: "🎯",
    badge: "100%",
    badgeType: "complete",
  },
  {
    id: "objective2",
    label: "Objective 2: Design & AI",
    icon: "⚡",
    badge: "~92%",
    badgeType: "progress",
  },
];

const SECTIONS_BY_PAGE = {
  overview: [
    { id: "motivation", label: "Motivation & Industry Benchmark" },
    { id: "architecture", label: "System Architecture" },
    { id: "objectives", label: "4-Objective Progress" },
    { id: "territories", label: "4-State Climate Scope" },
    { id: "sdgs", label: "UN SDG Alignment" },
  ],
  objective1: [
    { id: "top", label: "Objective 1 Pipeline" },
    { id: "state-selector", label: "State Territory Selection" },
    { id: "implementation-flow", label: "7-Phase Implementation" },
    { id: "preprocessing", label: "Preprocessing & QC Audit" },
    { id: "interactive-plots", label: "Interactive Plots Suite" },
    { id: "clustering", label: "Cross-State Findings" },
    { id: "methods", label: "Theoretical Algorithms" },
    { id: "results", label: "Recommended PCMs" },
  ],
  objective2: [
    { id: "top", label: "Objective 2 Scope" },
    { id: "research-questions", label: "Engineering Questions" },
    { id: "workflow", label: "Optimization Workflow" },
    { id: "interactive-explorer", label: "Design Space Estimator" },
    { id: "parameters", label: "System Bounds & Limits" },
    { id: "deliverables", label: "Deliverables (D2.1–D2.9)" },
    { id: "objective3-handoff", label: "Objective 3 Hand-Off" },
  ],
};

function Sidebar({ currentPage, onNavigate }) {
  const [activeSection, setActiveSection] = useState("");

  const currentSections = useMemo(
    () => SECTIONS_BY_PAGE[currentPage] || [],
    [currentPage]
  );

  useEffect(() => {
    setActiveSection("");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    currentSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentPage, currentSections]);

  return (
    <aside className="sidebar" aria-label="Documentation navigation">
      <div className="sidebar-inner">
        {/* Brand */}
        <button
          className="brand"
          onClick={() => onNavigate("overview")}
          style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
        >
          <div className="brand-mark">PCM</div>
          <div className="brand-text">
            <span className="brand-title">Documentation Portal</span>
          </div>
        </button>

        {/* Grouped Page + Section Navigation */}
        <nav className="navigation" style={{ flex: 1 }}>
          {Object.entries(SECTIONS_BY_PAGE).map(([pageId, sections]) => {
            const page = PAGES.find((p) => p.id === pageId);
            const isActivePage = currentPage === pageId;
            return (
              <div key={pageId} className="nav-page-group">
                {/* Page heading — clicking navigates to the page */}
                <button
                  className={`nav-page-heading ${isActivePage ? "active" : ""}`}
                  onClick={() => onNavigate(pageId)}
                >
                  <span className="nav-page-label">{page.label}</span>
                </button>

                {/* Sub-topics — only visible for the active page */}
                {isActivePage && (
                  <div className="nav-page-sections">
                    {sections.map((item) => (
                      <a
                        key={item.id}
                        className={`nav-link ${activeSection === item.id ? "active" : ""}`}
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const target = document.getElementById(item.id);
                          if (target) {
                            target.scrollIntoView({ behavior: "smooth", block: "start" });
                            setActiveSection(item.id);
                          }
                        }}
                      >
                        <span className="nav-link-dot" />
                        <span>{item.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-text">Amrita School of Engineering</div>
          <div className="sidebar-footer-sub">23CSE498 Project Phase 2</div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
