/* Algorithm cards on the Overview page, as short bullets. `points` use the
   same tokens as pipeline.js ({{cite:Key}}, {{cn}}). */

export const METHODS = [
  {
    tag: "Clustering",
    title: "Gaussian Mixture Models (BIC-Optimal)",
    points: [
      "Groups points by probability, using how climate features vary together (temperature, DTR, GHI, humidity).",
      "Picks the regime count k with BIC {{cite:Schwarz1978BIC}} and silhouette validation {{cite:Rousseeuw1987Silhouettes}}.",
      "Mixture-model clustering fits by expectation-maximisation {{cite:Dempster1977EM}}.",
      "Why: it captures overlapping climate gradients.",
      "Rejected: K-Means (assumes spherical clusters) and hierarchical clustering (O(N²) scaling).",
    ],
  },
  {
    tag: "MCDM 1",
    title: "TOPSIS (Ideal Solution Proximity)",
    points: [
      "Ranks candidates by closeness to the best possible option (max latent heat, thermal conductivity) and distance from the worst {{cite:HwangYoon1981MADM}}.",
      "Why: a simple, intuitive geometric distance.",
      "Caveat: sensitive to extreme property outliers.",
    ],
  },
  {
    tag: "MCDM 2",
    title: "PROMETHEE II (Outranking Flow)",
    points: [
      "Compares candidates in pairs using Gaussian and V-shape criterion functions {{cite:BransVincke1985PROMETHEE}}.",
      "Nets each candidate's outranking flows (Phi+ − Phi−) into a complete ranking.",
      "Why: non-compensatory, so high latent heat cannot hide poor cycling stability.",
    ],
  },
  {
    tag: "MCDM 3",
    title: "VIKOR (Compromise Ranking)",
    points: [
      "Computes a compromise score Q from group utility S and individual regret R, with parameter v=0.5 {{cite:OpricovicTzeng2004VIKOR}}.",
      "Why: it scores closeness to the ideal while limiting the largest single-property regret.",
    ],
  },
  {
    tag: "MCDM 4",
    title: "GRA (Grey Relational Analysis)",
    points: [
      "Scores how closely each candidate's properties follow the ideal profile, using grey relational coefficients (xi=0.5) {{cite:Deng1982GreySystems}}.",
      "Why: works on small candidate sets without strict distribution assumptions.",
    ],
  },
  {
    tag: "Consensus",
    title: "Borda Count & Copeland Cross-Check",
    points: [
      "Adds up the ranks from all 4 MCDM methods into one consensus rank.",
      "This removes the bias of any single method.",
      "Borda aggregation {{cite:Dwork2001RankAggregation}}; Copeland aggregation {{cite:SaariMerlin1996Copeland}}; Kendall’s W {{cite:KendallBabingtonSmith1939}}.",
      "Why: Borda smooths structural method outliers, such as GRA's linear normalization.",
    ],
  },
  {
    tag: "Physics",
    title: "2-Node Lumped-Enthalpy Tank Model",
    points: [
      "Simulates two nodes: the water tank (Tw) and the PCM capsule (Tp, phase fraction f).",
      "Steps forward in time with backward Euler, driven by 10-year real weather.",
      "The 54–84% solar-fraction band comes from the PCM-SWH review {{cite:Singh2025PCMSWH}}.",
      "Why: it gives annual solar-fraction benchmarks to test whether MCDM rankings predict real thermal delivery.",
    ],
  },
];
