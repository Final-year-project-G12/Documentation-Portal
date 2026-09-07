import { useState, useEffect } from "react";

const sections = [
  { id: "top", label: "Project Overview", group: "main" },
  { id: "state-selector", label: "State Selection", group: "main" },
  { id: "preprocessing", label: "Preprocessing & QC", group: "objective1" },
  { id: "interactive-plots", label: "Interactive Plots (All 4 States)", group: "objective1" },
  { id: "clustering", label: "Clustering & Cross-State Analysis", group: "objective1" },
  { id: "methods", label: "Methods & Mathematical Models", group: "objective1" },
  { id: "results", label: "Recommendations & Findings", group: "objective1" },
];

function Sidebar() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const mainSections = sections.filter((s) => s.group === "main");
  const obj1Sections = sections.filter((s) => s.group === "objective1");

  return (
    <aside className="sidebar" aria-label="Documentation navigation">
      <div className="sidebar-inner">
        <a className="brand" href="#top">
          <div className="brand-mark">PCM</div>
          <div className="brand-text">
            <span className="brand-title">Documentation Portal</span>
            <span className="brand-subtitle">FYP Group 12 · Review 2</span>
          </div>
        </a>

        <nav className="navigation">
          <div className="nav-section-label">Navigation</div>
          {mainSections.map((item) => (
            <a
              key={item.id}
              className={`nav-link ${active === item.id ? "active" : ""}`}
              href={`#${item.id}`}
            >
              <span className="nav-link-dot" />
              {item.label}
            </a>
          ))}

          <div className="nav-section-label">Objective 1 — 4 States</div>
          {obj1Sections.map((item) => (
            <a
              key={item.id}
              className={`nav-link ${active === item.id ? "active" : ""}`}
              href={`#${item.id}`}
            >
              <span className="nav-link-dot" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
