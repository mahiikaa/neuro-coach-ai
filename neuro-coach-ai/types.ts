
export type SocialSkillCategory = 'Initiation' | 'Reciprocity' | 'Collaboration' | 'Assertion';

export interface ScenarioGoal {
  id: string;
  description: string;
  hint: string;
  category: SocialSkillCategory;
}

export interface Scenario {
  id:string;
  title: string;
  description: string;
  emoji: string;
  systemPrompt: string;
  goals: ScenarioGoal[];
}

export interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export interface Feedback {
  scenarioId: string;
  scenarioTitle: string;
  positivePoints: string[];
  areasForPractice: string[];
  timestamp: string;
  emotionalToneAnalysis: string;
  achievedGoals: string[];
  totalGoals: number;
  performanceScore: number; // New: 0-100 score
  dynamicDifficultySuggestion: string; // New: AI suggestion for next session
}

export interface ProgressData {
  interactions: Record<string, number>; // { scenarioId: count }
  feedbackHistory: Feedback[];
}

export type View = 'selection' | 'preparation' | 'interaction' | 'dashboard'; // Added 'preparation'

export interface FeedbackResponse {
    positive_points: string[];
    areas_for_practice: string[];
    achieved_goals: string[]; // array of goal IDs
    emotional_tone_analysis: string;
    performance_score: number; // 0-100
    dynamic_difficulty_suggestion: string; // Text suggestion
}

export interface PreparationFeedbackResponse {
    is_effective: boolean;
    suggestion: string;
}
