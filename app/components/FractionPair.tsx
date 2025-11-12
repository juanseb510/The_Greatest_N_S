'use client';

import React, { useEffect, useState } from 'react';

type Fraction = { n: number; d: number };

type Props = {
  onChoice: (chosen: 'left' | 'right', isCorrect: boolean) => void;
};

// Generate a random fraction
function getRandomFraction(): Fraction {
  const n = Math.ceil(Math.random() * 9);
  const d = Math.ceil(Math.random() * 9);
  return { n, d };
}

// Compare which fraction is greater
function isGreater(a: Fraction, b: Fraction): boolean {
  return a.n / a.d > b.n / b.d;
}

// Generate two unique, non-equal fractions
function generateUniquePair(): { left: Fraction; right: Fraction } {
  let left = getRandomFraction();
  let right = getRandomFraction();

  // Re-generate until both are different and not equal in value
  while (
    left.n === right.n && left.d === right.d || // same exact fraction
    left.n / left.d === right.n / right.d       // same numerical value
  ) {
    right = getRandomFraction();
  }

  return { left, right };
}

export default function FractionPair({ onChoice }: Props) {
  const [{ left, right }, setPair] = useState(generateUniquePair);

  // Handle arrow key inputs
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleChoice('left');
      if (e.key === 'ArrowRight') handleChoice('right');
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const handleChoice = (side: 'left' | 'right') => {
    const correct = isGreater(left, right)
      ? side === 'left'
      : side === 'right';
    onChoice(side, correct);

    // new pair for next round
    setPair(generateUniquePair());
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center select-none">
      <div className="flex items-center justify-center gap-10 text-4xl font-semibold">
        <div className="p-4 border rounded-xl text-4xl font-bold block">
          {left.n}/{left.d}
        </div>
        <span className="text-3xl">vs</span>
        <div className="p-4 border rounded-xl text-4xl font-bold block">
          {right.n}/{right.d}
        </div>
      </div>
    </div>
  );
}
