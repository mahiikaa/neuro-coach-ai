
import React, { useState } from 'react';
import { Scenario } from '../types';
import { getPreparationFeedback } from '../services/geminiService';
import { EditIcon, CheckCircleIcon, LightBulbIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

interface PreparationViewProps {
  scenario: Scenario;
  onStartInteraction: () => void;
  goBack: () => void;
}

const PreparationView: React.FC<PreparationViewProps> = ({ scenario, onStartInteraction, goBack }) => {
  const [practicePhrase, setPracticePhrase] = useState('');
  const [feedback, setFeedback] = useState<{ is_effective: boolean; suggestion: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const firstGoal = scenario.goals[0];

  const handleGetFeedback = async () => {
    if (!practicePhrase.trim()) return;
    setIsLoading(true);
    setFeedback(null);
    try {
      const result = await getPreparationFeedback(practicePhrase, firstGoal);
      setFeedback(result);
    } catch (error) {
      console.error(error);
      setFeedback({ is_effective: false, suggestion: "Sorry, I couldn't process that. Let's just try it in the chat!" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">{scenario.emoji} {scenario.title}</h2>
        <p className="mt-2 text-lg text-gray-600">Let's prepare for the interaction.</p>
      </div>

      <div className="mt-8 p-6 bg-indigo-50 border border-indigo-200 rounded-lg">
        <h3 className="font-semibold text-lg text-indigo-900 flex items-center">
          <EditIcon className="w-6 h-6 mr-2" />
          Cognitive Rehearsal
        </h3>
        <p className="mt-2 text-indigo-700">
          Your first goal is to: <span className="font-bold">{firstGoal.description}</span>
        </p>
        <p className="mt-1 text-sm text-indigo-500">How might you say that? Practice typing it below to get some quick feedback.</p>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={practicePhrase}
            onChange={(e) => setPracticePhrase(e.target.value)}
            placeholder="e.g., Is this seat taken?"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
          <button
            onClick={handleGetFeedback}
            disabled={isLoading || !practicePhrase.trim()}
            className="bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Get Tip'}
          </button>
        </div>

        {feedback && (
          <div className={`mt-4 p-3 rounded-md flex items-start gap-3 ${feedback.is_effective ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {feedback.is_effective ? <CheckCircleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" /> : <LightBulbIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />}
            <p className="text-sm font-medium">{feedback.suggestion}</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button onClick={goBack} className="text-sm font-medium text-gray-600 hover:text-indigo-600">
          Back to Scenarios
        </button>
        <button
          onClick={onStartInteraction}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-transform hover:scale-105"
        >
          Start Interaction
        </button>
      </div>
    </div>
  );
};

export default PreparationView;
