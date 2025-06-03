// BohemR Intelligent Recommendation Engine

class RecommendationEngine {
    constructor() {
        this.userFeedback = {};
        this.learningPatterns = {};
    }
    
    // Generate personalized recommendations based on onboarding
    generatePersonalizedRecommendations() {
        const profile = appState.userProfile;
        const personality = appState.personality;
        const recommendations = [];
        
        // Work-based recommendations
        if (profile.workFeeling?.value === 'drain') {
            recommendations.push({
                text: "Take a 10-minute 'mental reset' break",
                context: `Since work is draining you, your ${personality} personality needs micro-recovery moments`,
                icon: "🌸",
                type: "recovery",
                id: "work-reset-" + Date.now(),
                reasoning: "work_drain + personality_recharge_need",
                priority: "high"
            });
        } else if (profile.workFeeling?.value === 'love') {
            recommendations.push({
                text: "Channel your work energy into a passion project",
                context: `Your work satisfaction + ${personality} drive = perfect time for growth`,
                icon: "🚀",
                type: "growth",
                id: "passion-project-" + Date.now(),
                reasoning: "work_satisfaction + high_energy",
                priority: "medium"
            });
        }
        
        // Energy-based recommendations
        if (profile.energyLevel?.value === 'high' && appState.timeOfDay === 'morning') {
            recommendations.push({
                text: "Tackle your most important goal right now",
                context: `High energy + morning + ${personality} personality = your power hour`,
                icon: "⚡",
                type: "productivity",
                id: "power-hour-" + Date.now(),
                reasoning: "high_energy + morning_time + personality_match",
                priority: "high"
            });
        } else if (profile.energyLevel?.value === 'low') {
            recommendations.push({
                text: "Try the '2-minute rule' - just start something tiny",
                context: `Low energy doesn't mean no progress - your ${personality} side can build momentum`,
                icon: "🌱",
                type: "momentum",
                id: "tiny-start-" + Date.now(),
                reasoning: "low_energy + momentum_building",
                priority: "medium"
            });
        } else if (profile.energyLevel?.value === 'ups-downs') {
            recommendations.push({
                text: "Check in with your energy - what does it need right now?",
                context: `Your variable energy + ${personality} awareness = smart self-management`,
                icon: "🎢",
                type: "awareness",
                id: "energy-check-" + Date.now(),
                reasoning: "variable_energy + self_awareness",
                priority: "medium"
            });
        }
        
        // Free time preference recommendations
        if (profile.freeTime?.value === 'social' && appState.weather === 'sunny') {
            recommendations.push({
                text: "Reach out to someone you've been thinking about",
                context: `Sunny weather + your social preference + ${personality} personality = connection time`,
                icon: "💝",
                type: "social",
                id: "reach-out-" + Date.now(),
                reasoning: "social_preference + weather_boost",
                priority: "high"
            });
        } else if (profile.freeTime?.value === 'create') {
            const weatherBoost = appState.weather === 'rainy' ? ' + rainy day inspiration' : '';
            recommendations.push({
                text: "Start that creative thing you've been putting off",
                context: `Your creative energy + ${personality} personality${weatherBoost} = breakthrough potential`,
                icon: "🎨",
                type: "creative",
                id: "create-something-" + Date.now(),
                reasoning: "creative_preference + personality_match" + (weatherBoost ? " + weather_boost" : ""),
                priority: "high"
            });
        } else if (profile.freeTime?.value === 'active') {
            recommendations.push({
                text: "Do something that gets your body moving",
                context: `Your active preference + ${personality} energy = physical engagement time`,
                icon: "🏃",
                type: "physical",
                id: "get-active-" + Date.now(),
                reasoning: "active_preference + energy_match",
                priority: "medium"
            });
        }
        
        // Calendar-based recommendations (if calendar connected)
        if (appState.permissions.calendar && appState.calendarEvents) {
            const upcomingEvents = this.getUpcomingEvents();
            if (upcomingEvents.length > 0) {
                const nextEvent = upcomingEvents[0];
                const timeUntil = this.getTimeUntilEvent(nextEvent);
                
                if (timeUntil > 30 && timeUntil < 120) { // 30-120 minutes
                    recommendations.push({
                        text: `Prep mentally for "${nextEvent.summary}" in ${Math.round(timeUntil)} minutes`,
                        context: `Your ${personality} personality benefits from transition time`,
                        icon: "🎯",
                        type: "preparation",
                        id: "meeting-prep-" + Date.now(),
                        reasoning: "calendar_awareness + personality_prep_need",
                        priority: "medium"
                    });
                }
            }
        }
        
        // Weather-specific recommendations
        const weatherRecs = this.getWeatherBasedRecommendations();
        recommendations.push(...weatherRecs);
        
        // Default recommendation if none generated
        if (recommendations.length === 0) {
            recommendations.push({
                text: "Take 3 deep breaths and set an intention for the next hour",
                context: "Sometimes the best action is conscious presence",
                icon: "🌸",
                type: "mindfulness",
                id: "intention-setting-" + Date.now(),
                reasoning: "default_mindfulness",
                priority: "low"
            });
        }
        
        return this.prioritizeRecommendations(recommendations);
    }
    
