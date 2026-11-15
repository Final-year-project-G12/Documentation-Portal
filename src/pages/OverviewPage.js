import { useState } from "react";
import { Rich, richHtml } from "../components/Cite";
import Bullets from "../components/Bullets";
import Figure from "../components/Figure";
import { resetTerms } from "../data/terms";
import useReveal from "../components/useReveal";
import { StatTiles, ChipTabs, StepExplorer, ProgressBar, Callout } from "../components/Interactive";
import { REPO_LINKS, O3_DASHBOARD_URL } from "../data/links";
import { MOTIVATION_FLOW, RESEARCH_GAPS, PROBLEM_STATEMENT, RESEARCH_THEMES, INDUSTRY_EXPERT, LITERATURE, TRADEOFFS, FUTURE_SCOPE } from "../data/overviewContent";

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
    outputs: ["13 Climate Regimes (3 + 3 + 4 + 3)", "4-Method MCDM Consensus Ranks", "Physics check against the 54–84% solar-fraction band {{cite:Singh2025PCMSWH}}", "Per-Regime PCM Recommendation Cards"],
    linkPage: "objective1",
  },
  {
    id: "obj2",
    num: "Objective 2",
    title: "AI-Driven Storage Design Optimization",
    desc: [
      "Takes the Objective 1 PCM shortlist of each regime as a fixed input.",
      "Searches capsule inner radius, PCM volume fraction, flow rate and arrangement on a multi-node tank simulation.",
      "Uses a surrogate-assisted, constrained multi-objective search: Taguchi screening, a Sobol design, surrogate comparison and NSGA-II {{cite:Deb2002NSGA2}} with active learning. The simulator evaluates every reported number.",
      "Rajasthan, Tamil Nadu and Uttarakhand have chosen designs tested once on held-out years; Assam is being rebuilt on a 500 L chain and its results are pending.",
    ],
    outputs: ["Chosen Design per Regime", "One-Shot Held-out Test on Untouched Years", "Repeatability Band and Paired Water-Only Baseline", "Objective 3 Environment Contract v3 (3 States)"],
    linkPage: "objective2",
  },
  {
    id: "obj3",
    num: "Objective 3",
    title: "DRL-Based Adaptive Controller",
    desc: [
      "Uses the Objective 2 tank simulator as the training environment.",
      "Every hour the controller reads sunlight, temperatures, the melted share of the PCM, hot-water demand and time of day, then picks charge, idle or bypass.",
      "A built-in safety guard stops the collector at 72 °C (water) and 62 °C (PCM), just below the hard limits of 75 °C and 65 °C; the controller cannot switch it off.",
      "The reward counts hot water delivered and penalises unmet demand, broken limits, needless switching and every guard activation.",
      "Six agents (PPO, DQN, RecurrentPPO, QRDQN, MaskablePPO, SAC) train on the same environment and are compared with simple rules {{cite:Emami2026DRLSolar}}.",
    ],
    outputs: ["SAC selected (Tamil Nadu), DQN selected (Rajasthan)", "Keeps about 95–98% of delivered heat with far fewer guard activations", "No hard limit broken", "Train 2016–2020 · validate 2021–2023 · test 2011–2015"],
    linkPage: "objective3",
  },
  {
    id: "obj4",
    num: "Objective 4",
    title: "Software-in-the-Loop Validation (MATLAB Digital Twin)",
    desc: [
      "The tank, PCM capsules, collector and pump are rebuilt in MATLAB as a line-for-line port of the Objective 2 physics, with noisy sensors, sensor dropout, a stale-data fail-safe and the same safety guard.",
      "Built for three states: Tamil Nadu (SAC, 100 L single-node tank), Rajasthan (DQN, 50 L 10-node stratified tank) and Uttarakhand (PPO, 50 L, 50 °C target).",
      "Compares three arms: plain tank, PCM with always-charge, and PCM with the learned controller, which separates the PCM benefit from the AI benefit.",
      "The same weather and controller run in Python and MATLAB and take the same actions.",
      "Tests: one-day charge/discharge cycle, six edge cases plus a dead and a stuck sun sensor, a 72 h retention test, and PCM swap and flow sweeps.",
      "Trials on real hardware (Raspberry Pi / ESP32) are future work.",
    ],
    outputs: ["MATLAB digital twin for 3 states", "No hard limit broken in any test", "Finding: a dead sun sensor is not caught (Rajasthan 701 vs 430 guard hours); an irradiance plausibility rule is the next fix"],
    linkPage: "objective4",
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
      "Physics comparison is an exploratory complement to the ranking (ρ = −0.333, +0.103, +0.024).",
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
      "The physics check is weak and not significant (ρ = −0.200, −0.168, +0.569; p = 0.80, 0.69, 0.067), so predictive validity is not established.",
    ],
  },
  {
    name: "Assam",
    tag: "Subtropical · monsoon attenuated",
    gridPoints: 80,
    survivors: "9 / 9 / 9 (provisional)",
    regimes: "k=3 GMM Regimes",
    primaryPCM: "RT54HC (provisional, all clusters)",
    summary: [
      "Brahmaputra and Barak valleys; cluster-mean relative humidity is 76–79%.",
      "80 points in three regimes (27 / 28 / 25).",
      "Latest ranking: RT54HC first in every cluster (Kendall's W 0.95); provisional while the feasibility filter is corrected, and no physics comparison yet.",
    ],
  },
  {
    name: "Uttarakhand",
    tag: "Montane · elevation stratified",
    gridPoints: 45,
    survivors: "29 / 29 / 29 / 30",
    regimes: "k=4 GMM Regimes",
    primaryPCM: "PureTemp 58 (PureTemp 53 in C3)",
    summary: [
      "Four regimes from the warm plains to the high Himalaya, on the 57 °C design basis; the same regimes feed Objective 2.",
      "Physics comparison is exploratory (ρ from −0.34 to +0.11).",
      "Simulated solar fractions (12–20%) sit below the 54–84% reference band, so the physics check is read as context.",
    ],
  },
];

