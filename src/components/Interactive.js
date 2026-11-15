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
export function StatTiles({ items, compact = false, oneRow = false }) {
  return (
    <div className={`ui-stat-grid ${compact ? "compact" : ""} ${oneRow ? "one-row" : ""}`.trim()}>
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

/* Clickable numbered steps with a detail panel for the selected step.
   steps: [{ title, short?, render: () => node }] */
export function StepExplorer({ steps, ariaLabel }) {
  const [active, setActive] = useState(0);
  const step = steps[active];
  return (
    <div className="ui-steps">
      <div className="ui-steps-rail" role="tablist" aria-label={ariaLabel}>
        {steps.map((s, i) => (
          <button
            key={s.title}
            role="tab"
            aria-selected={active === i}
            className={`ui-step ${active === i ? "active" : ""} ${i < active ? "done" : ""}`}
            onClick={() => setActive(i)}
          >
            <span className="ui-step-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="ui-step-title">{s.title}</span>
          </button>
        ))}
      </div>
      <div className="ui-progress" aria-hidden="true">
        <div className="ui-progress-fill" style={{ width: `${((active + 1) / steps.length) * 100}%` }} />
      </div>
      <div key={active} className="ui-step-panel tab-panel">
        <div className="ui-step-panel-head">
          <span className="ui-step-panel-num">Step {active + 1} of {steps.length}</span>
          <h3>{step.title}</h3>
        </div>
        {step.render()}
        <div className="ui-step-nav">
          <button className="ui-btn ghost" disabled={active === 0} onClick={() => setActive(active - 1)}>
            ← Previous
          </button>
          <button className="ui-btn" disabled={active === steps.length - 1} onClick={() => setActive(active + 1)}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

/* Collapsible groups. items: [{ id, title, badge?, points?: [], children? }] */
export function Accordion({ items, defaultOpen = 0 }) {
  const [open, setOpen] = useState(() => new Set(defaultOpen === null ? [] : [defaultOpen]));
  const toggle = (i) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  return (
    <div className="ui-accordion">
      {items.map((it, i) => {
        const isOpen = open.has(i);
        return (
          <div key={it.id || it.title} className={`ui-acc-item ${isOpen ? "open" : ""}`}>
            <button className="ui-acc-head" aria-expanded={isOpen} onClick={() => toggle(i)}>
              <span className="ui-acc-title">{it.title}</span>
              {it.badge && <span className="ui-acc-badge">{it.badge}</span>}
              <span className="ui-acc-icon" aria-hidden="true">+</span>
            </button>
            <div className="ui-acc-body">
              <div className="ui-acc-inner">
                {it.points ? <Bullets items={it.points} /> : it.children}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Rank 1 / 2 / 3 podium for one cluster. */
export function Podium({ first, second, third }) {
  const places = [
    { rank: 2, name: second, cls: "second" },
    { rank: 1, name: first, cls: "first" },
    { rank: 3, name: third, cls: "third" },
  ];
  return (
    <div className="ui-podium">
      {places.map((p) => (
        <div key={p.rank} className={`ui-podium-place ${p.cls} ${!p.name || p.name === "—" ? "empty" : ""}`}>
          <div className="ui-podium-name">{p.name && p.name !== "—" ? p.name : "—"}</div>
          <div className="ui-podium-block">
            <span>{p.rank}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Horizontal completion bar. */
export function ProgressBar({ value, label }) {
  return (
    <div className="ui-pbar" aria-label={`${label || "Progress"}: ${value}%`}>
      <div className="ui-pbar-track">
        <div className="ui-pbar-fill" style={{ width: `${value}%` }} />
      </div>
      <span className="ui-pbar-value">{value}%</span>
    </div>
  );
}

/* Highlighted note box. */
export function Callout({ title, children, tone = "info" }) {
  return (
    <div className={`ui-callout ${tone}`}>
      {title && <div className="ui-callout-title">{title}</div>}
      <div className="ui-callout-body">{children}</div>
    </div>
  );
}
