// BohemR Main Application Logic

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

// Show personality results
function showPersonalityResults() {
    const personality = personalities[appState.personality];
    
    document.getElementById('app').innerHTML = `
        <div class="personality-reveal glass-strong fade-in">
            <div class="personality-avatar" style="background: ${personality.theme.gradient}">
                ${personality.icon}
            </div>
            <h2 class="personality-title" style="color: ${personality.theme.primary}">
                ${personality.title}
            </h2>
            <p class="personality-insight">${personality.insight}</p>
            
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="showFeedbackForm()">
                    <i class="fas fa-heart"></i>
                    Tell me more about you
                </button>
                <button class="btn btn-secondary" onclick="showRecommendations()">
                    <i class="fas fa-compass"></i>
                    What should I do now?
                </button>
            </div>
        </div>
    `;
}

// Show progressive onboarding form
function showFeedbackForm() {
    const personality = personalities[appState.personality];
    
    document.getElementById('app').innerHTML = `
        <div class="progressive-onboarding glass-strong fade-in">
            <h2 class="section-title" style="color: ${personality.theme.primary}; margin-bottom: 20px;">
                Quick questions to personalize your experience
            </h2>
            <p style="opacity: 0.8; text-align: center; margin-bottom: 30px; font-size: 0.95rem;">
                Just tap what fits - no typing needed!
            </p>
            
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
            
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="finishOnboarding()" id="continueBtn" style="opacity: 0.5; pointer-events: none;">
                    <i class="fas fa-magic"></i>
                    Show me what I should do now! (<span id="answerCount">0</span>/3)
                </button>
            </div>
        </div>
    `;
}

// Handle choice selection in onboarding
function selectChoice(category, value, text) {
    appState.userProfile[category] = { value, text };
    
    // Visual feedback
    const buttons = document.querySelectorAll(`button[onclick*="${category}"]`);
    buttons.forEach(btn => {
        btn.style.background = 'rgba(255, 255, 255, 0.1)';
        btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    });
    
    event.target.style.background = 'rgba(78, 205, 196, 0.3)';
    event.target.style.borderColor = '#4ECDC4';
    
    // Update progress
    const answeredCount = Object.keys(appState.userProfile).filter(key => 
        ['workFeeling', 'energyLevel', 'freeTime'].includes(key)
    ).length;
    
    document.getElementById('answerCount').textContent = answeredCount;
    
    if (answeredCount >= 3) {
        const continueBtn = document.getElementById('continueBtn');
        continueBtn.style.opacity = '1';
        continueBtn.style.pointerEvents = 'auto';
    }
}

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