/* The six layers of the project, shown as clickable steps. */
const ARCH_STEPS = [
  { title: "Meteorological Data Layer", text: "10-year ECMWF ERA5 {{cite:Hersbach2020ERA5}} and NASA POWER {{cite:Stackhouse2021POWER}} reanalysis (578 population-weighted points across 4 states)." },
  { title: "Climate Clustering (GMM)", text: "A Gaussian mixture model {{cite:Dempster1977EM}} groups each state's points into climate regimes (k=3 for three states, k=4 for Uttarakhand)." },
  { title: "Multi-Criteria Decision Analysis", text: "Four methods rank candidates on 8 criteria (9 in Tamil Nadu) and a consensus is taken: TOPSIS {{cite:HwangYoon1981MADM}}, PROMETHEE II {{cite:BransVincke1985PROMETHEE}}, GRA {{cite:Deng1982GreySystems}}, VIKOR {{cite:OpricovicTzeng2004VIKOR}}." },
  { title: "Surrogate Design Optimization", text: "A multi-node enthalpy simulation, Taguchi screening and a Sobol design train surrogate models; NSGA-II {{cite:Deb2002NSGA2}} with active learning then searches radius, PCM fraction and flow, and a one-shot held-out test checks the choice." },
  { title: "Deep Reinforcement Learning", text: "Six learning agents train on the Objective 2 tank simulator and choose charge, idle or bypass every hour behind a safety guard; SAC (Tamil Nadu) and DQN (Rajasthan) are selected {{cite:Emami2026DRLSolar}}." },
  { title: "Software-in-the-Loop Validation", text: "A MATLAB digital twin of the tank, capsules, collector and pump tests the trained controller with noisy and failing sensors in three states; real hardware (Raspberry Pi / ESP32) is future work." },
];

/* Completion per objective (Review presentation, implementation overview slide). */
const OBJECTIVE_PROGRESS = { obj1: 100, obj2: 100, obj3: 90, obj4: 80 };

