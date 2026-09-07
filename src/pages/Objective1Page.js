import { useState } from "react";

/* ─────────────────────────────────────────────────────────
   Data definitions
   ───────────────────────────────────────────────────────── */

const pipelinePhases = [
  {
    num: "00",
    tag: "Phase 0",
    title: "Population Grid & Sun-Event Times",
    desc:
      "Builds 320 population-weighted sampling locations across Rajasthan (23.1–29.9°N) by aggregating WorldPop 2020 raster onto a 0.25° ERA5-aligned grid and keeping the minimal cell set covering ≥87.5% of population. Computes exact UTC sunrise, solar noon, and sunset for every point × every date 2016–2025 using pvlib's NREL Solar Position Algorithm (SPA).",
    output: "population_grid_points.csv · suntimes.csv",
    scripts: ["00a_build_population_grid.py", "00b_build_suntimes.py", "00c_attach_elevation.py"],
  },
  {
    num: "01",
    tag: "Phase 1",
    title: "ERA5 & NASA POWER Data Acquisition",
    desc:
      "Downloads ERA5 hourly reanalysis (temperature, humidity, wind, solar radiation) via CDS API for 3 narrow sun-event-aligned UTC windows per day — reducing download size by ~75% vs full-day pulls. Simultaneously fetches NASA POWER hourly series for the same 320 points as an independent cross-check source (GHI Pearson r = 0.973, MBE = +6.9 W/m²).",
    output: "era5/points/*.nc · nasapower/*.json",
    scripts: ["01_download_era5_rajasthan.py", "01b_download_nasapower.py"],
  },
  {
    num: "02",
    tag: "Phase 2",
    title: "Combine, Deaccumulate & Daily Aggregates",
    desc:
      "Merges all monthly NetCDF files into a continuous series, deaccumulates SSRD flux variables, computes solar geometry via pvlib, and nearest-hour-snaps ERA5 and POWER readings to exact sun-event timestamps. A second script reads the full hourly NASA POWER cache to compute true daily GHI (trapezoidal integration), DTR, HDD18, CDD24, and clearness index.",
    output: "climate_rajasthan_points.csv · daily_aggregates_rajasthan.csv",
    scripts: ["02_combine_rajasthan.py", "02b_build_daily_aggregates.py"],
  },
  {
    num: "03",
    tag: "Phase 3",
    title: "Quality Control & Preprocessing",
    desc:
      "13-step QC pipeline: physical range gating → Hampel filter (MAD-based, 7-day rolling window) for T_amb/RHum/W_spd → MICE imputation (IterativeImputer, sklearn) for missing values → quantile-mapping bias correction against NASA POWER for GHI. GHI is deliberately excluded from Hampel filtering (clouds are real, not noise).",
    output: "rajasthan_cleaned_physical.csv · qc_raw_*.html · qc_clean_*.html",
    scripts: ["04_preprocess_rajasthan.py"],
  },
  {
    num: "04",
    tag: "Phase 3b",
    title: "Climate Signature Construction",
    desc:
      "Reduces 10 years of daily records to a compact climate-signature vector per point. Tier 1 captures sun-event statistics (temperature/GHI at sunrise, noon, sunset). Tier 2 captures daily integrals (GHI, HDD, CDD, SAI). PCM-facing quantities include Tm_target (target storage temperature) and L_required (latent-heat floor). PCA compresses correlated temperature/pressure features.",
    output: "climate_signature_rajasthan.csv",
    scripts: ["04_climate_signature_rajasthan.py"],
  },
  {
    num: "05",
    tag: "Phase 4",
    title: "Climate Regime Discovery (GMM Clustering)",
    desc:
      "Fits Gaussian Mixture Models (k=2..10) to the signature vectors, selects k=3 via BIC minimum + silhouette. Three spatially coherent regimes emerge: arid Thar belt (Cluster 1), north-east/Shekhawati (Cluster 2), southern block (Cluster 0). Bootstrap ARI = 0.827 over 50 resamples confirms stability. Level B (seasonal, k=8) partition also produced for sensitivity analysis.",
    output: "cluster_profiles_rajasthan.csv · cluster_assignments_rajasthan_levelA.csv",
    scripts: ["05_cluster_rajasthan.py"],
  },
  {
    num: "06",
    tag: "Phase 5",
    title: "PCM Feasibility Filtering",
    desc:
      "Hard-screens 62 PCM candidates from the shared database (Rubitherm/Pluss datasheets + literature) against 8 sequential filters: melting window [44–73°C], latent-heat floor (L_required × κ), cycling endurance, supercooling, charging feasibility, corrosion veto, safety. Step-down κ-relaxation (0.7→0.2 per step) ensures ≥8 survivors. Result: 39 total survivors (9/14/16 per cluster).",
    output: "feasibility_survivors_rajasthan.csv · feasibility_survivors_rajasthan_kappa_calibrated.csv",
    scripts: ["07_feasibility_filter_rajasthan.py"],
  },
  {
    num: "07",
    tag: "Phase 6",
    title: "MCDM Ranking (4-Method Stack)",
    desc:
      "Ranks feasibility survivors using TOPSIS, PROMETHEE II, VIKOR, and GRA — four methodologically distinct schools (distance-from-ideal, outranking, compromise, grey relational). Consensus via Borda count + Copeland pairwise cross-check. Uncertainty propagated via 1,000 Dirichlet + Gaussian Monte Carlo draws. GRA is identified as a structural outlier in all 3 clusters.",
    output: "mcdm_rankings_rajasthan.csv · mcdm_method_agreement_rajasthan.csv",
    scripts: ["08_mcdm_ranking_rajasthan.py"],
  },
  {
    num: "08",
    tag: "Phase 7",
    title: "Physics Validation (Lumped-Enthalpy Model)",
    desc:
      "Validates MCDM rankings against a grey-box 2-node lumped-enthalpy tank model (tank water Tw + PCM node, Backward Euler solver, hourly timestep, 10-year real weather). Computes annual solar fraction, hours-in-target-band, and melt-cycle counts for each survivor at each cluster medoid. Spearman ρ between MCDM rank and simulated performance: Cluster 0 = −0.385, Cluster 1 = +0.125, Cluster 2 = −0.097.",
    output: "physics_validation_rajasthan.csv · spearman_rho_by_cluster_rajasthan.csv",
    scripts: ["09_physics_validation_rajasthan.py"],
  },
  {
    num: "09",
    tag: "Phase 8",
    title: "Supercooling Sensitivity & Recommendation Cards",
    desc:
      "Sweeps supercooling penalty k = 0.0→0.3 and computes Spearman ρ per cluster to assess ranking sensitivity. Outputs structured recommendation cards per cluster (Top-3 PCM, Tm, latent heat, Monte Carlo inclusion %, physics validation note). Top picks: RT50 (Cluster 0), savE® OM50 (Clusters 1 & 2).",
    output: "phase8_supercooling_sweep_rajasthan.csv · recommendation_cards_rajasthan.md",
    scripts: ["08_phase8_supercooling_sweep.py", "10_recommendation_cards_rajasthan.py"],
  },
];

