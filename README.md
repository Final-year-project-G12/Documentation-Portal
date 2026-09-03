# Climate-Adaptive Intelligent Control and Optimization of PCM Thermal Storage for Solar Water Heating

> **Final Year Project — Group 12**
> **B.Tech Computer Science & Engineering**
> **Amrita School of Engineering**
> **Guide:** Dr. T. Deepika

---

## 📚 Documentation Portal

This repository is the **central documentation portal** for our Final Year Project on **AI-driven Phase Change Material (PCM) thermal energy storage for Solar Water Heating (SWH)**.

The portal maintains the project's:

* Research methodology
* System architecture
* Objective-wise implementation
* Dataset documentation
* Climate-data audits
* Machine Learning methodology
* PCM selection methodology
* Physics-based validation
* Literature reviews
* Experimental and implementation records
* Research decisions and corrections
* Reproducibility notes
* Project progress and findings

The documentation is maintained separately from the implementation repositories so that the **research process, methodology, evidence, validation, and design decisions remain traceable and reproducible**.

---

# 🎯 Project Overview

The project aims to develop an **intelligent, climate-adaptive PCM thermal storage system for solar water heating**.

The overall system combines:

**Climate Data → Climate Classification → PCM Selection → Thermal Modeling → AI Prediction/Control → Embedded System**

The project addresses the problem that a PCM that performs well under one climate or operating condition may not necessarily be the best choice under another.

Our approach therefore separates the system into research layers, beginning with **climate-aware PCM selection** and progressing toward intelligent thermal-storage control.

---

# 🧩 Core Research Objectives

## Objective 1 — Climate-Region-Aware PCM Recommendation

> **Develop a climate-region-aware recommendation framework that clusters ten years of population-weighted meteorological data across four contrasting Indian states and identifies the Top-2/Top-3 suitable PCM candidates for each discovered climatic regime using multi-criteria decision-making, followed by independent physics-based validation.**

### States considered

| State       | Climate characteristics                        |
| ----------- | ---------------------------------------------- |
| Rajasthan   | Hot-dry / arid to semi-arid                    |
| Assam       | Humid / high-rainfall                          |
| Tamil Nadu  | Tropical / coastal and interior variation      |
| Uttarakhand | Himalayan / elevation-driven climate variation |

The methodology uses population-weighted ERA5 grid cells, sun-event-aligned sampling, and NASA POWER as an independent cross-source validation dataset.

### Objective 1 pipeline

```text
ERA5 + NASA POWER
        │
        ▼
Data Acquisition
        │
        ▼
Preprocessing & Quality Control
        │
        ▼
ERA5 ↔ POWER Cross-Source Validation
        │
        ▼
Climate Feature Engineering
        │
        ▼
Climate Signature Construction
        │
        ▼
Clustering
        │
        ▼
Climate Regimes
        │
        ▼
PCM Feasibility Filtering
        │
        ▼
Multi-Criteria Decision Making
        │
        ▼
Top-2 / Top-3 PCM Candidates
        │
        ▼
Physics-Based Thermal Validation
        │
        ▼
Validated Climate → PCM Recommendation
```

The objective deliberately focuses on **offline regional selection**, rather than real-time control. Real-time DRL/control and hardware deployment belong to later stages of the overall project.

---

# 🧠 Overall System Concept

The broader project extends the climate-aware selection layer into an intelligent PCM-SWH system.

```text
                 WEATHER / CLIMATE DATA
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        Historical Data        Live Sensors
        ERA5 / POWER           Irradiance
                              Temperature
                              Flow / Demand
              │                     │
              ▼                     ▼
       Climate Analysis       State Estimation
              │                     │
              ▼                     │
       PCM Recommendation           │
              │                     │
              └──────────┬──────────┘
                         ▼
                 PCM Thermal Storage
                         │
                         ▼
                AI Prediction / Control
                         │
                         ▼
                Pump / Valve Actuation
                         │
                         ▼
                    Hot Water
                         │
                         ▼
                  Feedback Loop
```

The project's broader research direction combines PCM selection, AI/ML prediction, adaptive control, and embedded hardware.

---

# 📂 Documentation Structure