    // Get weather-based recommendations
    getWeatherBasedRecommendations() {
        const personality = appState.personality;
        const weather = appState.weather;
        const timeOfDay = appState.timeOfDay;
        const recommendations = [];
        
        const weatherRecommendations = {
            sunny: {
                morning: {
                    confident: {
                        text: "Take advantage of this energy - tackle something challenging outside",
                        context: "Sunny mornings amplify your natural confidence",
                        icon: "☀️"
                    },
                    open: {
                        text: "Explore somewhere new while the light is perfect",
                        context: "Bright mornings fuel your curiosity for discovery",
                        icon: "🗺️"
                    },
                    stable: {
                        text: "Perfect day for your outdoor routine or a walk",
                        context: "Consistent sunny energy matches your steady nature",
                        icon: "🚶"
                    },
                    cautious: {
                        text: "Enjoy some gentle sunshine - maybe read outside",
                        context: "Calm sunny weather supports your thoughtful side",
                        icon: "📖"
                    }
                },
                evening: {
                    all: {
                        text: "Catch the sunset - it's worth the pause",
                        context: "Beautiful evenings deserve your attention",
                        icon: "🌅"
                    }
                }
            },
            rainy: {
                all: {
                    confident: {
                        text: "Perfect weather for tackling indoor projects with focus",
                        context: "Rainy days channel your energy into concentrated action",
                        icon: "🏠"
                    },
                    open: {
                        text: "Rain is perfect for creative work - let your imagination flow",
                        context: "Rainy atmosphere often sparks creative breakthroughs",
                        icon: "🎨"
                    },
                    stable: {
                        text: "Cozy day for organizing or catching up on things",
                        context: "Rainy weather supports your systematic approach",
                        icon: "📋"
                    },
                    cautious: {
                        text: "Perfect thinking weather - time for deep reflection",
                        context: "Rain creates the ideal atmosphere for your contemplative nature",
                        icon: "💭"
                    }
                }
            },
            cloudy: {
                all: {
                    all: {
                        text: "Cloudy skies are perfect for focused work",
                        context: "Overcast weather reduces distractions and enhances concentration",
                        icon: "🌫️"
                    }
                }
            }
        };
        
        const weatherData = weatherRecommendations[weather];
        if (weatherData) {
            const timeData = weatherData[timeOfDay] || weatherData.all;
            if (timeData) {
                const personalityData = timeData[personality] || timeData.all;
                if (personalityData) {
                    recommendations.push({
                        ...personalityData,
                        type: "weather",
                        id: `weather-${weather}-${timeOfDay}-${Date.now()}`,
                        reasoning: `weather_${weather} + time_${timeOfDay} + personality_${personality}`,
                        priority: "low"
                    });
                }
            }
        }
        
        return recommendations;
    }
    
    // Get upcoming calendar events
    getUpcomingEvents() {
        if (!appState.calendarEvents) return [];
        
        const now = new Date();
        return appState.calendarEvents
            .filter(event => {
                const eventStart = new Date(event.start?.dateTime || event.start?.date);
                return eventStart > now;
            })
            .sort((a, b) => {
                const aStart = new Date(a.start?.dateTime || a.start?.date);
                const bStart = new Date(b.start?.dateTime || b.start?.date);
                return aStart - bStart;
            });
    }
    
    // Get time until event in minutes
    getTimeUntilEvent(event) {
        const now = new Date();
        const eventStart = new Date(event.start?.dateTime || event.start?.date);
        return (eventStart - now) / (1000 * 60); // minutes
    }
    
