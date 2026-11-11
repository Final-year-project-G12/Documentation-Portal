import { useState } from "react";
import Bullets from "../components/Bullets";
import Figure from "../components/Figure";
import { Rich } from "../components/Cite";
import { Terms } from "../components/Terms";
import { resetTerms } from "../data/terms";

/* ─────────────────────────────────────────────────────────
   Objective2Page.js — AI-Driven Storage Design Optimization
   Final Year Project — Group 12 | Department of CSE
   Amrita School of Engineering

   Content follows OBJECTIVE2/Objective---2 as merged to main on
   2026-11-11: objective2-rajasthan/{README, docs/01–07, configs/*.yaml},
   objective2-tamilnadu/{OVERVIEW.md, docs/04_RESULTS.md},
   objective2-uttarakhand/{README.md, docs/PROGRESS.md} and
   objective2-assam/{README.md, docs/00_MASTER_OVERVIEW.md}.
   Rajasthan is the reference state. Assam is still the legacy chain.
   Where the sources give no citation, the text says so with [citation needed].
   ───────────────────────────────────────────────────────── */

const O2_STATES = [
  {
    state: "Rajasthan",
    chain: "Current (v3, reference)",
    basis: "50 L tank, 1.5 m² collector, 300 L/day, 45 °C delivery",
    result: "savE® OM55 / PureTemp 60 / PureTemp 58. g_window 130.4 / 137.4 / 140.6 kWh/yr on the select years 2021–2023 (bands 21.1 / 14.4 / 21.9).",
    heldout: "Once, on 2011–2015: 137.5 / 145.7 / 149.3 kWh/yr (run heldout_3242a7f4fd8a).",
    status: "Contract v2 written. Boundary-limited, sizing below IS 12976:2023, CFD unvalidated.",
    done: true,
  },
  {
    state: "Tamil Nadu",
    chain: "Current (method ported from Rajasthan)",
    basis: "100 L tank, 2.5 m² collector, 300 L/day, 45 °C delivery",
    result: "PureTemp 58 / RT57HC / RT57HC. g_window 276.6 / 225.5 / 262.9 kWh/yr on the select years (bands 28.4 / 26.0 / 29.5).",
    heldout: "Once: 9 of 9 held-out designs beat the plain tank; PCM peak 63.4–64.0 °C, water peak 72.2–72.9 °C.",
    status: "Fluent used as a model-consistency cross-check only. O1 sized PCMs at 60 °C but O2 scores at 45 °C.",
    done: true,
  },
  {
    state: "Uttarakhand",
    chain: "Current (method ported from Rajasthan)",
    basis: "50 L tank, 1.5 m² collector, 50 °C delivery; inputs are the O1 K = 4 regimes",
    result: "PCM helps in regimes 0–2; regime 3 (cold, high altitude) does not, and the recommendation there is a water-only tank.",
    heldout: "Once, on 2024–2025: chosen designs 76.0 / 61.8 / 56.4 / −6.1 kWh/yr for regimes 0–3 (run heldout_c75ac0e6fb78).",
    status: "O1 main has K = 5, so the two are not reconciled. OpenFOAM cases written, not run.",
    done: true,
  },
  {
    state: "Assam",
    chain: "Legacy, not reconciled with the current method",
    basis: "50 L tank, 1.5 m² collector, 100 L/day, 45 °C delivery; 129-point O1 inputs",
    result: "Phase 7 designs exceed the 65 °C PCM limit by 1.1–5.0 °C (peaks 66.1 / 67.7 / 70.0 °C). Plain water beat every PCM option in the Phase 4 Gate 3.",
    heldout: "None.",
    status: "Phase 8 exists but reads P(temp-safe) 0.13 / 0.02 / 0.00 against 0.95, so it is not a valid Objective 3 input.",
    done: false,
  },
];