```text
docs/
│
├── README.md
│
├── project/
│   ├── project-overview.md
│   ├── research-problem.md
│   ├── objectives.md
│   ├── research-gaps.md
│   ├── contributions.md
│   └── project-roadmap.md
│
├── architecture/
│   ├── system-architecture.md
│   ├── objective-1-architecture.md
│   ├── ml-pipeline.md
│   ├── data-flow.md
│   └── hardware-architecture.md
│
├── objective-1/
│   ├── methodology.md
│   ├── implementation-plan.md
│   ├── climate-framework.md
│   ├── pcm-selection.md
│   ├── mcdm-methodology.md
│   ├── physics-validation.md
│   └── results.md
│
├── climate-data/
│   ├── data-sources.md
│   ├── era5.md
│   ├── nasa-power.md
│   ├── preprocessing.md
│   ├── validation.md
│   └── feature-engineering.md
│
├── state-audits/
│   ├── rajasthan/
│   ├── assam/
│   ├── tamil-nadu/
│   └── uttarakhand/
│
├── pcm/
│   ├── pcm-database.md
│   ├── pcm-properties.md
│   ├── feasibility-filtering.md
│   └── pcm-ranking.md
│
├── validation/
│   ├── climate-validation.md
│   ├── clustering-validation.md
│   ├── mcdm-validation.md
│   └── physics-validation.md
│
├── literature/
│   ├── pcm/
│   ├── solar-water-heating/
│   ├── ai-ml/
│   ├── forecasting/
│   ├── optimization/
│   └── control/
│
├── implementation/
│   ├── software-stack.md
│   ├── repository-structure.md
│   ├── reproducibility.md
│   └── experiment-tracking.md
│
└── decisions/
    ├── methodology-decisions.md
    ├── data-quality-fixes.md
    ├── assumptions.md
    └── known-limitations.md
```

---

# 🌍 Climate Data Pipeline

The climate-analysis layer uses **multi-year meteorological data** to characterize the environments in which PCM-based solar water heaters may operate.

### Primary data

* ERA5 reanalysis
* NASA POWER
* Population-weighted spatial sampling
* Astronomically calculated solar events

### Core variables

Depending on the analysis stage, the pipeline considers variables such as:

* Global Horizontal Irradiance (GHI)
* Temperature
* Relative Humidity
* Wind Speed
* Solar geometry
* Clear-sky irradiance
* Derived climate indicators

---

# 🔎 Data Quality & Validation

Data validation is treated as a first-class research stage rather than simply assuming that downloaded datasets are correct.

ERA5 and NASA POWER are compared at matched locations and times using:

* Mean Bias Error (MBE)
* Root Mean Square Error (RMSE)
* Pearson correlation
* Seasonal stratification
* Solar-event stratification

A major data-quality issue was detected during this process: an ERA5 accumulation-convention mismatch produced an initially implausible **−663.67 W/m² MBE** and near-zero correlation. Root-cause analysis identified the processing issue, after which the corrected dataset achieved approximately **10.95 W/m² MBE** and **0.810 overall correlation** at solar noon.

This is documented explicitly so that the final research results remain auditable.

---

# 🧪 PCM Selection Framework

After climate regimes are identified, candidate PCMs are filtered and ranked according to their suitability for solar domestic hot-water thermal storage.

Typical PCM properties considered include:

* Melting temperature
* Latent heat
* Specific heat
* Thermal conductivity
* Density
* Operating temperature compatibility
* Stability
* Practical feasibility

The ranking uses **multi-criteria decision-making (MCDM)** rather than selecting a PCM using a single property.

The final output for each climate regime is:

```text
Climate Regime
      │
      ▼
Feasible PCM Candidates
      │
      ▼
MCDM Scoring
      │
      ▼
Ranked Candidates
      │
      ├── #1 PCM
      ├── #2 PCM
      └── #3 PCM
```

The project explicitly returns a **Top-2/Top-3 recommendation** rather than claiming that one PCM is universally optimal.

---

# ⚙️ Physics-Based Validation

MCDM ranking alone is not treated as proof that a PCM is thermally superior.

The recommended candidates are therefore evaluated using a physics-based thermal model.

The validation layer asks:

> **Does the PCM that scores well according to the climate-aware MCDM also perform well when placed inside a thermal-storage model?**

This creates an independent validation path:

```text
Climate Data
     ↓
Climate Regime
     ↓
MCDM Ranking
     ↓
Top PCM Candidates
     ↓
───────────────
Physics Model
     ↓
Thermal Performance
     ↓
Compare Ranking
```

This separation is important because the physics model does **not** simply reproduce the MCDM score.

---

# 🤖 AI / ML Layer

Machine Learning is used selectively according to the problem being solved.

