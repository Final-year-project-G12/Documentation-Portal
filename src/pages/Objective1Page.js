import { useState } from "react";
import Figure from "../components/Figure";
import Bullets from "../components/Bullets";
import PipelineSection from "../components/PipelineSection";
import { Terms } from "../components/Terms";
import { resetTerms } from "../data/terms";

/* ─────────────────────────────────────────────────────────
   Objective 1 — Climate-Region-Aware PCM Recommendation
   Final Year Project — Group 12 | Department of CSE
   ───────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────
   Slide 15: Cross-State Preprocessing & QC Verification Summary
   ───────────────────────────────────────────────────────── */
const PREPROCESSING_SUMMARY = [
  {
    state: "Tamil Nadu",
    tag: "Lead State",
    gridPoints: 133,
    inputRecords: "1,457,547",
    outputRecords: "1,445,577",
    retention: "99.2%",
    inputDims: 36,
    outputDims: 89,
    engineeredFeatures: 45,
    missingRate: "0.00%",
    status: "PASS",
  },
  {
    state: "Rajasthan",
    tag: "Arid Belt",
    gridPoints: 320,
    inputRecords: "3,506,880",
    outputRecords: "3,478,080",
    retention: "99.2% (28,800 lag warm-up rows dropped)",
    inputDims: 37,
    outputDims: 90,
    engineeredFeatures: 53,
    missingRate: "0.00% (1.15% of cells imputed)",
    status: "PASS",
  },
  {
    state: "Assam",
    tag: "Subtropical",
    gridPoints: 80,
    inputRecords: "1,413,420",
    outputRecords: "1,402,101",
    retention: "99.2%",
    inputDims: 36,
    outputDims: 91,
    engineeredFeatures: 45,
    missingRate: "0.00%",
    status: "PASS",
  },
  {
    state: "Uttarakhand",
    tag: "Montane",
    gridPoints: 45,
    inputRecords: "493,155",
    outputRecords: "489,105",
    retention: "99.2% (4,050 lag warm-up rows dropped)",
    inputDims: 37,
    outputDims: 90,
    engineeredFeatures: 53,
    missingRate: "0.00% (2.86% of cells imputed)",
    status: "PASS",
  },
];

/* ─────────────────────────────────────────────────────────
   State-Specific Definitions & Interactive Plots
   ───────────────────────────────────────────────────────── */
