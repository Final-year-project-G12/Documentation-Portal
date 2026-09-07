import { useState } from "react";

/* ─────────────────────────────────────────────────────────
   Presentation & Project Information (From Review 2 Deck)
   ───────────────────────────────────────────────────────── */
const PROJECT_INFO = {
  title: "Climate-Adaptive Intelligent Control and Optimization of PCM Thermal Storage for Solar Water Heating",
  course: "23CSE498 — Project Phase 2 (Panel Review 2)",
  group: "Group 12",
  date: "September 7, 2026",
  guide: "Dr. T. Deepika, Assistant Professor (Sr. Gd.), Department of CSE",
  team: [
    "Manduva Jaswita",
    "Dungi Manvitha",
    "Duddekunta Yuva Hasini",
    "Chiruvolu Venkata Khyathi",
    "K P N L K Mahitha",
  ],
  status: "Objective 1 (100% Complete) · Objective 2 (~92% Near-Complete) · Phase 2 Verified",
};

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
    inputRecords: "500,000",
    outputRecords: "200,000",
    retention: "40.0% (3-Window)",
    inputDims: 37,
    outputDims: 90,
    engineeredFeatures: 45,
    missingRate: "0.00%",
    status: "PASS",
  },
  {
    state: "Assam",
    tag: "Subtropical",
    gridPoints: 129,
    inputRecords: "10-Yr Decadal",
    outputRecords: "129 Signatures",
    retention: "100.0%",
    inputDims: 20,
    outputDims: 20,
    engineeredFeatures: 20,
    missingRate: "0.00%",
    status: "PASS",
  },
  {
    state: "Uttarakhand",
    tag: "Montane",
    gridPoints: 45,
    inputRecords: "493,155",
    outputRecords: "489,105",
    retention: "99.2%",
    inputDims: 36,
    outputDims: 89,
    engineeredFeatures: 45,
    missingRate: "0.00%",
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
    icon: "🏜️",
    climateType: "Hot Arid & Semi-Arid (Western India)",
    tag: "320 Grid Points · K=3 Regimes",
    stats: [
      { value: "320", label: "Population-Weighted Points" },
      { value: "10yr", label: "ERA5 + NASA POWER Coverage" },
      { value: "k=3", label: "GMM Regimes (Thar / Southern / Shekhawati)" },
      { value: "39", label: "PCM Survivors (of 62 evaluated)" },
      { value: "0.582", label: "Kendall's W Concordance" },
      { value: "savE® OM50", label: "Consensus Rank 1 Pick (C1/C2)" },
    ],
    overview:
      "Rajasthan exhibits pronounced continental diurnal swings with noon GHI exceeding 950–1050 W/m² and arid humidity conditions (<25% in Thar). GMM clustering identifies three distinct regimes: Cluster 0 (Southern plateau), Cluster 1 (Thar desert core), and Cluster 2 (North-East Shekhawati). Feasibility screening filters 62 candidates down to 39 survivors under κ-calibrated thresholds.",
    spearmanSummary: "C0: −0.385 (honest supercooling mismatch) · C1: +0.125 · C2: −0.097",
    recommendations: [
      {
        cluster: "Cluster 0 — Southern Block",
        pcm: "RT50 (Rubitherm)",
        tm: "50.0°C",
        latentHeat: "168 kJ/kg",
        mc: "90.8% (Top-3)",
        region: "Southern Plateau / Udaipur / Kota",
      },
      {
        cluster: "Cluster 1 — Thar Arid Belt",
        pcm: "savE® OM50 (Pluss)",
        tm: "50.0°C",
        latentHeat: "218 kJ/kg",
        mc: "83.2% (Top-3)",
        region: "Western Desert / Jaisalmer / Jodhpur",
      },
      {
        cluster: "Cluster 2 — North-East Shekhawati",
        pcm: "savE® OM50 (Pluss)",
        tm: "50.0°C",
        latentHeat: "218 kJ/kg",
        mc: "93.9% (Top-3)",
        region: "North-East / Jaipur / Bikaner / Alwar",
      },
    ],
    plots: [
      {
        id: "rj-01",
        num: "01",
        title: "Raw vs. Preprocessed Radiation (Rajasthan)",
        desc: "GHI before and after Hampel filtering (Point RJP_0001). GHI is deliberately preserved because cloudy dips are genuine physical phenomena; ambient temperature shows effective tail-trimming.",
        interactive: "01_raw_vs_preprocessed_radiation_interactive.html",
        static: "01_raw_vs_preprocessed_radiation.png",
        phase: "Phase 2–3 Preprocessing",
      },
      {
        id: "rj-02",
        num: "02",
        title: "Climate Regime Map (GMM k=3)",
        desc: "320 population-weighted sampling coordinates partitioned into 3 GMM regimes: Cluster 1 (Arid Thar), Cluster 2 (Shekhawati), Cluster 0 (Southern).",
        interactive: "02_climate_regime_map_interactive.html",
        static: "02_climate_regime_map.png",
        phase: "Phase 4 Clustering",
      },
      {
        id: "rj-03",
        num: "03",
        title: "Melting Point vs. Latent Heat Distribution",
        desc: "Full 62-candidate PCM pool with melting window [44–73°C] highlighted. Surviving candidates comfortably exceed the 100 kJ/kg storage floor.",
        interactive: "03_melting_point_vs_latent_heat_interactive.html",
        static: "03_melting_point_vs_latent_heat.png",
        phase: "Phase 5 Feasibility",
      },
      {
        id: "rj-04",
        num: "04",
        title: "Feasible Candidates Highlighted",
        desc: "Visual representation of the 8-filter feasibility triage (melting window, cycling, safety, corrosion veto).",
        interactive: null,
        static: "04_feasible_candidates_highlighted.png",
        phase: "Phase 5 Feasibility",
      },
      {
        id: "rj-05",
        num: "05",
        title: "PCM Survivors per Climate Regime",
        desc: "Distribution of surviving candidates: 9 in C0, 14 in C1, and 16 in C2 across baseline vs. κ-calibrated thresholds.",
        interactive: "05_pcm_survivors_per_cluster_interactive.html",
        static: "05_pcm_survivors_per_cluster.png",
        phase: "Phase 5 Feasibility",
      },
      {
        id: "rj-07a",
        num: "07a",
        title: "Bump Chart — MCDM Ranks (Cluster 0)",
        desc: "MCDM rank trajectories across TOPSIS, PROMETHEE II, VIKOR, GRA, and Borda consensus. RT50 achieves Rank 1 under three out of four methods.",
        interactive: "07_bump_chart_ranks_cluster_0.html",
        static: "07_bump_chart_ranks_cluster_0.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "rj-07b",
        num: "07b",
        title: "Bump Chart — MCDM Ranks (Cluster 1)",
        desc: "savE® OM50 dominates Cluster 1 under TOPSIS, PROMETHEE II, and VIKOR, demonstrating robust concordance.",
        interactive: "07_bump_chart_ranks_cluster_1.html",
        static: "07_bump_chart_ranks_cluster_1.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "rj-08",
        num: "08",
        title: "Method Rank Correlation Heatmap",
        desc: "Pairwise Spearman ρ and Kendall τ across MCDM methods. Strongest synergy observed between TOPSIS and PROMETHEE II (ρ ≈ 0.84).",
        interactive: "08_method_rank_correlation_heatmap_interactive.html",
        static: "08_method_rank_correlation_heatmap.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "rj-09",
        num: "09",
        title: "Monte Carlo Top-3 Inclusion Probability",
        desc: "Probabilistic rank stability across 1,000 Dirichlet weight draws and Gaussian property perturbations. savE® OM50 achieves >90% stability.",
        interactive: "09_monte_carlo_top3_probability_interactive.html",
        static: "09_monte_carlo_top3_probability.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "rj-10",
        num: "10",
        title: "Rank-Reversal Frequency Distribution",
        desc: "Violin and bar profiles evaluating rank-inversion sensitivity across candidate pairs under noisy inputs.",
        interactive: "10_rank_reversal_violin_interactive.html",
        static: "10_rank_reversal_violin_bar.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "rj-11",
        num: "11",
        title: "Agreement Plot — Physics Simulation vs. MCDM Rank",
        desc: "Grey-box lumped-enthalpy tank performance vs. MCDM consensus rank. Highlights honest negative correlation in C0 (ρ = −0.385).",
        interactive: "11_agreement_plot_interactive.html",
        static: "11_agreement_plot.png",
        phase: "Phase 7 Physics",
      },
      {
        id: "rj-12",
        num: "12",
        title: "Tank Temperature & Melt-Fraction Diurnal Profile",
        desc: "Dynamic phase-change diurnal simulation illustrating charging during peak GHI and sensible+latent discharge overnight.",
        interactive: "12_tank_temperature_melt_fraction_interactive.html",
        static: "12_tank_temperature_melt_fraction.png",
        phase: "Phase 7 Physics",
      },
      {
        id: "rj-13",
        num: "13",
        title: "Recommended PCM Summary Dashboard",
        desc: "Executive multi-cluster recommendation card showing top candidate properties and operational guidelines.",
        interactive: "13_recommended_pcm_summary_interactive.html",
        static: "13_recommended_pcm_summary.png",
        phase: "Phase 8 Output",
      },
    ],
  },

  tamilnadu: {
    name: "Tamil Nadu",
    short: "TN",
    icon: "🌴",
    climateType: "Tropical Maritime & Semi-Arid (Southern India · Lead Pipeline State)",
    tag: "133 Grid Points · K=5 Regimes · End-to-End Verified",
    stats: [
      { value: "133", label: "Population-Weighted Points" },
      { value: "1.44M", label: "Verified Clean Records (99.2% retention)" },
      { value: "k=5", label: "GMM Regimes (Coastal, Plains, Ghats, Delta, South)" },
      { value: "15 / 9", label: "Screened Survivors (C0 / C1)" },
      { value: "0.842", label: "Kendall's W (Strong 4-Method Concordance)" },
      { value: "n-Octacosane", label: "Consensus Rank 1 Pick (71% Solar Fraction)" },
    ],
    overview:
      "Tamil Nadu serves as the lead verified state in Objective 1 (v3.2) and the foundational testbed for Objective 2's surrogate design model. With 1,445,577 cleaned records spanning 10 years, 5 distinct climate regimes were identified via BIC-optimal GMM. Physics validation using the 2-node lumped enthalpy model yields a strong positive correlation in Cluster 1 (ρ = +0.717, p = 0.030) with 41% of simulations inside the 54–84% solar fraction benchmark.",
    spearmanSummary: "Mean ρ = +0.177 across all clusters · Cluster 1: ρ = +0.717 (p = 0.030)",
    recommendations: [
      {
        cluster: "Cluster 0 — Coastal / Chennai Metropole",
        pcm: "n-Octacosane (C28)",
        tm: "61.6°C",
        latentHeat: "253 kJ/kg",
        mc: "76.8% (Top-3)",
        region: "Coastal Plain / Chennai (12.6M Pop)",
      },
      {
        cluster: "Cluster 1 — Inland Plains / Salem & Coimbatore",
        pcm: "n-Octacosane (C28) / RT64HC",
        tm: "61.6°C / 64.0°C",
        latentHeat: "253 / 250 kJ/kg",
        mc: "90.2% (Top-3)",
        region: "Interior Plains (19.8M Pop)",
      },
      {
        cluster: "Cluster 2 — Delta & Central Agro-Belt",
        pcm: "RT64HC (Rubitherm)",
        tm: "64.0°C",
        latentHeat: "250 kJ/kg",
        mc: "88.4% (Top-3)",
        region: "Cauvery Delta / Thanjavur / Trichy",
      },
      {
        cluster: "Cluster 3 — Southern Dry Zone / Madurai",
        pcm: "RT35 / PureTemp 58",
        tm: "35.0°C / 58.0°C",
        latentHeat: "240 / 225 kJ/kg",
        mc: "81.5% (Top-3)",
        region: "Southern Plains / Madurai / Tirunelveli",
      },
      {
        cluster: "Cluster 4 — Western Ghats / Nilgiris Highland",
        pcm: "PureTemp 58 (Bio-based)",
        tm: "58.0°C",
        latentHeat: "225 kJ/kg",
        mc: "85.0% (Top-3)",
        region: "High Altitude / Ooty / Nilgiris",
      },
    ],
    plots: [
      {
        id: "tn-01",
        num: "01",
        title: "Raw vs. Preprocessed Radiation (Tamil Nadu)",
        desc: "Solar radiation series at medoid TNP_0001 (13.125°N, 80.125°E) across 10 years, showing physical range bounding and deaccumulated hourly SSRD fluxes.",
        interactive: "01_raw_vs_preprocessed_radiation_interactive.html",
        static: "01_raw_vs_preprocessed_radiation.png",
        phase: "Phase 2–3 Preprocessing",
      },
      {
        id: "tn-02",
        num: "02",
        title: "Climate Regime Map (Tamil Nadu k=5)",
        desc: "Interactive spatial clustering of 133 population points into Coastal, Plains, Delta, Southern, and Nilgiris Highland zones.",
        interactive: "02_climate_regime_map_interactive.html",
        static: "02_climate_regime_map.png",
        phase: "Phase 4 Clustering",
      },
      {
        id: "tn-03",
        num: "03",
        title: "Melting Point vs. Latent Heat Distribution",
        desc: "Candidate database mapping against Tamil Nadu's high-temperature storage targets (Tm_target = 57.0°C, L_req = 301–322 kJ/kg).",
        interactive: "03_melting_point_vs_latent_heat_interactive.html",
        static: "03_melting_point_vs_latent_heat.png",
        phase: "Phase 5 Feasibility",
      },
      {
        id: "tn-04",
        num: "04",
        title: "Feasible Candidates Highlighted",
        desc: "Hard constraint filtering results showing survivors in the target latent heat and melting temperature band.",
        interactive: null,
        static: "04_feasible_candidates_highlighted.png",
        phase: "Phase 5 Feasibility",
      },
      {
        id: "tn-05",
        num: "05",
        title: "PCM Survivors per Climate Regime",
        desc: "Screened survivor counts across Tamil Nadu's 5 regimes, with 15 survivors in Coastal Cluster 0 and 9 in Plains Cluster 1.",
        interactive: "05_pcm_survivors_per_cluster_interactive.html",
        static: "05_pcm_survivors_per_cluster.png",
        phase: "Phase 5 Feasibility",
      },
      {
        id: "tn-07",
        num: "07",
        title: "Bump Chart — MCDM Rank Trajectory (Cluster 0)",
        desc: "PCM Rank evolution across TOPSIS, GRA, PROMETHEE II, and VIKOR. n-Octacosane (C28) and n-Hexacosane (C26) maintain ranks 1 and 2.",
        interactive: "07_bump_chart_ranks.html",
        static: "07_bump_chart_ranks.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "tn-08",
        num: "08",
        title: "Method Rank Correlation Heatmap",
        desc: "Spearman rank concordance matrix demonstrating strong agreement (Kendall's W = 0.842 in C0, 0.956 in C1).",
        interactive: "08_method_rank_correlation_heatmap_interactive.html",
        static: "08_method_rank_correlation_heatmap.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "tn-09",
        num: "09",
        title: "Monte Carlo Top-3 Inclusion Probability",
        desc: "Robustness check under 1,000 Dirichlet noise iterations; n-Octacosane demonstrates 76.8% (C0) and 90.2% (C1) inclusion certainty.",
        interactive: null,
        static: "09_monte_carlo_top3_probability.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "tn-10",
        num: "10",
        title: "Rank-Reversal Frequency Analysis",
        desc: "Violin profile showing minimal probability of rank reversal among top-tier candidate pairs.",
        interactive: "10_rank_reversal_violin_interactive.html",
        static: "10_rank_reversal_violin_bar.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "tn-11",
        num: "11",
        title: "Agreement Plot — Physics Performance vs. MCDM Rank",
        desc: "Simulated annual solar fraction vs. MCDM Borda rank. Verified ρ = +0.717 in Cluster 1, with 41% inside the benchmark band (Slide 17/19).",
        interactive: "11_agreement_plot_interactive.html",
        static: "11_agreement_plot.png",
        phase: "Phase 7 Physics",
      },
      {
        id: "tn-12",
        num: "12",
        title: "Tank Temperature & Melt-Fraction Diurnal Profile",
        desc: "Diurnal temperature evolution and melt-fraction curves over 10-year medoid weather driving cycles.",
        interactive: "12_tank_temperature_melt_fraction_interactive.html",
        static: "12_tank_temperature_melt_fraction.png",
        phase: "Phase 7 Physics",
      },
      {
        id: "tn-13",
        num: "13",
        title: "Recommended PCM Summary Dashboard",
        desc: "Final recommendation synthesis for Tamil Nadu across all 5 discovered regimes.",
        interactive: "13_recommended_pcm_summary_interactive.html",
        static: "13_recommended_pcm_summary.png",
        phase: "Phase 8 Output",
      },
    ],
  },

  assam: {
    name: "Assam",
    short: "AS",
    icon: "🌿",
    climateType: "Humid Subtropical & Monsoonal (North-East India)",
    tag: "129 Grid Points · K=3 Regimes · 100% Complete",
    stats: [
      { value: "129", label: "Population-Weighted Points" },
      { value: "100%", label: "Data Completeness (0.00% Missing)" },
      { value: "k=3", label: "GMM Regimes (Brahmaputra Valley, Upper, Barak)" },
      { value: "34", label: "Feasible Candidates Screened" },
      { value: "0.784", label: "Kendall's W Concordance" },
      { value: "RT44HC", label: "Consensus Rank 1 Pick (High Latent Heat)" },
    ],
    overview:
      "Assam represents a humid subtropical regime with prolonged monsoon cloud cover, high atmospheric attenuation, and mean relative humidity exceeding 70%. The pipeline aggregates 129 population-weighted locations with 100% data completeness (0.00% missing). Medoid-anchored K=3 clustering isolates Lower Brahmaputra Valley, Upper Assam, and Barak Valley. Paraffin-based PCMs (RT44HC, RT45HC, and C22H46) emerge as unanimous leaders.",
    spearmanSummary: "Positive agreement in valley clusters · Moderate attenuation during monsoon months",
    recommendations: [
      {
        cluster: "Cluster 0 — Lower Brahmaputra Valley",
        pcm: "RT44HC (Paraffin)",
        tm: "44.0°C",
        latentHeat: "250 kJ/kg",
        mc: "86.4% (Top-3)",
        region: "Guwahati / Kamrup / Goalpara",
      },
      {
        cluster: "Cluster 1 — Upper Assam Tea Belt",
        pcm: "RT45HC (Paraffin)",
        tm: "45.0°C",
        latentHeat: "240 kJ/kg",
        mc: "82.1% (Top-3)",
        region: "Dibrugarh / Jorhat / Tinsukia",
      },
      {
        cluster: "Cluster 2 — Barak Valley & Southern Hills",
        pcm: "C22H46 (Docosane Class)",
        tm: "44.4°C",
        latentHeat: "249 kJ/kg",
        mc: "79.5% (Top-3)",
        region: "Silchar / Cachar / Karimganj",
      },
    ],
    plots: [
      {
        id: "as-01",
        num: "01",
        title: "Raw vs. Preprocessed Radiation (Assam)",
        desc: "Solar radiation signature distribution across Assam's 129 population coordinates, demonstrating cloud-attenuated monsoonal profiles.",
        interactive: "01_raw_vs_preprocessed_radiation_interactive.html",
        static: "01_raw_vs_preprocessed_radiation.png",
        phase: "Phase 2–3 Preprocessing",
      },
      {
        id: "as-02",
        num: "02",
        title: "Climate Regime Map (Assam k=3)",
        desc: "Spatial geographic mapping of 129 points into 3 coherent valley regimes (Cluster 0: Lower Brahmaputra, Cluster 1: Upper Assam, Cluster 2: Barak Valley).",
        interactive: "02_climate_regime_map_interactive.html",
        static: "02_climate_regime_map.png",
        phase: "Phase 4 Clustering",
      },
      {
        id: "as-03",
        num: "03",
        title: "Melting Point vs. Latent Heat Distribution",
        desc: "Screening of PCM candidates against Assam's lower ambient temperature and moderate hot water delivery thresholds.",
        interactive: "03_melting_point_vs_latent_heat_interactive.html",
        static: "03_melting_point_vs_latent_heat.png",
        phase: "Phase 5 Feasibility",
      },
      {
        id: "as-04",
        num: "04",
        title: "Feasible Candidates Highlighted",
        desc: "Constraint boundary visualization highlighting surviving paraffin and organic PCM candidates.",
        interactive: null,
        static: "04_feasible_candidates_highlighted.png",
        phase: "Phase 5 Feasibility",
      },
      {
        id: "as-05",
        num: "05",
        title: "PCM Survivors per Climate Regime",
        desc: "Survival numbers per cluster under rigorous supercooling, cycling, and latent heat floor checks.",
        interactive: "05_pcm_survivors_per_cluster_interactive.html",
        static: "05_pcm_survivors_per_cluster.png",
        phase: "Phase 5 Feasibility",
      },
      {
        id: "as-07",
        num: "07",
        title: "Bump Chart — MCDM Rank Evolution",
        desc: "Bump chart tracing candidate rankings across TOPSIS, GRA, PROMETHEE II, and VIKOR for Assam clusters.",
        interactive: "07_bump_chart_ranks.html",
        static: "07_bump_chart_ranks.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "as-08",
        num: "08",
        title: "Method Rank Correlation Heatmap",
        desc: "Pairwise rank concordance illustrating solid consensus across distance-based and outranking MCDM families.",
        interactive: "08_method_rank_correlation_heatmap_interactive.html",
        static: "08_method_rank_correlation_heatmap.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "as-09",
        num: "09",
        title: "Monte Carlo Top-3 Inclusion Probability",
        desc: "Probabilistic sensitivity testing under 1,000 randomized weightings for Assam candidate survivors.",
        interactive: null,
        static: "09_monte_carlo_top3_probability.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "as-10",
        num: "10",
        title: "Rank-Reversal Frequency Analysis",
        desc: "Violin plot of rank stability verifying low reversal risk for RT44HC and RT45HC.",
        interactive: "10_rank_reversal_violin_interactive.html",
        static: "10_rank_reversal_violin_bar.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "as-11",
        num: "11",
        title: "Agreement Plot — Physics vs. MCDM Rank",
        desc: "Simulated performance versus MCDM consensus rank per climate regime in Assam (Slide 19).",
        interactive: "11_agreement_plot_interactive.html",
        static: "11_agreement_plot.png",
        phase: "Phase 7 Physics",
      },
      {
        id: "as-12",
        num: "12",
        title: "Tank Temperature & Melt-Fraction Diurnal Profile",
        desc: "Simulated charging and phase transitions under typical humid subtropical solar radiation regimes.",
        interactive: "12_tank_temperature_melt_fraction_interactive.html",
        static: "12_tank_temperature_melt_fraction.png",
        phase: "Phase 7 Physics",
      },
      {
        id: "as-13",
        num: "13",
        title: "Recommended PCM Summary Dashboard",
        desc: "Comprehensive recommendation cards for Assam's 3 agro-climatic zones.",
        interactive: "13_recommended_pcm_summary_interactive.html",
        static: "13_recommended_pcm_summary.png",
        phase: "Phase 8 Output",
      },
    ],
  },

  uttarakhand: {
    name: "Uttarakhand",
    short: "UK",
    icon: "🏔️",
    climateType: "Montane & Alpine Foothills (Northern Himalayan India)",
    tag: "45 Grid Points · K=5 Regimes · Sub-Zero Protection",
    stats: [
      { value: "45", label: "Population-Weighted Points" },
      { value: "489,105", label: "Clean Records (99.2% Retention)" },
      { value: "k=5", label: "GMM Regimes (Tarai, Mid-Hills, High Altitude)" },
      { value: "28", label: "Feasible Candidates Screened" },
      { value: "0.812", label: "Kendall's W Concordance" },
      { value: "RT60", label: "Consensus Rank 1 Pick (High Tm Defense)" },
    ],
    overview:
      "Uttarakhand presents steep elevation gradients from the fertile Tarai foothills (~300m) to high-altitude Himalayan valleys (>2500m). Winter freezing, high Heating Degree Days (HDD18), and sub-zero night temperatures necessitate higher melting point PCM candidates (55–60°C) to prevent storage freeze-out and maintain hot water supply. GMM clustering identifies 5 elevation-driven regimes, with RT60, savE® OM55, and PureTemp 58 leading.",
    spearmanSummary: "Strong thermal validation under freezing winters · Anti-freeze constraint active",
    recommendations: [
      {
        cluster: "Cluster 0 — Tarai Plains / Haridwar & Udham Singh Nagar",
        pcm: "RT60 (Rubitherm)",
        tm: "60.0°C",
        latentHeat: "160 kJ/kg",
        mc: "88.2% (Top-3)",
        region: "Southern Plains / Haridwar",
      },
      {
        cluster: "Cluster 1 — Doon Valley / Dehradun Sub-Himalayan",
        pcm: "savE® OM55 (Pluss)",
        tm: "55.0°C",
        latentHeat: "205 kJ/kg",
        mc: "84.5% (Top-3)",
        region: "Doon Valley / Dehradun",
      },
      {
        cluster: "Cluster 2 — Lesser Himalaya / Nainital & Almora",
        pcm: "PureTemp 58 (Bio-based)",
        tm: "58.0°C",
        latentHeat: "225 kJ/kg",
        mc: "81.0% (Top-3)",
        region: "Kumaon Mid-Hills / Nainital",
      },
      {
        cluster: "Cluster 3 — Garhwal Mid-Hills / Tehri & Pauri",
        pcm: "Palmitic-stearic acid / EG composite",
        tm: "56.8°C",
        latentHeat: "192 kJ/kg",
        mc: "78.4% (Top-3)",
        region: "Garhwal Foothills / Pauri",
      },
      {
        cluster: "Cluster 4 — High Alpine / Chamoli & Uttarkashi",
        pcm: "RT60 (Rubitherm)",
        tm: "60.0°C",
        latentHeat: "160 kJ/kg",
        mc: "89.1% (Top-3)",
        region: "High Altitude / Chamoli",
      },
    ],
    plots: [
      {
        id: "uk-01",
        num: "01",
        title: "Raw vs. Preprocessed Radiation (Uttarakhand)",
        desc: "GHI series across Uttarakhand's 45 coordinates (UKP_0001), showing severe elevation-dependent clear sky radiation contrasted with mountain winter fog.",
        interactive: "01_raw_vs_preprocessed_radiation_interactive.html",
        static: "01_raw_vs_preprocessed_radiation.png",
        phase: "Phase 2–3 Preprocessing",
      },
      {
        id: "uk-02",
        num: "02",
        title: "Climate Regime Map (Uttarakhand k=5)",
        desc: "Elevation-driven GMM zoning clustering 45 sampling points across Tarai, Shivalik, Mid-Hills, and Greater Himalayan regions.",
        interactive: "02_climate_regime_map_interactive.html",
        static: "02_climate_regime_map.png",
        phase: "Phase 4 Clustering",
      },
      {
        id: "uk-03",
        num: "03",
        title: "Melting Point vs. Latent Heat Distribution",
        desc: "Candidate distribution showing higher Tm threshold requirements (≥55°C) to withstand mountain cold snaps.",
        interactive: "03_melting_point_vs_latent_heat_interactive.html",
        static: "03_melting_point_vs_latent_heat.png",
        phase: "Phase 5 Feasibility",
      },
      {
        id: "uk-04",
        num: "04",
        title: "Feasible Candidates Highlighted",
        desc: "Feasibility envelope identifying candidate survivors capable of handling mountain diurnal freezing.",
        interactive: null,
        static: "04_feasible_candidates_highlighted.png",
        phase: "Phase 5 Feasibility",
      },
      {
        id: "uk-05",
        num: "05",
        title: "PCM Survivors per Climate Regime",
        desc: "Screened survivor numbers per cluster across Uttarakhand's 5 elevation zones.",
        interactive: "05_pcm_survivors_per_cluster_interactive.html",
        static: "05_pcm_survivors_per_cluster.png",
        phase: "Phase 5 Feasibility",
      },
      {
        id: "uk-07",
        num: "07",
        title: "Bump Chart — MCDM Rank Trajectory",
        desc: "Ranking trajectories across TOPSIS, GRA, PROMETHEE II, and VIKOR for Uttarakhand's high-temperature candidates.",
        interactive: "07_bump_chart_ranks.html",
        static: "07_bump_chart_ranks.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "uk-08",
        num: "08",
        title: "Method Rank Correlation Heatmap",
        desc: "Spearman rank correlation heatmap across MCDM methods for Uttarakhand regimes (Kendall's W = 0.812).",
        interactive: "08_method_rank_correlation_heatmap_interactive.html",
        static: "08_method_rank_correlation_heatmap.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "uk-09",
        num: "09",
        title: "Monte Carlo Top-3 Inclusion Probability",
        desc: "Probability of Top-3 selection over 1,000 Dirichlet weight simulations for montane PCM selections.",
        interactive: null,
        static: "09_monte_carlo_top3_probability.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "uk-10",
        num: "10",
        title: "Rank-Reversal Frequency Analysis",
        desc: "Violin profile confirming low rank-reversal frequency under noisy property estimates.",
        interactive: "10_rank_reversal_violin_interactive.html",
        static: "10_rank_reversal_violin_bar.png",
        phase: "Phase 6 MCDM",
      },
      {
        id: "uk-11",
        num: "11",
        title: "Agreement Plot — Physics Performance vs. MCDM Rank",
        desc: "Grey-box simulated thermal delivery vs. MCDM consensus rank for Uttarakhand elevation regimes (Slide 19).",
        interactive: "11_agreement_plot_interactive.html",
        static: "11_agreement_plot.png",
        phase: "Phase 7 Physics",
      },
      {
        id: "uk-12",
        num: "12",
        title: "Tank Temperature & Melt-Fraction Diurnal Profile",
        desc: "Simulation under cold ambient temperatures showing phase transition stability without sub-zero freezing.",
        interactive: "12_tank_temperature_melt_fraction_interactive.html",
        static: "12_tank_temperature_melt_fraction.png",
        phase: "Phase 7 Physics",
      },
      {
        id: "uk-13",
        num: "13",
        title: "Recommended PCM Summary Dashboard",
        desc: "Final recommendation synthesis for Uttarakhand across all 5 elevation regimes.",
        interactive: "13_recommended_pcm_summary_interactive.html",
        static: "13_recommended_pcm_summary.png",
        phase: "Phase 8 Output",
      },
    ],
  },
};

