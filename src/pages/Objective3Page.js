import Bullets from "../components/Bullets";
import { resetTerms } from "../data/terms";

/* ─────────────────────────────────────────────────────────
   Objective3Page.js — Adaptive DRL Control (placeholder)
   Final Year Project — Group 12 | Department of CSE
   Amrita School of Engineering

   Placeholder until Objective 3 work starts. The scope repeats
   the Overview roadmap card; the inputs repeat the Objective 2
   Contract v2 hand-off. No results are reported here yet.
   ───────────────────────────────────────────────────────── */

function Objective3Page() {
  resetTerms();

  return (
    <section className="content" id="top">
      {/* ── Page Hero ── */}
      <div className="page-hero">
        <div className="eyebrow">
          <span className="eyebrow-badge">Research Module · Objective 3</span>
          <span>Control Layer · Not Started</span>
        </div>

        <h1>Adaptive DRL Control & Dynamic Actuation</h1>

        <Bullets
          items={[
            "This page is a placeholder. Objective 3 has not started, so it reports no method details or results yet.",
            "Planned: a Deep Reinforcement Learning (DRL) agent (PPO / Actor-Critic) sets the charging, discharging and bypass valve positions.",
            "Goal: maximize hot water delivery availability under stochastic weather.",
          ]}
        />

        <div className="results-grid" style={{ marginBottom: 40 }}>
          <div className="result-stat-card">
            <div className="result-stat-value">Not started</div>
            <div className="result-stat-label">Controller Training</div>
          </div>
          <div className="result-stat-card">
            <div className="result-stat-value">Contract v2</div>
            <div className="result-stat-label">Environment Input from Objective 2 (Rajasthan Only)</div>
          </div>
        </div>
      </div>

      {/* ── Planned scope ── */}
      <div className="content-section" id="scope">
        <div className="plots-section-header">
          <h2>Planned Scope</h2>
          <span className="plots-count-badge">Placeholder</span>
        </div>
        <p className="section-desc">What Objective 3 is expected to deliver. Subject to change.</p>
        <div className="section-divider" />

        <Bullets
          items={[
            "<strong>State:</strong> s_t = [Tw, Tp, f, GHI, Tamb, wind, time], plus the Contract v2 tank-node temperatures, recoverable-energy estimate and minutes since the last draw.",
            "<strong>Action:</strong> a mode (charge, discharge or bypass) with an optional flow rate within 0.010–0.050 kg/s.",
            "<strong>Deliverables:</strong> a trained PPO controller, simulated performance against rule-based baselines, and robustness under demand and cloud spikes.",
          ]}
        />
      </div>

      {/* ── Inputs ── */}
      <div className="content-section" id="inputs">
        <div className="plots-section-header">
          <h2>Inputs from Objective 2</h2>
          <span className="plots-count-badge">Fixed</span>
        </div>
        <p className="section-desc">
          The limits Objective 3 inherits. The full contract is in the Objective 2 hand-off section.
        </p>
        <div className="section-divider" />

        <Bullets
          items={[
            "Objective 3 chooses the real-time action only. The PCM, capsule geometry, tank volume, safety limits and physics model are fixed.",
            "Safety shield: forced bypass at 72 °C at the top node and 62 °C in the PCM.",
            "Weather: training 2016–2020, validation 2021–2023. The held-out years 2011–2015 and 2024–2025 must not be used for tuning.",
            "Comparison: against the same-flow water-only twin and the passive PCM design.",
          ]}
        />
      </div>
    </section>
  );
}

export default Objective3Page;
