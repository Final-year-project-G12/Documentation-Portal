import { useState } from "react";
import Bullets from "../components/Bullets";
import { Rich } from "../components/Cite";
import { Terms } from "../components/Terms";
import { resetTerms } from "../data/terms";

/* ─────────────────────────────────────────────────────────
   Objective2Page.js — AI-Driven Storage Design Optimization
   Final Year Project — Group 12 | Department of CSE
   Amrita School of Engineering

   Content follows OBJECTIVE2/Objective---2: docs/00–11, METHODS.md,
   configs/system_config_shared.yaml, configs/design_bounds_shared.yaml and
   the Objective 3 environment contract. Where the docs do not give a
   source, the text says so with [citation needed].
   ───────────────────────────────────────────────────────── */

const O2_DELIVERABLES = [
  {
    id: "Phase 1",
    name: "Frozen configuration",
    contents: "system_config_shared.yaml and design_bounds_shared.yaml, identical for all four states.",
    criterion: "Hardware and bounds are not tuned per state, so climate is the only varying factor.",
    status: "Frozen (config_v1.0_2026-09-05)",
    done: true,
    tag: "Configuration",
  },
  {
    id: "Phase 2",
    name: "Geometry & constraint engine",
    contents: "Design vector [capsule_diameter_m, n_capsule, flow_rate_kg_s]; volume, area, spacing and pressure-drop checks.",
    criterion: "Every design gets a valid/invalid flag with one reason code; 8 boundary cases are deterministic in all four states.",
    status: "Verified (all four states)",
    done: true,
    tag: "Geometry",
  },
  {
    id: "Phase 3",
    name: "Grey-box enthalpy simulator",
    contents: "Enthalpy-method PCM model, flat-plate collector, packed-bed heat transfer and a 5-minute time step.",
    criterion: "Released as sim_v1_<state> once residual is under 0.5% and at least 3 of 5 gates are clean.",
    status: "Released (all four states)",
    done: true,
    tag: "Thermal solver",
  },
  {
    id: "Phase 4",
    name: "Simulator verification gates",
    contents: "5 gates: energy conservation, limiting cases, baseline comparison, published benchmark, sensitivity.",
    criterion: "Go/No-Go: GO in all four states; 5/5 clean only in Rajasthan, 4/5 elsewhere.",
    status: "GO (all four states)",
    done: true,
    tag: "Verification",
  },
  {
    id: "Phase 5",
    name: "Latin Hypercube DOE",
    contents: "165 (Rajasthan, Assam) or 215 (Tamil Nadu, Uttarakhand) cases per state; 111 or 145 are valid.",
    criterion: "About 32.6–32.7% of cases are rejected by the geometry bounds; they are kept for the feasibility classifier.",
    status: "Generated (all four states)",
    done: true,
    tag: "Simulation bank",
  },
  {
    id: "Phase 6",
    name: "ExtraTrees surrogate",
    contents: "One ExtraTreesRegressor per target plus a feasibility classifier, each compared with a linear baseline.",
    criterion: "Useful-energy hold-out R² is 0.9977–0.99989 across states; the framework target was above 0.80.",
    status: "Trained (all four states)",
    done: true,
    tag: "Machine learning",
  },
  {
    id: "Phase 7",
    name: "Random search and confirmation",
    contents: "400 random candidates per regime-PCM pair (Assam: 1,000); the top 5 per pair are re-run in the real simulator.",
    criterion: "Every proposed design is re-simulated; mean surrogate-vs-simulator error is 0.02–0.51%.",
    status: "Done; Assam unvalidated",
    done: false,
    tag: "Optimization",
  },
  {
    id: "Phase 8",
    name: "Robustness, cards and hand-off",
    contents: "120 Monte Carlo re-runs per design, recommendation cards and the Objective 3 contract file.",
    criterion: "Robust means P(demand) of at least 75% and P(temp-safe) of at least 95%; no regime meets it.",
    status: "Done for 3 of 4 states",
    done: false,
    tag: "Uncertainty",
  },
];

