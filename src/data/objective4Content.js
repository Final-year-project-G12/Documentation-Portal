/* ─────────────────────────────────────────────────────────
   Objective 4 content. Sources (Objective--4_software-in-loop, main,
   commit ee5629a, 2026-11-15): README.md, Tamilnadu/README.md and reports/,
   Rajasthan/README.md and results_campaign/, Uttarakhand/README.md, Common/README.md,
   each regime's export_r<k>/plant_params.json, and the hold-test CSV files.
   Hold times for Tamil Nadu regimes 1-2 and Uttarakhand were computed for this page with the
   repository's own hold-test code (Common/hold_results_for_portal/); the repository had no
   stored output for them.
   Emulated validation only; no physical rig was used.
   ───────────────────────────────────────────────────────── */

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

/* What "hold" means in the hot-water tables. */
export const O4_HOLD_NOTE =
  "Hold time: hours the top layer of the tank stays at or above the delivery target after 18:00, with the sun off and no water drawn, from each arm's own 18:00 state. Mean of 12 start days spread through the year, followed for at most 72 h; 'cap' means some start days were still hot when the test stopped. Hold is set by the climate first, so compare arms within a regime, never across states.";

export const O4_STATES = [
  {
    id: "tamilnadu",
    name: "Tamil Nadu",
    tag: "SAC · single-node 100 L tank",
    setup: [
      { value: "100 L", label: "Tank, 2.5 m² collector, 98–105 capsules" },
      { value: "SAC", label: "Deployment controller (smart forecast, 15 inputs)" },
      { value: "2021 / 2011", label: "Replay years (validation / edge cases and regimes 1–2)" },
      { value: "1e-13 °C", label: "Twin vs Python in all three regimes; 100% identical decisions" },
    ],
    params: {
      columns: ["Regime", "Site", "PCM (melts at)", "Tank · collector", "Capsules · PCM mass", "Flow", "Mains", "Target"],
      rows: [
        ["0", "Coastal/interior lowland (156 m)", "PureTemp 58 (58 °C)", "100 L · 2.5 m²", "104 · 24.8 kg (70.4 kg water)", "0.0388 kg/s", "28.5 °C", "45 °C"],
        ["1", "Elevated, Nilgiris-adjacent (627 m)", "RT57HC (56.5 °C)", "100 L · 2.5 m²", "98 · 23.6 kg (72.1 kg water)", "0.0295 kg/s", "24.0 °C", "45 °C"],
        ["2", "Coastal metro lowland (44 m)", "RT57HC (56.5 °C)", "100 L · 2.5 m²", "105 · 25.3 kg (70.1 kg water)", "0.0267 kg/s", "27.8 °C", "45 °C"],
      ],
    },
    hold: {
      title: "How long the water stays hot (≥ 45 °C after 18:00)",
      columns: ["Regime", "Plain tank", "PCM + always charge", "PCM + SAC", "Replay year"],
      rows: [
        ["0", "21.6 h", "51.6 h (1 of 12 reached the cap)", "49.9 h", "2021"],
        ["1", "8.3 h", "35.8 h", "35.6 h", "2011"],
        ["2", "23.8 h", "62.3 h (3 of 12 reached the cap)", "61.9 h (3 of 12)", "2011"],
      ],
      note: "The PCM adds about 27–39 h of hot water over a plain tank in every regime, and SAC gives up only 0.2–1.7 h of it. The 50 °C target is never held: the top of the tank is at 45–48 °C at 18:00, so the 50 °C hold is 0 h for every arm. Regimes 1–2 and the 2011 year were run for this page (not stored in the repository).",
    },
    tables: [
      {
        title: "Three-arm comparison",
        caption: "Full year 2021, regime 0",
        firstCol: "Arm",
        columns: ["Delivered kWh", "Shield trips", "Thermal efficiency", "Demand coverage"],
        rows: [
          { arm: "1 · plain tank, B0", v: ["1,853.5", "17,020", "38.5%", "73.0%"] },
          { arm: "2 · PCM tank, B0", v: ["2,002.6", "39,705", "41.5%", "80.4%"] },
          { arm: "3 · PCM tank, SAC", v: ["1,971.4", "18,604", "40.9%", "79.8%"], best: true },
        ],
      },
      {
        title: "Twin against the Python simulator",
        caption: "Full year 2011, all three regimes",
        firstCol: "Regime",
        columns: ["Max temperature difference", "Delivered kWh (twin = Python)", "Shield trips (twin = Python)", "Identical actions"],
        rows: [
          { arm: "0", v: ["2.7e-13 °C", "2,069.64", "21,954", "100%"] },
          { arm: "1", v: ["2.6e-13 °C", "2,059.62", "17,227", "100%"] },
          { arm: "2", v: ["2.1e-13 °C", "2,068.73", "22,763", "100%"] },
        ],
      },
      {
        title: "Sensor faults, 20 seeds",
        caption: "SAC, regime 0, 10-day window (mean ± standard error)",
        firstCol: "Case",
        columns: ["Delivered kWh", "Shield hours", "Hard violations"],
        rows: [
          { arm: "Healthy", v: ["62.78 ± 0.05", "905.3 ± 4.2", "0"] },
          { arm: "Dead pyranometer", v: ["49.10 ± 0.11", "128.7 ± 5.1", "0"] },
          { arm: "Stuck pyranometer", v: ["49.67 ± 0.25", "183.1 ± 22.4", "0"] },
        ],
      },
    ],
    points: [
      "SAC keeps about 98% of always-charge delivery with less than half the shield trips (18,604 vs 39,705); zero hard violations in every arm and edge case.",
      "Retention: the SAC does not extend the hold (49.9 h against 51.6 h for always-charge); once charging stops, the tank only cools, so the controller changes only how full the tank is at 18:00.",
      "Sensor faults: a dead or stuck pyranometer cuts delivery by about 22% but causes no violations (0 of 60 runs). The controller depends on a working irradiance sensor.",
      "PCM swap with the geometry fixed: RT57HC delivers the most and holds longest (54.4–54.9 h); flow 0.7×–1.3× changes results by under 0.4%. The geometry was not re-optimised per PCM.",
      "Capsule benchmark: against a tank-level cool-down (Amanowicz and Turski 2025) the model loses 16 K against 26 K measured, a 38.5% error, so every hold time here is best read as an upper bound.",
      "Restart from a stored state is exact; energy closure passes for arms 1–2 (arm 3 reads 0.263% because the year's net storage change is tiny: 0.83 Wh absolute).",
      "Not produced for the retrained SAC: the Simulink model and generated C code. Regime 1's smart-forecast sensor faults were not checked.",
    ],
    figures: [
      { file: "tamilnadu/three_arm_2021.png", title: "Three-arm comparison (2021)", caption: "Plain tank, PCM + always-charge and PCM + SAC on the same weather." },
      { file: "tamilnadu/one_day_cycle_2021.png", title: "One-day charge/idle/bypass cycle", caption: "Day 71 of 2021: water and PCM temperature, melt fraction, collector gain, delivery and shield events." },
      { file: "tamilnadu/edge_cases_grid.png", title: "Six edge cases, three arms", caption: "Clear, no sunlight, rain/cloud, low temperature, heat wave and sensor fault." },
      { file: "tamilnadu/pyranometer_faults.png", title: "Dead and stuck pyranometer", caption: "Delivery drops but the shield keeps every limit." },
      { file: "tamilnadu/3d_day.png", title: "3-D view of the twin", caption: "Tank layers coloured by water temperature, capsules by melted share." },
    ],
    videos: [
      { file: "tamilnadu/video/o4_three_arm_day071_2021.mp4", title: "Three arms, one day", caption: "Plain tank, PCM + always-charge and PCM + SAC side by side on day 71 of 2021." },
      { file: "tamilnadu/video/edge_clear.mp4", title: "Edge case: clear sky", caption: "Three arms through a clear-sky event." },
      { file: "tamilnadu/video/edge_heat_wave.mp4", title: "Edge case: heat wave", caption: "SAC avoids the shield trips that always-charge accumulates." },
      { file: "tamilnadu/video/edge_sensor_fault.mp4", title: "Edge case: sensor fault", caption: "Noisy sensors with a 12 h blackout; the interlock falls back safely." },
      { file: "tamilnadu/video/showcase/o4_schematic_day_day071_2021.mp4", title: "Schematic: normal day", caption: "One-day schematic of the collector, tank, capsules and pump on day 71 of 2021." },
      { file: "tamilnadu/video/showcase/o4_schematic_heat_wave_day071_2021.mp4", title: "Schematic: heat wave", caption: "The same schematic through a heat-wave day." },
      { file: "tamilnadu/video/showcase/o4_schematic_rain_cloud_day071_2021.mp4", title: "Schematic: rain and cloud", caption: "The same schematic through a rain-and-cloud day." },
      { file: "tamilnadu/video/showcase/o4_schematic_sensor_fault_day071_2021.mp4", title: "Schematic: sensor fault", caption: "The same schematic with a sensor fault and the fail-safe." },
    ],
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    tag: "DQN + SAC · 10-node stratified 50 L tank",
    setup: [
      { value: "50 L", label: "10-node tank, 1.5 m² collector, 52 capsules" },
      { value: "DQN + SAC", label: "Released DQN (17-64-64-3) and a SAC arm added in all three regimes" },
      { value: "2023", label: "Replay year (a validation year)" },
      { value: "100%", label: "Identical actions: DQN in MATLAB, Simulink and C; SAC in all three regimes" },
    ],
    params: {
      columns: ["Regime", "Site", "PCM (melts at)", "Tank · collector", "Capsules · PCM mass", "Flow · layout", "Mains", "Target"],
      rows: [
        ["0", "Udaipur: cooler, arid, erratic sun", "savE OM55 (55 °C)", "50 L · 1.5 m²", "52 · 12.5 kg (35.8 kg water)", "0.0155 kg/s · staggered", "25.1 °C", "45 °C"],
        ["1", "Nagaur: hot, monsoon-influenced, steady sun", "PureTemp 60 (61 °C)", "50 L · 1.5 m²", "52 · 13.4 kg (35.2 kg water)", "0.0493 kg/s · single layer", "26.0 °C", "45 °C"],
        ["2", "Jaipur: cooler, arid, largest population", "PureTemp 58 (58 °C)", "50 L · 1.5 m²", "52 · 12.4 kg (35.2 kg water)", "0.0236 kg/s · single layer", "24.7 °C", "45 °C"],
      ],
    },
    hold: {
      title: "How long the water stays hot (≥ 45 °C after 18:00)",
      columns: ["Regime", "Plain tank", "PCM + always charge", "PCM + DQN", "PCM + SAC", "Replay year"],
      rows: [
        ["0", "43.7 h", "52.1 h (3 of 12 reached the cap)", "52.1 h (= always charge)", "47.5 h", "2023"],
        ["1", "51.9 h", "61.2 h (7 of 12)", "61.0 h (6 of 12)", "56.2 h (4 of 12)", "2023"],
        ["2", "46.7 h", "56.4 h (3 of 12)", "56.4 h (= always charge)", "55.0 h (3 of 12)", "2023"],
      ],
      note: "The PCM adds 8–10 h of hot water over a plain tank (regime 1: +9.3 h). The SAC gives up 1.4–5 h of it because Objective 3's reward has no retention term; the released DQN in regime 1 gives up none. At 50 °C the same arms hold 28.9 / 39.0 / 31.3 h (regime 0), 35.2 / 53.4 / 42.8 h (regime 1) and 31.0 / 46.1 / 41.4 h (regime 2) for plain, always-charge and SAC. The DQN equals always-charge in regimes 0 and 2 because it always charges there.",
    },
    tables: [
      {
        title: "Four-arm comparison",
        caption: "Regime 1 (Nagaur, PureTemp 60), full year 2023",
        firstCol: "Arm",
        columns: ["Delivered kWh", "Night window 18:00–09:00 kWh", "Guard-band hours", "Hold at 45 °C"],
        rows: [
          { arm: "1 · water only, B0", v: ["770.4", "452.8", "755", "51.9 h"] },
          { arm: "2 · PureTemp 60, B0", v: ["912.4", "587.2", "994", "61.2 h"] },
          { arm: "3 · PureTemp 60, DQN", v: ["897.3", "572.1", "430", "61.0 h"], best: true },
          { arm: "4 · PureTemp 60, SAC", v: ["873.6", "548.4", "144", "56.2 h"] },
        ],
      },
      {
        title: "SAC in all three regimes",
        caption: "2023, validation year; SAC run chosen by Objective 3's annual-only rule",
        firstCol: "Regime",
        columns: ["Delivered kWh, B0 → SAC", "Guard-band hours, B0 → SAC", "Hold at 45 °C, plain / B0 / SAC", "SAC run"],
        rows: [
          { arm: "0 · savE OM55", v: ["955.0 → 912.5 (95.6%)", "798 → 29 (−96%)", "43.7 / 52.1 / 47.5 h", "weight 5.85, seed 123"] },
          { arm: "1 · PureTemp 60", v: ["912.4 → 873.6 (95.7%)", "994 → 144 (−86%)", "51.9 / 61.2 / 56.2 h", "weight 2.55, seed 42"] },
          { arm: "2 · PureTemp 58", v: ["970.3 → 935.1 (96.4%)", "1,073 → 307 (−71%)", "46.7 / 56.4 / 55.0 h", "weight 0.85, seed 0"] },
        ],
      },
      {
        title: "Showcase year: heat collected and delivered",
        caption: "Regime 1 (Nagaur, PureTemp 60), full year 2023",
        firstCol: "System",
        columns: ["Delivered kWh", "Collected kWh", "Tank loss kWh", "Delivered per kWh collected", "Guard-band hours", "Hours ≥ 70 °C", "Pump run-hours"],
        rows: [
          { arm: "Plain tank", v: ["770.4", "1,270.3", "70.7", "60.6%", "755", "1,422", "4,099"] },
          { arm: "PCM only", v: ["912.4", "1,340.2", "72.3", "68.1%", "994", "1,368", "4,166"] },
          { arm: "AI + PCM (DQN)", v: ["897.3", "1,298.3", "70.3", "69.1%", "430", "1,053", "3,810"], best: true },
          { arm: "AI + PCM (SAC)", v: ["873.6", "n/a", "n/a", "69.4%", "144", "990", "3,619"] },
        ],
      },
      {
        title: "Edge cases, DQN against always-charge",
        caption: "Regime 1, April 2023 weather, 4-day event",
        firstCol: "Scenario",
        columns: ["DQN kWh", "B0 kWh", "DQN shield h", "B0 shield h", "Hard violations"],
        rows: [
          { arm: "Clear", v: ["11.05", "11.28", "7.8", "18.8", "0"] },
          { arm: "No sunlight", v: ["0.18", "0.18", "0", "0", "0"] },
          { arm: "Rain / cloud", v: ["2.49", "2.49", "0", "0", "0"] },
          { arm: "Low temperature", v: ["10.78", "12.43", "0", "10.6", "0"] },
          { arm: "Heat wave", v: ["11.91", "12.55", "3.3", "23.0", "0"] },
          { arm: "Sensor fault", v: ["8.42", "8.61", "5.6", "14.0", "0"] },
        ],
      },
    ],
    points: [
      "Full-year twin vs Python, all three regimes: temperatures within 6e-13 °C, identical shield counts and delivered energy, 100% identical actions. The SAC arm (added 15 Nov) is identical in all three regimes too, and the twin matches Objective 3's 2023 tables to 6e-12 kWh.",
      "Simulink model run for one week (100% identical actions) and the DQN compiled to C (9 files, identical decisions over 8,760 h).",
      "The PCM adds 134 kWh/yr in the night window over water only. The DQN gives up 15 kWh of it for 57% fewer guard-band hours and no retention loss; in regimes 0 and 2 the released DQN always charges, so the SAC is the controller that differs there.",
      "The SAC cuts guard-band hours by 96 / 86 / 71% (regimes 0 / 1 / 2) at 95.6–96.4% of always-charge delivery, but costs 1.4–5 h of hold. These are validation-year numbers; Objective 3's locked test is spent.",
      "Sensor dependence: with a dead pyranometer or a frozen PCM estimator the SAC loses most of its shield benefit (regime 1: 535 and 660 guard-band hours against 144), with no hard-limit hours. The DQN's guard-band hours rise from 430 to 701 with a dead pyranometer, because the interlock has no irradiance plausibility rule; adding one is the next fix.",
      "Showcase year (regime 1, 2023): the controller does not deliver more hot water than PCM only (−15 kWh with the DQN, −39 kWh with the SAC); its benefit is safety and wear: about 98% of the delivery with 57% less guard-band time, 23% fewer hours at 70 °C or more and 9% fewer pump hours. Pump effort is shown as run-hours because no pump power is defined in the project.",
      "Forecast check: scoring the released controllers with Objective 3's smart-persistence forecast instead of the perfect one moves delivery by 0.1–0.4% and does not worsen guard-band hours.",
      "Low temperature is a weak case: with mains 8 °C colder the DQN still idles at noon and delivers 13% less than always-charge, outside its training range. The PCM is fully solid again every night, so no latent heat carries over.",
      "Capsule check against Amanowicz and Turski 2025: once capsule geometry is matched, the frozen constants reproduce the experiment to 1.1–1.4 K; a fit gives c = 5.03.",
      "Measured limitation: halving the 150 s step changes annual energy by 0.080%, above the 0.05% gate; it comes from sensible-heat hours, not melting, and is about 5% of the repeatability band. It is reported, not relaxed.",
      "Objective 3's DQN re-run did not reproduce its regime-1 headline run; the original model (hash recorded) is the one used.",
    ],
    figures: [
      { file: "rajasthan/F10_four_arms_three_regimes.png", title: "Four arms, three regimes", caption: "Delivery, guard-band hours and hold for plain tank, always-charge, DQN and SAC in each regime." },
      { file: "rajasthan/four_arm_2023_r1.png", title: "Four-arm year, regime 1", caption: "Water only, PCM + always-charge, DQN and SAC over 2023." },
      { file: "rajasthan/F2_operating_trace.png", title: "Operating trace", caption: "Hour-by-hour temperatures and actions." },
      { file: "rajasthan/F3_retention_curves.png", title: "Retention curves", caption: "Top-layer temperature after charging stops, per arm." },
      { file: "rajasthan/F4_retention_bars.png", title: "Hold time by threshold", caption: "Hours above 30 / 40 / 45 / 50 °C per arm and PCM." },
      { file: "rajasthan/F5_three_regimes.png", title: "Three regimes", caption: "PCM gain over water only in window energy and hold time." },
      { file: "rajasthan/F9_edge_cases_with_dead_pyranometer.png", title: "Edge cases incl. dead pyranometer", caption: "Delivered heat and guard hours for DQN vs always-charge." },
      { file: "rajasthan/F11_o3_sensor_faults.png", title: "Objective 3's sensor faults on the twin", caption: "The seven Objective 3 sensor faults replayed on the MATLAB twin." },
      { file: "rajasthan/F8_experiment_comparison.png", title: "Tank-level experiment comparison", caption: "Twin vs Amanowicz and Turski 2025 cool-down curves." },
      { file: "rajasthan/B_simulink_block_diagram.png", title: "Simulink block diagram", caption: "The twin as a Simulink model." },
      { file: "rajasthan/showcase/o4_annual_comparison.png", title: "Showcase: full year 2023", caption: "Plain tank, PCM only and AI + PCM (DQN) over the year." },
      { file: "rajasthan/showcase/o4_annual_energy.png", title: "Showcase: heat collected and delivered", caption: "Heat collected, tank loss and hot water delivered per system." },
      { file: "rajasthan/showcase/o4_annual_comparison_sac.png", title: "Showcase: full year with SAC", caption: "The same year with the SAC arm added." },
      { file: "rajasthan/showcase/o4_day_day.png", title: "Showcase day: normal", caption: "Live plots of the three systems on day 165 of 2023." },
      { file: "rajasthan/showcase/o4_day_heat_wave.png", title: "Showcase day: heat wave", caption: "Ambient +9 °C, sun +15%." },
      { file: "rajasthan/showcase/o4_day_rain_cloud.png", title: "Showcase day: rain and cloud", caption: "Sun ×0.12, ambient −5 °C." },
      { file: "rajasthan/showcase/o4_day_sensor_fault.png", title: "Showcase day: sensor fault", caption: "Noisy sensors and a 12 h blackout." },
    ],
    videos: [
      { file: "rajasthan/video/o4_three_arm_day165_2023.mp4", title: "Three arms, one day", caption: "Plain tank, PCM + always-charge and PCM + DQN on day 165 of 2023." },
      { file: "rajasthan/video/edge_clear.mp4", title: "Edge case: clear sky", caption: "Three arms through a clear-sky event." },
      { file: "rajasthan/video/edge_heat_wave.mp4", title: "Edge case: heat wave", caption: "The DQN idles around noon and avoids the guard band." },
      { file: "rajasthan/video/edge_low_temperature.mp4", title: "Edge case: low temperature", caption: "The weak case: the DQN still idles at noon although nothing overheats." },
      { file: "rajasthan/video/edge_dead_pyranometer.mp4", title: "Edge case: dead pyranometer", caption: "The controller reads 0 W/m² while the real sun drives the plant." },
      { file: "rajasthan/video/edge_no_sunlight.mp4", title: "Edge case: no sunlight", caption: "Three arms through a day with no sun." },
      { file: "rajasthan/video/edge_rain_cloud.mp4", title: "Edge case: rain and cloud", caption: "Three arms through a rain-and-cloud day." },
      { file: "rajasthan/video/edge_sensor_fault.mp4", title: "Edge case: sensor fault", caption: "Noisy sensors with a blackout; the fail-safe takes over." },
      { file: "rajasthan/video/showcase/o4_schematic_day_day165_2023.mp4", title: "Schematic: normal day", caption: "Collector, tank, capsules and pump on day 165 of 2023." },
      { file: "rajasthan/video/showcase/o4_schematic_heat_wave_day165_2023.mp4", title: "Schematic: heat wave", caption: "The same schematic through a heat-wave day." },
      { file: "rajasthan/video/showcase/o4_schematic_rain_cloud_day165_2023.mp4", title: "Schematic: rain and cloud", caption: "The same schematic through a rain-and-cloud day." },
      { file: "rajasthan/video/showcase/o4_schematic_sensor_fault_day165_2023.mp4", title: "Schematic: sensor fault", caption: "The same schematic with a sensor fault and the fail-safe." },
      { file: "rajasthan/video/showcase_sac/o4_schematic_day_day165_2023.mp4", title: "Schematic (SAC): normal day", caption: "Showcase day with the SAC arm in place of the DQN." },
      { file: "rajasthan/video/showcase_sac/o4_schematic_heat_wave_day165_2023.mp4", title: "Schematic (SAC): heat wave", caption: "SAC through the heat-wave day." },
      { file: "rajasthan/video/showcase_sac/o4_schematic_rain_cloud_day165_2023.mp4", title: "Schematic (SAC): rain and cloud", caption: "SAC through the rain-and-cloud day." },
      { file: "rajasthan/video/showcase_sac/o4_schematic_sensor_fault_day165_2023.mp4", title: "Schematic (SAC): sensor fault", caption: "SAC with the sensor fault and fail-safe." },
      { file: "rajasthan/video/o4_hold70h_r0_SAC_2023.mp4", title: "70 h hold, regime 0 (SAC)", caption: "Tank temperature over 70 h after charging stops." },
      { file: "rajasthan/video/o4_hold70h_r1_DQN_2023.mp4", title: "70 h hold, regime 1 (DQN)", caption: "Tank temperature over 70 h after charging stops." },
      { file: "rajasthan/video/o4_hold70h_r1_SAC_2023.mp4", title: "70 h hold, regime 1 (SAC)", caption: "Tank temperature over 70 h after charging stops." },
      { file: "rajasthan/video/o4_hold70h_r2_SAC_2023.mp4", title: "70 h hold, regime 2 (SAC)", caption: "Tank temperature over 70 h after charging stops." },
      { file: "rajasthan/video/campaign/A2_retention_72h.mp4", title: "Campaign: 72 h retention", caption: "Retention curves building over 72 h." },
    ],
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand",
    tag: "PPO · 10-node stratified 50 L tank",
    setup: [
      { value: "50 L", label: "10-node tank, 1.5 m² collector, 50 °C delivery target" },
      { value: "PPO", label: "Frozen 15-64-64-2 network (enable / bypass)" },
      { value: "2010", label: "Replay year (an O3 test year, exploratory)" },
      { value: "PASS", label: "Full-year validation, regimes 0–2; Simulink and C on regime 1" },
    ],
    params: {
      columns: ["Regime", "Site (medoid)", "PCM", "Tank · collector", "Capsules · share of tank", "Flow · layout", "Mains", "Target"],
      rows: [
        ["0", "UKP_0014", "PureTemp 58 (58 °C)", "50 L · 1.5 m²", "47 · 26.3%", "0.0194 kg/s · staggered", "21.8 °C", "50 °C"],
        ["1", "UKP_0029 (primary)", "PureTemp 58 (58 °C)", "50 L · 1.5 m²", "55 · 29.7%", "0.0314 kg/s · single layer", "18.6 °C", "50 °C"],
        ["2", "UKP_0025", "savE OM55 (55 °C)", "50 L · 1.5 m²", "54 · 30.0%", "0.0199 kg/s · single layer", "17.0 °C", "50 °C"],
      ],
    },
    hold: {
      title: "How long the water stays hot after 18:00",
      columns: ["Regime", "≥ 50 °C target, all arms", "≥ 30 °C, plain tank", "≥ 30 °C, PCM + always enable", "≥ 30 °C, PCM + PPO", "Top layer at 18:00 (plain / B0 / PPO)"],
      rows: [
        ["0", "0 h", "0 h", "38.0 h (4 of 12 reached the cap)", "13.8 h", "22 / 32 / 30 °C"],
        ["1", "0 h", "0 h", "26.3 h (2 of 12)", "15.1 h", "19 / 29 / 28 °C"],
        ["2", "0 h", "0 h", "10.7 h (1 of 12)", "0 h", "18 / 27 / 26 °C"],
      ],
      note: "Unlike the other two states, Uttarakhand's tank is already cold at 18:00 (a 50 L tank cannot carry 300 L/day into the evening), so no arm holds 45 or 50 °C at all: the hot-water window at the 50 °C target is over by the evening. The PCM keeps the tank warm (above 30 °C) for 11–38 h that a plain tank does not, and PPO gives up much of it by keeping the tank cooler. Computed for this page on the 2010 replay year (not stored in the repository).",
    },
    tables: [
      {
        title: "Twin against the Python simulator",
        caption: "Full year 2010, MATLAB R2026b",
        firstCol: "Check",
        columns: ["Regime 0", "Regime 1", "Regime 2"],
        rows: [
          { arm: "Open-loop plant: max temperature difference", v: ["1.6e-13 °C", "2.1e-13 °C", "1.9e-13 °C"] },
          { arm: "E_del50 for the year, twin = Python [kWh]", v: ["1,100.89", "1,169.50", "1,212.30"] },
          { arm: "Shield hours, twin = Python", v: ["2.632", "0.847", "0.181"] },
          { arm: "Closed loop: identical actions", v: ["100%", "100%", "100%"] },
        ],
      },
      {
        title: "Edge cases, PPO against always-enable",
        caption: "Regime 1, April 2010 weather, event days only, kWh delivered to 50 °C",
        firstCol: "Scenario",
        columns: ["PPO kWh", "B0 kWh", "PPO shield h", "B0 shield h", "Hours over a hard limit"],
        rows: [
          { arm: "Clear", v: ["15.4", "16.9", "0.0", "20.4", "0"] },
          { arm: "No sunlight", v: ["0.3", "0.3", "0", "0", "0"] },
          { arm: "Rain / cloud", v: ["3.8", "3.8", "0", "0", "0"] },
          { arm: "Low temperature (mains −8 °C)", v: ["17.6", "17.6", "11.1", "11.1", "0"] },
          { arm: "Low temperature, policy sees training mains", v: ["16.5", "17.6", "0.0", "11.1", "0"] },
          { arm: "Heat wave", v: ["17.1", "18.6", "0.1", "25.8", "0"] },
          { arm: "Sensor fault (15 h fail-safe)", v: ["15.65", "16.89", "5.0", "20.4", "0"] },
        ],
      },
    ],
    points: [
      "Open-loop plant replay over 8,760 h matches Python to about 2e-13 °C in all three regimes, and the closed loop gives 100% identical actions.",
      "Simulink model (one week) gives 100% identical actions; the PPO and interlock compiled to C (9 files, 1,126 lines) match MATLAB and Python over 8,760 h.",
      "PPO repeats its Objective 3 trade-off in every sunny case: about 8–9% less energy to 50 °C than always-enable, and almost no shield time (0–0.3 h against 17–26 h), with zero hours over a hard limit.",
      "Mains temperature is a deployment risk: the frozen policy saw an almost constant mains input in training, so with mains 8 °C colder it bypasses all run in regimes 0 and 2 and delivers almost nothing. Feeding it the training mains value restores 94–95% of always-enable. Freeze that input or retrain with varying mains.",
      "Sensor-fault fail-safe falls back to always-enable under the in-plant shield, as the hand-off specifies. The 12 h blackout triggers it for 15 hours with no hard-limit time.",
      "Regime 3 has no PCM controller, because Objective 2 found PCM gives no gain there.",
      "The twin still carries the frozen PPO without forecast inputs; switching to the recommended smart-forecast PPO needs a re-export.",
    ],
    figures: [
      { file: "uttarakhand/regime1_clear.png", title: "Clear-sky edge case (regime 1)", caption: "PPO against always-enable through a clear event." },
      { file: "uttarakhand/regime1_heat_wave.png", title: "Heat-wave edge case (regime 1)", caption: "PPO keeps the tank below the shield band." },
      { file: "uttarakhand/regime1_sensor_fault.png", title: "Sensor-fault edge case (regime 1)", caption: "Noisy sensors with a 12 h blackout and the fail-safe." },
      { file: "uttarakhand/regime1_low_temp_mains_masked.png", title: "Cold case with training mains (regime 1)", caption: "Feeding the policy its training mains value restores normal behaviour." },
    ],
    videos: [
      { file: "uttarakhand/video/regime1_clear_ppo.mp4", title: "Edge case: clear sky (regime 1)", caption: "PPO through a clear-sky event on the stratified tank." },
      { file: "uttarakhand/video/regime1_heat_wave_ppo.mp4", title: "Edge case: heat wave (regime 1)", caption: "PPO bypasses before the guard band is reached." },
      { file: "uttarakhand/video/regime1_sensor_fault_ppo.mp4", title: "Edge case: sensor fault (regime 1)", caption: "The 12 h blackout and the always-enable fail-safe." },
      { file: "uttarakhand/video/o4_three_arm_day105_2023.mp4", title: "Three arms, one day", caption: "Plain tank, PCM + always-enable and PCM + PPO side by side on day 105 of 2023." },
      { file: "uttarakhand/video/regime0_low_temperature_ppo.mp4", title: "Edge case: low temperature (regime 0)", caption: "The policy bypasses all run when mains is 8 °C colder than in training." },
      { file: "uttarakhand/video/o4_story_day105_2023.mp4", title: "Story video: one day", caption: "Narrated one-day run on day 105 of 2023." },
      { file: "uttarakhand/video/o4_story_edge_heat_wave_2023.mp4", title: "Story video: heat wave", caption: "Narrated heat-wave case." },
      { file: "uttarakhand/video/o4_story_edge_no_sunlight_2023.mp4", title: "Story video: no sunlight", caption: "Narrated no-sunlight case." },
    ],
  },
];

