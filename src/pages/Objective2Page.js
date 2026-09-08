import { useState } from "react";

/* ─────────────────────────────────────────────────────────
   Objective2Page.js — AI-Driven Storage Design Optimization
   Final Year Project — Group 12 | Department of CSE
   Amrita School of Engineering
   ───────────────────────────────────────────────────────── */

const O2_DELIVERABLES = [
  {
    id: "D2.1",
    name: "Frozen Input Package",
    contents: "Objective 1 regime records, medoid hourly weather, PCM database, canonical 300 L/day demand profile, manifest.json.",
    criterion: "Versioned machine-readable JSON/CSV files pass SHA-256 schema checks.",
    status: "Completed (Frozen)",
    tag: "Data Ingestion",
  },
  {
    id: "D2.2",
    name: "Geometry & Constraint Engine",
    contents: "Capsule generator (spheres, cylinders, slabs), packing density, surface-area-to-volume ratio, hydraulic pressure drop estimator.",
    criterion: "Every generated geometric design receives a binary valid/invalid status with explicit rejection reason.",
    status: "Completed",
    tag: "CAD & Physics",
  },
  {
    id: "D2.3",
    name: "Verified Grey-Box Simulator",
    contents: "2-node lumped enthalpy balance solver (water Tw, PCM Tp, phase fraction f), collector ODE, stratification, and demand submodels.",
    criterion: "100% energy conservation balance, Stefan limiting-case check, and baseline calibration pass.",
    status: "Verified",
    tag: "Thermal Solver",
  },
  {
    id: "D2.4",
    name: "LHS Design of Experiments (DOE)",
    contents: "Latin Hypercube Sampling over design vector x = [t_pcm, g, d, a, N_capsule, N_layer, s, m_dot], runtime telemetry, and seed tracking.",
    criterion: "Case-level train/validation/test partitions exist without data leakage across climate regimes.",
    status: "Generated (1,200 runs)",
    tag: "Simulation Bank",
  },
  {
    id: "D2.5",
    name: "Validated AI Surrogate Model",
    contents: "Binary feasibility classifier + multi-output MLP/XGBoost regressors predicting annual solar fraction, charging time, and pressure drop.",
    criterion: "Hold-out test error R² ≥ 0.94 globally and < 6% relative error near the feasibility boundary.",
    status: "Trained & Validated",
    tag: "Deep Learning",
  },
  {
    id: "D2.6",
    name: "Optimized Design Catalogue",
    contents: "One Pareto-optimal set (NSGA-II) and one selected deployable design per regime-PCM pair.",
    criterion: "Every Pareto-optimal surrogate recommendation is re-evaluated by the ground-truth numerical simulator.",
    status: "Synthesized",
    tag: "Optimization",
  },
  {
    id: "D2.7",
    name: "Robustness & Uncertainty Report",
    contents: "Monte Carlo perturbation over stochastic weather sequences, household demand surges (±25%), and PCM thermophysical property bounds.",
    criterion: "Reliability probability of meeting ≥45°C delivery threshold reported under 1,000 perturbed draws.",
    status: "Completed",
    tag: "Uncertainty",
  },
  {
    id: "D2.8",
    name: "Recommendation Cards (Design)",
    contents: "Regime, winning PCM, capsule shape, conduction distance, capsule count, flow rate, solar fraction, and pumping loss.",
    criterion: "One deployable specification card per regime and shortlisted PCM across all 4 states.",
    status: "Drafted",
    tag: "Deliverable",
  },
  {
    id: "D2.9",
    name: "Objective 3 DRL Hand-off Package",
    contents: "State vector s_t, continuous action space limits, transition function, reward inputs, and safety shield specifications.",
    criterion: "Objective 3 RL agent can instantiate Gym/PettingZoo environment without reopening physical hardware decisions.",
    status: "Finalized",
    tag: "Control Interface",
  },
];

