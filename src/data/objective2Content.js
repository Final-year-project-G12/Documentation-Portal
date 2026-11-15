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
      "PCM beats the water-only tank in all three regimes; held-out 2011–2015 gains are 137.5 / 145.7 / 149.3 kWh/yr, far above the band.",
      "Peak PCM 64.1 °C and peak water 73.3 °C over every design and year, inside the 65 / 75 °C limits.",
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
      "All 9 held-out designs beat the plain tank; PCM peak 63.4–64.0 °C, water peak 72.2–72.9 °C.",
      "Held-out means are 284.2 / 223.3 / 269.9 kWh/yr, about 6–9 times the repeatability band of 26–30 kWh.",
      "In regime 0 RT57HC is 20.3 kWh higher than the chosen PureTemp 58, inside the 28.4 band, so the two are tied.",
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
      "PCM helps in regimes 0–2; in regime 3 (cold, high altitude) no design beats the water-only tank.",
      "Held-out 2024–2025 gains are 76.0 / 61.8 / 56.4 / −6.1 kWh/yr; peak PCM 64.2 °C, peak water 73.1 °C.",
      "In every regime the best other PCM is within the band of the chosen one, so the PCM choice is not decisive.",
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
      "RT44HC is selected in all three regimes (R_in 39.6–40.0 mm, fractions 27.4–29.1 %, 64 / 70 / 58 capsules).",
      "Select-year gains 118.2 / 126.9 / 98.4 and held-out 112.6 / 119.4 / 90.1 kWh/yr, against bands of 18.7–23.5.",
      "These values come from the supplied comparison table, not from a completed M6 optimisation or CFD validation.",
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
      "Objective 1's Top-3 PCMs per regime are a fixed shortlist; tank, collector and demand are fixed, not optimised.",
      "Limits: 75 °C water, 65 °C PCM. A design whose PCM peak exceeds 65 °C in any simulated year is infeasible.",
    ],
  },
  {
    title: "Design space and geometry",
    points: [
      "Variables: capsule inner radius (10–40 mm), PCM fraction (2–30% of the tank), flow (0.010–0.050 kg/s), arrangement (single-layer, staggered, radial).",
      "An exact packing check (passage fraction at least 0.05, spacing at least 3 mm) rejects impossible designs.",
    ],
  },
  {
    title: "Multi-node enthalpy simulator",
    points: [
      "A 10-node stratified tank with capsule enthalpy, a flat-plate collector and a 150 s step (300 s failed the convergence check).",
      "A simulated year takes seconds, so thousands of designs are affordable; CFD for every design is not.",
    ],
  },
  {
    title: "Paired metrics",
    points: [
      "Every gain is a paired difference against a water-only tank at the same flow, weather year and demand.",
      "g_window: extra energy delivered at or above 45 °C between 18:00 and 09:00 per year. Gains smaller than the repeatability band are ties.",
    ],
  },
  {
    title: "Screening and DOE",
    points: [
      "A Taguchi L9 screening with ANOVA shows which variables matter: PCM amount most, flow least {{cite:Chen2025TaguchiGRAPCM}}.",
      "A 128-point Sobol DOE {{cite:Sobol1967}} then covers the box for every pair (Rajasthan: 1,152 designs, 1,089 valid). Years: explore 2016–2020, select 2021–2023, held-out 2011–2015 (Uttarakhand 2024–2025).",
    ],
  },
  {
    title: "Surrogate comparison",
    points: [
      "A neural-network ensemble, XGBoost and a quadratic RSM compete per pair (Tamil Nadu compares five); the winner ranks and proposes designs.",
      "The simulator evaluates every reported number.",
    ],
  },
  {
    title: "NSGA-II with active learning",
    points: [
      "NSGA-II {{cite:Deb2002NSGA2}} minimises −g_window, −g_annual and d_overheat on the surrogate; active learning simulates the 10 designs where the models disagree most, then refits.",
      "A dense grid (720 simulator runs per regime) confirms the search result is as good as the grid within the band.",
    ],
  },
  {
    title: "Selection and one-shot held-out test",
    points: [
      "Candidates within the band of the best g_window form a tied set; a fixed funnel on overheating, PCM mass, capsule count and temperature margin picks one.",
      "The held-out test covers the chosen design and the best design of every other shortlisted PCM, once, under a lock.",
    ],
  },
];

