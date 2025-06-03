// BohemR Personality Assessment System

// Personality Assessment Questions (exactly 5)
const questions = [
    {
        id: 'decision_metaphor',
        text: "Imagine you're standing at a crossroads in a mystical forest...",
        subtitle: "Which path calls to your soul?",
        options: [
            {
                metaphor: "⚡",
                title: "The Lightning Path",
                description: "Crackling with energy, leading straight through - no time to hesitate when adventure calls",
                personality: 'confident',
                weight: 3
            },
            {
                metaphor: "🌀",
                title: "The Spiral Staircase",
                description: "Winding upward with hidden alcoves and secret passages to explore along the way",
                personality: 'open',
                weight: 3
            },
            {
                metaphor: "🌉",
                title: "The Stone Bridge",
                description: "Solid, well-traveled, with guide posts showing exactly where it leads",
                personality: 'stable',
                weight: 3
            },
            {
                metaphor: "🔍",
                title: "The Observatory Path",
                description: "Rising to a clear vantage point where you can see all possibilities before choosing",
                personality: 'cautious',
                weight: 3
            }
        ]
    },
    {
        id: 'pressure_response',
        text: "The deadline dragon is breathing down your neck...",
        subtitle: "How do you tame this beast?",
        options: [
            {
                metaphor: "🗡️",
                title: "Sword & Shield",
                description: "Charge straight at the problem - action defeats anxiety every time",
                personality: 'confident',
                weight: 2
            },
            {
                metaphor: "🎭",
                title: "Magic Portal",
                description: "Find a completely unexpected solution that no one saw coming",
                personality: 'open',
                weight: 2
            },
            {
                metaphor: "⚓",
                title: "Anchor & Compass",
                description: "Use your proven system - it's weathered storms before",
                personality: 'stable',
                weight: 2
            },
            {
                metaphor: "🧭",
                title: "Map & Telescope",
                description: "Chart the whole territory first, then navigate with precision",
                personality: 'cautious',
                weight: 2
            }
        ]
    },
    {
        id: 'energy_source',
        text: "Your energy meter is running low...",
        subtitle: "Where do you go to recharge your spiritual batteries?",
        options: [
            {
                metaphor: "🌋",
                title: "The Volcano Summit",
                description: "High-energy challenges with others who share your intensity",
                personality: 'confident',
                weight: 2
            },
            {
                metaphor: "🎨",
                title: "The Artist's Loft",
                description: "Stimulating conversations with fascinating people about impossible ideas",
                personality: 'open',
                weight: 2
            },
            {
                metaphor: "🕯️",
                title: "The Hearth Circle",
                description: "Warm gathering with your trusted tribe, sharing stories and laughter",
                personality: 'stable',
                weight: 2
            },
            {
                metaphor: "🌙",
                title: "The Moon Garden",
                description: "Quiet sanctuary where you can think deeply and process everything",
                personality: 'cautious',
                weight: 2
            }
        ]
    },
    {
        id: 'change_winds',
        text: "Life's hurricane just reshuffled your entire world...",
        subtitle: "What's your first instinct?",
        options: [
            {
                metaphor: "🚀",
                title: "Rocket Boost",
                description: "Launch into action - chaos is just opportunity wearing a disguise",
                personality: 'confident',
                weight: 3
            },
            {
                metaphor: "🦋",
                title: "Metamorphosis",
                description: "Embrace the transformation - what beautiful thing might emerge?",
                personality: 'open',
                weight: 3
            },
            {
                metaphor: "⚖️",
                title: "Rebalancing Scales",
                description: "Adjust your systems and routines to accommodate the new reality",
                personality: 'stable',
                weight: 3
            },
            {
                metaphor: "🧩",
                title: "Puzzle Master",
                description: "Study all the pieces carefully before putting together your new picture",
                personality: 'cautious',
                weight: 3
            }
        ]
    },
    {
        id: 'ideal_realm',
        text: "You've been granted access to any realm for the weekend...",
        subtitle: "Where does your soul want to wander?",
        options: [
            {
                metaphor: "🏔️",
                title: "The Challenge Peaks",
                description: "Conquering something that pushes your limits and proves your strength",
                personality: 'confident',
                weight: 2
            },
            {
                metaphor: "🌌",
                title: "The Infinite Library",
                description: "Exploring ideas, art, and experiences that expand your universe",
                personality: 'open',
                weight: 2
            },
            {
                metaphor: "🏡",
                title: "The Harmony Village",
                description: "Perfect balance of meaningful work and soul-nourishing rest",
                personality: 'stable',
                weight: 2
            },
            {
                metaphor: "🌊",
                title: "The Reflection Shores",
                description: "Peaceful time to process, plan, and prepare for what's coming",
                personality: 'cautious',
                weight: 2
            }
        ]
    }
];

