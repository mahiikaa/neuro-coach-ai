import React from 'react';
import { ProgressData, Scenario, Feedback, SocialSkillCategory } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { CheckCircleIcon, TargetIcon, SmileIcon, RadarIcon, UpRightArrowIcon } from './icons';

interface DashboardProps {
  progressData: ProgressData;
  scenarios: Scenario[];
  resetProgress: () => void;
}

const SKILL_CATEGORIES: SocialSkillCategory[] = ['Initiation', 'Reciprocity', 'Collaboration', 'Assertion'];

const FeedbackCard: React.FC<{ feedback: Feedback }> = ({ feedback }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg border border-gray-200/80">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{feedback.scenarioTitle}</h3>
                    <p className="text-sm text-gray-500">{new Date(feedback.timestamp).toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-indigo-600">{feedback.performanceScore}</div>
                    <div className="text-xs font-semibold text-gray-500 uppercase">Performance</div>
                </div>
            </div>
            
            <div className="space-y-5">
                <div>
                    <h4 className="flex items-center text-base font-semibold text-gray-700 mb-2">
                        <SmileIcon className="w-5 h-5 mr-2 text-blue-500" />
                        Emotional Tone Analysis
                    </h4>
                    <p className="text-gray-600 bg-blue-50/50 p-3 rounded-md border border-blue-100 text-sm">{feedback.emotionalToneAnalysis}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <h4 className="flex items-center text-base font-semibold text-gray-700 mb-2">
                            <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                            What Went Well
                        </h4>
                        <ul className="list-disc list-inside space-y-1.5 text-gray-600 text-sm pl-2">
                            {feedback.positivePoints.length > 0 ? feedback.positivePoints.map((point, i) => <li key={i}>{point}</li>) : <li>No specific points noted.</li>}
                        </ul>
                    </div>
                     <div>
                        <h4 className="flex items-center text-base font-semibold text-gray-700 mb-2">
                            <TargetIcon className="w-5 h-5 mr-2 text-yellow-500" />
                            Things to Practice
                        </h4>
                        <ul className="list-disc list-inside space-y-1.5 text-gray-600 text-sm pl-2">
                            {feedback.areasForPractice.length > 0 ? feedback.areasForPractice.map((point, i) => <li key={i}>{point}</li>) : <li>Looks like you did great!</li>}
                        </ul>
                    </div>
                </div>

                 <div>
                    <h4 className="flex items-center text-base font-semibold text-gray-700 mb-2">
                        <UpRightArrowIcon className="w-5 h-5 mr-2 text-purple-500" />
                        Coach's Suggestion for Next Time
                    </h4>
                    <p className="text-gray-600 bg-purple-50/50 p-3 rounded-md border border-purple-100 text-sm">{feedback.dynamicDifficultySuggestion}</p>
                </div>
            </div>
        </div>
    );
}

const Dashboard: React.FC<DashboardProps> = ({ progressData, scenarios, resetProgress }) => {
  const hasData = progressData.feedbackHistory.length > 0;

  const performanceTimelineData = [...progressData.feedbackHistory].reverse().map((fb, index) => ({
      session: index + 1,
      score: fb.performanceScore,
      scenario: fb.scenarioTitle.split(' ')[0] // e.g., "Cafeteria"
  }));

  const skillsData = SKILL_CATEGORIES.map(category => {
      const allGoalsInCategory = scenarios.flatMap(s => s.goals).filter(g => g.category === category);
      const achievedGoalsInCategory = progressData.feedbackHistory.flatMap(fb => {
          const scenario = scenarios.find(s => s.id === fb.scenarioId);
          if (!scenario) return [];
          return fb.achievedGoals
              .map(goalId => scenario.goals.find(g => g.id === goalId))
              .filter(g => g && g.category === category);
      });
      
      const uniqueAchieved = new Set(achievedGoalsInCategory.map(g => g?.id));
      const proficiency = allGoalsInCategory.length > 0 ? (uniqueAchieved.size / allGoalsInCategory.length) * 100 : 0;
      
      return {
          skill: category,
          proficiency: Math.round(proficiency)
      };
  });
  
  const overallStats = {
      totalSessions: progressData.feedbackHistory.length,
      avgScore: hasData ? Math.round(progressData.feedbackHistory.reduce((acc, fb) => acc + fb.performanceScore, 0) / progressData.feedbackHistory.length) : 0,
      bestScenario: Object.entries(progressData.interactions).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
  };


  if (!hasData) {
      return (
        <div className="text-center py-20 px-6 bg-white rounded-xl shadow-lg border">
            <h3 className="text-3xl font-bold text-gray-800">Your Dashboard is Ready</h3>
            <p className="mt-3 text-lg text-gray-500">Complete your first practice scenario to unlock personalized analytics and track your growth.</p>
        </div>
      );
  }

  return (
    <div className="animate-fade-in space-y-8">
        <div className="flex justify-between items-center">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Progress Dashboard</h2>
            <button 
                onClick={resetProgress}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm"
            >
                Reset Progress
            </button>
        </div>
        
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/80">
                <h3 className="flex items-center text-xl font-bold text-gray-800 mb-4">
                    <RadarIcon className="w-6 h-6 mr-2 text-indigo-600" />
                    Social Skills Proficiency
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" tick={{ fill: '#4B5563', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Proficiency" dataKey="proficiency" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                        <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200/80">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Performance Over Time</h3>
                 <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceTimelineData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="session" name="Session" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Feedback History */}
        <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6 mt-4">Session Feedback History</h3>
            <div className="space-y-6">
                {progressData.feedbackHistory.map((feedback, index) => (
                    <FeedbackCard key={index} feedback={feedback} />
                ))}
            </div>
        </div>
    </div>
  );
};

export default Dashboard;