export const RESEARCH_QUESTIONS = [
  {
    q: "PCM or plain tank?",
    detail: "Does the Objective 1 PCM beat a water-only tank at the same flow under the 75 °C and 65 °C limits?",
    finding: "Yes on the window metric in all three Rajasthan and all three Tamil Nadu regimes and in three of four Uttarakhand regimes.",
  },
  {
    q: "How much longer does hot water last?",
    detail: "Hold time at or above 45 °C after charging stops (300 L/day, capped at 72 h).",
    finding: "Rajasthan: 52–59 h with the PCM against 44–50 h for the same-volume water-only tank, about 8.6 to 10.3 h longer.",
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
    finding: "No.",
  },
  {
    q: "Why does Objective 3 need a controller?",
    detail: "Is the case for control seasonal re-ranking of the PCM, or hour-by-hour operation?",
    finding: "Hour-by-hour operation.",
  },
];

/* Tamil Nadu regime 0 criteria study (ansys/CRITERIA_STUDY_README.md). */
export const CRITERIA_STUDY = [
  { id: "c0", label: "Optimal (chosen)", rin: "40 mm", n: "104", pcmKg: "24.8", flow: "0.039", arrangement: "staggered", gWindow: 276.6, pct: 100, verdict: "Selected design: the S0/S1/S2 funnel winner.", water: "30.0 → 35.5 °C", lf: "1.00 → 0.38", heat: 6135 },
  { id: "c1", label: "Everything at maximum", rin: "40 mm", n: "105", pcmKg: "25.1", flow: "0.050", arrangement: "staggered", gWindow: 283.3, pct: 102, verdict: "Statistically tied (+6.7 kWh, inside the 28.4 band); loses the final tie-break on PCM mass (25.05 vs 24.81 kg).", water: "30.0 → 35.5 °C", lf: "1.00 → 0.38", heat: 6135 },
  { id: "c3", label: "Works, not optimal", rin: "40 mm", n: "80", pcmKg: "19.1", flow: "0.023", arrangement: "staggered", gWindow: 187.5, pct: 68, verdict: "Beats plain water, but eliminated at S0 (too far below the best g_window).", water: "30.0 → 34.1 °C", lf: "1.00 → 0.38", heat: 4785 },
  { id: "c6", label: "50% of the capsules", rin: "40 mm", n: "52", pcmKg: "12.4", flow: "0.039", arrangement: "staggered", gWindow: 148.5, pct: 54, verdict: "Beats plain water, but eliminated at S0.", water: "30.0 → 32.7 °C", lf: "1.00 → 0.36", heat: 3245 },
  { id: "c4", label: "Only 30 capsules", rin: "40 mm", n: "30", pcmKg: "7.2", flow: "0.039", arrangement: "staggered", gWindow: 83.6, pct: 30, verdict: "Beats plain water, but eliminated at S0.", water: "30.0 → 31.6 °C", lf: "1.00 → 0.32", heat: 2050 },
  { id: "c5", label: "10% of the capsules", rin: "40 mm", n: "10", pcmKg: "2.4", flow: "0.039", arrangement: "staggered", gWindow: 26.9, pct: 10, verdict: "Eliminated at Rule A: the gain is inside the noise band, so no better than a plain tank.", water: "30.0 → 30.5 °C", lf: "1.00 → 0.21", heat: 709 },
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
      "The CFD reaches 50% melt in about 1,000 s; the simple model needs 6,376 s. The mesh study is not grid-independent (40 → 80 cells moves t50 by +14.3%).",
      "Neither Tan 2009 {{cite:Tan2009}} nor Dong 2022 {{cite:Dong2022}} is reproduced (the CFD melts about 1.6–2 times faster), so the CFD is reported as an unvalidated upper bound and the frozen capsule constants c = 5, F = 2 stay.",
    ],
    figures: [
      { file: "rajasthan/fig40_of_melt_curves.png", title: "OpenFOAM melt curves", caption: "Capsule melt fraction in the OpenFOAM cases." },
      { file: "rajasthan/fig41_of_lumped_vs_cfd.png", title: "Simple model vs CFD", caption: "Simple (lumped) capsule model against the CFD melt curve." },
      { file: "rajasthan/fig42_of_mesh_and_freeze.png", title: "Mesh study and freezing case", caption: "Mesh refinement and a freezing case; the mesh study is not converged." },
      { file: "rajasthan/openfoam/calib_r0_n40.png", title: "Capsule melt fraction, 40-cell mesh", caption: "OpenFOAM against the simple capsule model (frozen c = 5, F = 2 and fitted)." },
      { file: "rajasthan/openfoam/of_v0_benchmark.png", title: "Benchmark V0: Tan 2009 sphere", caption: "OpenFOAM against the Tan 2009 experiment and Fluent; the CFD melts faster." },
      { file: "rajasthan/openfoam/of_v1_benchmark.png", title: "Benchmark V1: Dong 2022 sphere", caption: "Same check against Dong 2022; not reproduced." },
      { file: "rajasthan/openfoam/preview_r0_charge_70_n40.png", title: "Design capsule, charging (3-D view)", caption: "Regime 0 capsule charging at a 70 °C wall, 1,200 s (the 2-D axisymmetric result revolved)." },
      { file: "rajasthan/openfoam/preview_r0_discharge_mains_n40.png", title: "Design capsule, discharging to mains water", caption: "Regime 0 capsule releasing heat to mains-temperature water." },
      { file: "rajasthan/openfoam/v0_T_003000.png", title: "Benchmark capsule temperature, 3000 s", caption: "Temperature field in the Tan 2009 benchmark sphere." },
      { file: "rajasthan/openfoam/video_r0_charge.gif", title: "Animation: capsule charging at 70 °C", caption: "Liquid fraction (left), temperature (right)." },
      { file: "rajasthan/openfoam/video_r0_discharge.gif", title: "Animation: capsule discharging to mains water", caption: "Liquid fraction (left), temperature (right)." },
    ],
  },
  {
    id: "tn",
    group: "ansys",
    label: "Tamil Nadu case",
    status: "Model-consistency cross-check",
    points: [
      "Four PCMs in one Ø 42 mm capsule (30 °C solid in 70 °C water, 6 h, Coupled solver with first-order upwind): melt fraction 0.60 (C25) / 0.50 (C26) / 0.47 (RT57HC) / 0.38 (PureTemp 58), no divergences. The order follows melting point and conductivity; first-order upwind makes absolute values conservative.",
      "Flow sweep (new, C26, same mesh and settings): melt fraction at 6 h is 0.394 / 0.491 / 0.512 at 0.010 / 0.030 / 0.050 kg/s. More flow melts more, but the gain flattens above 0.030 kg/s.",
      "Criteria study: the 7 designs of the comparison above run as a 60-minute whole-tank discharge (capsules melted at 70 °C, water 30 °C, no sun; a 2-D slice with N × 34/104 capsules). The chosen design warms the water from 30.0 to 35.5 °C and the liquid fraction falls to 0.38; 10% of the capsules reach only 30.5 °C.",
      "Discharge demos (new): the capsule is melted, then cooled in mains-temperature water. Single capsules for regimes 0 / 1 / 2 (PureTemp 58, RT57HC, RT57HC) and a whole-tank case of 34 capsules (regime 0, PureTemp 58, 2 h of discharge) show the PCM giving its heat back.",
      "Regime contours (new): liquid-fraction and temperature fields for the regime 0, 1 and 2 capsules, each at its own geometry and flow. They compare capsule designs, not climates.",
      "Fluent never chooses a design and is not experimental validation.",
    ],
    figures: [
      { file: "tamilnadu/fluent/03_pcm_melt_comparison.png", title: "PCM melting comparison", caption: "Four shortlisted PCMs under identical settings." },
      { file: "tamilnadu/fluent/v7_v8_melt_history.png", title: "Melt history: PCMs and flow sweep", caption: "Liquid fraction of the capsule over 6 h for four PCMs (left) and three flow rates (right)." },
      { file: "tamilnadu/fluent/01_system_mesh_zones.png", title: "System model zones", caption: "Tank water, PCM, capsule shell, collector channel, absorber and riser." },
      { file: "tamilnadu/fluent/02_system_temperature_field.png", title: "System temperature field", caption: "Daytime heat path from the absorber into the tank water." },
      { file: "tamilnadu/fluent/FLUENT_comparison_all_criteria.png", title: "Seven designs, whole-tank discharge", caption: "Water temperature, PCM temperature and liquid fraction over 60 minutes." },
      { file: "tamilnadu/fluent/SUMMARY_all_criteria.png", title: "Summary of the seven designs", caption: "Gain and Fluent heat delivered for each design." },
      { file: "tamilnadu/fluent/tank_discharge/tank_regime0_puretemp58_temp_START.png", title: "Whole-tank discharge: temperature at start", caption: "Regime 0, PureTemp 58, 34 capsules; capsules start melted." },
      { file: "tamilnadu/fluent/tank_discharge/tank_regime0_puretemp58_temp_END.png", title: "Whole-tank discharge: temperature after 2 h", caption: "The water has taken up heat from the capsules." },
      { file: "tamilnadu/fluent/tank_discharge/tank_regime0_puretemp58_liqfrac_END.png", title: "Whole-tank discharge: liquid fraction after 2 h", caption: "Capsules partly re-solidified after 2 h of discharge." },
      { file: "tamilnadu/fluent/discharge/regime0_puretemp58_temp_START.png", title: "Capsule discharge, regime 0: start", caption: "Single capsule, PureTemp 58, temperature." },
      { file: "tamilnadu/fluent/discharge/regime0_puretemp58_liqfrac_END.png", title: "Capsule discharge, regime 0: end", caption: "Liquid fraction after discharge." },
      { file: "tamilnadu/fluent/discharge/regime1_rt57hc_liqfrac_END.png", title: "Capsule discharge, regime 1: end", caption: "Single capsule, RT57HC, liquid fraction after discharge." },
      { file: "tamilnadu/fluent/discharge/regime2_rt57hc_liqfrac_END.png", title: "Capsule discharge, regime 2: end", caption: "Single capsule, RT57HC, liquid fraction after discharge." },
      { file: "tamilnadu/fluent/regime_contours/regime0_PureTemp58_liqfrac.png", title: "Regime 0 capsule: liquid fraction", caption: "PureTemp 58 at the regime 0 geometry and flow." },
      { file: "tamilnadu/fluent/regime_contours/regime0_PureTemp58_temp.png", title: "Regime 0 capsule: temperature", caption: "PureTemp 58 at the regime 0 geometry and flow." },
      { file: "tamilnadu/fluent/regime_contours/regime1_RT57HC_liqfrac.png", title: "Regime 1 capsule: liquid fraction", caption: "RT57HC at the regime 1 geometry and flow." },
      { file: "tamilnadu/fluent/regime_contours/regime2_RT57HC_liqfrac.png", title: "Regime 2 capsule: liquid fraction", caption: "RT57HC at the regime 2 geometry and flow." },
    ],
    videos: [
      { file: "tamilnadu/fluent/COMPARE_temperature_all_criteria.mp4", title: "All designs: temperature", caption: "The seven designs side by side." },
      { file: "tamilnadu/fluent/COMPARE_liquid_fraction_all_criteria.mp4", title: "All designs: liquid fraction", caption: "The seven designs side by side." },
      { file: "tamilnadu/fluent/criteria_0_optimal_reference.mp4", title: "Optimal design", caption: "104 capsules, 40 mm, 0.039 kg/s." },
      { file: "tamilnadu/fluent/criteria_1_max_all.mp4", title: "Everything at maximum", caption: "105 capsules, 0.050 kg/s; statistically tied." },
      { file: "tamilnadu/fluent/criteria_2_min_all.mp4", title: "Everything at minimum", caption: "380 capsules of 10 mm; almost no melt." },
      { file: "tamilnadu/fluent/criteria_3_ok_not_optimal.mp4", title: "Works, not optimal", caption: "80 capsules." },
      { file: "tamilnadu/fluent/criteria_6_50pct_of_optimal.mp4", title: "50% of the capsules", caption: "52 capsules." },
      { file: "tamilnadu/fluent/criteria_4_only_30_capsules.mp4", title: "Only 30 capsules", caption: "30 capsules." },
      { file: "tamilnadu/fluent/criteria_5_10pct_of_optimal.mp4", title: "10% of the capsules", caption: "10 capsules." },
    ],
  },
];

