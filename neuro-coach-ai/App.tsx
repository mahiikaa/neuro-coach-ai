
import React, { useState, useEffect, useCallback } from 'react';
import { View, Scenario, Message, ProgressData, Feedback } from './types';
import { SCENARIOS } from './constants';
import { getInteractionFeedback } from './services/geminiService';
import Header from './components/Header';
import ScenarioSelection from './components/ScenarioSelection';
import InteractionView from './components/InteractionView';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import PreparationView from './components/PreparationView';

const App: React.FC = () => {
  const [view, setView] = useState<View>('selection');
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [progressData, setProgressData] = useState<ProgressData>({ interactions: {}, feedbackHistory: [] });
  const [isLoadingFeedback, setIsLoadingFeedback] = useState<boolean>(false);

  useEffect(() => {
    const savedProgress = localStorage.getItem('neuroCoachProgress');
    if (savedProgress) {
      setProgressData(JSON.parse(savedProgress));
    }
  }, []);

  const updateProgressData = (newProgress: ProgressData) => {
    setProgressData(newProgress);
    localStorage.setItem('neuroCoachProgress', JSON.stringify(newProgress));
  };

  const handleSelectScenario = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    setView('preparation');
  };

  const handleStartInteraction = () => {
      if (currentScenario) {
          setView('interaction');
      }
  }

  const handleEndSession = useCallback(async (conversationHistory: Message[]) => {
    if (!currentScenario) return;

    setIsLoadingFeedback(true);
    setView('selection'); // Go back to selection while loading

    // Add the system prompt to the conversation history for the backend analysis
    const fullConversationForAnalysis: Message[] = [
        { sender: 'ai', text: `System instruction: ${currentScenario.systemPrompt}` },
        ...conversationHistory
    ];

    try {
      const feedbackResult = await getInteractionFeedback(fullConversationForAnalysis, currentScenario);
      
      const newFeedback: Feedback = {
        scenarioId: currentScenario.id,
        scenarioTitle: currentScenario.title,
        positivePoints: feedbackResult.positive_points,
        areasForPractice: feedbackResult.areas_for_practice,
        emotionalToneAnalysis: feedbackResult.emotional_tone_analysis,
        achievedGoals: feedbackResult.achieved_goals,
        totalGoals: currentScenario.goals.length,
        performanceScore: feedbackResult.performance_score,
        dynamicDifficultySuggestion: feedbackResult.dynamic_difficulty_suggestion,
        timestamp: new Date().toISOString(),
      };

      const updatedProgress: ProgressData = {
        interactions: {
          ...progressData.interactions,
          [currentScenario.id]: (progressData.interactions[currentScenario.id] || 0) + conversationHistory.filter(m => m.sender === 'user').length,
        },
        feedbackHistory: [newFeedback, ...progressData.feedbackHistory],
      };

      updateProgressData(updatedProgress);

    } catch (error) {
      console.error("Failed to get feedback:", error);
      alert("Sorry, there was an error getting your feedback. Please try again.");
    } finally {
      setIsLoadingFeedback(false);
      setCurrentScenario(null);
    }
  }, [currentScenario, progressData]);

  const resetProgress = () => {
    if(window.confirm("Are you sure you want to reset all your progress? This action cannot be undone.")){
        const emptyProgress = { interactions: {}, feedbackHistory: [] };
        updateProgressData(emptyProgress);
        setView('selection');
    }
  }
  
  const goBackToSelection = () => {
      setCurrentScenario(null);
      setView('selection');
  }

  const renderContent = () => {
    if (isLoadingFeedback) {
      return (
        <div className="flex flex-col items-center justify-center h-full pt-20">
            <LoadingSpinner size="lg"/>
            <p className="mt-4 text-xl font-semibold text-gray-700">Analyzing your session...</p>
            <p className="text-gray-500">Our AI coach is generating your personalized feedback report.</p>
        </div>
      );
    }

    switch (view) {
      case 'preparation':
        return currentScenario && <PreparationView scenario={currentScenario} onStartInteraction={handleStartInteraction} goBack={goBackToSelection} />;
      case 'interaction':
        // Note: The live chat is now simulated. The real analysis happens on the backend after the session.
        return currentScenario && <InteractionView scenario={currentScenario} onEndSession={handleEndSession} goBack={() => setView('preparation')} />;
      case 'dashboard':
        return <Dashboard progressData={progressData} scenarios={SCENARIOS} resetProgress={resetProgress} />;
      case 'selection':
      default:
        return <ScenarioSelection onSelectScenario={handleSelectScenario} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header setView={setView} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
