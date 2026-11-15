/* ─────────────────────────────────────────────────────────
   Objective 3 content. Sources (solar-pcm-control--Objective3, main,
   commit 2f18a2e, 2026-11-15): rajasthan/docs/{METHODOLOGY_AND_FINDINGS,CORRECTIONS}.md,
   tamilnadu/docs/{OBJECTIVE_3_README,METHODOLOGY_AND_FINDINGS,CORRECTIONS_OBJECTIVE3,DEPLOYMENT_CONTROLLER}.md,
   uttarakhand/docs/FINDINGS.md, and the CSV/JSON files under each state's results/.
   Simulation only; not field validation.
   ───────────────────────────────────────────────────────── */

export const O3_METHOD_STEPS = [
  {
    title: "Environment",
    points: [
      "Wraps Objective 2's frozen tank simulator in a Gymnasium environment; one step is one control hour.",
      "Rajasthan and Uttarakhand step O2's 10-node kernel unchanged and test that a stepped year equals an O2 year to 1e-9; Tamil Nadu re-implements a single-node hourly loop.",
      "Assam re-implements O2's single-node hourly physics as a stepper and tests that a full stepped year reproduces O2's annual useful energy and unmet energy to better than 1e-6 (1334.5354 kWh and 2279.0581 kWh); a simulated year takes about 2 s.",
      "The policy never changes the PCM, tank, collector, capsule geometry, safety limits or physics.",
    ],
  },
  {
    title: "Safety shield",
    points: [
      "Inside the physics and always active: it stops the collector at 72 °C water and 62 °C PCM, just below the hard limits of 75 °C and 65 °C.",
      "The controller cannot switch it off, so hard limits cannot be broken by any policy.",
      "Objective 3's contribution is anticipatory control: acting before the guard band is reached, instead of letting the shield react.",
    ],
  },
  {
    title: "Observation and action",
    points: [
      "Observation: sunlight, ambient temperature, top/bottom water and PCM temperatures, melt fraction, demand, time of day and stored energy (11 fields in Tamil Nadu, 13 contract fields in Rajasthan and Uttarakhand).",
      "Forecast versions add the irradiance forecast for the next 1–3 h and the next-hour draw (15–17 fields).",
      "Assam: 13 observation fields (water and PCM temperature, melt fraction, sunlight, ambient and mains temperature, hour of day, next-hour draw, a perfect 1–3 h sunlight forecast and a near-shield flag). Action: collector pump allowed on or off and the PCM-loop flow (bypass, 0.010, nominal, 0.050 kg/s), 8 combinations.",
      "Action: charge, idle or bypass (Tamil Nadu); loop enabled or bypass in Rajasthan and Uttarakhand, where idle and bypass are the same in O2's kernel. Flow stays at the design value because the collector model does not depend on flow.",
    ],
  },
  {
    title: "Reward",
    points: [
      "Points for hot water delivered; penalties for unmet demand, broken limits, needless switching and every shield activation.",
      "Key finding: with a delivery-only reward every agent learns 'always charge', identical to B0, because nothing penalises the shield. The shield penalty is what makes anticipation pay.",
      "The shield weight is set per state: Tamil Nadu 10; Rajasthan 1.7–3.9, re-derived from its own baselines; Uttarakhand by a dominance rule (twice the largest one-hour delivery).",
      "Assam uses a paired reward instead: the hourly reduction in unmet delivery energy against a shadow passive-PCM tank run in lock-step, minus 0.02 per shield hour and 5 per violation, with one set of weights for all regimes and agents.",
    ],
  },
  {
    title: "Forecast realism",
    points: [
      "The first forecast was a perfect look-ahead read from the stored year, which no real installation has.",
      "It was replaced by smart persistence on the clear-sky index (last daytime clear-sky ratio times the clear-sky curve). Measured error is 9.9 / 21.0 / 36.1% at +1 / +2 / +3 h on the Tamil Nadu and Rajasthan files and 8.4 / 12.7 / 16.6% in Uttarakhand, against 32–81% for plain persistence.",
      "A third mode zeroes the forecast fields, which isolates how much each agent actually relies on the forecast. Next-hour demand is still perfect in all states.",
      "Assam: the forecast is the perfect look-ahead read from the stored year; smart persistence and the no-forecast mode were not run for Assam.",
    ],
  },
  {
    title: "Baselines and agents",
    points: [
      "B0: always charge (Objective 2's operating point). B1: reactive rules. B2: forecast-aware rules. Water-only tank as the floor. No MPC baseline was built.",
      "Agents (Stable-Baselines3 {{cite:Raffin2021SB3}}): PPO {{cite:Schulman2017PPO}}, DQN {{cite:Mnih2015DQN}}, RecurrentPPO, QRDQN {{cite:Dabney2018QRDQN}}, MaskablePPO and SAC {{cite:Haarnoja2018SAC}} were tried in Tamil Nadu; DQN and SAC in Rajasthan after PPO; PPO, DQN and SAC in Uttarakhand. See the table below.",
      "Training-time domain randomisation per episode: sunlight ±10%, ambient ±2 °C, demand ±15%.",
      "Assam trains PPO (1.2 M steps), DQN (600 k) and SAC (250 k), 2 seeds per regime, on random 14-day windows with random start temperatures; it has no domain randomisation and no B2 forecast-rule baseline, but adds a water-first and a discharge-only rule baseline.",
    ],
  },
  {
    title: "Split and selection",
    points: [
      "Train 2016–2020, validate 2021–2023, then one locked test on unseen years behind a lock file. Test years: Tamil Nadu 2011–2015; Rajasthan and Uttarakhand 2006–2010; Assam 2024–2025 (Assam's 2011–2015 were Objective 2's one-shot held-out years and were not used).",
      "Tamil Nadu and Rajasthan (since 2026-11-13) select by: zero violations, then at least 95% of B0's annual delivery, then the largest shield reduction.",
      "Assam selects, per agent and regime, the best-validation checkpoint with zero violations (checkpoints that broke a limit are discarded), then the seed with the best validation score; its test is not behind a lock file, but no Assam test year was used for training or selection.",
      "Rajasthan first used a stricter rule (annual and night-window delivery both at least 95%) and relaxed it after its locked test, so both verdicts are reported. Uttarakhand puts delivery first, so B0 stays best there.",
    ],
  },
];