const O2_WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Frozen Configuration",
    tag: "Phase 1",
    points: [
      "Fixes the hardware once, identical for all four states.",
      "Collector: 1.5 m² flat-plate {{cite:Singh2025PCMSWH}}; tank: 50 L {{cite:Chen2025TaguchiGRAPCM}}.",
      "Limits: 75 °C water, 65 °C PCM and a 45 °C delivery target.",
      "Why: if hardware also varied by state, climate effects would be confounded with hardware effects.",
    ],
  },
  {
    step: "02",
    title: "Geometry & Constraint Engine",
    tag: "Phase 2",
    points: [
      "Takes a design vector of capsule diameter, capsule count and flow rate.",
      "Capsules are spheres in a staggered layout; other shapes are future work.",
      "Pressure drop comes from the Ergun packed-bed equation {{cite:Ergun1952PackedColumns}}.",
      "Returns valid or invalid, with one reason code.",
    ],
  },
  {
    step: "03",
    title: "Grey-Box Enthalpy Simulator",
    tag: "Phase 3",
    points: [
      "Simulates a full year with a 5-minute time step.",
      "Parts: lumped enthalpy PCM model, flat-plate collector, packed-bed heat transfer.",
      "Why not CFD or pure ML: CFD is too slow for thousands of runs, and there is no hardware data to train on.",
      "Model sources: Hottel–Whillier–Bliss collector {{cite:HottelWhillier1958Collector,Bliss1959CollectorFactor}}; Wakao–Kaguei heat transfer {{cite:WakaoKaguei1982PackedBeds}}.",
    ],
  },
  {
    step: "04",
    title: "Verification Gates",
    tag: "Phase 4",
    points: [
      "Runs a 5-gate battery before any design result is trusted.",
      "All four states get GO; only Rajasthan is 5/5 clean.",
      "Assam fails Gate 3: plain water beats the shortlisted PCM and a matched-Tm synthetic PCM.",
      "Gate 4 compares solar fraction with a 54–84% benchmark band {{cite:Singh2025PCMSWH}}.",
    ],
  },
  {
    step: "05",
    title: "Latin Hypercube Sampling (DOE)",
    tag: "Phase 5",
    points: [
      "Samples diameter, flow rate and capsule count with Latin Hypercube Sampling {{cite:McKayBeckmanConover1979LHS}}.",
      "Adds 6 boundary cases per regime-PCM pair and no-PCM baseline cases.",
      "Totals: 215 / 165 / 165 / 215 cases for Tamil Nadu / Rajasthan / Assam / Uttarakhand.",
      "Infeasible cases stay in the data so the classifier sees negative examples.",
    ],
  },
  {
    step: "06",
    title: "ExtraTrees Surrogate",
    tag: "Phase 6",
    points: [
      "Trains one 300-tree ExtraTrees model per target, plus a feasibility classifier {{cite:Geurts2006ExtraTrees}}.",
      "Each model is compared with a linear-regression baseline on the same split.",
      "Useful-energy hold-out R² is 0.9977–0.99989, on only 18–30 valid hold-out rows per state.",
      "Caveat: linear regression ties or beats the trees on several targets, so the design region is close to linear.",
      "The surrogate only ranks proposals; the real simulator makes the final call.",
    ],
  },
  {
    step: "07",
    title: "Random Search, Then Confirm",
    tag: "Phase 7",
    points: [
      "Scores 400 random designs per regime-PCM pair with the surrogate (Assam: 1,000).",
      "Re-runs the top 5 per pair in the real simulator.",
      "Selection: drop unsafe designs, keep those within 5% of the best useful energy, then minimise pump energy, PCM mass and capsule count.",
      "Not NSGA-II: a full genetic search needs far more simulator calls than the 40-hour-per-state budget allows.",
      "Caveat: the reduced search was not checked against NSGA-II or active learning.",
    ],
  },
  {
    step: "08",
    title: "Robustness & Objective 3 Hand-off",
    tag: "Phase 8",
    points: [
      "Re-simulates each chosen design 120 times in the real simulator, not the surrogate.",
      "Each run perturbs latent heat, weather, demand and mains temperature {{cite:Chopra2023MonteCarloETC}}.",
      "Writes recommendation cards and an Objective 3 contract file for Tamil Nadu, Rajasthan and Uttarakhand.",
      "Assam has no Phase 8 and no contract file yet.",
    ],
  },
];

