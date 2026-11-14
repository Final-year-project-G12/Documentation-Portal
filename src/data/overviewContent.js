/* ─────────────────────────────────────────────────────────
   Overview content from the Review 4 presentation (Nov 2026):
   motivation (slide 3), research themes (slide 4), literature
   survey (slides 5–9), research gaps and problem statement
   (slides 10–11) and trade-offs / future scope (slide 34).
   Text tokens: {{cite:Key}}, {{cn}}, <strong>.
   ───────────────────────────────────────────────────────── */

export const MOTIVATION_FLOW = [
  {
    kicker: "How it works today",
    points: [
      "The sun heats a collector, a pump or thermosiphon carries that heat into a water tank, and the tank supplies the household.",
      "Flat-plate collectors reach 45–60% efficiency, evacuated tubes more {{cite:AlMamun2023SWHReview}}.",
      "The tank stores heat as hot water only, so its temperature rises and falls with the sun.",
      "The pump is normally run at a fixed speed by a simple on/off rule {{cite:Barqawi2025MLPCMSWH}} {{cite:Singh2025PCMSWH}}.",
    ],
  },
  {
    kicker: "Why that is not good enough",
    points: [
      "Sunlight comes at midday, but hot water is wanted in the evening and early morning.",
      "Sensible storage swings in temperature and delivers little overnight {{cite:Singh2025PCMSWH}} {{cite:AlMamun2023SWHReview}}.",
      "Fixed-speed control cannot react to changing sun or demand, so systems are oversized or fall back on an electric backup heater {{cite:Barqawi2025MLPCMSWH}}.",
    ],
  },
  {
    kicker: "What we improve",
    points: [
      "<strong>Store the heat better:</strong> PCM capsules in the tank hold heat at a useful temperature overnight (51–52 °C) and cut the tank volume needed {{cite:Singh2025PCMSWH}} {{cite:Hamza2025PCMReview}} {{cite:Rathore2024ThermalPCM}}.",
      "<strong>Operate it better:</strong> learned control already beats fixed-speed and rule-based operation in published work, while PCM choice, sizing and control are still studied separately and rarely matched to the local climate {{cite:Emami2026DRLSolar}} {{cite:OdoiYorke2025AISWH}} {{cite:Liu2025AIPCMTES}}.",
    ],
  },
];

export const RESEARCH_GAPS = [
  { title: "Limited real-time adaptive control", text: "Most PCM-based systems use passive or fixed-rule strategies, lacking dynamic response to varying solar input and demand {{cite:Barqawi2025MLPCMSWH}} {{cite:Emami2026DRLSolar}}." },
  { title: "Lack of integrated PCM–AI–hardware systems", text: "Prior studies treat materials, control and implementation separately without a complete working prototype {{cite:OdoiYorke2025AISWH}} {{cite:Liu2025AIPCMTES}}." },
  { title: "Poor alignment with real usage patterns", text: "Existing systems rarely adapt storage and release to actual household demand {{cite:Assareh2023MLPCMSolarCollector}}." },
  { title: "Limited real-world validation", text: "Most research relies on simulations or short-term tests rather than long-term experimental evaluation {{cite:AlMamun2023SWHReview}} {{cite:OdoiYorke2025AISWH}}." },
  { title: "Limited predictive optimization under climatic uncertainty", text: "Most PCM-based systems lack predictive models that anticipate changes in solar input and demand, which leads to poor use of the thermal storage {{cite:Ghodusinejad2026SolarForecast}} {{cite:Liu2025AIPCMTES}}." },
];

export const PROBLEM_STATEMENT = {
  overall: "Most PCM-based solar water heating systems use passive or fixed control rules, leading to delayed heat availability, inefficient storage and energy loss under variable climatic and hot-water demand conditions {{cite:Barqawi2025MLPCMSWH}}.",
  novel: "To design and implement an autonomous, AI-driven PCM-based thermal storage system that dynamically optimizes heat charging and discharging under real-world operating conditions {{cite:Liu2025AIPCMTES}} {{cite:Emami2026DRLSolar}}.",
};

export const RESEARCH_THEMES = [
  {
    journal: "Energy and AI (Elsevier)",
    issue: "Special Issue: Physics and Data Hybrid-Driven Methods for Intelligent Energy Management {{cite:Fan2026EnergyAISpecialIssue}}",
    deadline: "14 May 2027",
    points: [
      "Hybrid physics-based (enthalpy-porosity) and data-driven thermal modelling",
      "AI-driven optimisation of PCM storage design parameters",
      "Data-driven energy management under weather and demand uncertainty",
    ],
  },
  {
    journal: "Solar Energy Advances (Elsevier, ISES)",
    issue: "Special Issue: Integrated Solar Energy Systems: From Materials to Sustainable Energy Transitions {{cite:Kolokotsa2026SEASpecialIssue}}",
    deadline: "31 March 2027",
    points: [
      "Materials-to-system integration of PCM thermal storage in solar water heating",
      "Climate-aware PCM selection for solar thermal applications",
      "Smart operation, sensing and control of solar energy systems",
      "AI and solar data analytics for performance evaluation",
    ],
  },
];

