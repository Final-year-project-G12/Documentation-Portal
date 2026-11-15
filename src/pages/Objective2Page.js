import { useState } from "react";
import Bullets from "../components/Bullets";
import Figure from "../components/Figure";
import { Rich } from "../components/Cite";
import { resetTerms } from "../data/terms";
import useReveal from "../components/useReveal";
import { StatTiles, ChipTabs, StepExplorer, Accordion, ProgressBar, Callout } from "../components/Interactive";
import {
  O2_HERO_STATS, O2_STATES, O2_WORKFLOW_STEPS, RESEARCH_QUESTIONS, CRITERIA_STUDY, CFD_CHECKS,
  O2_PLOT_GROUPS, O2_PLOTS, O2_VERIFICATION, O2_LIMITATIONS, O3_HANDOFF,
  ASSAM_PREVIEW_FILTERS, ASSAM_PREVIEW_FIGS, ASSAM_PREVIEW_STATUS_TEXT,
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
   Rajasthan is the reference state. Assam is being rebuilt (500 L,
   5 m²); its figure set is a labelled preview, not results.
   Where the sources give no citation, the text says so with [citation needed].
   ───────────────────────────────────────────────────────── */

const PARAMETER_BOUNDS = [
  { param: "Capsule inner radius (PCM thickness)", symbol: "inner_radius_m", bounds: "10 – 40 mm", unit: "mm", rationale: "Chosen designs sit at 39.5–40 mm. The widened-bound check found 45 and 50 mm worse at the same fraction. Radii above 40 mm have no capsule-size source in the files read. {{cn}}" },
  { param: "PCM volume fraction", symbol: "pcm_volume_fraction", bounds: "2 – 30 %", unit: "% of tank", rationale: "Outer capsule volume over tank volume; capsule count is derived. Raised from 20 % on 2026-10-27. Still limiting: at 40 % the gain is 37.9–47.2 kWh higher (bands 14–22). The only literature range read is 10–20 % {{cite:Chen2025TaguchiGRAPCM}}." },
  { param: "Water mass flow rate", symbol: "flow_rate_kg_s", bounds: "0.010 – 0.050 kg/s", unit: "kg/s", rationale: "Kept from the legacy bounds. The collector factor F_R does not depend on flow, so an optimum at the 0.010 floor is a model artefact." },
  { param: "Arrangement", symbol: "arrangement", bounds: "Single-layer, staggered, radial", unit: "Category", rationale: "A null on g_window at the centre anchor in all three Rajasthan regimes; it matters only for overheating hours." },
  { param: "Capsule shell", symbol: "capsule_wall_thickness_m", bounds: "0.8 mm aluminium", unit: "mm", rationale: "Fixed in the shared config; outer radius is inner radius plus shell." },
  { param: "Target delivery temperature", symbol: "delivery.target_temp_C", bounds: "45 °C (Uttarakhand 50 °C)", unit: "°C", rationale: "Every metric is built on it. Objective 1 sizes PCMs for 60 °C delivery, so the two differ; aligning them needs a shared-config change and a re-run for all states. Not done." },
  { param: "Maximum water temperature", symbol: "water_peak_limit_C", bounds: "≤ 75 °C", unit: "°C", rationale: "Scald prevention." },
  { param: "Maximum PCM temperature", symbol: "pcm_peak_limit_C", bounds: "≤ 65 °C", unit: "°C", rationale: "Material-stability limit, from manufacturer datasheets {{cite:RubithermPCM,PlussPCM}}. Infeasible if exceeded in any simulated year." },
  { param: "Tank model and step", symbol: "n_nodes, timestep_s", bounds: "10 nodes, 150 s", unit: "—", rationale: "300 s failed the time-step gate. Changing N from 10 to 20 moves the paired gain by 0.15–0.25 percentage points." },
  { param: "Fixed, not optimised", symbol: "fixed_not_optimised", bounds: "Tank, collector, demand, shortlist", unit: "—", rationale: "Rajasthan and Uttarakhand 50 L / 1.5 m² / 300 L/day; Tamil Nadu 100 L / 2.5 m²; Assam's new chain uses a 500 L tank and 5 m² collector (results pending)." },
];

const TANK_OPTIONS = [
  { label: "50 L (Rajasthan, Uttarakhand)", litres: 50 },
  { label: "100 L (Tamil Nadu)", litres: 100 },
  { label: "500 L (Assam, new chain)", litres: 500 },
];
const WALL_MM = 0.8;

function regimeOk(r) {
  return !r.noGain && r.heldout > r.band;
}

function Objective2Page() {
  resetTerms();
  const [stateId, setStateId] = useState("rajasthan");
  const [criteriaId, setCriteriaId] = useState(CRITERIA_STUDY[0].id);
  const [cfdId, setCfdId] = useState(CFD_CHECKS[0].id);
  const [plotState, setPlotState] = useState("rajasthan");
  const [plotGroup, setPlotGroup] = useState("all");
  const [assamFilter, setAssamFilter] = useState("all");
  // Geometry checker state: inner radius and count against the v3 box and the packing-free volume share
  const [radiusMm, setRadiusMm] = useState(30);
  const [capsuleCount, setCapsuleCount] = useState(40);
  const [tankIdx, setTankIdx] = useState(0);
  const revealRef = useReveal([stateId, criteriaId, cfdId, plotState, plotGroup, assamFilter]);

  const st = O2_STATES.find((s) => s.id === stateId);
  const crit = CRITERIA_STUDY.find((c) => c.id === criteriaId);
  const cfd = CFD_CHECKS.find((c) => c.id === cfdId);
  const plotStates = O2_STATES.filter((s) => s.current);
  const plots = O2_PLOTS.filter((p) => plotGroup === "all" || p.group === plotGroup);

  const tankL = TANK_OPTIONS[tankIdx].litres;
  const outerMm = radiusMm + WALL_MM;
  const capsuleLiters = (4 / 3) * Math.PI * Math.pow(outerMm / 1000, 3) * 1000;
  const totalLiters = capsuleCount * capsuleLiters;
  const volumeShare = (totalLiters / tankL) * 100;
  const radiusOk = radiusMm >= 10 && radiusMm <= 40;
  const shareOk = volumeShare >= 2 && volumeShare <= 30;

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
          options={O2_STATES.map((s) => ({ id: s.id, label: s.name, sub: s.current ? "Current method" : "Being rebuilt" }))}
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
        <p className="section-desc">
          The chain used for Rajasthan, Tamil Nadu and Uttarakhand, from the frozen inputs to the one-shot held-out test. Click a step.
        </p>
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
        <p className="section-desc">The questions the pipeline was built to answer, and what the saved results say. Open a question.</p>
        <div className="section-divider" />
        <Accordion
          defaultOpen={0}
          items={RESEARCH_QUESTIONS.map((r) => ({
            id: r.q,
            title: r.q,
            children: (
              <>
                <p className="section-desc" style={{ margin: "0 0 8px" }}>{r.detail}</p>
                <p style={{ margin: 0 }}><strong>Finding:</strong> {r.finding}</p>
              </>
            ),
          }))}
        />
      </div>

      {/* ── Criteria study ── */}
      <div className="content-section" id="criteria">
        <div className="plots-section-header">
          <h2>What If the Design Is Not the Optimum?</h2>
          <span className="plots-count-badge">Tamil Nadu · Regime 0</span>
        </div>
        <p className="section-desc">
          Seven designs for Tamil Nadu regime 0 (PureTemp 58, 100 L tank), each a real run of the optimiser's simulator against the
          plain tank, and the same designs as a Fluent whole-tank discharge (capsules melted at 70 °C, water at 30 °C, no sun). Pick one.
        </p>
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
          <p style={{ margin: "12px 0 14px" }}><strong>Verdict:</strong> {crit.verdict}</p>
          <StatTiles
            compact
            items={[
              { value: crit.rin, label: "Inner radius" },
              { value: crit.n, label: "Capsules" },
              { value: `${crit.pcmKg} kg`, label: "PCM mass" },
              { value: `${crit.flow} kg/s`, label: `Flow · ${crit.arrangement}` },
              { value: crit.water, label: "Fluent: water temperature over the discharge" },
              { value: crit.lf, label: "Fluent: PCM liquid fraction" },
            ]}
          />
        </div>

        <h3 style={{ marginTop: 24 }}>Fluent discharge of the chosen design</h3>
        <div className="ui-two-col">
          <Figure
            src={img("tamilnadu/fluent/optimal_temp_video.gif")}
            title="Temperature during the discharge (chosen design)"
            alt="Animated Fluent temperature field of the tank and capsules during a 2-hour evening discharge."
            caption="Temperature field every 5 simulated minutes (2-D planar proxy: 34 capsules drawn for 104 real)."
          />
          <Figure
            src={img("tamilnadu/fluent/optimal_liqfrac_video.gif")}
            title="PCM liquid fraction during the discharge (chosen design)"
            alt="Animated Fluent liquid-fraction field showing the capsules solidifying during the discharge."
            caption="Liquid fraction falls from 1.00 to 0.38 as the capsules release heat to the water."
          />
        </div>
        <Figure
          src={img("tamilnadu/fluent/FLUENT_comparison_all_criteria.png")}
          title="Fluent discharge, all seven designs"
          alt="Water temperature, PCM temperature and liquid fraction over the discharge for the seven criteria designs."
          caption="All seven designs overlaid: fewer or smaller capsules deliver less heat to the water."
        />
      </div>

      {/* ── CFD ── */}
      <div className="content-section" id="cfd">
        <div className="plots-section-header">
          <h2>CFD Cross-Checks</h2>
          <span className="plots-count-badge">Not Validation</span>
        </div>
        <p className="section-desc">
          Three claims are kept apart: simulator verification (done), CFD model-consistency cross-checks (below, incomplete) and
          experimental validation (not done). Pick a check.
        </p>
        <div className="section-divider" />
        <ChipTabs
          size="lg"
          ariaLabel="CFD check"
          options={CFD_CHECKS.map((c) => ({ id: c.id, label: c.label, sub: c.status }))}
          value={cfdId}
          onChange={setCfdId}
        />
        <div key={cfdId} className="tab-panel">
          <div className="ui-panel" style={{ marginBottom: 16 }}>
            <Bullets items={cfd.points} />
          </div>
          <div className="plot-grid plot-grid-wide">
            {cfd.figures.map((f) => (
              <div key={f.file} className="plot-type">
                <h3>{f.title}</h3>
                <Figure src={img(f.file)} title={f.title} alt={f.caption} />
                <p className="plot-type-caption">{f.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Plots ── */}
      <div className="content-section" id="o2-plots">
        <div className="plots-section-header">
          <h2>Result Figures</h2>
          <span className="plots-count-badge">{plots.length} Figures</span>
        </div>
        <p className="section-desc">
          The same core figures for each current-method state, from each state's <code>make_all_plots.py</code>. Pick a state and a
          group; click a figure to enlarge it.
        </p>
        <div className="section-divider" />
        <ChipTabs
          size="lg"
          ariaLabel="State for figures"
          options={plotStates.map((s) => ({ id: s.id, label: s.name }))}
          value={plotState}
          onChange={setPlotState}
        />
        <ChipTabs ariaLabel="Figure group" options={O2_PLOT_GROUPS} value={plotGroup} onChange={setPlotGroup} />
        <div key={`${plotState}-${plotGroup}`} className="plot-grid plot-grid-wide tab-panel">
          {plots.map((p) => (
            <div key={p.num} className="plot-type">
              <h3>{p.title}</h3>
              <Figure src={img(`${plotState}/${p.file}`)} title={`${O2_STATES.find((s) => s.id === plotState).name}: ${p.title}`} alt={p.caption} />
              <p className="plot-type-caption">{p.caption}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Assam figure-set preview ── */}
      <div className="content-section" id="assam-preview">
        <div className="plots-section-header">
          <h2>Assam: Figure-Set Preview</h2>
          <span className="plots-count-badge">Not Results</span>
        </div>
        <p className="section-desc">
          The 40 figures Assam's new chain will produce, generated ahead of the runs so the layout can be reviewed. Filter by status;
          every figure is labelled.
        </p>
        <div className="section-divider" />
        <Callout title="Read this first" tone="warn">
          Only 2 figures show real project data (the planned DOE and the weather inputs). 20 are illustrative: their numbers are
          placeholder values anchored to a provisional design table, not simulated, optimised or validated. 18 are empty frames that
          name the milestone still needed. Do not quote any illustrative value as an Assam result.
        </Callout>
        <ChipTabs ariaLabel="Assam figure status" options={ASSAM_PREVIEW_FILTERS} value={assamFilter} onChange={setAssamFilter} />
        <div key={assamFilter} className="plot-grid plot-grid-wide tab-panel">
          {ASSAM_PREVIEW_FIGS.filter((f) => assamFilter === "all" || f.status === assamFilter).map((f) => (
            <div key={f.n} className="plot-type">
              <div className="ui-panel-head" style={{ marginBottom: 6 }}>
                <h3 style={{ margin: 0 }}>Fig. {f.n} · {f.title}</h3>
                <span className={`ui-badge ${f.status === "real" ? "" : f.status === "illustrative" ? "amber" : "muted"}`}>
                  {f.status === "real" ? "Real data" : f.status === "illustrative" ? "Illustrative" : "Pending"}
                </span>
              </div>
              <Figure src={img(`assam/fig${f.n}.png`)} title={`Assam (preview): ${f.title}`} alt={`${f.title} — ${ASSAM_PREVIEW_STATUS_TEXT[f.status]}`} />
              <p className="plot-type-caption">{ASSAM_PREVIEW_STATUS_TEXT[f.status]}.</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Geometry checker ── */}
      <div className="content-section" id="interactive-explorer">
        <div className="plots-section-header">
          <h2>Capsule Geometry Checker</h2>
          <span className="plots-count-badge">v3 Design Box</span>
        </div>
        <p className="section-desc">
          Move the sliders to test a capsule design against the inner-radius (10–40 mm) and PCM-fraction (2–30%) bounds. This is plain
          sphere geometry, not a performance estimate; the real packing check also tests spacing (3 mm) and passage fraction (0.05).
        </p>
        <div className="section-divider" />

        <div className="design-estimator-wrapper">
          <div className="estimator-controls">
            <div className="estimator-control-group">
              <label>
                Tank volume:
                <span className="estimator-val">{tankL} L</span>
              </label>
              <select value={tankIdx} onChange={(e) => setTankIdx(Number(e.target.value))}>
                {TANK_OPTIONS.map((t, i) => (
                  <option key={t.label} value={i}>{t.label}</option>
                ))}
              </select>
              <span className="range-hint">Fixed per state, not a design variable</span>
            </div>

            <div className="estimator-control-group">
              <label>
                Capsule inner radius:
                <span className="estimator-val">{radiusMm} mm</span>
              </label>
              <input type="range" min="10" max="40" step="1" value={radiusMm} onChange={(e) => setRadiusMm(Number(e.target.value))} />
              <span className="range-hint">Approved range 10–40 mm; the PCM thickness equals this radius</span>
            </div>

            <div className="estimator-control-group">
              <label>
                Capsule count:
                <span className="estimator-val">{capsuleCount} capsules</span>
              </label>
              <input type="range" min="4" max="160" step="1" value={capsuleCount} onChange={(e) => setCapsuleCount(Number(e.target.value))} />
              <span className="range-hint">The search derives the count from the fraction; here you set it directly</span>
            </div>
          </div>

          <div className="estimator-display">
            <div className="estimator-display-title">Geometry Results</div>
            <div className="estimator-metrics-grid">
              <div className="estimator-metric-box">
                <span className="metric-box-label">Outer Radius</span>
                <span className="metric-box-val">{outerMm.toFixed(1)} mm</span>
                <span className="metric-box-sub">{radiusOk ? "Inner radius within 10–40 mm" : "Adjust toward 10–40 mm"}</span>
              </div>
              <div className="estimator-metric-box">
                <span className="metric-box-label">Outer Volume per Capsule</span>
                <span className="metric-box-val">{capsuleLiters.toFixed(3)} L</span>
                <span className="metric-box-sub">Sphere, 4/3 · π · R³, with a 0.8 mm shell</span>
              </div>
              <div className="estimator-metric-box">
                <span className="metric-box-label">Total Capsule Volume</span>
                <span className="metric-box-val">{totalLiters.toFixed(2)} L</span>
                <span className="metric-box-sub">{capsuleCount} capsules</span>
              </div>
              <div className="estimator-metric-box">
                <span className="metric-box-label">Share of {tankL} L Tank</span>
                <span className="metric-box-val">{volumeShare.toFixed(1)}%</span>
                <span className="metric-box-sub">{shareOk ? "Within 2–30%" : "Adjust toward 2–30%"}</span>
              </div>
            </div>
            <div className="estimator-status-note">
              <strong>Bounds check:</strong> {radiusOk && shareOk ? "both bounds met." : "adjust a slider to bring both within range."}
            </div>
          </div>
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
                <th>Rationale</th>
              </tr>
            </thead>
            <tbody>
              {PARAMETER_BOUNDS.map((p) => (
                <tr key={p.symbol}>
                  <td style={{ fontWeight: 600, color: "#ffffff" }}>{p.param}</td>
                  <td><code>{p.symbol}</code></td>
                  <td style={{ color: "#fbbf24", fontWeight: 600 }}>{p.bounds}</td>
                  <td>{p.unit}</td>
                  <td style={{ fontSize: "0.82rem" }}><Rich text={p.rationale} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Verification ── */}
      <div className="content-section" id="deliverables">
        <div className="plots-section-header">
          <h2>Verification & Status</h2>
          <span className="plots-count-badge">{O2_VERIFICATION.filter((v) => v.ok).length} of {O2_VERIFICATION.length} Done</span>
        </div>
        <p className="section-desc">What was checked, how it came out, and what is not done.</p>
        <div className="section-divider" />
        <div className="ui-qc-grid">
          {O2_VERIFICATION.map((v) => (
            <div key={v.name} className="ui-card">
              <div className="ui-panel-head" style={{ marginBottom: 6 }}>
                <span className="ui-card-kicker" style={{ margin: 0 }}>{v.area}</span>
                <span className={`ui-badge ${v.ok ? "" : "amber"}`}>{v.status}</span>
              </div>
              <h4>{v.name}</h4>
              <p>{v.result}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Limitations ── */}
      <div className="content-section" id="limitations">
        <div className="plots-section-header">
          <h2>Known Limitations</h2>
          <span className="plots-count-badge">Read Before Quoting</span>
        </div>
        <p className="section-desc">What the results do not support. Write "best design within the declared box", never "optimal design".</p>
        <div className="section-divider" />
        <Accordion defaultOpen={0} items={O2_LIMITATIONS.map((l) => ({ id: l.title, title: l.title, children: <p style={{ margin: 0 }}>{l.text}</p> }))} />
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
    </section>
  );
}

export default Objective2Page;
