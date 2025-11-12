'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage('Please enter both username and password.');
      return;
    }

    try {
      // Check if the username already exists
      const { data: existingUser, error: selectError } = await supabase
        .from('profiles')
        .select('username, password')
        .eq('username', username)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Select error:', selectError.message);
        setMessage('Database error. Please try again.');
        return;
      }

      // 🧩 Case 1: Existing user → attempt login
      if (existingUser) {
        const passwordMatch = await bcrypt.compare(
          password,
          existingUser.password
        );
        if (passwordMatch) {
          localStorage.setItem('username', username);
          setMessage('Logged in successfully!');
        } else {
          setMessage('Incorrect password.');
        }
        return;
      }

      // 🧩 Case 2: New user → register
      const hashedPassword = await bcrypt.hash(password, 10);
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{ username, password: hashedPassword }]);

      if (insertError) {
        console.error(insertError);
        setMessage('Error creating user: ' + insertError.message);
      } else {
        localStorage.setItem('username', username);
        setMessage('Account created successfully!');
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong.');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Login / Register</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm p-6 rounded-lg"
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md"
        >
          Login / Register
        </button>
      </form>

      {message && (
        <p className="mt-4 text-lg text-center">{message}</p>
      )}

      <Link href="/" className="text-blue-500 hover:underline mt-6">
        Back to Home
        <br />
        <br />
      </Link>
    </main>
  );
}
