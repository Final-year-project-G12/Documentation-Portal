/* ─────────────────────────────────────────────────────────
   Objective 3 content. Sources (solar-pcm-control--Objective3, main,
   2026-11-14): rajasthan/docs/{METHODOLOGY_AND_FINDINGS,CORRECTIONS}.md,
   tamilnadu/docs/{OBJECTIVE_3_README,DEPLOYMENT_CONTROLLER}.md,
   uttarakhand/docs/FINDINGS.md. Simulation only; not field validation.
   ───────────────────────────────────────────────────────── */

export const O3_HERO_STATS = [
  { value: "3 states", label: "Controllers trained for Rajasthan, Tamil Nadu and Uttarakhand" },
  { value: "6 agents", label: "PPO, DQN, RecurrentPPO, QRDQN, MaskablePPO and SAC compared" },
  { value: "0", label: "Hard-limit violations in any locked test or robustness run" },
  { value: "33–62%", label: "Fewer safety-shield activations for the selected learned controllers" },
];

export const O3_QUESTION =
  "With Objective 2's design and its safety shield left unchanged, can a policy that chooses the collector-loop action every hour deliver about as much hot water as always-on operation (B0) while triggering the shield far less often, on years it never trained on?";

export const O3_METHOD_STEPS = [
  {
    title: "Environment",
    points: [
      "Wraps Objective 2's frozen tank simulator in a Gymnasium environment; one step is one control hour.",
      "Rajasthan and Uttarakhand step O2's 10-node kernel unchanged and test that a stepped year equals an O2 year to 1e-9; Tamil Nadu re-implements a single-node hourly loop.",
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
      "Observation: sunlight, ambient temperature, top/bottom water and PCM temperatures, melt fraction, demand, time of day and stored energy (11–17 fields by state).",
      "Generation-2 adds a 1–3 h irradiance forecast and the next-hour draw.",
      "Action: charge, idle or bypass (Tamil Nadu); loop enabled or bypass in Rajasthan and Uttarakhand, where idle and bypass are the same in O2's kernel. Flow stays at the design value because the collector model does not depend on flow.",
    ],
  },
  {
    title: "Reward",
    points: [
      "Points for hot water delivered; penalties for unmet demand, broken limits, needless switching and every shield activation.",
      "Key finding: with a delivery-only reward every agent learns 'always charge', identical to B0, because nothing penalises the shield. The shield penalty is what makes anticipation pay.",
      "The shield weight is set per state (Tamil Nadu 10; Rajasthan 1.7–3.9, re-derived from its own baselines).",
    ],
  },
  {
    title: "Baselines and agents",
    points: [
      "B0: always charge (Objective 2's operating point). B1: reactive rules. B2: forecast-aware rules. Water-only tank as the floor.",
      "Agents: PPO, DQN, RecurrentPPO, QRDQN, MaskablePPO and SAC (Stable-Baselines3), 300k–600k steps, usually 3 seeds.",
      "Training-time domain randomisation: sunlight ±10%, ambient ±2 °C, demand ±15% per episode.",
    ],
  },
  {
    title: "Split and selection",
    points: [
      "Train 2016–2020, validate 2021–2023, then one locked test on unseen years behind a lock file.",
      "Test years: Tamil Nadu 2011–2015; Rajasthan and Uttarakhand 2006–2010 (Objective 2 had already used 2011–2015).",
      "Selection rule: zero violations, then at least 95% of B0's delivered energy, then the largest shield reduction.",
    ],
  },
];

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
    notes: [
      "SAC is the only learned controller that cuts shield activations while keeping at least 97% of B0's delivery in all three regimes; DQN cuts more in regime 0 but collapses to B0 in regimes 1 and 2.",
      "Deployment controller (frozen 2026-11-14): SAC, regime 0, trained with a realistic smart-persistence forecast. Locked test: 2063.7 kWh/yr (98.4% of B0) with 22,632 shields/yr (−51.8%) and zero violations.",
      "Sub-hourly control: at a matched training budget, 15-minute control cut shields by 58% for a 4% delivery cost against 60-minute control.",
      "Dead or stuck pyranometer: delivery falls 14%, but no limit is broken because the shield acts on the true state.",
      "Inference about 5 ms per decision, 1.4 MB (SAC); DQN about 1 ms, 40 kB.",
      "Caveat: the Tamil Nadu shield metric counts events per solver sub-step, not hours, and its pass rule is annual delivery only, so verdicts are not directly comparable with Rajasthan.",
    ],
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    selected: "DQN",
    tag: "DQN selected (regime 1) · locked test 2006–2010",
    stats: [
      { value: "98.0%", label: "Of B0's annual delivery (96.9% in the night window)" },
      { value: "−61%", label: "Shield hours vs B0 (464 vs 1,180 h/yr)" },
      { value: "0", label: "Hard-limit violations" },
      { value: "+128 kWh", label: "Window gain over the water-only tank (B0: +148)" },
    ],
    columns: ["Delivered kWh/yr (to 45 °C)", "Shield h/yr"],
    rows: [
      { regime: "R1", policy: "Water-only tank", a: "805.5", b: "900" },
      { regime: "R1", policy: "B0 always charge", a: "960.6", b: "1,180" },
      { regime: "R1", policy: "B1 reactive rules", a: "797.9", b: "48" },
      { regime: "R1", policy: "DQN (selected)", a: "941.0 (98.0%)", b: "464 (−61%)", best: true },
    ],
    notes: [
      "First-generation result: with loop on/off and no forecast, 92 rule policies and PPO on 3 seeds all end at B0, so hourly control has no headroom on delivered energy. This is a reportable result.",
      "Generation-2 (1–3 h forecast + domain randomisation + DQN) produced the first policy that is not B0. An ablation shows the forecast is what lets DQN leave B0; randomisation was not shown to matter.",
      "Only regime 1 has a learned controller: in regimes 0 and 2 no shield weight meets the 95% rule, so they fall back to B0.",
      "Seed spread is large: at the default weight seed 42 gives 98% / 57% fewer shield hours, seed 0 92%, seed 123 collapses to B0. The claim is that such a policy exists and can be found, not that DQN finds it reliably.",
      "SAC sweep: smooth, seed-consistent trade-off (e.g. 94.5–95.0% delivery for an 87% shield cut) but just misses the window part of the 95% rule.",
      "The pass rule was relaxed to annual-only on 2026-11-13, after the locked test; both verdicts are reported. A smart-persistence forecast mode is implemented; its four-case study is not yet written up.",
      "Inference 0.21 ms per decision, 5,507 parameters, 22 kB.",
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
      { regime: "R1", policy: "B0", a: "631.6", b: "681.4" },
      { regime: "R1", policy: "B1", a: "623.5", b: "445.0" },
      { regime: "R1", policy: "PPO", a: "569.5 ± 16.4", b: "4.2" },
      { regime: "R2", policy: "B0", a: "653.6", b: "573.5" },
      { regime: "R2", policy: "B1", a: "641.2", b: "295.6" },
      { regime: "R2", policy: "PPO", a: "601.6 ± 0.6", b: "1.3" },
      { regime: "R3", policy: "B0 (no controller needed)", a: "626.3", b: "180.4" },
    ],
    notes: [
      "Headline: no hourly on/off controller beats always-on on delivered energy. PPO removes almost all shield time but gives up 8–11% of window delivery, so under the lexicographic rule B0 remains the best controller.",
      "Agent choice with a realistic forecast (2026-11-14, regime 1, 3 seeds): PPO 92.2% of B0 with the smallest seed spread and fewest switches; DQN 90.8% with three times the spread; SAC 84.8% with about 925 switches a year. PPO is recommended.",
      "The smart-persistence forecast has 8.4 / 12.7 / 16.6% error at +1 / +2 / +3 h, against 32–81% for plain persistence; the result does not rest on perfect foresight.",
      "Lowering the shield penalty shows a cliff, not a curve: with no penalty PPO learns exactly B0, and even a tenth of the penalty removes about 99% of shield time.",
      "Regime 3 (cold, high altitude) has no controller: the PCM tank delivers less than water alone.",
      "A 50 L tank cannot carry 300 L/day at 50 °C into the evening: only 1–4% of window water leaves at or above 50 °C, an Objective 2 sizing limit, not a controller defect.",
    ],
  },
];