export const O4_LIMITATIONS = [
  "Emulated validation only: the twin is checked against the same physics the controller was trained on, not against a real tank.",
  "Single training seed per deployed controller; the 20-seed results measure robustness to sensor noise, not to training variance.",
  "Replay years were used for checkpoint selection or are already-spent test years, so results are fidelity checks, not new performance claims. Rajasthan's SAC numbers are validation-year only.",
  "Forecast inputs are supplied from stored clear-sky data (perfect in Rajasthan, smart persistence in Tamil Nadu); a live forecast would have more error, and next-hour demand is perfect.",
  "Controllers depend on working sensors: delivery falls by 14–22% in Tamil Nadu if the pyranometer fails, Rajasthan's SAC loses most of its shield benefit, and Uttarakhand's PPO fails to bypass when mains drifts. Safety holds in every case.",
  "Hold times are model values: the lumped capsule model runs slow against published capsules (a 38.5% error in the Tamil Nadu tank benchmark), so read them as upper bounds. They are compared within a regime only.",
  "Tamil Nadu regimes 1–2 and Uttarakhand hold times were computed for this page, and Simulink and generated C exist for Rajasthan and Uttarakhand only, not Tamil Nadu's retrained SAC.",
  "Next: real hardware (Raspberry Pi / ESP32), bench interlock, shadow mode, hardware-in-the-loop, then a long field trial.",
];
