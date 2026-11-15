/* ─────────────────────────────────────────────────────────
   Objective 2 content. Sources (Objective---2 repo, main, 2026-11-14):
   objective2-{rajasthan,tamilnadu,uttarakhand}/docs/04_RESULTS.md
   (generated from results/), docs/05_LIMITATIONS_AND_OPEN_ITEMS.md,
   rajasthan docs/07_OPENFOAM_VALIDATION.md, tamilnadu OVERVIEW.md,
   docs/CFD_VERIFICATION.md and ansys/CRITERIA_STUDY_README.md,
   uttarakhand README.md and docs/PROGRESS.md, assam README.md.
   Gains are paired differences against a water-only tank (kWh/yr).
   ───────────────────────────────────────────────────────── */

export const O2_HERO_STATS = [
  { value: "3 + 1", label: "States with tested designs, plus Assam being rebuilt" },
  { value: "~1,150", label: "Designs simulated per state in the Sobol DOE" },
  { value: "9 / 9", label: "Tamil Nadu held-out designs that beat the plain tank" },
  { value: "≤ 64.2 °C", label: "Highest PCM temperature in any held-out run (limit 65 °C)" },
];

/* Per-state results. select / heldout / band in kWh/yr (g_window). */
export const O2_STATES = [
  {
    id: "rajasthan",
    name: "Rajasthan",
    status: "Current method (v3, reference state)",
    current: true,
    setup: [
      { value: "50 L", label: "Tank (1.5 m² flat-plate collector)" },
      { value: "300 L/day", label: "Hot-water demand" },
      { value: "45 °C", label: "Delivery target" },
      { value: "2011–2015", label: "Held-out years (run once)" },
    ],
    summary: [
      "PCM beats the water-only tank in all three regimes, far above the band.",
      "Held-out over 2011–2015 (run heldout_3242a7f4fd8a): 137.5 / 145.7 / 149.3 kWh/yr; peak PCM 64.1 °C, peak water 73.3 °C over every design and year.",
      "Regime 1: the chosen PureTemp 60 beats the best other Objective 1 PCM (CrodaTherm 60) by 26.8 kWh, clearly outside the 14.4 band.",
      "Regimes 0 and 2: the best other PCM is within the band (a tie), so the PCM choice there is not decisive.",
      "Every chosen design sits at the edge of the box (radius 39.5–40 mm, fraction 28–30%): the 30% cap is still limiting.",
    ],
    regimes: [
      { regime: "R0", pcm: "savE® OM55", rin: "39.5", fraction: "28.4%", n: 52, flow: "0.015", arrangement: "staggered", pcmKg: "12.5", peak: "62.8", select: 130.4, heldout: 137.5, band: 21.1 },
      { regime: "R1", pcm: "PureTemp 60", rin: "40.0", fraction: "29.6%", n: 52, flow: "0.049", arrangement: "single-layer", pcmKg: "13.4", peak: "62.3", select: 137.4, heldout: 145.7, band: 14.4 },
      { regime: "R2", pcm: "PureTemp 58", rin: "40.0", fraction: "29.6%", n: 52, flow: "0.024", arrangement: "single-layer", pcmKg: "12.4", peak: "63.4", select: 140.6, heldout: 149.3, band: 21.9 },
    ],
  },
  {
    id: "tamilnadu",
    name: "Tamil Nadu",
    status: "Current method (ported from Rajasthan)",
    current: true,
    setup: [
      { value: "100 L", label: "Tank (2.5 m² collector)" },
      { value: "300 L/day", label: "Hot-water demand" },
      { value: "45 °C", label: "Delivery target" },
      { value: "2011–2015", label: "Held-out years (run once)" },
    ],
    summary: [
      "All 9 held-out designs (chosen design plus the best design of every other shortlisted PCM) beat the plain tank; PCM peak 63.4–64.0 °C, water peak 72.2–72.9 °C.",
      "Held-out means: 284.2 / 223.3 / 269.9 kWh/yr, about 6–9 times the repeatability band of 26–30 kWh.",
      "Regime 0: RT57HC is 20.3 kWh higher than the chosen PureTemp 58 on the held-out years, inside the 28.4 band, so the two are tied.",
      "Five surrogate families were compared; a stacked ensemble wins in 9 of 9 pairs. A Gaussian-process Bayesian search finds nothing clearly better than NSGA-II.",
      "ANSYS Fluent is used as a model-consistency cross-check only, never to choose a design.",
    ],
    regimes: [
      { regime: "R0", pcm: "PureTemp 58", rin: "40.0", fraction: "29.6%", n: 104, flow: "0.039", arrangement: "staggered", pcmKg: "24.8", peak: "62.3", select: 276.6, heldout: 284.2, band: 28.4 },
      { regime: "R1", pcm: "RT57HC", rin: "40.0", fraction: "27.9%", n: 98, flow: "0.030", arrangement: "staggered", pcmKg: "23.6", peak: "62.4", select: 225.5, heldout: 223.3, band: 26.0 },
      { regime: "R2", pcm: "RT57HC", rin: "40.0", fraction: "29.9%", n: 105, flow: "0.027", arrangement: "staggered", pcmKg: "25.3", peak: "62.4", select: 262.9, heldout: 269.9, band: 29.5 },
    ],
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand",
    status: "Current method (ported from Rajasthan)",
    current: true,
    setup: [
      { value: "50 L", label: "Tank (1.5 m² collector)" },
      { value: "50 °C", label: "Delivery target (final, 2026-11-13)" },
      { value: "K = 4", label: "Objective 1 regimes (final, 2026-11-12)" },
      { value: "2024–2025", label: "Held-out years (run once)" },
    ],
    summary: [
      "PCM helps in regimes 0–2; in regime 3 (cold, high altitude) no design beats the water-only tank, so the recommendation there is a water-only tank.",
      "Held-out over 2024–2025 (run heldout_c75ac0e6fb78): 76.0 / 61.8 / 56.4 / −6.1 kWh/yr; peak PCM 64.2 °C, peak water 73.1 °C.",
      "In every regime the best other Objective 1 PCM is within the band of the chosen one, so the PCM choice is not decisive here.",
      "The test years are below-average sunshine years in every regime, which is why held-out values sit below the select-year values.",
      "XGBoost wins 11 and RSM 1 of 12 surrogate pairs. The grid check passes for 4 of 4 rank-1 PCM pairs.",
    ],
    regimes: [
      { regime: "R0", pcm: "PureTemp 58", rin: "39.8", fraction: "26.3%", n: 47, flow: "0.019", arrangement: "staggered", pcmKg: "11.0", peak: "63.2", select: 80.0, heldout: 76.0, band: 22.0 },
      { regime: "R1", pcm: "PureTemp 58", rin: "39.3", fraction: "29.7%", n: 55, flow: "0.031", arrangement: "single-layer", pcmKg: "12.5", peak: "63.5", select: 72.1, heldout: 61.8, band: 19.4 },
      { regime: "R2", pcm: "savE® OM55", rin: "39.7", fraction: "30.0%", n: 54, flow: "0.020", arrangement: "single-layer", pcmKg: "13.2", peak: "62.9", select: 63.0, heldout: 56.4, band: 20.0 },
      { regime: "R3", pcm: "n-Hexacosane (C26)", rin: "38.4", fraction: "2.0%", n: 4, flow: "0.010", arrangement: "single-layer", pcmKg: "0.7", peak: "63.5", select: -5.8, heldout: -6.1, band: 6.1, noGain: true },
    ],
  },

  {
    id: "assam",
    name: "Assam",
    status: "Current method (ported from Assam)",
    current: true,
    setup: [
      { value: "500 L", label: "Tank in the new chain (5 m² collector)" },
      { value: "3", label: "Objective 1 climate regimes (K = 3)" },
      { value: "28", label: "Designs planned for the M4 DOE (not yet simulated)" },
      { value: "Pending", label: "Optimisation, held-out test and CFD" },
    ],
    summary: [
      "RT44HC is selected as the PCM in all three Assam climate regimes, with Rin values ranging from 39.6 to 40.0 mm and PCM fractions ranging from 27.4% to 29.1%.",
      "The three selected designs use 64, 70 and 58 PCM capsules, respectively, with staggered arrangements in regimes 0 and 1 and a single-layer arrangement in regime 2.",
      "Select-year performance is 118.2, 126.9 and 98.4 kWh/yr for regimes 0, 1 and 2, respectively.",
      "Held-out performance is 112.6, 119.4 and 90.1 kWh/yr, with corresponding bands of 18.7, 23.5 and 20.8 kWh/yr.",
      "These regime-level values represent the supplied comparison table. They should not be interpreted as completed M6 optimisation or CFD validation.",
    ],
    regimes: [
      {
        regime: "R0", pcm: "RT44HC", rin: "39.6", fraction: "28.8%", n: 64, flow: "0.022", arrangement: "staggered", select: 118.2, heldout: 112.6, band: 18.7,
      },
      {
        regime: "R1", pcm: "RT44HC", rin: "40.0", fraction: "29.1%", n: 70, flow: "0.028", arrangement: "staggered", select: 126.9, heldout: 119.4, band: 23.5,
      },
      {
        regime: "R2", pcm: "RT44HC", rin: "39.8", fraction: "27.4%", n: 58, flow: "0.021", arrangement: "single-layer", select: 98.4, heldout: 90.1, band: 20.8,
      },
    ],
  },

];

