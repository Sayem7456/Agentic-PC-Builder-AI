
import React, { useState, useCallback } from 'react';
import { UseCaseSelector } from './components/UseCaseSelector';
import { ConfigurationDisplay } from './components/ConfigurationDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import type { PCConfiguration, UseCase } from './types';
import { USE_CASES } from './constants';
import { getPCConfiguration } from './services/geminiService';

export default function App() {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [budget, setBudget] = useState<number>(1500);
  const [region, setRegion] = useState<string>('USA');
  const [configuration, setConfiguration] = useState<PCConfiguration | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!selectedUseCase) {
      setError('Please select a use case first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setConfiguration(null);

    try {
      const result = await getPCConfiguration(selectedUseCase.name, budget, region);
      setConfiguration(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please check the console.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedUseCase, budget, region]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <section id="configurator" className="bg-gray-800/50 rounded-2xl shadow-lg p-6 md:p-8 backdrop-blur-sm border border-gray-700/50">
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2">1. Select Your Primary Use Case</h2>
            <p className="text-gray-400 mb-6">Your choice will help our AI agent prioritize components for your needs.</p>
            <UseCaseSelector
              useCases={USE_CASES}
              selectedUseCase={selectedUseCase}
              onSelectUseCase={setSelectedUseCase}
            />

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2">2. Set Your Budget</h2>
                <p className="text-gray-400 mb-4">Enter your maximum budget. The AI will optimize for performance within this limit.</p>
                <div className="relative">
                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
                   <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 px-4 pl-8 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                    placeholder="e.g., 1500"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2">3. Specify Your Region</h2>
                <p className="text-gray-400 mb-4">For finding relevant purchase links (e.g., USA, Germany, Canada).</p>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 px-4 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  placeholder="e.g., USA"
                />
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={handleGenerate}
                disabled={isLoading || !selectedUseCase}
                className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-12 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(56,189,248,0.4)] disabled:shadow-none"
              >
                {isLoading ? 'AI Agent is Building...' : 'Generate My PC'}
              </button>
            </div>
          </section>

          <section id="results" className="mt-12">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {configuration && <ConfigurationDisplay configuration={configuration} />}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
