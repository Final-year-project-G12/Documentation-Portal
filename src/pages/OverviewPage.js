/* ─────────────────────────────────────────────────────────
   OverviewPage.js — Central Project Hub (Review 2 Presentation)
   Final Year Project — Group 12 | Department of CSE
   Amrita School of Engineering
   ───────────────────────────────────────────────────────── */

const PROJECT_META = {
  title: "Climate-Adaptive Intelligent Control and Optimization of PCM Thermal Storage for Solar Water Heating",
  course: "23CSE498 — Project Phase 2 (Panel Review 2)",
  group: "Group 12",
  date: "September 7, 2026",
  guide: {
    name: "Dr. T. Deepika",
    role: "Assistant Professor (Sr. Gd.)",
    dept: "Department of Computer Science & Engineering",
    institution: "Amrita School of Engineering, Amrita Vishwa Vidyapeetham",
  },
  team: [
    { name: "Manduva Jaswita", reg: "CB.SC.U4CSE23430" },
    { name: "Dungi Manvitha", reg: "CB.SC.U4CSE23318" },
    { name: "Duddekunta Yuva Hasini", reg: "CB.SC.U4CSE23412" },
    { name: "Chiruvolu Venkata Khyathi", reg: "CB.SC.U4CSE23558" },
    { name: "K P N L K Mahitha", reg: "CB.SC.U4CSE23034" },
  ],
  sdgs: [
    { num: 7, title: "Affordable & Clean Energy", desc: "Maximizing renewable solar fraction via latent heat storage" },
    { num: 9, title: "Industry, Innovation & Infrastructure", desc: "AI surrogate modeling and smart thermal energy storage" },
    { num: 12, title: "Responsible Consumption", desc: "Minimizing grid electrical backup water heating energy" },
    { num: 13, title: "Climate Action", desc: "Displacing fossil fuels through zero-emission solar water heating" },
  ],
};

const INDUSTRY_COMPARISON = [
  { company: "Sunamp", country: "United Kingdom", pcmUsed: "Yes", pcmDetails: "Plentigrade (P58, SU58) Salt Hydrates", application: "Heat batteries for residential hot water" },
  { company: "PLUSS Advanced Tech", country: "India", pcmUsed: "Yes", pcmDetails: "savE® OM Series (OM50, OM42, OM46)", application: "Cold chain & industrial thermal buffers" },
  { company: "PCM Products Ltd", country: "United Kingdom", pcmUsed: "Yes", pcmDetails: "Positive Temp (Salt Hydrates + Organics)", application: "Building TES and solar heating systems" },
  { company: "Chemtex Speciality", country: "India", pcmUsed: "Yes", pcmDetails: "Positive Temperature & Eutectic Salts", application: "Thermal storage tanks and process heat" },
  { company: "Vaillant", country: "Germany", pcmUsed: "No", pcmDetails: "Sensible water buffer only", application: "Conventional stratified domestic tanks" },
  { company: "Emmvee Group", country: "India", pcmUsed: "No", pcmDetails: "Sensible water buffer only", application: "Pressurized solar water heater tanks" },
];

const OBJECTIVES_ROADMAP = [
  {
    id: "obj1",
    num: "Objective 1",
    title: "Climate-Region-Aware PCM Recommendation",
    desc: "10-year ERA5 and NASA POWER meteorological clustering (GMM) across 4 contrasting Indian territories (637 points). Multi-criteria decision analysis (TOPSIS, PROMETHEE II, GRA, VIKOR) coupled with Borda consensus and 2-node lumped-enthalpy physics validation.",
    outputs: ["16 Discovered Climate Regimes", "4-Method MCDM Consensus Ranks", "Annual Solar Fraction Benchmarks (54–84%)", "Region-Specific PCM Recommendation Cards"],
    linkPage: "objective1",
  },
  {
    id: "obj2",
    num: "Objective 2",
    title: "AI-Driven Storage Design Optimization",
    desc: "Consumes frozen Objective 1 PCM shortlists to optimize capsule geometry (spherical/cylindrical macro-encapsulation, thickness, count) and water flow rates. Employs Latin Hypercube Sampling (LHS), 2-node grey-box enthalpy simulation, and an AI surrogate model (NSGA-II / MOPSO).",
    outputs: ["Frozen Multi-State Input Packages", "LHS Design of Experiments (DOE)", "AI Surrogate Feasibility & Performance Regressors", "Objective 3 Environment Hand-off"],
    linkPage: "objective2",
  },
  {
    id: "obj3",
    num: "Objective 3",
    title: "Adaptive DRL Control & Dynamic Actuation",
    desc: "Deep Reinforcement Learning (DRL) agent (PPO / Actor-Critic) operating over state vector s_t = [Tw, Tp, f, GHI, Tamb, wind, time]. Controls charging, discharging, and bypass valve positions to maximize hot water delivery availability under stochastic weather.",
    outputs: ["Trained PPO Controller", "Simulated Performance vs Rule-Based Baselines", "Robustness under Demand & Cloud Spikes"],
    linkPage: null,
  },
  {
    id: "obj4",
    num: "Objective 4",
    title: "Embedded Closed-Loop Hardware Prototype",
    desc: "Physical embedded system deployment on ESP32 / Raspberry Pi featuring DS18B20 multi-point temperature probes, irradiance sensors, and actuated solenoid valves driving a miniature PCM storage vessel.",
    outputs: ["Embedded Firmware (C++ / MicroPython)", "IoT Telemetry Dashboard", "Hardware-in-the-Loop Experimental Verification"],
    linkPage: null,
  },
];