const STATES_CONFIG = {
  rajasthan: {
    name: "Rajasthan",
    short: "RJ",
    climateType: "Hot Arid & Semi-Arid (Western India) · Reference state",
    tag: "320 Grid Points · k=3 Regimes · 62-PCM database",
    stats: [
      { value: "320", label: "Population-Weighted Points (87.5% population coverage)" },
      { value: "−0.20 / −0.17 / +0.57", label: "Spearman ρ, MCDM rank vs. simulated rank" },
      { value: "k=3", label: "GMM Regimes (medoids Udaipur / Nagaur / Jaipur)" },
      { value: "4 / 8 / 11", label: "Calibrated Survivors per Cluster (23 of 62; 0 at κ = 0.7)" },
      { value: "1.00 / 0.77 / 0.42", label: "Kendall's W per Cluster (C2 below 0.6)" },
      { value: "OM55 / PureTemp 60 / Palmitic-stearic–EG", label: "Borda Rank-1 Pick (C0 / C1 / C2)" },
    ],
    overview: [
      "Rajasthan is the reference state: its pipeline is the most complete and most recently corrected.",
      "320 population-weighted points are clustered into three regimes with a diagonal-covariance Gaussian Mixture Model {{cite:Schwarz1978BIC,Rousseeuw1987Silhouettes}}.",
      "Targets use the corrected design basis: 60 °C delivery plus a 7 K approach gives Tm_target = 67 °C.",
      "Scoring uses the per-cluster capped target of 55.5 / 61.1 / 59.2 °C.",
      "At the nominal latent-heat factor κ = 0.7, no candidate survives in any cluster.",
      "So κ is calibrated per cluster, leaving 4 / 8 / 11 survivors out of 62 candidates.",
    ],
    spearmanSummary: "C0: −0.200 · C1: −0.168 · C2: +0.569",
    verdict: "Negative in 2 of 3 clusters",
    verdictSub: "Partial agreement in C2; physics-tested, not physics-confirmed",
    notes: [
      {
        label: "Design basis",
        points: [
          "L_required = SHARE_PCM · Q_night / m_PCM, with SHARE_PCM = 0.5 (published range 0.4–0.78) {{cite:Zhao2022PCMShare,Huang2020PCMVolumeRatio,Abdelsalam2020PCMStorageVolume,Kozelj2021PCMFraction}}.",
          "This gives L_required = 438 / 427 / 443 kJ/kg for C0 / C1 / C2.",
          "The delivery temperature was raised from 50 to 60 °C: the 300 L / 7 h night-delivery benchmark is reported at 60 ± 2 °C {{cite:MadadiAvargani2021}}.",
          "That moved Tm_target from 57 to 67 °C and L_required from 285–344 to 410–469 kJ/kg.",
          "Caveat: the benchmark system uses circular-trough collectors, so the 300 L figure is a demand-scale reference, not a flat-plate performance benchmark.",
        ],
      },
      {
        label: "Latent-heat calibration",
        points: [
          "The latent-heat floor is κ · L_required.",
          "Calibrated κ is 0.0 / 0.5 / 0.3, which leaves 4 / 8 / 11 survivors.",
          "Cluster 0 ends at κ = 0.0 with an undersized pool (n = 4, status insufficient_even_at_kappa_0).",
          "Only 4 of 62 candidates clear the melting-window and charging-feasibility gates there, whatever κ is.",
          "So the small pool reflects the cluster's climate, not a calibration artefact.",
          "Caveat: its Top-3 carries more sampling noise than the other two.",
        ],
      },
      {
        label: "Ranking",
        points: [
          "Eight criteria are scored with a 50/50 blend of Shannon-entropy weights {{cite:Shannon1948Communication}} and fixed prior weights.",
          "Caveat: the prior half was not elicited by pairwise comparison, so the weights are not AHP-derived.",
          "Candidates are ranked by TOPSIS {{cite:HwangYoon1981MADM}}, PROMETHEE II {{cite:BransVincke1985PROMETHEE}}, VIKOR {{cite:OpricovicTzeng2004VIKOR}} and GRA {{cite:Deng1982GreySystems}}.",
          "A Borda count combines the ranks, with a Copeland cross-check.",
          "Cluster 2's Borda and Copeland orderings disagree on Top-3 membership.",
        ],
      },
      {
        label: "Physics check (negative or partial)",
        points: [
          "Spearman ρ between the MCDM rank and the simulated annual solar fraction is −0.200 (C0, n = 4), −0.168 (C1, n = 8) and +0.569 (C2, n = 11).",
          "The tank model uses 200 kg of water {{cite:Eldokaishi2022ANN_PCM_SWH}}.",
          "Its loss and isolation parameters were retuned jointly, so the plain-tank solar fraction lands in the 54–84% literature band {{cite:Singh2025PCMSWH}} (64.3 / 65.8 / 64.0% at the three medoids).",
          "Caveat: the Top-3 candidates inside each cluster differ by under about 1 percentage point of solar fraction, so the physics model barely separates them.",
          "So the MCDM ordering is physics-tested, not physics-confirmed.",
        ],
      },
      {
        label: "Re-run check (2026-10-25)",
        points: [
          "The Rajasthan pipeline was re-run from preprocessing through the recommendation cards (11:27–11:44).",
          "It reproduced every figure on this page: survivors 4 / 8 / 11, Rank-1 picks, Kendall's W and Spearman ρ.",
          "The plots on this page were last regenerated 2026-09-28 and match the unchanged data.",
        ],
      },
      {
        label: "Open items",
        points: [
          "The mains-water temperature is a placeholder (ambient mean minus 2 °C), pending a ground-temperature annual-lag model {{cite:Kusuda1965EarthTemperature}}.",
          "Imputed properties (thermal conductivity, densities, specific heats) appear in each Top-3.",
          "They are listed in the recommendation cards.",
        ],
      },
    ],
    recommendations: [
      {
        cluster: "Cluster 0 — Southern plateau (Udaipur medoid)",
        pcm: "savE® OM55 (PLUSS)",
        tm: "55.0°C",
        latentHeat: "188 kJ/kg",
        mc: "W = 1.00",
        region: "109 points · 21.8 M people · n = 4 pool",
      },
      {
        cluster: "Cluster 1 — Hot, steady-solar (Nagaur medoid)",
        pcm: "PureTemp 60",
        tm: "61.0°C",
        latentHeat: "220 kJ/kg",
        mc: "W = 0.77",
        region: "83 points · 14.0 M people · n = 8 pool",
      },
      {
        cluster: "Cluster 2 — North-east (Jaipur medoid)",
        pcm: "Palmitic-stearic acid / expanded graphite",
        tm: "55.2°C",
        latentHeat: "176 kJ/kg",
        mc: "W = 0.42",
        region: "128 points · 34.5 M people · n = 11 pool",
      },
    ],
    plots: [
      {
        id: "rj-01",
        num: "01",
        title: "Raw vs. Preprocessed Radiation (Rajasthan)",
        desc: "GHI and ambient temperature before and after preprocessing at point RJP_0001. GHI is not Hampel-filtered, because cloud-driven dips are real physical variation {{cite:Hampel1974InfluenceCurve}}.",
        interactive: "01_raw_vs_preprocessed_radiation_interactive.html",
        static: "01_raw_vs_preprocessed_radiation.png",
        phase: "Phase 2–3 Preprocessing",
      },
      {
        id: "rj-02",
        num: "02",
        title: "Climate Regime Map (GMM k=3)",
        desc: "320 population-weighted points assigned to three regimes by a diagonal-covariance GMM.",
        interactive: "02_climate_regime_map_interactive.html",
        static: "02_climate_regime_map.png",
        phase: "Phase 4 Clustering",
      },
      {
        id: "rj-07a",
        num: "07a",
        title: "Bump Chart — MCDM Ranks (Cluster 0)",
        desc: "Each candidate's rank under TOPSIS, GRA, PROMETHEE II and VIKOR, and the Borda consensus (Cluster 0, 4 candidates).",
        interactive: "07_bump_chart_ranks_cluster_0.html",
        static: "07_bump_chart_ranks_cluster_0.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "rj-07b",
        num: "07b",
        title: "Bump Chart — MCDM Ranks (Cluster 1)",
        desc: "Rank trajectories for the 8 Cluster 1 candidates. PureTemp 60 is first in the consensus; GRA ranks RT57HC first, which is why W is 0.77, not 1.",
        interactive: "07_bump_chart_ranks_cluster_1.html",
        static: "07_bump_chart_ranks_cluster_1.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "rj-07c",
        num: "07c",
        title: "Bump Chart — MCDM Ranks (Cluster 2)",
        desc: "Rank trajectories for the 11 Cluster 2 candidates, where method agreement is weakest (W = 0.42).",
        interactive: "07_bump_chart_ranks_cluster_2.html",
        static: "07_bump_chart_ranks_cluster_2.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "rj-08",
        num: "08",
        title: "Method Rank Correlation Heatmap",
        desc: "Pairwise rank correlation between the four MCDM methods.",
        interactive: "08_method_rank_correlation_heatmap_interactive.html",
        static: "08_method_rank_correlation_heatmap.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "rj-10",
        num: "10",
        title: "Rank-Reversal Frequency",
        desc: "How often pairs of candidates swap order under perturbed weights and properties.",
        interactive: "10_rank_reversal_violin_interactive.html",
        static: "10_rank_reversal_violin_bar.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "rj-11",
        num: "11",
        title: "Agreement Plot — Simulated vs. MCDM Rank",
        desc: "Simulated performance rank against MCDM consensus rank per cluster. Points on the dashed line would mean full agreement; Cluster 0 and 1 points scatter widely (ρ = −0.200 and −0.168).",
        interactive: "11_agreement_plot_interactive.html",
        static: "11_agreement_plot.png",
        phase: "Phase 7 Physics",
      },
      {
        id: "rj-12",
        num: "12",
        title: "Tank Temperature & Melt-Fraction Profile",
        desc: "Simulated tank temperature and PCM melt fraction over a day from the lumped-enthalpy model.",
        interactive: "12_tank_temperature_melt_fraction_interactive.html",
        static: "12_tank_temperature_melt_fraction.png",
        phase: "Phase 7 Physics",
      },
    ],
  },

  tamilnadu: {
    name: "Tamil Nadu",
    short: "TN",
    climateType: "Tropical Maritime & Semi-Arid (Southern India)",
    tag: "133 Grid Points · k=3 Regimes · re-run 2026-10-25",
    stats: [
      { value: "133", label: "Population-Weighted Points (87.5% population coverage)" },
      { value: "−0.33 / +0.10 / +0.02", label: "Spearman ρ, MCDM rank vs. simulated rank" },
      { value: "k=3", label: "GMM Regimes (auto-selected; forced k=5 reverted)" },
      { value: "8 / 10 / 8", label: "Calibrated Survivors per Cluster (26 of 62)" },
      { value: "0.85 / 0.48 / 0.78", label: "Kendall's W per Cluster (C1 below 0.6)" },
      { value: "RT57HC", label: "Borda Rank-1 Pick (all three clusters)" },
    ],
    overview: [
      "Tamil Nadu uses the same shared design basis as Rajasthan: 60 °C delivery, Tm_target = 67 °C, SHARE_PCM = 0.5.",
      "The calculation assumes a 300 L/day draw.",
      "133 population points are clustered into three regimes with a diagonal-covariance GMM.",
      "A forced five-cluster run was tried and reverted: it scored worst of k = 2–5 on silhouette and bootstrap ARI {{cite:Schwarz1978BIC,Rousseeuw1987Silhouettes}}.",
      "RT57HC is the Borda #1 in every cluster, which the project flags for an independent sanity check.",
    ],
    spearmanSummary: "C0: −0.333 · C1: +0.103 · C2: +0.024",
    verdict: "Weak, not significant",
    verdictSub: "n = 8–10 per cluster; Phase 7 uses a 50 °C delivery constant",
    notes: [
      {
        label: "Code mismatch to be aware of",
        points: [
          "Phase 3 imports the shared <code>T_DELIVERY_C = 60.0</code> (Tm_target = 67 °C).",
          "This state's <code>10_physics_validation.py</code> still hard-codes <code>T_DELIVERY_C = 50.0</code> (line 164).",
          "So the Phase 3 targets and the Phase 7 simulator use different delivery temperatures.",
          "Read the Phase 7 results with that in mind.",
          "The code has not been changed.",
        ],
      },
      {
        label: "Results on disk (outputs regenerated 2026-10-25)",
        points: [
          "Calibrated survivors are 8 / 10 / 8.",
          "L_required in the ranking files is 406 / 438 / 406 kJ/kg.",
          "Borda #1 is RT57HC in all clusters.",
          "n-Hexacosane (C26) is second in C0 and C1; n-Pentacosane (C25) is second in C2.",
          "Kendall's W is 0.848 / 0.477 / 0.780.",
          "So Cluster 1's choice is genuinely ambiguous.",
        ],
      },
      {
        label: "Physics check (weak, not significant)",
        points: [
          "Spearman ρ is −0.333 (C0, n = 8), +0.103 (C1, n = 10) and +0.024 (C2, n = 8), mean −0.069.",
          "None is statistically significant.",
          "Of 26 simulations, 9 fall in the 54–84% solar-fraction band {{cite:Singh2025PCMSWH}}; the range is 29.5–85.5%.",
          "Earlier project documents and the conference paper quote C0 ρ = +0.381 and a mean of +0.169.",
          "The present outputs do not reproduce that figure.",
        ],
      },
      {
        label: "Preprocessing",
        points: [
          "ERA5 {{cite:Hersbach2020ERA5}} is cross-checked against NASA POWER {{cite:Stackhouse2021POWER}}.",
          "It is bias-corrected per season by quantile mapping {{cite:Cannon2015QuantileMapping}}.",
          "Residual gaps are filled by chained-equation imputation {{cite:vanBuuren2011MICE}}.",
          "Solar geometry uses the NREL solar position algorithm {{cite:RedaAndreas2004SPA}} through pvlib {{cite:Holmgren2018pvlib}}.",
          "Per-point elevation (0–1,283 m, mean 282 m) replaced a flat 150 m assumption.",
        ],
      },
      {
        label: "Plots",
        points: [
          "The Tamil Nadu plots were regenerated on 2026-10-25 (11:16–11:19).",
          "The ranking and physics data files are dated 03:34–03:51 the same day, and the plots match them.",
        ],
      },
      {
        label: "Open items",
        points: [
          "The monsoon index is a proxy.",
          "NASA POWER precipitation was not downloaded.",
        ],
      },
    ],
    recommendations: [
      {
        cluster: "Cluster 0 — Southern plains (TNP_0011 medoid)",
        pcm: "RT57HC (Rubitherm)",
        tm: "56.5°C",
        latentHeat: "240 kJ/kg",
        mc: "W = 0.85",
        region: "46 points · 20.5 M people · n = 8 pool",
      },
      {
        cluster: "Cluster 1 — Western interior (TNP_0007 medoid)",
        pcm: "RT57HC (Rubitherm)",
        tm: "56.5°C",
        latentHeat: "240 kJ/kg",
        mc: "W = 0.48",
        region: "n = 10 pool (weak agreement)",
      },
      {
        cluster: "Cluster 2 — North-east coast (TNP_0001 medoid)",
        pcm: "RT57HC (Rubitherm)",
        tm: "56.5°C",
        latentHeat: "240 kJ/kg",
        mc: "W = 0.78",
        region: "n = 8 pool",
      },
    ],
    plots: [
      {
        id: "tn-01",
        num: "01",
        title: "Raw vs. Preprocessed Radiation (Tamil Nadu)",
        desc: "Radiation and temperature before and after preprocessing at a sample point.",
        interactive: "01_raw_vs_preprocessed_radiation_interactive.html",
        static: "01_raw_vs_preprocessed_radiation.png",
        phase: "Phase 2–3 Preprocessing",
      },
      {
        id: "tn-02",
        num: "02",
        title: "Climate Regime Map (Tamil Nadu k=3)",
        desc: "133 population-weighted points assigned to three regimes by a diagonal-covariance GMM.",
        interactive: "02_climate_regime_map_interactive.html",
        static: "02_climate_regime_map.png",
        phase: "Phase 4 Clustering",
      },
      {
        id: "tn-07a",
        num: "07a",
        title: "Bump Chart — MCDM Ranks (Cluster 0)",
        desc: "Candidate ranks under each MCDM method and the Borda consensus, Cluster 0 (8 candidates).",
        interactive: "07_bump_chart_ranks_cluster0.html",
        static: "07_bump_chart_ranks_cluster0.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "tn-07b",
        num: "07b",
        title: "Bump Chart — MCDM Ranks (Cluster 1)",
        desc: "Candidate ranks for Cluster 1 (10 candidates), where method agreement is weakest (W = 0.48).",
        interactive: "07_bump_chart_ranks_cluster1.html",
        static: "07_bump_chart_ranks_cluster1.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "tn-07c",
        num: "07c",
        title: "Bump Chart — MCDM Ranks (Cluster 2)",
        desc: "Candidate ranks for Cluster 2 (8 candidates).",
        interactive: "07_bump_chart_ranks_cluster2.html",
        static: "07_bump_chart_ranks_cluster2.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "tn-08",
        num: "08",
        title: "Method Rank Correlation Heatmap",
        desc: "Pairwise rank correlation between the four MCDM methods.",
        interactive: "08_method_rank_correlation_heatmap_interactive.html",
        static: "08_method_rank_correlation_heatmap.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "tn-10",
        num: "10",
        title: "Rank-Reversal Frequency",
        desc: "How often candidates swap order under perturbed weights and properties.",
        interactive: "10_rank_reversal_violin_interactive.html",
        static: "10_rank_reversal_violin_bar.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "tn-11",
        num: "11",
        title: "Agreement Plot — Top-3 Simulated vs. MCDM Rank",
        desc: "Simulated rank against MCDM consensus rank for the Top-3 candidates only (three points per cluster, jittered). Points far from the dashed line mean the physics model orders the Top-3 differently.",
        interactive: "11_agreement_plot_interactive.html",
        static: "11_agreement_plot.png",
        phase: "Phase 7 Physics",
      },
      {
        id: "tn-12",
        num: "12",
        title: "Tank Temperature & Melt-Fraction Profile",
        desc: "Simulated tank temperature and PCM melt fraction from the lumped-enthalpy model.",
        interactive: "12_tank_temperature_melt_fraction_interactive.html",
        static: "12_tank_temperature_melt_fraction.png",
        phase: "Phase 7 Physics",
      },
    ],
  },

  assam: {
    name: "Assam",
    short: "AS",
    climateType: "Humid Subtropical & Monsoonal (North-East India)",
    tag: "80 Grid Points · k=3 Regimes · cards are the reference",
    stats: [
      { value: "80", label: "Population-Weighted Points (27 / 28 / 25 per cluster); older documents say 129" },
      { value: "k=3", label: "GMM Regimes (medoids ASP_0048 / ASP_0051 / ASP_0038 in the cards)" },
      { value: "35 / 33 / 33", label: "Candidates passing the Phase 5 filter and ranked in the cards" },
      { value: "−0.16 / −0.46 / −0.41", label: "Spearman ρ, MCDM rank vs. simulated hours" },
      { value: "0.94", label: "Kendall's W (0.939 / 0.941 / 0.942)" },
      { value: "savE® OM49", label: "Borda Rank-1 Pick (all three clusters)" },
    ],
    overview: [
      "Assam has its own pipeline variant.",
      "The 2026-10-25 recommendation cards are the reference.",
      "They cover 80 population-weighted points in three GMM regimes.",
      "33–35 candidates are ranked per cluster by the four-method Borda consensus, and savE® OM49 is first in every cluster.",
      "The 129 points quoted in older documents predate the current grid.",
    ],
    spearmanSummary: "C0: −0.16 · C1: −0.46 · C2: −0.41 (vs. simulated hours)",
    verdict: "Negative against simulated hours",
    verdictSub: "Positive against solar fraction; n = 33–35 per cluster",
    notes: [
      {
        label: "What was re-run",
        points: [
          "The 2026-10-25 11:11–11:14 re-run regenerated the plots, the verification scripts and the final-output report.",
          "The clustering, PCM and recommendation-card files are dated 02:55–03:22 the same day and were not rewritten.",
          "So the numbers on this page come from those files.",
          "The re-run's final-output report prints fixed text (129 points; clusters of 33 / 61 / 35 points).",
          "The sampling-map figure carries a \"129 coordinates\" title.",
          "Neither matches the data files, and neither is used.",
        ],
      },
      {
        label: "Design basis and caveat",
        points: [
          "Cards: Tm_target = 56.0 °C (capped 50.3 / 49.4 / 49.4 °C) and L_required = 126 / 131 / 131 kJ/kg.",
          "The ranked candidates are the 33–35 per cluster that pass the Phase 5 filter.",
          "Caveat: none meets the stricter confirmed-feasible test.",
          "So read the Top-3 as the best of a conditionally feasible pool.",
          "The older documents quote a 44 °C target.",
        ],
      },
      {
        label: "What the cards rank",
        points: [
          "The ranking is a four-method Borda consensus: TOPSIS {{cite:HwangYoon1981MADM}}, GRA {{cite:Deng1982GreySystems}}, PROMETHEE II {{cite:BransVincke1985PROMETHEE}}, VIKOR {{cite:OpricovicTzeng2004VIKOR}}.",
          "Rank 1 is savE® OM49 in all clusters.",
          "Rank 2 is savE® OM50 in Cluster 0 and n-Tricosane (C23) in Clusters 1 and 2.",
        ],
      },
      {
        label: "Physics comparison (negative on the plotted metric)",
        points: [
          "Spearman ρ uses the agreement plot's inputs: Borda rank against the rank of simulated annual hours with the tank at or above 50 °C.",
          "It is −0.158 (C0, n = 35), −0.463 (C1, n = 33) and −0.408 (C2, n = 33).",
          "Against simulated solar fraction, the same ranks give +0.626, +0.366 and +0.435.",
          "These values were computed from the output files for this page; the project does not report them.",
          "The physics file labels its candidates as independently evaluated, not MCDM-ranked.",
        ],
      },
      {
        label: "Preprocessing",
        points: [
          "Outliers are flagged by a multivariate isolation forest instead of the Hampel filter {{cite:Liu2008IsolationForest}}.",
          "ERA5 {{cite:Hersbach2020ERA5}} agreed with NASA POWER {{cite:Stackhouse2021POWER}} closely enough that quantile mapping was judged unnecessary.",
          "This follows the project's cross-region notes (see bias_decision_assam.txt).",
        ],
      },
      {
        label: "Withdrawn claims",
        points: [
          "Earlier portal text said RT44HC was selected unanimously and that Assam was 100% complete.",
          "The unanimous RT44HC ranking is the older K=4 run.",
          "It is kept in the repository as a historical artefact only.",
        ],
      },
    ],
    recommendations: [
      {
        cluster: "Cluster 0 (ASP_0048 medoid)",
        pcm: "savE® OM49 (PLUSS)",
        tm: "49.0°C",
        latentHeat: "224 kJ/kg",
        mc: "W = 0.94",
        region: "27 points · 13.2 M people",
      },
      {
        cluster: "Cluster 1 (ASP_0051 medoid)",
        pcm: "savE® OM49 (PLUSS)",
        tm: "49.0°C",
        latentHeat: "224 kJ/kg",
        mc: "W = 0.94",
        region: "28 points · 8.6 M people",
      },
      {
        cluster: "Cluster 2 (ASP_0038 medoid)",
        pcm: "savE® OM49 (PLUSS)",
        tm: "49.0°C",
        latentHeat: "224 kJ/kg",
        mc: "W = 0.94",
        region: "25 points · 8.9 M people",
      },
    ],
    plots: [
      {
        id: "as-01",
        num: "01",
        title: "Raw vs. Preprocessed Radiation (Assam)",
        desc: "Radiation and temperature before and after preprocessing at a sample point.",
        interactive: "01_raw_vs_preprocessed_radiation_interactive.html",
        static: "01_raw_vs_preprocessed_radiation.png",
        phase: "Phase 2–3 Preprocessing",
      },
      {
        id: "as-02",
        num: "02",
        title: "Climate Regime Map (Assam k=3)",
        desc: "80 population-weighted points assigned to three regimes by a GMM (27 / 28 / 25 points).",
        interactive: "02_climate_regime_map_interactive.html",
        static: "02_climate_regime_map.png",
        phase: "Phase 4 Clustering",
      },
      {
        id: "as-07a",
        num: "07a",
        title: "Bump Chart — MCDM Ranks (Cluster 0)",
        desc: "Candidate ranks under each MCDM method and the Borda consensus, Cluster 0.",
        interactive: "07_bump_chart_ranks_cluster_0.html",
        static: "07_bump_chart_ranks_cluster_0.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "as-07b",
        num: "07b",
        title: "Bump Chart — MCDM Ranks (Cluster 1)",
        desc: "Candidate ranks under each MCDM method and the Borda consensus, Cluster 1.",
        interactive: "07_bump_chart_ranks_cluster_1.html",
        static: "07_bump_chart_ranks_cluster_1.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "as-07c",
        num: "07c",
        title: "Bump Chart — MCDM Ranks (Cluster 2)",
        desc: "Candidate ranks under each MCDM method and the Borda consensus, Cluster 2.",
        interactive: "07_bump_chart_ranks_cluster_2.html",
        static: "07_bump_chart_ranks_cluster_2.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "as-08",
        num: "08",
        title: "Method Rank Correlation Heatmap",
        desc: "Pairwise rank correlation between the four MCDM methods.",
        interactive: "08_method_rank_correlation_heatmap_interactive.html",
        static: "08_method_rank_correlation_heatmap.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "as-10",
        num: "10",
        title: "Rank-Reversal Frequency",
        desc: "How often candidates swap order under perturbed weights and properties.",
        interactive: "10_rank_reversal_violin_interactive.html",
        static: "10_rank_reversal_violin_bar.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "as-11",
        num: "11",
        title: "Agreement Plot — Simulated vs. MCDM Rank",
        desc: "Borda rank against simulated rank (annual hours with the tank at or above 50 °C) for 33–35 candidates per cluster. Points far from the dashed line mean poor agreement; Spearman ρ is −0.158, −0.463 and −0.408.",
        interactive: "11_agreement_plot_interactive.html",
        static: "11_agreement_plot.png",
        phase: "Phase 7 Physics",
      },
      {
        id: "as-12",
        num: "12",
        title: "Tank Temperature & Melt-Fraction Profile",
        desc: "Simulated tank temperature and PCM melt fraction from the lumped-enthalpy model.",
        interactive: "12_tank_temperature_melt_fraction_interactive.html",
        static: "12_tank_temperature_melt_fraction.png",
        phase: "Phase 7 Physics",
      },
    ],
  },

  uttarakhand: {
    name: "Uttarakhand",
    short: "UK",
    climateType: "Montane & Alpine Foothills (Northern Himalayan India)",
    tag: "45 Grid Points · k=5 Regimes · 57 °C design basis",
    stats: [
      { value: "45", label: "Population-Weighted Points (7 / 3 / 9 / 10 / 16 per cluster)" },
      { value: "k=5", label: "GMM Regimes (diagonal covariance, silhouette 0.28)" },
      { value: "29 / 30 / 29 / 27 / 29", label: "Candidates passing Phase 5 (20 ranked per cluster)" },
      { value: "0.80 / 0.84 / 0.78 / 0.71 / 0.80", label: "Kendall's W per Cluster" },
      { value: "+0.02 / −0.17 / −0.34 / +0.17 / −0.14", label: "Spearman ρ, MCDM rank vs. simulated rank" },
      { value: "PureTemp 58", label: "Borda Rank-1 Pick (C0 / C2 / C3 / C4); PureTemp 53 in C1" },
    ],
    overview: [
      "Uttarakhand was not moved to the 60 °C delivery basis: its Tm_target is still 57 °C (50 + 7).",
      "Rajasthan and Tamil Nadu use 67 °C.",
      "A regime-specific cap lowers the target to 55.2 °C for Cluster 1 and 56.5 °C for Cluster 2.",
      "So results here are not directly comparable with the other states.",
      "The physics simulation puts every candidate at 12–19% solar fraction, far below the 54–84% literature band.",
      "So it neither supports nor contradicts the MCDM ranking.",
    ],
    spearmanSummary: "C0: +0.023 · C1: −0.168 · C2: −0.338 · C3: +0.169 · C4: −0.140",
    verdict: "Weak, not significant",
    verdictSub: "p = 0.14–0.92; simulated solar fraction far below the band",
    notes: [
      {
        label: "Design basis",
        points: [
          "Tm_target = 57.0 °C for Clusters 0, 3 and 4, and 55.2 / 56.5 °C for Clusters 1 and 2 after the regime cap.",
          "L_required is 123 / 178 / 138 / 118 / 140 kJ/kg.",
          "The shared configuration now uses 60 °C delivery and a 67 °C target {{cite:MadadiAvargani2021}}.",
          "This state has not been re-run on that basis.",
        ],
      },
      {
        label: "Ranking",
        points: [
          "Four-method Borda consensus {{cite:HwangYoon1981MADM}}, with 20 candidates ranked per cluster.",
          "PureTemp 58 is first in Clusters 0, 2, 3 and 4.",
          "PureTemp 53 is first in Cluster 1 (the high, cold cluster with only 3 points).",
          "Cluster 3's Kendall's W of 0.71 and Cluster 2's 0.78 indicate only moderate agreement between the methods.",
        ],
      },
      {
        label: "Physics check (weak)",
        points: [
          "Spearman ρ is +0.023, −0.168, −0.338, +0.169 and −0.140 for Clusters 0–4 (n = 20 each; p between 0.14 and 0.92).",
          "All 100 simulations give 12.0–19.1% solar fraction, none inside the 54–84% band {{cite:Singh2025PCMSWH}}.",
          "An earlier figure of 92% in band was an artefact of simulator bugs and is not used.",
        ],
      },
      {
        label: "Re-run check (2026-10-25)",
        points: [
          "The full Uttarakhand pipeline was re-run from preprocessing to the plots (13:06–13:15).",
          "It reproduced every figure on this page: picks, Kendall's W, Spearman ρ, survivor counts and the 12.0–19.1% simulated solar fractions.",
          "All plots on this page were regenerated by that run.",
        ],
      },
      {
        label: "Not available",
        points: [
          "The feasibility scatter plots are not shown because they colour every candidate as Cluster 4.",
          "The earlier portal text about a sub-zero (anti-freeze) constraint selecting higher-Tm PCMs has been removed.",
          "No source for it was found in the repository.",
        ],
      },
    ],
    recommendations: [
      {
        cluster: "Cluster 0 (UKP_0037 medoid)",
        pcm: "PureTemp 58",
        tm: "58.0°C",
        latentHeat: "225 kJ/kg",
        mc: "W = 0.80",
        region: "7 points · 2.0 M people",
      },
      {
        cluster: "Cluster 1 (cold, high)",
        pcm: "PureTemp 53",
        tm: "53.0°C",
        latentHeat: "225 kJ/kg",
        mc: "W = 0.84",
        region: "3 points · 0.33 M people",
      },
      {
        cluster: "Cluster 2",
        pcm: "PureTemp 58",
        tm: "58.0°C",
        latentHeat: "225 kJ/kg",
        mc: "W = 0.78",
        region: "9 points · 2.5 M people",
      },
      {
        cluster: "Cluster 3",
        pcm: "PureTemp 58",
        tm: "58.0°C",
        latentHeat: "225 kJ/kg",
        mc: "W = 0.71",
        region: "10 points · 3.7 M people",
      },
      {
        cluster: "Cluster 4",
        pcm: "PureTemp 58",
        tm: "58.0°C",
        latentHeat: "225 kJ/kg",
        mc: "W = 0.80",
        region: "16 points · 2.0 M people",
      },
    ],
    plots: [
      {
        id: "uk-01",
        num: "01",
        title: "Raw vs. Preprocessed Radiation (Uttarakhand)",
        desc: "Radiation and temperature before and after preprocessing at a sample point.",
        interactive: "01_raw_vs_preprocessed_radiation_interactive.html",
        static: "01_raw_vs_preprocessed_radiation.png",
        phase: "Phase 2–3 Preprocessing",
      },
      {
        id: "uk-02",
        num: "02",
        title: "Climate Regime Map (Uttarakhand k=5)",
        desc: "45 population-weighted points assigned to five regimes by a diagonal-covariance GMM.",
        interactive: "02_climate_regime_map_interactive.html",
        static: "02_climate_regime_map.png",
        phase: "Phase 4 Clustering",
      },
      {
        id: "uk-07a",
        num: "07a",
        title: "Bump Chart — MCDM Ranks (Cluster 0)",
        desc: "Candidate ranks under each MCDM method and the Borda consensus, Cluster 0.",
        interactive: "07_bump_chart_ranks_cluster0.html",
        static: "07_bump_chart_ranks_cluster0.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "uk-07b",
        num: "07b",
        title: "Bump Chart — MCDM Ranks (Cluster 1)",
        desc: "Candidate ranks for Cluster 1 (3 points; PureTemp 53 first).",
        interactive: "07_bump_chart_ranks_cluster1.html",
        static: "07_bump_chart_ranks_cluster1.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "uk-07c",
        num: "07c",
        title: "Bump Chart — MCDM Ranks (Cluster 2)",
        desc: "Candidate ranks under each MCDM method and the Borda consensus, Cluster 2.",
        interactive: "07_bump_chart_ranks_cluster2.html",
        static: "07_bump_chart_ranks_cluster2.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "uk-07d",
        num: "07d",
        title: "Bump Chart — MCDM Ranks (Cluster 3)",
        desc: "Candidate ranks for Cluster 3, where method agreement is lowest (W = 0.71).",
        interactive: "07_bump_chart_ranks_cluster3.html",
        static: "07_bump_chart_ranks_cluster3.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "uk-07e",
        num: "07e",
        title: "Bump Chart — MCDM Ranks (Cluster 4)",
        desc: "Candidate ranks under each MCDM method and the Borda consensus, Cluster 4.",
        interactive: "07_bump_chart_ranks_cluster4.html",
        static: "07_bump_chart_ranks_cluster4.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "uk-08",
        num: "08",
        title: "Method Rank Correlation Heatmap",
        desc: "Pairwise rank correlation between the four MCDM methods.",
        interactive: "08_method_rank_correlation_heatmap_interactive.html",
        static: "08_method_rank_correlation_heatmap.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "uk-10",
        num: "10",
        title: "Rank-Reversal Frequency",
        desc: "How often candidates swap order under perturbed weights and properties.",
        interactive: "10_rank_reversal_violin_interactive.html",
        static: "10_rank_reversal_violin_bar.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "uk-11",
        num: "11",
        title: "Agreement Plot — Top-3 Simulated vs. MCDM Rank",
        desc: "Simulated rank against MCDM rank for the Top-3 candidates only (three points per cluster). The ρ values in the legend (−1 to +1) are computed on those three points and are not the validation ρ, which uses 20 candidates per cluster.",
        interactive: "11_agreement_plot_interactive.html",
        static: "11_agreement_plot.png",
        phase: "Phase 7 Physics",
      },
      {
        id: "uk-12",
        num: "12",
        title: "Tank Temperature & Melt-Fraction Profile",
        desc: "Simulated tank temperature and PCM melt fraction from the lumped-enthalpy model.",
        interactive: "12_tank_temperature_melt_fraction_interactive.html",
        static: "12_tank_temperature_melt_fraction.png",
        phase: "Phase 7 Physics",
      },
    ],
  },

  all: {
    name: "All 4 States",
    short: "ALL",
    climateType: "Multi-State Cross-Comparison (Coastal, Arid, Subtropical, Montane)",
    tag: "578 Grid Points · 14 Regimes · mixed validation",
    notes: [
      {
        label: "Not like-for-like",
        points: [
          "Design bases differ by state.",
          "Rajasthan and Tamil Nadu use 60 °C delivery and a 67 °C Tm_target (capped per cluster).",
          "Uttarakhand still uses 57 °C.",
          "Assam’s cards use 56 °C (capped about 50 °C); its older documents say 44 °C.",
          "Assam’s point count is 80 (documents: 129).",
          "Compare Rank-1 picks and correlations within a state, not across states.",
        ],
      },
      {
        label: "Physics agreement by state",
        points: [
          "Rajasthan −0.200 / −0.168 / +0.569; Tamil Nadu −0.333 / +0.103 / +0.024.",
          "Uttarakhand −0.338 to +0.169 (none significant).",
          "Assam −0.16 / −0.46 / −0.41 against simulated hours (computed from its output files).",
          "Overall, the physics simulation does not confirm the MCDM ranking in any state.",
        ],
      },
      {
        label: "Scope of this page",
        points: [
          "Only plots and results that exist for all four states are shown.",
          "Plots: raw-vs-preprocessed radiation, the regime map, per-cluster MCDM bump charts, the method-agreement heatmap, rank-reversal, the simulated-vs-MCDM agreement plot and the tank profile.",
          "Per state: points, regimes, candidates, Kendall's W, Spearman ρ and the Rank-1 pick.",
          "Omitted because only some states have them: Monte Carlo stability, seasonal re-ranking, the supercooling sweep, the Köppen check, survivors and recommendation summary charts.",
        ],
      },
      {
        label: "Cross-state comparison figures withdrawn",
        points: [
          "The earlier eight comparison plots were Assam-only or pre-correction.",
          "They have been removed until they are regenerated from the corrected pipelines.",
        ],
      },
    ],
    stats: [
      { value: "4 States", label: "Tamil Nadu, Rajasthan, Assam, Uttarakhand" },
      { value: "578", label: "Total Population-Weighted Grid Points (320 + 133 + 45 + 80)" },
      { value: "10 Years", label: "Continuous Hourly ERA5 + POWER (2016–2025)" },
      { value: "14", label: "Climate Regimes (RJ 3 · TN 3 · UK 5 · AS 3)" },
      { value: "62", label: "Screened PCM Candidate Records" },
      { value: "Mixed", label: "Physics agreement varies by state; see each state page" },
    ],
    overview: [
      "Objective 1 applies one pipeline to four Indian states: Rajasthan, Tamil Nadu, Uttarakhand and Assam.",
      "The pipeline covers population-weighted ERA5 and NASA POWER sampling, GMM regimes, eight-constraint PCM screening, four-method MCDM consensus and a lumped-enthalpy physics check.",
      "The states are at different stages of correction, summarised below.",
    ],
    spearmanSummary: "RJ negative/partial · TN, UK weak · AS negative vs. hours",
    recommendations: [
      {
        cluster: "Tamil Nadu (Tropical Marine)",
        pcm: "RT57HC (all three clusters)",
        tm: "56.5°C",
        latentHeat: "240 kJ/kg",
        mc: "W 0.48–0.85 · ρ −0.333 to +0.103",
        region: "Southern plains / Western interior / North-east coast",
      },
      {
        cluster: "Rajasthan (Hot Arid)",
        pcm: "savE® OM55 / PureTemp 60 / Palmitic-stearic acid–EG",
        tm: "55.0 / 61.0 / 55.2°C",
        latentHeat: "188 / 220 / 176 kJ/kg",
        mc: "W 0.42–1.00 · ρ −0.200 to +0.569",
        region: "Southern plateau / Thar core / North-east",
      },
      {
        cluster: "Assam (Subtropical Valley)",
        pcm: "savE® OM49 (all three clusters)",
        tm: "49.0°C",
        latentHeat: "224 kJ/kg",
        mc: "W 0.94 · ρ −0.46 to −0.16",
        region: "Brahmaputra / Barak Valleys",
      },
      {
        cluster: "Uttarakhand (Montane)",
        pcm: "PureTemp 58 (PureTemp 53 in Cluster 1)",
        tm: "58.0 / 53.0°C",
        latentHeat: "225 kJ/kg",
        mc: "W 0.71–0.84 · ρ −0.338 to +0.169",
        region: "Tarai Plains to High Himalayas (57 °C basis)",
      },
    ],
    plots: [],
  },
};