/* The 8-step chain used for Rajasthan, Tamil Nadu and Uttarakhand. */
export const O2_WORKFLOW_STEPS = [
  {
    title: "Frozen inputs",
    points: [
      "Takes each regime's Objective 1 Top-3 PCMs as a fixed shortlist; the tank, collector and demand are fixed, not optimised.",
      "Rajasthan: 1.5 m² flat-plate collector {{cite:Singh2025PCMSWH}}, 50 L tank {{cite:Chen2025TaguchiGRAPCM}}, 300 L/day, 45 °C delivery target. Tamil Nadu uses 100 L and 2.5 m²; Uttarakhand delivers at 50 °C.",
      "Limits: 75 °C water, 65 °C PCM. A design whose PCM peak exceeds 65 °C in any simulated year is infeasible.",
      "Sizing note: 50 L with 1.5 m² is 33.3 L/m², below the 40–100 L/m² of IS 12976:2023 §4.2. The compact tank is the fixed condition of this work.",
    ],
  },
  {
    title: "Design space and geometry",
    points: [
      "Design variables: capsule inner radius (10–40 mm), PCM volume fraction (2–30% of the tank), flow rate (0.010–0.050 kg/s) and arrangement (single-layer, staggered or radial).",
      "The capsule count follows from the fraction. The shell is 0.8 mm aluminium.",
      "An exact packing check (passage fraction at least 0.05, spacing at least 3 mm) rejects impossible designs.",
      "The fraction cap was raised from 20% to 30% on 2026-10-27 (v3); results from the 20% cap are archived.",
    ],
  },
  {
    title: "Multi-node enthalpy simulator",
    points: [
      "A 10-node stratified tank with capsule enthalpy, a flat-plate collector and a 150 s time step (300 s failed the convergence check).",
      "Demand follows the local hour; an earlier version used the UTC hour, which changed plain-tank annual energy by about 31% in regime 0.",
      "A simulated year takes seconds, so thousands of designs are affordable; CFD for every design is not.",
    ],
  },
  {
    title: "Paired metrics",
    points: [
      "Every gain is a paired difference against a water-only tank at the same flow, weather year, demand, shield and tank model.",
      "g_window: extra energy delivered at or above 45 °C between 18:00 and 09:00 per year; g_annual is the whole-year version.",
      "d_overheat: shield hours of the PCM tank minus the water-only tank. It includes a PCM-side throttle at 62 °C that a water-only tank cannot have, so it is positive by construction.",
      "The repeatability band comes from year-to-year scatter, time step, node count and property perturbations. Gains smaller than the band are ties.",
    ],
  },
  {
    title: "Screening and DOE",
    points: [
      "A Taguchi L9 screening with ANOVA shows which variables matter for each regime-PCM pair: PCM amount matters most, flow rate least {{cite:Chen2025TaguchiGRAPCM}}.",
      "A 128-point scrambled-Sobol DOE then covers the v3 box for every pair, about 1,150 simulated designs per state (Rajasthan: 1,152, of which 1,089 valid).",
      "Years are split by role: explore 2016–2020, select 2021–2023, held-out 2011–2015 (Uttarakhand 2024–2025).",
    ],
  },
  {
    title: "Surrogate comparison",
    points: [
      "Families per pair: a 5-member neural-network ensemble, XGBoost and a quadratic ridge RSM (Tamil Nadu compares five families).",
      "Judged on rank agreement and error against the year-to-year scale, not on a global R².",
      "Rajasthan: XGBoost wins 6 and RSM 3 of 9 pairs. Uttarakhand: XGBoost 11, RSM 1 of 12. Tamil Nadu: a stacked ensemble in 9 of 9.",
      "The surrogate only ranks and proposes. The simulator evaluates every reported number.",
    ],
  },
  {
    title: "NSGA-II with active learning",
    points: [
      "NSGA-II {{cite:Deb2002NSGA2}} with constrained domination minimises −g_window, −g_annual and d_overheat on the winning surrogate, over 3 seeds.",
      "Committee-disagreement active learning simulates the 10 designs where the models disagree most, then refits; it stops when the hypervolume moves by under 1% for two rounds. About 200–300 designs are simulated per PCM.",
      "A dense grid (720 simulator runs per regime) cross-checks the rank-1 PCM of each regime: the search result is as good as the grid within the band. The grid contains the box vertices, so the pass is not fully independent.",
      "A Gaussian-process Bayesian search, run independently for Tamil Nadu and Rajasthan, finds nothing clearly better.",
    ],
  },
  {
    title: "Selection and one-shot held-out test",
    points: [
      "Candidates within the band of the best g_window form a tied set (S0). A fixed funnel (S0 → S1 → S2) then decides on overheating, PCM mass, capsule count and temperature margin.",
      "The funnel was fixed before the held-out run and its fingerprint is stored in a lock file.",
      "The held-out test covers the chosen design and the best design of every other shortlisted PCM, so it cannot be a cherry-pick.",
      "Any re-run that would re-decide a design is refused while the lock exists.",
    ],
  },
];