const INTRO_CARDS = [
  { kicker: "Problem", text: "Solar water heaters work with a variable resource: no radiation at night and monsoon cloud cover by day." },
  { kicker: "Approach", text: "Store spare heat in <strong>Phase Change Materials (PCMs)</strong> as latent heat, chosen and controlled with climate clustering, multi-criteria decision making, AI surrogate design optimization and deep reinforcement learning." },
  { kicker: "Outcome", text: "An autonomous, end-to-end, climate-adaptive solar thermal energy solution." },
];

const HERO_STATS = [
  { value: "4", label: "Contrasting Indian states" },
  { value: "578", label: "Population-weighted climate points" },
  { value: "13", label: "Climate regimes discovered" },
  { value: "62", label: "PCM candidates screened" },
];

const MOTIVATION_STATS = [
  { value: "133 GW", label: "Solar Share in India's 254 GW Renewables (1:1.9 Ratio) {{cite:PVMagIndia2025Solar}} {{cn}}" },
  { value: "48–50%", label: "Global Final Energy Demand Consumed by Thermal Heat {{cite:IEA2023Heat}}" },
  { value: "6–8%", label: "Household Energy Used for Water Heating Alone (Review 2 slide value) {{cite:AlMamun2023SWHReview}}" },
  { value: "45–70%", label: "Conventional SWH Annual Efficiency (Review 2 slide value) {{cite:AlMamun2023SWHReview}}" },
];

const INDUSTRY_FILTERS = [
  { id: "all", label: "All companies" },
  { id: "Yes", label: "Uses PCM" },
  { id: "No", label: "Water buffer only" },
];