/* ─────────────────────────────────────────────────────────
   Objective 1 page — results by state.
   The pipeline itself is described at the top of this page.
   ───────────────────────────────────────────────────────── */

const STATE_ORDER = ["rajasthan", "tamilnadu", "uttarakhand", "assam"];

/* Verified results, one column per state (sources: each state's
   recommendation cards, ranking, physics and preprocessing outputs). */
const COMPARISON_ROWS = [
  {
    label: "Population-weighted points",
    values: { rajasthan: "320", tamilnadu: "133", uttarakhand: "45", assam: "80 (older documents: 129)" },
  },
  {
    label: "Climate regimes (GMM)",
    values: { rajasthan: "3", tamilnadu: "3", uttarakhand: "5", assam: "3" },
  },
  {
    label: "Melting-point target",
    values: {
      rajasthan: "67 °C; capped 55.5 / 61.1 / 59.2 °C",
      tamilnadu: "67 °C (physics script uses a 50 °C delivery constant)",
      uttarakhand: "57 °C; capped 55.2 °C (C1) and 56.5 °C (C2)",
      assam: "56 °C; capped about 50 °C (older documents: 44 °C)",
    },
  },
  {
    label: "Candidates ranked per cluster",
    values: {
      rajasthan: "4 / 8 / 11",
      tamilnadu: "8 / 10 / 8",
      uttarakhand: "20 each (29 / 30 / 29 / 27 / 29 pass the filter)",
      assam: "35 / 33 / 33",
    },
  },
  {
    label: "Kendall's W (method agreement)",
    values: {
      rajasthan: "1.00 / 0.77 / 0.42",
      tamilnadu: "0.85 / 0.48 / 0.78",
      uttarakhand: "0.80 / 0.84 / 0.78 / 0.71 / 0.80",
      assam: "0.94 / 0.94 / 0.94",
    },
  },
  {
    label: "Spearman ρ, MCDM rank vs. simulated rank",
    values: {
      rajasthan: "−0.200 / −0.168 / +0.569",
      tamilnadu: "−0.333 / +0.103 / +0.024",
      uttarakhand: "+0.023 / −0.168 / −0.338 / +0.169 / −0.140",
      assam: "−0.16 / −0.46 / −0.41 (against simulated hours)",
    },
  },
  {
    label: "Rank-1 PCM",
    values: {
      rajasthan: "savE® OM55 / PureTemp 60 / palmitic-stearic acid with expanded graphite",
      tamilnadu: "RT57HC in all three clusters",
      uttarakhand: "PureTemp 58 (PureTemp 53 in Cluster 1)",
      assam: "savE® OM49 in all three clusters",
    },
  },
  {
    label: "Main caveat",
    values: {
      rajasthan: "Cluster 0 pool is only 4 candidates; Cluster 2 methods agree weakly (W 0.42)",
      tamilnadu: "Physics agreement is weak and not significant; Cluster 1 methods agree weakly",
      uttarakhand: "Not on the 60 °C basis; simulated solar fractions (12–19%) are below the 54–84% band",
      assam: "Ranked pool is conditionally feasible; point count differs from older documents",
    },
  },
];

