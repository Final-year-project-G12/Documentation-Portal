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
  { value: "3 + 1", label: "States on the current method, plus Assam on a legacy chain" },
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
    status: "Legacy chain, not reconciled with the current method",
    current: false,
    setup: [
      { value: "50 L", label: "Tank (1.5 m² collector)" },
      { value: "100 L/day", label: "Hot-water demand" },
      { value: "45 °C", label: "Delivery target" },
      { value: "None", label: "Held-out test" },
    ],
    summary: [
      "Still runs the earlier chain: a single-node tank with a 300 s step, Latin Hypercube Sampling {{cite:McKayBeckmanConover1979LHS}}, an ExtraTrees surrogate {{cite:Geurts2006ExtraTrees}} and a random-search script.",
      "Inputs come from an older 129-point Objective 1 grid; its shortlist (savE® OM48 / OM50 / OM46) was ranked by a physics model, not by Objective 1's MCDM.",
      "Phase 7 designs exceed the 65 °C PCM limit by 1.1–5.0 °C (peaks 66.1 / 67.7 / 70.0 °C), and plain water beat every PCM option in the Phase 4 gate.",
      "Phase 8 re-simulates each design with 100 Monte Carlo draws {{cite:Chopra2023MonteCarloETC}} but reads P(temp-safe) 0.13 / 0.02 / 0.00 against 0.95, so it is not a valid Objective 3 input.",
      "Its Phase 7 report prints \"PASSED\" because it tests 95 °C water and 90 °C PCM limits, not the frozen 75 °C and 65 °C. There is no NSGA-II, no held-out test and no lock file.",
    ],
    regimes: [],
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

