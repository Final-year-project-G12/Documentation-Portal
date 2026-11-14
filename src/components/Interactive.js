import { useState } from "react";
import Bullets from "./Bullets";
import { Rich } from "./Cite";

/* ─────────────────────────────────────────────────────────
   Interactive.js — small UI building blocks used by the
   Overview and Objective 1 pages: stat tiles, chip tabs,
   a step-by-step explorer, accordions and a Top-3 podium.
   Text props accept the same tokens as Bullets/Rich
   ({{cite:Key}}, {{cn}}, <strong>).
   ───────────────────────────────────────────────────────── */

/* Row of headline numbers. items: [{ value, label }] */
export function StatTiles({ items, compact = false }) {
  return (
    <div className={`ui-stat-grid ${compact ? "compact" : ""}`.trim()}>
      {items.map((s) => (
        <div key={s.label} className="ui-stat-tile result-stat-card">
          <div className="ui-stat-value result-stat-value">{s.value}</div>
          <div className="ui-stat-label"><Rich text={s.label} /></div>
        </div>
      ))}
    </div>
  );
}

/* Pill-style selector. options: [{ id, label, sub? }] */
export function ChipTabs({ options, value, onChange, ariaLabel, size = "md" }) {
  return (
    <div className={`ui-chips ui-chips-${size}`} role="tablist" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.id}
          role="tab"
          aria-selected={value === o.id}
          className={`ui-chip ${value === o.id ? "active" : ""}`}
          onClick={() => onChange(o.id)}
        >
          <span className="ui-chip-label">{o.label}</span>
          {o.sub && <span className="ui-chip-sub">{o.sub}</span>}
        </button>
      ))}
    </div>
  );
}

