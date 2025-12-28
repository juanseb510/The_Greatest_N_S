"use client";

import { useEffect, useRef } from 'react';
import { initJsPsych } from 'jspsych';
import HtmlKeyboardResponsePlugin from '@jspsych/plugin-html-keyboard-response';
import 'jspsych/css/jspsych.css'; 

// Helper to generate random fractions (Same logic as Noah's code)
function generateTrial() {
  const n1 = Math.ceil(Math.random() * 9);
  const d1 = Math.ceil(Math.random() * 9);
  const n2 = Math.ceil(Math.random() * 9);
  const d2 = Math.ceil(Math.random() * 9);
  
  // Basic visual for the fraction comparison
  // We use standard HTML/CSS to make it look like cards
  return {
    type: HtmlKeyboardResponsePlugin,
    stimulus: `
      <div style="display: flex; gap: 50px; justify-content: center; font-size: 40px; font-weight: bold;">
        <div style="border: 2px solid #333; padding: 20px; border-radius: 10px;">${n1}/${d1}</div>
        <div style="align-self: center;">VS</div>
        <div style="border: 2px solid #333; padding: 20px; border-radius: 10px;">${n2}/${d2}</div>
      </div>
    `,
    prompt: '<p style="margin-top: 30px; color: #666;">Press <strong>F</strong> for Left or <strong>J</strong> for Right</p>',
    choices: ['f', 'j'],
    data: {
      task: 'magnitude_comparison',
      n1, d1, n2, d2,
      correct_response: (n1/d1 > n2/d2) ? 'f' : 'j' // Calculate correct answer for data
    }
  };
}

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
      on_finish: (data) => {
        if (onFinish) onFinish(data);
      }
    });
    
    const timeline = [];

    // 1. Welcome
    timeline.push({
      type: HtmlKeyboardResponsePlugin,
      stimulus: `
        <div class="text-center">
          <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 20px;">Fraction Game</h1>
          <p style="font-size: 18px;">You will see 5 pairs of fractions.</p>
          <p>Press any key to start.</p>
        </div>
      `,
    });

    // 2. Loop for 5 Rounds
    for (let i = 0; i < 5; i++) {
        // Fixation Cross
        timeline.push({
            type: HtmlKeyboardResponsePlugin,
            stimulus: '<div style="font-size: 60px;">+</div>',
            choices: "NO_KEYS",
            trial_duration: 500, // 0.5 seconds
        });

        // Generate a random trial
        timeline.push(generateTrial());
    }

    // 3. Run
    jsPsych.run(timeline);

  }, [onFinish]);

  return (
    <div 
      id={experimentDivId} 
      className="w-full h-full min-h-[400px] bg-white border-2 border-gray-100 rounded-xl shadow-lg flex flex-col items-center justify-center p-8"
    >
      {/* jsPsych injects here */}
    </div>
  );
};

export default JsPsychExperiment;