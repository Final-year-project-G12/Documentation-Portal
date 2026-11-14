import { useState } from "react";
import Bullets from "../components/Bullets";
import Figure from "../components/Figure";
import { resetTerms } from "../data/terms";
import useReveal from "../components/useReveal";
import { StatTiles, ChipTabs, StepExplorer, Callout } from "../components/Interactive";
import { O4_HERO_STATS, O4_CHAIN, O4_ARMS, O4_STATES, O4_LIMITATIONS } from "../data/objective4Content";

/* ─────────────────────────────────────────────────────────
   Objective4Page.js — Software-in-the-Loop Validation
   Content: src/data/objective4Content.js, from the
   Objective--4_software-in-loop repository (main, 2026-11-14).
   ───────────────────────────────────────────────────────── */

function Objective4Page() {
  resetTerms();
  const [stateId, setStateId] = useState(O4_STATES[0].id);
  const revealRef = useReveal([stateId]);
  const st = O4_STATES.find((s) => s.id === stateId);
  const img = (p) => `${process.env.PUBLIC_URL}/plots/objective4/${p}`;

  return (
    <section className="content animated-page" id="top" ref={revealRef}>
      <div className="page-hero">
        <div className="eyebrow">
          <span className="eyebrow-badge">Research Module · Objective 4</span>
          <span>Software-in-the-loop validation</span>
        </div>
        <h1>MATLAB Digital Twin & Software-in-the-Loop Validation</h1>
        <p className="section-desc" style={{ maxWidth: 780 }}>
          The trained Objective 3 controller is tested outside its training code: a MATLAB digital twin of the whole PCM solar
          water heater is replayed against the Python simulator and stressed with edge cases and failing sensors. This is emulated
          validation; no physical rig was used.
        </p>
      </div>

      <StatTiles items={O4_HERO_STATS} />

      {/* ── Signal chain ── */}
      <div className="content-section" id="chain">
        <div className="plots-section-header">
          <h2>The Signal Chain</h2>
          <span className="plots-count-badge">{O4_CHAIN.length} Blocks</span>
        </div>
        <p className="section-desc">Every simulated hour passes through the same six blocks as a real installation would. Click a block.</p>
        <div className="section-divider" />
        <StepExplorer
          ariaLabel="Digital twin signal chain"
          steps={O4_CHAIN.map((c) => ({ title: c.title, render: () => <p style={{ margin: 0 }}>{c.text}</p> }))}
        />
      </div>

      {/* ── Three arms ── */}
      <div className="content-section" id="arms">
        <div className="plots-section-header">
          <h2>Three Arms: Separating the PCM and AI Benefits</h2>
        </div>
        <p className="section-desc">Each test runs three versions of the system on the same weather.</p>
        <div className="section-divider" />
        <div className="ui-card-grid">
          {O4_ARMS.map((a) => (
            <div key={a.arm} className="ui-card">
              <div className="ui-card-kicker">{a.arm}</div>
              <h4>{a.tank}</h4>
              <p>Controller: {a.controller}</p>
              <p style={{ marginTop: 6, color: "#ffffff" }}>{a.shows}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Results by state ── */}
      <div className="content-section" id="results">
        <div className="plots-section-header">
          <h2>Results by State</h2>
          <span className="plots-count-badge">3 Twins</span>
        </div>
        <p className="section-desc">Pick a state to see its twin, the three-arm comparison, the checks and the figures.</p>
        <div className="section-divider" />

        <ChipTabs
          size="lg"
          ariaLabel="State"
          options={O4_STATES.map((s) => ({ id: s.id, label: s.name, sub: s.tag }))}
          value={stateId}
          onChange={setStateId}
        />
        <div key={stateId} className="tab-panel">
          <StatTiles compact items={st.setup} />

          {st.armTable && (
            <>
              <h3>Three-arm comparison <span className="ui-panel-sub">({st.armTable.caption})</span></h3>
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Arm</th>
                      {st.armTable.columns.map((c) => <th key={c}>{c}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {st.armTable.rows.map((r) => (
                      <tr key={r.arm} className={r.best ? "row-best" : ""}>
                        <td style={{ fontWeight: 600, color: "#ffffff" }}>{r.arm}</td>
                        {r.v.map((x, i) => <td key={i}>{x}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <Callout title={`${st.name}: what was verified`}>
            <Bullets items={st.points} />
          </Callout>

          {st.figures.length > 0 && (
            <div className="plot-grid plot-grid-wide">
              {st.figures.map((f) => (
                <div key={f.file} className="plot-type">
                  <h3>{f.title}</h3>
                  <Figure src={img(f.file)} title={`${st.name}: ${f.title}`} alt={f.caption} />
                  <p className="plot-type-caption">{f.caption}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Limitations ── */}
      <div className="content-section" id="limitations">
        <div className="plots-section-header">
          <h2>Limitations & Next Steps</h2>
        </div>
        <div className="section-divider" />
        <div className="ui-panel">
          <Bullets items={O4_LIMITATIONS} />
        </div>
      </div>
    </section>
  );
}

export default Objective4Page;