/* Which agent was tried where, and what happened. */
export const O3_AGENT_TABLE = {
  columns: ["Agent", "Tamil Nadu", "Rajasthan", "Uttarakhand", "Assam"],
  rows: [
    ["PPO", "Collapses to B0; not retrained after the weather fix", "Ends at B0 (3 seeds, regime 1)", "Frozen controller: about 99% fewer shield hours, 8–11% less delivery", "Trained (1.2 M steps, 2 seeds): +1.0–1.1% delivery over the passive PCM tank, −16 to −26% shield sub-steps, 0 violations; the most reproducible agent (test 2024–2025)"],
    ["DQN", "Regime 0 only: 96.2% of B0, −62% shields; about B0 in regimes 1–2", "One good seed in regime 1 (locked test 98.0%, −61%); a retrain returned B0", "Behaves like PPO", "Trained (600 k steps, 2 seeds): +0.4–0.9% delivery, −34 to −58% shield sub-steps, 0 violations in the selected checkpoints; regime 1 seed 2 gains nothing"],
    ["RecurrentPPO, QRDQN, MaskablePPO", "Stuck at B0; not retrained after the weather fix", "Not trained", "Not trained", "Not trained"],
    ["SAC", "Selected: 97–99% of B0, −33 to −54% shields in all three regimes", "Passes the annual rule with 70–96% fewer shield hours (validation only)", "Weakest: 84.8% of B0, about 925 switches a year", "Trained (250 k steps, 2 seeds): +0.5–0.9% delivery, −47 to −60% shield sub-steps, 0 violations; the largest shield cuts"],
  ],
};