const methods = [
  {
    icon: "🌐",
    tag: "Data Acquisition",
    title: "Population-Weighted Grid Sampling",
    desc: "320 ERA5-aligned grid points selected by WorldPop 2020 population density, covering ≥87.5% of Rajasthan's population. Ensures climate regimes represent where domestic hot-water demand actually lives.",
    why: "<strong>Why:</strong> Uniform grid sampling wastes resources on uninhabited desert. Administrative centroid sampling conflates political with climate boundaries.",
  },
  {
    icon: "☀️",
    tag: "Data Acquisition",
    title: "pvlib SPA Solar Position Algorithm",
    desc: "NREL Solar Position Algorithm (Reda & Andreas 2004) computes exact UTC sunrise, solar noon, and sunset per point per date. Sub-0.01° accuracy with atmospheric refraction correction.",
    why: "<strong>Why:</strong> Fixed clock hours (6AM / 12PM / 6PM UTC) systematically miss peak GHI at Rajasthan longitudes by up to 48 minutes.",
  },
  {
    icon: "🔧",
    tag: "Preprocessing",
    title: "Hampel Filter (MAD-based)",
    desc: "Detects non-physical temporal outliers via median ± k×MAD over a 7-day rolling window. Robust to non-Gaussian distributions. GHI deliberately excluded (clouds are real variability, not noise).",
    why: "<strong>Why:</strong> IQR outlier detection cannot distinguish a legitimate 43°C heatwave from a sensor spike. Hampel's rolling window provides temporal context.",
  },
  {
    icon: "🧩",
    tag: "Preprocessing",
    title: "MICE Imputation (IterativeImputer)",
    desc: "Multiple Imputation by Chained Equations models the joint distribution of all variables, preserving inter-variable correlations. Cascade: linear interpolation → forward/backward fill → spatial zone median → MICE.",
    why: "<strong>Why:</strong> KNN imputation ignores temporal continuity. MICE preserves the strong temperature–humidity anti-correlation in Rajasthan's climate.",
  },
  {
    icon: "📊",
    tag: "Clustering",
    title: "Gaussian Mixture Model (GMM)",
    desc: "Fits GMM for k=2..10, selects k=3 by BIC minimum + silhouette score. Soft membership probabilities capture boundary uncertainty. Bootstrap stability ARI = 0.827 over 50 resamples.",
    why: "<strong>Why:</strong> Climate in Rajasthan is a continuous gradient. K-Means assumes spherical equal-size clusters. GMM's soft probabilities are passed downstream as boundary-awareness weights.",
  },
  {
    icon: "🧮",
    tag: "MCDM",
    title: "TOPSIS (Technique for Order Preference)",
    desc: "Euclidean distance-based ranking: candidates ranked by ratio of distance-to-ideal-worst over distance-to-ideal-best. Melting temperature uses Gaussian fitness: f_Tm = exp(−(Tm − Tm_target)²/2σ²).",
    why: "<strong>Why:</strong> Gaussian fitness transforms Tm into a proper benefit criterion. Raw Tm as a benefit/cost criterion is mathematically incorrect for a target-based criterion.",
  },
  {
    icon: "⚖️",
    tag: "MCDM",
    title: "PROMETHEE II (Pairwise Outranking)",
    desc: "Computes net outranking flow φ = φ⁺ − φ⁻ for each candidate by evaluating pairwise preference functions across all criteria. Produces a complete ranking without compensatory trade-offs.",
    why: "<strong>Why:</strong> PROMETHEE captures ordinal pairwise dominance relationships that TOPSIS's distance metric can obscure when criteria have different units/scales.",
  },
  {
    icon: "🎯",
    tag: "MCDM",
    title: "VIKOR (Compromise Ranking)",
    desc: "Balances group utility (maximum individual regret minimised) and individual regret via a v-parameter. A VIKOR sign-inversion bug (best/worst reversed) was detected and fixed — visible as near-perfect anti-correlation with TOPSIS.",
    why: "<strong>Why:</strong> VIKOR's compromise solution concept is the most conservative — it selects the PCM closest to ideal for the majority of criteria simultaneously.",
  },
  {
    icon: "🔘",
    tag: "MCDM",
    title: "GRA (Grey Relational Analysis)",
    desc: "Computes grey relational grade between each candidate and the reference ideal, using normalised criterion sequences. Identified as structural outlier in all 3 clusters — negatively correlated with TOPSIS in Cluster 0.",
    why: "<strong>Why:</strong> GRA's inclusion reveals method sensitivity: where GRA diverges from TOPSIS/PROMETHEE/VIKOR, the ranking is genuinely uncertain and should be reported, not hidden.",
  },
  {
    icon: "🎲",
    tag: "Uncertainty",
    title: "Monte Carlo Sensitivity (1,000 draws)",
    desc: "Propagates weight uncertainty (Dirichlet draws) and property uncertainty (Gaussian draws on imputed properties) through 1,000 Monte Carlo simulations. Reports Top-3 inclusion probability and rank-reversal frequency.",
    why: "<strong>Why:</strong> A single-weight MCDM ranking can look decisive but be fragile. RT50 achieves 90.8% Top-3 stability in Cluster 0; savE® OM50 achieves 93.9% in Cluster 2.",
  },
  {
    icon: "🏭",
    tag: "Physics",
    title: "Lumped-Enthalpy Tank Model (Backward Euler)",
    desc: "2-node model (tank water Tw + PCM node with melt-fraction) solved with implicit Backward Euler at hourly timesteps. Unconditionally stable for time constants far shorter than the 1-hour step (coil coupling τ ≈ 3–5 min).",
    why: "<strong>Why:</strong> Forward Euler is unstable at 1-hour timesteps when τ ≈ 3 min (requires dt < 2τ = 6 min). EnergyPlus and TRNSYS rejected due to licensing and integration constraints.",
  },
  {
    icon: "🌊",
    tag: "Physics",
    title: "Random Forest PMM Imputation (PCM Database)",
    desc: "Imputes missing PCM properties (density, specific heat, thermal conductivity) for 62-candidate database using Random Forest regressors with 3-donor Predictive Mean Matching. Avoids imputed values outside physically plausible ranges.",
    why: "<strong>Why:</strong> Mean imputation destroys non-linear correlations across PCM families. MICE is unstable for n<30 rows.",
  },
];

