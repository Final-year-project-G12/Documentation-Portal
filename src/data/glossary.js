/* ─────────────────────────────────────────────────────────
   glossary.js — plain-language definitions shown when a reader
   hovers (or focuses) a technical term. Matching rules:
   • `match`: phrases to find in the text (longest phrase wins);
   • `cs: true`: case-sensitive (abbreviations);
   • each term is marked only once per block of text, so a page
     is not covered in underlines.
   Definitions are for a reader who knows Python and basic ML but
   not thermal engineering.
   ───────────────────────────────────────────────────────── */

export const GLOSSARY = [
  // ── PCM and solar water heating ─────────────────────────
  { key: "pcm", name: "PCM (phase change material)", match: ["Phase Change Materials", "Phase Change Material", "phase change material", "PCMs", "PCM"], cs: true,
    def: "A material that stores heat by melting and gives it back when it freezes." },
  { key: "latent", name: "Latent heat", match: ["latent heat", "Latent heat"], cs: true,
    def: "Heat a material absorbs while melting at a nearly constant temperature, in kJ/kg. It is a PCM's main storage capacity." },
  { key: "sensible", name: "Sensible heat", match: ["sensible water buffer", "sensible heat", "sensible-heat"], def: "Heat stored by a temperature rise, as in plain hot water." },
  { key: "enthalpy", name: "Enthalpy", match: ["enthalpy"], def: "Total heat content of a material. For a PCM it jumps while the material melts." },
  { key: "melting", name: "Melting point (Tm)", match: ["melting-point", "melting point"], def: "The temperature at which the PCM melts and stores heat." },
  { key: "supercooling", name: "Supercooling", match: ["supercooling"], def: "The PCM stays liquid below its melting point before freezing, which delays heat release." },
  { key: "solarfraction", name: "Solar fraction", match: ["solar fraction", "solar-fraction"], def: "The share of the hot-water energy that comes from the sun, from 0 to 100%." },
  { key: "delivery", name: "Delivery temperature", match: ["delivery temperature", "delivery constant", "delivery basis", "delivery target"], def: "The water temperature the user needs at the tap. The shared setup uses 60 °C." },
  { key: "tmtarget", name: "Tm_target", match: ["Tm_target"], cs: true, def: "The melting point a region needs: delivery temperature plus a heat-exchanger margin of 7 K, so 67 °C on the 60 °C basis." },
  { key: "lrequired", name: "L_required", match: ["L_required"], cs: true, def: "The latent heat per kg the PCM must supply for its share of the night's hot water." },
  { key: "sharepcm", name: "SHARE_PCM", match: ["SHARE_PCM"], cs: true, def: "The fraction of night-time hot-water energy that the PCM supplies. The portal uses 0.5." },
  { key: "qnight", name: "Q_night", match: ["Q_night"], cs: true, def: "The heat needed to supply hot water after sunset. The calculation assumes 300 L a day." },
  { key: "mpcm", name: "m_PCM", match: ["m_PCM"], cs: true, def: "The mass of the PCM bed. A 50 kg placeholder is used only to turn energy into latent heat per kg." },
  { key: "kappa", name: "κ (kappa)", match: ["κ"], cs: true, def: "A factor that scales the latent-heat requirement used to filter candidates. It starts at 0.7 and is calibrated per cluster." },
  { key: "mains", name: "Mains-water temperature", match: ["mains-water temperature", "mains temperature"], def: "The temperature of the cold water entering the heater." },
  { key: "cycling", name: "Cycling stability", match: ["cycling stability", "cycling"], def: "How many melt-and-freeze cycles a PCM survives before it degrades." },
  { key: "conductivity", name: "Thermal conductivity", match: ["thermal conductivity", "conductivity"], def: "How fast heat moves through the material. Low values slow charging." },
  { key: "volumetric", name: "Volumetric latent heat", match: ["volumetric latent heat"], def: "Latent heat per litre instead of per kg: density times latent heat." },
  { key: "corrosion", name: "Corrosion veto", match: ["corrosion veto"], def: "A rule that removes materials likely to corrode the tank." },
  { key: "lumped", name: "Lumped model", match: ["lumped-enthalpy", "lumped enthalpy", "lumped"], def: "A simulation that treats the tank and PCM as a few uniform blocks instead of a detailed 3-D model." },
  { key: "euler", name: "Backward Euler", match: ["backward Euler", "Backward Euler"], cs: true, def: "A numerically stable way to step a simulation forward in time." },
  { key: "capsule", name: "Capsule", match: ["capsules", "capsule"], def: "A sealed container that holds the PCM inside the tank." },

  // ── Climate data ───────────────────────────────────────
  { key: "reanalysis", name: "Reanalysis", match: ["reanalysis"], def: "Hourly weather records rebuilt by combining observations with a weather model." },
  { key: "era5", name: "ERA5", match: ["ERA5"], cs: true, def: "A widely used reanalysis dataset from the European weather centre (ECMWF)." },
  { key: "power", name: "NASA POWER", match: ["NASA POWER"], cs: true, def: "A second, independent satellite-based weather dataset used to cross-check ERA5." },
  { key: "ghi", name: "GHI", match: ["GHI"], cs: true, def: "Global horizontal irradiance: total sunlight reaching a flat horizontal surface, in W/m²." },
  { key: "clearness", name: "Clearness index", match: ["clearness"], def: "How much of the possible sunlight reaches the ground. 1 means a clear sky." },
  { key: "dtr", name: "DTR", match: ["DTR"], cs: true, def: "Daily temperature range: the day's highest temperature minus its lowest." },
  { key: "degreedays", name: "Degree days", match: ["heating and cooling degree days", "degree days"], def: "Yearly totals of how far temperatures fall below or rise above a comfort threshold." },
  { key: "medoid", name: "Medoid", match: ["medoids", "medoid"], def: "The real data point closest to a cluster's centre." },
  { key: "signature", name: "Climate signature", match: ["climate signature", "Climate signature"], cs: true, def: "A short list of numbers that describes a location's climate." },

  // ── Data preparation and clustering ────────────────────
  { key: "quantile", name: "Quantile mapping", match: ["quantile mapping", "quantile-mapping"], def: "Adjusts one dataset so its value distribution matches a trusted reference." },
  { key: "hampel", name: "Hampel filter", match: ["Hampel filter", "Hampel"], cs: true, def: "Flags outliers using the median and the median absolute deviation (MAD)." },
  { key: "mice", name: "MICE imputation", match: ["chained-equation imputation", "chained-equation (MICE) imputation", "chained equations", "MICE"], cs: true, def: "Fills gaps by predicting each missing value from the other variables, repeatedly." },
  { key: "imputation", name: "Imputation", match: ["imputation", "imputed"], def: "Filling in missing values with estimates." },
  { key: "pmm", name: "Predictive-mean matching", match: ["predictive-mean matching"], def: "Fills a gap with a real observed value taken from a similar row." },
  { key: "pca", name: "PCA", match: ["PCA"], cs: true, def: "Principal component analysis: compresses correlated columns into a few uncorrelated ones." },
  { key: "gmm", name: "GMM (Gaussian mixture model)", match: ["Gaussian Mixture Models", "Gaussian Mixture Model", "GMM"], cs: true, def: "Groups points into bell-curve-shaped clusters and gives each point a membership probability." },
  { key: "diagcov", name: "Diagonal covariance", match: ["diagonal-covariance", "diagonal covariance"], def: "Each feature gets its own spread, with no coupling between features in the model." },
  { key: "bic", name: "BIC", match: ["Bayesian information criterion", "Bayesian Information Criterion", "BIC"], cs: true, def: "A score that rewards a good fit and penalises extra clusters. Lower is better." },
  { key: "silhouette", name: "Silhouette score", match: ["silhouette"], def: "How tight and well separated the clusters are, from −1 to 1. Higher is better." },
  { key: "dbi", name: "Davies–Bouldin", match: ["Davies–Bouldin"], cs: true, def: "A cluster-separation score. Lower is better." },
  { key: "chi", name: "Calinski–Harabasz", match: ["Calinski–Harabasz"], cs: true, def: "A cluster-separation score. Higher is better." },
  { key: "bootstrap", name: "Bootstrap stability", match: ["bootstrap stability", "bootstrap"], def: "How stable the clusters stay when the data are resampled." },
  { key: "regime", name: "Regime", match: ["regimes", "regime"], def: "One cluster, read as a climate type." },

  // ── Ranking and validation ─────────────────────────────
  { key: "mcdm", name: "MCDM", match: ["multi-criteria decision making", "multi-criteria decision analysis", "MCDM"], cs: true, def: "Multi-criteria decision making: ranks options that are good on some criteria and poor on others." },
  { key: "topsis", name: "TOPSIS", match: ["TOPSIS"], cs: true, def: "Ranks options by closeness to the best imaginary option and distance from the worst." },
  { key: "promethee", name: "PROMETHEE II", match: ["PROMETHEE II", "PROMETHEE"], cs: true, def: "Ranks options by how strongly each beats the others, criterion by criterion." },
  { key: "vikor", name: "VIKOR", match: ["VIKOR"], cs: true, def: "Finds a compromise option that limits the worst shortfall on any single criterion." },
  { key: "gra", name: "GRA (grey relational analysis)", match: ["grey relational analysis", "GRA"], cs: true, def: "Ranks options by how closely their profile follows the ideal profile." },
  { key: "entropy", name: "Shannon-entropy weights", match: ["Shannon-entropy weights", "Shannon-entropy"], cs: true, def: "Criterion weights that give more importance to criteria whose values differ most between options." },
  { key: "borda", name: "Borda count", match: ["Borda"], cs: true, def: "Combines several rankings by adding up each option's rank points." },
  { key: "copeland", name: "Copeland count", match: ["Copeland"], cs: true, def: "A cross-check that counts each option's pairwise wins." },
  { key: "kendall", name: "Kendall's W", match: ["Kendall's W", "Kendall’s W"], cs: true, def: "Agreement between rankings, from 0 (none) to 1 (identical)." },
  { key: "spearman", name: "Spearman ρ", match: ["Spearman ρ", "Spearman's ρ", "Spearman"], cs: true, def: "Rank correlation from −1 to +1. Here it compares the MCDM rank with the simulated rank." },
  { key: "reversal", name: "Rank reversal", match: ["rank-reversal", "rank reversal", "Rank-Reversal"], def: "Two options swap order when weights or inputs change slightly." },
  { key: "bump", name: "Bump chart", match: ["bump charts", "bump chart", "Bump Chart"], cs: true, def: "A line chart of each option's rank under each method." },

  // ── Objective 2 ────────────────────────────────────────
  { key: "doe", name: "DOE (design of experiments)", match: ["DOE"], cs: true, def: "A planned set of simulation runs spread evenly over the design space." },
  { key: "lhs", name: "Latin Hypercube Sampling", match: ["Latin Hypercube Sampling", "Latin Hypercube", "LHS"], cs: true, def: "A way to pick sample points that cover every input range evenly." },
  { key: "surrogate", name: "Surrogate model", match: ["surrogate"], def: "A fast machine-learning model that imitates a slow simulator." },
  { key: "nsga", name: "NSGA-II", match: ["NSGA-II"], cs: true, def: "A genetic algorithm that searches for the best trade-offs between several goals." },
  { key: "mopso", name: "MOPSO", match: ["MOPSO"], cs: true, def: "Multi-objective particle swarm optimisation: a swarm of candidate designs moves toward good trade-offs." },
  { key: "pareto", name: "Pareto front", match: ["Pareto"], cs: true, def: "The set of designs where no goal can improve without another getting worse." },
  { key: "drl", name: "DRL (deep reinforcement learning)", match: ["deep reinforcement learning", "Deep Reinforcement Learning", "DRL"], cs: true, def: "A controller that learns by trial and reward using a neural network." },
  { key: "ppo", name: "PPO", match: ["PPO"], cs: true, def: "Proximal policy optimisation: a common deep reinforcement learning algorithm." },
  { key: "extratrees", name: "ExtraTrees", match: ["ExtraTrees"], cs: true, def: "A tree-ensemble model that picks split points at random, which keeps it stable on small tables." },
  { key: "montecarlo", name: "Monte Carlo", match: ["Monte Carlo"], cs: true, def: "Re-running a simulation many times with randomly varied inputs to see how results spread." },
  { key: "greybox", name: "Grey-box model", match: ["grey-box", "Grey-box", "Grey-Box"], cs: true, def: "A model built on known physics equations with a few fitted parameters." },
];

export const GLOSSARY_BY_KEY = Object.fromEntries(GLOSSARY.map((g) => [g.key, g]));