/* Locked-test results per state. */
export const O3_STATES = [
  {
    id: "tamilnadu",
    name: "Tamil Nadu",
    selected: "SAC",
    tag: "SAC selected · locked test 2011–2015",
    stats: [
      { value: "97.3–98.7%", label: "Of B0's delivered energy, all three regimes" },
      { value: "−33 to −54%", label: "Shield activations vs B0" },
      { value: "0", label: "Safety violations" },
      { value: "98.4%", label: "Deployed controller (smart forecast), regime 0, −51.8% shields" },
    ],
    columns: ["Delivered kWh/yr", "Shield activations/yr"],
    rows: [
      { regime: "R0", policy: "B0 always charge", a: "2096.9", b: "46,969" },
      { regime: "R0", policy: "DQN", a: "2018.0 (96.2%)", b: "17,838 (−62%)" },
      { regime: "R0", policy: "SAC", a: "2044.6 (97.5%)", b: "21,406 (−54%)", best: true },
      { regime: "R1", policy: "B0 always charge", a: "2094.8", b: "24,815" },
      { regime: "R1", policy: "DQN", a: "2094.7 (~100%)", b: "24,298 (−2%)" },
      { regime: "R1", policy: "SAC", a: "2067.5 (98.7%)", b: "15,569 (−37%)", best: true },
      { regime: "R2", policy: "B0 always charge", a: "2068.8", b: "34,796" },
      { regime: "R2", policy: "DQN", a: "2068.8 (= B0)", b: "34,796 (0%)" },
      { regime: "R2", policy: "SAC", a: "2012.6 (97.3%)", b: "23,138 (−33.5%)", best: true },
    ],
    figures: [
      { file: "tamilnadu/o3_tn_forecast_ablation.png", title: "SAC under three forecast conditions (Tamil Nadu)", caption: "Shield cut barely depends on the forecast: 26–54% in every case, with delivery at 97–100% of B0." },
    ],
    notes: [
      "SAC is the only learned controller that cuts shield activations while keeping at least 97% of B0's delivery in all three regimes; DQN cuts more in regime 0 but falls back to B0 in regimes 1 and 2.",
      "Deployment controller (frozen 2026-11-14): SAC, regime 0, trained with the realistic smart-persistence forecast. Locked test: 2063.7 kWh/yr (98.4% of B0) with 22,632 shields/yr (−51.8%) and zero violations. The same recipe gives 99.7% / −26.2% in regime 1 and 98.8% / −35.9% in regime 2.",
      "Forecast ablation (locked test): SAC keeps a 26–54% shield cut whether the forecast is absent, zeroed or realistic, so its gain does not come from reading the weather. DQN needs a forecast: with the fields zeroed it is exactly B0 (0% cut), with a perfect forecast it gives 28.3% and with a realistic one 18.3%.",
      "Sensor faults: zero hard-limit violations in every scenario, because the shield acts on the true state. An earlier regime-1 SAC checkpoint lost 99.5% of delivery with a dead pyranometer; the forecast retrains lose only 1–13%, so that failure belonged to one checkpoint. The deployed controller loses 14%.",
      "Deployment metrics (regime 0): thermal efficiency B0 41.6%, DQN 40.1%, SAC 40.6%; SAC delivers 3.5% more than B1. Inference about 5 ms per decision and 1.4 MB for SAC; DQN about 1 ms and 40 kB.",
      "Retired: the earlier sub-hourly (58% fewer shields), Pareto-sweep and regime-1/2 extension results came from the repeated-weather-year bug and were not rerun, so none is quoted here. PPO, RecurrentPPO, QRDQN and MaskablePPO were not retrained after the fix.",
      "Caveats: the forecast study used one seed; the shield metric counts events per solver sub-step, not hours, and its pass rule is annual delivery only, so verdicts are not directly comparable with Rajasthan; the live demo cannot yet use the smart-forecast model.",
    ],
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    selected: "DQN + SAC",
    tag: "DQN locked-tested (regime 1) · SAC selected on validation years (regimes 0–2)",
    stats: [
      { value: "98.0%", label: "Of B0's annual delivery: DQN, locked test 2006–2010, regime 1 (96.9% in the night window)" },
      { value: "−61%", label: "Shield hours vs B0 (464 vs 1,180 h/yr)" },
      { value: "0", label: "Hard-limit violations in any run" },
      { value: "95–96%", label: "Of B0's delivery for the selected SAC runs, with 71–96% fewer shield hours (validation only)" },
    ],
    columns: ["Delivered kWh/yr (to 45 °C)", "Shield h/yr"],
    rows: [
      { regime: "R1 test", policy: "Water-only tank", a: "805.5", b: "900" },
      { regime: "R1 test", policy: "B0 always charge", a: "960.6", b: "1,180" },
      { regime: "R1 test", policy: "B1 reactive rules", a: "797.9", b: "48" },
      { regime: "R1 test", policy: "DQN (locked test)", a: "941.0 (98.0%)", b: "464 (−61%)", best: true },
      { regime: "R0 val.", policy: "B0 always charge", a: "961.0", b: "837" },
      { regime: "R0 val.", policy: "SAC (weight 5.85, seed 123)", a: "915.1 (95.2%)", b: "30 (−96%)", best: true },
      { regime: "R1 val.", policy: "B0 always charge", a: "925.7", b: "1,043" },
      { regime: "R1 val.", policy: "SAC (weight 2.55, seed 42)", a: "886.0 (95.7%)", b: "144 (−86%)", best: true },
      { regime: "R2 val.", policy: "B0 always charge", a: "976.4", b: "1,112" },
      { regime: "R2 val.", policy: "SAC (weight 0.85, seed 0)", a: "940.8 (96.4%)", b: "321 (−71%)", best: true },
    ],
    figures: [
      { file: "rajasthan/o3_rj_tradeoff.png", title: "Delivery vs shield hours, regime 1 (Rajasthan)", caption: "Original runs: the locked-test DQN keeps 98% of B0 with 61% fewer shield hours; SAC sits far to the left on validation years." },
      { file: "rajasthan/o3_rj_rerun_tradeoff.png", title: "DQN and SAC after the re-run (Rajasthan)", caption: "Per shield weight, three seeds each. SAC stays above the 95% line with large cuts; DQN only reaches the cuts by giving up delivery." },
    ],
    notes: [
      "First generation: with loop on/off and no forecast, 92 rule policies and PPO on 3 seeds all end at B0, so hourly control has no headroom on delivered energy. This is a reportable result.",
      "Generation 2 (1–3 h forecast, domain randomisation, DQN) gave the first policy that is not B0: 98.2% of B0 with 57% fewer shield hours on validation, held at 98.0% and −61% on the locked test.",
      "Ablation: the forecast is what lets DQN leave B0 (all three seeds sit exactly on B0 without it). Randomisation was not shown to matter.",
      "DQN does not reproduce: retrained under the annual-only rule, the same seed and weight returned always-charge (100% / 0%), and no DQN run in any regime passes the rule with a real shield cut (every pass is the always-charge policy). The locked result stands because the original model and its hash are kept, but a retrain cannot be relied on to recreate it.",
      "SAC passes the annual rule with a real cut in 12 of 18 reduced-grid runs (regime 0: 9 of 9, regime 2: 3 of 9) at 70–96% fewer shield hours. The regime 1 row is the best passing run of the 15 original SAC runs. All SAC numbers are validation years only; the locked test is spent, so none has held-out confirmation. SAC switches the loop about 2,800–3,800 times a year.",
      "The pass rule was relaxed to annual-only on 2026-11-13, after the locked test and after seeing validation results. Under the original rule (annual and night window both at least 95%) only 6 of the 12 SAC passes remain.",
      "Imperfect forecast (regime 1, DQN, smart persistence): inconclusive, because two of three seeds sit at B0 in every case. The seed that learns trades about 10 points of delivery for a larger cut with the imperfect forecast. The forecast rule B2 gives identical results with either forecast.",
      "Sub-hourly control did not help in the one run made: 15-minute steps kept 98.8% of B0 delivery but cut shield hours by only 0.2%.",
      "Deployment (regime 1, DQN, validation): thermal efficiency 30.8% (B0 31.3%, water-only 26.4%, B1 26.2%); inference 0.21 ms and 22 kB; sensor faults cause no violations. B1 is the weakest rule here. The backup-heater saving depends on an assumed heater efficiency.",
    ],
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand",
    selected: "PPO",
    tag: "PPO recommended · locked test 2006–2010",
    stats: [
      { value: "B0", label: "Still delivers the most energy (8–12% more than any learned policy)" },
      { value: "~99%", label: "Fewer shield hours with PPO (600–700 → 1–4 h/yr)" },
      { value: "0", label: "Hours over a hard limit in any run" },
      { value: "92.2%", label: "Of B0's window delivery: PPO with smart forecast (regime 1)" },
    ],
    columns: ["Window delivery kWh/yr (to 50 °C)", "Shield h/yr"],
    rows: [
      { regime: "R0", policy: "B0", a: "636.9", b: "717.7" },
      { regime: "R0", policy: "B1", a: "613.3", b: "305.9" },
      { regime: "R0", policy: "PPO", a: "568.2 ± 3.6", b: "3.0" },
      { regime: "R0", policy: "PPO + smart forecast (post-lock)", a: "562.7 ± 3.7", b: "0.9" },
      { regime: "R1", policy: "B0", a: "631.6", b: "681.4" },
      { regime: "R1", policy: "B1", a: "623.5", b: "445.0" },
      { regime: "R1", policy: "PPO", a: "569.5 ± 16.4", b: "4.2" },
      { regime: "R1", policy: "PPO + smart forecast (post-lock)", a: "580.8 ± 4.8", b: "2.3" },
      { regime: "R2", policy: "B0", a: "653.6", b: "573.5" },
      { regime: "R2", policy: "B1", a: "641.2", b: "295.6" },
      { regime: "R2", policy: "PPO", a: "601.6 ± 0.6", b: "1.3" },
      { regime: "R2", policy: "PPO + smart forecast (post-lock)", a: "600.2 ± 1.8", b: "0.4" },
      { regime: "R3", policy: "B0 (no controller needed)", a: "626.3", b: "180.4" },
    ],
    figures: [
      { file: "uttarakhand/o3_uk_agent_choice.png", title: "Choice of agent with a realistic forecast (Uttarakhand)", caption: "PPO delivers the most of the three agents, with the smallest seed spread and the fewest switches." },
    ],
    notes: [
      "Headline: no hourly on/off controller beats always-on on delivered energy. PPO removes almost all shield time but gives up 8–11% of window delivery, so under the delivery-first rule B0 remains the best controller.",
      "Headroom gate: bypassing an hour never raises delivery, because the kernel already stops the loop when it would lose heat. The only headroom is fewer shield hours at about equal delivery, so the gate passes on the tie rule only.",
      "Agent choice with a realistic forecast (regime 1, 3 seeds, validation): PPO 92.2% of B0 with the smallest seed spread and 348 switches a year; DQN 90.8% with three times the spread; SAC 84.8% with about 925 switches. PPO is recommended.",
      "The post-lock PPO with smart forecast is exploratory: the lock was already spent, so the table rows marked post-lock do not replace the frozen results. It matches the frozen PPO on delivery with fewer overheat hours and switches.",
      "DQN behaves like PPO here, and the forecast rule B2 lands on B1. Lowering the shield penalty shows a cliff, not a curve: with no penalty PPO learns exactly B0, and even a tenth of the penalty removes about 99% of shield time.",
      "The smart-persistence forecast costs only 3.4 kWh/yr against a perfect one, and removing the forecast costs about 10 kWh/yr, so the result does not rest on perfect foresight.",
      "Night service: every controller holds 50 °C for only minutes after 18:00 (B0 about 0.25 h in regime 0), and the PCM tank does not extend evening service at 50 °C compared with the same tank without PCM. A 50 L tank cannot carry 300 L/day into the evening: only 1–4% of window water leaves at or above 50 °C, an Objective 2 sizing limit.",
      "Deployment: thermal efficiency 40.7–44.5% for PPO against 43.0–46.2% for B0; PPO needs 33–42 kWh/yr more backup heat than B1 (heater efficiency assumed). Inference 0.24 ms and 42 kB. Sensor faults cause no violations, but PPO relies on the pyranometer and falls back to B0-like behaviour when it fails.",
      "Regime 3 (cold, high altitude) has no controller: the PCM tank delivers less than water alone.",
      "The Objective 4 twin now runs the smart-forecast PPO, exported directly from this repository's models (2023 replay, all three regimes); the o4_handoff package here still holds the frozen PPO.",
    ],
  },
  {
    id: "assam",
    name: "Assam",
    selected: "PPO + SAC",
    tag: "PPO (delivery) and SAC (shield) selected · test years 2024–2025",
    stats: [
      { value: "+0.4 to +1.1%", label: "Delivered energy vs the passive PCM tank, all three agents (PPO the most: +12.6 to +13.9 kWh/yr)" },
      { value: "−16 to −60%", label: "Water-shield sub-steps vs B0 (PPO −16 to −26%; DQN −34 to −58%; SAC −47 to −60%)" },
      { value: "0", label: "Safety-limit violations for every selected controller" },
      { value: "PPO", label: "Most delivery and the most reproducible (seeds within 1.4 kWh/yr); SAC and DQN cut shields most but vary more by seed" },
    ],
    columns: ["Delivered kWh/yr (useful energy)", "Water-shield sub-steps/yr"],
    rows: [
      { regime: "R0", policy: "Water-only tank", a: "1283.5", b: "4,182" },
      { regime: "R0", policy: "B0 passive PCM (always on)", a: "1313.6", b: "6,572" },
      { regime: "R0", policy: "Rule-based (water-first)", a: "1319.5 (+0.4%)", b: "5,054 (−23%)" },
      { regime: "R0", policy: "PPO", a: "1327.6 (+1.1%)", b: "4,877 (−26%)", best: true },
      { regime: "R0", policy: "DQN", a: "1325.7 (+0.9%)", b: "3,886 (−41%)" },
      { regime: "R0", policy: "SAC", a: "1325.8 (+0.9%)", b: "3,455 (−47%)", best: true },
      { regime: "R1", policy: "Water-only tank", a: "1232.3", b: "4,132" },
      { regime: "R1", policy: "B0 passive PCM (always on)", a: "1259.7", b: "6,745" },
      { regime: "R1", policy: "Rule-based (water-first)", a: "1263.8 (+0.3%)", b: "5,622 (−17%)" },
      { regime: "R1", policy: "PPO", a: "1272.2 (+1.0%)", b: "5,683 (−16%)", best: true },
      { regime: "R1", policy: "DQN", a: "1266.6 (+0.5%)", b: "2,801 (−58%)" },
      { regime: "R1", policy: "SAC", a: "1265.7 (+0.5%)", b: "3,026 (−55%)", best: true },
      { regime: "R2", policy: "Water-only tank", a: "1240.0", b: "4,396" },
      { regime: "R2", policy: "B0 passive PCM (always on)", a: "1270.9", b: "7,081" },
      { regime: "R2", policy: "Rule-based (water-first)", a: "1276.5 (+0.4%)", b: "5,645 (−20%)" },
      { regime: "R2", policy: "PPO", a: "1284.6 (+1.1%)", b: "5,528 (−22%)", best: true },
      { regime: "R2", policy: "DQN", a: "1276.1 (+0.4%)", b: "4,700 (−34%)" },
      { regime: "R2", policy: "SAC", a: "1280.7 (+0.8%)", b: "2,863 (−60%)", best: true },
    ],
    figures: [
      { file: "assam/o3_as_agents_tradeoff.png", title: "Delivery vs shield activity, all agents (Assam)", caption: "Unseen test years 2024–2025: every agent sits above the passive PCM tank (more delivery) and to its left (fewer shield sub-steps). PPO is highest; SAC and DQN are furthest left." },
      { file: "assam/fig61_o3_as_controller_comparison.png", title: "Controller comparison (Assam)", caption: "Gain over the passive PCM tank for the water-only tank, the rule-based controllers and every trained agent and seed, on validation and test years." },
      { file: "assam/fig63_o3_as_policy_behaviour.png", title: "What the Assam PPO policy does", caption: "PPO bypasses the PCM bed in the morning, connects it from late morning and changes flow in the evening." },
      { file: "assam/o3_as_dqn_sac_training.png", title: "DQN and SAC training curves (Assam)", caption: "Validation improvement over the passive tank. Red crosses mark checkpoints that broke a limit and were rejected (several late DQN checkpoints)." },
    ],
    notes: [
      "Setup differs from the other states: the controlled design is Objective 2's selected savE OM46 PCM tank (single-layer in regimes 0 and 1, radial in regime 2) and the agent chooses, every hour, whether the collector pump may run and the PCM-loop flow (bypass, 0.010, nominal or 0.050 kg/s). PPO chooses the pair as two discrete outputs; DQN a single 8-way action; SAC two continuous outputs mapped to the same pair. The shield (72 °C water, 62 °C PCM charge block) stays inside the physics and cannot be overridden.",
      "Reward: the hourly improvement in unmet delivery energy against a shadow passive-PCM tank run in lock-step (a paired reward), minus 0.02 per shield hour and 5 per violation; weights chosen by us, the same for all agents.",
      "Training: PPO 1.2 M steps, DQN 600 k, SAC 250 k, 2 seeds each per regime, on 2016–2020; the best checkpoint with zero violations is chosen on 2021–2023 and the seed with the best validation score is reported; final test on 2024–2025, never used to train or select. Objective 2's held-out years 2011–2015 were not used. Assam's test years differ from the other states'.",
      "Unlike the other states, delivery goes up and shield activity goes down together for every agent. PPO takes the most delivery (+1.0 to +1.1%); SAC and DQN give up 2–8 kWh/yr of that for much larger shield reductions (34–60% against 16–26%), the same delivery-versus-shield trade-off the other states report.",
      "Seed spread: PPO's two seeds agree within 1.4 kWh/yr in every regime. DQN regime 1: seed 1 +6.9 and seed 2 −0.2 kWh/yr. SAC regime 1: +9.6 and +6.0. Several late DQN checkpoints broke the hard limits (120–1,522 violating sub-steps) and were rejected; the selected ones did not. DQN lets the PCM reach 63.4–64.6 °C in regimes 0–1, above the 62 °C shield threshold but below the 65 °C limit.",
      "Choice of agent depends on how much shield wear matters, which the simulator does not price: PPO if delivery matters most, SAC if shield activity does.",
      "Inference cost (CPU, one thread): PPO about 0.24 ms per decision (37.5 k parameters, 468 kB file), DQN about 0.09 ms (38.7 k, 325 kB), SAC about 0.25 ms (93.6 k, 848 kB); the files include value or critic networks that a deployed controller would not need.",
      "Margins: no controller broke a limit (max water 72.3–72.6 °C, PCM 62.2–62.6 °C for PPO and SAC; DQN lets the PCM reach 63.4–64.6 °C). Not tested for Assam: sensor faults, sub-hourly control, an imperfect forecast.",
      "Caveats: the effect is small (about 1%) because the 50 L / 1.5 m² system against 300 L/day is collector-limited (solar fraction about 0.36); training and test use the same simulator; the controller sees a perfect 3-hour irradiance forecast; shield activity is counted in solver sub-steps (as in Tamil Nadu), not hours. No shield-weight sweep or forecast ablation was run for Assam.",
    ],
  },
];

