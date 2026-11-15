# Documentation Portal

**Climate-Adaptive Intelligent Control and Optimization of PCM Thermal Storage for Solar Water Heating**

Final Year Project, Group 12 · B.Tech Computer Science & Engineering · Amrita School of Engineering · Guide: Dr. T. Deepika

Live site: <https://Final-year-project-G12.github.io/Documentation-Portal>

This repository is a React website that presents the whole project in one place: motivation, literature, the four objectives, their results with figures, interactive plots and simulation videos, and a numbered IEEE reference list. It reads the results of the four implementation repositories; it does not run them.

---

## Pages

| Page | What it shows |
|---|---|
| Overview | Problem, research gaps, literature survey, project architecture, the four objectives and their progress, the four states, trade-offs and future scope, SDGs, and links to every repository and the live Objective 3 dashboard |
| Objective 1 | Climate-region-aware PCM recommendation: data pipeline, GMM climate regimes, four-method MCDM ranking, physics check, per-state results and interactive plots |
| Objective 2 | AI-driven storage design optimisation: workflow, chosen design per regime, held-out tests, OpenFOAM and ANSYS Fluent cross-checks (figures and videos), result figures, limitations and the Objective 3 hand-off |
| Objective 3 | DRL controller: agents compared, per-state results (Tamil Nadu SAC, Rajasthan DQN/SAC, Uttarakhand PPO), forecast and sensor-fault studies, link to the live Streamlit dashboard |
| Objective 4 | Software-in-the-loop validation with MATLAB digital twins for three states: parameters, hold times, twin-against-Python checks, edge cases, figures and showcase videos |
| References | Numbered IEEE reference list; every citation in the portal links here |

Layout: figures are shown four per row and videos three per row.

---

## Repositories

| Part | Repository |
|---|---|
| Objective 1: PCM selection | <https://github.com/Final-year-project-G12/PCM-Selection-ML-model> |
| Objective 2: design optimisation | <https://github.com/Final-year-project-G12/Objective---2> |
| Objective 3: DRL controller | <https://github.com/Final-year-project-G12/solar-pcm-control--Objective3> |
| Objective 4: software-in-the-loop | <https://github.com/Final-year-project-G12/Objective--4_software-in-loop> |
| Documentation portal | <https://github.com/Final-year-project-G12/Documentation-Portal> |
| Objective 3 live dashboard | <https://solar-pcm-control--objective3-ohrrdnt9lzp2fgngxmmjdb.streamlit.app/> |

---

## Source layout

```text
src/
├── App.js, index.js
├── pages/        Home, Overview, Objective1–4, References
├── components/   Figure (lightbox, images and videos), Cite, Interactive widgets, Sidebar, PortalLayout
├── data/         page content as plain JS: overviewContent, objective2Content, objective3Content,
│                 objective4Content, pipeline, methods, glossary, references, links
└── styles/global.css
public/
├── plots/        figures, interactive HTML plots and videos, one folder per objective and state
├── diagrams/, sdg/
```

To change text or numbers, edit the matching file in `src/data/`. To add a figure or video, copy it under `public/plots/objective<N>/<state>/` and add an entry (`file`, `title`, `caption`) to that state's `figures` or `videos` list.

### Citations

Text can carry `{{cite:Key}}` tokens (several keys: `{{cite:KeyA,KeyB}}`). Each key must exist in `src/data/references.js`; an unknown key renders a visible `[?]`. Numbers follow the order of entries in that file, so append new references at the end to keep existing numbers stable. Claims that are project choices rather than published results should say so in words instead of carrying a citation.

### Sources of the content

Every number on the Objective pages is taken from the repositories above (their `docs/` and `results/` folders), and the source files are named at the top of each `src/data/*Content.js` file. Where the portal computed something itself (for example some Objective 4 hold times), the page says so.

---

## Run locally

```bash
npm install
npm start          # http://localhost:3000
npm run build      # production build in build/
```

Pushing to `main` builds and deploys the site to GitHub Pages through `.github/workflows/deploy.yml`.

---

## Scope and honesty

The portal reports simulation and software-in-the-loop results only. There are no hardware or field measurements. Figures marked as exploratory, provisional or validation-year only are labelled that way on the pages, and limitations are listed on each objective page rather than hidden.
