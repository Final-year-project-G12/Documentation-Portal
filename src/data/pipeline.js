/* ─────────────────────────────────────────────────────────
   The Objective 1 pipeline, described once, as short bullets.
   Sources: PCM-Selection-ML-model/docs/METHODS.md (method per script),
   OBJECTIVE1_CONSOLIDATED_SUMMARY.md (phases and corrections) and
   pcm_shared_config.py (design constants). Tokens {{cite:Key}} and {{cn}}
   are resolved by richHtml(). `details` holds thresholds and parameter
   lists; `out` is the stage's output.
   ───────────────────────────────────────────────────────── */

export const PIPELINE_STAGES = [
  {
    title: "Data acquisition",
    steps: [
      "Picks the fewest highest-population cells on the ERA5 0.25° grid that cover at least 87.5% of a state's population {{cn}}.",
      "Why: the recommendation should reflect where hot water is actually used.",
      "Computes sunrise, solar noon and sunset for every point and day, using the NREL solar position algorithm {{cite:RedaAndreas2004SPA}} through pvlib {{cite:Holmgren2018pvlib}}.",
      "Samples the data at those sun-event times.",
      "Downloads ten years (2016–2025) of ERA5 {{cite:Hersbach2020ERA5}} and NASA POWER {{cite:Stackhouse2021POWER}}.",
      "Gives each point its real elevation from ERA5 geopotential.",
    ],
    out: "Per-point hourly records: Rajasthan 320 points, Tamil Nadu 133, Uttarakhand 45, Assam 80",
  },
  {
    title: "Preprocessing and quality control",
    steps: [
      "Matches ERA5 and NASA POWER at each sun-event instant.",
      "Checks their agreement (bias, RMSE, correlation) to decide whether ERA5 needs correcting.",
      "Where it does, corrects ERA5 season by season with quantile mapping {{cite:Cannon2015QuantileMapping}}.",
      "Range-checks the values and masks the night.",
      "Flags outliers with the Hampel filter {{cite:Hampel1974InfluenceCurve}}; Assam uses a multivariate isolation forest instead {{cite:Liu2008IsolationForest}}.",
      "Fills gaps by interpolation, then medians, then chained-equation imputation {{cite:vanBuuren2011MICE}}.",
      "Adds lag, rolling and delta features.",
      "Fits the scaled copy on the first 70% of rows only.",
      "Cross-checking against NASA POWER caught an ERA5 de-accumulation error that had made noon radiation near zero.",
    ],
    out: "Cleaned feature matrices (quality-control counts per state are on the Objective 1 page)",
  },
  {
    title: "Climate signature and design targets",
    steps: [
      "Gives each point two tiers of indices. The first tier is sun-event indices, for example noon radiation and clearness.",
      "The second tier is true daily-integral indices: daily radiation, temperature range, heating and cooling degree days, cloudy fraction.",
      "Adds a four-component PCA block on the temperature and elevation columns.",
      "Sets each regime's melting-point target to delivery temperature plus heat-exchanger approach: 60 °C + 7 K = 67 °C.",
      "Why 60 °C: the 300 L / 7 h night-delivery benchmark is reported at 60 ± 2 °C {{cite:MadadiAvargani2021}}.",
      { text: "Sets the required latent heat with L_required = SHARE_PCM · Q_night / m_PCM, where SHARE_PCM = 0.5.", details: "Q_night: heat for the night's hot water. m_PCM: PCM mass." },
      "Why 0.5: it is the middle of a published 0.4–0.78 range for the PCM's share of night delivery {{cite:Zhao2022PCMShare,Huang2020PCMVolumeRatio,Abdelsalam2020PCMStorageVolume,Kozelj2021PCMFraction}}.",
      "Caveat: the mains-water temperature is still a placeholder, pending a ground-temperature model {{cite:Kusuda1965EarthTemperature}}.",
    ],
    out: "Signature table plus Tm_target, capped Tm_target and L_required per regime",
  },
  {
    title: "Climate regime clustering",
    steps: [
      "Groups the points with a Gaussian mixture model {{cite:Dempster1977EM}} that uses diagonal covariance.",
      "Chooses the number of regimes with the Bayesian information criterion {{cite:Schwarz1978BIC}} and the silhouette score {{cite:Rousseeuw1987Silhouettes}}.",
      "Also checks the Davies–Bouldin and Calinski–Harabasz indices and bootstrap stability.",
      "Keeps latitude and longitude out of the inputs, so spatial coherence is a result, not an assumption.",
      "Relabels clusters by latitude, so cluster numbers stay stable between runs.",
    ],
    out: "Regime per point with membership probabilities, medoid points and population per regime",
  },
  {
    title: "PCM database",
    steps: [
      "Holds 62 candidate PCMs: 55 manufacturer and literature rows plus 7 further literature rows {{cite:Singh2025PCMSWH}}.",
      "Completes missing properties with a random-forest imputation that uses predictive-mean matching.",
      "Flags every imputed value in the output.",
    ],
    out: "62-row PCM property table with provenance flags",
  },
  {
    title: "Feasibility filter",
    steps: [
      { text: "Applies eight constraints in order to remove unsuitable candidates.", details: "Order: melting window, absolute 42–70 °C band, latent-heat floor, cycling, supercooling, charging feasibility (melting point at or below the capped target), corrosion veto, safety exclusion." },
      "Sets the latent-heat floor to κ · L_required.",
      "At the nominal κ = 0.7, the Rajasthan clusters have no survivor.",
      "So κ is calibrated per cluster, and the calibrated pool is the one that gets ranked.",
    ],
    out: "Calibrated survivors per cluster",
  },
  {
    title: "Multi-criteria ranking",
    steps: [
      { text: "Scores candidates on eight criteria.", details: "Melting-point fit, latent heat, volumetric latent heat, conductivity, supercooling, cycling, corrosion, cost." },
      "Blends Shannon-entropy weights {{cite:Shannon1948Communication}} 50/50 with fixed prior weights, and caps the supercooling weight.",
      "Caveat: the prior half was not elicited by pairwise comparison, so the weights are not AHP-derived.",
      "Ranks the survivors with four methods: TOPSIS {{cite:HwangYoon1981MADM}}, PROMETHEE II {{cite:BransVincke1985PROMETHEE}}, GRA {{cite:Deng1982GreySystems}} and VIKOR {{cite:OpricovicTzeng2004VIKOR}}.",
      "Combines them with a Borda count {{cite:Dwork2001RankAggregation}} and cross-checks with a Copeland count {{cite:SaariMerlin1996Copeland}}.",
      "Reports how well the methods agree with Kendall's W {{cite:KendallBabingtonSmith1939}}.",
    ],
    out: "Borda rank, Top-3 and Kendall's W per cluster",
  },
  {
    title: "Physics validation",
    steps: [
      "Simulates a PCM and water tank with a lumped-enthalpy model, solved by backward Euler.",
      "Drives it with ten years of hourly weather at each regime's medoid point.",
      "Calibrates the plain-tank solar fraction into the 54–84% literature band {{cite:Singh2025PCMSWH}}.",
      "Uses a 200 kg water mass, chosen inside a published tank range {{cite:Eldokaishi2022ANN_PCM_SWH}}.",
      "Requires the energy-conservation self-tests to pass before any result is used.",
      "Compares the MCDM rank with each candidate's simulated rank, using Spearman's ρ.",
    ],
    out: "Simulated performance per candidate and ρ per cluster",
  },
  {
    title: "Recommendation cards",
    steps: [
      "Builds one card per regime: identity, climate signature, targets and candidates screened.",
      "Each card also lists the Top-3 with per-criterion contributions, the physics context and the caveats.",
      "Refuses to build if the cluster fingerprint of the earlier phases does not match.",
    ],
    out: "Recommendation card per regime",
  },
];

export const STATE_DIFFERENCES = [
  "Rajasthan and Tamil Nadu use the 60 °C delivery basis (Tm_target 67 °C).",
  "Uttarakhand still uses 57 °C and was not re-run on the 60 °C basis.",
  "Assam's latest cards use 56 °C (capped about 50 °C); its older documents say 44 °C.",
  "Assam draws its candidates from the Phase 5 filter pool.",
  "Tamil Nadu's physics script still hard-codes a 50 °C delivery constant.",
  "Tamil Nadu adds a ninth ranking criterion, thermal margin.",
  "Each state's results are on the Objective 1 page.",
];