export const O3_FINDINGS = [
  { title: "Assam: a controller can help on both axes", text: "Because Assam's Objective 2 tank has some PCM headroom, all three agents deliver 0.4–1.1% more energy than the passive PCM tank and cut water-shield activity by 16–60%, on years they never saw. PPO takes the most delivery and is the most reproducible; SAC and DQN cut shields furthest. The gains are small and the system is collector-limited." },
  { title: "Reward design decides the outcome", text: "With a delivery-only reward every agent learns always-charge, identical to B0. Only a shield penalty makes anticipation pay, and its weight sets where a policy lands on the delivery-versus-shield trade-off." },
  { title: "No controller beats always-on on delivery", text: "With Objective 2's shield inside the plant, no rule or learned policy delivers more energy than B0 in any state. Every policy that reduces shield activity pays some delivery." },
  { title: "Same delivery, far fewer shield activations", text: "Tamil Nadu SAC keeps 97–99% of B0 with 33–54% fewer activations; Rajasthan's locked-test DQN keeps 98% with 61% fewer shield hours; Rajasthan's SAC runs keep 95–96% with 71–96% fewer (validation only). Uttarakhand's PPO cuts about 99% but gives up 8–11% of delivery. All with zero violations." },
  { title: "Forecasts help, but differently by state", text: "In Rajasthan the forecast is what lets DQN leave B0. In Tamil Nadu SAC does not depend on it while DQN collapses to B0 without it. In Uttarakhand it adds only about 7–10 kWh/yr. Realistic smart-persistence forecasts replace the perfect look-ahead everywhere for deployment." },
  { title: "The best agent differs by state", text: "SAC in Tamil Nadu, DQN (locked test) and SAC (validation) in Rajasthan, and PPO in Uttarakhand. The states use different shield metrics and pass rules, so their verdicts are not directly comparable." },
  { title: "One seed or one retrain is fragile", text: "Rajasthan's DQN headline did not reproduce on retraining, an earlier Tamil Nadu sensor-fault collapse belonged to a single checkpoint, and several Rajasthan runs end at B0. Results are reported over seeds, and a retrain needs re-checking before it is cited." },
];

