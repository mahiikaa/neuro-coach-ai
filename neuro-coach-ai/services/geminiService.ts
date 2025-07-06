
import { Message, FeedbackResponse, Scenario, PreparationFeedbackResponse, ScenarioGoal } from '../types';

async function postData<T>(url: string, body: object): Promise<T> {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        // Try to parse the error message from the server, otherwise throw a generic error
        try {
            const errorData = await response.json();
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        } catch (e) {
            throw new Error(`Request failed with status ${response.status}`);
        }
    }
    return response.json();
}

export const getPreparationFeedback = async (phrase: string, goal: ScenarioGoal): Promise<PreparationFeedbackResponse> => {
    try {
        return await postData<PreparationFeedbackResponse>('/api/prepare', { phrase, goal });
    } catch (error) {
        console.error("Error getting preparation feedback:", error);
        // Provide a fallback response that is displayed to the user
        return { is_effective: false, suggestion: "Sorry, couldn't connect to the coach. Let's just try the interaction!" };
    }
};

export const getInteractionFeedback = async (conversation: Message[], scenario: Scenario): Promise<FeedbackResponse> => {
    try {
        return await postData<FeedbackResponse>('/api/feedback', { conversation, scenario });
    } catch (error) {
        console.error("Error getting interaction feedback:", error);
         // This is the final fallback if the API call fails
        return {
            positive_points: ["Great job completing the scenario!"],
            areas_for_practice: ["There was an issue connecting to the AI coach for detailed feedback."],
            achieved_goals: [],
            emotional_tone_analysis: "Analysis not available due to a connection issue.",
            performance_score: 50,
            dynamic_difficulty_suggestion: "Keep practicing!"
        };
    }
};
