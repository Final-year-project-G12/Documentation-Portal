import { useEffect } from "react";
import { REFERENCES } from "../data/references";

/* References — every work cited anywhere in the portal, IEEE format,
   numbered in order of first use. In-text citations link to #/references/<key>. */
function ReferencesPage() {
  useEffect(() => {
    const scrollToRef = () => {
      const cleaned = (window.location.hash || "").replace(/^#\/?/, "").split("?")[0];
      const [, key] = cleaned.split("/").filter(Boolean);
      if (!key) return;
      const el = document.getElementById(`ref-${decodeURIComponent(key)}`);
      if (el) el.scrollIntoView({ block: "center" });
    };
    scrollToRef();
    window.addEventListener("hashchange", scrollToRef);
    return () => window.removeEventListener("hashchange", scrollToRef);
  }, []);

  return (
    <section className="content" id="top">
      <div className="page-hero">
        <div className="eyebrow">
          <span className="eyebrow-badge">References</span>
        </div>
        <h1>References</h1>
        <p className="intro">
          Works cited in this portal, numbered in order of first use. Records are taken from the
          project bibliography (<code>docs/references.bib</code>); entries that bibliography marks
          as incomplete are labelled as such rather than completed from memory.
        </p>
      </div>

      <ol className="references-list">
        {REFERENCES.map((r, i) => (
          <li key={r.key} id={`ref-${r.key}`} value={i + 1}>
            {r.text}
          </li>
        ))}
      </ol>
    </section>
  );
}

export default ReferencesPage;
