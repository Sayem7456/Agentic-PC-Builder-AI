
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="text-center p-8 bg-gray-800/50 rounded-2xl">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mx-auto"></div>
      <h3 className="mt-6 text-xl font-semibold text-white">Your AI agent is building the perfect PC...</h3>
      <p className="text-gray-400 mt-2">Analyzing components, checking compatibility, and finding the best deals.</p>
    </div>
  );
};