/* ─────────────────────────────────────────────────────────
   Cross-State Comparison Plots (Slide 13, 14, 18, 19, 20)
   ───────────────────────────────────────────────────────── */
const CROSS_STATE_PLOTS = [
  {
    id: "comp-01",
    title: "Cluster GHI Comparison Across States",
    desc: "Direct comparison of solar irradiance distributions across clusters in Tamil Nadu, Rajasthan, Assam, and Uttarakhand.",
    static: "comparison/01_comparison_cluster_ghi.png",
    category: "Cross-State Irradiance",
  },
  {
    id: "comp-02",
    title: "Ambient Temperature vs. Target Melting Point",
    desc: "Correlation between regional ambient temperature signatures and derived PCM melting point targets (Tm_target).",
    static: "comparison/02_comparison_temp_vs_tm_target.png",
    category: "Thermal Target Synthesis",
  },
  {
    id: "comp-03",
    title: "MCDM Methods Cross-State Consistency",
    desc: "Evaluation of TOPSIS, GRA, PROMETHEE II, and VIKOR stability across the 4 distinct geographic environments.",
    static: "comparison/03_comparison_mcdm_methods.png",
    category: "MCDM Sensitivity",
  },
  {
    id: "comp-04",
    title: "Monte Carlo Stability vs. Final Rank",
    desc: "Assessment of Monte Carlo Top-3 inclusion probabilities across candidate pools in all 4 states.",
    static: "comparison/04_comparison_mc_vs_rank.png",
    category: "Uncertainty Quantification",
  },
  {
    id: "comp-05",
    title: "Latent Heat Distribution of Surviving PCMs",
    desc: "Comparison of storage enthalpy capacities among feasible candidate survivors across all 4 state regimes.",
    static: "comparison/05_comparison_latent_heat_distribution.png",
    category: "Material Screening",
  },
  {
    id: "comp-06",
    title: "Physics Simulation vs. MCDM Rank (All States)",
    desc: "Spearman rank correlation comparison between grey-box simulated annual performance and MCDM ranking across all 4 pipelines.",
    static: "comparison/06_comparison_physics_vs_rank.png",
    category: "Physics Validation",
  },
  {
    id: "comp-07",
    title: "Cross-Cluster Top Recommended PCMs",
    desc: "Synthesis matrix displaying the winning PCM candidates across all 16 total climate regimes discovered across India.",
    static: "comparison/07_comparison_cross_cluster_top_pcm.png",
    category: "Recommendation Matrix",
  },
  {
    id: "comp-08",
    title: "Rank Sensitivity to Weight Variations",
    desc: "Sensitivity analysis of PCM rankings under varying stakeholder criterion weight configurations.",
    static: "comparison/08_comparison_rank_sensitivity.png",
    category: "Robustness Assessment",
  },
];

