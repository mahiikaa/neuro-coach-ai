
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Scenario, Message } from '../types';
import { BackArrowIcon, SendIcon, UserIcon, SparklesIcon, TargetIcon, ChevronDownIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

interface InteractionViewProps {
  scenario: Scenario;
  onEndSession: (conversationHistory: Message[]) => void;
  goBack: () => void;
}

// A helper to simulate a chat session on the client side
// In a more complex app, this could be a class that manages state.
const createClientSideChat = (systemPrompt: string) => {
    const history: { role: string; parts: { text: string }[] }[] = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: "Understood. I will now act as the specified character."}] }
    ];

    const sendMessage = async (message: string): Promise<string> => {
        // This is a simplified simulation and doesn't actually call an AI.
        // The real AI call happens on the backend during feedback generation.
        // For this demo, we can provide a generic canned response or just wait for the user.
        // The key is that the conversation is logged for the backend to analyze.
        
        // Let's create a placeholder AI response.
        const aiResponses = [
            "That's interesting, tell me more.",
            "I see. What happened next?",
            "Okay, got it.",
            "What do you think we should do?",
            "Hmm, I'm not sure. What's your idea?"
        ];
        
        // This part is a mock and won't be used as the actual session is stateless.
        // The real magic happens when the full conversation is sent for analysis.
        // For the purpose of the UI, we just need to log the conversation.
        // We will immediately return a canned response for the purpose of the UI flow.
        return Promise.resolve(aiResponses[Math.floor(Math.random() * aiResponses.length)]);
    };

    return { sendMessage, history };
};


const GoalDisplay: React.FC<{ scenario: Scenario }> = ({ scenario }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="mb-4 border rounded-lg bg-gray-50/70">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 text-left font-semibold text-gray-700 hover:bg-gray-100/50 rounded-lg">
                <div className="flex items-center">
                    <TargetIcon className="w-5 h-5 mr-2 text-indigo-600"/>
                    <span>Session Goals</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-200">
                    <ul className="space-y-2">
                        {scenario.goals.map(goal => (
                            <li key={goal.id} className="text-sm text-gray-600">
                                <p className="font-medium text-gray-800">- {goal.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

const InteractionView: React.FC<InteractionViewProps> = ({ scenario, onEndSession, goBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The first message is now the system prompt itself to guide the feedback AI.
    setMessages([
      { sender: 'ai', text: `Hi there! Let's practice the "${scenario.title}" scenario. I'm ready when you are.`}
    ]);
  }, [scenario]);
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    const newUserMessage: Message = { sender: 'user', text };
    // This is the full history that will be sent to the backend for analysis
    const fullConversationHistory = [...messages, newUserMessage];
    setMessages(fullConversationHistory);
    setIsLoading(true);
    setUserInput('');

    // This is where a streaming chat would happen.
    // Since we've moved the AI to the backend for security, a live chat is more complex.
    // For this version, we will have the AI provide a generic response to keep the conversation flowing.
    // The *real* contextual analysis happens after the session ends.
    setTimeout(() => {
        const cannedResponses = [
            "That's interesting, tell me more.",
            "I see. And then?",
            "Okay, what do you think?",
            "Got it.",
            "Right."
        ];
        const aiResponse: Message = { sender: 'ai', text: cannedResponses[Math.floor(Math.random() * cannedResponses.length)]};
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
    }, 800);

  }, [messages, scenario.systemPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(userInput);
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200">
      <div className="p-4 border-b flex items-center justify-between bg-gray-50 rounded-t-2xl">
        <button onClick={goBack} className="flex items-center text-sm font-semibold text-gray-600 hover:text-indigo-600">
          <BackArrowIcon className="w-5 h-5 mr-2" />
          Back to Prepare
        </button>
        <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">{scenario.emoji} {scenario.title}</h2>
        </div>
        <button onClick={() => onEndSession(messages)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          End & Get Feedback
        </button>
      </div>

      <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-100/30">
        <GoalDisplay scenario={scenario} />
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow"><SparklesIcon className="w-6 h-6"/></div>}
            <div className={`max-w-md lg:max-w-xl px-5 py-3 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'}`}>
              <p className="whitespace-pre-wrap text-base">{msg.text}</p>
            </div>
             {msg.sender === 'user' && <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 shadow-sm"><UserIcon className="w-6 h-6"/></div>}
          </div>
        ))}
        {isLoading && <div className="flex justify-start items-end gap-3"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow"><SparklesIcon className="w-6 h-6"/></div><div className="px-5 py-3 bg-white rounded-2xl rounded-bl-none shadow-sm border border-gray-200"><LoadingSpinner size="sm" /></div></div>}
      </div>

      <div className="p-4 border-t bg-white rounded-b-2xl">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow focus:shadow-md"
          />
          <button type="submit" disabled={isLoading || !userInput.trim()} className="bg-indigo-600 text-white p-3 rounded-xl disabled:bg-indigo-300 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-indigo-500/30">
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default InteractionView;