const PARAMETER_BOUNDS = [
  { param: "Capsule diameter", symbol: "capsule_diameter_m", bounds: "20 – 80 mm", unit: "mm", rationale: "Sampled directly; PCM thickness is derived from it." },
  { param: "PCM conduction thickness", symbol: "pcm_thickness_m", bounds: "20 – 100 mm", unit: "mm", rationale: "Derived as diameter / 2. A diameter under 40 mm breaks the 20 mm floor, which rejects about a third of the diameter range." },
  { param: "Capsule count", symbol: "capsule_count", bounds: "8 – 24 units", unit: "Count", rationale: "Frozen bound; the config records no further reason. {{cn}}" },
  { param: "Capsule shape and layout", symbol: "capsule_shape", bounds: "Sphere, staggered only", unit: "Category", rationale: "Cut to fit the 40-hour-per-state budget; other shapes are future work." },
  { param: "PCM Volume Fraction", symbol: "pcm_volume_fraction", bounds: "10% – 20%", unit: "%", rationale: "DOE levels 10 / 15 / 20%, following the PCM-volume sweep in {{cite:Chen2025TaguchiGRAPCM}}." },
  { param: "Water mass flow rate", symbol: "flow_rate_kg_s", bounds: "0.010 – 0.050 kg/s", unit: "kg/s", rationale: "Pump flow range of the frozen config." },
  { param: "Target delivery temperature", symbol: "delivery.target_temp_C", bounds: "≥ 45.0 °C", unit: "°C", rationale: "Usable hot water. Objective 1 uses a 60 °C delivery basis, so the two differ." },
  { param: "Maximum water temperature", symbol: "max_water_temp_C", bounds: "≤ 75 °C", unit: "°C", rationale: "Scald prevention." },
  { param: "Maximum PCM temperature", symbol: "max_pcm_temp_C", bounds: "≤ 65 °C", unit: "°C", rationale: "Material-stability limit, from manufacturer datasheets {{cite:RubithermPCM,PlussPCM}}." },
  { param: "Maximum pressure", symbol: "max_pressure_bar", bounds: "≤ 3.5 bar", unit: "bar", rationale: "Frozen limit, checked in the geometry gate." },
];

const TANK_L = 50;