/* ─────────────────────────────────────────────────────────
   Methods (Slide 24, 25, 26)
   ───────────────────────────────────────────────────────── */
const methods = [
  {
    icon: "🗺️",
    tag: "Clustering",
    title: "Gaussian Mixture Models (BIC-Optimal)",
    desc: "Probabilistic clustering accounting for climate feature covariances (temperature, DTR, GHI, humidity). Optimal regime count k determined via Bayesian Information Criterion (BIC) and silhouette validation.",
    why: "<strong>Why:</strong> Captures overlapping climate gradients. Rejected: K-Means (assumes spherical clusters) & Hierarchical (O(N²) scaling).",
  },
  {
    icon: "⚖️",
    tag: "MCDM 1",
    title: "TOPSIS (Ideal Solution Proximity)",
    desc: "Ranks candidates by relative closeness to the positive ideal solution (max latent heat, thermal conductivity) and distance from negative ideal.",
    why: "<strong>Why:</strong> Intuitive geometric distance metric. Sensitive to extreme property outliers.",
  },
  {
    icon: "📊",
    tag: "MCDM 2",
    title: "PROMETHEE II (Outranking Flow)",
    desc: "Builds pairwise preference indices using Gaussian and V-shape criterion functions, calculating net outranking flows (Phi+ − Phi−) for a complete preorder.",
    why: "<strong>Why:</strong> Non-compensatory evaluation prevents high latent heat from masking poor cycling stability.",
  },
  {
    icon: "🎯",
    tag: "MCDM 3",
    title: "VIKOR (Compromise Ranking)",
    desc: "Determines compromise ranking measure Q based on maximum group utility S and individual regret R with parameter v=0.5.",
    why: "<strong>Why:</strong> Explicitly evaluates closeness to ideal while mitigating maximum individual property regret.",
  },
  {
    icon: "🔗",
    tag: "MCDM 4",
    title: "GRA (Grey Relational Analysis)",
    desc: "Measures relational degree between candidate property sequences and reference ideal sequence via grey relational coefficients (xi=0.5).",
    why: "<strong>Why:</strong> Operates effectively on small candidate sets without strict distributional assumptions.",
  },
  {
    icon: "🏛️",
    tag: "Consensus",
    title: "Borda Count & Copeland Cross-Check",
    desc: "Aggregates independent ranks from all 4 MCDM schools into a robust consensus rank, eliminating single-method biases.",
    why: "<strong>Why:</strong> Borda consensus smooths structural method outliers (such as GRA's linear normalization).",
  },
  {
    icon: "🎲",
    tag: "Uncertainty",
    title: "Monte Carlo Stability (1,000 Draws)",
    desc: "Propagates uncertainty by sampling criterion weights from Dirichlet distribution and perturbing material properties with Gaussian noise (sigma=5%).",
    why: "<strong>Why:</strong> Computes Top-3 inclusion probabilities to verify robustness against measurement and stakeholder bias.",
  },
  {
    icon: "🔬",
    tag: "Physics",
    title: "2-Node Lumped-Enthalpy Tank Model",
    desc: "Dynamically simulates water tank (Tw) and PCM capsule (Tp/f) node interactions using Backward Euler implicit time-stepping driven by 10-year real weather.",
    why: "<strong>Why:</strong> Provides ground-truth annual solar fraction benchmarks (54–84%) to validate whether MCDM rankings predict physical thermal delivery.",
  },
];

