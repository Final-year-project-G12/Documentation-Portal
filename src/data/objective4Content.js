/* ─────────────────────────────────────────────────────────
   Objective 4 content. Sources (Objective--4_software-in-loop,
   main, 2026-11-14): README.md, Tamilnadu/README.md,
   Rajasthan/README.md, Uttarakhand/README.md, Common/README.md.
   Emulated validation only; no physical rig was used.
   ───────────────────────────────────────────────────────── */

export const O4_HERO_STATS = [
  { value: "3 twins", label: "MATLAB digital twins: Tamil Nadu, Rajasthan, Uttarakhand" },
  { value: "100%", label: "Identical control decisions vs the Python simulator" },
  { value: "~1e-13 °C", label: "Largest twin vs Python temperature difference" },
  { value: "0", label: "Hard-limit violations in every edge case and sensor fault" },
];

export const O4_CHAIN = [
  { title: "Weather", text: "Hourly weather of a replay year is fed to the twin." },
  { title: "Sensors", text: "A sensor model adds noise and dropouts to temperatures and sunlight." },
  { title: "Observation", text: "The same observation vector the controller was trained on is built from the sensor readings." },
  { title: "Policy", text: "The frozen Objective 3 network (SAC, DQN or PPO) picks the action." },
  { title: "Interlock", text: "A safety interlock with a stale-sensor and fault-latch fail-safe can override the action." },
  { title: "Plant", text: "A line-for-line MATLAB port of the Objective 2 tank, capsules, collector and shield." },
];

export const O4_ARMS = [
  { arm: "Arm 1", tank: "Plain water tank, same volume", controller: "Always charge", shows: "The conventional-heater floor" },
  { arm: "Arm 2", tank: "PCM tank (O1 material, O2 geometry)", controller: "Always charge", shows: "The PCM benefit (Objectives 1 + 2)" },
  { arm: "Arm 3", tank: "Same PCM tank", controller: "Trained O3 policy", shows: "The AI benefit (Objectives 1 + 2 + 3)" },
];