    // Prioritize recommendations based on various factors
    prioritizeRecommendations(recommendations) {
        return recommendations.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            const aPriority = priorityOrder[a.priority] || 1;
            const bPriority = priorityOrder[b.priority] || 1;
            
            if (aPriority !== bPriority) {
                return bPriority - aPriority; // Higher priority first
            }
            
            // Secondary sort by type preference
            const typePreference = {
                recovery: 5,
                productivity: 4,
                social: 3,
                creative: 3,
                preparation: 2,
                weather: 1,
                mindfulness: 0
            };
            
            const aType = typePreference[a.type] || 0;
            const bType = typePreference[b.type] || 0;
            
            return bType - aType;
        });
    }
    
    // Process detailed feedback from user
    giveDetailedFeedback(recId, type, followUpData = null) {
        const recommendation = appState.recommendations.find(r => r.id === recId);
        if (!recommendation) return;
        
        const feedback = {
            type,
            timestamp: Date.now(),
            recommendation,
            context: {
                timeOfDay: appState.timeOfDay,
                weather: appState.weather,
                userProfile: appState.userProfile,
                personality: appState.personality
            },
            followUp: followUpData
        };
        
        this.userFeedback[recId] = feedback;
        this.learnFromFeedback(feedback);
        
        if (CONFIG.APP.DEBUG) {
            console.log('Detailed feedback recorded:', feedback);
        }
    }
    
    // Learn from user feedback to improve future recommendations
    learnFromFeedback(feedback) {
        const { type, recommendation, context, followUp } = feedback;
        
        // Create learning patterns
        const patternKey = `${recommendation.type}_${context.personality}_${context.timeOfDay}_${context.weather}`;
        
        if (!this.learningPatterns[patternKey]) {
            this.learningPatterns[patternKey] = {
                positive: 0,
                negative: 0,
                neutral: 0,
                feedback_details: []
            };
        }
        
        // Update pattern counts
        if (type === 'love' || type === 'like') {
            this.learningPatterns[patternKey].positive++;
        } else if (type === 'nah') {
            this.learningPatterns[patternKey].negative++;
        } else {
            this.learningPatterns[patternKey].neutral++;
        }
        
        // Store detailed feedback for analysis
        this.learningPatterns[patternKey].feedback_details.push({
            type,
            followUp,
            reasoning: recommendation.reasoning,
            timestamp: feedback.timestamp
        });
        
        // Adjust future recommendation weights based on learning
        this.adjustRecommendationWeights(patternKey, type, followUp);
    }
    
    // Adjust recommendation weights based on feedback
    adjustRecommendationWeights(patternKey, feedbackType, followUpData) {
        // This would connect to ML models in production
        // For now, we'll store the learning data for future use
        
        const adjustments = {
            love: {
                energy_match: 1.5,
                need_fulfillment: 1.4,
                personality_resonance: 1.3,
                challenge_level: 1.2
            },
            like: {
                timing_preference: 1.2,
                goal_alignment: 1.1,
                personality_fit: 1.1,
                practicality: 1.1
            },
            nah: {
                mood_mismatch: 0.7,
                timing_wrong: 0.8,
                personality_mismatch: 0.6,
                priority_conflict: 0.9
            },
            already: {
                satisfaction_high: 1.0,
                satisfaction_low: 0.9,
                frequency_sometimes: 1.1,
                consistency_needed: 1.2
            }
        };
        
        if (CONFIG.APP.DEBUG) {
            console.log('Learning adjustment for pattern:', patternKey, adjustments[feedbackType]);
        }
    }
    
    // Calculate learning value for ML
    calculateLearningValue(feedbackType, optionIndex) {
        const learningMap = {
            love: ['energy_match', 'need_fulfillment', 'personality_resonance', 'challenge_level'],
            like: ['timing_preference', 'goal_alignment', 'personality_fit', 'practicality'],
            nah: ['mood_mismatch', 'timing_wrong', 'personality_mismatch', 'priority_conflict'],
            already: ['satisfaction_high', 'satisfaction_low', 'frequency_sometimes', 'consistency_needed']
        };
        
        return learningMap[feedbackType]?.[optionIndex] || 'general_feedback';
    }
    
    // Get follow-up questions based on feedback type
    getFollowUpQuestions(feedbackType) {
        const followUps = {
            love: [
                "What specifically excites you about this?",
                ["🎯 It matches my energy right now", "✨ It's exactly what I needed", "🧠 It shows you really get me", "🚀 It challenges me in a good way"]
            ],
            like: [
                "What makes this feel right for you?",
                ["⏰ The timing feels perfect", "🎯 It matches my current goals", "🤝 It fits my personality", "💡 It's practical and doable"]
            ],
            meh: [
                "What would make this more appealing?",
                ["⚡ Make it more energizing", "🎯 Better match my goals", "⏰ Different timing", "🎨 More creative approach"]
            ],
            nah: [
                "What doesn't work about this suggestion?",
                ["😴 I'm not in the mood for this", "⏰ Bad timing for me", "🙄 This isn't my style", "🎯 I have different priorities right now"]
            ],
            already: [
                "How's that been working for you?",
                ["💪 It's great, I love doing this", "😐 I do it but don't love it", "🔄 I do it sometimes", "🤔 I should do it more consistently"]
            ]
        };
        
        return followUps[feedbackType] || null;
    }
    
    // Generate more recommendations based on feedback
    generateMoreRecommendations() {
        // Analyze previous feedback to avoid similar rejected recommendations
        const rejectedTypes = Object.values(this.userFeedback)
            .filter(f => f.type === 'nah')
            .map(f => f.recommendation.type);
        
        const lovedTypes = Object.values(this.userFeedback)
            .filter(f => f.type === 'love')
            .map(f => f.recommendation.type);
        
        // Generate new recommendations, favoring loved types and avoiding rejected ones
        const newRecommendations = this.generatePersonalizedRecommendations()
            .filter(rec => !rejectedTypes.includes(rec.type))
            .map(rec => {
                // Boost priority for loved types
                if (lovedTypes.includes(rec.type)) {
                    rec.priority = rec.priority === 'low' ? 'medium' : 
                                  rec.priority === 'medium' ? 'high' : 'high';
                }
                return rec;
            });
        
        return newRecommendations;
    }
    
    // Reset the recommendation engine
    reset() {
        this.userFeedback = {};
        // Keep learning patterns for future sessions
    }
}

// Export recommendation system
window.RecommendationEngine = RecommendationEngine;