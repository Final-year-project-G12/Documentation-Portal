import { REF_INDEX } from "../data/references";
import { termsHtml } from "../data/terms";
import { Terms } from "./Terms";

/* Inline IEEE-style citation: <Cite k="Key" /> or <Cite k={["A", "B"]} />.
   Each number links to its entry on the References page. An unknown key
   renders a visible "[?]" so a missing reference cannot go unnoticed. */
export function Cite({ k }) {
  const keys = Array.isArray(k) ? k : [k];
  return (
    <span className="cite">
      {keys.map((key, i) => {
        const n = REF_INDEX[key];
        return (
          <span key={key}>
            {i > 0 ? " " : ""}
            {n ? (
              <a href={`#/references/${key}`} title={`Reference ${n}`}>
                [{n}]
              </a>
            ) : (
              <span className="cite-missing" title={`Unknown reference key: ${key}`}>
                [?]
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

export function CitationNeeded() {
  return <span className="cite-needed">[citation needed]</span>;
}

/* Renders a string containing {{cite:Key}}, {{cite:KeyA,KeyB}} and {{cn}}
   tokens, so data tables written as plain strings can carry citations. */
export function Rich({ text }) {
  const parts = String(text).split(/(\{\{cite:[^}]+\}\}|\{\{cn\}\})/g);
  const used = new Set(); // each glossary term is marked once per block
  return (
    <>
      {parts.map((p, i) => {
        if (p === "{{cn}}") return <CitationNeeded key={i} />;
        const m = p.match(/^\{\{cite:([^}]+)\}\}$/);
        if (m) return <Cite key={i} k={m[1].split(",").map((s) => s.trim())} />;
        return <Terms key={i} text={p} used={used} />;
      })}
    </>
  );
}

/* Same tokens as <Rich>, but returns an HTML string for dangerouslySetInnerHTML. */
export function richHtml(text) {
  const replaced = String(text)
    .replace(/\{\{cn\}\}/g, '<span class="cite-needed">[citation needed]</span>')
    .replace(/\{\{cite:([^}]+)\}\}/g, (_, ks) =>
      ks
        .split(",")
        .map((k) => k.trim())
        .map((k) =>
          REF_INDEX[k]
            ? `<span class="cite"><a href="#/references/${k}">[${REF_INDEX[k]}]</a></span>`
            : '<span class="cite-missing">[?]</span>'
        )
        .join(" ")
    );
  return termsHtml(replaced);
}
