import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

interface MainLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ title, children }) => {
  const { logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-500 flex flex-col">
      {/* Top bar */}
      <header className="w-full flex items-center justify-between px-8 py-4 text-white">
        <span className="text-2xl font-semibold tracking-tight">e-Library</span>
        <button
          onClick={handleLogout}
          className="text-sm font-semibold px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30"
        >
          Log out
        </button>
      </header>

      {/* Centered fixed-size white card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden px-8 py-8 md:px-10 md:py-10 min-h-[520px]">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                {title}
              </h1>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
