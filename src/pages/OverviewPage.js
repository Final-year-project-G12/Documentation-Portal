import { Rich } from "../components/Cite";
import Bullets from "../components/Bullets";
import Figure from "../components/Figure";
import { METHODS } from "../data/methods";
import { resetTerms } from "../data/terms";

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
    desc: [
      "Clusters 10 years of ERA5 {{cite:Hersbach2020ERA5}} and NASA POWER {{cite:Stackhouse2021POWER}} weather data (GMM) across 4 contrasting Indian territories (578 points).",
      "Ranks PCMs with multi-criteria decision analysis: TOPSIS {{cite:HwangYoon1981MADM}}, PROMETHEE II {{cite:BransVincke1985PROMETHEE}}, GRA {{cite:Deng1982GreySystems}} and VIKOR {{cite:OpricovicTzeng2004VIKOR}}.",
      "Combines the four rankings by Borda consensus.",
      "Checks the ranking with a 2-node lumped-enthalpy physics model.",
    ],
    outputs: ["14 Climate Regimes (3 + 3 + 5 + 3)", "4-Method MCDM Consensus Ranks", "Physics check against the 54–84% solar-fraction band {{cite:Singh2025PCMSWH}}", "Per-Regime PCM Recommendation Cards"],
    linkPage: "objective1",
  },
  {
    id: "obj2",
    num: "Objective 2",
    title: "AI-Driven Storage Design Optimization",
    desc: [
      "Takes the frozen Objective 1 PCM shortlists as input.",
      "Optimizes capsule geometry (spherical or cylindrical macro-encapsulation, thickness, count) and water flow rates.",
      "Uses Latin Hypercube Sampling (LHS), a 2-node grey-box enthalpy simulation and an AI surrogate model (NSGA-II / MOPSO).",
    ],
    outputs: ["Frozen Multi-State Input Packages", "LHS Design of Experiments (DOE)", "AI Surrogate Feasibility & Performance Regressors", "Objective 3 Environment Hand-off"],
    linkPage: "objective2",
  },
  {
    id: "obj3",
    num: "Objective 3",
    title: "Adaptive DRL Control & Dynamic Actuation",
    desc: [
      "A Deep Reinforcement Learning (DRL) agent (PPO / Actor-Critic) reads the state vector s_t = [Tw, Tp, f, GHI, Tamb, wind, time].",
      "It sets the charging, discharging and bypass valve positions.",
      "Goal: maximize hot water delivery availability under stochastic weather.",
    ],
    outputs: ["Trained PPO Controller", "Simulated Performance vs Rule-Based Baselines", "Robustness under Demand & Cloud Spikes"],
    linkPage: null,
  },
  {
    id: "obj4",
    num: "Objective 4",
    title: "Embedded Closed-Loop Hardware Prototype",
    desc: [
      "Runs as a physical embedded system on an ESP32 / Raspberry Pi.",
      "Reads DS18B20 multi-point temperature probes and irradiance sensors.",
      "Drives actuated solenoid valves on a miniature PCM storage vessel.",
    ],
    outputs: ["Embedded Firmware (C++ / MicroPython)", "IoT Telemetry Dashboard", "Hardware-in-the-Loop Experimental Verification"],
    linkPage: null,
  },
];

const TERRITORIES = [
  {
    name: "Tamil Nadu",
    tag: "Tropical maritime & semi-arid",
    gridPoints: 133,
    survivors: "8 / 10 / 8",
    regimes: "k=3 GMM Regimes",
    primaryPCM: "RT57HC (all clusters)",
    summary: [
      "Three regimes: southern plains, western interior, north-east coast.",
      "Physics agreement is weak and not significant (ρ = −0.333, +0.103, +0.024).",
    ],
  },
  {
    name: "Rajasthan",
    tag: "Arid core · reference state",
    gridPoints: 320,
    survivors: "4 / 8 / 11",
    regimes: "k=3 GMM Regimes",
    primaryPCM: "savE® OM55 / PureTemp 60 / palmitic-stearic–EG",
    summary: [
      "Three regimes, with Udaipur, Nagaur and Jaipur medoids.",
      "The physics check is negative or partial (ρ = −0.200, −0.168, +0.569).",
    ],
  },
  {
    name: "Assam",
    tag: "Subtropical · monsoon attenuated",
    gridPoints: 80,
    survivors: "35 / 33 / 33",
    regimes: "k=3 GMM Regimes",
    primaryPCM: "savE® OM49 (all clusters)",
    summary: [
      "Brahmaputra and Barak valleys; cluster-mean relative humidity is 76–79%.",
      "The current grid has 80 points.",
      "Physics agreement is negative against simulated hours at or above 50 °C (ρ = −0.16, −0.46, −0.41).",
    ],
  },
  {
    name: "Uttarakhand",
    tag: "Montane · elevation stratified",
    gridPoints: 45,
    survivors: "29 / 30 / 29 / 27 / 29",
    regimes: "k=5 GMM Regimes",
    primaryPCM: "PureTemp 58 (PureTemp 53 in C1)",
    summary: [
      "Five regimes, on the older 57 °C design basis.",
      "Physics agreement is weak and not significant.",
      "Simulated solar fractions (12–19%) are below the 54–84% band.",
    ],
  },
];

