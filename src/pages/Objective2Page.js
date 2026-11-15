import { useState } from "react";
import Bullets from "../components/Bullets";
import Figure, { VideoFigure } from "../components/Figure";
import { resetTerms } from "../data/terms";
import useReveal from "../components/useReveal";
import { StatTiles, ChipTabs, StepExplorer, Accordion, ProgressBar, Callout } from "../components/Interactive";
import {
  O2_HERO_STATS, O2_STATES, O2_WORKFLOW_STEPS, RESEARCH_QUESTIONS, CRITERIA_STUDY, CFD_CHECKS, CFD_GROUPS,
  O2_PLOTS, O2_ASSAM_PLOTS, O2_LIMITATIONS, O3_HANDOFF,
  O2_FLOW_STATES, O2_FLOW_STAGES, O2_FLOW_LANES,
} from "../data/objective2Content";

/* ─────────────────────────────────────────────────────────
   Objective2Page.js — AI-Driven Storage Design Optimization
   Final Year Project — Group 12 | Department of CSE
   Amrita School of Engineering

   Content follows OBJECTIVE2/Objective---2 as merged to main on
   2026-11-14 (data in src/data/objective2Content.js): objective2-rajasthan/{README, docs/01–07, configs/*.yaml},
   objective2-tamilnadu/{OVERVIEW.md, docs/04_RESULTS.md},
   objective2-uttarakhand/{README.md, docs/PROGRESS.md} and
   objective2-assam/{README.md, docs/00_MASTER_OVERVIEW.md}.
   Rajasthan is the reference state. Assam is still the legacy chain
   (the 500 L Assam designs in the Review 4 slides are not in the repo).
   Where the sources give no citation, the text says so with [citation needed].
   ───────────────────────────────────────────────────────── */

const PARAMETER_BOUNDS = [
  { param: "Capsule inner radius (PCM thickness)", symbol: "inner_radius_m", bounds: "10 – 40 mm", unit: "mm" },
  { param: "PCM volume fraction", symbol: "pcm_volume_fraction", bounds: "2 – 30 %", unit: "% of tank" },
  { param: "Water mass flow rate", symbol: "flow_rate_kg_s", bounds: "0.010 – 0.050 kg/s", unit: "kg/s" },
  { param: "Arrangement", symbol: "arrangement", bounds: "Single-layer, staggered, radial", unit: "Category" },
  { param: "Capsule shell", symbol: "capsule_wall_thickness_m", bounds: "0.8 mm aluminium", unit: "mm" },
  { param: "Target delivery temperature", symbol: "delivery.target_temp_C", bounds: "45 °C (Uttarakhand 50 °C)", unit: "°C" },
  { param: "Maximum water temperature", symbol: "water_peak_limit_C", bounds: "≤ 75 °C", unit: "°C" },
  { param: "Maximum PCM temperature", symbol: "pcm_peak_limit_C", bounds: "≤ 65 °C", unit: "°C" },
  { param: "Tank model and step", symbol: "n_nodes, timestep_s", bounds: "10 nodes, 150 s", unit: "—" },
  { param: "Fixed, not optimised", symbol: "fixed_not_optimised", bounds: "Tank, collector, demand, shortlist", unit: "—" },
];

function regimeOk(r) {
  return !r.noGain && r.heldout > r.band;
}