const plots = [
  {
    id: "plot-01",
    num: "01",
    title: "Raw vs. Preprocessed Radiation",
    desc: "GHI distribution before and after Hampel filtering. GHI deliberately unchanged (clouds are real); T_amb shows visible tail-trimming. Noon peaks ~900–1050 W/m² for Rajasthan.",
    interactive: "01_raw_vs_preprocessed_radiation_interactive.html",
    static: "01_raw_vs_preprocessed_radiation.png",
    phase: "Phase 2–3",
  },
  {
    id: "plot-02",
    num: "02",
    title: "Climate Regime Map",
    desc: "320 population-weighted grid points coloured by GMM cluster (k=3). Cluster 1 = arid Thar belt; Cluster 2 = north-east Shekhawati; Cluster 0 = southern block. Spatial coherence confirms valid regime discovery.",
    interactive: "02_climate_regime_map_interactive.html",
    static: "02_climate_regime_map.png",
    phase: "Phase 4",
  },
  {
    id: "plot-03",
    num: "03",
    title: "Melting Point vs. Latent Heat",
    desc: "All 62 PCM candidates plotted (Tm vs. latent heat). Melting window [44–73°C] shown as shaded band. Cluster-coloured survivors overlay the full candidate pool. Every survivor sits above the 100 kJ/kg reference line.",
    interactive: "03_melting_point_vs_latent_heat_interactive.html",
    static: "03_melting_point_vs_latent_heat.png",
    phase: "Phase 5",
  },
  {
    id: "plot-04",
    num: "04",
    title: "Feasible Candidates Highlighted",
    desc: "Grey = full 62-candidate evaluated pool; coloured = survivors per cluster. Rejected candidates sit outside the Tm window or below the latent-heat floor. Shows the 8-filter hard-screen result visually.",
    interactive: null,
    static: "04_feasible_candidates_highlighted.png",
    phase: "Phase 5",
  },
  {
    id: "plot-05",
    num: "05",
    title: "Feasible Candidates per Climate Regime",
    desc: "9 / 14 / 16 survivors for clusters 0 / 1 / 2 — selectivity rates of 14.5% / 22.6% / 25.8%, all inside the target 10–50% band. Grouped bar compares primary (κ=0.7) vs κ-calibrated survivor counts.",
    interactive: "05_pcm_survivors_per_cluster_interactive.html",
    static: "05_pcm_survivors_per_cluster.png",
    phase: "Phase 5",
  },
  {
    id: "plot-07a",
    num: "07a",
    title: "Bump Chart — MCDM Ranks (Cluster 0)",
    desc: "Each candidate's rank across TOPSIS, PROMETHEE II, VIKOR, GRA, and Borda consensus. RT50 holds rank 1 in Cluster 0 under all methods except GRA (where it falls to 8). GRA is visibly the outlier method.",
    interactive: "07_bump_chart_ranks_cluster_0.html",
    static: "07_bump_chart_ranks_cluster_0.png",
    phase: "Phase 6",
  },
  {
    id: "plot-07b",
    num: "07b",
    title: "Bump Chart — MCDM Ranks (Cluster 1)",
    desc: "savE® OM50 holds rank 1 under TOPSIS, PROMETHEE II, VIKOR and Borda consensus in Cluster 1, dipping only to 2–3 under GRA. Flat lines indicate unanimous ranking; crossings reveal method sensitivity.",
    interactive: "07_bump_chart_ranks_cluster_1.html",
    static: "07_bump_chart_ranks_cluster_1.png",
    phase: "Phase 6",
  },
  {
    id: "plot-07c",
    num: "07c",
    title: "Bump Chart — MCDM Ranks (Cluster 2)",
    desc: "savE® OM50 dominates Cluster 2 across all methods. The bump chart reveals the degree of consensus across four methodologically distinct schools of MCDM.",
    interactive: "07_bump_chart_ranks_cluster_2.html",
    static: "07_bump_chart_ranks_cluster_2.png",
    phase: "Phase 6",
  },
  {
    id: "plot-08",
    num: "08",
    title: "Method Rank Correlation Heatmap",
    desc: "Spearman ρ and Kendall τ between all MCDM method pairs per cluster. TOPSIS↔PROMETHEE II is the strongest pair (~0.77–0.84). GRA is negatively correlated with TOPSIS in Cluster 0 — a genuine finding to report.",
    interactive: "08_method_rank_correlation_heatmap_interactive.html",
    static: "08_method_rank_correlation_heatmap.png",
    phase: "Phase 6",
  },
  {
    id: "plot-09",
    num: "09",
    title: "Monte Carlo Top-3 Inclusion Probability",
    desc: "Each candidate's probability of appearing in Top-3 across 1,000 Dirichlet weight + Gaussian property draws. RT50: 90.8% (Cluster 0). savE® OM50: 83.2% (Cluster 1), 93.9% (Cluster 2). ≥80% = robust.",
    interactive: "09_monte_carlo_top3_probability_interactive.html",
    static: "09_monte_carlo_top3_probability.png",
    phase: "Phase 6",
  },
  {
    id: "plot-10",
    num: "10",
    title: "Rank-Reversal Frequency",
    desc: "Violin + bar showing how often any two candidates swap order across 1,000 MC draws. N_DRAWS=1000 (documented deviation from literature-cited 5,000). Small spread for recommended PCMs confirms ranking robustness.",
    interactive: "10_rank_reversal_violin_interactive.html",
    static: "10_rank_reversal_violin_bar.png",
    phase: "Phase 6",
  },
  {
    id: "plot-11",
    num: "11",
    title: "Agreement Plot — MCDM vs. Physics Rank",
    desc: "Simulated annual performance rank (hours_target_met_per_year) vs. Borda consensus rank per cluster. Spearman ρ: Cluster 0 = −0.385, Cluster 1 = +0.125, Cluster 2 = −0.097. Scatter = honest result to report.",
    interactive: "11_agreement_plot_interactive.html",
    static: "11_agreement_plot.png",
    phase: "Phase 7",
  },
  {
    id: "plot-12",
    num: "12",
    title: "Tank Temperature / Melt-Fraction Profile",
    desc: "Illustrative day-cycle schematic: tank temperature crosses Tm during the solar window, melt fraction runs 0→1 and back. Per-cluster Tm_target: 48.4°C (C0) / 52.3°C (C1) / 51.1°C (C2). Cited as illustrative, not the enthalpy-porosity simulation.",
    interactive: "12_tank_temperature_melt_fraction_interactive.html",
    static: "12_tank_temperature_melt_fraction.png",
    phase: "Phase 7",
  },
  {
    id: "plot-13",
    num: "13",
    title: "Recommended PCM Summary per Cluster",
    desc: "Top-3 by Borda consensus rank per cluster with Tm annotated. Cluster 0: RT50 · RT45HC · (tie). Cluster 1: savE® OM50 · Paraffin/HDPE PCM3 · PCM6. Cluster 2: savE® OM50 · Paraffin/HDPE PCM3 · PCM6.",
    interactive: "13_recommended_pcm_summary_interactive.html",
    static: "13_recommended_pcm_summary.png",
    phase: "Phase 9",
  },
];