| Problem                    | Candidate approach            |
| -------------------------- | ----------------------------- |
| PCM selection              | Classification / ranking      |
| PCM performance prediction | XGBoost / Random Forest / SVR |
| Melting-time prediction    | Regression                    |
| Solar forecasting          | LSTM / ML forecasting         |
| Real-time control          | PPO / DDPG / MPC              |
| Anomaly detection          | ML anomaly detection          |

For example, Yan et al. demonstrated XGBoost as a surrogate model for PCM melting-response prediction, achieving approximately **92% accuracy** on their 60-case CFD dataset. This provides methodological precedent for ML-based PCM thermal surrogates, while also highlighting the importance of validating model transferability.

---

# ☀️ Solar Water Heating Context

The project is motivated by the mismatch between:

**Solar energy availability**

and

**Domestic hot-water demand**

PCM thermal storage provides a mechanism for shifting thermal energy from periods of high solar availability toward periods of demand.

Existing PCM-SWH literature identifies limitations such as low thermal conductivity, insufficient field validation, and limited intelligent/adaptive control.

AI-based SWH literature similarly identifies the fragmentation between AI methods, PCM systems, and real hardware implementations, providing motivation for an integrated research direction.

---

# 📚 Literature Repository

The `literature/` directory contains structured summaries of papers used to justify:

* PCM selection
* PCM thermal properties
* Solar thermal storage
* Solar water heating
* Machine Learning
* Deep Learning
* Solar forecasting
* Optimization
* MPC
* Reinforcement Learning
* Embedded/IoT systems

Each literature record follows a consistent structure:

```text
Paper
├── Problem
├── Methodology
├── Dataset
├── PCM details
├── ML / AI method
├── Experimental setup
├── Results
├── Limitations
├── Research gaps
└── Relevance to our project
```

The literature is used as an **evidence base**, not as evidence that our own pipeline achieved the performance reported by those papers. This distinction is maintained throughout the project documentation.

---

# 📝 State-Level Audits

The `state-audits/` directory contains detailed audits for each geographic region.

Each state audit documents:

* Spatial sampling
* Population weighting
* Climate characteristics
* Data completeness
* Missing values
* Variable distributions
* Seasonal behaviour
* ERA5/POWER agreement
* Climate signatures
* Clustering behaviour
* Known issues
* Required corrections
* Validation results

The four states are intentionally treated as **contrasting climate domains**, rather than assuming that state boundaries themselves define climate regimes.

---

# 🔬 Research Philosophy

This project follows three important principles.

### 1. Evidence before claims

Every major methodological decision should be supported by:

* Data
* Literature
* Mathematical reasoning
* Experimental evidence
* Or explicit project assumptions

### 2. Validation before optimisation

A sophisticated model is not useful if the underlying data are wrong.

Therefore:

```text
Data Quality
     ↓
Validation
     ↓
Feature Engineering
     ↓
Model
     ↓
Evaluation
     ↓
Optimisation
```

### 3. Independent validation

Where possible, the validation mechanism should be independent from the mechanism that generated the recommendation.

For Objective 1:

```text
Climate data
     ↓
Clustering
     ↓
MCDM
     ↓
Recommendation
```

is validated separately through:

```text
Thermal physics
     ↓
Simulation
     ↓
Thermal performance
```

---

# ⚠️ Known Limitations

The documentation portal deliberately records limitations rather than hiding them.

Current limitations include:

* Only four Indian states are covered.
* Objective 1 is a regional/offline selector and does not represent real-time control.
* Climate regimes cannot automatically be assumed to generalise to the rest of India.
* PCM properties may vary between datasheets and experimentally measured values.
* Physics-based validation is dependent on the assumptions and fidelity of the thermal model.
* Some climate features require full hourly data and cannot be reconstructed reliably from only sun-event samples.
* Uttarakhand requires particular attention to elevation because of its large topographic range.

These limitations are documented as part of the research record and are not treated as implementation failures unless they violate a defined project requirement.

---

# 🔗 Repository Ecosystem

The documentation portal is intended to sit alongside the project's implementation repositories.

```text
                 FINAL YEAR PROJECT
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
     Documentation   Objective 1   Objective 2
       Portal        Pipeline      AI / Control
          │             │             │
          │             ▼             ▼
          │          Climate →     Forecasting →
          │          PCM Selection Control
          │
          ▼
       Research
       Evidence
       Audits
       Decisions
       Results
```

The documentation portal should answer:

> **Why was this implemented this way?**

while the implementation repositories answer:

> **How is it implemented?**

---

# 🛠️ Technology Stack

### Data & Scientific Computing

* Python 3.x
* Pandas
* NumPy
* SciPy
* pvlib
* xarray
* NetCDF

### Machine Learning

* Scikit-learn
* XGBoost
* TensorFlow / Keras where required
* Stable-Baselines3 for reinforcement learning

### Visualization

* Matplotlib
* Seaborn
* Geographic/climate visualization tools

### Thermal Modeling

* Python-based grey-box thermal models
* Energy-balance models
* PCM enthalpy / phase-fraction formulations
* Physics-based validation models

### Embedded Systems

Planned/implemented hardware ecosystem includes:

* Raspberry Pi
* ESP32 / Arduino
* DS18B20 temperature sensors
* Irradiance sensing
* Pump / valve actuation

---

# 📖 Documentation Conventions

Documentation should distinguish clearly between:

### `IMPLEMENTED`

Something that has actually been coded, executed, or experimentally evaluated.

### `VALIDATED`

Something that has been independently checked against an accepted reference, dataset, physical model, or experiment.

### `PLANNED`

A proposed future implementation.

### `ASSUMPTION`

A modelling or methodological assumption that has not been independently established.

### `LIMITATION`

A known restriction that affects interpretation or generalisation.

This prevents planned functionality from accidentally being reported as completed functionality.

---

# 🚀 Reproducibility

Every major result should ideally be traceable through:

```text
Result
  ↓
Experiment / Script
  ↓
Input Dataset
  ↓
Preprocessing
  ↓
Configuration
  ↓
Model
  ↓
Output
  ↓
Figure / Table
  ↓
Documentation
```

When a result changes because of a bug fix or methodology change, the corresponding documentation should be updated rather than silently replacing the previous result.

---

# 📌 Project Status

### Objective 1

**Climate-region-aware PCM recommendation**

* [x] Define objective
* [x] Select contrasting Indian regions
* [x] Build climate-data acquisition pipeline
* [x] Population-weight spatial sampling
* [x] Sun-event processing
* [x] ERA5 / NASA POWER cross-source validation
* [x] Identify and correct ERA5 accumulation issue
* [ ] Complete climate-signature regeneration
* [ ] Final clustering
* [ ] PCM candidate filtering
* [ ] MCDM ranking
* [ ] Top-2 / Top-3 recommendations
* [ ] Physics-based validation
* [ ] Final Objective 1 evaluation

### Broader AI-SWH System

* [ ] Solar forecasting
* [ ] Thermal-state prediction
* [ ] Demand-aware control
* [ ] DRL/MPC controller
* [ ] Embedded deployment
* [ ] Hardware validation
* [ ] End-to-end system evaluation

> **Note:** The checkboxes represent the documentation roadmap and should be updated to reflect the actual implementation status of the project.

---

# 👥 Project Team

**Group 12**
B.Tech Computer Science & Engineering
Amrita School of Engineering

**Guide:**
Dr. T. Deepika

---

# 📜 Academic Use

This repository is maintained as the research and technical documentation record for the Final Year Project.

It contains:

* Methodological decisions
* Research evidence
* Implementation documentation
* Data audits
* Experimental results
* Validation records
* Limitations
* Future work

The documentation should therefore be treated as the project's **research provenance layer**.

---

## ⭐ Final Project Pipeline

At the highest level, the project can be represented as:

```text
                CLIMATE DATA
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
        ERA5                NASA POWER
          │                     │
          └──────────┬──────────┘
                     ▼
             DATA VALIDATION
                     │
                     ▼
          CLIMATE SIGNATURES
                     │
                     ▼
              CLUSTERING
                     │
                     ▼
            CLIMATE REGIMES
                     │
                     ▼
           PCM FEASIBILITY
                     │
                     ▼
                 MCDM
                     │
                     ▼
             TOP-2 / TOP-3 PCM
                     │
                     ▼
          PHYSICS-BASED VALIDATION
                     │
                     ▼
             PCM RECOMMENDATION
                     │
                     ▼
       ┌─────────────────────────┐
       │ Future Intelligent Layer │
       │ Forecasting + DRL + IoT │
       └─────────────────────────┘
                     │
                     ▼
          ADAPTIVE PCM-SWH SYSTEM
```

**This documentation portal exists to make every stage of that pipeline explainable, auditable, reproducible, and academically defensible.**