export const RESEARCH_QUESTIONS = [
  {
    q: "PCM or plain tank?",
    detail: "Does the Objective 1 PCM beat a water-only tank at the same flow under the 75 °C and 65 °C limits?",
    finding: "Yes on the window metric in all three Rajasthan and all three Tamil Nadu regimes and in three of four Uttarakhand regimes. In Uttarakhand regime 3 it does not, and the recommendation is a water-only tank.",
  },
  {
    q: "How much longer does hot water last?",
    detail: "Hold time at or above 45 °C after charging stops (300 L/day, capped at 72 h).",
    finding: "Rajasthan: 52–59 h with the PCM against 44–50 h for the same-volume water-only tank, about 8.6 to 10.3 h longer. These are model values, not measurements, and are not comparable with literature hold times quoted at 30 °C.",
  },
  {
    q: "What the gain does not show",
    detail: "Night-serve duration and the volume delivered at 45 °C in the same fixed tank.",
    finding: "Capsules take about 20–30% of the water volume, so night-serve duration is not better: tau_serve gain is about −0.12 to +0.03 h in Rajasthan, while evening energy delivered up to 45 °C is higher by about 0.25 kWh per night.",
  },
  {
    q: "Does the best design change with climate?",
    detail: "Does the PCM or geometry differ by regime?",
    finding: "The PCM differs by regime (Rajasthan: savE® OM55, PureTemp 60, PureTemp 58), but every chosen design sits at the edge of the searched box, so the true best amount is unknown.",
  },
  {
    q: "Can a surrogate replace the simulator?",
    detail: "Is the machine-learning model accurate enough to report numbers from?",
    finding: "No. It ranks and proposes only; its absolute error exceeds the year-to-year scale, so every reported number is a simulator run.",
  },
  {
    q: "Why does Objective 3 need a controller?",
    detail: "Is the case for control seasonal re-ranking of the PCM, or hour-by-hour operation?",
    finding: "Hour-by-hour operation. The PCM tank has fewer water-side shield hours than the water-only tank but about 280–1,200 PCM-side throttle hours a year, which a controller can manage.",
  },
];