export const INDUSTRY_EXPERT = "C. Muruganandan, Director – Asset Operations, Brookfield Renewable, India (works on solar industry projects and related research).";

/* Literature survey: 20 papers in five groups (slides 5–9). */
export const LITERATURE = [
  {
    id: "pcm",
    label: "PCM-focused",
    papers: [
      { author: "Abdulhammed K. Hamza", year: 2025, cite: "Hamza2025PCMReview", objective: "Review PCM-based solar energy storage systems and assess environmental and performance impacts.", parameters: "PCM thermophysical properties, solar input, storage efficiency, lifecycle indicators.", methods: "Literature review, numerical modelling", future: "AI-assisted PCM selection, embedded optimization strategies." },
      { author: "P. K. S. Rathore", year: 2024, cite: "Rathore2024ThermalPCM", objective: "Investigate PCM integration to improve solar thermal system efficiency.", parameters: "PCM type, melting range, latent heat, conductivity, storage efficiency.", methods: "PCM integration techniques, thermal modelling", future: "Advanced PCM materials, enhanced heat transfer, real-world deployment, economic analysis." },
      { author: "Franklin R. Martínez", year: 2025, cite: "Martinez2025PCMIndustrial", objective: "Evaluate PCM suitability across industrial temperature ranges.", parameters: "PCM temperature profile, stored/released energy, efficiency.", methods: "Differential scanning calorimetry (DSC), TGA, thermal conductivity testing", future: "Long-term industrial validation and customised PCM formulations." },
      { author: "H. E. Abdellatif", year: 2025, cite: "Abdellatif2025PCMModeling", objective: "Analyse design limitations and heat-transfer enhancement techniques in PCM systems.", parameters: "Thermal conductivity, latent heat, melting/solidification time, charging/discharging rate, geometry.", methods: "Numerical heat-transfer modelling, mathematical modelling", future: "Hybrid PCM systems with improved thermal conductivity and real-condition validation." },
    ],
  },
  {
    id: "ai-thermal",
    label: "AI/ML in thermal energy systems",
    papers: [
      { author: "Hayder I. Mohammed et al.", year: 2025, cite: "Mohammed2025AIthermal", objective: "Analyse nanotechnology and AI approaches for enhancing thermal energy system performance.", parameters: "Nanoparticle concentration, heat transfer rate, thermal conductivity, efficiency, temperature.", methods: "Artificial neural networks (ANN), optimization algorithms", future: "Scalable nanomaterials, robust AI models, real-condition validation, cost optimization." },
      { author: "Artur Nemś", year: 2025, cite: "Nems2025AIPCMReview", objective: "Review AI-driven prediction and optimization approaches for PCM thermal systems.", parameters: "Melting duration, temperature distribution, heat transfer rate, energy efficiency.", methods: "Machine learning models, genetic algorithms", future: "Real-time AI monitoring and automated PCM selection frameworks." },
      { author: "Shuli Liu", year: 2025, cite: "Liu2025AIPCMTES", objective: "Compare AI-based prediction with conventional thermal modelling in PCM systems.", parameters: "Solar irradiance, PCM temperature, state of charge, charging/discharging efficiency.", methods: "Artificial neural networks (ANN), optimization algorithms", future: "Sensor-driven intelligent PCM energy management systems." },
      { author: "Peiliang Yan", year: 2025, cite: "Yan2025MLMeltingTime", objective: "Predict the melting response time of PCM in thermal energy storage systems.", parameters: "Melting time, PCM properties, geometry, operating conditions.", methods: "Machine learning regression (XGBoost), SVR, random forest", future: "AI predictive tools for TES design and scalable optimization." },
    ],
  },
  {
    id: "ai-swh",
    label: "AI/ML in solar water heating",
    papers: [
      { author: "Flavio Odoi-Yorke", year: 2025, cite: "OdoiYorke2025AISWH", objective: "Review AI applications in solar water heating systems.", parameters: "Solar radiation prediction, system efficiency, control variables.", methods: "Artificial neural networks (ANN), machine learning, predictive analytics", future: "Hybrid AI–PCM integration, intelligent predictive control for SWH systems." },
      { author: "A. O. Eldokaishi", year: 2022, cite: "Eldokaishi2022ANN_PCM_SWH", objective: "Model a PCM-integrated solar water heating system using ANN-based prediction.", parameters: "Water temperature, PCM phase-change behaviour, solar input, storage performance.", methods: "Artificial neural networks (ANN), numerical modelling", future: "Advanced ANN-based supervisory thermal control." },
      { author: "Ehsanolah Assareh", year: 2023, cite: "Assareh2023MLPCMSolarCollector", objective: "Improve PCM-enhanced solar collectors using ML-driven multi-objective optimization.", parameters: "Collector efficiency, PCM properties, thermal output, operating temperature.", methods: "Machine-learning-based multi-objective optimization, comparative performance analysis", future: "Climate-adaptive AI optimization frameworks for solar collectors." },
      { author: "Barqawi et al. (Muthanna)", year: 2025, cite: "Barqawi2025MLPCMSWH", objective: "Develop an ML-based controller for PCM-integrated solar water heating systems.", parameters: "Phase dynamics, flow rate, environmental conditions, heat transfer.", methods: "Artificial neural network (ANN), dynamic simulation", future: "Retrofit AI control for existing systems without hardware changes." },
    ],
  },
  {
    id: "climate",
    label: "Climate-integrated PCM in SWH",
    papers: [
      { author: "Brihaspati Singh", year: 2025, cite: "Singh2025PCMSWH", objective: "Review PCM storage techniques for improving solar water heating performance.", parameters: "Hot-water temperature, PCM melting range, storage capacity.", methods: "ETC integration, storage modelling", future: "Climate-specific optimization and adaptive PCM control strategies." },
      { author: "Fangcheng Kou", year: 2025, cite: "Kou2025BIHPPCM", objective: "Integrate PCM with heat pipes for better solar heating and storage efficiency.", parameters: "Phase-change enthalpy, phase-change temperature, thermal conductivity.", methods: "Numerical heat-transfer modelling, heat pipe–PCM integration model", future: "Further thermal performance optimization across climates." },
      { author: "Emami et al.", year: 2026, cite: "Emami2026DRLSolar", objective: "Develop intelligent control for a solar-driven power cycle with thermal energy storage.", parameters: "Thermal storage state, solar irradiance, load demand, control actions.", methods: "Deep reinforcement learning (DRL), case-study simulation", future: "Real-time AI-based TES control, grid-interactive solar thermal systems." },
      { author: "Guan-Rong Chen", year: 2025, cite: "Chen2025TaguchiGRAPCM", objective: "Optimize the parameter design of integrated solar water heating systems using PCM for better heat retention.", parameters: "PCM material, PCM volume, tube configuration, working fluid, collector tubes, absorber plate.", methods: "Taguchi orthogonal array design, signal-to-noise analysis, main-effects analysis", future: "Fins in PCMs or heat pipes for faster charging/discharging and better performance." },
    ],
  },
  {
    id: "broader",
    label: "Broader advanced topics",
    papers: [
      { author: "Rajamurugu N.", year: 2025, cite: "Rajamurugu2025PCMML", objective: "Improve PCM-based system performance using machine learning.", parameters: "PCM properties, thermal efficiency, ambient temperature.", methods: "Multi-layer perceptron (MLP), random forest, support vector regression (SVR)", future: "ML-based performance estimation; lacks embedded real-time control." },
      { author: "Abdelkrim Terfai et al.", year: 2025, cite: "Terfai2025SolarPondANNMPC", objective: "Improve thermal prediction and control of a solar pond storage system.", parameters: "Heat extraction mode, temperature stratification, solar irradiance, storage behaviour.", methods: "Model predictive control (MPC), artificial neural network (ANN)", future: "Scalable AI-driven thermal storage control for hybrid solar systems." },
      { author: "Mohammad Saleh Barghi", year: 2025, cite: "Barghi2026SolarDryingPCM", objective: "Optimize PCM-assisted solar drying systems using AI-based performance prediction.", parameters: "PCM melting temperature, solar radiation, air temperature, drying time, efficiency.", methods: "Artificial neural networks, support vector machine, evolutionary polynomial regression", future: "Real-time AI control and large-scale smart drying systems." },
      { author: "Mohammad Hasan Ghodusinejad", year: 2025, cite: "Ghodusinejad2026SolarForecast", objective: "Review and compare solar irradiance forecasting techniques.", parameters: "Solar irradiance, forecast horizon, meteorological variables, cloud cover.", methods: "AI-based forecasting models, numerical weather prediction (NWP), hybrid models", future: "Physics-informed AI and real-time adaptive forecasting systems." },
    ],
  },
];

export const TRADEOFFS = [
  "More PCM stores more heat but also causes more overheating, so the design stays within set limits on PCM amount and capsule size.",
  "Fast prediction models make the search cheap, but they only rank designs; the simulator gives the final numbers.",
  "A bigger guard penalty reduces guard activations but lowers delivered heat; simple rules reduce them more but deliver 6–8% less heat.",
  "In Rajasthan the learned controller improves only guard time, and only when it knows the coming sunlight.",
];

export const FUTURE_SCOPE = [
  "A full 3-D model of a 100 L tank with many capsules is too heavy for a student setup.",
  "Next: test on real hardware (Raspberry Pi / ESP32), then a long field trial in real weather {{cite:OdoiYorke2025AISWH}} {{cite:Liu2025AIPCMTES}}.",
  "Test more states and years using shared open weather data {{cite:Liu2025AIPCMTES}}.",
  "Combine physics with AI so models need less data, and match the controller to real household hot-water habits {{cite:OdoiYorke2025AISWH}}.",
  "Study PCM cost, ageing and supercooling {{cite:Singh2025PCMSWH}}.",
];