function Objective2Page() {
  resetTerms();
  const [stateId, setStateId] = useState("rajasthan");
  const [criteriaId, setCriteriaId] = useState(CRITERIA_STUDY[0].id);
  const [cfdId, setCfdId] = useState(CFD_GROUPS[0].id);
  const [plotState, setPlotState] = useState("rajasthan");
  const [flowId, setFlowId] = useState("rajasthan");
  const revealRef = useReveal([stateId, criteriaId, cfdId, plotState, flowId]);

  const st = O2_STATES.find((s) => s.id === stateId);
  const crit = CRITERIA_STUDY.find((c) => c.id === criteriaId);
  const cfdCases = CFD_CHECKS.filter((c) => c.group === cfdId);
  const plotStates = O2_STATES.filter((s) => s.current);
  const plots = plotState === "assam" ? O2_ASSAM_PLOTS : O2_PLOTS;

  const img = (path) => `${process.env.PUBLIC_URL}/plots/objective2/${path}`;

  return (
    <section className="content animated-page" id="top" ref={revealRef}>
      {/* ── Hero ── */}
      <div className="page-hero">
        <div className="eyebrow">
          <span className="eyebrow-badge">Research Module · Objective 2</span>
          <span>Surrogate design & optimization</span>
        </div>
        <h1>AI-Driven PCM Storage Design Optimization</h1>
        <p className="section-desc" style={{ maxWidth: 780 }}>
          For each Objective 1 climate regime, Objective 2 searches the capsule radius, PCM amount, flow rate and arrangement that
          give a fixed solar tank the most extra evening hot water, judged against the same tank with no PCM. A surrogate-assisted,
          constrained multi-objective search proposes designs; the simulator evaluates every reported number. Results are the best
          found inside the declared box, not a proven optimum.
        </p>
      </div>

      <StatTiles items={O2_HERO_STATS} />

      {/* ── Results by state ── */}
      <div className="content-section" id="states">
        <div className="plots-section-header">
          <h2>Chosen Designs by State</h2>
          <span className="plots-count-badge">4 States</span>
        </div>
        <p className="section-desc">
          Pick a state. Gains are extra night-time heat over a water-only tank (kWh/yr); the band is normal run-to-run variation, so a
          gain inside it is a tie. States differ in tank size and delivery target, so compare within a state.
        </p>
        <div className="section-divider" />

        <ChipTabs
          size="lg"
          ariaLabel="State"
          options={O2_STATES.map((s) => ({ id: s.id, label: s.name, sub: s.current ? "Current method" : "Legacy chain" }))}
          value={stateId}
          onChange={setStateId}
        />

        <div key={stateId} className="tab-panel">
          <div className="ui-state-head">
            <h3>{st.name}</h3>
            <span className={`tag ${st.current ? "tag-brand" : "tag-amber"}`}>{st.status}</span>
          </div>
          <StatTiles compact items={st.setup} />

          {st.regimes.length > 0 && (
            <div className="ui-cluster-grid">
              {st.regimes.map((r) => {
                const max = Math.max(...st.regimes.map((x) => Math.max(x.select, x.heldout, x.band)));
                return (
                  <div key={r.regime} className="ui-card ui-cluster-card">
                    <div className="ui-panel-head" style={{ marginBottom: 4 }}>
                      <h4 style={{ margin: 0 }}>Regime {r.regime.slice(1)}</h4>
                      <span className={`ui-badge ${regimeOk(r) ? "" : "amber"}`}>{regimeOk(r) ? "Beats water-only" : "Water-only tank"}</span>
                    </div>
                    <div className="ui-design-pcm">{r.pcm}</div>
                    <div className="ui-gain-bars">
                      {[
                        { k: "Select years", v: r.select },
                        { k: "Held-out", v: r.heldout },
                        { k: "Band", v: r.band, band: true },
                      ].map((b) => (
                        <div key={b.k} className="ui-gain-row">
                          <span>{b.k}</span>
                          <div className="ui-gain-track">
                            <div
                              className={`ui-gain-fill ${b.band ? "band" : ""} ${b.v < 0 ? "neg" : ""}`}
                              style={{ width: `${Math.max(2, (Math.abs(b.v) / max) * 100)}%` }}
                            />
                          </div>
                          <span className="ui-gain-val">{b.v.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="ui-cluster-props">
                      <div><span>Inner radius</span><span>{r.rin} mm</span></div>
                      <div><span>PCM fraction</span><span>{r.fraction}</span></div>
                      <div><span>Capsules</span><span>{r.n} · {r.pcmKg} kg</span></div>
                      <div><span>Flow</span><span>{r.flow} kg/s</span></div>
                      <div><span>Arrangement</span><span>{r.arrangement}</span></div>
                      <div><span>PCM peak</span><span>{r.peak} °C</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Callout title={`${st.name}: what the results say`} tone={st.current ? "info" : "warn"}>
            <Bullets items={st.summary} />
          </Callout>
        </div>
      </div>

      {/* ── Workflow ── */}
      <div className="content-section" id="workflow">
        <div className="plots-section-header">
          <h2>Optimization Pipeline</h2>
          <span className="plots-count-badge">{O2_WORKFLOW_STEPS.length} Steps</span>
        </div>
        <p className="section-desc">Used for Rajasthan, Tamil Nadu and Uttarakhand. Click a step.</p>
        <div className="section-divider" />
        <StepExplorer
          ariaLabel="Objective 2 pipeline steps"
          steps={O2_WORKFLOW_STEPS.map((s) => ({ title: s.title, render: () => <Bullets items={s.points} /> }))}
        />
      </div>

      {/* ── Research questions ── */}
      <div className="content-section" id="research-questions">
        <div className="plots-section-header">
          <h2>What the Results Answer</h2>
          <span className="plots-count-badge">{RESEARCH_QUESTIONS.length} Questions</span>
        </div>
        <p className="section-desc">Open a question.</p>
        <div className="section-divider" />
        <Accordion
          defaultOpen={0}
          items={RESEARCH_QUESTIONS.map((r) => ({
            id: r.q,
            title: r.q,
            children: (
              <p style={{ margin: 0 }}>{r.finding}</p>
            ),
          }))}
        />
      </div>

      {/* ── Parameter flow ── */}
      <div className="content-section" id="flow">
        <div className="plots-section-header">
          <h2>How the Design Parameters Narrow</h2>
        </div>
        <p className="section-desc">Each lane runs from the starting range to the final value of the chosen state; values are listed regime by regime.</p>
        <div className="section-divider" />

        <ChipTabs
          size="lg"
          ariaLabel="State for the parameter flow"
          options={O2_FLOW_STATES.map((x) => ({ id: x.id, label: x.label, sub: x.sub }))}
          value={flowId}
          onChange={setFlowId}
        />

        <div className="o2-lanes" role="table" aria-label="Design parameter flow">
          <div className="o2-lane-row o2-lane-head" role="row">
            <span />
            {O2_FLOW_STAGES.map((h) => <span key={h} role="columnheader">{h}</span>)}
          </div>
          {O2_FLOW_LANES.map((l) => (
            <div key={l.name} className="o2-lane-row" role="row">
              <span className="o2-lane-name">{l.name}</span>
              {l.cells.map((c, i) => (
                <span key={i} className={`o2-lane-cell ${i === 0 ? "start" : ""}`}>{flowId === "assam" && i > 0 ? "—" : c}</span>
              ))}
              <span key={flowId} className="o2-lane-cell final">{l.final[flowId]}</span>
            </div>
          ))}
        </div>
        {flowId === "assam" && (
          <p className="o2-lane-caption">Assam's legacy chain has no staged narrowing and uses its own bounds (diameter 20–80 mm, 8–24 capsules, 10–20 %); only its Phase 7 designs are shown.</p>
        )}
      </div>

      {/* ── Criteria study ── */}
      <div className="content-section criteria-compact" id="criteria">
        <div className="plots-section-header">
          <h2>Comparison with Different Parameters</h2>
          <span className="plots-count-badge">Tamil Nadu · Regime 0</span>
        </div>
        <p className="section-desc">Seven Tamil Nadu regime 0 designs (PureTemp 58, 100 L): simulator gain over the plain tank, and the Fluent 60-minute discharge. Pick one.</p>
        <div className="section-divider" />

        <ChipTabs
          ariaLabel="Design criteria"
          options={CRITERIA_STUDY.map((c) => ({ id: c.id, label: c.label, sub: `${c.pct}% of optimal` }))}
          value={criteriaId}
          onChange={setCriteriaId}
        />
        <div key={criteriaId} className="ui-panel tab-panel">
          <div className="ui-panel-head">
            <h3>{crit.label}</h3>
            <span className="ui-panel-sub">g_window {crit.gWindow.toFixed(1)} kWh/yr</span>
          </div>
          <ProgressBar value={Math.min(100, crit.pct)} label="Share of the optimal gain" />
          <p style={{ margin: "8px 0 10px", fontSize: "0.88rem" }}><strong>Verdict:</strong> {crit.verdict}</p>
          <StatTiles
            compact
            items={[
              { value: crit.rin, label: "Inner radius" },
              { value: crit.n, label: "Capsules" },
              { value: `${crit.pcmKg} kg`, label: "PCM mass" },
              { value: `${crit.flow} kg/s`, label: `Flow · ${crit.arrangement}` },
              { value: crit.water, label: "Fluent water, 60 min" },
              { value: crit.lf, label: "Fluent liquid fraction, 60 min" },
            ]}
          />
        </div>

        <h3 style={{ marginTop: 24 }}>Fluent discharge of the chosen design</h3>
        <div className="ui-two-col">
          <Figure
            src={img("tamilnadu/fluent/optimal_temp_video.gif")}
            title="Temperature during the discharge (chosen design)"
            alt="Animated Fluent temperature field of the tank and capsules during the 60-minute discharge."
            caption="Temperature every 5 simulated minutes (34 capsules drawn for 104 real)."
          />
          <Figure
            src={img("tamilnadu/fluent/optimal_liqfrac_video.gif")}
            title="PCM liquid fraction during the discharge (chosen design)"
            alt="Animated Fluent liquid-fraction field showing the capsules solidifying during the discharge."
            caption="Liquid fraction falls from 1.00 to 0.38."
          />
        </div>
      </div>

      {/* ── CFD ── */}
      <div className="content-section" id="cfd">
        <div className="plots-section-header">
          <h2>CFD Cross-Checks</h2>
          <span className="plots-count-badge">Not Validation</span>
        </div>
        <div className="section-divider" />
        <ChipTabs
          size="lg"
          ariaLabel="CFD tool"
          options={CFD_GROUPS.map((g) => ({ id: g.id, label: g.label, sub: g.sub }))}
          value={cfdId}
          onChange={setCfdId}
        />
        <div key={cfdId} className="tab-panel">
          {cfdCases.map((cfd) => (
            <div key={cfd.id} style={{ marginBottom: 24 }}>
              {cfdCases.length > 1 && (
                <div className="ui-panel-head" style={{ marginTop: 8 }}>
                  <h3>{cfd.label}</h3>
                  <span className="tag tag-zinc">{cfd.status}</span>
                </div>
              )}
              <div className="ui-panel" style={{ marginBottom: 16 }}>
                <Bullets items={cfd.points} />
              </div>
              <div className="plot-grid plot-grid-wide plot-grid-four">
                {cfd.figures.map((f) => (
                  <div key={f.file} className="plot-type">
                    <h3>{f.title}</h3>
                    <Figure src={img(f.file)} title={f.title} alt={f.caption} />
                    <p className="plot-type-caption">{f.caption}</p>
                  </div>
                ))}
              </div>
              {cfd.videos && (
                <>
                  <h3>Videos</h3>
                  <div className="plot-grid plot-grid-wide plot-grid-three">
                    {cfd.videos.map((v) => (
                      <div key={v.file} className="plot-type">
                        <h3>{v.title}</h3>
                        <VideoFigure src={img(v.file)} title={v.title} caption={v.caption} />
                        <p className="plot-type-caption">{v.caption}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Plots ── */}
      <div className="content-section" id="o2-plots">
        <div className="plots-section-header">
          <h2>Result Figures</h2>
          <span className="plots-count-badge">{plots.length} Figures</span>
        </div>
        <p className="section-desc">The core figures of each state. Click a figure to enlarge it.</p>
        <div className="section-divider" />
        <ChipTabs
          size="lg"
          ariaLabel="State for figures"
          options={plotStates.map((s) => ({ id: s.id, label: s.name }))}
          value={plotState}
          onChange={setPlotState}
        />
        <div key={plotState} className="plot-grid plot-grid-wide plot-grid-four tab-panel">
          {plots.map((p) => (
            <div key={p.num} className="plot-type">
              <h3>{p.title}</h3>
              <Figure src={img(`${plotState}/${p.file}`)} title={`${O2_STATES.find((s) => s.id === plotState).name}: ${p.title}`} alt={p.caption} />
              <p className="plot-type-caption">{p.caption}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Parameters ── */}
      <div className="content-section" id="parameters">
        <div className="plots-section-header">
          <h2>Design Vector & System Constraints</h2>
          <span className="plots-count-badge">design_space.yaml</span>
        </div>
        <p className="section-desc">Search bounds and limits of the approved v3 design space (same recipe for the three current states).</p>
        <div className="section-divider" />
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Design Parameter</th>
                <th>Config Key</th>
                <th>Bounds</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {PARAMETER_BOUNDS.map((p) => (
                <tr key={p.symbol}>
                  <td style={{ fontWeight: 600, color: "#ffffff" }}>{p.param}</td>
                  <td><code>{p.symbol}</code></td>
                  <td style={{ color: "#fbbf24", fontWeight: 600 }}>{p.bounds}</td>
                  <td>{p.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Limitations and hand-off, side by side ── */}
      <div className="side-by-side-sections">
      <div className="content-section" id="limitations">
        <div className="plots-section-header">
          <h2>Known Limitations</h2>
          <span className="plots-count-badge">Read Before Quoting</span>
        </div>
        <p className="section-desc">What the results do not support. Write "best design within the declared box", never "optimal design".</p>
        <div className="section-divider" />
        <div className="ui-panel">
          <Bullets items={O2_LIMITATIONS} />
        </div>
      </div>

      {/* ── Hand-off ── */}
      <div className="content-section" id="objective3-handoff">
        <div className="plots-section-header">
          <h2>Hand-off to Objective 3</h2>
          <span className="plots-count-badge">Contract v3</span>
        </div>
        <p className="section-desc">The environment contract passed to the DRL controller.</p>
        <div className="section-divider" />
        <div className="ui-panel">
          <Bullets items={O3_HANDOFF} />
        </div>
      </div>
      </div>
    </section>
  );
}

export default Objective2Page;