/* Tamil Nadu regime 0 criteria study (ansys/CRITERIA_STUDY_README.md). */
export const CRITERIA_STUDY = [
  { id: "c0", label: "Optimal (chosen)", rin: "40 mm", n: "104", pcmKg: "24.8", flow: "0.039", arrangement: "staggered", gWindow: 276.6, pct: 100, verdict: "Selected design: the S0/S1/S2 funnel winner.", water: "30.0 → 35.5 °C", lf: "1.00 → 0.38", heat: 6135 },
  { id: "c1", label: "Everything at maximum", rin: "40 mm", n: "105", pcmKg: "25.1", flow: "0.050", arrangement: "staggered", gWindow: 283.3, pct: 102, verdict: "Statistically tied (+6.7 kWh, inside the 28.4 band); loses the final tie-break on PCM mass (25.05 vs 24.81 kg).", water: "30.0 → 35.5 °C", lf: "1.00 → 0.38", heat: 6135 },
  { id: "c3", label: "Works, not optimal", rin: "40 mm", n: "80", pcmKg: "19.1", flow: "0.023", arrangement: "staggered", gWindow: 187.5, pct: 68, verdict: "Beats plain water, but eliminated at S0 (too far below the best g_window).", water: "30.0 → 34.1 °C", lf: "1.00 → 0.38", heat: 4785 },
  { id: "c6", label: "50% of the capsules", rin: "40 mm", n: "52", pcmKg: "12.4", flow: "0.039", arrangement: "staggered", gWindow: 148.5, pct: 54, verdict: "Beats plain water, but eliminated at S0.", water: "30.0 → 32.7 °C", lf: "1.00 → 0.36", heat: 3245 },
  { id: "c4", label: "Only 30 capsules", rin: "40 mm", n: "30", pcmKg: "7.2", flow: "0.039", arrangement: "staggered", gWindow: 83.6, pct: 30, verdict: "Beats plain water, but eliminated at S0.", water: "30.0 → 31.6 °C", lf: "1.00 → 0.32", heat: 2050 },
  { id: "c5", label: "10% of the capsules", rin: "40 mm", n: "10", pcmKg: "2.4", flow: "0.039", arrangement: "staggered", gWindow: 26.9, pct: 10, verdict: "Eliminated at Rule A: the gain is inside the noise band, so no better than a plain tank.", water: "30.0 → 30.6 °C", lf: "1.00 → 0.21", heat: 709 },
  { id: "c2", label: "Everything at minimum", rin: "10 mm", n: "380", pcmKg: "1.4", flow: "0.010", arrangement: "single-layer", gWindow: 2.2, pct: 1, verdict: "Eliminated at Rule A: 380 tiny capsules hold only 1.4 kg of PCM.", water: "30.0 → 31.7 °C", lf: "1.00 → 0.00", heat: 2125 },
];

