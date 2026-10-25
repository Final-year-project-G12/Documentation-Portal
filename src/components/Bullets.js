import { richHtml } from "./Cite";

/* ─────────────────────────────────────────────────────────
   Bullets.js — a plain bullet list for short, one-idea points.
   items: strings, or { text, details }. Text accepts the same tokens as
   richHtml: {{cite:Key}}, {{cn}} and <strong>. Glossary terms in the
   text get the hover definition. `details` is a smaller line under the
   bullet for thresholds, parameters and equations.
   ───────────────────────────────────────────────────────── */

export default function Bullets({ items, className = "" }) {
  return (
    <ul className={`bullets ${className}`.trim()}>
      {items.map((it, i) => {
        const text = typeof it === "string" ? it : it.text;
        const details = typeof it === "string" ? null : it.details;
        return (
          <li key={i}>
            <span dangerouslySetInnerHTML={{ __html: richHtml(text) }} />
            {details && (
              <span className="bullet-details" dangerouslySetInnerHTML={{ __html: richHtml(details) }} />
            )}
          </li>
        );
      })}
    </ul>
  );
}
