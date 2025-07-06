
import { Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'cafeteria',
    title: 'Cafeteria Lunch',
    description: 'Practice finding a seat and joining a conversation during a busy lunch period.',
    emoji: '🍔',
    systemPrompt: "You are a friendly 14-year-old student named Alex. You are in a loud, busy school cafeteria. You see the user looking for a place to sit. You should be welcoming but also act like a natural teenager. Your goal is to help the user practice joining a group and making small talk. Keep your responses relatively short.",
    goals: [
        { id: 'ask_to_join', description: "Ask if you can sit with Alex.", hint: "Try saying something like 'Is this seat taken?' or 'Do you mind if I join you?'", category: 'Initiation' },
        { id: 'ask_question', description: "Ask Alex a question to start a conversation.", hint: "A good way to start is to ask about their day or what they're eating.", category: 'Reciprocity' },
        { id: 'share_interest', description: "Share something about your own day or interests.", hint: "You could mention a class you had or something you're looking forward to.", category: 'Reciprocity' }
    ]
  },
  {
    id: 'hallway',
    title: 'First Day of School',
    description: 'Navigate a busy school hallway and practice asking for directions to your next class.',
    emoji: '📚',
    systemPrompt: "You are a helpful 15-year-old student named Sam, standing by some lockers in a busy school hallway between classes. The user, who looks new, will approach you. Your role is to be friendly, give clear directions if asked, and maybe ask a follow-up question. The bell is about to ring, so you can't talk for too long.",
    goals: [
        { id: 'get_attention', description: "Get Sam's attention politely.", hint: "Start with a simple 'Excuse me' or 'Hi'.", category: 'Initiation'},
        { id: 'ask_for_directions', description: "Clearly ask for directions to a specific class.", hint: "For example: 'Can you tell me how to get to the science lab?'", category: 'Assertion'},
        { id: 'thank_person', description: "Thank Sam for their help.", hint: "A simple 'Thanks!' or 'I appreciate your help' works great.", category: 'Reciprocity'}
    ]
  },
  {
    id: 'playground',
    title: 'Joining a Game',
    description: 'Learn how to approach a group of peers and ask to join their game during recess.',
    emoji: '⚽',
    systemPrompt: "You are a 13-year-old named Casey, playing kickball with a friend on the playground during recess. You are fun-loving and energetic. The user will approach you, wanting to join the game. Your goal is to react positively and explain the rules simply, helping the user feel included. Be encouraging.",
    goals: [
        { id: 'observe_first', description: "Watch the game for a moment before approaching.", hint: "You can mention what you see, like 'That looks fun!'", category: 'Initiation'},
        { id: 'ask_to_play', description: "Politely ask if you can join the game.", hint: "Try saying, 'Hey, can I play too?' or 'Mind if I join in?'", category: 'Assertion'},
        { id: 'ask_about_rules', description: "Ask a question about the game or its rules.", hint: "This shows you're interested in playing correctly. For example: 'What are the rules?' or 'Which team am I on?'", category: 'Reciprocity'}
    ]
  },
  {
    id: 'classroom',
    title: 'Group Project',
    description: 'Work with a virtual partner on a class project, practicing collaboration and sharing ideas.',
    emoji: '🔬',
    systemPrompt: "You are a 16-year-old student named Taylor. You've been assigned to a science project with the user. You are sitting at a table in the classroom. You are organized and have a few ideas, but you are very open to the user's input. Your goal is to practice collaborating, brainstorming, and deciding on a plan together. Be a supportive and equal partner.",
    goals: [
        { id: 'greet_partner', description: "Start with a friendly greeting.", hint: "A simple 'Hey' or 'Hi, ready to start?' is perfect.", category: 'Initiation'},
        { id: 'share_an_idea', description: "Contribute one of your own ideas for the project.", hint: "Don't be shy! Say something like, 'I was thinking we could...'", category: 'Collaboration'},
        { id: 'ask_for_opinion', description: "Ask Taylor for their opinion on an idea.", hint: "Collaboration is key. Try, 'What do you think about that idea?'", category: 'Collaboration'}
    ]
  }
];