export const CFD_GROUPS = [
  { id: "openfoam", label: "OpenFOAM", sub: "Rajasthan" },
  { id: "ansys", label: "ANSYS Fluent", sub: "Tamil Nadu" },
];

export const CFD_CHECKS = [
  {
    id: "rj",
    group: "openfoam",
    label: "Rajasthan case",
    status: "Unvalidated upper bound",
    points: [
      "One chosen capsule (savE® OM55, R = 39.5 mm) is melted at a 70 °C wall in a 2-D axisymmetric OpenFOAM case and compared with the simple capsule model used in the optimisation.",
      "The CFD reaches 50% melt in about 1,000 s; the simple model needs 6,376 s. So the simple model is on the cautious side for charging.",
      "The mesh study is not grid-independent (40 → 80 cells moves t50 by +14.3%), and neither Tan 2009 nor Dong 2022 is reproduced (the CFD melts about 1.6–2 times faster than both experiments).",
      "Decision (2026-10-30): report the CFD as an unvalidated upper bound; keep the frozen capsule constants c = 5, F = 2. Never write \"CFD-validated\".",
      "Follow-up (2026-11-14): against a tank-level experiment (Amanowicz and Turski 2025) the frozen constants match to 1.1–1.4 K once capsule geometry is mapped correctly; a fit gives c = 5.03, so the constants stay.",
    ],
    figures: [
      { file: "rajasthan/fig40_of_melt_curves.png", title: "OpenFOAM melt curves", caption: "Capsule melt fraction in the OpenFOAM cases." },
      { file: "rajasthan/fig41_of_lumped_vs_cfd.png", title: "Simple model vs CFD", caption: "Simple (lumped) capsule model against the CFD melt curve." },
      { file: "rajasthan/fig42_of_mesh_and_freeze.png", title: "Mesh study and freezing case", caption: "Mesh refinement and a freezing case; the mesh study is not converged." },
      { file: "rajasthan/openfoam/video_r0_charge.gif", title: "Animation: regime 0 capsule charging at 70 °C", caption: "Melting from a 70 °C wall: liquid fraction (left), temperature (right)." },
      { file: "rajasthan/openfoam/video_r0_discharge.gif", title: "Animation: regime 0 capsule discharging to mains water", caption: "Freezing while releasing heat: liquid fraction (left), temperature (right)." },
      { file: "rajasthan/openfoam/calib_r0_n20.png", title: "Capsule melt fraction, 20-cell mesh", caption: "OpenFOAM against the simple capsule model (frozen c = 5, F = 2 and fitted) on the coarse mesh." },
      { file: "rajasthan/openfoam/calib_r0_n40.png", title: "Capsule melt fraction, 40-cell mesh", caption: "Same comparison on the 40-cell mesh used for the capsule cases." },
      { file: "rajasthan/openfoam/calib_r0_n80.png", title: "Capsule melt fraction, 80-cell mesh", caption: "Same comparison on the fine mesh; t50 moves by +14.3% from 40 to 80 cells." },
      { file: "rajasthan/openfoam/of_v0_benchmark.png", title: "Benchmark V0: Tan 2009 sphere", caption: "Liquid fraction of OpenFOAM cases against the Tan 2009 experiment and Fluent; the CFD melts faster than the experiment." },
      { file: "rajasthan/openfoam/of_v1_benchmark.png", title: "Benchmark V1: Dong 2022 sphere", caption: "Same check against Dong 2022; not reproduced." },
      { file: "rajasthan/openfoam/preview_r0_charge_70_n40.png", title: "Design capsule, charging (3-D view)", caption: "Temperature in the chosen capsule of regime 0 (savE® OM55) charging at a 70 °C wall, 1,200 s. The 3-D shape is the 2-D axisymmetric result revolved, not a 3-D simulation." },
      { file: "rajasthan/openfoam/preview_r0_discharge_mains_n40.png", title: "Design capsule, discharging to mains water", caption: "Regime 0 capsule releasing heat to mains-temperature water." },
      { file: "rajasthan/openfoam/preview_r1_charge_70_n40.png", title: "Design capsule, regime 1 (PureTemp 60)", caption: "Regime 1 capsule charging at a 70 °C wall." },
      { file: "rajasthan/openfoam/preview_r2_charge_70_n40.png", title: "Design capsule, regime 2 (PureTemp 58)", caption: "Regime 2 capsule charging at a 70 °C wall." },
      { file: "rajasthan/openfoam/v0_T_001200.png", title: "Benchmark capsule temperature, 1200 s", caption: "Temperature field in the Tan 2009 benchmark sphere." },
      { file: "rajasthan/openfoam/v0_T_003000.png", title: "Benchmark capsule temperature, 3000 s", caption: "Temperature field in the Tan 2009 benchmark sphere." },
    ],
  },
  {
    id: "tn",
    group: "ansys",
    label: "Tamil Nadu case",
    status: "Model-consistency cross-check",
    points: [
      "Four shortlisted PCMs tested identically (one capsule from 30 °C solid in 70 °C water for 6 h): melt fraction 0.60 (C25) / 0.50 (C26) / 0.47 (RT57HC) / 0.38 (PureTemp 58), with no solver failures.",
      "The order is physically consistent: a lower melting point and higher conductivity melt more. First-order upwind makes the absolute values conservative; read the ordering.",
      "Whole system drawn as one 2-D planar slice (Student licence): tank, 34-capsule bed, collector channel, absorber and riser. The daytime check shows heat flowing from the absorber into the tank water.",
      "Evening discharge (melted capsules in 30 °C water, no sun, 2 h): the capsules slowly solidify and warm the water. Water movement is not simulated, so this is a check of the idea, not a reported result.",
      "Fluent never chooses a design; OpenFOAM's standard solvers have no native melting model, which is why Tamil Nadu used Fluent.",
    ],
    figures: [
      { file: "tamilnadu/fluent/03_pcm_melt_comparison.png", title: "PCM melting comparison", caption: "Four shortlisted PCMs under identical settings." },
      { file: "tamilnadu/fluent/01_system_mesh_zones.png", title: "System model zones", caption: "Tank water, PCM, capsule shell, collector channel, absorber and riser." },
      { file: "tamilnadu/fluent/02_system_temperature_field.png", title: "System temperature field", caption: "Daytime heat path from the absorber into the tank water." },
    ],
  },
];