const O2_VERIFICATION = [
  {
    id: "Check 1",
    name: "Time-step convergence",
    contents: "Annual energy compared as the time step is halved.",
    criterion: "300 s failed the gate, so the solver step is 150 s.",
    status: "Done (Rajasthan)",
    done: true,
    tag: "Verification",
  },
  {
    id: "Check 2",
    name: "Multi-node tank",
    contents: "Ten-node stratified tank, compared with the single-node tank.",
    criterion: "Changing N from 10 to 20 moves the paired gain by 0.15–0.25 percentage points; this is part of the band.",
    status: "Done (Rajasthan)",
    done: true,
    tag: "Verification",
  },
  {
    id: "Check 3",
    name: "Solar-fraction benchmark",
    contents: "Plain-tank solar fraction against the 54–84% literature band.",
    criterion: "The repaired model sits below the band (about 0.36 single-node, 0.30–0.33 multi-node at the old designs). Reported, not tuned.",
    status: "Below band",
    done: false,
    tag: "Verification",
  },
  {
    id: "Step 5",
    name: "Screening and DOE",
    contents: "Taguchi L9 screening per regime-PCM pair, then 128 scrambled-Sobol points per pair over the v3 box.",
    criterion: "Rajasthan DOE: 1,152 designs, 1,089 valid, 63 rejected by the geometry engine.",
    status: "Done (Rajasthan)",
    done: true,
    tag: "Simulation bank",
  },
  {
    id: "Step 6",
    name: "Surrogate comparison",
    contents: "Neural-network ensemble, XGBoost and quadratic RSM, compared on rank agreement within each pair.",
    criterion: "Rajasthan: XGBoost wins 6 and RSM 3 of 9 pairs; the NN ensemble wins none and is used only as a committee member.",
    status: "Done (Rajasthan)",
    done: true,
    tag: "Machine learning",
  },
  {
    id: "Step 7",
    name: "NSGA-II and dense-grid check",
    contents: "NSGA-II on the winning surrogate, 3 seeds, with committee-disagreement active learning; 720-run dense grid for the rank-1 PCM of each regime.",
    criterion: "All three rank-1 pairs pass within the band at the first attempt in v3. The grid contains the box vertices, so the pass is not fully independent evidence.",
    status: "Done (Rajasthan)",
    done: true,
    tag: "Optimization",
  },
  {
    id: "Step 8",
    name: "Selection and held-out test",
    contents: "Selection funnel fixed before the test, then one run on untouched years under a lock file.",
    criterion: "45 held-out rows (9 designs × 5 years): g_window above zero in all 45; PCM peak 62.29–64.07 °C (limit 65), water peak 72.18–73.29 °C (limit 75).",
    status: "Run once; cannot be reused",
    done: true,
    tag: "Held-out",
  },
  {
    id: "Control",
    name: "Ablations and negative controls",
    contents: "Fraction, flow, stack position, latent heat = 0, synthetic Tm 45 °C, and water-only invariance checks.",
    criterion: "With latent heat = 0 the gain falls below zero in every regime, so the metric responds to the PCM. Negative controls return zero difference.",
    status: "Done (Rajasthan)",
    done: true,
    tag: "Controls",
  },
  {
    id: "Hand-off",
    name: "Objective 3 contract v2",
    contents: "Environment contract with state, action, safety shield and weather sequences.",
    criterion: "Reward weights are not chosen. 2011–2015 and 2024–2025 are used and must not be reused for tuning.",
    status: "Written (Rajasthan)",
    done: true,
    tag: "Hand-off",
  },
  {
    id: "CFD",
    name: "OpenFOAM capsule check (Rajasthan)",
    contents: "Capsule melt compared with Tan 2009 and Dong 2022, mesh study, closure constants c and F.",
    criterion: "Neither benchmark is reproduced (the CFD melts about 1.6–2 times faster) and the mesh study is not grid-independent, so the CFD is an unvalidated upper bound.",
    status: "Stopped at benchmark",
    done: false,
    tag: "Cross-check",
  },
  {
    id: "Field",
    name: "Experimental validation",
    contents: "Measurements on real hardware.",
    criterion: "Not done. No hardware or field data exist; this belongs to Objective 4.",
    status: "Not done",
    done: false,
    tag: "Validation",
  },
];

