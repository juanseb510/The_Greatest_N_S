// app/components/tasks/magnitudeComparisonTimeline.ts

import HtmlKeyboardResponsePlugin from '@jspsych/plugin-html-keyboard-response';
import {
  COMPARISON_TRIALS,
  randomizeSides,
  correctKeyFromSide,
  type ComparisonTrial,
} from '@/app/data/protocolStimuli';
import { renderValueHTML } from '@/app/components/renderValue';

// --- Styling (same vibe as your current jsPsych cards) ---
const cardStyle = `
  border: 4px solid black; padding: 40px; border-radius: 20px;
  background: white; box-shadow: 8px 8px 0px rgba(0,0,0,0.2);
  min-width: 220px; height: 280px; display: flex;
  align-items: center; justify-content: center;
`;

const instructionStyle =
  "margin-top: 30px; font-size: 24px; font-weight: bold; color: #333;";

type BuildOptions = {
  // If you want to run only one block for debugging: "Pre-Instruction" or "Post-Instruction"
  block?: ComparisonTrial['block'];
  // Optional: cap number of trials for quick testing
  limit?: number;
};

export function buildMagnitudeComparisonTimeline(options: BuildOptions = {}) {
  const { block, limit } = options;

  // 1) Start from Protocol trials (cross + within)
  let trials = COMPARISON_TRIALS.slice();

  // 2) Optional block filter
  if (block) trials = trials.filter((t) => t.block === block);

  // 3) Optional limit for quick tests
  if (typeof limit === 'number') trials = trials.slice(0, limit);

  // 4) Randomize left/right *per trial* (fixes the “always left is correct” CSV issue)
  const randomized = trials.map((t) => randomizeSides(t));

  // 5) Build jsPsych timeline
  const timeline: any[] = [];

  // Tiny “get ready” screen (optional but helps pacing)
  timeline.push({
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div style="padding: 30px; text-align: center;">
        <h2 style="font-size: 40px; font-weight: 900; color: #2563eb; margin-bottom: 10px;">MAGNITUDE COMPARISON</h2>
        <p style="font-size: 22px; color: #333;">Pick which value is larger.</p>
        <div style="margin-top: 30px; padding: 14px 18px; background: #2563eb; color: white; display: inline-block; font-weight: bold; font-size: 20px; border-radius: 10px;">
          Press any key to begin
        </div>
      </div>
    `,
  });

  randomized.forEach((t, idx) => {
    const correctKey = correctKeyFromSide(t.correctSide);

    // Small fixation between trials
    timeline.push({
      type: HtmlKeyboardResponsePlugin,
      stimulus:
        '<div style="font-size: 90px; font-weight: 900; color: black;">+</div>',
      choices: 'NO_KEYS',
      trial_duration: 350,
      data: { task: 'fixation', phase: 'magnitude_compare' },
    });

    timeline.push({
      type: HtmlKeyboardResponsePlugin,
      stimulus: `
        <h2 style="font-size: 36px; font-weight: 900; color: #2563eb; margin-bottom: 30px; text-align:center;">
          WHICH ONE IS LARGER?
        </h2>

        <div style="display: flex; gap: 40px; justify-content: center; align-items: center;">
          <div style="${cardStyle}">${renderValueHTML(t.left)}</div>
          <div style="font-size: 60px; font-weight: 900; color: #333;">VS</div>
          <div style="${cardStyle}">${renderValueHTML(t.right)}</div>
        </div>

        <p style="${instructionStyle}; text-align:center;">
          Press <strong>F</strong> (Left) or <strong>J</strong> (Right)
        </p>

        <p style="margin-top: 10px; color: #999; text-align:center;">
          Trial ${idx + 1} / ${randomized.length}
        </p>
      `,
      choices: ['f', 'j'],
      data: {
        task: 'magnitude_compare',
        trial_id: t.id,
        block: t.block,
        distance: t.distance,
        relation: t.relation,
        left: t.left,
        right: t.right,
        left_value: t.leftVal,
        right_value: t.rightVal,
        correct_side: t.correctSide,
        correct_key: correctKey,
        wnb_consistent: t.meta?.wnbConsistent ?? null,
        decimal_digits: t.meta?.decimalDigits ?? null,
        source: t.meta?.source ?? null,
      },
      on_finish: (data: any) => {
        // jsPsych stores key press in data.response (string)
        data.correct = data.response === correctKey;
      },
    });
  });

  return timeline;
}