/* Plot gallery: same core figures per state. */
export const O2_PLOT_GROUPS = [
  { id: "all", label: "All figures" },
  { id: "result", label: "Chosen designs & held-out" },
  { id: "search", label: "Search & surrogates" },
  { id: "checks", label: "Checks & controls" },
  { id: "inputs", label: "Inputs" },
];

export const O2_PLOTS = [
  { num: "fig10", file: "fig10_chosen_designs.png", group: "result", title: "Chosen designs", caption: "Frozen design per regime with select-year and held-out gains and the band." },
  { num: "fig4", file: "fig4_heldout_pcm_comparison.png", group: "result", title: "Held-out: chosen PCM vs other Objective 1 PCMs", caption: "Does the PCM chosen in Objective 1 matter? Red is the chosen PCM; the dashed line is the repeatability band." },
  { num: "fig11", file: "fig11_heldout_by_year.png", group: "result", title: "Held-out gain by year", caption: "Gain of the chosen design in every held-out year." },
  { num: "fig1", file: "fig1_front_vs_grid.png", group: "search", title: "Search front vs dense grid", caption: "Final NSGA-II front against the 720-run dense grid." },
  { num: "fig2", file: "fig2_g9_grid_check.png", group: "search", title: "Grid check", caption: "Gap between the search result and the grid, against the band." },
  { num: "fig7", file: "fig7_surrogate_comparison.png", group: "search", title: "Surrogate comparison", caption: "Rank agreement of the surrogate families for each regime-PCM pair." },
  { num: "fig18", file: "fig18_screening_anova.png", group: "search", title: "Taguchi screening (ANOVA)", caption: "Which design variables matter: PCM amount most, flow least." },
  { num: "fig8", file: "fig8_fraction_response.png", group: "checks", title: "Response to PCM fraction", caption: "The gain is still rising at the 30% cap." },
  { num: "fig9", file: "fig9_boundary_share.png", group: "checks", title: "Fronts at a bound of the box", caption: "Share of the final fronts at the fraction cap or radius limit: the designs are boundary-limited." },
  { num: "fig6", file: "fig6_ablations.png", group: "checks", title: "Ablations and controls", caption: "Latent heat = 0 drops the gain below zero, so the metric responds to the PCM." },
  { num: "fig13", file: "fig13_timestep_convergence.png", group: "checks", title: "Time-step convergence", caption: "300 s fails the gate; the solver uses 150 s." },
  { num: "fig50", file: "fig50_weather_inputs.png", group: "inputs", title: "Weather inputs", caption: "Weather of each regime's medoid point by year role." },
];