/* Notes that restate the shared pipeline are dropped from the state tabs. */
const DROPPED_NOTE_LABELS = ["Ranking", "Preprocessing", "Plots"];

function stateNotes(key) {
  return (STATES_CONFIG[key].notes || []).filter((n) => !DROPPED_NOTE_LABELS.includes(n.label));
}

/* A labelled group of bullets for one note. */
function NoteGroups({ notes }) {
  return (
    <div className="note-groups">
      {notes.map((n) => (
        <div key={n.label} className="note-group">
          <h4 className="note-label">{n.label}</h4>
          <Bullets items={n.points} />
        </div>
      ))}
    </div>
  );
}

/* Plot types present and valid for all four states (one grid per type). */
const PLOT_TYPES = [
  { num: "01", title: "Raw vs. preprocessed radiation", caption: "Radiation and temperature before and after preprocessing at a sample point of each state." },
  { num: "02", title: "Climate regime map", caption: "Grid points coloured by the climate regime assigned by the Gaussian Mixture Model." },
  { num: "07a", title: "MCDM rank trajectories, Cluster 0", caption: "Each candidate's rank under TOPSIS, GRA, PROMETHEE II and VIKOR and in the Borda consensus (bump chart)." },
  { num: "07b", title: "MCDM rank trajectories, Cluster 1", caption: "Same chart for Cluster 1." },
  { num: "07c", title: "MCDM rank trajectories, Cluster 2", caption: "Same chart for Cluster 2." },
  { num: "08", title: "Method rank-correlation heatmap", caption: "Pairwise rank correlation between the four MCDM methods." },
  { num: "10", title: "Rank-reversal frequency", caption: "How often candidates swap order under perturbed weights and properties." },
  {
    num: "11",
    title: "Agreement plot: simulated rank vs. MCDM rank",
    caption: "Points on the dashed line mean the physics model and the MCDM ranking agree. The plotted set and metric differ by state, as noted under each plot.",
    notes: {
      rajasthan: "All ranked candidates, simulated solar fraction",
      tamilnadu: "Top-3 candidates only",
      uttarakhand: "Top-3 candidates only; legend ρ uses 3 points",
      assam: "All ranked candidates, simulated hours at or above 50 °C",
    },
  },
  { num: "12", title: "Tank temperature and melt-fraction profile", caption: "Simulated tank temperature and PCM melt fraction from the lumped-enthalpy model." },
];

