/* ─────────────────────────────────────────────────────────
   The Objective 1 pipeline, described once.
   Sources: PCM-Selection-ML-model/docs/METHODS.md (method per script),
   OBJECTIVE1_CONSOLIDATED_SUMMARY.md (phases and corrections) and
   pcm_shared_config.py (design constants). Tokens {{cite:Key}} and {{cn}}
   are resolved by richHtml(). State-specific deviations are listed in the
   "Where the states differ" paragraph and on the Objective 1 page.
   ───────────────────────────────────────────────────────── */

export const PIPELINE_STAGES = [
  {
    title: "Data acquisition",
    body: "Sampling points are the smallest set of highest-population cells on the ERA5 0.25° grid that covers at least 87.5% of a state's population {{cn}}, so the recommendation reflects where hot water is used. Sunrise, solar noon and sunset are computed for every point and day with the NREL solar position algorithm {{cite:RedaAndreas2004SPA}} through pvlib {{cite:Holmgren2018pvlib}}, and the data are sampled at those instants. Ten years (2016–2025) of ERA5 {{cite:Hersbach2020ERA5}} and NASA POWER {{cite:Stackhouse2021POWER}} are downloaded, and each point gets its real elevation from ERA5 geopotential.",
    out: "Per-point hourly records: Rajasthan 320 points, Tamil Nadu 133, Uttarakhand 45, Assam 80",
  },
  {
    title: "Preprocessing and quality control",
    body: "ERA5 and NASA POWER are matched at each sun-event instant, and their agreement (bias, RMSE, correlation) decides whether ERA5 needs correcting. Where it does, ERA5 is corrected season by season with quantile mapping {{cite:Cannon2015QuantileMapping}}. Values are range-checked, the night is masked, and outliers are flagged with the Hampel filter {{cite:Hampel1974InfluenceCurve}} (Assam uses a multivariate isolation forest instead {{cn}}). Gaps are filled by interpolation, then medians, then chained-equation imputation {{cite:vanBuuren2011MICE}}. Lag, rolling and delta features are added and the scaled copy is fitted on the first 70% of rows only. Cross-checking against NASA POWER caught an ERA5 de-accumulation error that had made noon radiation near zero.",
    out: "Cleaned feature matrices (quality-control counts per state are on the Objective 1 page)",
  },
  {
    title: "Climate signature and design targets",
    body: "Each point gets two tiers of indices: sun-event indices (for example noon radiation and clearness) and true daily-integral indices (daily radiation, temperature range, heating and cooling degree days, cloudy fraction), plus a four-component PCA block on the temperature and elevation columns. Each regime also gets PCM-facing targets. The melting-point target is the delivery temperature plus a heat-exchanger approach: 60 °C + 7 K = 67 °C, because the 300 L / 7 h night-delivery benchmark is reported at 60 ± 2 °C {{cite:MadadiAvargani2021}}. The required latent heat is L_required = SHARE_PCM · Q_night / m_PCM with SHARE_PCM = 0.5, the middle of a published 0.4–0.78 range for the PCM's share of night delivery {{cite:Zhao2022PCMShare,Huang2020PCMVolumeRatio,Abdelsalam2020PCMStorageVolume,Kozelj2021PCMFraction}}. The mains-water temperature is still a placeholder pending a ground-temperature model {{cite:Kusuda1965EarthTemperature}}.",
    out: "Signature table plus Tm_target, capped Tm_target and L_required per regime",
  },
  {
    title: "Climate regime clustering",
    body: "A Gaussian Mixture Model with diagonal covariance groups the points {{cn}}. The number of regimes is chosen with the Bayesian information criterion {{cite:Schwarz1978BIC}}, the silhouette score {{cite:Rousseeuw1987Silhouettes}}, the Davies–Bouldin and Calinski–Harabasz indices and bootstrap stability. Latitude and longitude are not clustering inputs, so spatial coherence is a result, and cluster numbers are relabelled by latitude so they stay stable between runs.",
    out: "Regime per point with membership probabilities, medoid points and population per regime",
  },
  {
    title: "PCM database",
    body: "The database has 62 candidates: 55 manufacturer and literature rows plus 7 further literature rows {{cite:Singh2025PCMSWH}}. Missing properties are completed with a random-forest imputation using predictive-mean matching and are flagged as imputed in the output.",
    out: "62-row PCM property table with provenance flags",
  },
  {
    title: "Feasibility filter",
    body: "Eight constraints are applied in order: melting window, absolute 42–70 °C band, latent-heat floor, cycling, supercooling, charging feasibility (melting point at or below the capped target), corrosion veto and safety exclusion. The latent-heat floor is κ · L_required; at the nominal κ = 0.7 the Rajasthan clusters have no survivor, so κ is calibrated per cluster and the calibrated pool is the one ranked.",
    out: "Calibrated survivors per cluster",
  },
  {
    title: "Multi-criteria ranking",
    body: "Candidates are scored on eight criteria (melting-point fit, latent heat, volumetric latent heat, conductivity, supercooling, cycling, corrosion, cost). Weights blend Shannon-entropy weights {{cite:Shannon1948Communication}} 50/50 with fixed prior weights, with the supercooling weight capped; the prior half was not elicited by pairwise comparison, so the weights are not AHP-derived. Four methods rank the survivors: TOPSIS {{cite:HwangYoon1981MADM}}, PROMETHEE II {{cite:BransVincke1985PROMETHEE}}, GRA {{cite:Deng1982GreySystems}} and VIKOR {{cite:OpricovicTzeng2004VIKOR}}. A Borda count combines them, a Copeland count cross-checks it {{cn}}, and Kendall's W reports their agreement {{cn}}.",
    out: "Borda rank, Top-3 and Kendall's W per cluster",
  },
  {
    title: "Physics validation",
    body: "A lumped-enthalpy model of a PCM and water tank, solved with backward Euler, is driven by ten years of hourly weather at each regime's medoid point. Its plain-tank solar fraction is calibrated into the 54–84% literature band {{cite:Singh2025PCMSWH}}, with a 200 kg water mass chosen inside a published tank range {{cite:Eldokaishi2022ANN_PCM_SWH}}. Energy-conservation self-tests must pass before results are used. Spearman's ρ then compares the MCDM rank with the simulated rank of each candidate.",
    out: "Simulated performance per candidate and ρ per cluster",
  },
  {
    title: "Recommendation cards",
    body: "One card per regime brings together the regime identity, climate signature, targets, candidates screened, the Top-3 with per-criterion contributions, the physics context and the caveats. The cards refuse to build if the cluster fingerprint of the earlier phases does not match.",
    out: "Recommendation card per regime",
  },
];

export const STATE_DIFFERENCES =
  "Where the states differ: Rajasthan and Tamil Nadu use the 60 °C delivery basis (Tm_target 67 °C). Uttarakhand still uses 57 °C and was not re-run on the 60 °C basis. Assam's latest cards use 56 °C (capped about 50 °C), its older documents 44 °C, and it draws its candidates from the Phase 5 filter pool. Tamil Nadu's physics script still hard-codes a 50 °C delivery constant. Tamil Nadu adds a ninth ranking criterion, thermal margin. These differences, and each state's results, are on the Objective 1 page.";