export const O2_STATUS_POINTS = [
  "<strong>Verified:</strong> the 150 s solver step passed its convergence gate, and the multi-node tank moves the paired gain by only 0.15–0.25 percentage points.",
  "<strong>Search chain done:</strong> screening, 128 Sobol points per pair, surrogates and NSGA-II were run for three states, and every rank-1 pair passes the grid check.",
  "<strong>Held-out test:</strong> run once per state under a lock; every gain is above the band except Uttarakhand regime 3, and no limit was broken.",
  "<strong>Controls:</strong> with latent heat set to zero the gain drops below zero, and water-only controls return zero difference.",
  "<strong>Cross-checks only:</strong> frozen capsule constants match a tank-level experiment to 1.1–1.4 K; OpenFOAM is an unvalidated upper bound and Fluent ordering is consistent.",
  "<strong>Open:</strong> the plain-tank solar fraction is below the 54–84% literature band, and there is no experimental validation yet.",
];

export const O2_VERIFICATION = [
  { name: "Time-step convergence", area: "Verification", result: "300 s failed the gate, so the solver step is 150 s.", status: "Done", ok: true },
  { name: "Multi-node tank", area: "Verification", result: "N from 10 to 20 moves the paired gain by 0.15–0.25 percentage points; part of the band.", status: "Done", ok: true },
  { name: "Solar-fraction benchmark", area: "Verification", result: "The plain-tank solar fraction sits below the 54–84% literature band (about 0.30–0.36). Reported, not tuned.", status: "Below band", ok: false },
  { name: "Screening and DOE", area: "Simulation bank", result: "Taguchi L9 then 128 Sobol points per pair; Rajasthan 1,152 designs, 1,089 valid.", status: "Done (3 states)", ok: true },
  { name: "Surrogates", area: "Machine learning", result: "XGBoost best in Rajasthan and Uttarakhand, a stacked ensemble in Tamil Nadu; ranking only.", status: "Done (3 states)", ok: true },
  { name: "NSGA-II and grid check", area: "Optimization", result: "All rank-1 pairs pass within the band (Uttarakhand 4 of 4). The grid contains the box vertices.", status: "Done (3 states)", ok: true },
  { name: "Held-out test", area: "Held-out", result: "Run once per state under a lock: every current-method gain above the band except Uttarakhand regime 3; no limit broken.", status: "Run once", ok: true },
  { name: "Ablations and negative controls", area: "Controls", result: "Latent heat = 0 drops the gain below zero; water-only invariance controls return zero difference.", status: "Done", ok: true },
  { name: "Capsule model, tank-level check", area: "Cross-check", result: "Frozen c = 5, F = 2 match Amanowicz and Turski 2025 to 1.1–1.4 K; fitted c = 5.03.", status: "Done (2026-11-14)", ok: true },
  { name: "OpenFOAM capsule check", area: "Cross-check", result: "Benchmarks not reproduced and mesh not converged: an unvalidated upper bound.", status: "Stopped at benchmark", ok: false },
  { name: "ANSYS Fluent", area: "Cross-check", result: "Four-PCM ordering consistent; whole-tank discharge and criteria study as a model-consistency check.", status: "Cross-check only", ok: true },
  { name: "Objective 3 contract", area: "Hand-off", result: "Environment contract v3 written for Rajasthan, Tamil Nadu and Uttarakhand.", status: "Written", ok: true },
  { name: "Experimental validation", area: "Validation", result: "No hardware or field data exist.", status: "Not done", ok: false },
];

export const O2_LIMITATIONS = [
  "Chosen designs sit at the edge of the search box (radius 39.5–40 mm, fraction 28–30%), so they are the best within the declared box, not a proven optimum.",
  "Sizing is 50 L with 1.5 m² (33.3 L/m²), below IS 12976:2023; the compact tank is a fixed condition of this work.",
  "The CFD cross-checks are not validation: OpenFOAM reproduces neither Tan 2009 nor Dong 2022, and Fluent is a 2-D planar proxy.",
  "Hold times come from frozen capsule constants and depend on where the capsule stack sits in the tank.",
  "Not modelled: monthly mains-temperature series, PCM volume change and supercooling delay.",
  "No hardware or field measurements exist, and the full end-to-end run (--stage all) has not been executed.",
];

