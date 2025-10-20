
import React from 'react';
import type { PCConfiguration } from '../types';

interface ConfigurationDisplayProps {
  configuration: PCConfiguration;
}

export const ConfigurationDisplay: React.FC<ConfigurationDisplayProps> = ({ configuration }) => {
  return (
    <div className="bg-gray-800/50 rounded-2xl shadow-lg p-6 md:p-8 backdrop-blur-sm border border-gray-700/50 animate-fade-in">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-3xl font-bold text-cyan-400">Your Custom PC Build</h2>
        <div className="text-right">
          <p className="text-gray-400">Total Estimated Cost</p>
          <p className="text-3xl font-bold text-green-400">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: configuration.currency || 'USD' }).format(configuration.totalPrice)}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {configuration.components.map((component, index) => (
          <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 grid md:grid-cols-12 gap-4 items-start">
            <div className="md:col-span-2">
              <h4 className="font-bold text-cyan-400">{component.type}</h4>
            </div>
            <div className="md:col-span-5">
              <p className="font-semibold text-white">{component.name}</p>
              <p className="text-sm text-gray-400 mt-1 italic">"{component.justification}"</p>
            </div>
            <div className="md:col-span-2 text-left md:text-right">
              <p className="text-lg font-medium text-green-400">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: configuration.currency || 'USD' }).format(component.price)}
              </p>
            </div>
            <div className="md:col-span-3 text-left md:text-right">
              <a
                href={component.purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Buy Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