export const O4_STATES = [
  {
    id: "tamilnadu",
    name: "Tamil Nadu",
    tag: "SAC · single-node 100 L tank",
    setup: [
      { value: "100 L", label: "Tank, 2.5 m² collector, 104 capsules" },
      { value: "SAC", label: "Deployment controller (smart forecast, 15 inputs)" },
      { value: "2021 / 2011", label: "Replay years (validation / edge cases)" },
      { value: "1e-13 °C", label: "Twin vs Python; 100% identical decisions" },
    ],
    armTable: {
      caption: "Full year 2021, regime 0",
      columns: ["Delivered kWh", "Shield trips", "Thermal efficiency", "Demand coverage"],
      rows: [
        { arm: "1 · plain tank, B0", v: ["1,853.5", "17,020", "38.5%", "73.0%"] },
        { arm: "2 · PCM tank, B0", v: ["2,002.6", "39,705", "41.5%", "80.4%"] },
        { arm: "3 · PCM tank, SAC", v: ["1,971.4", "18,604", "40.9%", "79.8%"], best: true },
      ],
    },
    points: [
      "SAC keeps about 98% of always-charge delivery with less than half the shield trips (18,604 vs 39,705); zero hard violations in every arm.",
      "Hold test (72 h cap, 12 evenings): hours above 45 °C: plain 21.6 h, PCM + B0 51.6 h, PCM + SAC 49.9 h.",
      "Sensor faults, 20 seeds: a dead or stuck pyranometer cuts delivery by about 22% but causes no violations.",
      "PCM swap with the geometry fixed: RT57HC delivers the most and holds longest; flow 0.7×–1.3× changes results by under 0.4%.",
      "Restart from a stored state is exact; energy closure passes for arms 1–2 (arm 3 reads 0.263% because the year's net storage change is tiny: 0.83 Wh absolute).",
    ],
    figures: [
      { file: "tamilnadu/three_arm_2021.png", title: "Three-arm comparison (2021)", caption: "Plain tank, PCM + always-charge and PCM + SAC on the same weather." },
      { file: "tamilnadu/one_day_cycle_2021.png", title: "One-day charge/idle/bypass cycle", caption: "Day 71 of 2021: water and PCM temperature, melt fraction, collector gain, delivery and shield events." },
      { file: "tamilnadu/edge_cases_grid.png", title: "Six edge cases, three arms", caption: "Clear, no sunlight, rain/cloud, low temperature, heat wave and sensor fault." },
      { file: "tamilnadu/pyranometer_faults.png", title: "Dead and stuck pyranometer", caption: "Delivery drops but the shield keeps every limit." },
      { file: "tamilnadu/3d_day.png", title: "3-D view of the twin", caption: "Tank layers coloured by water temperature, capsules by melted share." },
    ],
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    tag: "DQN · 10-node stratified 50 L tank",
    setup: [
      { value: "50 L", label: "10-node tank, 1.5 m² collector" },
      { value: "DQN", label: "17-64-64-3 network (regime 1)" },
      { value: "2023", label: "Replay year (a validation year)" },
      { value: "100%", label: "Identical actions in MATLAB, Simulink and generated C" },
    ],
    armTable: {
      caption: "Night window 18:00–09:00 (45 °C), regime 1, 2023",
      columns: ["Window kWh/yr", "Hold at 45 °C (h)", "Shield hours"],
      rows: [
        { arm: "1 · water only, B0", v: ["452.8", "51.9", "—"] },
        { arm: "2 · PureTemp 60, B0", v: ["587.2", "61.2", "994"] },
        { arm: "3 · PureTemp 60, DQN", v: ["572.1", "61.0", "430"], best: true },
      ],
    },
    points: [
      "Full-year twin vs Python, all three regimes: temperatures within 6e-13 °C, identical shield counts and delivered energy, 100% identical actions.",
      "Simulink model run for one week (100% identical actions) and the controller compiled to C (9 files, identical decisions over 8,760 h).",
      "PCM adds 134 kWh/yr in the night window over water only and 9–10.5 h of hold at 45 °C; DQN gives up 15 kWh for 57% fewer guard-band hours and no retention loss.",
      "Capsule check against Amanowicz and Turski 2025: once capsule geometry is matched, the frozen constants reproduce the experiment to 1.1–1.4 K; a fit gives c = 5.03.",
      "Measured limitation: halving the 150 s step changes annual energy by 0.080%, above the 0.05% gate; it comes from sensible-heat hours, not melting, and is about 5% of the repeatability band.",
      "Dead pyranometer: the interlock has no irradiance plausibility rule (701 instead of 430 guard hours); adding one is the next fix.",
    ],
    figures: [
      { file: "rajasthan/F2_operating_trace.png", title: "Operating trace", caption: "Hour-by-hour temperatures and actions." },
      { file: "rajasthan/F3_retention_curves.png", title: "Retention curves", caption: "Top-layer temperature after charging stops, per arm." },
      { file: "rajasthan/F4_retention_bars.png", title: "Hold time by threshold", caption: "Hours above 30 / 40 / 45 / 50 °C per arm and PCM." },
      { file: "rajasthan/F5_three_regimes.png", title: "Three regimes", caption: "PCM gain over water only in window energy and hold time." },
      { file: "rajasthan/F8_experiment_comparison.png", title: "Tank-level experiment comparison", caption: "Twin vs Amanowicz and Turski 2025 cool-down curves." },
      { file: "rajasthan/F9_edge_cases_with_dead_pyranometer.png", title: "Edge cases incl. dead pyranometer", caption: "Delivered heat and guard hours for DQN vs always-charge." },
      { file: "rajasthan/B_simulink_block_diagram.png", title: "Simulink block diagram", caption: "The twin as a Simulink model." },
      { file: "rajasthan/A3_tank_3D_frame.png", title: "3-D tank animation frame", caption: "Stratified tank and capsules." },
    ],
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand",
    tag: "PPO · 10-node stratified 50 L tank",
    setup: [
      { value: "50 L", label: "10-node tank, 50 °C delivery target" },
      { value: "PPO", label: "Frozen 15-64-64-2 network (enable / bypass)" },
      { value: "2010", label: "Replay year (an O3 test year, exploratory)" },
      { value: "PASS", label: "Full-year validation, regimes 0–2" },
    ],
    armTable: null,
    points: [
      "Open-loop plant replay over 8,760 h matches Python to about 2e-13 °C in all three regimes, with the validation report passing.",
      "Sensor-fault fail-safe falls back to always-enable under the in-plant shield, as the Uttarakhand hand-off specifies.",
      "Regime 3 has no PCM controller, because Objective 2 found PCM gives no gain there.",
      "The twin still carries the frozen PPO without forecast inputs; switching to the recommended smart-forecast PPO needs a re-export.",
    ],
    figures: [],
  },
];

export const O4_LIMITATIONS = [
  "Emulated validation only: the twin is checked against the same physics the controller was trained on, not against a real tank.",
  "Single training seed per deployed controller; the 20-seed results measure robustness to sensor noise, not to training variance.",
  "Replay years were used for checkpoint selection or are already-spent test years, so results are fidelity checks, not new performance claims.",
  "Forecast inputs are supplied from stored clear-sky data; a live forecast would have more error.",
  "Controllers depend on a working pyranometer: delivery falls by 14–22% if it fails, although safety holds.",
  "Hold times are model values; Simulink and generated C were not produced for Tamil Nadu's retrained controller.",
  "Next: real hardware (Raspberry Pi / ESP32), bench interlock, shadow mode, hardware-in-the-loop, then a long field trial.",
];