export const O3_FINDINGS = [
  { title: "Reward design decides the outcome", text: "With a delivery-only reward every agent learns always-charge, identical to B0. Only a shield penalty makes anticipation pay, and its weight sets where a policy lands on the delivery-versus-shield trade-off." },
  { title: "No controller beats always-on on delivery", text: "With Objective 2's shield inside the plant, no rule or learned policy delivers more energy than B0 in any state. Every policy that reduces shield activity pays some delivery." },
  { title: "The gain is the same delivery with far fewer shield activations", text: "Selected controllers keep 92–98% of B0's delivery while cutting shield activity by 33–62% (Tamil Nadu, Rajasthan) or about 99% (Uttarakhand), with zero violations." },
  { title: "Forecasts help, but differently by state", text: "In Rajasthan the forecast is what lets DQN leave B0; in Tamil Nadu removing it sends the agent back to always-charge; in Uttarakhand it adds only about 7–10 kWh/yr. Realistic smart-persistence forecasts replace the perfect look-ahead for deployment." },
  { title: "The best agent differs by state", text: "SAC in Tamil Nadu, DQN in Rajasthan (regime 1 only) and PPO in Uttarakhand. The states also use different shield metrics and pass rules, so their verdicts are not directly comparable." },
];

export const O3_LIMITATIONS = [
  "Simulation only; PCM temperature, melt fraction and stored energy are simulator states that a real tank would need an estimator for.",
  "Train and validation years were used by Objective 2 to choose the design, so gains against B0 there are optimistic; the test is a hold-out by year at the same sites, not by location.",
  "Shield hours have no physical cost in the simulator; if shield operation causes real wear or pump cycling, that cost must be modelled before the value of a controller can be shown.",
  "Rajasthan's learned controller covers regime 1 only; Rajasthan's pass rule was relaxed after its locked test, and both verdicts are reported.",
  "No MPC baseline was built, although the literature suggests MPC is the strongest baseline.",
  "Pump energy is not modelled, and backup-heater savings rely on an assumed heater efficiency.",
];
