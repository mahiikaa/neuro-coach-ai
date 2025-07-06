
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Message, FeedbackResponse, Scenario } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { conversation, scenario } = req.body as { conversation: Message[], scenario: Scenario };

    if (!conversation || !scenario) {
        return res.status(400).json({ error: 'Missing conversation or scenario in request body' });
    }

    const formattedConversation = conversation.map(msg => `${msg.sender === 'user' ? 'User' : 'AI Peer'}: ${msg.text}`).join('\n');
    const goalsJson = JSON.stringify(scenario.goals.map(g => ({ id: g.id, description: g.description })), null, 2);

    const prompt = `
      You are a specialized AI assistant that analyzes social interactions and returns data ONLY in a valid JSON format.
      Your task is to analyze the following conversation and return a structured JSON object.

      **Scenario:** "${scenario.title}"
      **User's Goals:**
      ${goalsJson}

      **Conversation Transcript:**
      ${formattedConversation}

      **Instructions:**
      Analyze the user's performance based ONLY on their messages in the transcript. Your entire response must be a single, valid JSON object, without any surrounding text, explanations, or markdown fences.

      **JSON Schema to follow:**
      {
        "positive_points": ["string"],
        "areas_for_practice": ["string"],
        "achieved_goals": ["string"],
        "emotional_tone_analysis": "string",
        "performance_score": "number",
        "dynamic_difficulty_suggestion": "string"
      }

      **Field Descriptions & Rules:**
      1.  "positive_points": Array of strings. List specific, positive actions the user took. If none, return an empty array [].
      2.  "areas_for_practice": Array of strings. List concrete, actionable suggestions for improvement. If none, return an empty array [].
      3.  "achieved_goals": Array of goal 'id' strings that the user successfully accomplished. Be strict. Only include goals that were clearly met.
      4.  "emotional_tone_analysis": A 1-2 sentence analysis of the user's textual emotional tone (e.g., confident, curious, hesitant). If unable to determine from the text, state that clearly.
      5.  "performance_score": A single integer from 0 to 100 assessing overall performance. 50 is average. Base this on goal achievement and conversational fluency.
      6.  "dynamic_difficulty_suggestion": A single, encouraging sentence for the user's next session.

      **Crucial Rule:** If the conversation is too short or doesn't provide enough information to analyze, you MUST still return a valid JSON object. Populate the fields with sensible defaults (e.g., empty arrays, a score of 50, a message like "Not enough data to analyze tone."). DO NOT break the JSON format or return an error.

      Your output MUST be ONLY the JSON object.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const parsedData: FeedbackResponse = JSON.parse(jsonStr);
        const validatedData = {
            positive_points: parsedData.positive_points && Array.isArray(parsedData.positive_points) ? parsedData.positive_points : [],
            areas_for_practice: parsedData.areas_for_practice && Array.isArray(parsedData.areas_for_practice) ? parsedData.areas_for_practice : [],
            achieved_goals: parsedData.achieved_goals && Array.isArray(parsedData.achieved_goals) ? parsedData.achieved_goals : [],
            emotional_tone_analysis: typeof parsedData.emotional_tone_analysis === 'string' ? parsedData.emotional_tone_analysis : "Could not analyze emotional tone.",
            performance_score: typeof parsedData.performance_score === 'number' ? parsedData.performance_score : 50,
            dynamic_difficulty_suggestion: typeof parsedData.dynamic_difficulty_suggestion === 'string' ? parsedData.dynamic_difficulty_suggestion : "Keep up the great work!"
        };
        return res.status(200).json(validatedData);

    } catch (e) {
        console.error("Failed to parse JSON feedback from Gemini:", e);
        const fallbackResponse: FeedbackResponse = {
            positive_points: ["Great job completing the scenario!"],
            areas_for_practice: ["There was an issue generating detailed feedback."],
            achieved_goals: [],
            emotional_tone_analysis: "Analysis not available.",
            performance_score: 50,
            dynamic_difficulty_suggestion: "Keep practicing!"
        };
        return res.status(500).json(fallbackResponse);
    }
}
