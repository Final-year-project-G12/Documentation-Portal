/* Algorithm cards shown on the Overview page (moved from the Objective 1 page). Tokens as in pipeline.js. */

export const METHODS = [
  {
    tag: "Clustering",
    title: "Gaussian Mixture Models (BIC-Optimal)",
    desc: "Probabilistic clustering accounting for climate feature covariances (temperature, DTR, GHI, humidity). Optimal regime count k determined via Bayesian Information Criterion (BIC) {{cite:Schwarz1978BIC}} and silhouette validation {{cite:Rousseeuw1987Silhouettes}}. Mixture-model clustering itself {{cn}}.",
    why: "<strong>Why:</strong> Captures overlapping climate gradients. Rejected: K-Means (assumes spherical clusters) & Hierarchical (O(N²) scaling).",
  },
  {
    tag: "MCDM 1",
    title: "TOPSIS (Ideal Solution Proximity)",
    desc: "Ranks candidates by relative closeness to the positive ideal solution (max latent heat, thermal conductivity) and distance from negative ideal {{cite:HwangYoon1981MADM}}.",
    why: "<strong>Why:</strong> Intuitive geometric distance metric. Sensitive to extreme property outliers.",
  },
  {
    tag: "MCDM 2",
    title: "PROMETHEE II (Outranking Flow)",
    desc: "Builds pairwise preference indices using Gaussian and V-shape criterion functions, calculating net outranking flows (Phi+ − Phi−) for a complete preorder {{cite:BransVincke1985PROMETHEE}}.",
    why: "<strong>Why:</strong> Non-compensatory evaluation prevents high latent heat from masking poor cycling stability.",
  },
  {
    tag: "MCDM 3",
    title: "VIKOR (Compromise Ranking)",
    desc: "Determines compromise ranking measure Q based on maximum group utility S and individual regret R with parameter v=0.5 {{cite:OpricovicTzeng2004VIKOR}}.",
    why: "<strong>Why:</strong> Explicitly evaluates closeness to ideal while mitigating maximum individual property regret.",
  },
  {
    tag: "MCDM 4",
    title: "GRA (Grey Relational Analysis)",
    desc: "Measures relational degree between candidate property sequences and reference ideal sequence via grey relational coefficients (xi=0.5) {{cite:Deng1982GreySystems}}.",
    why: "<strong>Why:</strong> Operates effectively on small candidate sets without strict distributional assumptions.",
  },
  {
    tag: "Consensus",
    title: "Borda Count & Copeland Cross-Check",
    desc: "Aggregates independent ranks from all 4 MCDM schools into a robust consensus rank, eliminating single-method biases. Borda and Copeland aggregation {{cn}}; Kendall’s W {{cn}}.",
    why: "<strong>Why:</strong> Borda consensus smooths structural method outliers (such as GRA's linear normalization).",
  },
  {
    tag: "Physics",
    title: "2-Node Lumped-Enthalpy Tank Model",
    desc: "Dynamically simulates water tank (Tw) and PCM capsule (Tp/f) node interactions using Backward Euler implicit time-stepping driven by 10-year real weather. The 54–84% solar-fraction band comes from the PCM-SWH review {{cite:Singh2025PCMSWH}}.",
    why: "<strong>Why:</strong> Provides ground-truth annual solar fraction benchmarks (54–84%) to validate whether MCDM rankings predict physical thermal delivery.",
  },
];
