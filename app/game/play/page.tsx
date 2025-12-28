"use client";

import React, { useState } from 'react';
// These relative paths go up 2 levels (game -> app) then into components
import JsPsychExperiment from '../../components/JsPsychExperiment';
import SketchButton from '../../components/SketchButton'; 

export default function GamePage() {
  const [experimentFinished, setFinished] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFinish = (data: any) => {
    setFinished(true);
    setResults(data);
    console.log("Experiment Data:", data.values());
  };

  return (
    <div className="flex min-h-screen bg-[#F0F2F6]">
      
      {/* --- LEFT SIDEBAR (Streamlit Style) --- */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-6 hidden md:flex">
        <h2 className="text-xl font-bold text-gray-800">Controls</h2>
        
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>User:</strong> <span className="font-mono bg-gray-100 p-1 rounded">Guest</span></p>
          <p><strong>Status:</strong> {experimentFinished ? "✅ Complete" : "▶️ In Progress"}</p>
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

        {/* LOGIC: Show Experiment OR Results */}
        {!experimentFinished ? (
          <div className="w-full max-w-3xl">
             {/* This renders your JsPsychExperiment.tsx component */}
             <JsPsychExperiment onFinish={handleFinish} />
          </div>
        ) : (
          <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md text-center border border-gray-200">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Task Complete!</h2>
            <p className="mb-6 text-gray-600">
              Great job! The data has been logged to the console (F12).
            </p>
            <div className="flex justify-center gap-4">
               {/* A hack to reload the page to restart jsPsych cleanly */}
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