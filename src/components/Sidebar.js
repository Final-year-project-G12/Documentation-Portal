import { useState, useEffect, useMemo } from "react";
import { PAGES, getPage } from "../data/navigation";

/* ─────────────────────────────────────────────────────────
   Sidebar.js — Multi-Page & Context-Aware Navigation
   ───────────────────────────────────────────────────────── */

function Sidebar({ currentPage, onNavigate }) {
  const [activeSection, setActiveSection] = useState("");

  const currentSections = useMemo(
    () => (getPage(currentPage) || { sections: [] }).sections,
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
            <span className="brand-title">G012 Final Year Project</span>
          </div>
        </button>

        {/* Grouped Page + Section Navigation */}
        <nav className="navigation" style={{ flex: 1 }}>
          {PAGES.map((page) => {
            const pageId = page.id;
            const sections = page.sections;
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
                {isActivePage && sections.length > 0 && (
                  <div className="nav-page-sections">
                    {sections.map((item) => (
                      <a
                        key={item.id}
                        className={`nav-link ${activeSection === item.id ? "active" : ""}`}
                        href={`#/${pageId}/${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveSection(item.id);
                          onNavigate(pageId, item.id);
                        }}
                      >
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