const phaseTabs = ["All", "Phase 2–3", "Phase 4", "Phase 5", "Phase 6", "Phase 7", "Phase 9"];

const recommendations = [
  {
    cluster: "Cluster 0 — Southern Block",
    pcm: "RT50",
    tm: "50°C",
    latentHeat: "~168 kJ/kg",
    mc: "90.8%",
    region: "Southern Rajasthan",
  },
  {
    cluster: "Cluster 1 — Thar Arid Belt",
    pcm: "savE® OM50",
    tm: "50°C",
    latentHeat: "~218 kJ/kg",
    mc: "83.2%",
    region: "Western/Thar Desert",
  },
  {
    cluster: "Cluster 2 — North-East Shekhawati",
    pcm: "savE® OM50",
    tm: "50°C",
    latentHeat: "~218 kJ/kg",
    mc: "93.9%",
    region: "North-East Rajasthan",
  },
];

/* ─────────────────────────────────────────────────────────
   PlotCard Component
   ───────────────────────────────────────────────────────── */
function PlotCard({ plot }) {
  const [showInteractive, setShowInteractive] = useState(!!plot.interactive);

  return (
    <div className="plot-card">
      <div className="plot-card-header">
        <div>
          <div className="plot-card-title">
            Plot {plot.num} — {plot.title}
          </div>
          <div className="plot-card-desc">{plot.desc}</div>
          <div className="tag-list" style={{ marginTop: 8 }}>
            <span className="tag tag-green">{plot.phase}</span>
            {plot.interactive && (
              <span className="tag tag-amber">Interactive HTML</span>
            )}
          </div>
        </div>
        <span
          className={`plot-type-badge ${
            showInteractive && plot.interactive ? "interactive" : "static"
          }`}
        >
          {showInteractive && plot.interactive ? "⚡ Interactive" : "🖼 Static"}
        </span>
      </div>

      <div className="plot-frame-container">
        {showInteractive && plot.interactive ? (
          <iframe
            src={`${process.env.PUBLIC_URL}/plots/${plot.interactive}`}
            title={plot.title}
            loading="lazy"
          />
        ) : (
          <img
            className="plot-static-img"
            src={`${process.env.PUBLIC_URL}/plots/${plot.static}`}
            alt={plot.title}
          />
        )}
      </div>

      {plot.interactive && (
        <button
          className="plot-toggle-btn"
          onClick={() => setShowInteractive((v) => !v)}
        >
          {showInteractive ? "🖼 View Static PNG" : "⚡ View Interactive"}
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Page
   ───────────────────────────────────────────────────────── */
function Objective1Page() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredPlots =
    activeTab === "All"
      ? plots
      : plots.filter((p) => p.phase === activeTab);

  return (
    <section className="content" id="top">
      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="page-hero">
        <div className="eyebrow-badge">Objective 1</div>
        <h1>Climate-Region-Aware PCM Selection for Solar Water Heating</h1>
        <p className="intro">
          A 9-phase machine learning pipeline that identifies climate-adaptive
          Phase Change Materials (PCMs) for domestic solar water heating across
          Rajasthan. The pipeline combines ERA5 reanalysis data, population-weighted
          spatial sampling, Gaussian Mixture Model clustering, 4-method MCDM
          ranking, and grey-box physics validation to produce rigorous, per-climate-regime
          PCM recommendations.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
          {[
            "320 Population-Weighted Points",
            "10 Years ERA5 + NASA POWER",
            "3 Climate Regimes (GMM)",
            "62 PCM Candidates",
            "39 Feasibility Survivors",
            "4 MCDM Methods",
            "1,000 Monte Carlo Draws",
          ].map((t) => (
            <span key={t} className="tag tag-green">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Key Stats ────────────────────────────────────── */}
      <div className="results-grid" style={{ marginBottom: 72 }}>
        {[
          { value: "320", label: "Population-Weighted Grid Points" },
          { value: "10yr", label: "ERA5 Reanalysis Coverage (2016–2025)" },
          { value: "k=3", label: "GMM Climate Regimes Discovered" },
          { value: "39", label: "PCM Feasibility Survivors (of 62)" },
          { value: "4", label: "MCDM Methods (TOPSIS / GRA / PROMETHEE / VIKOR)" },
          { value: "1000", label: "Monte Carlo Draws for Stability Testing" },
        ].map((s) => (
          <div key={s.label} className="result-stat-card">
            <div className="result-stat-value">{s.value}</div>
            <div className="result-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Pipeline Flow ─────────────────────────────────── */}
      <div className="content-section" id="pipeline-flow">
        <div className="plots-section-header">
          <h2>Implementation Flow</h2>
          <span className="plots-count-badge">9 Phases</span>
        </div>
        <p className="section-desc">
          The complete pipeline from raw ERA5 download to final PCM recommendation
          cards, implemented across 9 phases of scripts. Each phase is resumable
          and independently verifiable.
        </p>
        <div className="section-divider" />

        <div className="code-block">
{`00a_build_population_grid.py  →  population_grid_points.csv
00b_build_suntimes.py          →  suntimes.csv
01_download_era5_rajasthan.py  →  era5/points/*.nc
01b_download_nasapower.py      →  nasapower/*.json
02_combine_rajasthan.py        →  climate_rajasthan_points.csv
02b_build_daily_aggregates.py  →  daily_aggregates_rajasthan.csv
04_preprocess_rajasthan.py     →  rajasthan_cleaned_physical.csv
04_climate_signature_rajasthan.py → climate_signature_rajasthan.csv
05_cluster_rajasthan.py        →  cluster_profiles_rajasthan.csv
07_feasibility_filter_rajasthan.py → feasibility_survivors*.csv
08_mcdm_ranking_rajasthan.py   →  mcdm_rankings_rajasthan.csv
09_physics_validation_rajasthan.py → physics_validation_rajasthan.csv
10_recommendation_cards_rajasthan.py → recommendation_cards.md`}
        </div>

        <div className="pipeline-flow">
          {pipelinePhases.map((phase) => (
            <div key={phase.num} className="pipeline-phase">
              <div className="phase-indicator">
                <div className="phase-number">{phase.num}</div>
              </div>
              <div className="phase-content">
                <span className="phase-tag">{phase.tag}</span>
                <div className="phase-title">{phase.title}</div>
                <p className="phase-desc">{phase.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                  {phase.scripts.map((s) => (
                    <span key={s} className="phase-output">{s}</span>
                  ))}
                </div>
                <span className="phase-output">{phase.output}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Methods ──────────────────────────────────────── */}
      <div className="content-section" id="methods">
        <div className="plots-section-header">
          <h2>Methods Used</h2>
          <span className="plots-count-badge">12 Algorithms</span>
        </div>
        <p className="section-desc">
          Every algorithmic choice is documented with rationale and two explicitly
          rejected alternatives. Methods span data acquisition, QC/preprocessing,
          statistical clustering, multi-criteria decision making, and physics simulation.
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

      {/* ── Data Collection Detail ────────────────────────── */}
      <div className="content-section" id="data-collection">
        <h2>Phase 1 — Data Collection</h2>
        <p className="section-desc">
          Dual-source data acquisition: ERA5 reanalysis from Copernicus CDS API
          and NASA POWER from the REST API, for 320 population-weighted points
          across Rajasthan (2016–2025).
        </p>
        <div className="section-divider" />

        <h3>Cross-Source Agreement (ERA5 vs NASA POWER)</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Variable</th>
              <th>MBE</th>
              <th>RMSE</th>
              <th>Pearson r</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["GHI (W/m²)", "+6.9 W/m²", "83.3 W/m²", "0.973"],
              ["T_amb (°C)", "+0.50°C", "—", "0.912"],
              ["Relative Humidity (%)", "+7.7%", "—", "0.830"],
            ].map(([v, m, r, p]) => (
              <tr key={v}>
                <td>{v}</td>
                <td>{m}</td>
                <td>{r}</td>
                <td>{p}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 style={{ marginTop: 24 }}>Key Design Choices</h3>
        <div className="findings-list">
          {[
            { icon: "📍", text: "<strong>Population-weighted sampling:</strong> 320 points from WorldPop 2020 raster aggregated onto ERA5's 0.25° grid. Covering 70.3M people with zero missing data across all 7 variables." },
            { icon: "🕐", text: "<strong>Sun-event-aligned downloads:</strong> Three narrow UTC windows per day (±1hr around sunrise, solar noon, sunset) reduce download volume by ~75% vs full-day pulls while capturing the solar-relevant moments." },
            { icon: "🌙", text: "<strong>Cross-midnight UTC handling:</strong> Eastern Rajasthan's summer sunrise can fall at 23:55 UTC the previous calendar day — pvlib's SPA handles this correctly; the pipeline stores true UTC instants." },
          ].map((f, i) => (
            <div key={i} className="finding-item">
              <span className="finding-icon">{f.icon}</span>
              <span className="finding-text" dangerouslySetInnerHTML={{ __html: f.text }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Preprocessing Detail ──────────────────────────── */}
      <div className="content-section" id="preprocessing">
        <h2>Phase 2–3 — Preprocessing & QC</h2>
        <p className="section-desc">
          A 13-step quality control pipeline transforms raw ERA5 downloads into
          clean, bias-corrected, feature-engineered climate signatures.
        </p>
        <div className="section-divider" />

        <h3>13-Step QC Pipeline</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Step</th>
              <th>Method</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["1", "Physical range gating", "Hard bounds", "Removes physically impossible values"],
              ["2", "Hampel filter", "Median ± k×MAD, 7-day window", "T_amb / RHum / W_spd only — GHI excluded"],
              ["3", "Gap detection", "Continuity check", "Identifies missing ERA5 hours"],
              ["4", "Linear interpolation", "1D interpolation", "Short gaps (≤2 hours)"],
              ["5–6", "Forward/backward fill", "Temporal fill", "Medium gaps"],
              ["7", "Spatial zone median", "Spatial imputation", "Long gaps using zone neighbours"],
              ["8", "MICE imputation", "IterativeImputer (sklearn)", "Gold standard for multivariate imputation"],
              ["9", "Quantile mapping", "NASA POWER reference", "Bias-corrects ERA5 GHI systematic offset"],
              ["10–13", "Feature engineering", "Rolling stats, lag features, PCA", "Prepares climate signature inputs"],
            ].map(([n, s, m, note]) => (
              <tr key={n}>
                <td style={{ fontVariantNumeric: "tabular-nums", color: "var(--brand-400)", fontWeight: 600 }}>{n}</td>
                <td style={{ fontWeight: 500, color: "white" }}>{s}</td>
                <td><code>{m}</code></td>
                <td style={{ color: "var(--neutral-500)", fontSize: "0.8rem" }}>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Clustering Detail ─────────────────────────────── */}
      <div className="content-section" id="clustering">
        <h2>Phase 4 — Climate Regime Clustering</h2>
        <p className="section-desc">
          Gaussian Mixture Models discover data-driven climate regimes from the
          compact climate-signature vectors, rather than relying on Köppen-Geiger
          hand-drawn zones.
        </p>
        <div className="section-divider" />

        <div className="methods-grid" style={{ marginBottom: 28 }}>
          {[
            { label: "Algorithm", value: "GMM (Gaussian Mixture Model)", note: "covariance_type='diag'" },
            { label: "Cluster count", value: "k = 3", note: "BIC minimum + silhouette" },
            { label: "Avg. silhouette", value: "0.313", note: "Cluster 0: 0.296 / C1: 0.287 / C2: 0.359" },
            { label: "Bootstrap ARI", value: "0.827", note: "50 resamples — stable" },
            { label: "Köppen agreement", value: "ARI = 0.189", note: "Partial — Rajasthan is gradients" },
            { label: "Davies-Bouldin", value: "1.130", note: "Calinski-Harabász = 172.0" },
          ].map(({ label, value, note }) => (
            <div key={label} className="method-card" style={{ padding: 16 }}>
              <div className="method-card-tag">{label}</div>
              <h3 style={{ fontSize: "1.1rem" }}>{value}</h3>
              <p style={{ fontSize: "0.78rem" }}>{note}</p>
            </div>
          ))}
        </div>

        <div className="findings-list">
          {[
            { icon: "🗺️", text: "<strong>Cluster 0 (Southern Block):</strong> Lowest mean latitude. Cluster mean ambient 26.5–27.8°C, noon GHI peak ≈ 900–1050 W/m²." },
            { icon: "🏜️", text: "<strong>Cluster 1 (Thar Arid Belt):</strong> Western Rajasthan. Highest solar radiation, lowest humidity. Drives high Tm_target (~52°C)." },
            { icon: "🌾", text: "<strong>Cluster 2 (Shekhawati, North-East):</strong> 16 PCM survivors — highest selectivity rate (25.8%). The regime most amenable to PCM integration." },
            { icon: "⚠️", text: "<strong>Limitation acknowledged:</strong> Silhouette 0.313 does not meet the '>0.35 rule'. Rajasthan's climate is a continuous gradient, not discrete blobs. The strong bootstrap ARI (0.827) provides the primary validity evidence." },
          ].map((f, i) => (
            <div key={i} className="finding-item">
              <span className="finding-icon">{f.icon}</span>
              <span className="finding-text" dangerouslySetInnerHTML={{ __html: f.text }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Feasibility Detail ────────────────────────────── */}
      <div className="content-section" id="feasibility">
        <h2>Phase 5 — PCM Feasibility Filtering</h2>
        <p className="section-desc">
          Eight sequential hard-filters screen 62 PCM candidates against each
          cluster's specific design constraints, producing the feasible pool for MCDM ranking.
        </p>
        <div className="section-divider" />

        <h3>8-Filter Hard Screen</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Filter</th>
              <th>Threshold</th>
              <th>Tightest Gate</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["c1", "Melting window", "Tm_target ± relaxation [44–73°C]", ""],
              ["c2", "Absolute Tm band", "35–80°C hard limit", ""],
              ["c3", "Latent heat floor", "latent_heat ≥ L_required × κ", "~160 pass / 131 fail (c6 tighter)"],
              ["c4", "Cycling endurance", "≥ 1000 cycles", ""],
              ["c5", "Supercooling", "ΔT_sc ≤ threshold", ""],
              ["c6", "Charging feasibility", "Bi number check", "~55 pass / 131 fail — tightest gate"],
              ["c7", "Corrosion veto", "Material compatibility", "not_applicable for this pool"],
              ["c8", "Safety flags", "Flammability / toxicity", "not_applicable for this pool"],
            ].map(([n, f, t, note]) => (
              <tr key={n}>
                <td style={{ color: "var(--brand-400)", fontWeight: 600 }}>{n}</td>
                <td style={{ fontWeight: 500, color: "white" }}>{f}</td>
                <td><code>{t}</code></td>
                <td style={{ color: "var(--neutral-500)", fontSize: "0.8rem" }}>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 style={{ marginTop: 24 }}>Survivor Counts (post κ-calibration)</h3>
        <div className="results-grid">
          {[
            { value: "9", label: "Cluster 0 survivors (14.5% selectivity)" },
            { value: "14", label: "Cluster 1 survivors (22.6% selectivity)" },
            { value: "16", label: "Cluster 2 survivors (25.8% selectivity)" },
            { value: "39", label: "Total survivors from 62 candidates" },
          ].map((s) => (
            <div key={s.label} className="result-stat-card">
              <div className="result-stat-value">{s.value}</div>
              <div className="result-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MCDM Detail ──────────────────────────────────── */}
      <div className="content-section" id="mcdm">
        <h2>Phase 6 — MCDM Ranking</h2>
        <p className="section-desc">
          Four methodologically distinct MCDM methods rank feasibility survivors.
          Consensus via Borda count. Uncertainty quantified by 1,000 Monte Carlo draws.
        </p>
        <div className="section-divider" />

        <h3>Method Agreement (Spearman ρ highlights)</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Method Pair</th>
              <th>Cluster 0</th>
              <th>Cluster 1</th>
              <th>Cluster 2</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["TOPSIS ↔ PROMETHEE II", "~0.77", "~0.84", "~0.81"],
              ["TOPSIS ↔ VIKOR", "positive", "positive", "positive"],
              ["TOPSIS ↔ GRA", "negative (outlier)", "moderate", "moderate"],
              ["Kendall's W (all 4)", "0.388 (weak)", "0.634 (good)", "0.635 (good)"],
            ].map(([pair, c0, c1, c2]) => (
              <tr key={pair}>
                <td style={{ fontWeight: 500, color: "white" }}>{pair}</td>
                <td style={{ color: pair.includes("Kendall") && c0.includes("weak") ? "#fbbf24" : "inherit" }}>{c0}</td>
                <td>{c1}</td>
                <td>{c2}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="findings-list" style={{ marginTop: 20 }}>
          {[
            { icon: "🐛", text: "<strong>VIKOR bug documented & fixed:</strong> A sign-inversion bug (best/worst terms reversed) caused VIKOR ranks to be nearly perfectly inverted vs TOPSIS (ρ as low as −0.86). Detected via the bump chart and fixed. Any future regeneration showing VIKOR anti-correlated with TOPSIS is a red flag." },
            { icon: "📉", text: "<strong>GRA is a structural outlier</strong> in all 3 clusters. Negatively correlated with TOPSIS in Cluster 0. This is a genuine finding to report in the methodology write-up, not smooth over." },
            { icon: "🔀", text: "<strong>Cluster 0 lowest agreement</strong> (Kendall's W = 0.388 vs 0.634–0.635 for C1/C2). Reflects genuine uncertainty in the southern regime, not data error. Monte Carlo rank-reversal frequency for Cluster 0 is correspondingly higher." },
          ].map((f, i) => (
            <div key={i} className="finding-item">
              <span className="finding-icon">{f.icon}</span>
              <span className="finding-text" dangerouslySetInnerHTML={{ __html: f.text }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Physics Validation Detail ─────────────────────── */}
      <div className="content-section" id="physics">
        <h2>Phase 7 — Physics Validation</h2>
        <p className="section-desc">
          A lumped-enthalpy grey-box tank model validates whether MCDM rankings
          actually correspond to better simulated thermal performance.
        </p>
        <div className="section-divider" />

        <h3>Model Architecture</h3>
        <div className="methods-grid" style={{ marginBottom: 24 }}>
          {[
            { label: "Model type", value: "2-Node Lumped-Enthalpy", note: "Tank water Tw + PCM node Tp/f" },
            { label: "ODE solver", value: "Backward Euler (Implicit)", note: "Unconditionally stable at 1-hr timestep" },
            { label: "Time resolution", value: "Hourly", note: "Over full representative year per cluster" },
            { label: "Tank coil coupling", value: "Heat exchanger model", note: "Time constant τ ≈ 3–5 minutes" },
          ].map(({ label, value, note }) => (
            <div key={label} className="method-card" style={{ padding: 16 }}>
              <div className="method-card-tag">{label}</div>
              <h3 style={{ fontSize: "1rem" }}>{value}</h3>
              <p style={{ fontSize: "0.78rem" }}>{note}</p>
            </div>
          ))}
        </div>

        <h3>MCDM Rank vs. Physics Performance</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Cluster</th>
              <th>Spearman ρ</th>
              <th>Interpretation</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Cluster 0 (Southern)", "−0.385", "Negative correlation — MCDM rank does not predict physics performance"],
              ["Cluster 1 (Thar)", "+0.125", "Weak positive — best agreement of the three"],
              ["Cluster 2 (Shekhawati)", "−0.097", "Flat/weak negative — near-random"],
            ].map(([c, rho, interp]) => (
              <tr key={c}>
                <td style={{ fontWeight: 500, color: "white" }}>{c}</td>
                <td style={{ color: rho.startsWith("-") ? "#fbbf24" : "var(--brand-300)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{rho}</td>
                <td style={{ fontSize: "0.82rem", color: "var(--neutral-400)" }}>{interp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="section-desc" style={{ marginTop: 12, fontSize: "0.85rem" }}>
          The weak/negative Spearman ρ is an <strong style={{ color: "white" }}>honest result to report</strong>, 
          not a bug. PCM thermal performance in a real tank also depends on system design, 
          flow rates, and thermal coupling — properties not fully captured by the 8 MCDM criteria alone.
        </p>
      </div>

      {/* ── Interactive Plots ─────────────────────────────── */}
      <div className="content-section" id="interactive-plots">
        <div className="plots-section-header">
          <h2>Interactive Plots</h2>
          <span className="plots-count-badge">{plots.length} plots</span>
        </div>
        <p className="section-desc">
          13 objective-1 plots covering all pipeline stages. Each plot includes
          a static PNG and, where available, a Plotly interactive HTML version.
          Toggle between views using the button below each plot.
        </p>
        <div className="section-divider" />

        <div className="plots-tab-bar">
          {phaseTabs.map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {filteredPlots.map((plot) => (
          <PlotCard key={plot.id} plot={plot} />
        ))}
      </div>

      {/* ── Results & Recommendations ─────────────────────── */}
      <div className="content-section" id="results">
        <h2>Results & Recommendations</h2>
        <p className="section-desc">
          Final PCM recommendations per climate regime, supported by ≥80%
          Monte Carlo Top-3 inclusion probability in all three clusters.
        </p>
        <div className="section-divider" />

        <h3>Top-Ranked PCM per Climate Regime</h3>
        <div className="recommendation-cards-grid">
          {recommendations.map((r) => (
            <div key={r.cluster} className="rec-card">
              <div className="rec-card-cluster">{r.cluster}</div>
              <div className="rec-card-pcm">{r.pcm}</div>
              <div className="rec-card-props">
                <div className="rec-prop">
                  <span className="rec-prop-label">Target Tm</span>
                  <span className="rec-prop-value">{r.tm}</span>
                </div>
                <div className="rec-prop">
                  <span className="rec-prop-label">Latent Heat</span>
                  <span className="rec-prop-value">{r.latentHeat}</span>
                </div>
                <div className="rec-prop">
                  <span className="rec-prop-label">MC Top-3 Stability</span>
                  <span className="rec-prop-value" style={{ color: "var(--brand-300)" }}>{r.mc}</span>
                </div>
                <div className="rec-prop">
                  <span className="rec-prop-label">Region</span>
                  <span className="rec-prop-value">{r.region}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: 40 }}>Key Findings</h3>
        <div className="findings-list">
          {[
            { icon: "✅", text: "<strong>savE® OM50 dominates Clusters 1 & 2</strong> — rank 1 under TOPSIS, PROMETHEE II, VIKOR and Borda consensus in both regimes. Monte Carlo stability ≥83%. Commercially available paraffin-based PCM with Tm ≈ 50°C and high latent heat." },
            { icon: "✅", text: "<strong>RT50 is the top pick for Cluster 0</strong> — holds rank 1 under all 4 methods except GRA (rank 8), reflecting Cluster 0's wider method disagreement (Kendall's W = 0.388). Still robust at 90.8% MC inclusion." },
            { icon: "📊", text: "<strong>GRA consistently disagrees</strong> with the other three methods across all clusters. This method-sensitivity finding is methodologically significant: GRA's grey relational grade normalisation treats all deviations linearly, while TOPSIS/PROMETHEE/VIKOR use non-linear aggregation." },
            { icon: "⚖️", text: "<strong>MCDM rankings do not strongly predict physics performance</strong> (Spearman ρ = −0.385 to +0.125). This is an honest, documented finding: a high MCDM rank reflects good nominal PCM properties, but real-world thermal performance also depends on system design factors not captured by the 8 criteria." },
            { icon: "📐", text: "<strong>L_required methodology corrected (2026-08-31):</strong> SHARE_PCM=0.5 applied to reflect PCM contributing ~50% of combined sensible+latent thermal delivery. This shifted L_required from 608–641 kJ/kg (zero survivors) to 285–344 kJ/kg (39 total survivors at κ-calibrated threshold)." },
            { icon: "🔬", text: "<strong>Silhouette limitation acknowledged:</strong> Average silhouette 0.313 does not meet the canonical >0.35 threshold, reflecting Rajasthan's relatively homogeneous climate (contiguous gradients rather than well-separated blobs). Primary validity evidence is bootstrap ARI = 0.827." },
          ].map((f, i) => (
            <div key={i} className="finding-item">
              <span className="finding-icon">{f.icon}</span>
              <span className="finding-text" dangerouslySetInnerHTML={{ __html: f.text }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Objective1Page;
