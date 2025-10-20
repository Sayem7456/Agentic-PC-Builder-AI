
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800/30 border-t border-gray-700/50 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Agentic PC Builder AI. All rights reserved.</p>
        <p className="text-sm mt-1">Powered by Google Gemini. Prices and links are estimates and may vary.</p>
      </div>
    </footer>
  );
};