// Personality definitions with deeper insights
const personalities = {
    confident: {
        title: "The Lightning Conductor",
        icon: "⚡",
        insight: "You're the person who sees lightning and thinks 'let's harness that energy!' You trust your instincts, take decisive action, and believe that momentum creates clarity. When others freeze, you move. When others doubt, you decide.",
        workStyle: "You probably thrive in roles where you can lead, make quick decisions, and see immediate results. Think entrepreneurship, sales, emergency response, or any field where bold action is valued over endless analysis.",
        growthAreas: [
            "Sometimes your quick decisions might benefit from gathering just a bit more input from others",
            "Your confidence is magnetic, but occasionally pausing to listen can multiply your impact",
            "Consider that some people need more processing time - they're not being slow, they're being thorough"
        ],
        conversation: {
            greeting: "Alright, let's cut to the chase and get you some game-changing recommendations! 🚀",
            recommendations: "Based on your lightning-fast energy, here's what I'm thinking..."
        },
        theme: {
            primary: '#FF6B35',
            secondary: '#F7931E',
            gradient: 'linear-gradient(45deg, #FF6B35, #F7931E)'
        }
    },
    open: {
        title: "The Possibility Weaver",
        icon: "🌀",
        insight: "Your mind is like a kaleidoscope - constantly creating new patterns and seeing connections others miss. You're drawn to the unexplored, the unconventional, and the 'what if?' You don't just think outside the box; you wonder why there's a box at all.",
        workStyle: "You likely excel in creative fields, innovation roles, research, or anywhere that values fresh perspectives. Design, writing, strategy, consulting, or any role where 'we've never tried this before' is a feature, not a bug.",
        growthAreas: [
            "Your brilliant ideas sometimes need a bit more structure to become reality",
            "Remember that some people find comfort in routine - they're not boring, they're building foundations",
            "Consider finishing a few amazing projects before starting new exciting ones"
        ],
        conversation: {
            greeting: "Oh, this is fascinating! We're about to explore the beautiful complexity that is uniquely you ✨",
            recommendations: "I've been connecting some intriguing dots about what might spark your curiosity..."
        },
        theme: {
            primary: '#4ECDC4',
            secondary: '#44A08D',
            gradient: 'linear-gradient(45deg, #4ECDC4, #44A08D)'
        }
    },
    stable: {
        title: "The Harmony Architect",
        icon: "⚖️",
        insight: "You're the person who builds things that last. You understand that true strength comes from consistent effort, reliable systems, and caring about the long game. When chaos swirls around, you're the calm center that everyone gravitates toward.",
        workStyle: "You probably shine in roles that value reliability, team collaboration, and systematic thinking. Project management, operations, education, healthcare, or any field where consistent quality and people-first approaches matter most.",
        growthAreas: [
            "Your desire for harmony is beautiful, but sometimes healthy conflict leads to breakthrough solutions",
            "Trust your insights more - your thoughtful perspective often holds exactly what others need to hear",
            "Remember that some change, even uncomfortable change, can strengthen rather than threaten your foundations"
        ],
        conversation: {
            greeting: "Welcome! I'm here to help you optimize your world in a thoughtful, sustainable way 🌱",
            recommendations: "After careful consideration of your natural rhythms, here's what feels right..."
        },
        theme: {
            primary: '#6C5CE7',
            secondary: '#A29BFE',
            gradient: 'linear-gradient(45deg, #6C5CE7, #A29BFE)'
        }
    },
    cautious: {
        title: "The Depth Navigator",
        icon: "🧭",
        insight: "You're the person who reads the whole map before taking the journey. Your careful approach isn't hesitation - it's wisdom. You see the complexity others miss and prevent problems others don't even know exist. Your depth of thinking is your superpower.",
        workStyle: "You likely excel in roles requiring analysis, risk assessment, and quality control. Research, finance, law, medicine, engineering, or any field where 'measure twice, cut once' isn't just advice - it's essential for success.",
        growthAreas: [
            "Your thorough analysis is invaluable, but sometimes 'good enough to start' beats 'perfect but never launched'",
            "Trust that you've often done more preparation than needed - your first instinct is usually well-informed",
            "Remember that some decisions can be reversed - not every choice needs to be permanent"
        ],
        conversation: {
            greeting: "Hi there! We'll explore this together at whatever pace feels right for you 🤝",
            recommendations: "I've thoughtfully considered what aligns with your natural wisdom..."
        },
        theme: {
            primary: '#00B894',
            secondary: '#00CEC9',
            gradient: 'linear-gradient(45deg, #00B894, #00CEC9)'
        }
    }
};

