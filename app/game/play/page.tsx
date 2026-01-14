// app/game/play/page.tsx

"use client";

import React, { useState } from "react";
import JsPsychExperiment from "../../components/JsPsychExperiment";
import SketchButton from "../../components/SketchButton";

export default function GamePage() {
  const [experimentFinished, setFinished] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFinish = (payload: any) => {
    setFinished(true);
    setResults(payload);

    console.log("✅ Experiment Summary:", payload?.summary);
    console.log("📦 Raw jsPsych Data (values):", payload?.raw?.values?.());
  };

  const summary = results?.summary;

  // Helper: format directional error as % points on 0–1 line
  const formatDirectional = (v: any) => {
    if (typeof v !== "number") return "N/A";
    const pctPoints = v * 100; // signed percentage points on 0–1 line
    const sign = pctPoints > 0 ? "+" : "";
    return `${sign}${pctPoints.toFixed(2)}% pts`;
  };

  return (
    <div className="flex min-h-screen bg-[#F0F2F6]">
      {/* --- LEFT SIDEBAR (Streamlit Style) --- */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-6 hidden md:flex">
        <h2 className="text-xl font-bold text-gray-800">Controls</h2>

        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>User:</strong>{" "}
            <span className="font-mono bg-gray-100 p-1 rounded">Guest</span>
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {experimentFinished ? "✅ Complete" : "▶️ In Progress"}
          </p>
        </div>

        <div className="mt-auto">
          <SketchButton text="EXIT" href="/game" />
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-4 md:p-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 self-start">
          Comparison Task
        </h1>

        {!experimentFinished ? (
          <div className="w-full max-w-3xl">
            <JsPsychExperiment onFinish={handleFinish} />
          </div>
        ) : (
          <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md text-center border border-gray-200">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Task Complete!
            </h2>

            <p className="mb-4 text-gray-600">
              Your results were logged in the console (F12).
            </p>

            {/* ✅ Show BOTH tasks in the same Summary box */}
            {summary && (
              <div className="mt-4 mb-6 text-left bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="font-bold text-gray-800 mb-2">Summary</p>

                {/* Task 1 */}
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-bold text-gray-800 mt-1">Task 1 — Magnitude Comparison</p>
                  <p>
                    <strong>Total trials:</strong> {summary.total}
                  </p>
                  <p>
                    <strong>Correct:</strong> {summary.correct}
                  </p>
                  <p>
                    <strong>Accuracy:</strong>{" "}
                    {summary.accuracy === null
                      ? "N/A"
                      : `${Math.round(summary.accuracy * 100)}%`}
                  </p>
                  <p>
                    <strong>Mean RT:</strong>{" "}
                    {summary.meanRT_ms === null ? "N/A" : `${summary.meanRT_ms} ms`}
                  </p>
                </div>

                <hr className="my-4 border-gray-200" />

                {/* Task 2 */}
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-bold text-gray-800 mt-1">Task 2 — Number Line Estimation</p>
                  <p>
                    <strong>Total trials:</strong>{" "}
                    {typeof summary.estimation_total === "number"
                      ? summary.estimation_total
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Mean PAE:</strong>{" "}
                    {typeof summary.estimation_meanPAE === "number"
                      ? `${summary.estimation_meanPAE}%`
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Mean directional error:</strong>{" "}
                    {formatDirectional(summary.estimation_meanDirectionalError)}
                    <span className="text-gray-500">
                      {" "}
                      ( + = overestimate, − = underestimate )
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <SketchButton
                text="PLAY AGAIN"
                onClick={() => window.location.reload()}
              />
              <SketchButton text="EXIT" href="/game" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
