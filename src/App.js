import { useState, useEffect, useCallback } from "react";
import PortalLayout from "./components/PortalLayout";
import OverviewPage from "./pages/OverviewPage";
import Objective1Page from "./pages/Objective1Page";
import Objective2Page from "./pages/Objective2Page";
import ReferencesPage from "./pages/ReferencesPage";
import { DEFAULT_PAGE, getPage, parseHash, buildHash } from "./data/navigation";

/* ─────────────────────────────────────────────────────────
   App.js — Multi-Page Router with Zero-Dependency Hash Sync
   Pages and sections come from data/navigation.js. An unknown
   or empty hash is rewritten to #/overview (no history entry),
   and an unknown section falls back to the top of its page.
   ───────────────────────────────────────────────────────── */

function readRoute() {
  const parsed = parseHash(window.location.hash);
  if (!parsed) return { page: DEFAULT_PAGE, section: null, valid: false };
  const page = getPage(parsed.page);
  // references/<key> carries a reference id, not a section id
  const isSection = page.sections.some((s) => s.id === parsed.rest);
  return { page: parsed.page, section: isSection ? parsed.rest : null, valid: !parsed.rest || isSection || parsed.page === "references" };
}

function App() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const sync = () => {
      const next = readRoute();
      if (!next.valid) {
        // normalise bad hashes without adding a history entry
        window.history.replaceState(null, "", buildHash(next.page, next.section));
      }
      setRoute({ page: next.page, section: next.section });
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  // Scroll after the new page has rendered: to its section, or to the top.
  useEffect(() => {
    if (route.page === "references") return; // the page scrolls to its own entry
    const t = setTimeout(() => {
      const el = route.section ? document.getElementById(route.section) : null;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0 });
    }, 0);
    return () => clearTimeout(t);
  }, [route.page, route.section]);

  const navigateTo = useCallback((pageId, sectionId) => {
    const hash = buildHash(pageId, sectionId || null);
    if (window.location.hash === hash) {
      // same target: still scroll (hashchange will not fire)
      setRoute({ page: pageId, section: sectionId || null });
      const el = sectionId ? document.getElementById(sectionId) : null;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.location.hash = hash;
  }, []);

  return (
    <PortalLayout currentPage={route.page} onNavigate={navigateTo}>
      {route.page === "overview" && <OverviewPage onNavigate={navigateTo} />}
      {route.page === "objective1" && <Objective1Page />}
      {route.page === "objective2" && <Objective2Page />}
      {route.page === "references" && <ReferencesPage />}
    </PortalLayout>
  );
}

export default App;