function Objective2Page() {
  resetTerms();
  // Geometry checker state: two of the three design variables, checked against the frozen bounds
  const [diameterMm, setDiameterMm] = useState(40);
  const [capsuleCount, setCapsuleCount] = useState(16);

  const thicknessMm = diameterMm / 2;
  const capsuleLiters = (Math.PI / 6) * Math.pow(diameterMm / 1000, 3) * 1000;
  const totalLiters = capsuleCount * capsuleLiters;
  const volumeShare = (totalLiters / TANK_L) * 100;
  const thicknessOk = thicknessMm >= 20 && thicknessMm <= 100;
  const shareOk = volumeShare >= 10 && volumeShare <= 20;

  return (
    <section className="content" id="top">
      {/* ── Page Hero ── */}
      <div className="page-hero">
        <div className="eyebrow">
          <span className="eyebrow-badge">Research Module · Objective 2</span>
          <span>Surrogate Design & Optimization Layer</span>
        </div>

        <h1>AI-Driven PCM Storage Design Optimization</h1>


        <div className="results-grid" style={{ marginBottom: 40 }}>
          <div className="result-stat-card">
            <div className="result-stat-value">8 Phases</div>
            <div className="result-stat-label">End-to-End Computational Workflow</div>
          </div>
          <div className="result-stat-card">
            <div className="result-stat-value">165–215</div>
            <div className="result-stat-label">LHS DOE Cases per State (111–145 valid)</div>
          </div>
          <div className="result-stat-card">
            <div className="result-stat-value">R² 0.9977–0.9999</div>
            <div className="result-stat-label">ExtraTrees Hold-out R², Useful Energy, per State</div>
          </div>
          <div className="result-stat-card">
            <div className="result-stat-value">3 of 4</div>
            <div className="result-stat-label">States with a Completed Phase 8 and Objective 3 Contract</div>
          </div>
        </div>
      </div>

      {/* ── 8-Step Implementation Workflow ── */}
      <div className="content-section" id="workflow">
        <div className="plots-section-header">
          <h2>Computational Optimization Pipeline</h2>
          <span className="plots-count-badge">8 Phases</span>
        </div>
        <p className="section-desc">
          The eight phases, from the frozen configuration to the Objective 3 hand-off.
        </p>
        <div className="section-divider" />

        <div className="methods-grid">
          {O2_WORKFLOW_STEPS.map((s) => (
            <div key={s.step} className="method-card">
              <div className="method-card-tag">{s.tag}</div>
              <h3>{s.step}. {s.title}</h3>
              <Bullets items={s.points} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Core Research Questions ── */}
      <div className="content-section" id="research-questions">
        <div className="plots-section-header">
          <h2>Core Engineering Research Questions</h2>
          <span className="plots-count-badge">Problem Formulation</span>
        </div>
        <p className="section-desc">
          Questions the Phase 1–8 pipeline was built to answer.
        </p>
        <div className="section-divider" />

        <Bullets
          items={[
            "<strong>Geometry:</strong> how do capsule diameter, capsule count and flow rate change useful energy, PCM temperature and pump energy?",
            "<strong>PCM or plain tank:</strong> does the Objective 1 PCM beat a plain tank under the 75 °C and 65 °C safety limits?",
            "Finding so far: a plain tank is selected in most regimes.",
            "<strong>Climate dependence:</strong> does the best design change with the climate regime when the hardware is frozen?",
            "<strong>Surrogate accuracy:</strong> can an ExtraTrees surrogate stand in for the year-long simulator?",
            "Finding so far: mean surrogate-vs-simulator error on confirmed designs is 0.02–0.51%.",
            "<strong>Robustness:</strong> do the chosen designs hold up when weather, demand, latent heat and mains temperature vary?",
            "Finding so far: no regime in any completed state meets the robustness rule.",
          ]}
        />
      </div>

      {/* ── Geometry checker ── */}
      <div className="content-section" id="interactive-explorer">
        <div className="plots-section-header">
          <h2>Capsule Geometry Checker</h2>
          <span className="plots-count-badge">Frozen Bounds</span>
        </div>
        <p className="section-desc">
          Move the sliders to test a capsule design against two of the frozen bounds.
        </p>
        <Bullets
          items={[
            "This is plain geometry for spheres in the frozen 50 L tank, not a performance estimate.",
            "It checks the thickness range (20–100 mm) and the PCM volume share (10–20%) only.",
            "The real Phase 2 gate also checks spacing, free-flow area and pressure drop.",
          ]}
        />
        <div className="section-divider" />

        <div className="design-estimator-wrapper">
          <div className="estimator-controls">
            <div className="estimator-control-group">
              <label>
                Capsule diameter:
                <span className="estimator-val">{diameterMm} mm</span>
              </label>
              <input
                type="range"
                min="20"
                max="80"
                step="2"
                value={diameterMm}
                onChange={(e) => setDiameterMm(Number(e.target.value))}
              />
              <span className="range-hint">Frozen range 20–80 mm; thickness is half the diameter</span>
            </div>

            <div className="estimator-control-group">
              <label>
                Capsule count:
                <span className="estimator-val">{capsuleCount} capsules</span>
              </label>
              <input
                type="range"
                min="8"
                max="24"
                step="1"
                value={capsuleCount}
                onChange={(e) => setCapsuleCount(Number(e.target.value))}
              />
              <span className="range-hint">Frozen range 8–24 capsules</span>
            </div>
          </div>

          <div className="estimator-display">
            <div className="estimator-display-title">Geometry Results</div>

            <div className="estimator-metrics-grid">
              <div className="estimator-metric-box">
                <span className="metric-box-label">Conduction Thickness</span>
                <span className="metric-box-val">{thicknessMm.toFixed(0)} mm</span>
                <span className="metric-box-sub">{thicknessOk ? "Within 20–100 mm" : "Outside 20–100 mm"}</span>
              </div>

              <div className="estimator-metric-box">
                <span className="metric-box-label">Volume per Capsule</span>
                <span className="metric-box-val">{capsuleLiters.toFixed(3)} L</span>
                <span className="metric-box-sub">Sphere, π/6 × D³</span>
              </div>

              <div className="estimator-metric-box">
                <span className="metric-box-label">Total PCM Volume</span>
                <span className="metric-box-val">{totalLiters.toFixed(2)} L</span>
                <span className="metric-box-sub">{capsuleCount} capsules</span>
              </div>

              <div className="estimator-metric-box">
                <span className="metric-box-label">Share of 50 L Tank</span>
                <span className="metric-box-val">{volumeShare.toFixed(1)}%</span>
                <span className="metric-box-sub">{shareOk ? "Within 10–20%" : "Outside 10–20%"}</span>
              </div>
            </div>

            <div className="estimator-status-note">
              <strong>Bounds check:</strong> {thicknessOk && shareOk ? "both bounds met." : "at least one bound is not met."}
            </div>
          </div>
        </div>
      </div>

      {/* ── Technical Parameter Specifications Table ── */}
      <div className="content-section" id="parameters">
        <div className="plots-section-header">
          <h2>Design Vector & System Constraints</h2>
          <span className="plots-count-badge">design_bounds_shared.yaml</span>
        </div>
        <p className="section-desc">
          Search bounds and limits, frozen and identical for all four states.
        </p>
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

      {/* ── Phase deliverables ── */}
      <div className="content-section" id="deliverables">
        <div className="plots-section-header">
          <h2>Objective 2 Phase Deliverables & Verification Status</h2>
          <span className="plots-count-badge">Phases 1 – 8</span>
        </div>
        <p className="section-desc">
          What each phase produced, how it was checked, and where it stands.
        </p>
        <div className="section-divider" />

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Phase</th>
                <th>Deliverable Name</th>
                <th>Area</th>
                <th>Content</th>
                <th>Verification</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {O2_DELIVERABLES.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 700, color: "#ffffff" }}>{d.id}</td>
                  <td style={{ fontWeight: 600, color: "#f4f4f5" }}>{d.name}</td>
                  <td><span className="tag tag-zinc">{d.tag}</span></td>
                  <td style={{ fontSize: "0.82rem" }}><Terms text={d.contents} /></td>
                  <td style={{ fontSize: "0.82rem" }}><Terms text={d.criterion} /></td>
                  <td>
                    <span className={`tag ${d.done ? "tag-brand" : "tag-amber"}`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Objective 3 Hand-Off Specification ── */}
      <div className="content-section" id="objective3-handoff">
        <div className="plots-section-header">
          <h2>Downstream Objective 3 Interface Hand-off</h2>
          <span className="plots-count-badge">Contract JSON</span>
        </div>
        <p className="section-desc">
          Environment contract passed to Objective 3 (the DRL controller), one file per state.
        </p>
        <div className="section-divider" />

        <Bullets
          items={[
            "<strong>Boundary:</strong> Objective 3 chooses the real-time action and nothing else.",
            "It cannot change the PCM, capsule geometry, tank volume, safety limits or the physics model.",
            {
              text: "<strong>State:</strong> 15 fields per control step; some are measurable, others need an estimator.",
              details: "Measurable: I_t, T_amb_t, T_water_t, T_in_t, T_out_t, D_t, t_day, d_season, mdot_t, dp_t, mode_t. Estimator needed: T_pcm_t, f_melt_t, H_pcm_t, E_unmet_t.",
            },
            {
              text: "<strong>Action:</strong> a mode (charge, discharge or bypass), with an optional continuous flow rate.",
              details: "Hybrid version (mode + flow_rate_kg_s within 0.010–0.050 kg/s) is recommended; control step is 300 s.",
            },
            "<strong>Safety shield:</strong> a rule-based wrapper with a 3 °C guard band below the hard limits.",
            "Water at 72 °C or higher forces bypass; PCM at 62 °C or higher (PCM regimes) forces bypass or discharge.",
            "It also acts on over-pressure, out-of-range flow, a dry-run pump and missing sensor readings.",
            {
              text: "<strong>Reward:</strong> delivered energy minus unmet energy, pump energy, safety penalty and bypass switching.",
              details: "r_t = w1·(Q_delivered/ref) − w2·(E_unmet/ref) − w3·(E_pump/ref) − w4·Penalty_safety − w5·Penalty_bypass; defaults w1…w5 = 1.0 / 1.0 / 0.1 / 10.0 / 0.05.",
            },
            "Caveat: no backup heater is modelled in any state, so unmet energy is genuinely undelivered heat.",
            "Caveat: only one medoid weather year exists per regime, so training, validation and test weather are not split yet.",
          ]}
        />
      </div>
    </section>
  );
}

export default Objective2Page;