export const O3_LIMITATIONS = [
  "Assam: delivery and shield activity both improve, but delivery only by 0.4–1.1%, on a collector-limited system; trained and tested on the same simulator with a perfect 3-hour irradiance forecast, and no shield-weight or forecast ablation was run.",
  "Simulation only; PCM temperature, melt fraction and stored energy are simulator states that a real tank would need an estimator for.",
  "Train and validation years were used by Objective 2 to choose the design, so gains against B0 there are optimistic. The test is a hold-out by year at the same sites, not by location, and Tamil Nadu's test years 2011–2015 were also Objective 2's held-out years.",
  "Shield hours have no physical cost in the simulator; if shield operation causes real wear or pump cycling, that cost must be modelled. Rajasthan's SAC switches the loop about 3,000 times a year.",
  "Rajasthan's pass rule was relaxed after its locked test, and its SAC selections have no held-out confirmation because the test is spent; both verdicts are reported.",
  "Learned results are seed-sensitive: Rajasthan's DQN did not reproduce, the Tamil Nadu forecast study used one seed, and PPO, RecurrentPPO, QRDQN and MaskablePPO were not retrained after the Tamil Nadu weather fix.",
  "No MPC baseline was built, although the literature suggests MPC is the strongest baseline. Next-hour demand is perfect in the forecast observation.",
  "Pump energy is not modelled, and backup-heater savings rely on an assumed heater efficiency.",
];

export const O3_HANDOFF = [
  "Each state exports its frozen controller (SHA-256 recorded), its sensor list and a hardware interface spec.",
  "Tamil Nadu's deployment controller is SAC, regime 0, trained with the smart-persistence forecast. Rajasthan carries DQN in regime 1 plus a SAC arm; Uttarakhand's twin runs the smart-forecast PPO (the o4_handoff package still holds the frozen PPO).",
  "Assam carries a PPO controller per regime (the most delivery) and a SAC arm (the largest shield cuts), each with its saved model, the Objective 2 contract file for the regime and its validation and test results; no deployment forecast mode or sensor-fault study exists for Assam yet.",
  "The shield is restated as an independent hardware interlock, with a fail-safe to always-charge or bypass.",
  "Objective 4 replays these exact controllers in a software-in-the-loop co-simulation.",
];