function OverviewPage({ onNavigate }) {
  resetTerms();
  const [industryFilter, setIndustryFilter] = useState("all");
  const [objId, setObjId] = useState(OBJECTIVES_ROADMAP[0].id);
  const [stateIdx, setStateIdx] = useState(0);
  const [litId, setLitId] = useState(LITERATURE[0].id);
  const revealRef = useReveal([industryFilter, objId, stateIdx, litId]);
  const litGroup = LITERATURE.find((g) => g.id === litId);

  const companies = INDUSTRY_COMPARISON.filter((c) => industryFilter === "all" || c.pcmUsed === industryFilter);
  const obj = OBJECTIVES_ROADMAP.find((o) => o.id === objId);
  const territory = TERRITORIES[stateIdx];

  return (
    <section className="content animated-page" id="top" ref={revealRef}>
      {/* ── Hero ── */}
      <div className="page-hero">
        <div className="eyebrow">
          <span className="eyebrow-badge">Group 12 · Final Year Project</span>
          <span>Project overview</span>
        </div>
        <h1>Climate-Adaptive Intelligent Control and Optimization of PCM Thermal Storage for Solar Water Heating</h1>
        <div className="ui-intro-grid">
          {INTRO_CARDS.map((c) => (
            <div key={c.kicker} className="ui-intro-card">
              <div className="ui-card-kicker">{c.kicker}</div>
              <p dangerouslySetInnerHTML={{ __html: richHtml(c.text) }} />
            </div>
          ))}
        </div>
        <div className="overview-cta-row">
          <button className="overview-cta-btn primary" onClick={() => onNavigate("objective1")}>
            <span>Explore Objective 1 (PCM Selection)</span>
            <span>→</span>
          </button>
          <button className="overview-cta-btn secondary" onClick={() => onNavigate("objective2")}>
            <span>Explore Objective 2 (Storage Design & AI)</span>
            <span>→</span>
          </button>
          <button className="overview-cta-btn secondary" onClick={() => onNavigate("objective3")}>
            <span>Explore Objective 3 (DRL Control)</span>
            <span>→</span>
          </button>
          <button className="overview-cta-btn secondary" onClick={() => onNavigate("objective4")}>
            <span>Explore Objective 4 (Digital Twin)</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <StatTiles items={HERO_STATS} />

      {/* ── Code & live demo ── */}
      <div className="content-section" id="repositories">
        <div className="plots-section-header">
          <h2>Code Repositories & Live Dashboard</h2>
          <span className="plots-count-badge">{REPO_LINKS.length} Repos</span>
        </div>
        <p className="section-desc">Every objective lives in its own GitHub repository. The Objective 3 controller also has a live dashboard.</p>
        <div className="section-divider" />
        <div className="ui-card-grid">
          {REPO_LINKS.map((r) => (
            <div key={r.repo} className="ui-card">
              <div className="ui-card-kicker">GitHub</div>
              <h4>{r.label}</h4>
              <p>{r.note}</p>
              <a className="ui-btn ghost" href={r.url} target="_blank" rel="noopener noreferrer">{r.repo} ↗</a>
            </div>
          ))}
          <div className="ui-card">
            <div className="ui-card-kicker">Live app</div>
            <h4>Objective 3 Streamlit dashboard</h4>
            <p>Interactive results and live controller comparison for the DRL agents.</p>
            <a className="ui-btn" href={O3_DASHBOARD_URL} target="_blank" rel="noopener noreferrer">Open dashboard ↗</a>
          </div>
        </div>
      </div>

      {/* ── Motivation ── */}
      <div className="content-section" id="motivation">
        <div className="plots-section-header">
          <h2>Motivation & Industrial State-of-the-Art</h2>
        </div>
        <p className="section-desc">
          How a solar water heater works today, what goes wrong, and what this project improves.
        </p>
        <div className="section-divider" />

        <div className="ui-card-grid ui-flow-grid">
          {MOTIVATION_FLOW.map((m, i) => (
            <div key={m.kicker} className="ui-card ui-flow-card">
              <div className="ui-card-kicker">{String(i + 1).padStart(2, "0")} · {m.kicker}</div>
              <Bullets items={m.points} />
            </div>
          ))}
        </div>

        <h3>Why it matters</h3>
        <StatTiles items={MOTIVATION_STATS} />

        <h3>Who uses PCM storage today?</h3>
        <ChipTabs options={INDUSTRY_FILTERS} value={industryFilter} onChange={setIndustryFilter} ariaLabel="Filter companies" />
        <div key={industryFilter} className="ui-card-grid tab-panel">
          {companies.map((c) => (
            <div key={c.company} className="ui-card">
              <div className="ui-card-kicker">{c.country}</div>
              <h4>{c.company}</h4>
              <p>{c.application}</p>
              <div className="ui-card-meta">
                <span className={`tag ${c.pcmUsed === "Yes" ? "tag-brand" : "tag-zinc"}`}>
                  {c.pcmUsed === "Yes" ? "Uses PCM" : "No PCM"}
                </span>
                <span className="tag tag-zinc">{c.pcmDetails}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="section-desc" style={{ marginTop: 4 }}>
          Company table and capacity figures come from the Review 2 presentation <Rich text="{{cn}}" />.
        </p>

        <Callout title="The PCM deployment opportunity in India">
          <Bullets
            items={[
              "The presentation contrasts latent heat batteries from Sunamp (UK) {{cite:SunampPlentigrade}} with Emmvee's Indian systems, which use a sensible water buffer only {{cn}}.",
              "India has higher climatic heterogeneity, so PCM selection must adapt to climate, not use one-size-fits-all hardware.",
            ]}
          />
        </Callout>
      </div>

      {/* ── Research gaps & problem statement ── */}
      <div className="content-section" id="gaps">
        <div className="plots-section-header">
          <h2>Research Gaps & Problem Statement</h2>
          <span className="plots-count-badge">{RESEARCH_GAPS.length} Gaps</span>
        </div>
        <p className="section-desc">What the literature leaves open, and the problem this project takes on.</p>
        <div className="section-divider" />

        <div className="ui-card-grid">
          {RESEARCH_GAPS.map((g, i) => (
            <div key={g.title} className="ui-card">
              <div className="ui-card-kicker">Gap {i + 1}</div>
              <h4>{g.title}</h4>
              <p dangerouslySetInnerHTML={{ __html: richHtml(g.text) }} />
            </div>
          ))}
        </div>

        <Callout title="Overall problem" tone="warn">
          <span dangerouslySetInnerHTML={{ __html: richHtml(PROBLEM_STATEMENT.overall) }} />
        </Callout>
        <Callout title="Novel idea">
          <span dangerouslySetInnerHTML={{ __html: richHtml(PROBLEM_STATEMENT.novel) }} />
        </Callout>
      </div>

      {/* ── Literature survey ── */}
      <div className="content-section" id="literature">
        <div className="plots-section-header">
          <h2>Literature Survey</h2>
          <span className="plots-count-badge">{LITERATURE.reduce((n, g) => n + g.papers.length, 0)} Papers</span>
        </div>
        <p className="section-desc">Pick a theme to see what each study set out to do, how, and what it leaves for future work.</p>
        <div className="section-divider" />

        <ChipTabs
          size="lg"
          ariaLabel="Literature themes"
          options={LITERATURE.map((g) => ({ id: g.id, label: g.label, sub: `${g.papers.length} papers` }))}
          value={litId}
          onChange={setLitId}
        />
        <div key={litId} className="ui-lit-grid tab-panel">
          {litGroup.papers.map((p) => (
            <div key={p.author} className="ui-card ui-lit-card">
              <div className="ui-card-kicker">{p.year}</div>
              <h4>{p.author} <Rich text={`{{cite:${p.cite}}}`} /></h4>
              <p className="ui-lit-objective">{p.objective}</p>
              <dl className="ui-lit-meta">
                <dt>Parameters</dt><dd>{p.parameters}</dd>
                <dt>Methods</dt><dd>{p.methods}</dd>
                <dt>Future work</dt><dd>{p.future}</dd>
              </dl>
            </div>
          ))}
        </div>
      </div>

      {/* ── Architecture ── */}
      <div className="content-section" id="architecture">
        <div className="plots-section-header">
          <h2>Project Architecture</h2>
          <span className="plots-count-badge">{ARCH_STEPS.length} Layers</span>
        </div>
        <p className="section-desc">
          The project runs from climate data to material choice, design optimization, control and hardware. Click a layer to see what it does.
        </p>
        <div className="section-divider" />

        <StepExplorer
          ariaLabel="Project architecture layers"
          steps={ARCH_STEPS.map((s) => ({
            title: s.title,
            render: () => <p style={{ margin: 0 }}><Rich text={s.text} /></p>,
          }))}
        />

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
        </div>
        <Callout title="Note on the diagram" tone="warn">
          <Bullets
            items={[
              "The Objective 1 box shows the plan at the time of Review 2.",
              "It names \"GNN / K-means\" for clustering; the implemented pipeline uses a Gaussian Mixture Model.",
              "It lists three ranking methods (TOPSIS, VIKOR, GRA); the pipeline uses four (TOPSIS, PROMETHEE II, GRA, VIKOR).",
            ]}
          />
        </Callout>
      </div>

      {/* ── Objectives ── */}
      <div className="content-section" id="objectives">
        <div className="plots-section-header">
          <h2>Core Research Objectives & Progress</h2>
        </div>
        <p className="section-desc">
          Where each of the four research objectives stands. Pick an objective for its scope and deliverables.
        </p>
        <div className="section-divider" />

        <div className="ui-obj-tabs" role="tablist" aria-label="Objectives">
          {OBJECTIVES_ROADMAP.map((o) => (
            <button
              key={o.id}
              role="tab"
              aria-selected={objId === o.id}
              className={`ui-obj-tab ${objId === o.id ? "active" : ""}`}
              onClick={() => setObjId(o.id)}
            >
              <span className="ui-obj-tab-num">{o.num}</span>
              <span className="ui-obj-tab-title">{o.title}</span>
              <ProgressBar value={OBJECTIVE_PROGRESS[o.id] || 0} label={`${o.num} completion`} />
            </button>
          ))}
        </div>

        <div key={objId} className="ui-panel tab-panel">
          <div className="ui-panel-head">
            <h3>{obj.num}: {obj.title}</h3>
            <span className="ui-panel-sub">{OBJECTIVE_PROGRESS[obj.id] || 0}% complete</span>
          </div>
          <Bullets items={obj.desc} />
          <div className="objective-card-outputs" style={{ marginTop: 14 }}>
            <span className="objective-outputs-label">Key deliverables</span>
            <div className="tag-list" style={{ marginTop: 6 }}>
              {obj.outputs.map((out) => (
                <span key={out} className="tag tag-zinc"><Rich text={out} /></span>
              ))}
            </div>
          </div>
          {obj.linkPage && (
            <div style={{ marginTop: 18 }}>
              <button className="ui-btn" onClick={() => onNavigate(obj.linkPage)}>
                Open {obj.num} documentation →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── States ── */}
      <div className="content-section" id="territories">
        <div className="plots-section-header">
          <h2>4-State Contrasting Climate Scope</h2>
        </div>
        <p className="section-desc">
          Four states were picked to cover contrasting sunlight, humidity, elevation and monsoon patterns. Pick a state.
        </p>
        <div className="section-divider" />

        <ChipTabs
          size="lg"
          ariaLabel="States"
          options={TERRITORIES.map((t, i) => ({ id: i, label: t.name, sub: t.tag }))}
          value={stateIdx}
          onChange={setStateIdx}
        />
        <div key={stateIdx} className="ui-panel tab-panel">
          <div className="ui-panel-head">
            <h3>{territory.name}</h3>
            <span className="tag tag-zinc">{territory.tag}</span>
          </div>
          <StatTiles
            compact
            items={[
              { value: String(territory.gridPoints), label: "Grid points" },
              { value: territory.regimes.replace(" GMM Regimes", ""), label: "GMM climate regimes" },
              { value: territory.survivors, label: "Candidates ranked per cluster" },
              { value: territory.primaryPCM, label: "Consensus Rank-1 PCM" },
            ]}
          />
          <Bullets items={territory.summary} />
          <div style={{ marginTop: 16 }}>
            <button className="ui-btn ghost" onClick={() => onNavigate("objective1", "state-results")}>
              See {territory.name} results in Objective 1 →
            </button>
          </div>
        </div>
      </div>

      {/* ── Trade-offs, limitations & future scope ── */}
      <div className="content-section" id="limitations">
        <div className="plots-section-header">
          <h2>Trade-offs, Limitations & Future Scope</h2>
        </div>
        <p className="section-desc">What the whole project gives up, where it stops, and what comes next.</p>
        <div className="section-divider" />

        <div className="ui-two-col">
          <div className="ui-panel">
            <div className="ui-card-kicker">Design & method trade-offs</div>
            <Bullets items={TRADEOFFS} />
          </div>
          <div className="ui-panel">
            <div className="ui-card-kicker">Limitations & future scope</div>
            <Bullets items={FUTURE_SCOPE} />
          </div>
        </div>
      </div>

      {/* ── Research themes ── */}
      <div className="content-section" id="themes">
        <div className="plots-section-header">
          <h2>Research Themes Covered</h2>
          <span className="plots-count-badge">{RESEARCH_THEMES.length} Special Issues</span>
        </div>
        <p className="section-desc">Journal special issues whose themes this work addresses.</p>
        <div className="section-divider" />

        <div className="ui-two-col">
          {RESEARCH_THEMES.map((t) => (
            <div key={t.journal} className="ui-card">
              <div className="ui-card-kicker">Deadline · {t.deadline}</div>
              <h4>{t.journal}</h4>
              <p style={{ marginBottom: 10 }}><Rich text={t.issue} /></p>
              <Bullets items={t.points} />
            </div>
          ))}
        </div>
        <Callout title="Industry expert reference">{INDUSTRY_EXPERT}</Callout>
      </div>

      {/* ── SDGs ── */}
      <div className="content-section" id="sdgs">
        <div className="plots-section-header">
          <h2>United Nations Sustainable Development Goals (SDGs)</h2>
        </div>
        <p className="section-desc">
          The project contributes directly to four UN goals on clean, affordable, low-carbon energy. Hover a goal to see how.
        </p>
        <div className="section-divider" />

        <div className="ui-sdg-grid">
          {PROJECT_META.sdgs.map((sdg) => (
            <div key={sdg.num} className="ui-sdg" tabIndex={0}>
              <img src={`${process.env.PUBLIC_URL}/sdg/sdg-${sdg.num}.png`} alt={`SDG ${sdg.num}: ${sdg.title}`} />
              <div className="ui-sdg-over">{sdg.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OverviewPage;
