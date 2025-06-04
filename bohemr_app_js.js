// Show recommendations interface with better context and multiple recommendations
function showRecommendations() {
    const personality = personalities[appState.personality];
    
    // Generate fresh recommendations each time
    appState.recommendations = recommendationEngine.generatePersonalizedRecommendations();
    
    // If we only got one recommendation, generate more
    if (appState.recommendations.length < 3) {
        const additionalRecs = generateAdditionalRecommendations();
        appState.recommendations = [...appState.recommendations, ...additionalRecs];
    }
    
    document.getElementById('app').innerHTML = `
        <!-- Enhanced Context Strip -->
        <div class="context-strip">
            <div class="context-item">
                <div class="context-label">Your Location</div>
                <div class="context-value">${getLocationDisplay()}</div>
            </div>
            <div class="context-item">
                <div class="context-label">Right Now</div>
                <div class="context-value">${getTimeDisplay()}</div>
            </div>
            <div class="context-item">
                <div class="context-label">Understanding</div>
                <div class="context-value">${getTrustDisplay()}</div>
            </div>
        </div>
        
        <div class="recommendations-section fade-in">
            <div class="section-header">
                <h2 class="section-title" style="color: ${personality.theme.primary}">
                    Here's what I think you should do right now
                </h2>
                <p class="section-subtitle">
                    Based on your ${personality.title.toLowerCase()} personality, current context, and what I've learned about you
                </p>
                ${appState.recommendations.length < 4 ? `
                    <div style="margin-top: 15px; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <p style="font-size: 0.9rem; opacity: 0.8; text-align: center; margin-bottom: 10px;">
                            💡 Want more personalized suggestions?
                        </p>
                        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                            <button class="choice-btn small" onclick="requestMoreContext('routine')" style="font-size: 0.8rem;">
                                📅 Tell me your routine
                            </button>
                            <button class="choice-btn small" onclick="requestMoreContext('goals')" style="font-size: 0.8rem;">
                                🎯 Share your goals
                            </button>
                            <button class="choice-btn small" onclick="requestMoreContext('interests')" style="font-size: 0.8rem;">
                                ❤️ Tell me your interests
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            ${appState.recommendations.map((rec, index) => `
                <div class="recommendation-card" data-rec-id="${rec.id}">
                    <div class="rec-header">
                        <span style="font-size: 0.8rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px;">
                            Suggestion ${index + 1}
                        </span>
                        <span class="priority-${rec.priority}" style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${rec.priority} priority
                        </span>
                    </div>
                    <div class="rec-main">
                        <div class="rec-icon">${rec.icon}</div>
                        <div class="rec-content">
                            <h3 class="rec-title">${rec.text}</h3>
                            <p class="rec-context">${rec.context}</p>
                            <div class="rec-reasoning">
                                <i class="fas fa-lightbulb"></i>
                                <span>${rec.reasoning}</span>
                            </div>
                        </div>
                    </div>
                    <div class="rec-feedback-enhanced">
                        <button class="feedback-btn love" onclick="giveDetailedFeedback('${rec.id}', 'love')">
                            ❤️ Love
                        </button>
                        <button class="feedback-btn like" onclick="giveDetailedFeedback('${rec.id}', 'like')">
                            👍 Good
                        </button>
                        <button class="feedback-btn meh" onclick="giveDetailedFeedback('${rec.id}', 'meh')">
                            😐 Meh
                        </button>
                        <button class="feedback-btn nah" onclick="giveDetailedFeedback('${rec.id}', 'nah')">
                            👎 Nah
                        </button>
                        <button class="feedback-btn already" onclick="giveDetailedFeedback('${rec.id}', 'already')">
                            ✅ Do this
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="action-buttons">
            <button class="btn btn-primary" onclick="getMoreRecommendations()">
                <i class="fas fa-refresh"></i>
                Give me different ideas
            </button>
            <button class="btn btn-secondary" onclick="showPersonalityResults()">
                <i class="fas fa-user"></i>
                Review my personality
            </button>
        </div>
    `;
}

// Handle requests for more context
function requestMoreContext(type) {
    const contextQuestions = {
        routine: {
            title: "Tell me about your typical day",
            questions: [
                {
                    question: "What time do you usually wake up?",
                    options: ["🌅 Early bird (5-7am)", "🌞 Morning person (7-9am)", "😴 Not a morning person (9-11am)", "🦉 Night owl schedule"]
                },
                {
                    question: "When do you feel most productive?",
                    options: ["🌅 Early morning", "☀️ Mid-morning", "🌤️ Afternoon", "🌙 Evening/night"]
                },
                {
                    question: "How do you usually spend your evenings?",
                    options: ["📺 Relaxing/unwinding", "💼 Working/productive tasks", "👥 Social activities", "🎨 Hobbies/creative time"]
                }
            ]
        },
        goals: {
            title: "What are you working toward?",
            questions: [
                {
                    question: "What's your main focus right now?",
                    options: ["💼 Career advancement", "🎓 Learning new skills", "💪 Health/fitness", "💰 Financial goals", "❤️ Relationships", "🎨 Creative projects"]
                },
                {
                    question: "What's your biggest challenge?",
                    options: ["⏰ Time management", "💪 Staying motivated", "🎯 Knowing what to prioritize", "😰 Managing stress", "🔄 Building good habits"]
                },
                {
                    question: "How do you prefer to make progress?",
                    options: ["🏃 Big leaps and breakthroughs", "🚶 Steady consistent steps", "📊 Measured and planned", "🎲 Flexible and adaptive"]
                }
            ]
        },
        interests: {
            title: "What energizes you?",
            questions: [
                {
                    question: "What kind of activities make you lose track of time?",
                    options: ["🎨 Creative pursuits", "📚 Learning/reading", "👥 Connecting with people", "🏃 Physical activities", "🔧 Building/making things", "🎮 Gaming/entertainment"]
                },
                {
                    question: "What topics do you find yourself naturally curious about?",
                    options: ["🧠 Psychology/human behavior", "💻 Technology/innovation", "🌍 Current events/politics", "🎨 Arts/culture", "🔬 Science/nature", "💼 Business/entrepreneurship"]
                },
                {
                    question: "How do you prefer to spend your free time?",
                    options: ["🧘 Solo reflection/recharge", "👥 With close friends/family", "🌍 Exploring new places", "🏠 Comfortable at home", "🎯 Working on personal projects"]
                }
            ]
        }
    };
    
    const contextType = contextQuestions[type];
    if (!contextType) return;
    
    showContextGatheringFlow(type, contextType);
}

function showContextGatheringFlow(type, contextData) {
    const personality = personalities[appState.personality];
    
    document.getElementById('app').innerHTML = `
        <div class="context-gathering glass-strong fade-in">
            <div class="context-header" style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: ${personality.theme.primary}; margin-bottom: 15px;">
                    ${contextData.title}
                </h2>
                <p style="opacity: 0.8; margin-bottom: 20px;">
                    Help me understand you better so I can give you more relevant suggestions
                </p>
                <div class="progress-bar-container" style="background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px; margin-bottom: 10px; overflow: hidden;">
                    <div class="progress-bar" id="contextProgress" style="background: ${personality.theme.primary}; height: 100%; width: 0%; transition: width 0.5s ease;"></div>
                </div>
                <p style="font-size: 0.8rem; opacity: 0.6;">
                    Question <span id="contextStep">0</span> of ${contextData.questions.length}
                </p>
            </div>
            
            <div id="contextQuestions">
                ${contextData.questions.map((q, index) => `
                    <div class="context-question" id="contextQ${index}" style="display: ${index === 0 ? 'block' : 'none'};">
                        <div class="feedback-card">
                            <div class="feedback-question">${q.question}</div>
                            <div class="choice-grid" style="grid-template-columns: 1fr 1fr;">
                                ${q.options.map((option, optIndex) => `
                                    <button class="choice-btn" onclick="selectContextChoice('${type}', ${index}, ${optIndex}, '${option.replace(/'/g, "\\'")}')">
                                        ${option}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="context-complete" id="contextComplete" style="display: none;">
                <div style="text-align: center; padding: 30px;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🎯</div>
                    <h3 style="color: ${personality.theme.primary}; margin-bottom: 15px;">Perfect! This helps me understand you much better.</h3>
                    <p style="opacity: 0.8; margin-bottom: 30px;">
                        Let me generate more personalized recommendations based on what you've shared.
                    </p>
                    <button class="btn btn-primary" onclick="finishContextGathering('${type}')">
                        <i class="fas fa-magic"></i>
                        Show me better recommendations!
                    </button>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-secondary" onclick="showRecommendations()">
                    <i class="fas fa-arrow-left"></i>
                    Back to recommendations
                </button>
            </div>
        </div>
    `;
}

let contextStep = 0;
let contextAnswers = {};

function selectContextChoice(type, questionIndex, optionIndex, optionText) {
    // Store the answer
    if (!contextAnswers[type]) contextAnswers[type] = {};
    contextAnswers[type][questionIndex] = {
        index: optionIndex,
        text: optionText
    };
    
    // Visual feedback
    const currentQuestion = document.getElementById(`contextQ${questionIndex}`);
    const buttons = currentQuestion.querySelectorAll('.choice-btn');
    buttons.forEach(btn => {
        btn.style.background = 'rgba(255, 255, 255, 0.1)';
        btn.style.opacity = '0.6';
    });
    
    event.target.style.background = 'rgba(78, 205, 196, 0.3)';
    event.target.style.borderColor = '#4ECDC4';
    event.target.style.opacity = '1';
    
    // Update progress
    contextStep = questionIndex + 1;
    updateContextProgress(type);
    
    // Show next question or complete
    setTimeout(() => {
        currentQuestion.style.display = 'none';
        
        const contextQuestions = {
            routine: 3,
            goals: 3,
            interests: 3
        };
        
        if (contextStep < contextQuestions[type]) {
            document.getElementById(`contextQ${contextStep}`).style.display = 'block';
        } else {
            document.getElementById('contextComplete').style.display = 'block';
        }
        
        updateContextProgress(type);
    }, 800);
}

function updateContextProgress(type) {
    const totalQuestions = {
        routine: 3,
        goals: 3,
        interests: 3
    };
    
    const progress = (contextStep / totalQuestions[type]) * 100;
    const progressBar = document.getElementById('contextProgress');
    const stepSpan = document.getElementById('contextStep');
    
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (stepSpan) stepSpan.textContent = contextStep;
}

function finishContextGathering(type) {
    // Store context answers in user profile
    appState.userProfile[`${type}Context`] = contextAnswers[type];
    appState.trustLevel = Math.min(appState.trustLevel + 1, 4);
    
    // Reset context gathering state
    contextStep = 0;
    contextAnswers = {};
    
    // Generate new recommendations with enhanced context
    appState.recommendations = generateEnhancedRecommendations();
    showRecommendations();
}

function generateEnhancedRecommendations() {
    const baseRecs = recommendationEngine.generatePersonalizedRecommendations();
    const contextRecs = generateContextBasedRecommendations();
    
    // Combine and prioritize based on new context
    const allRecs = [...baseRecs, ...contextRecs];
    
    // Remove duplicates and take top 4
    const uniqueRecs = [];
    const seenTypes = new Set();
    
    for (const rec of allRecs) {
        if (!seenTypes.has(rec.type) && uniqueRecs.length < 4) {
            uniqueRecs.push(rec);
            seenTypes.add(rec.type);
        }
    }
    
    return uniqueRecs;
}

function generateContextBasedRecommendations() {
    const profile = appState.userProfile;
    const personality = appState.personality;
    const contextRecs = [];
    
    // Routine-based recommendations
    if (profile.routineContext) {
        const routine = profile.routineContext;
        
        if (routine[1] && routine[1].index === 0) { // Early morning productive
            contextRecs.push({
                text: "Use your early morning clarity for your most important task",
                context: `You're naturally productive in early morning - this is your power time`,
                icon: "🌅",
                type: "routine",
                id: "routine-morning-" + Date.now(),
                reasoning: "Matches your natural productivity rhythm",
                priority: "high"
            });
        }
        
        if (routine[2] && routine[2].index === 3) { // Creative evenings
            contextRecs.push({
                text: "Set aside evening time for a creative project that excites you",
                context: `Evening creativity time + ${personality} personality = perfect combination`,
                icon: "🎨",
                type: "routine",
                id: "routine-creative-" + Date.now(),
                reasoning: "Aligns with your preferred evening activities",
                priority: "medium"
            });
        }
    }
    
    // Goals-based recommendations
    if (profile.goalsContext) {
        const goals = profile.goalsContext;
        
        if (goals[0] && goals[0].index === 1) { // Learning new skills
            contextRecs.push({
                text: "Spend 20 minutes learning something that directly supports your skill goals",
                context: `Skill development + ${personality} approach = steady progress`,
                icon: "📚",
                type: "goals",
                id: "goals-learning-" + Date.now(),
                reasoning: "Supports your stated focus on learning new skills",
                priority: "high"
            });
        }
        
        if (goals[1] && goals[1].index === 0) { // Time management challenge
            contextRecs.push({
                text: "Practice the 'two-minute rule' - do anything that takes under 2 minutes immediately",
                context: `Time management improvement through small consistent actions`,
                icon: "⏰",
                type: "goals",
                id: "goals-time-" + Date.now(),
                reasoning: "Directly addresses your time management challenge",
                priority: "high"
            });
        }
    }
    
    // Interest-based recommendations
    if (profile.interestsContext) {
        const interests = profile.interestsContext;
        
        if (interests[0] && interests[0].index === 0) { // Creative pursuits
            contextRecs.push({
                text: "Start or continue a creative project that's been calling to you",
                context: `Creative flow + ${personality} energy = zone of genius`,
                icon: "✨",
                type: "interests",
                id: "interests-creative-" + Date.now(),
                reasoning: "Matches your natural interest in creative pursuits",
                priority: "medium"
            });
        }
        
        if (interests[1] && interests[1].index === 0) { // Psychology interest
            contextRecs.push({
                text: "Reflect on a recent interaction and what it revealed about human nature",
                context: `Your curiosity about human behavior + recent experiences = insights`,
                icon: "🧠",
                type: "interests",
                id: "interests-psychology-" + Date.now(),
                reasoning: "Engages your interest in psychology and human behavior",
                priority: "medium"
            });
        }
    }
    
    return contextRecs;
}

function getTrustDisplay() {
    const trustLevels = {
        1: "Basic",
        2: "Good", 
        3: "Deep",
        4: "Complete"
    };
    
    return trustLevels[appState.trustLevel] || "Building";
}// Show recommendations interface with better context and multiple recommendations
function showRecommendations() {
    const personality = personalities[appState.personality];
    
    // Generate fresh recommendations each time
    appState.recommendations = recommendationEngine.generatePersonalizedRecommendations();
    
    // If we only got one recommendation, generate more
    if (appState.recommendations.length < 3) {
        const additionalRecs = generateAdditionalRecommendations();
        appState.recommendations = [...appState.recommendations, ...additionalRecs];
    }
    
    document.getElementById('app').innerHTML = `
        <!-- Enhanced Context Strip -->
        <div class="context-strip">
            <div class="context-item">
                <div class="context-label">Your Location</div>
                <div class="context-value">${getLocationDisplay()}</div>
            </div>
            <div class="context-item">
                <div class="context-label">Right Now</div>
                <div class="context-value">${getTimeDisplay()}</div>
            </div>
            <div class="context-item">
                <div class="context-label">Understanding</div>
                <div class="context-value">${getTrustDisplay()}</div>
            </div>
        </div>
        
        <div class="recommendations-section fade-in">
            <div class="section-header">
                <h2 class="section-title" style="color: ${personality.theme.primary}">
                    Here's what I think you should do right now
                </h2>
                <p class="section-subtitle">
                    Based on your ${personality.title.toLowerCase()} personality, current energy, and what's happening around you
                </p>
            </div>
            
            ${appState.recommendations.map((rec, index) => `
                <div class="recommendation-card" data-rec-id="${rec.id}">
                    <div class="rec-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <span style="font-size: 0.8rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px;">
                            Recommendation ${index + 1}
                        </span>
                        <span style="font-size: 0.8rem; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${rec.priority} priority
                        </span>
                    </div>
                    <div class="rec-main">
                        <div class="rec-icon">${rec.icon}</div>
                        <div class="rec-content">
                            <h3 class="rec-title">${rec.text}</h3>
                            <p class="rec-context">${rec.context}</p>
                            <div class="rec-reasoning">
                                <i class="fas fa-brain" style="opacity: 0.6;"></i>
                                <span style="font-size: 0.8rem; opacity: 0.7;">Why now: ${rec.reasoning.replace(/_/g, ' ')}</span>
                            </div>
                        </div>
                    </div>
                    <div class="rec-feedback-enhanced">
                        <button class="feedback-btn love" onclick="giveDetailedFeedback('${rec.id}', 'love')">
                            ❤️ Love this
                        </button>
                        <button class="feedback-btn like" onclick="giveDetailedFeedback('${rec.id}', 'like')">
                            👍 Good idea
                        </button>
                        <button class="feedback-btn meh" onclick="giveDetailedFeedback('${rec.id}', 'meh')">
                            😐 Meh
                        </button>
                        <button class="feedback-btn nah" onclick="giveDetailedFeedback('${rec.id}', 'nah')">
                            👎 Not for me
                        </button>
                        <button class="feedback-btn already" onclick="giveDetailedFeedback('${rec.id}', 'already')">
                            ✅ I do this
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="action-buttons">
            <button class="btn btn-primary" onclick="getMoreRecommendations()">
                <i class="fas fa-refresh"></i>
                Give me different ideas
            </button>
            <button class="btn btn-secondary" onclick="showPersonalityResults()">
                <i class="fas fa-user"></i>
                Review my personality
            </button>
        </div>
    `;
}

// Generate additional recommendations to ensure we always have multiple options
function generateAdditionalRecommendations() {
    const personality = appState.personality;
    const profile = appState.userProfile;
    const additionalRecs = [];
    
    // Always include a mindfulness option
    additionalRecs.push({
        text: "Take 5 minutes to check in with yourself",
        context: `Your ${personality} mind benefits from occasional pause and reflection`,
        icon: "🧘",
        type: "mindfulness",
        id: "mindfulness-" + Date.now(),
        reasoning: "personality_based + self_awareness",
        priority: "medium"
    });
    
    // Energy-based recommendation
    const energyRec = getEnergyBasedRecommendation();
    if (energyRec) additionalRecs.push(energyRec);
    
    // Time-based recommendation
    const timeRec = getTimeBasedRecommendation();
    if (timeRec) additionalRecs.push(timeRec);
    
    // Location-based recommendation (if location available)
    if (appState.location) {
        const locationRec = getLocationBasedRecommendation();
        if (locationRec) additionalRecs.push(locationRec);
    }
    
    return additionalRecs;
}

function getEnergyBasedRecommendation() {
    const profile = appState.userProfile;
    const personality = appState.personality;
    
    if (profile.energyLevel?.value === 'high') {
        return {
            text: "Channel this energy into something meaningful",
            context: `High energy + ${personality} personality = perfect time for impact`,
            icon: "🚀",
            type: "energy",
            id: "energy-high-" + Date.now(),
            reasoning: "high_energy + personality_match",
            priority: "high"
        };
    } else if (profile.energyLevel?.value === 'low') {
        return {
            text: "Start with the smallest possible step",
            context: `Low energy doesn't mean no progress - your ${personality} side knows how to build momentum`,
            icon: "🌱",
            type: "energy",
            id: "energy-low-" + Date.now(),
            reasoning: "low_energy + momentum_building",
            priority: "high"
        };
    }
    return null;
}

function getTimeBasedRecommendation() {
    const time = appState.timeOfDay;
    const personality = appState.personality;
    
    const timeRecs = {
        morning: {
            text: "Set your intention for the day",
            context: `Morning clarity + ${personality} perspective = powerful day ahead`,
            icon: "🌅",
            reasoning: "morning_clarity + intention_setting"
        },
        afternoon: {
            text: "Take a midday energy audit",
            context: `Afternoon is perfect for ${personality} types to reassess and refocus`,
            icon: "☀️",
            reasoning: "afternoon_assessment + energy_check"
        },
        evening: {
            text: "Reflect on what went well today",
            context: `Evening reflection suits your ${personality} nature perfectly`,
            icon: "🌙",
            reasoning: "evening_reflection + personality_match"
        }
    };
    
    const rec = timeRecs[time];
    if (rec) {
        return {
            ...rec,
            type: "time",
            id: `time-${time}-` + Date.now(),
            priority: "medium"
        };
    }
    return null;
}

function getLocationBasedRecommendation() {
    const weather = appState.weather;
    const location = appState.location;
    
    if (weather === 'sunny') {
        return {
            text: "Step outside and soak in some natural light",
            context: `Sunny weather in ${location.city || 'your area'} is perfect for boosting mood and energy`,
            icon: "☀️",
            type: "location",
            id: "location-sunny-" + Date.now(),
            reasoning: "sunny_weather + location_opportunity",
            priority: "medium"
        };
    } else if (weather === 'rainy') {
        return {
            text: "Use this cozy weather for focused indoor work",
            context: `Rainy weather in ${location.city || 'your area'} creates the perfect atmosphere for concentration`,
            icon: "🌧️",
            type: "location",
            id: "location-rainy-" + Date.now(),
            reasoning: "rainy_weather + focus_opportunity",
            priority: "medium"
        };
    }
    return null;
}

// Enhanced context display functions with actual location usage
function getLocationDisplay() {
    if (appState.location && appState.location.city) {
        return `📍 ${appState.location.city}`;
    } else if (appState.permissions.location) {
        return "📍 Location detected";
    } else {
        return "📍 Enable location for local suggestions";
    }
}

function getTimeDisplay() {
    const weather = appState.weather || 'clear';
    const time = appState.timeOfDay;
    const temp = appState.location?.temperature ? `${Math.round(appState.location.temperature)}°` : '';
    
    return `${getWeatherEmoji(weather)} ${weather.charAt(0).toUpperCase() + weather.slice(1)} ${time}${temp ? ` • ${temp}` : ''}`;
}

function getWeatherEmoji(weather) {
    const emojis = {
        sunny: '☀️',
        clear: '🌤️',
        cloudy: '☁️',
        rainy: '🌧️',
        snow: '❄️'
    };
    return emojis[weather] || '🌤️';
}

// Generate better, more actionable recommendations
function generatePersonalizedRecommendations() {
    const profile = appState.userProfile;
    const personality = appState.personality;
    const location = appState.location;
    const weather = appState.weather;
    const time = appState.timeOfDay;
    const recommendations = [];
    
    // Primary recommendation based on strongest signals
    const primaryRec = generatePrimaryRecommendation();
    if (primaryRec) recommendations.push(primaryRec);
    
    // Location-based recommendation (using actual location data)
    if (location) {
        const locationRec = generateLocationSpecificRecommendation();
        if (locationRec) recommendations.push(locationRec);
    }
    
    // Energy and work-based recommendation
    const energyRec = generateEnergyWorkRecommendation();
    if (energyRec) recommendations.push(energyRec);
    
    // Time-sensitive recommendation
    const timeRec = generateTimeSensitiveRecommendation();
    if (timeRec) recommendations.push(timeRec);
    
    return recommendations.length > 0 ? recommendations : [getDefaultRecommendation()];
}

function generatePrimaryRecommendation() {
    const profile = appState.userProfile;
    const personality = appState.personality;
    const time = appState.timeOfDay;
    
    // High-impact combinations
    if (profile.workFeeling?.value === 'drain' && profile.energyLevel?.value === 'low') {
        return {
            text: "Take a 15-minute walk outside (or by a window)",
            context: "Low energy + work stress = your brain needs oxygen and perspective reset",
            icon: "🚶‍♀️",
            type: "recovery",
            id: "primary-recovery-" + Date.now(),
            reasoning: "Combines movement, fresh air, and mental break for maximum recovery",
            priority: "high",
            actionable: true
        };
    }
    
    if (profile.energyLevel?.value === 'high' && time === 'morning') {
        const personalityActions = {
            confident: "tackle the hardest thing on your list",
            open: "start that creative project you've been thinking about",
            stable: "organize something important for the week ahead",
            cautious: "research and plan your next big decision"
        };
        
        return {
            text: `Use this morning energy to ${personalityActions[personality]}`,
            context: `High morning energy + ${personality} personality = perfect time for meaningful progress`,
            icon: "⚡",
            type: "productivity",
            id: "primary-morning-" + Date.now(),
            reasoning: "Peak energy + personality strength + optimal timing",
            priority: "high",
            actionable: true
        };
    }
    
    return null;
}

function generateLocationSpecificRecommendation() {
    const location = appState.location;
    const weather = appState.weather;
    const time = appState.timeOfDay;
    
    if (!location) return null;
    
    // Use actual location data for specific suggestions
    if (weather === 'sunny' && time === 'morning') {
        return {
            text: `Find a sunny spot in ${location.city} for your next 30 minutes`,
            context: `Perfect ${weather} weather in ${location.city} - vitamin D and mood boost opportunity`,
            icon: "🌞",
            type: "location",
            id: "location-sunny-" + Date.now(),
            reasoning: `Current ${weather} conditions in your exact location`,
            priority: "medium",
            actionable: true
        };
    }
    
    if (weather === 'rainy') {
        return {
            text: `Embrace the cozy ${location.city} rain energy for focused work`,
            context: `Rainy ${location.city} weather creates perfect concentration atmosphere`,
            icon: "☔",
            type: "location",
            id: "location-rainy-" + Date.now(),
            reasoning: `Weather patterns in ${location.city} favor indoor focus`,
            priority: "medium",
            actionable: true
        };
    }
    
    return null;
}

function generateEnergyWorkRecommendation() {
    const profile = appState.userProfile;
    const personality = appState.personality;
    
    if (profile.workFeeling?.value === 'love' && profile.energyLevel?.value === 'high') {
        return {
            text: "Channel your work satisfaction into helping someone else",
            context: `You're energized by your work - share that positive energy with a colleague or mentee`,
            icon: "🤝",
            type: "social",
            id: "energy-work-positive-" + Date.now(),
            reasoning: "High work satisfaction + high energy = opportunity to multiply impact",
            priority: "medium",
            actionable: true
        };
    }
    
    if (profile.energyLevel?.value === 'ups-downs') {
        return {
            text: "Check your energy right now and choose the matching task",
            context: `Variable energy means working WITH your rhythms instead of against them`,
            icon: "🎢",
            type: "awareness",
            id: "energy-variable-" + Date.now(),
            reasoning: "Variable energy patterns require real-time energy-task matching",
            priority: "medium",
            actionable: true
        };
    }
    
    return null;
}

function generateTimeSensitiveRecommendation() {
    const time = appState.timeOfDay;
    const day = new Date().getDay(); // 0 = Sunday
    const personality = appState.personality;
    
    if (time === 'evening' && (day === 0 || day === 6)) { // Weekend evening
        return {
            text: "Prepare something small for Monday that your future self will thank you for",
            context: `Weekend evening + ${personality} planning = stress-free Monday start`,
            icon: "📋",
            type: "preparation",
            id: "time-weekend-prep-" + Date.now(),
            reasoning: "Weekend evening timing optimal for low-pressure Monday preparation",
            priority: "low",
            actionable: true
        };
    }
    
    if (time === 'afternoon' && day >= 1 && day <= 5) { // Weekday afternoon
        return {
            text: "Take 2 minutes to acknowledge what you've accomplished today",
            context: `${personality} personalities benefit from midday progress recognition`,
            icon: "✅",
            type: "reflection",
            id: "time-midday-reflection-" + Date.now(),
            reasoning: "Weekday afternoon timing perfect for motivation boost",
            priority: "low",
            actionable: true
        };
    }
    
    return null;
}

function getDefaultRecommendation() {
    return {
        text: "Take 3 conscious breaths and ask yourself: what do I actually need right now?",
        context: "Sometimes the best action is checking in with yourself first",
        icon: "🫁",
        type: "mindfulness",
        id: "default-checkin-" + Date.now(),
        reasoning: "Default self-awareness check when no strong signals available",
        priority: "medium",
        actionable: true
    };
}

// Get more recommendations with variety
function getMoreRecommendations() {
    // Clear previous feedback to generate fresh recommendations
    recommendationEngine.userFeedback = {};
    
    // Generate completely new recommendations
    const newRecs = recommendationEngine.generateMoreRecommendations();
    const additionalRecs = generateAdditionalRecommendations();
    
    // Combine and ensure we have 3-4 different recommendations
    const allRecs = [...newRecs, ...additionalRecs];
    
    // Remove duplicates by type and take up to 4
    const uniqueRecs = [];
    const seenTypes = new Set();
    
    for (const rec of allRecs) {
        if (!seenTypes.has(rec.type) && uniqueRecs.length < 4) {
            uniqueRecs.push(rec);
            seenTypes.add(rec.type);
        }
    }
    
    // If we still don't have enough, add some personality-specific ones
    if (uniqueRecs.length < 3) {
        const personalityRecs = getPersonalitySpecificRecommendations();
        uniqueRecs.push(...personalityRecs.slice(0, 4 - uniqueRecs.length));
    }
    
    appState.recommendations = uniqueRecs;
    showRecommendations();
}

function getPersonalitySpecificRecommendations() {
    const personality = appState.personality;
    const personalityRecs = {
        confident: [
            {
                text: "Take on a challenge that excites you",
                context: "Your confident nature thrives on meaningful challenges",
                icon: "🎯",
                type: "challenge",
                id: "confident-challenge-" + Date.now(),
                reasoning: "personality_strength + challenge_seeking",
                priority: "high"
            },
            {
                text: "Share your expertise with someone who could benefit",
                context: "Confident personalities grow by helping others grow",
                icon: "🤝",
                type: "sharing",
                id: "confident-share-" + Date.now(),
                reasoning: "personality_strength + knowledge_sharing",
                priority: "medium"
            }
        ],
        open: [
            {
                text: "Explore something completely new and unfamiliar",
                context: "Your open nature feeds on novel experiences and fresh perspectives",
                icon: "🔍",
                type: "exploration",
                id: "open-explore-" + Date.now(),
                reasoning: "personality_strength + novelty_seeking",
                priority: "high"
            },
            {
                text: "Connect two unrelated ideas or projects",
                context: "Open personalities excel at finding unexpected connections",
                icon: "🌐",
                type: "connection",
                id: "open-connect-" + Date.now(),
                reasoning: "personality_strength + pattern_recognition",
                priority: "medium"
            }
        ],
        stable: [
            {
                text: "Strengthen a relationship that matters to you",
                context: "Your stable nature builds lasting, meaningful connections",
                icon: "💝",
                type: "relationship",
                id: "stable-relationship-" + Date.now(),
                reasoning: "personality_strength + relationship_building",
                priority: "high"
            },
            {
                text: "Organize something that's been bothering you",
                context: "Stable personalities find peace through creating order and systems",
                icon: "📋",
                type: "organization",
                id: "stable-organize-" + Date.now(),
                reasoning: "personality_strength + system_building",
                priority: "medium"
            }
        ],
        cautious: [
            {
                text: "Research something you've been curious about",
                context: "Your cautious nature appreciates thorough understanding before action",
                icon: "📚",
                type: "research",
                id: "cautious-research-" + Date.now(),
                reasoning: "personality_strength + knowledge_gathering",
                priority: "high"
            },
            {
                text: "Plan your next important decision step by step",
                context: "Cautious personalities make better decisions with proper planning",
                icon: "🗺️",
                type: "planning",
                id: "cautious-plan-" + Date.now(),
                reasoning: "personality_strength + decision_planning",
                priority: "medium"
            }
        ]
    };
    
    return personalityRecs[personality] || [];
}

// Finish onboarding and generate recommendations
function finishOnboarding() {
    appState.trustLevel = 3;
    onboardingStep = 1; // Reset for next time
    
    // Generate initial recommendations
    appState.recommendations = recommendationEngine.generatePersonalizedRecommendations();
    
    // Ensure we have multiple recommendations
    if (appState.recommendations.length < 3) {
        const additionalRecs = generateAdditionalRecommendations();
        appState.recommendations = [...appState.recommendations, ...additionalRecs];
    }
    
    showRecommendations();
}// BohemR Main Application Logic

// Global App State
let appState = {
    currentQuestion: 0,
    answers: {},
    personality: null,
    personalityScores: {},
    trustLevel: 1,
    weather: null,
    location: null,
    timeOfDay: 'morning',
    dayOfWeek: 'monday',
    recommendations: [],
    userFeedback: {},
    userProfile: {},
    calendarEvents: [],
    permissions: {
        location: false,
        notifications: false,
        calendar: false
    }
};

// Global instances
let personalityEngine;
let recommendationEngine;

// Initialize the application
function initApp() {
    // Initialize engines
    personalityEngine = new PersonalityEngine();
    recommendationEngine = new RecommendationEngine();
    
    // Set initial state
    appState.timeOfDay = detectTimeOfDay();
    appState.dayOfWeek = detectDayOfWeek();
    
    // Create visual effects
    createParticles();
    
    // Check initial permissions
    permissionManager.checkInitialPermissions();
    
    // Start with weather fetch
    if (appState.permissions.location) {
        permissionManager.requestLocationPermission();
    } else {
        permissionManager.fetchWeather();
    }
    
    // Start the assessment
    renderQuestion();
    
    if (CONFIG.APP.DEBUG) {
        console.log('BohemR initialized:', appState);
    }
}

// Detect time of day
function detectTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
}

// Detect day of week
function detectDayOfWeek() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
}