class PersonalityEngine {
    constructor() {
        this.currentQuestion = 0;
        this.answers = {};
        this.personalityResult = null;
        this.personalityScores = {};
    }
    
    // Calculate personality from answers
    calculatePersonality() {
        const scores = { confident: 0, open: 0, stable: 0, cautious: 0 };
        
        Object.values(this.answers).forEach(answer => {
            scores[answer.personality] += answer.weight;
        });
        
        // Normalize to percentages
        const total = Object.values(scores).reduce((a, b) => a + b, 0);
        Object.keys(scores).forEach(key => {
            scores[key] = Math.round((scores[key] / total) * 100);
        });
        
        // Find dominant personality
        const dominant = Object.entries(scores).reduce((a, b) => 
            scores[a[0]] > scores[b[0]] ? a : b
        )[0];
        
        this.personalityResult = dominant;
        this.personalityScores = scores;
        
        // Store in app state
        appState.personality = dominant;
        appState.personalityScores = scores;
        appState.trustLevel = 2;
        
        return { personality: dominant, scores };
    }
    
    // Map to OCEAN (Big 5) model
    mapToOCEAN(cubeScores) {
        return {
            openness: (cubeScores.open * 0.8 + cubeScores.cautious * 0.2),
            conscientiousness: (cubeScores.stable * 0.7 + cubeScores.cautious * 0.3),
            extraversion: (cubeScores.confident * 0.8 + cubeScores.open * 0.2),
            agreeableness: (cubeScores.stable * 0.6 + cubeScores.cautious * 0.4),
            neuroticism: (100 - (cubeScores.confident * 0.5 + cubeScores.stable * 0.5))
        };
    }
    
    // Get personality insights for user
    getPersonalityInsights(personalityType) {
        const personality = personalities[personalityType];
        if (!personality) return null;
        
        return {
            title: personality.title,
            icon: personality.icon,
            insight: personality.insight,
            workStyle: personality.workStyle,
            growthAreas: personality.growthAreas,
            theme: personality.theme,
            conversation: personality.conversation
        };
    }
    
    // Reset assessment
    reset() {
        this.currentQuestion = 0;
        this.answers = {};
        this.personalityResult = null;
        this.personalityScores = {};
    }
    
    // Get current question
    getCurrentQuestion() {
        return questions[this.currentQuestion];
    }
    
    // Check if assessment is complete
    isComplete() {
        return this.currentQuestion >= questions.length;
    }
    
    // Record answer and advance
    recordAnswer(optionIndex) {
        const question = questions[this.currentQuestion];
        const selectedOption = question.options[optionIndex];
        
        this.answers[question.id] = selectedOption;
        this.currentQuestion++;
        
        return selectedOption;
    }
    
    // Get progress percentage
    getProgress() {
        return Math.round(((this.currentQuestion + 1) / questions.length) * 100);
    }
}

// Export personality system
window.PersonalityEngine = PersonalityEngine;
window.questions = questions;
window.personalities = personalities;