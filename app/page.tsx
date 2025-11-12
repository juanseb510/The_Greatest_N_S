'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) setUsername(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername(null);
    router.push('/login');
  };

  return (
    <div className="text-xl flex flex-col items-center justify-center min-h-screen text-center gap-4">
      <div>Home Page</div>
      <div className="space-y-2">
        <Link href="/game" className="block hover:underline">Game</Link>
        <Link href="/login" className="block hover:underline">Login</Link>
      </div>

      {/* 👇 Only show this if logged in */}
      {username && (
        <>
          <p className="text-gray-600 mt-4">Logged in as <b>{username}</b></p>
          <button
            onClick={handleLogout}
            className="text-red-500 underline hover:text-red-600"
          >
            Log Out
          </button>
        </>
      )}
    </div>
  );
}