const O2_WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Frozen Inputs",
    tag: "Inputs",
    points: [
      "Takes each regime's Objective 1 Top-3 PCMs as a fixed shortlist; the tank, collector and demand are fixed, not optimised.",
      "Rajasthan: 1.5 m² flat-plate collector {{cite:Singh2025PCMSWH}}, 50 L tank {{cite:Chen2025TaguchiGRAPCM}}, 300 L/day, 45 °C delivery target.",
      "Tamil Nadu uses 100 L and 2.5 m²; Uttarakhand delivers at 50 °C; Assam uses 100 L/day.",
      "Limits: 75 °C water, 65 °C PCM. A design whose PCM peak exceeds 65 °C in any simulated year is infeasible.",
      "Sizing note: 50 L with 1.5 m² is 33.3 L/m², below the 40–100 L/m² of IS 12976:2023 §4.2. The compact tank is the fixed condition of this work.",
    ],
  },
  {
    step: "02",
    title: "Design Space and Geometry",
    tag: "Geometry",
    points: [
      "Design variables: capsule inner radius (10–40 mm), PCM volume fraction (2–30% of the tank) and flow rate (0.010–0.050 kg/s), plus arrangement (single-layer, staggered or radial).",
      "The capsule count is derived from the fraction. The shell is 0.8 mm aluminium.",
      "An exact packing check (passage fraction at least 0.05, spacing at least 3 mm) rejects impossible designs.",
      "The fraction cap was raised from 20% to 30% on 2026-10-27 (v3); results from the 20% cap are archived.",
    ],
  },
  {
    step: "03",
    title: "Multi-Node Enthalpy Simulator",
    tag: "Thermal solver",
    points: [
      "A 10-node stratified tank with capsule enthalpy, a flat-plate collector and a 150 s time step (300 s failed the convergence check).",
      "Demand follows the local hour. An earlier version indexed the local-time profile with the UTC hour, which changed plain-tank annual energy by about 31% in regime 0.",
      "The weather cache of the Tamil Nadu run had a +5 hour shift in its solar columns; all 45 point-years were rebuilt behind a sunrise/sunset gate.",
      "Why not CFD for every design: a simulated year takes seconds, so thousands of designs are affordable.",
    ],
  },
  {
    step: "04",
    title: "Paired Metrics",
    tag: "Metrics",
    points: [
      "Every gain is a paired difference against a water-only tank at the same flow, weather year, demand, shield and tank model.",
      "g_window: extra energy delivered at or above 45 °C between 18:00 and 09:00 per year. g_annual is the whole-year version.",
      "d_overheat: shield hours of the PCM tank minus the water-only tank. It adds a PCM-side throttle at 62 °C that a water-only tank cannot have, so it is positive by construction.",
      "The repeatability band comes from year-to-year scatter, time step, node count and property perturbations. Gains smaller than the band are treated as ties.",
    ],
  },
  {
    step: "05",
    title: "Screening and DOE",
    tag: "Taguchi · Sobol",
    points: [
      "A Taguchi L9 screening with ANOVA shows which variables matter for each regime-PCM pair.",
      "A 128-point scrambled-Sobol DOE then covers the v3 box; the same points are used for every pair.",
      "Years are split by role: explore 2016–2020, select 2021–2023, held-out 2011–2015.",
      "In-domain precedent for a Taguchi step: Chen 2025 {{cite:Chen2025TaguchiGRAPCM}}. Source for the Sobol sequence: {{cn}}.",
    ],
  },
  {
    step: "06",
    title: "Surrogate Comparison",
    tag: "Machine learning",
    points: [
      "Three families per pair: a 5-member neural-network ensemble, XGBoost and a quadratic ridge RSM.",
      "Judged on rank agreement and error against the year-to-year scale, not on a global R².",
      "Rajasthan: XGBoost wins 6 and RSM 3 of 9 pairs, the NN ensemble none. Uttarakhand: XGBoost 11, RSM 1 of 12. Tamil Nadu compares five families and picks a stacked ensemble in 9 of 9.",
      "The surrogate only ranks and proposes. The simulator evaluates every reported number.",
    ],
  },
  {
    step: "07",
    title: "NSGA-II with Active Learning",
    tag: "Optimization",
    points: [
      "A hand-written NSGA-II {{cite:Deb2002NSGA2}} with constrained domination minimises −g_window, −g_annual and d_overheat on the winning surrogate.",
      "Committee-disagreement active learning simulates the 10 designs where the models disagree most, then refits; it stops when the hypervolume moves by under 1% for two rounds.",
      "A dense grid (720 simulator runs) is the cross-check for the rank-1 PCM of each regime.",
      "In v3 the box-vertex step is part of the recipe. A with/without test showed it is not load-bearing for regimes 1 and 2, and it is what makes regime 0 pass under the 5-round recipe.",
      "A single-objective Gaussian-process Bayesian search finds the same corner of the box. Source for expected-improvement search: {{cn}}.",
    ],
  },
  {
    step: "08",
    title: "Selection and One-Shot Test",
    tag: "Held-out",
    points: [
      "Candidates within the band of the best g_window form a tied set (S0). A fixed funnel (S0 → S1 → S2) then decides on overheating, PCM mass, capsule count and temperature margin.",
      "The funnel and its fingerprint were fixed before the held-out run; the lock file stores it.",
      "The held-out test covers the chosen design and the best design of every other shortlisted PCM, so it cannot be a cherry-pick.",
      "A re-run of any stage that would re-decide a design is refused while the lock exists.",
    ],
  },
];

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
  { param: "Fixed, not optimised", symbol: "fixed_not_optimised", bounds: "Tank, collector, demand, shortlist", unit: "—", rationale: "Rajasthan 50 L / 1.5 m² / 300 L/day; Tamil Nadu 100 L / 2.5 m²; Assam demand 100 L/day." },
];

