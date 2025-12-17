import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  sideTitle: string;
  sideSubtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  sideTitle,
  sideSubtitle,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-500 flex flex-col">
      {/* Top bar */}
      <header className="w-full flex items-center justify-between px-8 py-4 text-white">
        <span className="text-2xl font-semibold tracking-tight">e-Library</span>
      </header>

      {/* Centered fixed-size card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[520px]">
            {/* Left: form + demo creds */}
            <div className="px-8 py-10 md:px-10 flex items-center">
              <div className="w-full flex flex-col h-full">
                {children}
              </div>
            </div>

            {/* Right: marketing panel */}
            <div className="hidden md:flex bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-500 text-white px-10 py-10 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">{sideTitle}</h2>
                <p className="text-sm opacity-90 max-w-xs">
                  {sideSubtitle}
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl px-4 py-3">
                    Curated catalog
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl px-4 py-3">
                    Fast rentals
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl px-4 py-3">
                    Role-based access
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl px-4 py-3">
                    Responsive design
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
