/* ─────────────────────────────────────────────────────────
   navigation.js — single source of truth for pages and sections.
   App.js (router), Sidebar.js and PortalLayout.js all read this
   list, so a route can only exist if it is declared here.
   Hash format:  #/<page>            e.g. #/objective1
                 #/<page>/<section>  e.g. #/objective1/plots
                 #/references/<key>  (the key is a reference id)
   ───────────────────────────────────────────────────────── */

export const PAGES = [
  {
    id: "overview",
    label: "Project Overview",
    topLabel: "Overview",
    sections: [
      { id: "motivation", label: "Motivation & Industry Benchmark" },
      { id: "architecture", label: "Project Architecture" },
      { id: "methods", label: "Algorithms Used" },
      { id: "objectives", label: "4-Objective Progress" },
      { id: "territories", label: "4-State Climate Scope" },
      { id: "sdgs", label: "UN SDG Alignment" },
    ],
  },
  {
    id: "objective1",
    label: "Objective 1: Selection",
    topLabel: "Objective 1",
    sections: [
      { id: "top", label: "Objective 1 Results" },
      { id: "pipeline", label: "Objective 1 Pipeline" },
      { id: "comparison", label: "State Comparison" },
      { id: "preprocessing", label: "Preprocessing & QC" },
      { id: "state-results", label: "Results by State" },
      { id: "plots", label: "Plots Across States" },
    ],
  },
  {
    id: "objective2",
    label: "Objective 2: Design & AI",
    topLabel: "Objective 2",
    sections: [
      { id: "top", label: "Objective 2 Scope" },
      { id: "workflow", label: "Optimization Workflow" },
      { id: "research-questions", label: "Engineering Questions" },
      { id: "interactive-explorer", label: "Geometry Checker" },
      { id: "parameters", label: "System Bounds & Limits" },
      { id: "deliverables", label: "Phase Deliverables" },
      { id: "objective3-handoff", label: "Objective 3 Hand-Off" },
    ],
  },
  {
    id: "references",
    label: "References",
    topLabel: null, // sidebar only
    sections: [],
  },
];

export const DEFAULT_PAGE = "overview";
export const PAGE_IDS = PAGES.map((p) => p.id);

export function getPage(id) {
  return PAGES.find((p) => p.id === id) || null;
}

/* "#/objective1/plots" -> { page: "objective1", rest: "plots" }.
   Returns null when the first segment is not a declared page. */
export function parseHash(hash) {
  const cleaned = String(hash || "")
    .replace(/^#\/?/, "")
    .split("?")[0];
  const [page, rest] = cleaned.split("/").filter(Boolean);
  if (!page || !PAGE_IDS.includes(page)) return null;
  return { page, rest: rest ? decodeURIComponent(rest) : null };
}

export function buildHash(page, rest) {
  return rest ? `#/${page}/${encodeURIComponent(rest)}` : `#/${page}`;
}
