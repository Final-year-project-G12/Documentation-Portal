import { useState } from "react";
import Bullets from "../components/Bullets";
import Figure from "../components/Figure";
import { resetTerms } from "../data/terms";
import useReveal from "../components/useReveal";
import { StatTiles, ChipTabs, StepExplorer, Accordion } from "../components/Interactive";
import { O3_METHOD_STEPS, O3_AGENT_TABLE, O3_STATES, O3_FINDINGS, O3_LIMITATIONS, O3_HANDOFF } from "../data/objective3Content";

/* ─────────────────────────────────────────────────────────
   Objective3Page.js — DRL-Based Adaptive Controller
   Content: src/data/objective3Content.js, from the
   solar-pcm-control--Objective3 repository (main, 2026-11-14).
   ───────────────────────────────────────────────────────── */

function Objective3Page({ onNavigate }) {
  resetTerms();
  const [stateId, setStateId] = useState(O3_STATES[0].id);
  const revealRef = useReveal([stateId]);
  const st = O3_STATES.find((s) => s.id === stateId);
  const img = (p) => `${process.env.PUBLIC_URL}/plots/objective3/${p}`;

  return (
    <section className="content animated-page" id="top" ref={revealRef}>
      <div className="page-hero">
        <div className="eyebrow">
          <span className="eyebrow-badge">Research Module · Objective 3</span>
          <span>Control layer</span>
        </div>
        <h1>DRL-Based Adaptive Controller</h1>
        <p className="section-desc" style={{ maxWidth: 780 }}>
          A deep reinforcement learning controller operates Objective 2's fixed PCM tank hour by hour behind a safety shield it
          cannot switch off. It changes how the system is run, never the hardware or physics. All results are simulation;
          real-hardware testing is future work.
        </p>
      </div>

      {/* ── Method ── */}
      <div className="content-section" id="method">
        <div className="plots-section-header">
          <h2>How the Controller Is Built</h2>
          <span className="plots-count-badge">{O3_METHOD_STEPS.length} Steps</span>
        </div>
        <p className="section-desc">From the frozen Objective 2 simulator to a locked test on unseen years. Click a step.</p>
        <div className="section-divider" />
        <StepExplorer
          ariaLabel="Objective 3 method"
          steps={O3_METHOD_STEPS.map((s) => ({ title: s.title, render: () => <Bullets items={s.points} /> }))}
        />
      </div>

      {/* ── Agents ── */}
      <div className="content-section" id="agents">
        <div className="plots-section-header">
          <h2>Agents Compared</h2>
          <span className="plots-count-badge">6 Algorithms</span>
        </div>
        <p className="section-desc">Which learning algorithm was tried in which state, and where it ended up.</p>
        <div className="section-divider" />
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>{O3_AGENT_TABLE.columns.map((c) => <th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {O3_AGENT_TABLE.rows.map((r) => (
                <tr key={r[0]}>
                  {r.map((cell, i) => (
                    <td key={i} style={i === 0 ? { fontWeight: 600, color: "#ffffff" } : undefined}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Results by state ── */}
      <div className="content-section" id="results">
        <div className="plots-section-header">
          <h2>Locked-Test Results by State</h2>
          <span className="plots-count-badge">3 States</span>
        </div>
        <p className="section-desc">
          Pick a state. Each was tested once on years it never trained on; percentages are against always-charge (B0).
        </p>
        <div className="section-divider" />

        <ChipTabs
          size="lg"
          ariaLabel="State"
          options={O3_STATES.map((s) => ({ id: s.id, label: s.name, sub: `${s.selected} selected` }))}
          value={stateId}
          onChange={setStateId}
        />
        <div key={stateId} className="tab-panel">
          <div className="ui-state-head">
            <h3>{st.name}</h3>
            <span className="tag tag-brand">{st.tag}</span>
          </div>
          <StatTiles compact items={st.stats} />

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Regime</th>
                  <th>Controller</th>
                  <th>{st.columns[0]}</th>
                  <th>{st.columns[1]}</th>
                </tr>
              </thead>
              <tbody>
                {st.rows.map((r, i) => (
                  <tr key={i} className={r.best ? "row-best" : ""}>
                    <td>{r.regime}</td>
                    <td style={{ fontWeight: 600, color: r.best ? "#ffffff" : undefined }}>{r.policy}</td>
                    <td>{r.a}</td>
                    <td>{r.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Accordion defaultOpen={0} items={[{ id: "notes", title: `${st.name}: what the results say`, badge: `${st.notes.length}`, points: st.notes }]} />

          {st.figures && st.figures.length > 0 && (
            <div className="ui-two-col">
              {st.figures.map((f) => (
                <Figure key={f.file} src={img(f.file)} title={f.title} alt={f.caption} caption={f.caption} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Findings ── */}
      <div className="content-section" id="findings">
        <div className="plots-section-header">
          <h2>Key Findings Across States</h2>
        </div>
        <div className="section-divider" />
        <div className="ui-card-grid">
          {O3_FINDINGS.map((f, i) => (
            <div key={f.title} className="ui-card">
              <div className="ui-card-kicker">Finding {i + 1}</div>
              <h4>{f.title}</h4>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Limitations and hand-off ── */}
      <div className="content-section" id="inputs">
        <div className="plots-section-header">
          <h2>Limitations & Hand-off to Objective 4</h2>
        </div>
        <div className="section-divider" />
        <div className="ui-two-col">
          <div className="ui-panel">
            <div className="ui-card-kicker">Limitations</div>
            <Bullets items={O3_LIMITATIONS} />
          </div>
          <div className="ui-panel">
            <div className="ui-card-kicker">Hand-off</div>
            <Bullets items={O3_HANDOFF} />
            {onNavigate && (
              <button className="ui-btn" style={{ marginTop: 14 }} onClick={() => onNavigate("objective4")}>
                Continue to Objective 4 →
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Objective3Page;
