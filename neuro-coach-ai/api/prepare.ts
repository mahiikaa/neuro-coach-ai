
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PreparationFeedbackResponse, ScenarioGoal } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { phrase, goal } = req.body as { phrase: string, goal: ScenarioGoal };

    if (!phrase || !goal) {
        return res.status(400).json({ error: 'Missing phrase or goal in request body' });
    }

    const prompt = `
        A user is practicing for a social interaction. Their goal is to "${goal.description}".
        The user has proposed the following phrase: "${phrase}"

        Analyze this phrase. Is it an effective way to achieve the goal?
        Provide your feedback in a JSON object with two keys:
        1. "is_effective": a boolean (true if the phrase is good, false if it could be improved).
        2. "suggestion": a single, concise sentence of feedback. If it's effective, be encouraging. If not, provide a constructive alternative or suggestion for improvement.

        Example 1:
        Goal: Ask to join a game.
        Phrase: "Can I play?"
        Response: {"is_effective": true, "suggestion": "That's a great, direct way to ask!"}

        Example 2:
        Goal: Ask to join a game.
        Phrase: "Your game is stupid."
        Response: {"is_effective": false, "suggestion": "This might sound a bit negative. Try focusing on joining in, like 'Hey, mind if I join?'"}

        Return ONLY the JSON object.
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
        
        const parsedData = JSON.parse(jsonStr);
        return res.status(200).json(parsedData);

    } catch (e) {
        console.error("Failed to process preparation feedback:", e);
        const fallbackResponse: PreparationFeedbackResponse = { 
            is_effective: false, 
            suggestion: "Couldn't analyze that phrase. Let's just try the interaction." 
        };
        return res.status(500).json(fallbackResponse);
    }
}
