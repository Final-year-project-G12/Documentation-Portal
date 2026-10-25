import { Rich } from "./Cite";
import Bullets from "./Bullets";
import Figure from "./Figure";
import { PIPELINE_STAGES, STATE_DIFFERENCES } from "../data/pipeline";

/* The Objective 1 pipeline, shown on the Overview and at the top of the
   Objective 1 page. On the Objective 1 page the two "results are on the
   Objective 1 page" pointers are reworded, since the reader is already there. */
export default function PipelineSection({ onObjective1 = false }) {
  const lead = onObjective1 ? "the results follow in the sections below." : "the results are on the Objective 1 page.";
  const diffs = onObjective1
    ? STATE_DIFFERENCES.map((d) => d.replace("are on the Objective 1 page.", "follow in the sections below."))
    : STATE_DIFFERENCES;
  return (
    <>
        <div className="plots-section-header">
          <h2>Objective 1: End-to-End Pipeline</h2>
          <span className="plots-count-badge">9 Stages</span>
        </div>
        <Bullets
          items={[
            "One pipeline turns ten years of reanalysis data into a validated Top-3 PCM list for each climate regime.",
            "It is the same for all four states.",
            `What differs by state is listed after the stages; ${lead}`,
          ]}
        />
        <div className="section-divider" />

        <div className="diagram">
          <Figure
            src={`${process.env.PUBLIC_URL}/diagrams/objective1-architecture.png`}
            title="Objective 1 framework: from meteorological data to validated Top-3 PCM candidates"
            alt="Six-stage flow diagram: data collection, preprocessing and harmonisation, climate feature engineering, climate region discovery with a Gaussian mixture model, PCM suitability evaluation with multi-criteria decision making, and physics validation with the final Top-3 output."
            caption="Objective 1 framework, Review 2 presentation, slide 4.2."
          />
          <p className="diagram-caption">
            Objective 1 framework, six stages (Review 2 presentation, slide 4.2 <Rich text="{{cite:Group12Review2}}" />).
            It does not show three design-basis steps below: the 60 °C delivery target, SHARE_PCM = 0.5 and the latent-heat calibration.
          </p>
        </div>

        <ol className="pipeline-list">
          {PIPELINE_STAGES.map((st, i) => (
            <li key={st.title} className="pipeline-stage">
              <span className="pipeline-stage-num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{st.title}</h3>
                <Bullets items={st.steps} />
                <div className="pipeline-stage-meta">Output: {st.out}</div>
              </div>
            </li>
          ))}
        </ol>
        <h3 style={{ marginTop: 28 }}>Where the states differ</h3>
        <Bullets items={diffs} />
    </>
  );
}