// Create floating particles for sci-fi effect
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 25;
    
    // Clear existing particles
    container.innerHTML = '';
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 6 + 3;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = Math.random() * 6 + 6;
        
        const colors = ['#4ECDC4', '#667eea', '#FF6B6B', '#FFD93D', '#A8E6CF'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            background: ${color};
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
        `;
        
        container.appendChild(particle);
    }
}

// Render current question
function renderQuestion() {
    const question = personalityEngine.getCurrentQuestion();
    if (!question) return;
    
    document.getElementById('app').innerHTML = `
        <div class="assessment-card glass-strong slide-up">
            <div class="progress-constellation">
                ${Array.from({length: 5}, (_, i) => `
                    <div class="progress-star ${i < appState.currentQuestion ? 'active' : ''} ${i === appState.currentQuestion ? 'current' : ''}"></div>
                `).join('')}
            </div>
            
            <div class="question-section">
                <h2 class="question-text">${question.text}</h2>
                <p class="question-subtitle">${question.subtitle}</p>
            </div>
            
            <div class="options-container">
                <div class="options-grid">
                    ${question.options.map((option, index) => `
                        <div class="option-card" onclick="selectOption(${index})" ontouchstart="">
                            <span class="option-metaphor">${option.metaphor}</span>
                            <h3 class="option-title">${option.title}</h3>
                            <p class="option-description">${option.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Handle option selection with multi-layer feedback
function selectOption(optionIndex) {
    const question = personalityEngine.getCurrentQuestion();
    const selectedOption = question.options[optionIndex];
    
    // Immediate visual feedback
    const optionCards = document.querySelectorAll('.option-card');
    const selectedCard = optionCards[optionIndex];
    selectedCard.classList.add('tapped');
    
    // Layer 1: Instant personality insight (3 seconds)
    showInstantInsight(selectedOption);
    
    // Layer 2: Choice confirmation (2 seconds)
    showFeedbackMessage(selectedOption);
    
    // Layer 3: Record answer and advance
    setTimeout(() => {
        const answer = personalityEngine.recordAnswer(optionIndex);
        appState.answers = personalityEngine.answers;
        appState.currentQuestion = personalityEngine.currentQuestion;
        
        // Visual effects
        addMultiLayerEffect(selectedOption.personality);
        
        // Check if assessment complete
        if (personalityEngine.isComplete()) {
            setTimeout(() => {
                const result = personalityEngine.calculatePersonality();
                showPersonalityResults();
            }, 1500);
        } else {
            setTimeout(() => {
                renderQuestion();
                previewNextQuestion();
            }, 1200);
        }
    }, 1500);
}

// Show instant insight overlay
function showInstantInsight(option) {
    const insights = {
        confident: "⚡ Bold choice! You're a natural action-taker",
        open: "🌈 Interesting! You see possibilities everywhere", 
        stable: "🛡️ Wise choice! You value harmony and stability",
        cautious: "🧭 Thoughtful! You prefer to understand before acting"
    };
    
    const insightDiv = document.createElement('div');
    insightDiv.className = 'insight-preview show';
    insightDiv.innerHTML = `
        <div class="insight-title">${option.title}</div>
        <div class="insight-description">${insights[option.personality]}</div>
    `;
    
    document.body.appendChild(insightDiv);
    
    setTimeout(() => {
        insightDiv.classList.remove('show');
        setTimeout(() => insightDiv.remove(), 600);
    }, 3000);
}

// Show feedback message
function showFeedbackMessage(option) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'instant-feedback';
    feedbackDiv.textContent = `${option.metaphor} ${option.title}`;
    
    document.body.appendChild(feedbackDiv);
    setTimeout(() => feedbackDiv.remove(), 2000);
}

// Add multi-layer particle effects
function addMultiLayerEffect(personality) {
    const container = document.getElementById('particles');
    const colors = {
        confident: ['#FF6B35', '#F7931E'],
        open: ['#4ECDC4', '#44A08D'], 
        stable: ['#6C5CE7', '#A29BFE'],
        cautious: ['#00B894', '#00CEC9']
    };
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        const color = colors[personality][Math.floor(Math.random() * 2)];
        
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 10 + 6}px;
            height: ${Math.random() * 10 + 6}px;
            background: ${color};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: slowPersonalityBurst 2.5s ease-out forwards;
            pointer-events: none;
            box-shadow: 0 0 15px ${color};
        `;
        
        container.appendChild(particle);
        setTimeout(() => particle.remove(), 2500);
    }
}

// Preview next question progress
function previewNextQuestion() {
    const progressStars = document.querySelectorAll('.progress-star');
    progressStars.forEach((star, index) => {
        if (index <= appState.currentQuestion) {
            setTimeout(() => {
                star.style.background = 'linear-gradient(45deg, #4ECDC4, #44A08D)';
                star.style.boxShadow = '0 0 20px rgba(78, 205, 196, 0.6)';
                star.style.transform = 'scale(1.2)';
            }, index * 200);
        }
    });
}

// Show personality results with correction mechanism
function showPersonalityResults() {
    const personality = personalities[appState.personality];
    const scores = appState.personalityScores;
    
    document.getElementById('app').innerHTML = `
        <div class="personality-reveal glass-strong fade-in">
            <div class="personality-avatar" style="background: ${personality.theme.gradient}">
                ${personality.icon}
            </div>
            <h2 class="personality-title" style="color: ${personality.theme.primary}">
                ${personality.title}
            </h2>
            <p class="personality-insight">${personality.insight}</p>
            
            <!-- Personality Scores Breakdown -->
            <div class="personality-breakdown" style="margin: 25px 0;">
                <h3 style="margin-bottom: 15px; font-size: 1.1rem; opacity: 0.9;">Your personality mix:</h3>
                ${Object.entries(scores).map(([type, score]) => `
                    <div class="score-bar" style="margin-bottom: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                            <span style="font-size: 0.9rem;">${personalities[type].icon} ${personalities[type].title.replace('The ', '')}</span>
                            <span style="font-size: 0.9rem; font-weight: 600;">${score}%</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px; overflow: hidden;">
                            <div style="background: ${personalities[type].theme.primary}; height: 100%; width: ${score}%; transition: width 0.8s ease;"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Does this feel right? -->
            <div class="accuracy-check" style="margin: 30px 0; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 16px;">
                <h3 style="margin-bottom: 15px; color: ${personality.theme.primary};">Does this feel accurate?</h3>
                <div class="accuracy-buttons" style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="choice-btn" onclick="confirmAccuracy('perfect')" style="flex: 1; min-width: 140px;">
                        🎯 Spot on!
                    </button>
                    <button class="choice-btn" onclick="confirmAccuracy('mostly')" style="flex: 1; min-width: 140px;">
                        👍 Mostly accurate
                    </button>
                    <button class="choice-btn" onclick="confirmAccuracy('somewhat')" style="flex: 1; min-width: 140px;">
                        🤔 Somewhat accurate
                    </button>
                    <button class="choice-btn" onclick="confirmAccuracy('wrong')" style="flex: 1; min-width: 140px;">
                        ❌ Not me at all
                    </button>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="showFeedbackForm()">
                    <i class="fas fa-heart"></i>
                    Tell me more about you
                </button>
                <button class="btn btn-secondary" onclick="retakeAssessment()">
                    <i class="fas fa-redo"></i>
                    Take assessment again
                </button>
            </div>
        </div>
    `;
}

// Handle accuracy confirmation
function confirmAccuracy(level) {
    appState.personalityAccuracy = level;
    
    // Visual feedback
    const buttons = document.querySelectorAll('.accuracy-buttons .choice-btn');
    buttons.forEach(btn => {
        btn.style.background = 'rgba(255, 255, 255, 0.1)';
        btn.style.opacity = '0.6';
    });
    
    event.target.style.background = 'rgba(78, 205, 196, 0.3)';
    event.target.style.borderColor = '#4ECDC4';
    event.target.style.opacity = '1';
    
    if (level === 'wrong') {
        // Show alternative personality options
        setTimeout(() => showPersonalityCorrection(), 500);
    } else if (level === 'perfect' || level === 'mostly') {
        appState.trustLevel = 3;
        // Auto-advance to onboarding after 1 second
        setTimeout(() => showFeedbackForm(), 1000);
    } else {
        // Somewhat accurate - proceed but with lower trust
        appState.trustLevel = 2;
        setTimeout(() => showFeedbackForm(), 1000);
    }
}

// Show personality correction interface
function showPersonalityCorrection() {
    const currentPersonality = appState.personality;
    const otherPersonalities = Object.keys(personalities).filter(p => p !== currentPersonality);
    
    document.getElementById('app').innerHTML = `
        <div class="personality-correction glass-strong fade-in">
            <h2 style="color: #4ECDC4; margin-bottom: 20px; text-align: center;">
                Let's find your real personality type
            </h2>
            <p style="opacity: 0.8; text-align: center; margin-bottom: 30px;">
                Which of these feels more like you?
            </p>
            
            <div class="personality-options">
                ${otherPersonalities.map(type => {
                    const p = personalities[type];
                    return `
                        <div class="personality-option" onclick="selectCorrectedPersonality('${type}')" style="
                            padding: 20px; 
                            margin-bottom: 15px; 
                            background: rgba(255,255,255,0.08); 
                            border: 2px solid rgba(255,255,255,0.15); 
                            border-radius: 16px; 
                            cursor: pointer; 
                            transition: all 0.3s ease;
                        ">
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <div style="font-size: 2rem;">${p.icon}</div>
                                <div style="flex: 1;">
                                    <h3 style="color: ${p.theme.primary}; margin-bottom: 8px;">${p.title}</h3>
                                    <p style="opacity: 0.8; font-size: 0.9rem; line-height: 1.4;">${p.insight.substring(0, 120)}...</p>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-secondary" onclick="retakeAssessment()">
                    <i class="fas fa-redo"></i>
                    Take the assessment again instead
                </button>
            </div>
        </div>
    `;
    
    // Add hover effects
    const options = document.querySelectorAll('.personality-option');
    options.forEach(option => {
        option.addEventListener('mouseenter', () => {
            option.style.background = 'rgba(255,255,255,0.12)';
            option.style.borderColor = 'rgba(255,255,255,0.3)';
        });
        option.addEventListener('mouseleave', () => {
            option.style.background = 'rgba(255,255,255,0.08)';
            option.style.borderColor = 'rgba(255,255,255,0.15)';
        });
    });
}

// Handle corrected personality selection
function selectCorrectedPersonality(newPersonality) {
    appState.personality = newPersonality;
    appState.personalityAccuracy = 'corrected';
    appState.trustLevel = 2;
    
    // Visual feedback
    event.target.style.background = 'rgba(78, 205, 196, 0.3)';
    event.target.style.borderColor = '#4ECDC4';
    
    setTimeout(() => {
        // Recalculate personality scores for the corrected type
        appState.personalityScores = {
            [newPersonality]: 75,
            ...Object.fromEntries(
                Object.keys(personalities).filter(p => p !== newPersonality)
                    .map(p => [p, Math.floor(Math.random() * 25)])
            )
        };
        
        showPersonalityResults();
    }, 800);
}

// Show progressive onboarding form with clear progress
function showFeedbackForm() {
    const personality = personalities[appState.personality];
    
    document.getElementById('app').innerHTML = `
        <div class="progressive-onboarding glass-strong fade-in">
            <div class="onboarding-header" style="text-align: center; margin-bottom: 30px;">
                <h2 class="section-title" style="color: ${personality.theme.primary}; margin-bottom: 15px;">
                    Let's personalize your experience
                </h2>
                <p style="opacity: 0.8; font-size: 0.95rem; margin-bottom: 20px;">
                    Just 3 quick questions - no typing required!
                </p>
                
                <!-- Progress Bar -->
                <div class="progress-bar-container" style="background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px; margin-bottom: 10px; overflow: hidden;">
                    <div class="progress-bar" id="onboardingProgress" style="background: ${personality.theme.primary}; height: 100%; width: 0%; transition: width 0.5s ease;"></div>
                </div>
                <p style="font-size: 0.8rem; opacity: 0.6;">
                    Question <span id="currentStep">0</span> of 3
                </p>
            </div>
            
            <div class="onboarding-step" id="step1">
                <div class="feedback-card">
                    <div class="feedback-question">How do you feel about your current work/study situation?</div>
                    <div class="choice-grid">
                        <button class="choice-btn" onclick="selectChoice('workFeeling', 'love', '🔥 Love it! It energizes me')">
                            🔥 Love it! It energizes me
                        </button>
                        <button class="choice-btn" onclick="selectChoice('workFeeling', 'like', '👍 Pretty good, mostly satisfied')">
                            👍 Pretty good, mostly satisfied
                        </button>
                        <button class="choice-btn" onclick="selectChoice('workFeeling', 'meh', '😐 It pays the bills')">
                            😐 It pays the bills
                        </button>
                        <button class="choice-btn" onclick="selectChoice('workFeeling', 'drain', '😩 It drains my soul')">
                            😩 It drains my soul
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="onboarding-step" id="step2" style="display: none;">
                <div class="feedback-card">
                    <div class="feedback-question">What's your energy like most days?</div>
                    <div class="choice-grid">
                        <button class="choice-btn" onclick="selectChoice('energyLevel', 'high', '⚡ High energy, ready for anything')">
                            ⚡ High energy, ready for anything
                        </button>
                        <button class="choice-btn" onclick="selectChoice('energyLevel', 'steady', '🌱 Steady, consistent energy')">
                            🌱 Steady, consistent energy
                        </button>
                        <button class="choice-btn" onclick="selectChoice('energyLevel', 'ups-downs', '🎢 Ups and downs throughout the day')">
                            🎢 Ups and downs throughout the day
                        </button>
                        <button class="choice-btn" onclick="selectChoice('energyLevel', 'low', '😴 Often tired or low energy')">
                            😴 Often tired or low energy
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="onboarding-step" id="step3" style="display: none;">
                <div class="feedback-card">
                    <div class="feedback-question">When you have free time, you usually want to...</div>
                    <div class="choice-grid">
                        <button class="choice-btn" onclick="selectChoice('freeTime', 'active', '🏃 Do something active or challenging')">
                            🏃 Do something active or challenging
                        </button>
                        <button class="choice-btn" onclick="selectChoice('freeTime', 'social', '👥 Connect with people I care about')">
                            👥 Connect with people I care about
                        </button>
                        <button class="choice-btn" onclick="selectChoice('freeTime', 'create', '🎨 Create or explore something new')">
                            🎨 Create or explore something new
                        </button>
                        <button class="choice-btn" onclick="selectChoice('freeTime', 'recharge', '🛋️ Relax and recharge my batteries')">
                            🛋️ Relax and recharge my batteries
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="onboarding-complete" id="stepComplete" style="display: none;">
                <div style="text-align: center; padding: 30px;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">✨</div>
                    <h3 style="color: ${personality.theme.primary}; margin-bottom: 15px;">Perfect! I understand you much better now.</h3>
                    <p style="opacity: 0.8; margin-bottom: 30px;">
                        Let me create personalized recommendations based on who you are and what you need right now.
                    </p>
                    <button class="btn btn-primary" onclick="finishOnboarding()">
                        <i class="fas fa-magic"></i>
                        Show me what I should do now!
                    </button>
                </div>
            </div>
        </div>
    `;
    
    updateOnboardingProgress();
}

// Track onboarding progress
let onboardingStep = 1;

function selectChoice(category, value, text) {
    appState.userProfile[category] = { value, text };
    
    // Visual feedback for selection
    const currentStepElement = document.getElementById(`step${onboardingStep}`);
    const buttons = currentStepElement.querySelectorAll('.choice-btn');
    buttons.forEach(btn => {
        btn.style.background = 'rgba(255, 255, 255, 0.1)';
        btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        btn.style.opacity = '0.6';
    });
    
    event.target.style.background = 'rgba(78, 205, 196, 0.3)';
    event.target.style.borderColor = '#4ECDC4';
    event.target.style.opacity = '1';
    
    // Show immediate feedback
    const feedbackDiv = document.createElement('div');
    feedbackDiv.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: rgba(78, 205, 196, 0.95); color: white; padding: 15px 25px;
        border-radius: 12px; font-weight: 600; z-index: 1000;
        animation: quickFade 1s ease-out forwards;
    `;
    feedbackDiv.textContent = 'Got it! 👍';
    document.body.appendChild(feedbackDiv);
    
    setTimeout(() => {
        feedbackDiv.remove();
        advanceOnboardingStep();
    }, 800);
    
    updateOnboardingProgress();
}

function advanceOnboardingStep() {
    // Hide current step
    document.getElementById(`step${onboardingStep}`).style.display = 'none';
    
    onboardingStep++;
    
    if (onboardingStep <= 3) {
        // Show next step
        document.getElementById(`step${onboardingStep}`).style.display = 'block';
        updateOnboardingProgress();
    } else {
        // Show completion
        document.getElementById('stepComplete').style.display = 'block';
        updateOnboardingProgress();
    }
}

function updateOnboardingProgress() {
    const answeredCount = Object.keys(appState.userProfile).filter(key => 
        ['workFeeling', 'energyLevel', 'freeTime'].includes(key)
    ).length;
    
    const progressBar = document.getElementById('onboardingProgress');
    const currentStepSpan = document.getElementById('currentStep');
    
    if (progressBar) {
        progressBar.style.width = `${(answeredCount / 3) * 100}%`;
    }
    
    if (currentStepSpan) {
        currentStepSpan.textContent = answeredCount;
    }
}

// Add quick fade animation
const quickFadeStyle = document.createElement('style');
quickFadeStyle.textContent = `
    @keyframes quickFade {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
    }
`;
document.head.appendChild(quickFadeStyle);

// Finish onboarding and show recommendations
function finishOnboarding() {
    appState.trustLevel = 3;
    appState.recommendations = recommendationEngine.generatePersonalizedRecommendations();
    showRecommendations();
}

// Show recommendations interface
function showRecommendations() {
    const personality = personalities[appState.personality];
    
    document.getElementById('app').innerHTML = `
        <div class="context-strip">
            <div class="context-item">
                <div class="context-label">Understanding</div>
                <div class="context-value">Deep</div>
            </div>
            <div class="context-item">
                <div class="context-label">Context</div>
                <div class="context-value">${appState.weather} ${appState.timeOfDay}</div>
            </div>
        </div>
        
        <div class="recommendations-section fade-in">
            <div class="section-header">
                <h2 class="section-title" style="color: ${personality.theme.primary}">
                    Based on who you are and where you're at right now
                </h2>
                <p class="section-subtitle">
                    These aren't random suggestions - they're designed specifically for you
                </p>
            </div>
            
            ${appState.recommendations.map(rec => `
                <div class="recommendation-card" data-rec-id="${rec.id}">
                    <div class="rec-main">
                        <div class="rec-icon">${rec.icon}</div>
                        <div class="rec-content">
                            <h3 class="rec-title">${rec.text}</h3>
                            <p class="rec-context">${rec.context}</p>
                            <div class="rec-reasoning">
                                <i class="fas fa-brain" style="opacity: 0.6;"></i>
                                <span style="font-size: 0.8rem; opacity: 0.7;">AI reasoning: ${rec.reasoning}</span>
                            </div>
                        </div>
                    </div>
                    <div class="rec-feedback-enhanced">
                        <button class="feedback-btn love" onclick="giveDetailedFeedback('${rec.id}', 'love')">
                            ❤️ Love this
                        </button>
                        <button class="feedback-btn like" onclick="giveDetailedFeedback('${rec.id}', 'like')">
                            👍 Good idea
                        </button>
                        <button class="feedback-btn meh" onclick="giveDetailedFeedback('${rec.id}', 'meh')">
                            😐 Meh
                        </button>
                        <button class="feedback-btn nah" onclick="giveDetailedFeedback('${rec.id}', 'nah')">
                            👎 Not for me
                        </button>
                        <button class="feedback-btn already" onclick="giveDetailedFeedback('${rec.id}', 'already')">
                            ✅ I do this
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="action-buttons">
            <button class="btn btn-primary" onclick="getMoreRecommendations()">
                <i class="fas fa-refresh"></i>
                More ideas for me
            </button>
            <button class="btn btn-secondary" onclick="showPersonalityResults()">
                <i class="fas fa-user"></i>
                About my personality
            </button>
        </div>
    `;
}

// Give detailed feedback on recommendations
function giveDetailedFeedback(recId, type) {
    const card = document.querySelector(`[data-rec-id="${recId}"]`);
    const buttons = card.querySelectorAll('.feedback-btn');
    buttons.forEach(btn => {
        btn.style.background = 'rgba(255, 255, 255, 0.1)';
        btn.style.opacity = '0.6';
    });
    
    // Highlight selected button
    const selectedBtn = card.querySelector(`button[onclick*="${type}"]`);
    const colors = {
        love: 'rgba(255, 20, 147, 0.4)',
        like: 'rgba(78, 205, 196, 0.4)',
        meh: 'rgba(255, 193, 7, 0.4)',
        nah: 'rgba(255, 107, 107, 0.4)',
        already: 'rgba(138, 43, 226, 0.4)'
    };
    
    selectedBtn.style.background = colors[type];
    selectedBtn.style.opacity = '1';
    selectedBtn.style.borderColor = colors[type].replace('0.4', '0.8');
    
    // Store feedback
    recommendationEngine.giveDetailedFeedback(recId, type);
    
    // Show follow-up question
    setTimeout(() => showFollowUpQuestion(recId, type), 500);
}

// Show follow-up question modal
function showFollowUpQuestion(recId, feedbackType) {
    const followUp = recommendationEngine.getFollowUpQuestions(feedbackType);
    if (!followUp) return;
    
    const [question, options] = followUp;
    showQuickFollowUp(recId, question, options, feedbackType);
}

// Show quick follow-up modal
function showQuickFollowUp(recId, question, options, originalFeedback) {
    const followUpDiv = document.createElement('div');
    followUpDiv.className = 'follow-up-overlay';
    followUpDiv.innerHTML = `
        <div class="follow-up-card glass-strong">
            <h3>${question}</h3>
            <div class="follow-up-options">
                ${options.map((option, index) => `
                    <button class="choice-btn small" onclick="recordFollowUp('${recId}', '${originalFeedback}', '${option}', ${index})">
                        ${option}
                    </button>
                `).join('')}
            </div>
            <button class="skip-btn" onclick="closeFollowUp()">Skip</button>
        </div>
    `;
    
    document.body.appendChild(followUpDiv);
}

// Record follow-up feedback
function recordFollowUp(recId, originalFeedback, followUpText, optionIndex) {
    const learningValue = recommendationEngine.calculateLearningValue(originalFeedback, optionIndex);
    
    // Update the stored feedback with follow-up data
    if (recommendationEngine.userFeedback[recId]) {
        recommendationEngine.userFeedback[recId].followUp = {
            text: followUpText,
            index: optionIndex,
            learningValue: learningValue
        };
    }
    
    // This is where ML would learn specific patterns
    if (CONFIG.APP.DEBUG) {
        console.log('Learning from detailed feedback:', {
            recommendation: appState.recommendations.find(r => r.id === recId),
            feedback: recommendationEngine.userFeedback[recId],
            userProfile: appState.userProfile,
            permissions: appState.permissions
        });
    }
    
    closeFollowUp();
    
    // Send notification about learning if notifications are enabled
    if (appState.permissions.notifications) {
        permissionManager.sendNotification(
            'Thanks for the feedback!',
            'I\'m learning what works best for you',
            { type: 'feedback_received' }
        );
    }
}

// Close follow-up modal
function closeFollowUp() {
    const followUp = document.querySelector('.follow-up-overlay');
    if (followUp) followUp.remove();
}

// Get more recommendations based on feedback
function getMoreRecommendations() {
    appState.recommendations = recommendationEngine.generateMoreRecommendations();
    showRecommendations();
}

// Restart the entire assessment
function retakeAssessment() {
    // Reset all state
    appState.currentQuestion = 0;
    appState.answers = {};
    appState.personality = null;
    appState.personalityScores = {};
    appState.trustLevel = 1;
    appState.recommendations = [];
    appState.userFeedback = {};
    appState.userProfile = {};
    
    // Reset engines
    personalityEngine.reset();
    recommendationEngine.reset();
    
    // Update time context
    appState.timeOfDay = detectTimeOfDay();
    appState.dayOfWeek = detectDayOfWeek();
    
    // Start over
    renderQuestion();
}

// Send personalized notification (if permission granted)
function sendPersonalizedNotification(title, body, data = {}) {
    if (appState.permissions.notifications) {
        permissionManager.sendNotification(title, body, data);
    }
}

// Schedule reminders based on user patterns
function schedulePersonalizedReminders() {
    if (!appState.permissions.notifications) return;
    
    const personality = appState.personality;
    const profile = appState.userProfile;
    
    // Example: Send energy check reminder based on energy patterns
    if (profile.energyLevel?.value === 'ups-downs') {
        // Schedule reminder in 2 hours to check energy
        setTimeout(() => {
            sendPersonalizedNotification(
                'Energy check-in',
                `How's your energy right now? Your ${personality} personality benefits from regular check-ins.`,
                { type: 'energy_reminder' }
            );
        }, 2 * 60 * 60 * 1000); // 2 hours
    }
}

// Handle app visibility changes (for analytics and state management)
function handleVisibilityChange() {
    if (document.hidden) {
        // App went to background
        if (CONFIG.APP.DEBUG) {
            console.log('App backgrounded');
        }
    } else {
        // App came to foreground
        if (CONFIG.APP.DEBUG) {
            console.log('App foregrounded');
        }
        
        // Update time context
        appState.timeOfDay = detectTimeOfDay();
        appState.dayOfWeek = detectDayOfWeek();
        
        // Refresh weather if location permission granted
        if (appState.permissions.location && appState.location) {
            permissionManager.fetchWeatherByLocation(
                appState.location.lat, 
                appState.location.lng
            );
        }
    }
}

// Save app state to local storage (for session persistence)
function saveAppState() {
    try {
        const stateToSave = {
            personality: appState.personality,
            personalityScores: appState.personalityScores,
            userProfile: appState.userProfile,
            permissions: appState.permissions,
            userFeedback: recommendationEngine.userFeedback,
            learningPatterns: recommendationEngine.learningPatterns,
            timestamp: Date.now()
        };
        
        localStorage.setItem('bohemr_state', JSON.stringify(stateToSave));
        
        if (CONFIG.APP.DEBUG) {
            console.log('App state saved');
        }
    } catch (error) {
        console.log('Failed to save app state:', error);
    }
}

// Load app state from local storage
function loadAppState() {
    try {
        const savedState = localStorage.getItem('bohemr_state');
        if (!savedState) return false;
        
        const state = JSON.parse(savedState);
        
        // Only load if not too old (24 hours)
        const dayInMs = 24 * 60 * 60 * 1000;
        if (Date.now() - state.timestamp > dayInMs) {
            localStorage.removeItem('bohemr_state');
            return false;
        }
        
        // Restore relevant state
        if (state.personality) {
            appState.personality = state.personality;
            appState.personalityScores = state.personalityScores || {};
            appState.userProfile = state.userProfile || {};
            appState.permissions = { ...appState.permissions, ...state.permissions };
            
            if (recommendationEngine) {
                recommendationEngine.userFeedback = state.userFeedback || {};
                recommendationEngine.learningPatterns = state.learningPatterns || {};
            }
            
            if (CONFIG.APP.DEBUG) {
                console.log('App state loaded:', state);
            }
            
            return true;
        }
    } catch (error) {
        console.log('Failed to load app state:', error);
        localStorage.removeItem('bohemr_state');
    }
    
    return false;
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved state first
    const hasPersistedState = loadAppState();
    
    if (hasPersistedState && appState.personality) {
        // User has completed assessment before, go to recommendations
        personalityEngine = new PersonalityEngine();
        recommendationEngine = new RecommendationEngine();
        
        // Set up UI
        createParticles();
        permissionManager.checkInitialPermissions();
        
        // Generate fresh recommendations
        appState.recommendations = recommendationEngine.generatePersonalizedRecommendations();
        showRecommendations();
        
        // Schedule reminders
        schedulePersonalizedReminders();
    } else {
        // Fresh start
        initApp();
    }
    
    // Set up event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Save state periodically
    setInterval(saveAppState, 5 * 60 * 1000); // Every 5 minutes
    
    // Save state on page unload
    window.addEventListener('beforeunload', saveAppState);
});

// Handle service worker registration for PWA
if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                if (CONFIG.APP.DEBUG) {
                    console.log('ServiceWorker registration successful');
                }
            })
            .catch(function(err) {
                if (CONFIG.APP.DEBUG) {
                    console.log('ServiceWorker registration failed: ', err);
                }
            });
    });
}

// Export key functions for testing
if (CONFIG.APP.DEBUG) {
    window.appState = appState;
    window.personalityEngine = personalityEngine;
    window.recommendationEngine = recommendationEngine;
    window.saveAppState = saveAppState;
    window.loadAppState = loadAppState;
}