const TERRITORIES = [
  {
    icon: "",
    name: "Tamil Nadu",
    tag: "Lead State · v3.2 Verified",
    gridPoints: 133,
    records: "1,445,577",
    regimes: "k=5 GMM Regimes",
    primaryPCM: "n-Octacosane (C28) & RT64HC",
    summary: "Coastal, Plains, Ghats, Delta, and Southern zones. Strong positive physics correlation (ρ = +0.717, p = 0.030) with 41% inside the 54–84% solar fraction band.",
  },
  {
    icon: "️",
    name: "Rajasthan",
    tag: "Arid Core · Continental Swings",
    gridPoints: 320,
    records: "200,000",
    regimes: "k=3 GMM Regimes",
    primaryPCM: "savE® OM50 & RT50",
    summary: "Thar Desert core, Southern plateau, and Shekhawati. Extreme diurnal temperature swings and peak GHI > 1050 W/m² requiring high latent heat retention.",
  },
  {
    icon: "",
    name: "Assam",
    tag: "Subtropical · Monsoon Attenuated",
    gridPoints: 129,
    records: "1,402,101",
    regimes: "k=3 GMM Regimes",
    primaryPCM: "RT44HC & RT45HC",
    summary: "Brahmaputra Valley and Barak Valley. Relative humidity > 70% with heavy monsoon cloud attenuation favoring moderate melting point paraffins.",
  },
  {
    icon: "️",
    name: "Uttarakhand",
    tag: "Montane · Elevation Stratified",
    gridPoints: 45,
    records: "489,105",
    regimes: "k=5 GMM Regimes",
    primaryPCM: "RT60 & savE® OM55",
    summary: "Tarai plains (~300m) to Greater Himalayas (>2500m). Sub-zero frost constraints mandate higher Tm PCMs to prevent winter phase freeze-out.",
  },
];

