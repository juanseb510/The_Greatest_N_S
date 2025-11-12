import React from 'react';
import Link from "next/link";

const GameMenu = () => {
  return (
    <div className="text-xl flex flex-col items-center justify-center min-h-screen text-center gap-4">
      <Link
        href="/"
        className="block hover:underline"
      >
        Back to Home
        <br /><br />
      </Link>

      <Link
        href="/game/play"
        className="block hover:underline"
      >
        Play
        <br /><br />
      </Link>
    </div>
  );
};

export default GameMenu;
