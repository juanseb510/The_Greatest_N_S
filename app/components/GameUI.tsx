'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FractionPair from '@/app/components/FractionPair';
// We can safely import supabase now because you have the keys!
import { supabase } from '@/lib/supabase';

export default function GameUI() {
  const TOTAL_ROUNDS = 5;
  const ROUND_TIME = 5;

  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<number | null>(null);

  // ✅ Load username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      // FIX: Instead of kicking you out, we set a default "Guest" user
      // router.push('/login'); <--- This was the line causing the redirect loop
      setUsername("Guest_Designer");
    } else {
      setUsername(storedUsername);
    }
    setMounted(true);
  }, [router]);

  // ✅ Get player ID from Supabase (only if we have a real username)
  useEffect(() => {
    const fetchPlayerId = async () => {
      if (!username || username === "Guest_Designer") return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (error) {
        console.error('❌ Error fetching player ID:', error.message);
      } else if (data) {
        setPlayerId(data.id);
      }
    };
    fetchPlayerId();
  }, [username]);

  // --- timer logic ---
  useEffect(() => {
    if (!mounted || gameOver) return;
    if (round > TOTAL_ROUNDS) {
      setGameOver(true);
      return;
    }

    setTimeLeft(ROUND_TIME);
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [mounted, round]);

  useEffect(() => {
    if (timeLeft === 0) setRound((r) => r + 1);
  }, [timeLeft]);

  const handleChoice = (side: 'left' | 'right', isCorrect: boolean) => {
    if (isCorrect) setScore((s) => s + 1);
    setRound((r) => r + 1);
  };

  // ✅ Save score using player ID (only if we found a real player)
  useEffect(() => {
    const saveScore = async () => {
      if (gameOver && playerId !== null) {
        const { error } = await supabase
          .from('scores')
          .insert([{ id: playerId, high_score: score }]);

        if (error)
          console.error('❌ Error saving score:', error.message);
        else console.log(`✅ Score saved for player ${playerId}`);
      }
    };
    saveScore();
  }, [gameOver, playerId, score]);

  if (!mounted)
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-500">
        Loading game...
      </div>
    );

  if (gameOver)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center gap-6">
        <h1 className="text-4xl font-bold">🏁 Game Over!</h1>
        <p className="text-2xl">
          Final Score:{' '}
          <span className="font-semibold text-blue-600">{score}</span> / {TOTAL_ROUNDS}
        </p>
        <button
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => {
            setScore(0);
            setRound(1);
            setGameOver(false);
            setTimeLeft(ROUND_TIME);
          }}
        >
          Play Again
        </button>
        <Link href="/" className="text-blue-500 hover:underline mt-4">
          Back to Home
        </Link>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center gap-6">
      <h1 className="text-4xl font-bold">Fraction Challenge</h1>
      <p className="text-gray-700 text-lg">
        Welcome, <span className="font-semibold">{username}</span>!
      </p>
      <p className="text-gray-700 text-lg">
        Round {round} / {TOTAL_ROUNDS} | Score: {score}
      </p>
      <p className="text-xl font-semibold text-blue-600">Time Left: {timeLeft}s</p>
      <FractionPair onChoice={handleChoice} />
      <p className="text-sm text-gray-500 mt-4 ">
        Press ← or → to choose which fraction is greater
      </p>
    </div>
  );
}