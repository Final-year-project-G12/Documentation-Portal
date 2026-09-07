import { useState, useEffect } from "react";
import PortalLayout from "./components/PortalLayout";
import OverviewPage from "./pages/OverviewPage";
import Objective1Page from "./pages/Objective1Page";
import Objective2Page from "./pages/Objective2Page";

/* ─────────────────────────────────────────────────────────
   App.js — Multi-Page Router with Zero-Dependency Hash Sync
   ───────────────────────────────────────────────────────── */

function getInitialPage() {
  const hash = window.location.hash.replace("#/", "").replace("#", "").split("?")[0].split("/")[0];
  if (hash === "objective1" || hash === "objective2" || hash === "overview") {
    return hash;
  }
  return "overview";
}

function App() {
  const [currentPage, setCurrentPage] = useState(getInitialPage);

  // Sync state with browser back/forward and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#/", "").replace("#", "").split("?")[0].split("/")[0];
      if (["overview", "objective1", "objective2"].includes(hash)) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    window.location.hash = `#/${pageId}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PortalLayout currentPage={currentPage} onNavigate={navigateTo}>
      {currentPage === "overview" && <OverviewPage onNavigate={navigateTo} />}
      {currentPage === "objective1" && <Objective1Page />}
      {currentPage === "objective2" && <Objective2Page />}
    </PortalLayout>
  );
}

export default App;