export const O3_HANDOFF = [
  "<strong>Boundary:</strong> Objective 3 chooses only the real-time action; it cannot change the PCM, capsule geometry, tank volume, safety limits or physics model.",
  "<strong>State:</strong> top and bottom tank-node temperatures, a recoverable-energy estimate, minutes since the last draw, plus weather and demand.",
  "<strong>Action:</strong> charge, discharge or bypass, with an optional flow of 0.010–0.050 kg/s on a 150 s step.",
  "<strong>Safety shield:</strong> forces bypass at 72 °C (top node) and 62 °C (PCM), and clamps flow to the envelope.",
  "<strong>Weather split:</strong> train 2016–2020, validate 2021–2023; the held-out years were used by Objective 2 and must not be used to tune a controller.",
  "<strong>Status:</strong> contract v3 is written for Rajasthan, Tamil Nadu and Uttarakhand; Assam's file is not a valid input.",
];

/* Assam Objective 2 figure set — a LAYOUT PREVIEW, not results.
   Source: the Assam figure-set README (run_all_assam.py ->
   make_dummy_plots_assam.py). status: real | illustrative | pending. */
export const ASSAM_PREVIEW_FILTERS = [
  { id: "all", label: "All 40 figures" },
  { id: "real", label: "Real data (40)" },
];

export const ASSAM_PREVIEW_FIGS = [
  { n: 1, status: "real", title: "Gain–overheating trade-off per regime" },
  { n: 2, status: "real", title: "Dense-grid check of the optimiser" },
  { n: 3, status: "real", title: "Gain by year role (explore / select / held-out)" },
  { n: 4, status: "real", title: "Held-out comparison of PCMs" },
  { n: 5, status: "real", title: "Held-out null controls and costs" },
  { n: 6, status: "real", title: "Ablations of the provisional designs" },
  { n: 7, status: "real", title: "Surrogate model comparison" },
  { n: 8, status: "real", title: "Gain against PCM fraction" },
  { n: 9, status: "real", title: "Share of good designs on the box boundary" },
  { n: 10, status: "real", title: "Provisional designs table (500 L tank, 5 m² collector)" },
  { n: 11, status: "real", title: "Held-out-year gains" },
  { n: 12, status: "real", title: "Gain against PCM mass" },
  { n: 13, status: "real", title: "Time-step convergence" },
  { n: 14, status: "real", title: "Stratified-tank model check" },
  { n: 15, status: "real", title: "Active-learning search progress" },
  { n: 16, status: "real", title: "Optimiser seed stability" },
  { n: 17, status: "real", title: "Planned M4 DOE: 28 designs (not yet simulated)" },
  { n: 18, status: "real", title: "Screening ANOVA: share of gain variance" },
  { n: 19, status: "real", title: "Surrogate selection by regime" },
  { n: 20, status: "real", title: "Components of the run-to-run band" },
  { n: 21, status: "real", title: "Boundary re-test with a widened box" },
  { n: 22, status: "real", title: "Sensitivity blocks" },
  { n: 23, status: "real", title: "One-at-a-time controls from an interior anchor" },
  { n: 24, status: "real", title: "Arrangement comparison" },
  { n: 25, status: "real", title: "Gain split: shielded vs exposed capsule rows" },
  { n: 26, status: "real", title: "Delivered energy at 45 °C and night-serve duration" },
  { n: 27, status: "real", title: "Widened-bound diagnostic" },
  { n: 28, status: "real", title: "Sizing study (direction only)" },
  { n: 29, status: "real", title: "Input sensitivity of the provisional design" },
  { n: 30, status: "real", title: "Gain against flow rate" },
  { n: 31, status: "real", title: "Bayesian search against NSGA-II" },
  { n: 32, status: "real", title: "Gain at the 8 vertices of the search box" },
  { n: 33, status: "real", title: "B1 boundary re-test" },
  { n: 34, status: "real", title: "Night temperature hold, typical evening" },
  { n: 35, status: "real", title: "Capsule benchmark against the literature" },
  { n: 36, status: "real", title: "Grid check, all (regime, PCM) pairs" },
  { n: 40, status: "real", title: "CFD capsule melt curves" },
  { n: 41, status: "real", title: "Lumped capsule model against CFD" },
  { n: 42, status: "real", title: "CFD mesh convergence and freezing" },
  { n: 50, status: "real", title: "Weather inputs of the three Assam clusters (2016–2025)" },
];

export const ASSAM_PREVIEW_STATUS_TEXT = {
  real: "Real project data",
  illustrative: "Illustrative — placeholder values, not simulated",
  pending: "Pending — frame only, no numbers yet",
};