/* Plot gallery: same core figures per state. */
export const O2_PLOTS = [
  { num: "fig10", file: "fig10_chosen_designs.png", title: "Chosen designs", caption: "Frozen design per regime with select-year and held-out gains and the band." },
  { num: "fig4", file: "fig4_heldout_pcm_comparison.png", title: "Held-out: chosen PCM vs other PCMs", caption: "Does the Objective 1 PCM matter? Red is the chosen PCM; the dashed line is the repeatability band." },
  { num: "fig11", file: "fig11_heldout_by_year.png", title: "Held-out gain by year", caption: "Gain of the chosen design in every held-out year." },
  { num: "fig1", file: "fig1_front_vs_grid.png", title: "Search front vs dense grid", caption: "Final NSGA-II front against the 720-run dense grid." },
  { num: "fig6", file: "fig6_ablations.png", title: "Ablations and controls", caption: "Latent heat = 0 drops the gain below zero, so the metric responds to the PCM." },
  { num: "fig8", file: "fig8_fraction_response.png", title: "Response to PCM fraction", caption: "The gain is still rising at the 30% cap." },
];

/* Assam's legacy chain: only the figures built from real Assam files (FIGURE_STATUS.csv); the others are placeholders. */
export const O2_ASSAM_PLOTS = [
  { num: "fig4", file: "fig4_heldout_pcm_comparison.png", title: "Best design per PCM (legacy)", caption: "Best re-simulated design per PCM; one medoid year, no held-out years." },
  { num: "fig2", file: "fig2_g9_grid_check.png", title: "Optimiser vs simulated DOE (legacy)", caption: "Best optimiser candidate against the best simulated DOE case." },
  { num: "fig7", file: "fig7_surrogate_comparison.png", title: "Surrogate accuracy (legacy)", caption: "Phase 6 surrogate against the simulator." },
  { num: "fig13", file: "fig13_timestep_convergence.png", title: "Simulator verification (partly real)", caption: "Time-step and verification checks from Assam's M2 files." },
];

