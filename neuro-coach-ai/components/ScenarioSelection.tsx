
import React from 'react';
import { SCENARIOS } from '../constants';
import { Scenario } from '../types';
import { UpRightArrowIcon } from './icons';

interface ScenarioSelectionProps {
  onSelectScenario: (scenario: Scenario) => void;
}

const ScenarioSelection: React.FC<ScenarioSelectionProps> = ({ onSelectScenario }) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Practice Scenarios</h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">Select a situation to begin your AI-guided practice session.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SCENARIOS.map((scenario) => (
          <div
            key={scenario.id}
            onClick={() => onSelectScenario(scenario)}
            className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-transparent hover:border-indigo-500"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-5">
                 <div className="text-5xl flex-shrink-0">{scenario.emoji}</div>
                 <div>
                    <h3 className="text-2xl font-bold text-gray-900">{scenario.title}</h3>
                    <p className="mt-2 text-gray-600">{scenario.description}</p>
                 </div>
              </div>
              <UpRightArrowIcon className="w-6 h-6 text-gray-300 group-hover:text-indigo-600 transition-colors duration-300 transform group-hover:rotate-45" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScenarioSelection;
