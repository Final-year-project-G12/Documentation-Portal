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