export const O2_LIMITATIONS = [
  "Chosen designs sit at the edge of the search box (radius 39.5–40 mm, fraction 28–30%), so they are the best within the declared box, not a proven optimum.",
  "Sizing is 50 L with 1.5 m² (33.3 L/m²), below IS 12976:2023 {{cite:BIS2023IS12976}}; the compact tank is a fixed condition of this work.",
  "The CFD cross-checks are not validation: OpenFOAM reproduces neither Tan 2009 {{cite:Tan2009}} nor Dong 2022 {{cite:Dong2022}}, and Fluent is a 2-D planar proxy.",
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
  { n: 6, status: "real", title: "Ablations of the designs" },
  { n: 7, status: "real", title: "Surrogate model comparison" },
  { n: 8, status: "real", title: "Gain against PCM fraction" },
  { n: 9, status: "real", title: "Share of good designs on the box boundary" },
  { n: 10, status: "real", title: "Designs table (500 L tank, 5 m² collector)" },
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
  { n: 29, status: "real", title: "Input sensitivity of the design" },
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

/* ─────────────────────────────────────────────────────────
   Parameter flow chart: how each design parameter goes from its starting range to its final value.
   Starting ranges and stage settings: configs/design_space.yaml and scripts/g8_s1_screening.py,
   g8_s2_doe.py, g9_s4_s5.py, g9_s6_grid.py. Final values: results/g10_selection_r*.json
   (Assam: results/phase7_deployable_design_per_regime.csv). Regimes are listed in order.
   ───────────────────────────────────────────────────────── */

export const O2_FLOW_STATES = [
  { id: "rajasthan", label: "Rajasthan", sub: "3 regimes" },
  { id: "tamilnadu", label: "Tamil Nadu", sub: "3 regimes" },
  { id: "uttarakhand", label: "Uttarakhand", sub: "4 regimes" },
  { id: "assam", label: "Assam", sub: "Legacy chain" },
];

export const O2_FLOW_STAGES = ["Start", "Geometry check", "Taguchi L9", "Sobol DOE", "NSGA-II + active learning", "Dense grid", "Selection funnel", "Final value"];

export const O2_FLOW_LANES = [
  {
    name: "PCM thickness",
    cells: ["10–40 mm", "outer Ø = 2 × (R + 0.8 mm)", "10 / 25 / 40 mm", "continuous", "continuous", "6 levels", "one value"],
    final: {
      rajasthan: "39.5 · 40.0 · 40.0 mm",
      tamilnadu: "40.0 · 40.0 · 40.0 mm",
      uttarakhand: "39.8 · 39.3 · 39.7 · 38.4 mm",
      assam: "20.7 · 21.4 · 20.7 mm (diameter / 2)",
    },
  },
  {
    name: "PCM amount (capsule count)",
    cells: ["2–30 %", "N = clip(round(f × V_tank / V_capsule))", "2 / 16 / 30 %", "continuous", "continuous", "8 levels", "one value"],
    final: {
      rajasthan: "28.4 · 29.6 · 29.6 %  (N = 52 · 52 · 52)",
      tamilnadu: "29.6 · 27.9 · 29.9 %  (N = 104 · 98 · 105)",
      uttarakhand: "26.3 · 29.7 · 30.0 · 2.0 %  (N = 47 · 55 · 54 · 4)",
      assam: "1.6 · 1.7 · 1.6 %  (N = 22 · 20 · 22)",
    },
  },
  {
    name: "Flow rate",
    cells: ["0.010–0.050 kg/s", "checked against the pump range", "0.010 / 0.030 / 0.050", "continuous", "continuous", "5 levels", "one value"],
    final: {
      rajasthan: "0.0155 · 0.0493 · 0.0236 kg/s",
      tamilnadu: "0.0388 · 0.0295 · 0.0267 kg/s",
      uttarakhand: "0.0194 · 0.0314 · 0.0199 · 0.0100 kg/s",
      assam: "0.0122 · 0.0148 · 0.0116 kg/s",
    },
  },
  {
    name: "Capsule arrangement",
    cells: ["3 packing models", "spacing ≥ 3 mm, free flow ≥ 5 %", "3 arrangements", "one of 3", "one of 3", "3 arrangements", "one value"],
    final: {
      rajasthan: "staggered · single-layer · single-layer",
      tamilnadu: "staggered · staggered · staggered",
      uttarakhand: "staggered · single-layer · single-layer · single-layer",
      assam: "staggered only (its sole option)",
    },
  },
];
