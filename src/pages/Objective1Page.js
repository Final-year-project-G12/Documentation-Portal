import { useState } from "react";
import Figure from "../components/Figure";
import Bullets from "../components/Bullets";
import PipelineSection from "../components/PipelineSection";
import { Terms } from "../components/Terms";
import { resetTerms } from "../data/terms";
import useReveal from "../components/useReveal";
import { Rich } from "../components/Cite";
import { StatTiles, ChipTabs, Accordion, Podium, Callout } from "../components/Interactive";

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
    retention: "99.2% (11,970 lag warm-up rows set aside)",
    inputDims: 36,
    outputDims: 89,
    engineeredFeatures: 45,
    missingRate: "0.00% (1.09% of cells imputed)",
    status: "PASS (5 of 5 checks)",
  },
  {
    state: "Rajasthan",
    tag: "Arid Belt",
    gridPoints: 320,
    inputRecords: "3,506,880",
    outputRecords: "3,478,080",
    retention: "99.2% (28,800 lag warm-up rows set aside)",
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
    inputRecords: "Not reported in the QC report",
    outputRecords: "876,720 (80 × 10,959)",
    retention: "No rows dropped in the cleaned file; 22,565 rows flagged as outliers",
    inputDims: "n/a",
    outputDims: "42 (cleaned physical file)",
    engineeredFeatures: "Not re-derived",
    missingRate: "0 cells remaining after gap filling",
    status: "PASS, with a clear-sky-index warning (median 0.769, outside the 0.55–0.75 check)",
  },
  {
    state: "Uttarakhand",
    tag: "Montane",
    gridPoints: 45,
    inputRecords: "493,155",
    outputRecords: "489,105",
    retention: "99.2% (4,050 lag warm-up rows set aside)",
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
      { value: "4 / 8 / 11", label: "Calibrated Survivors per Cluster (23 of 62 after κ calibration)" },
      { value: "1.00 / 0.77 / 0.42", label: "Kendall's W per Cluster (C0 highest)" },
      { value: "OM55 / PureTemp 60 / Palmitic-stearic–EG", label: "Borda Rank-1 Pick (C0 / C1 / C2)" },
    ],
    overview: [
      "Rajasthan is the reference state: its pipeline is the most complete and most recently refined.",
      "320 population-weighted points are clustered into three regimes with a diagonal-covariance Gaussian Mixture Model {{cite:Schwarz1978BIC,Rousseeuw1987Silhouettes}}.",
      "Targets use the corrected design basis: 60 °C delivery plus a 7 K approach gives Tm_target = 67 °C.",
      "Scoring uses the per-cluster capped target of 55.5 / 61.1 / 59.2 °C.",
      "The nominal latent-heat factor is κ = 0.7; it is calibrated per cluster.",
      "Calibration leaves 4 / 8 / 11 survivors out of 62 candidates.",
    ],
    spearmanSummary: "C0: −0.200 · C1: −0.168 · C2: +0.569",
    verdict: "Weak, not significant",
    verdictSub: "Closest in C2 (ρ = +0.569, p = 0.067); predictive validity not established",
    notes: [
      {
        label: "Design basis",
        points: [
          "L_required = SHARE_PCM · Q_night / m_PCM, with SHARE_PCM = 0.5 (published range 0.4–0.78) {{cite:Zhao2022PCMShare,Huang2020PCMVolumeRatio,Abdelsalam2020PCMStorageVolume,Kozelj2021PCMFraction}}.",
          "This gives L_required = 438 / 427 / 443 kJ/kg for C0 / C1 / C2.",
          "The delivery temperature was raised from 50 to 60 °C: the 300 L / 7 h night-delivery benchmark is reported at 60 ± 2 °C {{cite:MadadiAvargani2021}}.",
          "That moved Tm_target from 57 to 67 °C and L_required from 285–344 to 410–469 kJ/kg.",
          "Scope note: the benchmark system uses circular-trough collectors, so the 300 L figure serves as a demand-scale reference rather than a flat-plate performance benchmark.",
        ],
      },
      {
        label: "Latent-heat calibration",
        points: [
          "The latent-heat floor is κ · L_required.",
          "Calibrated κ is 0.0 / 0.5 / 0.3, which leaves 4 / 8 / 11 survivors.",
          "Cluster 0 settles at κ = 0.0 with a compact pool (n = 4).",
          "The melting-window and charging-feasibility gates select 4 of 62 candidates there, whatever κ is.",
          "So the compact pool reflects the cluster's climate.",
          "Its Top-3 is drawn from a smaller pool than the other two clusters.",
        ],
      },
      {
        label: "Ranking",
        points: [
          "Eight criteria are scored with a 50/50 blend of Shannon-entropy weights {{cite:Shannon1948Communication}} and fixed prior weights.",
          "The prior half uses fixed weights rather than an AHP pairwise elicitation, which is a possible extension.",
          "Candidates are ranked by TOPSIS {{cite:HwangYoon1981MADM}}, PROMETHEE II {{cite:BransVincke1985PROMETHEE}}, VIKOR {{cite:OpricovicTzeng2004VIKOR}} and GRA {{cite:Deng1982GreySystems}}.",
          "A Borda count combines the ranks, with a Copeland cross-check.",
          "Cluster 2's Borda and Copeland orderings differ on Top-3 membership, and both are reported.",
        ],
      },
      {
        label: "Physics check (mixed across clusters)",
        points: [
          "Spearman ρ between the MCDM rank and the simulated annual solar fraction is −0.200 (C0, n = 4), −0.168 (C1, n = 8) and +0.569 (C2, n = 11).",
          "The tank model uses 200 kg of water {{cite:Eldokaishi2022ANN_PCM_SWH}}.",
          "Its loss and isolation parameters were retuned jointly, so the plain-tank solar fraction lands in the 54–84% literature band {{cite:Singh2025PCMSWH}} (64.3 / 65.8 / 64.0% at the three medoids).",
          "The Top-3 candidates inside each cluster differ by under about 1 percentage point of solar fraction, so the physics model sees them as near-equivalent.",
          "So the Top-3 are close performers in the physics model.",
        ],
      },
      {
        label: "Significance of the physics check",
        points: [
          "Against the Borda rank the p-values are 0.80 (C0, n = 4), 0.69 (C1, n = 8) and 0.067 (C2, n = 11).",
          "Only Cluster 2 against the Copeland rank reaches nominal significance (ρ = +0.633, p = 0.036, not corrected for multiple comparisons).",
          "So the MCDM ranking was compared with the project's physics model, agreement was weak, and predictive validity was not established.",
          "Kendall's W (1.00 / 0.77 / 0.42) measures robustness across the four methods, not performance. Cluster 2 also has a Borda/Copeland disagreement, and Cluster 0 rests on n = 4.",
        ],
      },
      {
        label: "Monte Carlo stability (5,000 draws)",
        points: [
          "The Rank-1 candidate stays in the Top-3 in 100% / 95.6% / 62.2% of draws for C0 / C1 / C2.",
          "It stays Rank 1 in 90.6% / 57.9% / 27.0% of draws.",
          "Cluster 2 is the least stable: the Rank-1 pick keeps first place in about a quarter of the draws.",
          "The draw count was raised from 1,000 to 5,000 on 2026-10-28 so all four states report the same count.",
        ],
      },
      {
        label: "Seasonal check",
        points: [
          "The seasonal-sensitivity script marks 8 of 11 valid cluster-season cells \"YES\", but that compares each seasonal Rank 1 with the annual Rank 1.",
          "It is not evidence of seasonal change: within a cluster the seasonal ranking is identical across seasons.",
          "The annual-versus-seasonal Rank-1 mismatch in Clusters 0 and 2 is unexplained.",
          "So Objective 3 is motivated by hour-by-hour operation under weather and demand variability, not by seasonal re-ranking.",
        ],
      },
      {
        label: "Limitations",
        points: [
          "Delivery basis: Objective 1 sizes for 60 °C delivery (Tm_target 67 °C). That target is above the 65 °C PCM limit used in Objective 2 and is not operationally validated; the capped targets above are what the filters used. Objective 2 scores delivery at 45 °C.",
          "The criterion weights are entropy weights blended with stated priors; no AHP elicitation was done.",
          "The GMM is not population-weighted: population selects the points and weights the cluster profiles, but is not passed into the fit.",
          "BIC picks a density model, not necessarily a meaningful number of regimes. The Köppen–Geiger cross-check gives ARI = 0.279 and NMI = 0.382, read as finer structure than Köppen's broad classes; no NBC/ECBC comparison exists.",
          "The mains-water temperature is a placeholder and σ = 4 K in the melting-point score is not from a paper {{cn}}.",
          "Raising the supercooling penalty worsened agreement in every cluster (ρ falls from −0.200 to −1.000 in C0, and from +0.569 to +0.387 in C2), so a larger penalty does not improve the match with the physics model.",
        ],
      },
      {
        label: "Re-run check (2026-10-25)",
        points: [
          "The Rajasthan pipeline was re-run from preprocessing through the recommendation cards (11:27–11:44).",
          "It reproduced every figure on this page: survivors 4 / 8 / 11, Rank-1 picks, Kendall's W and Spearman ρ.",
          "The plots on this page were refreshed on 2026-11-11 from the 2026-10-28 regeneration of the Rajasthan plots.",
        ],
      },
      {
        label: "Next steps",
        points: [
          "The mains-water temperature uses a placeholder (ambient mean minus 2 °C) until a ground-temperature annual-lag model is added {{cite:Kusuda1965EarthTemperature}}.",
          "Imputed properties (thermal conductivity, densities, specific heats) appear in each Top-3.",
          "They are listed in the recommendation cards.",
        ],
      },
    ],
    recommendations: [
      {
        cluster: "Cluster 0 — Southern plateau (Udaipur medoid)",
        pcm: "savE® OM55 (PLUSS)",
        top2: "Palmitic-stearic acid / expanded graphite",
        top3: "Myristic acid / NBR-0.5",
        tm: "55.0°C",
        latentHeat: "188 kJ/kg",
        mc: "W = 1.00",
        region: "109 points · 21.8 M people · n = 4 pool",
      },
      {
        cluster: "Cluster 1 — Hot, steady-solar (Nagaur medoid)",
        pcm: "PureTemp 60",
        top2: "CrodaTherm 60",
        top3: "n-Heptacosane (C27)",
        tm: "61.0°C",
        latentHeat: "220 kJ/kg",
        mc: "W = 0.77",
        region: "83 points · 14.0 M people · n = 8 pool",
      },
      {
        cluster: "Cluster 2 — North-east (Jaipur medoid)",
        pcm: "Palmitic-stearic acid / expanded graphite",
        top2: "n-Heptacosane (C27)",
        top3: "PureTemp 58 / savE® OM55 (tied)",
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
        desc: "Rank trajectories for the 8 Cluster 1 candidates. PureTemp 60 is first in the consensus and under GRA, PROMETHEE II and VIKOR; TOPSIS ranks CrodaTherm 60 first, giving W = 0.77.",
        interactive: "07_bump_chart_ranks_cluster_1.html",
        static: "07_bump_chart_ranks_cluster_1.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "rj-07c",
        num: "07c",
        title: "Bump Chart — MCDM Ranks (Cluster 2)",
        desc: "Rank trajectories for the 11 Cluster 2 candidates, where the methods differ most (W = 0.42), so the Borda consensus adds the most value.",
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
        desc: "Simulated performance rank against MCDM consensus rank per cluster. Points on the dashed line would mean full agreement; Cluster 0 and 1 points spread across the plot (ρ = −0.200 and −0.168), while Cluster 2 is closest (ρ = +0.569).",
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
    tag: "133 Grid Points · k=3 Regimes · 9 ranking criteria",
    stats: [
      { value: "133", label: "Population-Weighted Points (87.5% population coverage)" },
      { value: "−0.33 / +0.10 / +0.02", label: "Spearman ρ, MCDM rank vs. simulated rank" },
      { value: "k=3", label: "GMM Regimes (auto-selected on silhouette and bootstrap ARI)" },
      { value: "8 / 10 / 8", label: "Calibrated Survivors per Cluster (26 of 62)" },
      { value: "0.85 / 0.48 / 0.78", label: "Kendall's W per Cluster (C0 highest)" },
      { value: "RT57HC", label: "Borda Rank-1 Pick (all three clusters)" },
    ],
    overview: [
      "Tamil Nadu uses the same shared design basis as Rajasthan: 60 °C delivery, Tm_target = 67 °C, SHARE_PCM = 0.5.",
      "The calculation assumes a 300 L/day draw.",
      "133 population points are clustered into three regimes with a diagonal-covariance GMM.",
      "A five-cluster run was also explored; k = 3 was retained because it scored higher on silhouette and bootstrap ARI {{cite:Schwarz1978BIC,Rousseeuw1987Silhouettes}}.",
      "The regimes have 46 / 41 / 46 points covering 20.5 / 20.4 / 30.3 M people.",
      "RT57HC is the Borda #1 in every cluster, a consistent pick across all three regimes.",
      "Tamil Nadu ranks on nine criteria: the eight shared ones plus thermal margin.",
    ],
    spearmanSummary: "C0: −0.333 · C1: +0.103 · C2: +0.024",
    verdict: "Exploratory",
    verdictSub: "n = 8–10 per cluster; Phase 7 uses its own 50 °C delivery constant",
    notes: [
      {
        label: "Delivery-temperature alignment",
        points: [
          "Phase 3 imports the shared <code>T_DELIVERY_C = 60.0</code> (Tm_target = 67 °C).",
          "This state's <code>10_physics_validation.py</code> uses its own <code>T_DELIVERY_C = 50.0</code> (line 164).",
          "So the Phase 3 targets and the Phase 7 simulator use different delivery temperatures.",
          "Read the Phase 7 results with that in mind.",
          "Aligning the two is the next step.",
        ],
      },
      {
        label: "Results on disk (last pipeline run 2026-09-16)",
        points: [
          "Calibrated survivors are 8 / 10 / 8.",
          "L_required in the ranking files is 406 / 438 / 406 kJ/kg.",
          "Borda #1 is RT57HC in all clusters.",
          "n-Hexacosane (C26) is second in C0 and C1; in C2 n-Pentacosane (C25) and n-Hexacosane (C26) tie for second.",
          "Kendall's W is 0.848 / 0.477 / 0.780.",
          "So Cluster 1 has the widest spread between methods.",
        ],
      },
      {
        label: "Physics check (exploratory)",
        points: [
          "Spearman ρ is −0.333 (C0, n = 8), +0.103 (C1, n = 10) and +0.024 (C2, n = 8), mean −0.069.",
          "With n = 8–10 per cluster, these are read as exploratory trends.",
          "Of 26 simulations, 9 fall in the 54–84% solar-fraction band {{cite:Singh2025PCMSWH}}; the range is 29.5–85.5%.",
          "The regenerated outputs supersede the C0 ρ = +0.381 and mean of +0.169 quoted in earlier project documents and the conference paper.",
        ],
      },
      {
        label: "Monte Carlo stability (5,000 draws)",
        points: [
          "RT57HC stays in the Top-3 in 86.5% / 75.2% / 84.2% of draws for C0 / C1 / C2.",
          "It stays Rank 1 in 49.2% / 40.0% / 42.3% of draws.",
          "Cluster 1, where the methods agree least, is also the least stable.",
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
        label: "Next steps",
        points: [
          "The monsoon index uses a proxy.",
          "NASA POWER precipitation can be added to refine it.",
        ],
      },
    ],
    recommendations: [
      {
        cluster: "Cluster 0 — Southern plains (TNP_0011 medoid)",
        pcm: "RT57HC (Rubitherm)",
        top2: "n-Hexacosane (C26)",
        top3: "PureTemp 58",
        tm: "56.5°C",
        latentHeat: "240 kJ/kg",
        mc: "W = 0.85",
        region: "46 points · 20.5 M people · n = 8 pool",
      },
      {
        cluster: "Cluster 1 — Western interior (TNP_0007 medoid)",
        pcm: "RT57HC (Rubitherm)",
        top2: "n-Hexacosane (C26)",
        top3: "n-Pentacosane (C25)",
        tm: "56.5°C",
        latentHeat: "240 kJ/kg",
        mc: "W = 0.48",
        region: "41 points · 20.4 M people · n = 10 pool",
      },
      {
        cluster: "Cluster 2 — North-east coast (TNP_0001 medoid)",
        pcm: "RT57HC (Rubitherm)",
        top2: "n-Pentacosane (C25) / n-Hexacosane (C26) (tied)",
        top3: "—",
        tm: "56.5°C",
        latentHeat: "240 kJ/kg",
        mc: "W = 0.78",
        region: "46 points · 30.3 M people · n = 8 pool",
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
        desc: "Candidate ranks for Cluster 1 (10 candidates), where the methods differ most (W = 0.48).",
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
        desc: "Simulated rank against MCDM consensus rank for the Top-3 candidates only (three points per cluster, jittered). Distance from the dashed line shows where the physics model orders the Top-3 differently.",
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
    tag: "80 Grid Points · k=3 Regimes · provisional ranking (feasibility method under revision)",
    stats: [
      { value: "80", label: "Population-Weighted Points (27 / 28 / 25 per cluster)" },
      { value: "k=3", label: "GMM Regimes (diagonal covariance, mean bootstrap ARI 0.694)" },
      { value: "9 / 9 / 9", label: "Candidates ranked per cluster (provisional)" },
      { value: "0.95", label: "Kendall's W in every cluster (four methods agree closely)" },
      { value: "93.0%", label: "Monte Carlo Top-3 inclusion of RT54HC" },
      { value: "RT54HC", label: "Borda Rank-1 Pick in all three clusters (provisional)" },
    ],
    overview: [
      "Assam has its own pipeline variant (Assam-specific scripts, an isolation-forest outlier step and a 50 °C delivery basis).",
      "80 population-weighted points are grouped into three regimes by a diagonal-covariance GMM.",
      "The latest run (2026-11-14) ranks 9 candidates per cluster with the four-method consensus: RT54HC first, savE® OM50 and RT55 tied for second.",
      "The ranking is the same in all three clusters, because the current feasibility rules do not depend on the cluster.",
      "The team's own review says the feasibility filter is being corrected, so this ranking is provisional.",
    ],
    spearmanSummary: "Not reported",
    verdict: "Provisional",
    verdictSub: "Feasibility method under revision; physics comparison not reported",
    notes: [
      {
        label: "Current ranking (2026-11-14)",
        points: [
          "9 candidates pass the current filter in each cluster against the 56 °C target.",
          "Consensus order: RT54HC (54 °C, 200 kJ/kg) first; savE® OM50 (50 °C) and RT55 (55 °C) tied second; RT64HC fourth; myristic acid fifth.",
          "TOPSIS, PROMETHEE II and VIKOR rank RT54HC first; GRA ranks RT55 first. Kendall's W is 0.95.",
          "All three clusters give the same ranking, so this run does not separate the Assam regimes.",
        ],
      },
      {
        label: "Monte Carlo stability (5,000 draws)",
        points: [
          "RT54HC stays in the Top-3 in 93.0% of draws; RT55 in 61.3% and savE® OM50 in 60.8%.",
          "The values are the same in every cluster, for the same reason as the ranking.",
        ],
      },
      {
        label: "Feasibility method under revision",
        points: [
          "The team's methodology review (ASSAM_OBJECTIVE1_CORRECTED_FEASIBILITY_METHODOLOGY.md) found that the current filter no longer applies the melting-window, latent-heat, charging, cycling and supercooling criteria. An earlier run on the same inputs kept 0 → 1 → 5 candidates; the current script keeps 49.",
          "It proposes two separate tracks: Path A, direct delivery at 50 °C, needs Tm ≥ 56 °C (50 °C + 6 K approach); Path B, preheating below 56 °C, needs an auxiliary heater that the project has not yet defined.",
          "Its preliminary screen gives 0 fully feasible, 51 conditional, 5 unverified and 2 rejected candidates per cluster, because corrosion, cycling and safety evidence is missing for most PCMs.",
          "The proposed method awaits the team's approval and is not yet implemented, so these counts are not used on this page.",
        ],
      },
      {
        label: "Physics comparison",
        points: [
          "Not reported for the current ranking: the existing comparison files still use the medoids of the older grid.",
          "Earlier Assam results (RT44HC first from a K = 4 run, and savE® OM49 first from a reference ranking) are superseded.",
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
        label: "Design basis and scope",
        points: [
          "Tm_target = 56 °C nominal (50 °C delivery + 6 K approach); 58-row PCM database.",
          "Medoids ASP_0003 / ASP_0036 / ASP_0080 are verified as the cluster medoids.",
          "No Köppen–Geiger or NBC/ECBC comparison exists for Assam.",
        ],
      },
    ],
    recommendations: [
      {
        cluster: "Cluster 0 (ASP_0003)",
        pcm: "RT54HC (provisional)",
        top2: "savE® OM50 / RT55 (tied)",
        top3: "—",
        tm: "54.0°C",
        latentHeat: "200 kJ/kg",
        mc: "W = 0.95 · MC Top-3 93.0%",
        region: "27 points · 13.2 M people · n = 9 pool",
      },
      {
        cluster: "Cluster 1 (ASP_0036)",
        pcm: "RT54HC (provisional)",
        top2: "savE® OM50 / RT55 (tied)",
        top3: "—",
        tm: "54.0°C",
        latentHeat: "200 kJ/kg",
        mc: "W = 0.95 · MC Top-3 93.0%",
        region: "28 points · 8.6 M people · n = 9 pool",
      },
      {
        cluster: "Cluster 2 (ASP_0080)",
        pcm: "RT54HC (provisional)",
        top2: "savE® OM50 / RT55 (tied)",
        top3: "—",
        tm: "54.0°C",
        latentHeat: "200 kJ/kg",
        mc: "W = 0.95 · MC Top-3 93.0%",
        region: "25 points · 8.9 M people · n = 9 pool",
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
        desc: "Ranks of the 9 candidates under each method and the Borda consensus (provisional).",
        interactive: "07_bump_chart_ranks_cluster_0.html",
        static: "07_bump_chart_ranks_cluster_0.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "as-07b",
        num: "07b",
        title: "Bump Chart — MCDM Ranks (Cluster 1)",
        desc: "Same chart for Cluster 1 (identical ranking).",
        interactive: "07_bump_chart_ranks_cluster_1.html",
        static: "07_bump_chart_ranks_cluster_1.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "as-07c",
        num: "07c",
        title: "Bump Chart — MCDM Ranks (Cluster 2)",
        desc: "Same chart for Cluster 2 (identical ranking).",
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
        id: "as-12",
        num: "12",
        title: "Tank Temperature & Melt-Fraction Profile",
        desc: "Illustrative tank temperature and PCM melt fraction against the 56 °C target.",
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
    tag: "45 Grid Points · k=4 Regimes · 57 °C design basis",
    stats: [
      { value: "45", label: "Population-Weighted Points (10 / 23 / 9 / 3 per cluster)" },
      { value: "k=4", label: "GMM Regimes (diagonal covariance, silhouette 0.362)" },
      { value: "29 / 29 / 29 / 30", label: "Candidates passing the feasibility filter (55-row database)" },
      { value: "0.80 / 0.80 / 0.78 / 0.84", label: "Kendall's W per Cluster" },
      { value: "+0.11 / −0.14 / −0.34 / −0.17", label: "Spearman ρ, MCDM rank vs. simulated rank" },
      { value: "PureTemp 58", label: "Borda Rank-1 Pick (C0 / C1 / C2); PureTemp 53 in C3" },
    ],
    overview: [
      "45 population-weighted points are clustered into four regimes, ordered from the warm plains (about 24.7 °C, 320 m) to the high Himalaya (about 13.8 °C, 2,220 m).",
      "K = 4 replaced the earlier K = 5 on 2026-11-13: it has the best Davies–Bouldin (0.935) and Calinski–Harabasz (28.9) scores of K = 2–10, a tied-best silhouette (0.362) and the most stable partition (subsample ARI 0.91, against 0.66 at K = 5).",
      "These are the same four regimes Objective 2 uses.",
      "Uttarakhand keeps the 57 °C design basis (50 °C delivery + 7 K approach); Rajasthan and Tamil Nadu use 67 °C. So its results are best compared within the state.",
      "The high-Himalaya cluster gets its own pick, PureTemp 53; the other three clusters share PureTemp 58.",
    ],
    spearmanSummary: "C0: +0.105 · C1: −0.140 · C2: −0.338 · C3: −0.168",
    verdict: "Exploratory",
    verdictSub: "p = 0.14–0.66; simulated solar fraction sits below the literature band",
    notes: [
      {
        label: "Design basis",
        points: [
          "Tm_target = 57.0 °C for Clusters 0 and 1, and 56.51 / 55.16 °C for Clusters 2 and 3 after the regime cap.",
          "L_required is 118 / 132 / 138 / 178 kJ/kg.",
          "Decided in 2026-11: Uttarakhand keeps the 50 °C delivery basis instead of moving to the 60 °C basis of Rajasthan and Tamil Nadu, which would need a full Objective 1 and 2 re-run.",
          "57 °C is below the 65 °C PCM limit used in Objective 2.",
        ],
      },
      {
        label: "Ranking result",
        points: [
          "Four-method Borda consensus {{cite:HwangYoon1981MADM}} over all survivors of each cluster.",
          "Clusters 0 and 1 have the same target and the same 29 survivors, so their Top-3 is identical (PureTemp 58 / n-Octacosane (C28) / PlusICE A58). They differ only in the physics simulation.",
          "Cluster 2's lower target changes its #2 and #3; Cluster 3's lower target changes its survivor set and its #1.",
          "VIKOR reports a compromise set rather than a single winner in Clusters 2 and 3.",
          "Kendall's W is 0.796 / 0.796 / 0.782 / 0.842, showing substantial agreement between the methods.",
        ],
      },
      {
        label: "Monte Carlo stability (2,000 draws per cluster)",
        points: [
          "n-Octacosane (C28) has the highest Top-3 inclusion in every cluster (36.4–39.3%).",
          "The best Top-1 retention is 16.3–18.6%, lower than in the other states because the feasible pool (29–30 candidates) is larger and more alike.",
        ],
      },
      {
        label: "Physics check (exploratory)",
        points: [
          "Spearman ρ is +0.105, −0.140, −0.338 and −0.168 for Clusters 0–3 (n = 20 each; p = 0.66, 0.56, 0.14, 0.48).",
          "Simulated solar fractions are about 19.1 / 20.2 / 15.9 / 12.0%, all below the 54–84% band {{cite:Singh2025PCMSWH}}.",
          "The high-Himalaya Cluster 3 never reaches the delivery target in the simulated year.",
          "Within a cluster the candidates give almost the same solar fraction, so the physics model barely separates them.",
        ],
      },
      {
        label: "Limitations",
        points: [
          "No committed bootstrap stability script and no Köppen–Geiger or NBC/ECBC comparison exist for Uttarakhand; K = 4 stability was checked once by hand.",
          "The weights are entropy weights blended with the stated priors (AHP_PRIOR); no AHP elicitation was done.",
          "The cards' medoids (UKP_0014 / 0029 / 0025 / 0041) differ from the physics run's medoids (UKP_0001 / 0004 / 0002 / 0023).",
        ],
      },
    ],
    recommendations: [
      {
        cluster: "Cluster 0 — Warm plains (UKP_0014)",
        pcm: "PureTemp 58",
        top2: "n-Octacosane (C28)",
        top3: "PlusICE A58",
        tm: "58.0°C",
        latentHeat: "225 kJ/kg",
        mc: "W = 0.80 · ρ = +0.105",
        region: "10 points · 3.7 M people",
      },
      {
        cluster: "Cluster 1 — Mid-hills (UKP_0029)",
        pcm: "PureTemp 58",
        top2: "n-Octacosane (C28)",
        top3: "PlusICE A58",
        tm: "58.0°C",
        latentHeat: "225 kJ/kg",
        mc: "W = 0.80 · ρ = −0.140",
        region: "23 points · 4.0 M people",
      },
      {
        cluster: "Cluster 2 — Higher valleys (UKP_0025)",
        pcm: "PureTemp 58",
        top2: "savE® OM55",
        top3: "n-Hexacosane (C26)",
        tm: "58.0°C",
        latentHeat: "225 kJ/kg",
        mc: "W = 0.78 · ρ = −0.338",
        region: "9 points · 2.5 M people",
      },
      {
        cluster: "Cluster 3 — High Himalaya (UKP_0041)",
        pcm: "PureTemp 53",
        top2: "n-Hexacosane (C26)",
        top3: "Myristic acid (C14)",
        tm: "53.0°C",
        latentHeat: "225 kJ/kg",
        mc: "W = 0.84 · ρ = −0.168",
        region: "3 points · 0.33 M people",
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
        title: "Climate Regime Map (Uttarakhand k=4)",
        desc: "45 population-weighted points assigned to four regimes by a diagonal-covariance GMM.",
        interactive: "02_climate_regime_map_interactive.html",
        static: "02_climate_regime_map.png",
        phase: "Phase 4 Clustering",
      },
      {
        id: "uk-07",
        num: "07",
        title: "Bump Chart — MCDM Ranks (all clusters)",
        desc: "Top candidates' ranks under each MCDM method and the Borda consensus; line style marks the cluster.",
        interactive: "07_bump_chart_ranks.html",
        static: "07_bump_chart_ranks.png",
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
        desc: "Simulated rank against MCDM rank for the Top-3 candidates only (three points per cluster). The ρ values in the legend are computed on those three points and differ from the validation ρ, which uses 20 candidates per cluster.",
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
    tag: "578 Grid Points · 13 Regimes · state-wise physics checks",
    notes: [
      {
        label: "Design bases differ by state",
        points: [
          "Rajasthan and Tamil Nadu use 60 °C delivery and a 67 °C Tm_target (capped per cluster).",
          "Uttarakhand uses 57 °C (50 °C delivery + 7 K) and Assam 56 °C (50 °C delivery + 6 K, capped to about 49–50 °C).",
          "Uttarakhand keeps its 50 °C basis by decision; moving either state to 60 °C would need a full re-run.",
          "Objective 2 scores delivery at 45 °C (50 °C for Uttarakhand), not at the Objective 1 basis.",
          "Compare Rank-1 picks and correlations within a state, not across states.",
        ],
      },
      {
        label: "Physics agreement by state",
        points: [
          "Rajasthan −0.200 / −0.168 / +0.569; Tamil Nadu −0.333 / +0.103 / +0.024.",
          "Uttarakhand +0.105 / −0.140 / −0.338 / −0.168 (none significant).",
          "Assam: not reported for its current, provisional ranking.",
          "Overall, agreement between the MCDM ranking and the physics model is weak and not statistically significant in every state where it was run, so predictive validity is not established.",
        ],
      },
      {
        label: "Scope of this page",
        points: [
          "Per state: points, regimes, candidates, Kendall's W, Spearman ρ and the Top-3.",
          "Plots: raw-vs-preprocessed radiation, the regime map, MCDM bump charts, the method-agreement heatmap, rank-reversal, the simulated-vs-MCDM agreement plot and the tank profile.",
          "Assam's ranking plots are from its provisional run; its physics-agreement plot is not shown.",
          "Omitted because only some states have them: seasonal re-ranking, the supercooling sweep, the Köppen check, survivors and recommendation summary charts.",
        ],
      },
      {
        label: "Cross-state comparison figures",
        points: [
          "The earlier eight comparison plots were based on Assam only or on pre-correction data.",
          "They are held back until regenerated from the corrected pipelines.",
        ],
      },
    ],
    stats: [
      { value: "4 States", label: "Tamil Nadu, Rajasthan, Assam, Uttarakhand" },
      { value: "578", label: "Total Population-Weighted Grid Points (320 + 133 + 45 + 80)" },
      { value: "10 Years", label: "Continuous Hourly ERA5 + POWER (2016–2025)" },
      { value: "13", label: "Climate Regimes (RJ 3 · TN 3 · UK 4 · AS 3)" },
      { value: "62", label: "Screened PCM Candidate Records (Uttarakhand: 55, Assam: 58)" },
      { value: "Mixed", label: "Physics agreement varies by state; see each state page" },
    ],
    overview: [
      "Objective 1 applies one pipeline to four Indian states: Rajasthan, Tamil Nadu, Uttarakhand and Assam.",
      "The pipeline covers population-weighted ERA5 and NASA POWER sampling, GMM regimes, eight-constraint PCM screening, four-method MCDM consensus and a lumped-enthalpy physics check.",
      "The states are at different stages, summarised below.",
    ],
    spearmanSummary: "RJ mixed · TN, UK exploratory · AS not reported",
    recommendations: [],
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
    values: { rajasthan: "320", tamilnadu: "133", uttarakhand: "45", assam: "80" },
  },
  {
    label: "Climate regimes (GMM)",
    values: { rajasthan: "3", tamilnadu: "3", uttarakhand: "4", assam: "3" },
  },
  {
    label: "Melting-point target",
    values: {
      rajasthan: "67 °C; capped 55.5 / 61.1 / 59.2 °C",
      tamilnadu: "67 °C (physics script uses a 50 °C delivery constant)",
      uttarakhand: "57 °C; capped 56.5 °C (C2) and 55.2 °C (C3)",
      assam: "56 °C; capped about 49–50 °C",
    },
  },
  {
    label: "Candidates ranked per cluster",
    values: {
      rajasthan: "4 / 8 / 11",
      tamilnadu: "8 / 10 / 8",
      uttarakhand: "29 / 29 / 29 / 30",
      assam: "9 / 9 / 9 (provisional)",
    },
  },
  {
    label: "Kendall's W (method agreement)",
    values: {
      rajasthan: "1.00 / 0.77 / 0.42",
      tamilnadu: "0.85 / 0.48 / 0.78",
      uttarakhand: "0.80 / 0.80 / 0.78 / 0.84",
      assam: "0.95 / 0.95 / 0.95",
    },
  },
  {
    label: "Spearman ρ, MCDM rank vs. simulated rank",
    values: {
      rajasthan: "−0.200 / −0.168 / +0.569",
      tamilnadu: "−0.333 / +0.103 / +0.024",
      uttarakhand: "+0.105 / −0.140 / −0.338 / −0.168",
      assam: "Not reported",
    },
  },
  {
    label: "Physics agreement (significance)",
    values: {
      rajasthan: "p = 0.80 / 0.69 / 0.067 vs. Borda; not established",
      tamilnadu: "p = 0.42 / 0.78 / 0.95; not significant",
      uttarakhand: "p = 0.66 / 0.56 / 0.14 / 0.48; not significant",
      assam: "Not reported",
    },
  },
  {
    label: "Rank-1 PCM",
    values: {
      rajasthan: "savE® OM55 / PureTemp 60 / palmitic-stearic acid with expanded graphite",
      tamilnadu: "RT57HC in all three clusters",
      uttarakhand: "PureTemp 58 (PureTemp 53 in Cluster 3, high Himalaya)",
      assam: "RT54HC in all three clusters (provisional)",
    },
  },
  {
    label: "Key note",
    values: {
      rajasthan: "Cluster 0 pool has 4 candidates; Cluster 2 has the widest spread between methods (W 0.42)",
      tamilnadu: "Physics comparison is exploratory (n = 8–10); Cluster 1 has the widest spread between methods (W 0.48)",
      uttarakhand: "57 °C basis; K = 4 since 2026-11-13; simulated solar fractions (12–20%) sit below the 54–84% band",
      assam: "Same ranking in every cluster; feasibility filter is being corrected, so the ranking is provisional",
    },
  },
];

/* Notes that restate the shared pipeline are dropped from the state tabs. */
const DROPPED_NOTE_LABELS = ["Ranking", "Preprocessing", "Plots"];

function stateNotes(key) {
  return (STATES_CONFIG[key].notes || []).filter((n) => !DROPPED_NOTE_LABELS.includes(n.label));
}


/* Plot types shown in the plot grid; a state shows only the types it has. */
const PLOT_TYPES = [
  { num: "01", title: "Raw vs. preprocessed radiation", caption: "Radiation and temperature before and after preprocessing at a sample point of each state." },
  { num: "02", title: "Climate regime map", caption: "Grid points coloured by the climate regime assigned by the Gaussian Mixture Model." },
  { num: "07a", title: "MCDM rank trajectories, Cluster 0", caption: "Each candidate's rank under TOPSIS, GRA, PROMETHEE II and VIKOR and in the Borda consensus (bump chart)." },
  { num: "07b", title: "MCDM rank trajectories, Cluster 1", caption: "Same chart for Cluster 1." },
  { num: "07c", title: "MCDM rank trajectories, Cluster 2", caption: "Same chart for Cluster 2." },
  { num: "07", title: "MCDM rank trajectories, all clusters", caption: "Each top candidate's rank under TOPSIS, GRA, PROMETHEE II and VIKOR and in the Borda consensus; line style marks the cluster." },
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
    },
  },
  { num: "12", title: "Tank temperature and melt-fraction profile", caption: "Simulated tank temperature and PCM melt fraction from the lumped-enthalpy model." },
];

function plotsForState(stateKey) {
  return PLOT_TYPES.filter((pt) => plotFor(stateKey, pt.num));
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

/* Plot groups for the filter chips. */
const PLOT_GROUPS = [
  { id: "all", label: "All plots" },
  { id: "data", label: "Data & preprocessing" },
  { id: "clustering", label: "Clustering" },
  { id: "mcdm", label: "MCDM ranking" },
  { id: "physics", label: "Physics check" },
];

function plotGroup(num) {
  if (num === "01") return "data";
  if (num === "02") return "clustering";
  if (num === "11" || num === "12") return "physics";
  return "mcdm";
}

const QC_NOTES = [
  "Shows record counts before and after cleaning (stage 2 of the pipeline).",
  "Cleaning uses Hampel filtering {{cite:Hampel1974InfluenceCurve}}, chained-equation imputation {{cite:vanBuuren2011MICE}} and quantile mapping {{cite:Cannon2015QuantileMapping}} against NASA POWER.",
  "The Rajasthan and Uttarakhand rows were re-checked against the 2026-10-25 quality-control reports (5 of 5 checks passed each).",
  "The Assam row was re-derived on 2026-11-11 from its QC report and cleaned file: the earlier counts (1,413,420 → 1,402,101) matched the old 129-point grid, not the current 80 points.",
  "The Tamil Nadu row was re-checked against its quality-control report (5 of 5 checks passed; 11,970 lag warm-up rows set aside).",
];

function Objective1Page() {
  resetTerms();
  const [tab, setTab] = useState("rajasthan");
  const [plotTab, setPlotTab] = useState("rajasthan");
  const [plotGroupId, setPlotGroupId] = useState("all");
  const [focusState, setFocusState] = useState(null);
  const current = STATES_CONFIG[tab];
  const revealRef = useReveal([tab, plotTab, plotGroupId]);

  const stateOptions = STATE_ORDER.map((k) => ({ id: k, label: STATES_CONFIG[k].name }));
  const visiblePlots = plotsForState(plotTab).filter((pt) => plotGroupId === "all" || plotGroup(pt.num) === plotGroupId);

  return (
    <section className="content animated-page" id="top" ref={revealRef}>
      {/* ── Hero ── */}
      <div className="page-hero">
        <div className="eyebrow">
          <span className="eyebrow-badge">Research Module · Objective 1</span>
          <span>Results by state</span>
        </div>
        <h1>Climate-Adaptive PCM Thermal Storage Selection</h1>
        <p className="section-desc" style={{ maxWidth: 760 }}>
          <Rich text={STATES_CONFIG.all.overview.join(" ")} />
        </p>
      </div>

      <StatTiles items={STATES_CONFIG.all.stats} />

      {/* ── Pipeline ── */}
      <div className="content-section" id="pipeline">
        <PipelineSection onObjective1 />
      </div>

      {/* ── State comparison ── */}
      <div className="content-section" id="comparison">
        <div className="plots-section-header">
          <h2>State Comparison</h2>
          <span className="plots-count-badge">4 States</span>
        </div>
        <p className="section-desc">
          The same measures for each state. Click a state's column header to highlight it; the design basis differs by state, so compare rows with care.
        </p>
        <div className="section-divider" />

        <div className="data-table-wrapper compare-table-wrapper">
          <table className="data-table compare-table">
            <thead>
              <tr>
                <th>Measure</th>
                {STATE_ORDER.map((k) => (
                  <th
                    key={k}
                    className={`col-select ${focusState === k ? "col-active" : ""}`}
                    onClick={() => setFocusState(focusState === k ? null : k)}
                    aria-pressed={focusState === k}
                  >
                    {STATES_CONFIG[k].name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.label}>
                  <td><Terms text={row.label} /></td>
                  {STATE_ORDER.map((k) => (
                    <td key={k} className={focusState === k ? "col-active" : ""}>{row.values[k]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Accordion
          defaultOpen={null}
          items={(STATES_CONFIG.all.notes || []).map((n) => ({ id: n.label, title: n.label, points: n.points }))}
        />
      </div>

      {/* ── Preprocessing ── */}
      <div className="content-section" id="preprocessing">
        <div className="plots-section-header">
          <h2>Preprocessing and Quality Control</h2>
          <span className="plots-count-badge">By State</span>
        </div>
        <p className="section-desc">Record counts before and after cleaning, and the quality-control result for each state.</p>
        <div className="section-divider" />

        <div className="ui-qc-grid">
          {PREPROCESSING_SUMMARY.map((row) => (
            <div key={row.state} className="ui-card">
              <div className="ui-panel-head" style={{ marginBottom: 6 }}>
                <h4 style={{ margin: 0 }}>{row.state}</h4>
                <span className={`ui-badge ${String(row.status).startsWith("PASS (5") || row.status === "PASS" ? "" : "amber"}`}>
                  {String(row.status).split(",")[0]}
                </span>
              </div>
              <div className="ui-qc-row"><span>Grid points</span><span>{row.gridPoints}</span></div>
              <div className="ui-qc-row"><span>Records in → out</span><span>{row.inputRecords} → {row.outputRecords}</span></div>
              <div className="ui-qc-row"><span>Retention</span><span>{row.retention}</span></div>
              <div className="ui-qc-row"><span>Missing after cleaning</span><span>{row.missingRate}</span></div>
            </div>
          ))}
        </div>

        <Accordion
          defaultOpen={null}
          items={[
            { id: "qc-notes", title: "How the table was checked", badge: `${QC_NOTES.length} notes`, points: QC_NOTES },
            {
              id: "qc-table",
              title: "Full quality-control table",
              children: (
                <div className="data-table-wrapper" style={{ margin: 0 }}>
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
                          <td>{row.inputDims} → {row.outputDims}</td>
                          <td>{row.engineeredFeatures}</td>
                          <td>{row.missingRate}</td>
                          <td>{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* ── Results by state ── */}
      <div className="content-section" id="state-results">
        <div className="plots-section-header">
          <h2>Results by State</h2>
        </div>
        <p className="section-desc">Pick a state to see its headline numbers, the Top-3 PCMs for each climate regime and its notes.</p>
        <div className="section-divider" />

        <ChipTabs size="lg" ariaLabel="State" options={stateOptions} value={tab} onChange={setTab} />

        <div key={tab} className="tab-panel">
          <div className="ui-state-head">
            <h3>{current.name}</h3>
            <span className="ui-state-type">{current.climateType}</span>
            <span className="tag tag-zinc">{current.tag}</span>
          </div>

          <StatTiles compact items={current.stats} />

          <Callout title={`${current.name} at a glance`}>
            <Bullets items={current.overview} />
          </Callout>

          <h3 style={{ marginTop: 24 }}>Top-3 PCMs per climate regime</h3>
          <div className="ui-cluster-grid">
            {current.recommendations.map((r) => (
              <div key={r.cluster} className="ui-card ui-cluster-card">
                <h4>{r.cluster}</h4>
                <Podium first={r.pcm} second={r.top2} third={r.top3} />
                <div className="ui-cluster-props">
                  <div><span>Melting point</span><span>{r.tm}</span></div>
                  <div><span>Latent heat</span><span>{r.latentHeat}</span></div>
                  <div className="wide"><span>Method agreement · physics</span><span>{r.mc}</span></div>
                  <div className="wide"><span>Coverage</span><span>{r.region}</span></div>
                </div>
              </div>
            ))}
          </div>

          <h3>Notes for {current.name}</h3>
          <Accordion
            defaultOpen={0}
            items={stateNotes(tab).map((n) => ({ id: n.label, title: n.label, badge: `${n.points.length}`, points: n.points }))}
          />
        </div>
      </div>

      {/* ── Plots ── */}
      <div className="content-section" id="plots">
        <div className="plots-section-header">
          <h2>Plots Across States</h2>
          <span className="plots-count-badge">{visiblePlots.length} Plots</span>
        </div>
        <p className="section-desc">
          Pick a state and a stage. Click a plot to enlarge it; "Interactive view" opens the interactive version and "New tab" opens it separately.
        </p>
        <div className="section-divider" />

        <ChipTabs size="lg" ariaLabel="State for plots" options={stateOptions} value={plotTab} onChange={setPlotTab} />
        <ChipTabs ariaLabel="Plot stage" options={PLOT_GROUPS} value={plotGroupId} onChange={setPlotGroupId} />

        {visiblePlots.length === 0 && (
          <Callout title="No plots for this stage">
            {STATES_CONFIG[plotTab].name} has no plots in this stage yet.
          </Callout>
        )}

        <div key={`${plotTab}-${plotGroupId}`} className="plot-grid plot-grid-wide tab-panel">
          {visiblePlots.map((pt) => {
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