/* Common plot types, plus the state's own extra plots (Uttarakhand clusters 3 and 4). */
const EXTRA_PLOT_TYPES = {
  uttarakhand: [
    { num: "07d", title: "MCDM rank trajectories, Cluster 3", caption: "Uttarakhand only: the fourth of its five regimes." },
    { num: "07e", title: "MCDM rank trajectories, Cluster 4", caption: "Uttarakhand only: the fifth of its five regimes." },
  ],
};

function plotsForState(stateKey) {
  return [...PLOT_TYPES, ...(EXTRA_PLOT_TYPES[stateKey] || [])].filter((pt) => plotFor(stateKey, pt.num));
}

function plotFor(stateKey, num) {
  return (STATES_CONFIG[stateKey].plots || []).find((p) => p.num === num) || null;
}

function plotUrls(stateKey, plot) {
  const base = `${process.env.PUBLIC_URL}/plots/${stateKey}/`;
  return {
    src: plot && plot.static ? base + plot.static : null,
    interactiveSrc: plot && plot.interactive ? base + plot.interactive : null,
  };
}

function Objective1Page() {
  resetTerms();
  const [tab, setTab] = useState("rajasthan");
  const [plotTab, setPlotTab] = useState("rajasthan");
  const current = STATES_CONFIG[tab];

  return (
    <section className="content" id="top">
      {/* ── Page Hero ────────────────────────────────────── */}
      <div className="page-hero">
        <div className="eyebrow">
          <span className="eyebrow-badge">Research Module · Objective 1</span>
          <span>Results by state</span>
        </div>

        <h1>Climate-Adaptive PCM Thermal Storage Selection</h1>
      </div>

      {/* ── Pipeline (same as the Overview) ── */}
      <div className="content-section" id="pipeline">
        <PipelineSection onObjective1 />
      </div>

      {/* ── State comparison ───────────────────────────────── */}
      <div className="content-section" id="comparison">
        <div className="plots-section-header">
          <h2>State Comparison</h2>
          <span className="plots-count-badge">4 States</span>
        </div>
        <p className="section-desc">
          The same measures for each state; the design basis differs by state, so compare rows with care.
        </p>
        <div className="section-divider" />

        <div className="data-table-wrapper compare-table-wrapper">
          <table className="data-table compare-table">
            <thead>
              <tr>
                <th>Measure</th>
                {STATE_ORDER.map((k) => (
                  <th key={k}>{STATES_CONFIG[k].name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.label}>
                  <td><Terms text={row.label} /></td>
                  {STATE_ORDER.map((k) => (
                    <td key={k}>{row.values[k]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <NoteGroups notes={STATES_CONFIG.all.notes || []} />
      </div>

      {/* ── Cross-State Preprocessing Verification Table ── */}
      <div className="content-section" id="preprocessing">
        <div className="plots-section-header">
          <h2>Preprocessing and Quality Control</h2>
          <span className="plots-count-badge">By State</span>
        </div>
        <Bullets
          items={[
            "Shows record counts before and after cleaning (stage 2 of the pipeline).",
            "Cleaning uses Hampel filtering {{cite:Hampel1974InfluenceCurve}}, chained-equation imputation {{cite:vanBuuren2011MICE}} and quantile mapping {{cite:Cannon2015QuantileMapping}} against NASA POWER.",
            "The Rajasthan and Uttarakhand rows were re-checked against the 2026-10-25 quality-control reports (5 of 5 checks passed each).",
            "Caveat: the other rows are carried over from the earlier portal and have not been re-checked.",
          ]}
        />
        <div className="section-divider" />

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>State Pipeline</th>
                <th>Grid Points</th>
                <th>Input Records</th>
                <th>Output Records</th>
                <th>Data Retention</th>
                <th>Dimensions</th>
                <th>Engineered Features</th>
                <th>Missing Rate</th>
                <th>QC Status</th>
              </tr>
            </thead>
            <tbody>
              {PREPROCESSING_SUMMARY.map((row) => (
                <tr key={row.state}>
                  <td style={{ fontWeight: 600, color: "#ffffff" }}>{row.state}</td>
                  <td>{row.gridPoints}</td>
                  <td>{row.inputRecords}</td>
                  <td>{row.outputRecords}</td>
                  <td style={{ fontWeight: 600, color: "#ffffff" }}>{row.retention}</td>
                  <td>
                    {row.inputDims} → {row.outputDims}
                  </td>
                  <td>{row.engineeredFeatures}</td>
                  <td>{row.missingRate}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Results by state (tabs) ────────────────────────── */}
      <div className="content-section" id="state-results">
        <div className="plots-section-header">
          <h2>Results by State</h2>
        </div>
        <p className="section-desc">
          Cluster results, design-basis deviations and caveats that belong to one state only.
        </p>
        <div className="section-divider" />

        <div className="state-tabs" role="tablist" aria-label="State">
          {STATE_ORDER.map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              className={`state-tab ${tab === k ? "active" : ""}`}
              onClick={() => setTab(k)}
            >
              {STATES_CONFIG[k].name}
            </button>
          ))}
        </div>

        <h3>{current.name}</h3>
        <p className="section-desc" style={{ marginBottom: 8 }}>{current.climateType}</p>
        <Bullets items={current.overview} />

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cluster</th>
                <th>Rank-1 PCM</th>
                <th>Melting point</th>
                <th>Latent heat</th>
                <th>Method agreement (W) · Physics ρ</th>
                <th>Coverage</th>
              </tr>
            </thead>
            <tbody>
              {current.recommendations.map((r) => (
                <tr key={r.cluster}>
                  <td style={{ fontWeight: 600, color: "#ffffff" }}>{r.cluster}</td>
                  <td style={{ color: "#ffffff" }}>{r.pcm}</td>
                  <td>{r.tm}</td>
                  <td>{r.latentHeat}</td>
                  <td>{r.mc}</td>
                  <td>{r.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <NoteGroups notes={stateNotes(tab)} />

      </div>

      {/* ── Plots across states: choose a state ─────────────── */}
      <div className="content-section" id="plots">
        <div className="plots-section-header">
          <h2>Plots Across States</h2>
          <span className="plots-count-badge">{plotsForState(plotTab).length} Plots</span>
        </div>
        <Bullets
          items={[
            "Choose a state.",
            "The plot types shown exist for all four states; Uttarakhand also has two extra bump charts for its fourth and fifth clusters.",
            "Click a plot to enlarge it.",
            "\"Interactive view\" opens the interactive version in the same viewer; \"New tab\" opens it in a separate tab.",
          ]}
        />
        <div className="section-divider" />

        <div className="state-tabs" role="tablist" aria-label="State for plots">
          {STATE_ORDER.map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={plotTab === k}
              className={`state-tab ${plotTab === k ? "active" : ""}`}
              onClick={() => setPlotTab(k)}
            >
              {STATES_CONFIG[k].name}
            </button>
          ))}
        </div>

        <div className="plot-grid plot-grid-wide">
          {plotsForState(plotTab).map((pt) => {
            const p = plotFor(plotTab, pt.num);
            const u = plotUrls(plotTab, p);
            return (
              <div key={pt.num} className="plot-type" id={`plot-${pt.num}`}>
                <h3>{pt.title}</h3>
                <Figure
                  src={u.src}
                  interactiveSrc={u.interactiveSrc}
                  title={`${STATES_CONFIG[plotTab].name}: ${pt.title}`}
                  note={pt.notes ? pt.notes[plotTab] : null}
                />
                <p className="plot-type-caption">{pt.caption}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Objective1Page;
