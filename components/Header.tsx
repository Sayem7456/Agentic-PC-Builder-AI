
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
            <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v1.5M12 16.253v1.5M15.364 8.636l-1.06 1.06M8.636 15.364l-1.06 1.06M17.753 12h-1.5M7.753 12h-1.5M15.364 15.364l-1.06-1.06M8.636 8.636l-1.06-1.06" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m0 14v1m7-8h-1M4 12H3m14.364-5.364L16 8m-8 8l-1.364 1.364M16 16l1.364 1.364M8 8l-1.364-1.364" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-400">
                Agentic PC Builder AI
            </h1>
        </div>
      </div>
    </header>
  );
};