const TANK_OPTIONS = [
  { label: "50 L (Rajasthan, Uttarakhand, Assam)", litres: 50 },
  { label: "100 L (Tamil Nadu)", litres: 100 },
];
const WALL_MM = 0.8;

function Objective2Page() {
  resetTerms();
  // Geometry checker state: inner radius and count against the v3 box and the packing-free volume share
  const [radiusMm, setRadiusMm] = useState(30);
  const [capsuleCount, setCapsuleCount] = useState(40);
  const [tankIdx, setTankIdx] = useState(0);

  const tankL = TANK_OPTIONS[tankIdx].litres;
  const outerMm = radiusMm + WALL_MM;
  const capsuleLiters = (4 / 3) * Math.PI * Math.pow(outerMm / 1000, 3) * 1000;
  const totalLiters = capsuleCount * capsuleLiters;
  const volumeShare = (totalLiters / tankL) * 100;
  const radiusOk = radiusMm >= 10 && radiusMm <= 40;
  const shareOk = volumeShare >= 2 && volumeShare <= 30;

  const fig = (name) => `${process.env.PUBLIC_URL}/plots/objective2/rajasthan/${name}`;

  return (
    <section className="content" id="top">
      {/* ── Page Hero ── */}
      <div className="page-hero">
        <div className="eyebrow">
          <span className="eyebrow-badge">Research Module · Objective 2</span>
          <span>Surrogate Design & Optimization Layer</span>
        </div>

        <h1>AI-Driven PCM Storage Design Optimization</h1>

        <Bullets
          items={[
            "Objective 2 searches for the best capsule radius, PCM amount and flow rate for each Objective 1 regime.",
            "The method is a surrogate-assisted, constrained multi-objective search. The simulator evaluates every reported number.",
            "Results are the best found inside the declared box, not a proven optimum.",
          ]}
        />

        <div className="results-grid" style={{ marginBottom: 40 }}>
          <div className="result-stat-card">
            <div className="result-stat-value">3 of 4</div>
            <div className="result-stat-label">States on the Current Method (Assam Is Legacy)</div>
          </div>
          <div className="result-stat-card">
            <div className="result-stat-value">2 – 30 %</div>
            <div className="result-stat-label">PCM Volume Fraction Searched; the 30 % Cap Is Still Limiting</div>
          </div>
          <div className="result-stat-card">
            <div className="result-stat-value">137.5 – 149.3</div>
            <div className="result-stat-label">Rajasthan Held-out Gain, kWh/yr (2011–2015), Bands 14–22</div>
          </div>
          <div className="result-stat-card">
            <div className="result-stat-value">Not done</div>
            <div className="result-stat-label">Experimental Validation (Objective 4)</div>
          </div>
        </div>
      </div>

      {/* ── State status ── */}
      <div className="content-section" id="states">
        <div className="plots-section-header">
          <h2>Status by State</h2>
          <span className="plots-count-badge">4 States</span>
        </div>
        <p className="section-desc">
          The states differ in tank size, delivery target and method version, so their energy numbers are not directly comparable.
        </p>
        <div className="section-divider" />

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>State</th>
                <th>Method version</th>
                <th>Fixed setup</th>
                <th>Chosen designs</th>
                <th>Held-out test</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {O2_STATES.map((s) => (
                <tr key={s.state}>
                  <td style={{ fontWeight: 700, color: "#ffffff" }}>{s.state}</td>
                  <td>
                    <span className={`tag ${s.done ? "tag-brand" : "tag-amber"}`}>{s.chain}</span>
                  </td>
                  <td style={{ fontSize: "0.82rem" }}><Terms text={s.basis} /></td>
                  <td style={{ fontSize: "0.82rem" }}><Terms text={s.result} /></td>
                  <td style={{ fontSize: "0.82rem" }}><Terms text={s.heldout} /></td>
                  <td style={{ fontSize: "0.82rem" }}><Terms text={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Workflow ── */}
      <div className="content-section" id="workflow">
        <div className="plots-section-header">
          <h2>Computational Optimization Pipeline</h2>
          <span className="plots-count-badge">8 Steps</span>
        </div>
        <p className="section-desc">
          The chain used for Rajasthan, Tamil Nadu and Uttarakhand, from the frozen inputs to the one-shot test.
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

        <h3 style={{ marginTop: 28 }}>Assam: legacy chain</h3>
        <Bullets
          items={[
            "Assam still runs the earlier chain: a single-node tank with a 300 s step, Latin Hypercube Sampling {{cite:McKayBeckmanConover1979LHS}}, an ExtraTrees surrogate {{cite:Geurts2006ExtraTrees}} and a bespoke random-search script.",
            "Its Phase 8 re-simulates each design with Monte Carlo draws {{cite:Chopra2023MonteCarloETC}}: 100 draws, not the 120 quoted in older text.",
            "There is no NSGA-II, no held-out test and no lock file, so it is not the current method.",
            "Its Phase 7 report prints \"PASSED\" because it tests 95 °C water and 90 °C PCM limits, not the frozen 75 °C and 65 °C.",
            "The B5 port gave Assam local-hour demand and an optional shield (default off), but its saved results still carry the UTC timing.",
          ]}
        />
      </div>

      {/* ── Core Research Questions ── */}
      <div className="content-section" id="research-questions">
        <div className="plots-section-header">
          <h2>Core Engineering Research Questions</h2>
          <span className="plots-count-badge">Research Questions</span>
        </div>
        <p className="section-desc">
          Questions the pipeline was built to answer, and what the saved results say so far.
        </p>
        <div className="section-divider" />

        <Bullets
          items={[
            "<strong>PCM or plain tank:</strong> does the Objective 1 PCM beat a water-only tank at the same flow under the 75 °C and 65 °C limits?",
            "Finding so far: yes on the window metric in all three Rajasthan and all three Tamil Nadu regimes and in three of four Uttarakhand regimes. In Uttarakhand regime 3 it does not, and the recommendation is a water-only tank.",
            "<strong>What the gain does not show:</strong> night-serve duration and the volume delivered at 45 °C are not better than in the same fixed tank, because capsules take about 20–30% of the water volume.",
            "Finding so far: tau_serve gain is about −0.12 to +0.03 h in Rajasthan, while evening energy delivered up to 45 °C is higher by about 0.25 kWh per scenario night.",
            "<strong>Climate dependence:</strong> does the best design change with the regime?",
            "Finding so far: the PCM differs by regime (Rajasthan: savE® OM55, PureTemp 60, PureTemp 58), but every chosen design sits at the edge of the searched box, so the true best amount is unknown.",
            "<strong>Surrogate role:</strong> can a surrogate stand in for the simulator?",
            "Finding so far: it ranks and proposes only. Its absolute error exceeds the year-to-year scale, so every reported number is a simulator run.",
            "<strong>Why a controller:</strong> the case for Objective 3 is hour-by-hour operation, not seasonal re-ranking of the PCM. The PCM tank has fewer water-side shield hours than the water-only tank but about 420–1,140 PCM-side throttle hours a year.",
          ]}
        />
      </div>

      {/* ── Geometry checker ── */}
      <div className="content-section" id="interactive-explorer">
        <div className="plots-section-header">
          <h2>Capsule Geometry Checker</h2>
          <span className="plots-count-badge">v3 Design Box</span>
        </div>
        <p className="section-desc">
          Move the sliders to test a capsule design against the inner-radius and PCM-fraction bounds.
        </p>
        <Bullets
          items={[
            "This is plain sphere geometry, not a performance estimate.",
            "It checks the inner radius (10–40 mm) and the capsule outer volume as a share of the tank (2–30%).",
            "The real packing check also tests spacing (3 mm), passage fraction (0.05) and the count rule, and is not reproduced here.",
          ]}
        />
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
              <input
                type="range"
                min="10"
                max="40"
                step="1"
                value={radiusMm}
                onChange={(e) => setRadiusMm(Number(e.target.value))}
              />
              <span className="range-hint">Approved range 10–40 mm; the PCM thickness equals this radius</span>
            </div>

            <div className="estimator-control-group">
              <label>
                Capsule count:
                <span className="estimator-val">{capsuleCount} capsules</span>
              </label>
              <input
                type="range"
                min="4"
                max="160"
                step="1"
                value={capsuleCount}
                onChange={(e) => setCapsuleCount(Number(e.target.value))}
              />
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

      {/* ── Technical Parameter Specifications Table ── */}
      <div className="content-section" id="parameters">
        <div className="plots-section-header">
          <h2>Design Vector & System Constraints</h2>
          <span className="plots-count-badge">design_space.yaml</span>
        </div>
        <p className="section-desc">
          Search bounds and limits of the approved v3 design space (Rajasthan; the other current states use the same recipe).
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

      {/* ── Results figures (Rajasthan) ── */}
      <div className="content-section" id="results-figures">
        <div className="plots-section-header">
          <h2>Rajasthan Results</h2>
          <span className="plots-count-badge">2 Figures</span>
        </div>
        <p className="section-desc">
          Figures from the saved Rajasthan results; every value is also a row in the results registry.
        </p>
        <div className="section-divider" />

        <Figure
          src={fig("fig4_heldout_pcm_comparison.png")}
          title="Held-out comparison of the shortlisted PCMs"
          alt="Held-out g_window of the chosen PCM and the other Objective 1 PCMs for each Rajasthan regime."
          caption="Held-out g_window of the chosen design and the best design of every other O1 PCM (results/plots/fig4_heldout_pcm_comparison.png). In regime 0 the chosen design and the runner-up are tied inside the band."
        />
        <Figure
          src={fig("fig9_boundary_share.png")}
          title="Optimiser fronts at a bound of the design box"
          alt="Share of the final Pareto fronts sitting at the PCM-fraction cap or the radius limit."
          caption="Share of the final fronts at a bound of the box (results/plots/fig9_boundary_share.png): the designs are still boundary-limited. Some y-axis labels are cut off in the saved image."
        />
      </div>

      {/* ── Verification and status ── */}
      <div className="content-section" id="deliverables">
        <div className="plots-section-header">
          <h2>Objective 2 Verification & Status</h2>
          <span className="plots-count-badge">Rajasthan Reference</span>
        </div>
        <p className="section-desc">
          What was checked, how it came out, and what is not done. Three separate claims are kept apart: simulator verification (done), a CFD model-consistency cross-check (stopped at the benchmark for Rajasthan) and experimental validation (not done).
        </p>
        <div className="section-divider" />

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Name</th>
                <th>Area</th>
                <th>Content</th>
                <th>Result</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {O2_VERIFICATION.map((d) => (
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

      {/* ── Limitations ── */}
      <div className="content-section" id="limitations">
        <div className="plots-section-header">
          <h2>Known Limitations</h2>
          <span className="plots-count-badge">Read Before Quoting</span>
        </div>
        <p className="section-desc">
          What the Objective 2 results do not support. Write "best design within the declared box", never "optimal design".
        </p>
        <div className="section-divider" />

        <Bullets
          items={[
            "<strong>Boundary-limited.</strong> Chosen Rajasthan designs sit at radius 39.5–40 mm and fraction 28–30%. At a 40% fraction the gain is higher by 47.2 / 37.9 / 40.6 kWh against bands of 21.1 / 14.4 / 21.9 kWh, so the 30% cap is still limiting.",
            "A diagnostic with radius up to 50 mm and fraction up to 40% (2026-11-10, explore and select years only) still ends on the new bounds and changes all three chosen designs. It is an extrapolation beyond any source read; v3 stays the approved box and no held-out run was made for those designs.",
            "<strong>Flow optimum is a model artefact.</strong> The collector factor is flow-independent. A flow-dependent version changes g_window by at most 1.43 kWh and is a sensitivity, not part of the released model.",
            "<strong>Level depends on stack position.</strong> Moving the capsule stack from bottom to top changes the chosen designs' gain by 45–56 kWh, three to six times the band (v1 diagnostic, not re-run on v3). The sign of the gain does not change.",
            "<strong>Sizing.</strong> 50 L with 1.5 m² (33.3 L/m²) is below IS 12976:2023. On the older model a 112.5 L tank passed the 65 °C limit without the shield; only that direction is usable, not its numbers.",
            "<strong>CFD.</strong> The capsule closure <code>cfd_closure_v1</code> (c = 10, F = 5) is unvalidated; the default stays c = 5, F = 2. OpenFOAM reproduces neither Tan 2009 nor Dong 2022 and its mesh study is not grid-independent. Never write \"CFD-validated\".",
            "<strong>No measurements.</strong> The model has not been compared with hardware or field data.",
            "<strong>Not covered.</strong> No monthly mains-temperature series (no source in the project provides one), and no PCM supercooling or volume change.",
            "<strong>Delivery basis.</strong> Objective 1 sizes PCMs for 60 °C delivery; Objective 2 scores energy at 45 °C. Both arms of every paired run use the same metric, so the comparison is sound, but whether O1 would have shortlisted different PCMs at 45 °C is open.",
            "<strong>Shortlist inputs.</strong> O1's conductivity table and the PCM database disagree (savE® OM55: 0.429 vs 0.13 W/m K); the simulator reads the database. Objective 2 does not feed back into Objective 1. Assam's shortlist is physics-ranked, not an MCDM Top-3.",
            "<strong>Not run end to end.</strong> The full <code>--stage all</code> chain has not been executed (it takes hours and the held-out lock refuses it); stages were run individually.",
          ]}
        />
      </div>

      {/* ── Objective 3 Hand-Off Specification ── */}
      <div className="content-section" id="objective3-handoff">
        <div className="plots-section-header">
          <h2>Downstream Objective 3 Interface Hand-off</h2>
          <span className="plots-count-badge">Contract v2</span>
        </div>
        <p className="section-desc">
          Environment contract passed to Objective 3 (the DRL controller). Written for Rajasthan only; Assam's file is not a valid input.
        </p>
        <div className="section-divider" />

        <Bullets
          items={[
            "<strong>Boundary:</strong> Objective 3 chooses the real-time action and nothing else.",
            "It cannot change the PCM, capsule geometry, tank volume, safety limits or the physics model.",
            {
              text: "<strong>State:</strong> the v2 contract adds top and bottom tank-node temperatures, a recoverable-energy estimate and minutes since the last draw.",
              details: "The delivery temperature is the top node; the collector inlet is the bottom node. Recoverable energy above 45 °C is an estimator, not a sensor.",
            },
            {
              text: "<strong>Action:</strong> a mode (charge, discharge or bypass) with an optional continuous flow rate.",
              details: "Flow within 0.010–0.050 kg/s. The contract's simulator step is 150 s.",
            },
            "<strong>Safety shield:</strong> forces bypass at 72 °C at the top node and 62 °C in the PCM, and clamps flow to the envelope.",
            "<strong>Reward:</strong> a suggestion built from delivered energy at 45 °C, overheating hours, safety violations and bypass switching. The weights are not chosen, and the old pump-energy term was removed because pump energy is not meaningful in the simulator.",
            "<strong>Weather:</strong> training 2016–2020, validation 2021–2023. The held-out years 2011–2015 and 2024–2025 were used by O2's tests and must not be used to tune a controller.",
            "<strong>Comparison rule:</strong> a controller must be compared with the same-flow water-only twin and the passive PCM design, on the explore and select years only.",
            "Scope: one medoid weather point per regime (Rajasthan: RJP_0132, RJP_0192, RJP_0083). No backup heater is modelled.",
          ]}
        />
      </div>
    </section>
  );
}

export default Objective2Page;
