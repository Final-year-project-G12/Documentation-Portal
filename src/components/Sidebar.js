import { useState, useEffect } from "react";

const sections = [
  { id: "top", label: "Overview", group: "main" },
  { id: "pipeline-flow", label: "Pipeline Flow", group: "objective1" },
  { id: "methods", label: "Methods", group: "objective1" },
  { id: "data-collection", label: "Data Collection", group: "objective1" },
  { id: "preprocessing", label: "Preprocessing & QC", group: "objective1" },
  { id: "clustering", label: "Climate Clustering", group: "objective1" },
  { id: "feasibility", label: "Feasibility Filter", group: "objective1" },
  { id: "mcdm", label: "MCDM Ranking", group: "objective1" },
  { id: "physics", label: "Physics Validation", group: "objective1" },
  { id: "interactive-plots", label: "Interactive Plots", group: "objective1" },
  { id: "results", label: "Results & Recommendations", group: "objective1" },
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
      { rootMargin: "-30% 0px -65% 0px" }
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
            <span className="brand-subtitle">FYP Group 12</span>
          </div>
        </a>

        <nav className="navigation">
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

          <div className="nav-section-label">Objective 1 — PCM Selection</div>
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