/* ─────────────────────────────────────────────────────────
   PlotCard Component with State-Aware Paths & Controls
   ───────────────────────────────────────────────────────── */
function PlotCard({ plot, stateKey }) {
  const [showInteractive, setShowInteractive] = useState(!!plot.interactive);

  const interactiveUrl = plot.interactive
    ? `${process.env.PUBLIC_URL}/plots/${stateKey}/${plot.interactive}`
    : null;
  const staticUrl = `${process.env.PUBLIC_URL}/plots/${
    stateKey === "comparison" ? "" : stateKey + "/"
  }${plot.static}`;

  return (
    <div className="plot-card" id={plot.id}>
      <div className="plot-card-header">
        <div>
          <div className="plot-card-title">
            {plot.num ? `Plot ${plot.num} — ` : ""}
            {plot.title}
          </div>
          <div className="plot-card-desc">{plot.desc}</div>
          <div className="tag-list" style={{ marginTop: 8 }}>
            <span className="tag tag-zinc">{plot.phase || plot.category}</span>
            {plot.interactive && (
              <span className="tag tag-amber">⚡ Plotly / Folium Interactive</span>
            )}
            <span className="tag tag-brand">
              {stateKey.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="plot-badge-group">
          <span
            className={`plot-type-badge ${
              showInteractive && plot.interactive ? "interactive" : "static"
            }`}
          >
            {showInteractive && plot.interactive ? "⚡ Interactive HTML" : "🖼 Static PNG"}
          </span>
        </div>
      </div>

      <div className="plot-frame-container">
        {showInteractive && plot.interactive ? (
          <iframe
            src={interactiveUrl}
            title={plot.title}
            loading="lazy"
          />
        ) : (
          <img
            className="plot-static-img"
            src={staticUrl}
            alt={plot.title}
            onError={(e) => {
              // Fallback to direct path if subfolder not resolved
              if (!e.target.dataset.triedFallback) {
                e.target.dataset.triedFallback = "true";
                e.target.src = `${process.env.PUBLIC_URL}/plots/${plot.static}`;
              }
            }}
          />
        )}
      </div>

      <div className="plot-card-footer">
        {plot.interactive ? (
          <button
            className="plot-toggle-btn"
            onClick={() => setShowInteractive((v) => !v)}
          >
            {showInteractive ? "🖼 Switch to Static PNG" : "⚡ Switch to Interactive HTML"}
          </button>
        ) : (
          <span style={{ fontSize: "0.76rem", color: "var(--neutral-500)" }}>
            High-Resolution Static Visualization
          </span>
        )}

        {plot.interactive && (
          <a
            href={interactiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="plot-external-link"
          >
            ↗ Open Fullscreen in New Tab
          </a>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Objective 1 Page Component
   ───────────────────────────────────────────────────────── */
function Objective1Page() {
  const [selectedState, setSelectedState] = useState("all");
  const [activePlotCategory, setActivePlotCategory] = useState("All");

  const currentState = STATES_CONFIG[selectedState] || null;

  // Filter plots for active state or cross-state comparison
  const currentPlots =
    selectedState === "all"
      ? CROSS_STATE_PLOTS
      : currentState
      ? currentState.plots
      : [];

  const filteredPlots =
    activePlotCategory === "All"
      ? currentPlots
      : currentPlots.filter((p) =>
          selectedState === "all"
            ? p.category === activePlotCategory
            : p.phase && p.phase.includes(activePlotCategory)
        );

  const plotCategories =
    selectedState === "all"
      ? ["All", "Cross-State Irradiance", "MCDM Sensitivity", "Physics Validation", "Recommendation Matrix"]
      : ["All", "Preprocessing", "Clustering", "Feasibility", "MCDM", "Physics", "Output"];

  return (
    <section className="content" id="top">


      {/* ── Page Hero ────────────────────────────────────── */}
      <div className="page-hero">
        <div className="eyebrow">
          <span className="eyebrow-badge">Research Module · Objective 1</span>
          <span>4-State End-to-End Pipeline</span>
        </div>

        <h1>Climate-Adaptive PCM Thermal Storage Selection</h1>
        <p className="intro">
          A multi-stage machine learning and Multi-Criteria Decision Analysis (MCDA)
          framework that identifies climate-adaptive Phase Change Materials (PCMs)
          for domestic solar water heating across <strong>Rajasthan, Tamil Nadu, Assam, and Uttarakhand</strong>.
          By coupling 10-year ERA5 and NASA POWER meteorological data with Gaussian Mixture Model
          clustering, 4-method MCDM consensus (TOPSIS, PROMETHEE II, GRA, VIKOR), and grey-box lumped-enthalpy
          physics validation, the framework delivers region-specific thermal storage recommendations.
        </p>


      </div>

      {/* ── State Selector Bar (Prominent & Interactive) ─── */}
      <div className="state-selector-wrapper" id="state-selector">
        <div className="state-selector-label-row">
          <div className="state-selector-title">
            <span>🌐 Select State Pipeline:</span>
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--neutral-400)" }}>
            Showing data, metrics, and plots for:{" "}
            <strong style={{ color: "#ffffff" }}>
              {selectedState === "all" ? "All 4 States (Cross-Comparison)" : currentState?.name}
            </strong>
          </span>
        </div>

        <div className="state-pills-container">
          <button
            className={`state-pill-btn ${selectedState === "all" ? "active" : ""}`}
            onClick={() => {
              setSelectedState("all");
              setActivePlotCategory("All");
            }}
          >
            <span>🇮🇳 All 4 States</span>
            <span className="state-pill-badge">Overview</span>
          </button>

          <button
            className={`state-pill-btn ${selectedState === "tamilnadu" ? "active" : ""}`}
            onClick={() => {
              setSelectedState("tamilnadu");
              setActivePlotCategory("All");
            }}
          >
            <span>🌴 Tamil Nadu</span>
            <span className="state-pill-badge">Lead · K=5</span>
          </button>

          <button
            className={`state-pill-btn ${selectedState === "rajasthan" ? "active" : ""}`}
            onClick={() => {
              setSelectedState("rajasthan");
              setActivePlotCategory("All");
            }}
          >
            <span>🏜️ Rajasthan</span>
            <span className="state-pill-badge">Arid · K=3</span>
          </button>

          <button
            className={`state-pill-btn ${selectedState === "assam" ? "active" : ""}`}
            onClick={() => {
              setSelectedState("assam");
              setActivePlotCategory("All");
            }}
          >
            <span>🌿 Assam</span>
            <span className="state-pill-badge">Subtropical · K=3</span>
          </button>

          <button
            className={`state-pill-btn ${selectedState === "uttarakhand" ? "active" : ""}`}
            onClick={() => {
              setSelectedState("uttarakhand");
              setActivePlotCategory("All");
            }}
          >
            <span>🏔️ Uttarakhand</span>
            <span className="state-pill-badge">Montane · K=5</span>
          </button>
        </div>
      </div>

      {/* ── Active State Profile Banner ───────────────────── */}
      {selectedState !== "all" && currentState && (
        <div className="state-profile-card">
          <div className="state-profile-item">
            <span className="state-profile-label">Selected Territory</span>
            <span className="state-profile-val">
              {currentState.icon} {currentState.name}
            </span>
            <span className="state-profile-sub">{currentState.climateType}</span>
          </div>

          <div className="state-profile-item">
            <span className="state-profile-label">Physics Spearman ρ</span>
            <span className="state-profile-val" style={{ color: "#ffffff" }}>
              {currentState.spearmanSummary.split("·")[0]}
            </span>
            <span className="state-profile-sub">Grey-Box vs MCDM Concordance</span>
          </div>

          <div className="state-profile-item">
            <span className="state-profile-label">Primary Consensus Winner</span>
            <span className="state-profile-val" style={{ color: "#ffffff" }}>
              {currentState.stats[5].value}
            </span>
            <span className="state-profile-sub">4-Method Borda Leader</span>
          </div>

          <div className="state-profile-item">
            <span className="state-profile-label">Pipeline Status</span>
            <span className="state-profile-val" style={{ color: "#fbbf24" }}>
              100% Verified
            </span>
            <span className="state-profile-sub">Full QC & Physics Simulated</span>
          </div>
        </div>
      )}

      {/* ── Key Metrics Grid ──────────────────────────────── */}
      <div className="results-grid" style={{ marginBottom: 56 }}>
        {selectedState === "all" ? (
          [
            { value: "4 States", label: "Tamil Nadu, Rajasthan, Assam, Uttarakhand" },
            { value: "637", label: "Total Population-Weighted Grid Points" },
            { value: "10 Years", label: "Continuous Hourly ERA5 + POWER (2016–2025)" },
            { value: "16", label: "Total Climate Regimes Discovered (GMM)" },
            { value: "62", label: "Screened PCM Candidate Records" },
            { value: "100%", label: "Verified Data Completeness Post-QC" },
          ].map((s) => (
            <div key={s.label} className="result-stat-card">
              <div className="result-stat-value">{s.value}</div>
              <div className="result-stat-label">{s.label}</div>
            </div>
          ))
        ) : (
          currentState.stats.map((s) => (
            <div key={s.label} className="result-stat-card">
              <div className="result-stat-value">{s.value}</div>
              <div className="result-stat-label">{s.label}</div>
            </div>
          ))
        )}
      </div>

      {/* ── Implementation Flow (Detailed) ─────────────────── */}
      <div className="content-section" id="implementation-flow">
        <div className="plots-section-header">
          <h2>End-to-End Implementation Pipeline</h2>
          <span className="plots-count-badge">7 Phases</span>
        </div>
        <p className="section-desc">
          A reproducible multi-phase ML &amp; MCDM framework deployed across four Indian climate zones to
          deliver data-driven, physics-validated PCM recommendations for solar water heating systems.
        </p>
        <div className="section-divider" />

        <div className="impl-detail-flow">
          {[
            {
              num: "01",
              icon: "🛰️",
              phase: "Data Ingestion",
              tag: "ERA5 + NASA POWER",
              details: [
                "10-year hourly reanalysis data (2016–2025) from ECMWF ERA5 and NASA POWER",
                "Population-weighted grid point selection: 637 total across 4 states",
                "36–37 meteorological variables ingested per grid point",
                "Covers GHI, DNI, DHI, Tₐₘɓ, RH, wind speed, pressure, and cloud fraction",
              ],
              input: "Raw ERA5 / POWER NetCDF & CSV",
              output: "Structured hourly time-series per grid point",
            },
            {
              num: "02",
              icon: "🧹",
              phase: "Preprocessing & QC",
              tag: "Hampel · MICE · Bias Correction",
              details: [
                "Physical bounds gating: GHI clamped to [0, 1400] W/m², RH to [0, 100]%",
                "Hampel filter (MAD-based, k=3σ window) for outlier suppression—GHI channel excluded from spike removal",
                "MICE multivariate imputation for residual missing values",
                "Quantile-mapping bias correction against NASA POWER baseline",
                "45 engineered features added (lag, rolling stats, diurnal, seasonal harmonics)",
              ],
              input: "Raw time-series with missing data & outliers",
              output: "Clean 89-feature matrices; ≥99.2% data retention",
            },
            {
              num: "03",
              icon: "🔬",
              phase: "GMM Clustering",
              tag: "Climate Regime Discovery",
              details: [
                "Gaussian Mixture Model (GMM) with BIC-optimised k selection",
                "Fitted on PCA-reduced feature space (95% variance explained)",
                "k=5 for Tamil Nadu &amp; Uttarakhand; k=3 for Rajasthan &amp; Assam",
                "16 total climate regimes discovered across all 4 states",
                "Each cluster assigned a geographic label (e.g. Thar Core, Brahmaputra Valley, Tarai)",
              ],
              input: "Clean 89-feature hourly matrices",
              output: "Cluster-labelled grid points + per-cluster climate signatures",
            },
            {
              num: "04",
              icon: "🧪",
              phase: "Feasibility Screening",
              tag: "κ-Calibrated Thresholds",
              details: [
                "62 PCM candidate records evaluated per state",
                "Hard constraints: Tm∈[Tₐₘɓ₊10, GHI_peak/3], latent heat ≥80 kJ/kg, no toxic/flammable flags",
                "κ-calibrated thresholds adjust for climate severity (arid vs. montane vs. subtropical)",
                "Sub-zero activation for Uttarakhand: eliminates PCMs with Tm&lt;5°C in high-altitude regimes",
                "Survivors: 39 (Rajasthan), 41 (Tamil Nadu), 38 (Assam), 35 (Uttarakhand)",
              ],
              input: "Per-cluster climate signatures + PCM property database",
              output: "Feasible candidate shortlist per cluster",
            },
            {
              num: "05",
              icon: "📊",
              phase: "MCDM Consensus Ranking",
              tag: "TOPSIS · GRA · PROMETHEE II · VIKOR",
              details: [
                "TOPSIS: Euclidean distance from ideal/anti-ideal solution",
                "GRA (Grey Relational Analysis): relational grade-based ranking under uncertainty",
                "PROMETHEE II: pairwise preference flow with Gaussian preference functions",
                "VIKOR: compromise ranking minimising regret and group utility simultaneously",
                "Borda count aggregation across all 4 methods for consensus ranking",
                "Kendall’s W concordance measured per cluster (W=0.842 C1 Tamil Nadu; W=0.784 Assam)",
              ],
              input: "Feasible PCM shortlist + normalised criterion weights",
              output: "Borda consensus ranked PCM list per cluster",
            },
            {
              num: "06",
              icon: "⚛️",
              phase: "Physics Validation",
              tag: "Grey-Box Lumped Enthalpy Solver",
              details: [
                "2-node lumped-enthalpy energy balance ODE solved over 8760 hourly timesteps",
                "Nodes: PCM tank and domestic hot water draw loop",
                "Solar fraction SF = Q_delivered / Q_demand computed per annual cycle",
                "Target band: 54–84% solar fraction benchmark",
                "Spearman ρ between MCDM rank and simulated SF computed per cluster",
                "VIKOR sign-inversion bug detected via bump chart cross-verification (ρ=−0.86 vs TOPSIS)",
              ],
              input: "Top-ranked PCMs + cluster solar/thermal signatures",
              output: "Annual solar fractions + Spearman ρ concordance per cluster",
            },
            {
              num: "07",
              icon: "🏆",
              phase: "PCM Recommendation",
              tag: "Borda + Monte Carlo Stability",
              details: [
                "Final recommendation = Borda consensus leader per cluster",
                "Monte Carlo stability: 1,000 Dirichlet weight draws, Top-3 inclusion rate computed",
                "Threshold: ≥75% MC Top-3 inclusion for high-confidence recommendation",
                "Outputs: recommended PCM, Tm, latent heat, MC certainty, and target geographic region",
                "Example winners: savE® OM50 (Rajasthan C1/C2), n-Octacosane C28 (Tamil Nadu C1), RT44HC (Assam)",
              ],
              input: "Borda-ranked list + Monte Carlo draws",
              output: "Final region-specific PCM recommendations with confidence scores",
            },
          ].map((step, i, arr) => (
            <div key={step.num} className="impl-detail-item">
              <div className="impl-detail-connector">
                <div className="impl-detail-badge">{step.num}</div>
                {i < arr.length - 1 && <div className="impl-detail-line" />}
              </div>
              <div className="impl-detail-card">
                <div className="impl-detail-header">
                  <span className="impl-detail-icon">{step.icon}</span>
                  <div>
                    <div className="impl-detail-phase">{step.phase}</div>
                    <span className="tag tag-zinc" style={{ marginTop: 4, display: "inline-block" }}>{step.tag}</span>
                  </div>
                </div>
                <ul className="impl-detail-bullets">
                  {step.details.map((d, di) => (
                    <li key={di} dangerouslySetInnerHTML={{ __html: d }} />
                  ))}
                </ul>
                <div className="impl-detail-io">
                  <div className="impl-io-row">
                    <span className="impl-io-label">Input</span>
                    <span className="impl-io-val">{step.input}</span>
                  </div>
                  <div className="impl-io-row">
                    <span className="impl-io-label" style={{ color: "#4ade80" }}>Output</span>
                    <span className="impl-io-val">{step.output}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cross-State Preprocessing Verification Table ── */}
      <div className="content-section" id="preprocessing">
        <div className="plots-section-header">
          <h2>4-State Data Preprocessing & Quality Control</h2>
          <span className="plots-count-badge">Presentation Audit</span>
        </div>
        <p className="section-desc">
          Rigorous quality control executed across all four territories. Preprocessing comprises
          physical bounds gating, Hampel filtering (MAD-based with GHI preserved), MICE multivariate
          imputation, and quantile-mapping bias correction against NASA POWER.
        </p>
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
                <tr
                  key={row.state}
                  style={{
                    background:
                      selectedState === row.state.toLowerCase().replace(" ", "")
                        ? "rgba(255, 255, 255, 0.05)"
                        : "transparent",
                  }}
                >
                  <td style={{ fontWeight: 600, color: "#ffffff" }}>
                    {row.state} <span className="tag tag-zinc">{row.tag}</span>
                  </td>
                  <td>{row.gridPoints}</td>
                  <td>{row.inputRecords}</td>
                  <td>{row.outputRecords}</td>
                  <td style={{ fontWeight: 600, color: "#ffffff" }}>{row.retention}</td>
                  <td>
                    {row.inputDims} → {row.outputDims}
                  </td>
                  <td>{row.engineeredFeatures}</td>
                  <td>{row.missingRate}</td>
                  <td>
                    <span className="tag tag-brand">✔ {row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Interactive Plots Section (FOR ALL 4 STATES) ───── */}
      <div className="content-section" id="interactive-plots">
        <div className="plots-section-header">
          <div className="plots-title-group">
            <h2>
              Interactive Plots —{" "}
              {selectedState === "all"
                ? "Cross-State Comparison Suite"
                : currentState?.name}
            </h2>
            <span className="plots-count-badge">
              {filteredPlots.length} Plots Available
            </span>
          </div>

          <div style={{ fontSize: "0.8rem", color: "var(--neutral-400)" }}>
            ⚡ Plotly & Folium Interactive Views Available
          </div>
        </div>

        <p className="section-desc">
          Explore interactive HTML visualizations and high-resolution figures for{" "}
          <strong>
            {selectedState === "all"
              ? "cross-state comparative metrics"
              : currentState?.name}
          </strong>
          . Use the quick controls below to switch between states or filter by pipeline phase.
        </p>

        {/* State and Phase Controls inside Plots section */}
        <div className="plots-controls-bar">
          <div className="plots-state-bar">
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--neutral-400)" }}>
              STATE:
            </span>
            {[
              { id: "all", label: "🇮🇳 All States" },
              { id: "tamilnadu", label: "🌴 Tamil Nadu" },
              { id: "rajasthan", label: "🏜️ Rajasthan" },
              { id: "assam", label: "🌿 Assam" },
              { id: "uttarakhand", label: "🏔️ Uttarakhand" },
            ].map((st) => (
              <button
                key={st.id}
                className={`plots-state-btn ${selectedState === st.id ? "active" : ""}`}
                onClick={() => {
                  setSelectedState(st.id);
                  setActivePlotCategory("All");
                }}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="plots-tab-bar">
            {plotCategories.map((cat) => (
              <button
                key={cat}
                className={`tab-btn ${activePlotCategory === cat ? "active" : ""}`}
                onClick={() => setActivePlotCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="section-divider" />

        {/* Render Plots */}
        {filteredPlots.map((plot) => (
          <PlotCard
            key={plot.id}
            plot={plot}
            stateKey={selectedState === "all" ? "comparison" : selectedState}
          />
        ))}
      </div>

      {/* ── Cross-State Technical Findings ── */}
      <div className="content-section" id="clustering">
        <div className="plots-section-header">
          <h2>Clustering & MCDM Cross-State Findings</h2>
          <span className="plots-count-badge">Review 2 Synthesis</span>
        </div>
        <p className="section-desc">
          Key empirical findings from deploying the Objective 1 framework across four geographically
          and climatologically diverse Indian territories.
        </p>
        <div className="section-divider" />

        <div className="findings-list">
          <div className="finding-item">
            <span className="finding-icon">🌴</span>
            <div className="finding-text">
              <strong>Tamil Nadu (Lead State · v3.2 Verified):</strong> 5 GMM regimes discovered
              (Coastal, Plains, Ghats, Delta, South). Demonstrates high inter-method concordance
              (Kendall's W = 0.842 in C0, 0.956 in C1). In Cluster 1, physics validation confirms strong
              correlation (ρ = +0.717, p = 0.030) with 41% of simulations inside the 54–84% solar fraction
              benchmark band. n-Octacosane (C28) and RT64HC emerge as consensus leaders.
            </div>
          </div>

          <div className="finding-item">
            <span className="finding-icon">🏜️</span>
            <div className="finding-text">
              <strong>Rajasthan (Honest Negative Correlation Documented):</strong> 3 GMM regimes discovered.
              Spearman correlation between MCDM consensus rank and simulated performance yielded ρ = −0.385 (C0),
              +0.125 (C1), and −0.097 (C2). The negative correlation in C0 is an honest finding: heavy supercooling
              penalties in MCDM conflict with lumped-enthalpy physics where high latent heat dominates delivery.
              savE® OM50 and RT50 lead across regimes.
            </div>
          </div>

          <div className="finding-item">
            <span className="finding-icon">🌿</span>
            <div className="finding-text">
              <strong>Assam (Monsoon Attenuation & Subtropical Dynamics):</strong> 3 GMM regimes covering
              the Brahmaputra Valley and Barak Valley. High relative humidity (&gt;70%) and monsoonal clouding
              attenuate summer solar fractions, favoring paraffin PCMs with moderate melting temperatures
              (RT44HC, RT45HC, and C22H46) with Kendall's W = 0.784.
            </div>
          </div>

          <div className="finding-item">
            <span className="finding-icon">🏔️</span>
            <div className="finding-text">
              <strong>Uttarakhand (Montane Freezing & Altitude Stratification):</strong> 5 elevation-driven
              regimes ranging from Tarai plains (~300m) to Greater Himalaya (&gt;2500m). Winter freezing risks
              activate the sub-zero constraint, mandating higher melting point PCMs (RT60, savE® OM55, PureTemp 58)
              to prevent nighttime phase freeze-out.
            </div>
          </div>

          <div className="finding-item">
            <span className="finding-icon">🐛</span>
            <div className="finding-text">
              <strong>VIKOR Sign-Inversion Bug Detection:</strong> During multi-state cross-verification,
              a sign-inversion bug in VIKOR's regret metric computation was caught via bump charts (VIKOR ranks
              were anti-correlated with TOPSIS at ρ = −0.86). Once corrected, VIKOR aligned positively with the
              compromise frontier.
            </div>
          </div>
        </div>
      </div>

      {/* ── Methods & Mathematical Formulations ── */}
      <div className="content-section" id="methods">
        <div className="plots-section-header">
          <h2>Theoretical & Mathematical Foundations</h2>
          <span className="plots-count-badge">8 Core Algorithms</span>
        </div>
        <p className="section-desc">
          Four methodologically distinct MCDM schools combined via Borda consensus, validated against a
          2-node lumped-enthalpy energy balance solver.
        </p>
        <div className="section-divider" />

        <div className="methods-grid">
          {methods.map((m) => (
            <div key={m.title} className="method-card">
              <span className="method-card-icon">{m.icon}</span>
              <div className="method-card-tag">{m.tag}</div>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
              <div
                className="method-card-why"
                dangerouslySetInnerHTML={{ __html: m.why }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Recommendation Cards Section ──────────────────── */}
      <div className="content-section" id="results">
        <div className="plots-section-header">
          <h2>
            {selectedState === "all"
              ? "State-by-State Recommended PCMs"
              : `${currentState?.name} Recommended PCMs`}
          </h2>
          <span className="plots-count-badge">Borda Consensus Leaders</span>
        </div>
        <p className="section-desc">
          Optimal Phase Change Materials recommended for each climate regime based on multi-criteria
          ranking and verified by 1,000 Monte Carlo stability draws (≥75% Top-3 inclusion).
        </p>
        <div className="section-divider" />

        {selectedState === "all" ? (
          // Display recommendations for all 4 states grouped
          Object.entries(STATES_CONFIG).map(([key, st]) => (
            <div key={key} style={{ marginBottom: 36 }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span>{st.icon}</span>
                <span>{st.name}</span>
                <span className="tag tag-zinc">{st.tag}</span>
              </h3>

              <div className="recommendation-cards-grid">
                {st.recommendations.map((r) => (
                  <div key={r.cluster} className="rec-card">
                    <div className="rec-card-cluster">{r.cluster}</div>
                    <div className="rec-card-pcm">{r.pcm}</div>
                    <div className="rec-card-props">
                      <div className="rec-prop">
                        <span className="rec-prop-label">Melting Temp (Tm)</span>
                        <span className="rec-prop-value">{r.tm}</span>
                      </div>
                      <div className="rec-prop">
                        <span className="rec-prop-label">Latent Heat</span>
                        <span className="rec-prop-value">{r.latentHeat}</span>
                      </div>
                      <div className="rec-prop">
                        <span className="rec-prop-label">MC Top-3 Certainty</span>
                        <span className="rec-prop-value">{r.mc}</span>
                      </div>
                      <div className="rec-prop">
                        <span className="rec-prop-label">Target Region</span>
                        <span className="rec-prop-value">{r.region}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          // Display recommendations for currently selected state
          <div className="recommendation-cards-grid">
            {currentState.recommendations.map((r) => (
              <div key={r.cluster} className="rec-card">
                <div className="rec-card-cluster">{r.cluster}</div>
                <div className="rec-card-pcm">{r.pcm}</div>
                <div className="rec-card-props">
                  <div className="rec-prop">
                    <span className="rec-prop-label">Melting Temp (Tm)</span>
                    <span className="rec-prop-value">{r.tm}</span>
                  </div>
                  <div className="rec-prop">
                    <span className="rec-prop-label">Latent Heat</span>
                    <span className="rec-prop-value">{r.latentHeat}</span>
                  </div>
                  <div className="rec-prop">
                    <span className="rec-prop-label">MC Top-3 Certainty</span>
                    <span className="rec-prop-value">{r.mc}</span>
                  </div>
                  <div className="rec-prop">
                    <span className="rec-prop-label">Target Region</span>
                    <span className="rec-prop-value">{r.region}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Objective1Page;