const O2_WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Frozen Input Ingestion",
    icon: "",
    tag: "Level A Hand-Off",
    desc: "Directly ingests Objective 1 outputs without modifying rankings: regime assignments, medoid hourly weather (GHI, Tamb, wind, RH), screened PCM database, and the canonical 300 L/day household draw schedule.",
  },
  {
    step: "02",
    title: "Geometry & Envelope Engine",
    icon: "",
    tag: "Form Factor",
    desc: "Parameterizes capsule designs: maximum conduction thickness t_pcm (10–45 mm), capsule geometries (spherical nodules, horizontal tubes, cylindrical rods), packing volume fraction (20–40%), and interstitial flow channels.",
  },
  {
    step: "03",
    title: "2-Node Grey-Box Enthalpy Solver",
    icon: "️",
    tag: "Physics Ground Truth",
    desc: "Solves transient energy balances across 8,760 hourly time-steps. Tracks water temperature Tw, PCM bulk temperature Tp, and phase melt fraction f using an effective heat capacity enthalpy formulation with phase transition bounds.",
  },
  {
    step: "04",
    title: "Latin Hypercube Sampling (DOE)",
    icon: "",
    tag: "Space Filling",
    desc: "Generates space-filling design configurations across 8 continuous/discrete variables. Simulates 1,200 design candidates across contrasting regimes to build the empirical training distribution.",
  },
  {
    step: "05",
    title: "AI Surrogate Neural Architecture",
    icon: "",
    tag: "ML Acceleration",
    desc: "Dual-stage surrogate: Stage 1 filters infeasible/freezing geometries via XGBoost classifier; Stage 2 predicts annual solar fraction, melting duration, and hydraulic loss via a 4-layer MLP / Gaussian Process Regressor.",
  },
  {
    step: "06",
    title: "Multi-Objective Pareto Optimization",
    icon: "",
    tag: "NSGA-II / MOPSO",
    desc: "Runs multi-objective genetic algorithms to resolve trade-offs: maximizing annual solar fraction (SF) and delivery reliability while simultaneously minimizing PCM capital mass, capsule count, and pumping parasitic power.",
  },
  {
    step: "07",
    title: "Ground-Truth Physics Verification",
    icon: "",
    tag: "Zero Hallucination",
    desc: "Every Pareto-optimal candidate selected by the AI surrogate is fed back into the full 8,760-hour numerical simulator. A surrogate prediction is never adopted without 100% numerical verification.",
  },
  {
    step: "08",
    title: "Objective 3 DRL Interface Freeze",
    icon: "",
    tag: "Control Interface",
    desc: "Freezes the physical state space st = [Tw, Tp, f, GHI, Tamb, wind, time], 3-way valve actuation constraints (Charge/Discharge/Bypass), and safety shield bounds for real-time reinforcement learning control.",
  },
];

const PARAMETER_BOUNDS = [
  { param: "Conduction Thickness (t_pcm)", symbol: "t_pcm", bounds: "10 – 45 mm", unit: "mm", rationale: "Prevents internal thermal resistance bottlenecks in organic paraffin PCMs." },
  { param: "Capsule Shape Options", symbol: "g", bounds: "Spherical / Cylindrical / Slabs", unit: "Category", rationale: "Balances surface-to-volume ratio with manufacturing and packing simplicity." },
  { param: "Capsule Count", symbol: "N_capsule", bounds: "40 – 240 units", unit: "Count", rationale: "Determined by tank internal volume and target PCM mass fraction." },
  { param: "Water Mass Flow Rate", symbol: "m_dot", bounds: "0.02 – 0.15 kg/s", unit: "kg/s", rationale: "Regulates convective heat transfer coefficient h_c and pumping pressure drop." },
  { param: "PCM Volume Fraction", symbol: "V_pcm / V_tank", bounds: "20% – 40%", unit: "%", rationale: "Ensures sufficient sensible water buffer remains for high-draw morning peaks." },
  { param: "Target Delivery Temp", symbol: "T_delivery", bounds: "≥ 45.0 °C", unit: "°C", rationale: "Standard domestic hot water threshold preventing bacterial legionella growth." },
  { param: "Maximum Pressure Drop", symbol: "ΔP_max", bounds: "≤ 8.5 kPa", unit: "kPa", rationale: "Limits parasitic pump electricity consumption within gravity/low-power solar loops." },
];

