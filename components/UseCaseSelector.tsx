
import React from 'react';
import type { UseCase } from '../types';

interface UseCaseSelectorProps {
  useCases: UseCase[];
  selectedUseCase: UseCase | null;
  onSelectUseCase: (useCase: UseCase) => void;
}

export const UseCaseSelector: React.FC<UseCaseSelectorProps> = ({ useCases, selectedUseCase, onSelectUseCase }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {useCases.map((useCase) => (
        <button
          key={useCase.id}
          onClick={() => onSelectUseCase(useCase)}
          className={`p-4 rounded-lg text-center transition-all duration-300 transform hover:-translate-y-1 border-2 ${
            selectedUseCase?.id === useCase.id
              ? 'bg-cyan-600/30 border-cyan-500 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
              : 'bg-gray-700/50 border-gray-600 hover:border-cyan-600'
          }`}
        >
          <useCase.icon className={`w-10 h-10 mx-auto mb-3 ${selectedUseCase?.id === useCase.id ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-400'}`} />
          <h3 className="font-semibold text-white">{useCase.name}</h3>
          <p className="text-xs text-gray-400 mt-1 hidden md:block">{useCase.description}</p>
        </button>
      ))}
    </div>
  );
};
