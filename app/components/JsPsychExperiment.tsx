// app/components/JsPsychExperiment.tsx

"use client";

import { useEffect, useRef } from "react";
import { initJsPsych } from "jspsych";
import "jspsych/css/jspsych.css";

import { buildConsentAndIdTimeline } from "./tasks/consentAndIdTimeline";
import { buildMagnitudeComparisonTimeline } from "./tasks/magnitudeComparisonTimeline";
import { buildNumberLineEstimationTimeline } from "./tasks/numberLineEstimationTimeline";

type ExperimentProps = {
  onFinish?: (data: any) => void;
};

const JsPsychExperiment: React.FC<ExperimentProps> = ({ onFinish }) => {
  const experimentDivId = "jspsych-target";
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const jsPsych = initJsPsych({
      display_element: experimentDivId,
      on_finish: () => {
        const all = jsPsych.data.get();

        const consentRow = all.filter({ task: "consent" }).values()?.[0];
        const idRow = all.filter({ task: "id_entry" }).values()?.[0];

        // ---- Task 1 summary ----
        const compare = all.filter({ task: "magnitude_compare" });
        const total = compare.count();
        const correct = compare.select("correct").values.filter(Boolean).length;

        const rtValues = compare
          .select("rt")
          .values.filter((v: any) => typeof v === "number");
        const meanRT =
          rtValues.length > 0
            ? Math.round(
                rtValues.reduce((a: number, b: number) => a + b, 0) /
                  rtValues.length
              )
            : null;

        // ---- Task 2 summary ----
        const est = all.filter({ task: "number_line_estimation" });
        const estTotal = est.count();

        const paeVals = est
          .select("pae")
          .values.filter((v: any) => typeof v === "number");
        const meanPAE =
          paeVals.length > 0
            ? Number(
                (
                  paeVals.reduce((a: number, b: number) => a + b, 0) /
                  paeVals.length
                ).toFixed(2)
              )
            : null;

        const dirVals = est
          .select("directional_error")
          .values.filter((v: any) => typeof v === "number");
        const meanDirectional =
          dirVals.length > 0
            ? Number(
                (
                  dirVals.reduce((a: number, b: number) => a + b, 0) /
                  dirVals.length
                ).toFixed(4)
              )
            : null;

        const participantId = idRow?.participant_id ?? null;
        const consented = consentRow?.consented ?? null;

        if (onFinish)
          onFinish({
            raw: all,
            summary: {
              consented,
              participantId,

              // Task 1 (Comparison)
              total,
              correct,
              accuracy: total > 0 ? correct / total : null,
              meanRT_ms: meanRT,

              // Task 2 (Estimation)
              estimation_total: estTotal,
              estimation_meanPAE: meanPAE,
              estimation_meanDirectionalError: meanDirectional,
            },
          });
      },
    });

    // ✅ Needed for consent flow (custom buttons use window.jsPsych)
    (window as any).jsPsych = jsPsych;

    // ✅ Temporary demo trials for Task 2 (we’ll swap to your real dataset next)
    const ESTIMATION_TRIALS_DEMO = [
      { id: 1, stimulus: "13/20", trueValue01: 0.65, notation: "Fraction" as const },
      { id: 2, stimulus: "0.35", trueValue01: 0.35, notation: "Decimal" as const },
      { id: 3, stimulus: "35%", trueValue01: 0.35, notation: "Percentage" as const },
      { id: 4, stimulus: "7/10", trueValue01: 0.7, notation: "Fraction" as const },
      { id: 5, stimulus: "0.48", trueValue01: 0.48, notation: "Decimal" as const },
      { id: 6, stimulus: "65%", trueValue01: 0.65, notation: "Percentage" as const },
    ];

    // Protocol flow (now):
    // Consent -> ID -> Task 1 (Comparison) -> Task 2 (Estimation)
    const timeline = [
      ...buildConsentAndIdTimeline({ title: "Numeracy Screener" }),
      ...buildMagnitudeComparisonTimeline(),
      ...buildNumberLineEstimationTimeline({
        trials: ESTIMATION_TRIALS_DEMO,
        promptTitle: "NUMBER LINE ESTIMATION",
      }),
    ];

    jsPsych.run(timeline);
  }, [onFinish]);

  return (
    <div
      id={experimentDivId}
      className="w-full h-full min-h-[600px] flex flex-col items-center justify-center"
    />
  );
};

export default JsPsychExperiment;