function OverviewPage({ onNavigate }) {
  resetTerms();
  return (
    <section className="content" id="top">


      {/* ── Hero Section ── */}
      <div className="page-hero">
        <h1>Climate-Adaptive Intelligent Control and Optimization of PCM Thermal Storage for Solar Water Heating</h1>

        <Bullets
          className="intro-bullets"
          items={[
            "Solar water heaters face severe intermittency: no radiation at night and monsoon cloud cover by day.",
            "The project stores spare heat in <strong>Phase Change Materials (PCMs)</strong> as latent heat.",
            "It adds machine learning climate clustering, multi-criteria decision making, AI surrogate design optimization and deep reinforcement learning.",
            "The result is an autonomous, end-to-end, climate-adaptive solar thermal energy solution.",
          ]}
        />

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
            <div className="result-stat-label"><Rich text="Solar Share in India's 254 GW Renewables (1:1.9 Ratio) {{cite:PVMagIndia2025Solar}} {{cn}}" /></div>
          </div>
          <div className="result-stat-card">
            <div className="result-stat-value">48–50%</div>
            <div className="result-stat-label"><Rich text="Global Final Energy Demand Consumed by Thermal Heat {{cite:IEA2023Heat}}" /></div>
          </div>
          <div className="result-stat-card">
            <div className="result-stat-value">6–8%</div>
            <div className="result-stat-label"><Rich text="Household Energy Used for Water Heating Alone (slide value, not independently verified) {{cite:AlMamun2023SWHReview}}" /></div>
          </div>
          <div className="result-stat-card">
            <div className="result-stat-value">45–70%</div>
            <div className="result-stat-label"><Rich text="Conventional SWH Annual Efficiency (slide value, not independently verified) {{cite:AlMamun2023SWHReview}}" /></div>
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

        <p className="section-desc" style={{ marginTop: 16, marginBottom: 0 }}>
          Company table and capacity figures come from the Review 2 presentation, which does not cite a
          published source <Rich text="{{cn}}" />.
        </p>

        <h3 style={{ marginTop: 28 }}>The Deployment Gap in India</h3>
        <Bullets
          items={[
            "The presentation contrasts latent heat batteries from Sunamp (UK) {{cite:SunampPlentigrade}} with Emmvee's Indian systems, which use a sensible water buffer only {{cn}}.",
            "India has higher climatic heterogeneity.",
            "So PCM selection must adapt to climate, not use one-size-fits-all hardware.",
          ]}
        />
      </div>

      {/* ── Overall System Architecture ── */}
      <div className="content-section" id="architecture">
        <div className="plots-section-header">
          <h2>Project Architecture</h2>
        </div>
        <p className="section-desc">
          The project runs from climate data to material choice, design optimization, control and hardware.
        </p>
        <div className="section-divider" />

        <div className="diagram">
          <Figure
            src={`${process.env.PUBLIC_URL}/diagrams/project-architecture.png`}
            title="Project architecture: Objectives 1 to 4 with real-time feedback"
            alt="Block diagram of the four project objectives. Objective 1 selects PCMs from climate data, Objective 2 optimises the PCM system design, Objective 3 is a deep reinforcement learning controller, and Objective 4 deploys the prototype, with a real-time feedback loop from temperature, flow rate, PCM state and hot-water output."
            caption="Project architecture, Review 2 presentation, slide 3.2."
          />
          <p className="diagram-caption">
            Project architecture, Objectives 1 to 4 with real-time feedback (Review 2 presentation, slide 3.2 <Rich text="{{cite:Group12Review2}}" />).
          </p>
          <Bullets
            items={[
              "<strong>Not redrawn:</strong> the Objective 1 box in this figure predates the implemented pipeline.",
              "It names \"GNN / K-means\" for clustering; the pipeline uses a Gaussian Mixture Model.",
              "It lists three ranking methods (TOPSIS, VIKOR, GRA); the pipeline uses four (TOPSIS, PROMETHEE II, GRA, VIKOR).",
              "The Objective 1 diagram and the pipeline on the Objective 1 page are current.",
            ]}
          />
        </div>

        <div className="arch-flow-container">
          <div className="arch-step">
            <div className="arch-step-num">01</div>
            <div className="arch-step-box">
              <div className="arch-step-header">
                <h4>Meteorological Data Layer</h4>
              </div>
              <p>10-year ECMWF ERA5 <Rich text="{{cite:Hersbach2020ERA5}}" /> and NASA POWER <Rich text="{{cite:Stackhouse2021POWER}}" /> reanalysis (578 population-weighted points across 4 states).</p>
            </div>
          </div>

          <div className="arch-step-arrow">→</div>

          <div className="arch-step">
            <div className="arch-step-num">02</div>
            <div className="arch-step-box">
              <div className="arch-step-header">
                <h4>Climate Clustering (GMM)</h4>
              </div>
              <p><Rich text="A Gaussian mixture model {{cite:Dempster1977EM}} groups each state's points into climate regimes (k=3 for three states, k=5 for Uttarakhand)." /></p>
            </div>
          </div>

          <div className="arch-step-arrow">→</div>

          <div className="arch-step">
            <div className="arch-step-num">03</div>
            <div className="arch-step-box">
              <div className="arch-step-header">
                <h4>Multi-Criteria Decision Analysis</h4>
              </div>
              <p><Rich text="Four methods rank candidates on 8 criteria and a consensus is taken: TOPSIS {{cite:HwangYoon1981MADM}}, PROMETHEE II {{cite:BransVincke1985PROMETHEE}}, GRA {{cite:Deng1982GreySystems}}, VIKOR {{cite:OpricovicTzeng2004VIKOR}}." /></p>
            </div>
          </div>

          <div className="arch-step-arrow">→</div>

          <div className="arch-step">
            <div className="arch-step-num">04</div>
            <div className="arch-step-box">
              <div className="arch-step-header">
                <h4>Surrogate Design Optimization</h4>
              </div>
              <p><Rich text="Latin Hypercube sampling and a 2-node enthalpy simulation train AI surrogate regressors; MOPSO / NSGA-II then search the geometry design." /></p>
            </div>
          </div>

          <div className="arch-step-arrow">→</div>

          <div className="arch-step">
            <div className="arch-step-num">05</div>
            <div className="arch-step-box">
              <div className="arch-step-header">
                <h4>Deep Reinforcement Learning</h4>
              </div>
              <p><Rich text="A PPO agent controls the charging and discharging valves under stochastic weather." /></p>
            </div>
          </div>

          <div className="arch-step-arrow">→</div>

          <div className="arch-step">
            <div className="arch-step-num">06</div>
            <div className="arch-step-box">
              <div className="arch-step-header">
                <h4>Embedded Hardware Prototype</h4>
              </div>
              <p>An ESP32 / Pi board closes the loop with temperature probes and relay-driven valves.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Algorithms ── */}
      <div className="content-section" id="methods">
        <div className="plots-section-header">
          <h2>Algorithms Used</h2>
          <span className="plots-count-badge">{METHODS.length} Algorithms</span>
        </div>
        <p className="section-desc">
          The statistical and decision methods behind stages 4, 7 and 8, with the reason each was chosen.
        </p>
        <div className="section-divider" />
        <div className="methods-grid">
          {METHODS.map((m) => (
            <div key={m.title} className="method-card">
              <div className="method-card-tag">{m.tag}</div>
              <h3>{m.title}</h3>
              <Bullets items={m.points} />
            </div>
          ))}
        </div>
      </div>

      {/* ── 4 Research Objectives Roadmap ── */}
      <div className="content-section" id="objectives">
        <div className="plots-section-header">
          <h2>Core Research Objectives & Progress Matrix</h2>
        </div>
        <p className="section-desc">
          Where each of the four planned research objectives stands.
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

              <Bullets className="objective-card-bullets" items={obj.desc} />

              <div className="objective-card-outputs">
                <span className="objective-outputs-label">Key Deliverables & Milestones:</span>
                <div className="tag-list" style={{ marginTop: 6 }}>
                  {obj.outputs.map((out) => (
                    <span key={out} className="tag tag-zinc"><Rich text={out} /></span>
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
          Four states were picked to cover contrasting sunlight, humidity, elevation and monsoon patterns.
        </p>
        <div className="section-divider" />

        <div className="territories-grid">
          {TERRITORIES.map((t) => (
            <div key={t.name} className="territory-card">
              <div className="territory-card-header">
                <div>
                  <h3 style={{ margin: 0 }}>{t.name}</h3>
                  <span className="tag tag-zinc" style={{ marginTop: 4, display: "inline-block" }}>{t.tag}</span>
                </div>
              </div>

              <Bullets items={t.summary} />

              <div className="territory-props">
                <div className="rec-prop">
                  <span className="rec-prop-label">Grid Points</span>
                  <span className="rec-prop-value">{t.gridPoints} Points</span>
                </div>
                <div className="rec-prop">
                  <span className="rec-prop-label">Calibrated Survivors</span>
                  <span className="rec-prop-value">{t.survivors}</span>
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
          The project contributes directly to four UN goals on clean, affordable, low-carbon energy.
        </p>
        <div className="section-divider" />

        <div className="sdg-grid">
          {PROJECT_META.sdgs.map((sdg) => (
            <div key={sdg.num} className="sdg-card">
              <img
                className="sdg-tile"
                src={`${process.env.PUBLIC_URL}/sdg/sdg-${sdg.num}.png`}
                alt={`SDG ${sdg.num}: ${sdg.title}`}
              />
              <p>{sdg.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OverviewPage;