function OverviewPage({ onNavigate }) {
  return (
    <section className="content" id="top">


      {/* ── Hero Section ── */}
      <div className="page-hero">
        <h1>Climate-Adaptive Intelligent Control and Optimization of PCM Thermal Storage for Solar Water Heating</h1>

        <p className="intro">
          Solar water heating systems face severe intermittency due to nighttime absence of radiation and daytime monsoonal cloud cover.
          By integrating <strong>Phase Change Materials (PCMs)</strong> for latent heat storage with machine learning climate clustering,
          multi-criteria decision making, AI surrogate design optimization, and deep reinforcement learning, this project delivers an autonomous,
          end-to-end climate-adaptive solar thermal energy solution.
        </p>

        <div className="overview-cta-row">
          <button className="overview-cta-btn primary" onClick={() => onNavigate("objective1")}>
            <span>Explore Objective 1 (PCM Selection)</span>
            <span>→</span>
          </button>
          <button className="overview-cta-btn secondary" onClick={() => onNavigate("objective2")}>
            <span>Explore Objective 2 (Storage Design & AI)</span>
            <span>→</span>
          </button>
        </div>
      </div>



      {/* ── Real-World Motivation & Industry Gap ── */}
      <div className="content-section" id="motivation">
        <div className="plots-section-header">
          <h2>Motivation & Industrial State-of-the-Art</h2>
        </div>
        <p className="section-desc">
          Why latent heat storage with PCMs is critical for transforming solar water heating in India.
        </p>
        <div className="section-divider" />

        <div className="results-grid" style={{ marginBottom: 32 }}>
          <div className="result-stat-card">
            <div className="result-stat-value">133 GW</div>
            <div className="result-stat-label">Solar Share in India's 254 GW Renewables (1:1.9 Ratio)</div>
          </div>
          <div className="result-stat-card">
            <div className="result-stat-value">48–50%</div>
            <div className="result-stat-label">Global Final Energy Demand Consumed by Thermal Heat</div>
          </div>
          <div className="result-stat-card">
            <div className="result-stat-value">6–8%</div>
            <div className="result-stat-label">Residential Electricity Consumed by Water Heating Alone</div>
          </div>
          <div className="result-stat-card">
            <div className="result-stat-value">45–70%</div>
            <div className="result-stat-label">Typical Conventional SWH Seasonal Thermal Efficiency</div>
          </div>
        </div>

        <div className="data-table-wrapper" style={{ marginTop: 24 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Country</th>
                <th>PCM Integrated?</th>
                <th>PCM Technology Used</th>
                <th>System Application</th>
              </tr>
            </thead>
            <tbody>
              {INDUSTRY_COMPARISON.map((row) => (
                <tr key={row.company}>
                  <td style={{ fontWeight: 600, color: "#ffffff" }}>{row.company}</td>
                  <td>{row.country}</td>
                  <td>
                    <span className={`tag ${row.pcmUsed === "Yes" ? "tag-brand" : "tag-zinc"}`}>
                      {row.pcmUsed === "Yes" ? " Yes" : " No"}
                    </span>
                  </td>
                  <td style={{ color: "#ffffff" }}>{row.pcmDetails}</td>
                  <td>{row.application}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="finding-item" style={{ marginTop: 24 }}>
          <span className="finding-icon"></span>
          <div className="finding-text">
            <strong>The Deployment Gap in India:</strong> While international pioneers like Sunamp (UK) commercially deploy
            latent heat batteries, Indian systems (Emmvee, Racold) predominantly use sensible water buffers. India faces higher climatic
            heterogeneity, requiring climate-adaptive PCM selection rather than one-size-fits-all hardware.
          </div>
        </div>
      </div>

      {/* ── Overall System Architecture ── */}
      <div className="content-section" id="architecture">
        <div className="plots-section-header">
          <h2>End-to-End System Architecture</h2>
        </div>
        <p className="section-desc">
          Modular research architecture spanning climate reanalysis, multi-criteria material selection,
          numerical surrogate modeling, dynamic control, and embedded deployment.
        </p>
        <div className="section-divider" />

        <div className="arch-flow-container">
          <div className="arch-step">
            <div className="arch-step-num">01</div>
            <div className="arch-step-box">
              <div className="arch-step-header">
                <h4>Meteorological Data Layer</h4>
              </div>
              <p>10-year hourly ECMWF ERA5 & NASA POWER reanalysis (637 population-weighted points across 4 states).</p>
            </div>
          </div>

          <div className="arch-step-arrow">→</div>

          <div className="arch-step">
            <div className="arch-step-num">02</div>
            <div className="arch-step-box">
              <div className="arch-step-header">
                <h4>Climate Clustering (GMM)</h4>
              </div>
              <p>Gaussian Mixture Models (k=3, k=5) discovering micro-climatic regimes per state territory.</p>
            </div>
          </div>

          <div className="arch-step-arrow">→</div>

          <div className="arch-step">
            <div className="arch-step-num">03</div>
            <div className="arch-step-box">
              <div className="arch-step-header">
                <h4>Multi-Criteria Decision Analysis</h4>
              </div>
              <p>TOPSIS, PROMETHEE II, GRA, VIKOR consensus ranking candidates across 8 thermophysical properties.</p>
            </div>
          </div>

          <div className="arch-step-arrow">→</div>

          <div className="arch-step">
            <div className="arch-step-num">04</div>
            <div className="arch-step-box">
              <div className="arch-step-header">
                <h4>Surrogate Design Optimization</h4>
              </div>
              <p>LHS sampling + 2-node enthalpy simulation training AI surrogate regressors for MOPSO / NSGA-II geometry design.</p>
            </div>
          </div>

          <div className="arch-step-arrow">→</div>

          <div className="arch-step">
            <div className="arch-step-num">05</div>
            <div className="arch-step-box">
              <div className="arch-step-header">
                <h4>Deep Reinforcement Learning</h4>
              </div>
              <p>PPO agent controlling charging/discharging valve actuation under stochastic weather.</p>
            </div>
          </div>

          <div className="arch-step-arrow">→</div>

          <div className="arch-step">
            <div className="arch-step-num">06</div>
            <div className="arch-step-box">
              <div className="arch-step-header">
                <h4>Embedded Hardware Prototype</h4>
              </div>
              <p>ESP32 / Pi closed-loop hardware deployment with temperature probes and valve relay actuation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 Research Objectives Roadmap ── */}
      <div className="content-section" id="objectives">
        <div className="plots-section-header">
          <h2>Core Research Objectives & Progress Matrix</h2>
        </div>
        <p className="section-desc">
          Current phase-wise progress across all four planned research objectives.
        </p>
        <div className="section-divider" />

        <div className="objectives-list">
          {OBJECTIVES_ROADMAP.map((obj) => (
            <div key={obj.id} className="objective-card">
              <div className="objective-card-top">
                <div className="objective-card-title-group">
                  <span className="objective-card-num">{obj.num}</span>
                  <h3>{obj.title}</h3>
                </div>
              </div>

              <p className="objective-card-desc">{obj.desc}</p>

              <div className="objective-card-outputs">
                <span className="objective-outputs-label">Key Deliverables & Milestones:</span>
                <div className="tag-list" style={{ marginTop: 6 }}>
                  {obj.outputs.map((out) => (
                    <span key={out} className="tag tag-zinc"> {out}</span>
                  ))}
                </div>
              </div>

              {obj.linkPage && (
                <div style={{ marginTop: 18 }}>
                  <button className="plot-toggle-btn" onClick={() => onNavigate(obj.linkPage)}>
                    Open {obj.title} Documentation →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 4-State Geographic Scope ── */}
      <div className="content-section" id="territories">
        <div className="plots-section-header">
          <h2>4-State Contrasting Climate Scope</h2>
        </div>
        <p className="section-desc">
          Four Indian states intentionally selected to cover contrasting extremes of solar irradiance,
          humidity, elevation, and seasonal monsoonal dynamics.
        </p>
        <div className="section-divider" />

        <div className="territories-grid">
          {TERRITORIES.map((t) => (
            <div key={t.name} className="territory-card">
              <div className="territory-card-header">
                <span className="territory-card-icon">{t.icon}</span>
                <div>
                  <h3 style={{ margin: 0 }}>{t.name}</h3>
                  <span className="tag tag-zinc" style={{ marginTop: 4, display: "inline-block" }}>{t.tag}</span>
                </div>
              </div>

              <p style={{ fontSize: "0.85rem", color: "var(--neutral-300)", marginBottom: 16 }}>{t.summary}</p>

              <div className="territory-props">
                <div className="rec-prop">
                  <span className="rec-prop-label">Grid Points</span>
                  <span className="rec-prop-value">{t.gridPoints} Points</span>
                </div>
                <div className="rec-prop">
                  <span className="rec-prop-label">Cleaned Records</span>
                  <span className="rec-prop-value">{t.records}</span>
                </div>
                <div className="rec-prop">
                  <span className="rec-prop-label">GMM Clusters</span>
                  <span className="rec-prop-value">{t.regimes}</span>
                </div>
                <div className="rec-prop">
                  <span className="rec-prop-label">Consensus Winner</span>
                  <span className="rec-prop-value" style={{ color: "#ffffff" }}>{t.primaryPCM}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── UN Sustainable Development Goals ── */}
      <div className="content-section" id="sdgs">
        <div className="plots-section-header">
          <h2>United Nations Sustainable Development Goals (SDGs)</h2>
        </div>
        <p className="section-desc">
          Direct contributions to sustainable, affordable, and zero-carbon energy transition targets.
        </p>
        <div className="section-divider" />

        <div className="sdg-grid">
          {PROJECT_META.sdgs.map((sdg) => (
            <div key={sdg.num} className="sdg-card">
              <div className="sdg-badge">SDG {sdg.num}</div>
              <h4>{sdg.title}</h4>
              <p>{sdg.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OverviewPage;
