import { Rich } from "./Cite";
import Bullets from "./Bullets";
import Figure from "./Figure";
import { StepExplorer, Accordion } from "./Interactive";
import { PIPELINE_STAGES, STATE_DIFFERENCES } from "../data/pipeline";

/* The Objective 1 pipeline as a clickable stage explorer. On the Objective 1
   page the "results are on the Objective 1 page" pointers are reworded, since
   the reader is already there. */
export default function PipelineSection({ onObjective1 = false }) {
  const lead = onObjective1 ? "the results follow in the sections below." : "the results are on the Objective 1 page.";
  const diffs = onObjective1
    ? STATE_DIFFERENCES.map((d) => d.replace("are on the Objective 1 page.", "follow in the sections below."))
    : STATE_DIFFERENCES;
  return (
    <>
      <div className="plots-section-header">
        <h2>Objective 1: End-to-End Pipeline</h2>
        <span className="plots-count-badge">{PIPELINE_STAGES.length} Stages</span>
      </div>
      <p className="section-desc">
        One pipeline turns ten years of reanalysis data into a Top-3 PCM list for each climate regime, the same for all four states;
        what differs by state is listed below the stages, and {lead} Click a stage to explore it.
      </p>
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
          It does not show three design-basis steps: the 60 °C delivery target, SHARE_PCM = 0.5 and the latent-heat calibration.
        </p>
      </div>

      <StepExplorer
        ariaLabel="Pipeline stages"
        steps={PIPELINE_STAGES.map((st) => ({
          title: st.title,
          render: () => (
            <>
              <Bullets items={st.steps} />
              <div className="ui-output">
                <strong>Output</strong>
                <Rich text={st.out} />
              </div>
            </>
          ),
        }))}
      />

      <Accordion
        defaultOpen={null}
        items={[
          { id: "diffs", title: "Where the states differ", badge: `${diffs.length} notes`, points: diffs },
        ]}
      />
    </>
  );
}