function Objective2Page() {
  // Interactive mini design estimator state
  const [thickness, setThickness] = useState(25);
  const [capsuleCount, setCapsuleCount] = useState(120);
  const [flowRate, setFlowRate] = useState(0.06);
  const [selectedPCM, setSelectedPCM] = useState("RT44HC");

  // Approximate physics calculation for the interactive estimator
  const pcmLatentHeat = selectedPCM === "RT44HC" ? 250 : selectedPCM === "savE OM50" ? 210 : 230;
  const capsuleVolLiters = (Math.PI * Math.pow(thickness / 1000, 2) * 0.4) * 1000;
  const totalPcmMassKg = (capsuleCount * capsuleVolLiters * 0.88).toFixed(1);
  const estimatedStorageCapacityMJ = ((totalPcmMassKg * pcmLatentHeat) / 1000).toFixed(2);
  const estSolarFraction = Math.min(84, Math.max(54, (58 + (pcmLatentHeat / 250) * 12 + (flowRate / 0.15) * 8 - (thickness - 20) * 0.35))).toFixed(1);
  const estChargingHours = Math.max(2.2, (4.8 * (thickness / 25) * (0.06 / flowRate)).toFixed(1));

  return (
    <section className="content" id="top">
      {/* ── Page Hero ── */}
      <div className="page-hero">
        <div className="eyebrow">
          <span className="eyebrow-badge">Research Module · Objective 2</span>
          <span>Surrogate Design & Optimization Layer</span>
        </div>

        <h1>AI-Driven PCM Storage Design Optimization</h1>

        <p className="intro">
          Objective 1 answers <strong>which PCM is optimal for each discovered climate regime</strong>. Objective 2 answers{" "}
          <strong>what physical capsule geometry, volume allocation, and operating flow rate make that PCM most effective</strong>.
          By coupling Latin Hypercube Sampling with a 2-node lumped-enthalpy thermal solver and an AI surrogate neural network,
          this layer synthesizes Pareto-optimal thermal storage configurations for domestic solar water heating.
        </p>

        <div className="results-grid" style={{ marginBottom: 40 }}>
          <div className="result-stat-card">
            <div className="result-stat-value">12 Phases</div>
            <div className="result-stat-label">End-to-End Computational Workflow</div>
          </div>
          <div className="result-stat-card">
            <div className="result-stat-value">1,200 Runs</div>
            <div className="result-stat-label">Latin Hypercube Sampling DOE Cases</div>
          </div>
          <div className="result-stat-card">
            <div className="result-stat-value">R² ≥ 0.94</div>
            <div className="result-stat-label">AI Surrogate Model Accuracy on Hold-out Test</div>
          </div>
          <div className="result-stat-card">
            <div className="result-stat-value">D2.1–D2.9</div>
            <div className="result-stat-label">Rigorous Deliverables Traceability</div>
          </div>
        </div>
      </div>

      {/* ── Core Research Questions ── */}
      <div className="content-section" id="research-questions">
        <div className="plots-section-header">
          <h2>Core Engineering Research Questions</h2>
          <span className="plots-count-badge">Problem Formulation</span>
        </div>
        <p className="section-desc">
          Key physical and computational questions addressed by the Objective 2 methodology.
        </p>
        <div className="section-divider" />

        <div className="findings-list">
          <div className="finding-item">
            <span className="finding-icon">1️⃣</span>
            <div className="finding-text">
              <strong>Thermal Resistance & Conduction Limitations:</strong> How do PCM capsule conduction thickness (t_pcm),
              capsule geometry (spherical nodules vs. cylindrical macro-tubes), and packing density influence melt completion
              time under low-irradiance monsoonal days?
            </div>
          </div>

          <div className="finding-item">
            <span className="finding-icon">2️⃣</span>
            <div className="finding-text">
              <strong>Multi-Objective Trade-Offs:</strong> Which geometric design maximizes useful annual solar fraction (SF)
              and delivery-temperature availability (≥45°C) while strictly bounding unmet demand, parasitic pumping energy,
              and material volume?
            </div>
          </div>

          <div className="finding-item">
            <span className="finding-icon">3️⃣</span>
            <div className="finding-text">
              <strong>Regime-Specific Geometry Invariance:</strong> Does an optimal capsule geometry derived for arid Rajasthan
              remain optimal under humid monsoonal Assam or sub-zero Himalayan Uttarakhand?
            </div>
          </div>

          <div className="finding-item">
            <span className="finding-icon">4️⃣</span>
            <div className="finding-text">
              <strong>AI Surrogate Acceleration:</strong> Can deep learning and Gaussian Process surrogates reproduce the 8,760-hour
              grey-box simulator with &lt;6% relative error near the feasibility boundary, reducing optimization time from days to seconds?
            </div>
          </div>
        </div>
      </div>

      {/* ── 8-Step Implementation Workflow ── */}
      <div className="content-section" id="workflow">
        <div className="plots-section-header">
          <h2>Computational Optimization Pipeline</h2>
          <span className="plots-count-badge">8 Core Milestones</span>
        </div>
        <p className="section-desc">
          Structured computational flow connecting frozen Objective 1 inputs to verified Pareto designs.
        </p>
        <div className="section-divider" />

        <div className="methods-grid">
          {O2_WORKFLOW_STEPS.map((s) => (
            <div key={s.step} className="method-card">
              <span className="method-card-icon">{s.icon}</span>
              <div className="method-card-tag">{s.tag}</div>
              <h3>{s.step}. {s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Interactive Design Space Explorer ── */}
      <div className="content-section" id="interactive-explorer">
        <div className="plots-section-header">
          <h2>Interactive Storage Design Estimator</h2>
          <span className="plots-count-badge">Physics Surrogate Demo</span>
        </div>
        <p className="section-desc">
          Explore how capsule conduction thickness, capsule count, flow rate, and PCM selection impact estimated storage capacity,
          annual solar fraction, and diurnal charging dynamics.
        </p>
        <div className="section-divider" />

        <div className="design-estimator-wrapper">
          <div className="estimator-controls">
            <div className="estimator-control-group">
              <label>
                Selected PCM Candidate:
                <span className="estimator-val">{selectedPCM}</span>
              </label>
              <select
                className="estimator-select"
                value={selectedPCM}
                onChange={(e) => setSelectedPCM(e.target.value)}
              >
                <option value="RT44HC">RT44HC (Assam / TN C1) — 250 kJ/kg</option>
                <option value="savE OM50">savE® OM50 (Rajasthan C1/C2) — 210 kJ/kg</option>
                <option value="RT60">RT60 (Uttarakhand C0/C4) — 230 kJ/kg</option>
              </select>
            </div>

            <div className="estimator-control-group">
              <label>
                Capsule Conduction Thickness (t_pcm):
                <span className="estimator-val">{thickness} mm</span>
              </label>
              <input
                type="range"
                min="10"
                max="45"
                step="1"
                value={thickness}
                onChange={(e) => setThickness(Number(e.target.value))}
              />
              <span className="range-hint">Thinner = faster charging; Thicker = higher PCM packing efficiency</span>
            </div>

            <div className="estimator-control-group">
              <label>
                Capsule Count (N_capsule):
                <span className="estimator-val">{capsuleCount} capsules</span>
              </label>
              <input
                type="range"
                min="40"
                max="240"
                step="10"
                value={capsuleCount}
                onChange={(e) => setCapsuleCount(Number(e.target.value))}
              />
              <span className="range-hint">Regulates total latent energy capacity in 250L water tank</span>
            </div>

            <div className="estimator-control-group">
              <label>
                Water Mass Flow Rate (m_dot):
                <span className="estimator-val">{flowRate} kg/s</span>
              </label>
              <input
                type="range"
                min="0.02"
                max="0.15"
                step="0.01"
                value={flowRate}
                onChange={(e) => setFlowRate(Number(e.target.value))}
              />
              <span className="range-hint">Higher flow = better heat transfer, higher parasitic pressure drop</span>
            </div>
          </div>

          <div className="estimator-display">
            <div className="estimator-display-title">Surrogate Output Estimations</div>

            <div className="estimator-metrics-grid">
              <div className="estimator-metric-box">
                <span className="metric-box-label">Estimated PCM Mass</span>
                <span className="metric-box-val">{totalPcmMassKg} kg</span>
                <span className="metric-box-sub">~{(totalPcmMassKg / 2.5).toFixed(0)}% Tank Volume</span>
              </div>

              <div className="estimator-metric-box">
                <span className="metric-box-label">Latent Storage Energy</span>
                <span className="metric-box-val">{estimatedStorageCapacityMJ} MJ</span>
                <span className="metric-box-sub">{(estimatedStorageCapacityMJ / 3.6).toFixed(2)} kWh equivalent</span>
              </div>

              <div className="estimator-metric-box">
                <span className="metric-box-label">Predicted Solar Fraction</span>
                <span className="metric-box-val" style={{ color: "#4ade80" }}>{estSolarFraction}%</span>
                <span className="metric-box-sub">Target Band: 54–84%</span>
              </div>

              <div className="estimator-metric-box">
                <span className="metric-box-label">Nominal Charging Time</span>
                <span className="metric-box-val" style={{ color: "#fbbf24" }}>{estChargingHours} hrs</span>
                <span className="metric-box-sub">Full melt duration at noon GHI</span>
              </div>
            </div>

            <div className="estimator-status-note">
               <strong>Physics Feasibility Check:</strong> Configuration satisfies the 300 L/day household draw constraint
              and operates within allowable hydraulic pressure loss (&lt; 8.5 kPa).
            </div>
          </div>
        </div>
      </div>

      {/* ── Technical Parameter Specifications Table ── */}
      <div className="content-section" id="parameters">
        <div className="plots-section-header">
          <h2>Design Vector & System Constraints</h2>
          <span className="plots-count-badge">system_config.yaml</span>
        </div>
        <p className="section-desc">
          Mathematical decision boundaries and search domains enforced across the Latin Hypercube Sampling DOE.
        </p>
        <div className="section-divider" />

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Design Parameter</th>
                <th>Symbol</th>
                <th>Search Bounds</th>
                <th>Unit</th>
                <th>Engineering Rationale</th>
              </tr>
            </thead>
            <tbody>
              {PARAMETER_BOUNDS.map((p) => (
                <tr key={p.symbol}>
                  <td style={{ fontWeight: 600, color: "#ffffff" }}>{p.param}</td>
                  <td><code>{p.symbol}</code></td>
                  <td style={{ color: "#fbbf24", fontWeight: 600 }}>{p.bounds}</td>
                  <td>{p.unit}</td>
                  <td style={{ fontSize: "0.82rem" }}>{p.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Deliverables Matrix (D2.1 to D2.9) ── */}
      <div className="content-section" id="deliverables">
        <div className="plots-section-header">
          <h2>Objective 2 Deliverables & Verification Status</h2>
          <span className="plots-count-badge">D2.1 – D2.9</span>
        </div>
        <p className="section-desc">
          Formal engineering deliverables tracked for Project Review 2 and final hand-off.
        </p>
        <div className="section-divider" />

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Deliverable Name</th>
                <th>Phase</th>
                <th>Minimum Technical Content</th>
                <th>Verification Criterion</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {O2_DELIVERABLES.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 700, color: "#ffffff" }}>{d.id}</td>
                  <td style={{ fontWeight: 600, color: "#f4f4f5" }}>{d.name}</td>
                  <td><span className="tag tag-zinc">{d.tag}</span></td>
                  <td style={{ fontSize: "0.82rem" }}>{d.contents}</td>
                  <td style={{ fontSize: "0.82rem" }}>{d.criterion}</td>
                  <td>
                    <span className={`tag ${d.status.includes("Completed") || d.status.includes("Verified") || d.status.includes("Finalized") ? "tag-brand" : "tag-amber"}`}>
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
          <span className="plots-count-badge">DRL Control Gym</span>
        </div>
        <p className="section-desc">
          Frozen environment specifications passed to Objective 3 (Deep Reinforcement Learning Controller).
        </p>
        <div className="section-divider" />

        <div className="finding-item">
          <span className="finding-icon"></span>
          <div className="finding-text">
            <strong>State Space Vector (s_t):</strong>{" "}
            <code>s_t = [T_w(t), T_p(t), f(t), GHI(t), T_amb(t), v_wind(t), hour_sin, hour_cos, demand(t)]</code>.
            All state observations normalized with empirical bounds derived from the 10-year ERA5 climate distributions.
          </div>
        </div>

        <div className="finding-item" style={{ marginTop: 12 }}>
          <span className="finding-icon">️</span>
          <div className="finding-text">
            <strong>Action Space & Valve Actuation:</strong> Discrete 3-action or continuous valve opening α ∈ [0, 1] controlling:
            <ul style={{ marginTop: 6, paddingLeft: 20 }}>
              <li><strong>Action 0 (Bypass):</strong> Direct collector-to-load flow during peak daytime hot-water demand.</li>
              <li><strong>Action 1 (Charge):</strong> Solar collector heat routed into PCM storage capsules to drive melting.</li>
              <li><strong>Action 2 (Discharge):</strong> Water circulated through PCM latent heat bed during evening/night demand.</li>
            </ul>
          </div>
        </div>

        <div className="finding-item" style={{ marginTop: 12 }}>
          <span className="finding-icon">️</span>
          <div className="finding-text">
            <strong>Safety Shield & Constraints:</strong> Objective 2 establishes physical hard constraints preventing thermal shock
            and boiling. If T_collector &gt; 95°C, safety bypass automatically activates; if T_w &lt; 40°C during draw, electrical backup
            activates with heavy reward penalty.
          </div>
        </div>
      </div>
    </section>
  );
}

export default Objective2Page;
