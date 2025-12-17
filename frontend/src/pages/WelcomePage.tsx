import React from 'react';
import { useNavigate } from 'react-router-dom';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-500 flex flex-col">
      <header className="w-full flex items-center justify-between px-8 py-4 text-white">
        <span className="text-2xl font-semibold tracking-tight">e-Library</span>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <button
          onClick={() => navigate('/login')}
          className="px-10 py-4 rounded-full bg-white text-indigo-600 font-semibold text-lg shadow-lg hover:shadow-xl transition shadow-indigo-900/30"
        >
          Discover your next book
        </button>
      </main>
    </div>
  );
};
