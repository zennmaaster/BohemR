// BohemR ML-Powered Recommendation Engine

class MLRecommendationEngine extends RecommendationEngine {
    constructor() {
        super();
        this.userEmbedding = null;
        this.contextVector = null;
        this.recommendationHistory = [];
        this.vectorDatabase = new VectorDatabase();
    }
    
    // Generate ML-enhanced recommendations
    async generateMLRecommendations() {
        try {
            // Create user embedding
            this.userEmbedding = this.createUserEmbedding();
            
            // Create context vector
            this.contextVector = this.createContextVector();
            
            // Get base recommendations
            const baseRecs = this.generatePersonalizedRecommendations();
            
            // Enhance with ML scoring
            const mlEnhancedRecs = await this.enhanceWithMLScoring(baseRecs);
            
            // Add similarity-based recommendations
            const similarityRecs = await this.getSimilarUserRecommendations();
            
            // Combine and rank
            const allRecs = [...mlEnhancedRecs, ...similarityRecs];
            const rankedRecs = this.rankRecommendations(allRecs);
            
            // Store for learning
            this.storeRecommendationBatch(rankedRecs);
            
            return rankedRecs.slice(0, 4);
            
        } catch (error) {
            console.log('ML recommendation generation failed:', error);
            // Fallback to base recommendations
            return this.generatePersonalizedRecommendations();
        }
    }
    
    // Create user embedding from all available data
    createUserEmbedding() {
        const embedding = {
            // Personality vector (4 dimensions)
            personality: this.normalizePersonalityScores(appState.personalityScores),
            
            // Context preferences (encoded)
            workSatisfaction: this.encodeWorkSatisfaction(),
            energyPattern: this.encodeEnergyPattern(),
            freeTimePreference: this.encodeFreeTimePreference(),
            
            // Behavioral patterns
            trustLevel: appState.trustLevel / 4, // Normalize to 0-1
            responsePatterns: this.encodeFeedbackPatterns(),
            
            // Temporal patterns
            timePreferences: this.encodeTimePreferences(),
            activityLevel: this.encodeActivityLevel(),
            
            // Context data
            routine: this.encodeRoutine(),
            goals: this.encodeGoals(),
            interests: this.encodeInterests(),
            
            // Metadata
            userId: authManager?.userProfile?.id || 'anonymous',
            createdAt: Date.now(),
            version: '2.0'
        };
        
        if (CONFIG.APP.DEBUG) {
            console.log('User embedding created:', embedding);
        }
        
        return embedding;
    }
    
    // Create context vector for current situation
    createContextVector() {
        const userContext = enhancedPermissionManager.getUserContext();
        
        return {
            // Temporal context
            timeOfDay: this.encodeTimeOfDay(appState.timeOfDay),
            dayOfWeek: this.encodeDayOfWeek(appState.dayOfWeek),
            season: this.encodeSeason(),
            
            // Environmental context
            weather: this.encodeWeather(appState.weather),
            temperature: this.encodeTemperature(appState.location?.temperature),
            location: this.encodeLocation(),
            
            // Calendar context
            upcomingEvents: this.encodeUpcomingEvents(userContext.calendar.upcomingEvents),
            calendarLoad: this.encodeCalendarLoad(userContext.calendar.patterns),
            nextFreeTime: this.encodeNextFreeTime(userContext.calendar.nextFreeSlot),
            
            // Fitness context
            recentActivity: this.encodeRecentActivity(userContext.fitness.activityLevel),
            stepCount: this.encodeStepCount(userContext.fitness.recentSteps),
            
            // News/Interest context
            newsEngagement: this.encodeNewsEngagement(),
            
            timestamp: Date.now()
        };
    }
    
    // Normalize personality scores for ML
    normalizePersonalityScores(scores) {
        const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
        if (total === 0) return { confident: 0.25, open: 0.25, stable: 0.25, cautious: 0.25 };
        
        return {
            confident: (scores.confident || 0) / total,
            open: (scores.open || 0) / total,
            stable: (scores.stable || 0) / total,
            cautious: (scores.cautious || 0) / total
        };
    }
    
    // Encode work satisfaction
    encodeWorkSatisfaction() {
        const satisfaction = appState.userProfile.workFeeling?.value;
        const encoding = { love: 1.0, like: 0.7, meh: 0.3, drain: 0.0 };
        return encoding[satisfaction] || 0.5;
    }
    
    // Encode energy pattern
    encodeEnergyPattern() {
        const energy = appState.userProfile.energyLevel?.value;
        const encoding = { high: 1.0, steady: 0.7, 'ups-downs': 0.4, low: 0.1 };
        return encoding[energy] || 0.5;
    }
    
    // Encode free time preference
    encodeFreeTimePreference() {
        const preference = appState.userProfile.freeTime?.value;
        return {
            active: preference === 'active' ? 1 : 0,
            social: preference === 'social' ? 1 : 0,
            creative: preference === 'create' ? 1 : 0,
            recharge: preference === 'recharge' ? 1 : 0
        };
    }
    
    // Encode feedback patterns for learning
    encodeFeedbackPatterns() {
        const feedback = this.userFeedback;
        const patterns = { love: 0, like: 0, meh: 0, nah: 0, already: 0 };
        
        Object.values(feedback).forEach(fb => {
            patterns[fb.type] = (patterns[fb.type] || 0) + 1;
        });
        
        const total = Object.values(patterns).reduce((sum, count) => sum + count, 0);
        if (total === 0) return patterns;
        
        // Normalize to probabilities
        Object.keys(patterns).forEach(key => {
            patterns[key] = patterns[key] / total;
        });
        
        return patterns;
    }
    
    // Encode time preferences from feedback
    encodeTimePreferences() {
        // Analyze when user gives positive feedback
        const timeBasedFeedback = {};
        Object.values(this.userFeedback).forEach(fb => {
            const hour = new Date(fb.timestamp).getHours();
            const timeSlot = this.getTimeSlot(hour);
            
            if (!timeBasedFeedback[timeSlot]) {
                timeBasedFeedback[timeSlot] = { positive: 0, total: 0 };
            }
            
            timeBasedFeedback[timeSlot].total++;
            if (fb.type === 'love' || fb.type === 'like') {
                timeBasedFeedback[timeSlot].positive++;
            }
        });
        
        // Convert to preference scores
        const preferences = {};
        Object.keys(timeBasedFeedback).forEach(timeSlot => {
            const data = timeBasedFeedback[timeSlot];
            preferences[timeSlot] = data.total > 0 ? data.positive / data.total : 0.5;
        });
        
        return preferences;
    }
    
    // Get time slot for hour
    getTimeSlot(hour) {
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 22) return 'evening';
        return 'night';
    }
    
    // Encode activity level
    encodeActivityLevel() {
        const level = enhancedPermissionManager.getActivityLevel();
        const encoding = { high: 1.0, moderate: 0.7, low: 0.3, sedentary: 0.1, unknown: 0.5 };
        return encoding[level] || 0.5;
    }
    
    // Encode routine data
    encodeRoutine() {
        const routine = appState.userProfile.routineContext;
        if (!routine) return null;
        
        return {
            wakeTime: this.encodeWakeTime(routine[0]),
            productiveTime: this.encodeProductiveTime(routine[1]),
            eveningActivity: this.encodeEveningActivity(routine[2])
        };
    }
    
    // Encode wake time
    encodeWakeTime(wakeTimeData) {
        if (!wakeTimeData) return 0.5;
        
        const encoding = {
            0: 1.0,  // Early bird (5-7am)
            1: 0.7,  // Morning person (7-9am)
            2: 0.3,  // Not a morning person (9-11am)
            3: 0.1   // Night owl schedule
        };
        
        return encoding[wakeTimeData.index] || 0.5;
    }
    
    // Enhance recommendations with ML scoring
    async enhanceWithMLScoring(recommendations) {
        return recommendations.map(rec => {
            const mlScore = this.calculateMLScore(rec);
            const confidenceScore = this.calculateConfidenceScore(rec);
            
            return {
                ...rec,
                mlScore,
                confidenceScore,
                enhancedReasoning: this.generateEnhancedReasoning(rec, mlScore),
                priority: this.adjustPriorityByML(rec.priority, mlScore)
            };
        });
    }
    
    // Calculate ML score for recommendation
    calculateMLScore(recommendation) {
        let score = 0.5; // Base score
        
        // Personality alignment
        const personalityAlignment = this.calculatePersonalityAlignment(recommendation);
        score += personalityAlignment * 0.3;
        
        // Context alignment
        const contextAlignment = this.calculateContextAlignment(recommendation);
        score += contextAlignment * 0.3;
        
        // Historical performance
        const historicalPerformance = this.calculateHistoricalPerformance(recommendation);
        score += historicalPerformance * 0.2;
        
        // Time relevance
        const timeRelevance = this.calculateTimeRelevance(recommendation);
        score += timeRelevance * 0.2;
        
        return Math.max(0, Math.min(1, score)); // Clamp to 0-1
    }
    
    // Calculate personality alignment
    calculatePersonalityAlignment(recommendation) {
        const personalityWeights = {
            confident: { productivity: 0.9, challenge: 0.8, social: 0.7 },
            open: { creative: 0.9, exploration: 0.8, learning: 0.7 },
            stable: { routine: 0.9, relationship: 0.8, organization: 0.7 },
            cautious: { planning: 0.9, research: 0.8, reflection: 0.7 }
        };
        
        const userPersonality = appState.personality;
        const recType = recommendation.type;
        
        const weights = personalityWeights[userPersonality] || {};
        return weights[recType] || 0.5;
    }
    
    // Calculate context alignment
    calculateContextAlignment(recommendation) {
        let alignment = 0.5;
        
        // Weather alignment
        if (recommendation.type === 'location' && appState.weather) {
            alignment += 0.2;
        }
        
        // Time alignment
        const timeAlignment = this.getTimeAlignment(recommendation);
        alignment += timeAlignment * 0.3;
        
        // Energy alignment
        const energyAlignment = this.getEnergyAlignment(recommendation);
        alignment += energyAlignment * 0.3;
        
        return Math.max(0, Math.min(1, alignment));
    }
    
    // Get similar user recommendations using vector similarity
    async getSimilarUserRecommendations() {
        try {
            if (!this.userEmbedding) return [];
            
            // Query vector database for similar users
            const similarUsers = await this.vectorDatabase.findSimilarUsers(
                this.userEmbedding,
                { limit: 5, threshold: 0.7 }
            );
            
            // Get their successful recommendations
            const similarRecs = [];
            for (const user of similarUsers) {
                const userRecs = await this.vectorDatabase.getUserSuccessfulRecs(user.id);
                similarRecs.push(...userRecs);
            }
            
            // Adapt recommendations for current user
            return this.adaptRecommendationsForUser(similarRecs);
            
        } catch (error) {
            console.log('Similar user recommendations failed:', error);
            return [];
        }
    }
    
    // Rank recommendations using combined scoring
    rankRecommendations(recommendations) {
        return recommendations.sort((a, b) => {
            // Primary sort by ML score
            if (a.mlScore !== b.mlScore) {
                return b.mlScore - a.mlScore;
            }
            
            // Secondary sort by priority
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            const aPriority = priorityOrder[a.priority] || 2;
            const bPriority = priorityOrder[b.priority] || 2;
            
            if (aPriority !== bPriority) {
                return bPriority - aPriority;
            }
            
            // Tertiary sort by confidence
            return (b.confidenceScore || 0.5) - (a.confidenceScore || 0.5);
        });
    }
    
    // Store recommendation batch for learning
    async storeRecommendationBatch(recommendations) {
        const batch = {
            userId: authManager?.userProfile?.id || 'anonymous',
            timestamp: Date.now(),
            userEmbedding: this.userEmbedding,
            contextVector: this.contextVector,
            recommendations: recommendations.map(rec => ({
                id: rec.id,
                type: rec.type,
                text: rec.text,
                mlScore: rec.mlScore,
                priority: rec.priority
            }))
        };
        
        this.recommendationHistory.push(batch);
        
        // Store in vector database
        await this.vectorDatabase.storeRecommendationBatch(batch);
        
        if (CONFIG.APP.DEBUG) {
            console.log('Recommendation batch stored:', batch);
        }
    }
    
    // Learn from user feedback with ML updates
    async learnFromMLFeedback(recId, feedbackType, followUpData) {
        try {
            // Call parent method
            this.learnFromFeedback({
                type: feedbackType,
                recommendation: appState.recommendations.find(r => r.id === recId),
                context: this.contextVector,
                followUp: followUpData,
                timestamp: Date.now()
            });
            
            // ML-specific learning
            const mlFeedback = {
                userId: authManager?.userProfile?.id || 'anonymous',
                recommendationId: recId,
                feedbackType,
                followUpData,
                userEmbedding: this.userEmbedding,
                contextVector: this.contextVector,
                timestamp: Date.now()
            };
            
            // Store for ML training
            await this.vectorDatabase.storeFeedback(mlFeedback);
            
            // Update user embedding based on feedback
            this.updateUserEmbeddingFromFeedback(mlFeedback);
            
            if (CONFIG.APP.DEBUG) {
                console.log('ML feedback processed:', mlFeedback);
            }
            
        } catch (error) {
            console.log('ML feedback learning failed:', error);
        }
    }
    
    // Update user embedding based on feedback
    updateUserEmbeddingFromFeedback(feedback) {
        if (!this.userEmbedding) return;
        
        const learningRate = 0.1;
        const recommendation = appState.recommendations.find(r => r.id === feedback.recommendationId);
        
        if (!recommendation) return;
        
        // Adjust embedding based on feedback
        if (feedback.feedbackType === 'love' || feedback.feedbackType === 'like') {
            // Strengthen alignment with recommendation type
            this.reinforceEmbeddingPattern(recommendation, learningRate);
        } else if (feedback.feedbackType === 'nah') {
            // Weaken alignment with recommendation type
            this.weakenEmbeddingPattern(recommendation, learningRate);
        }
    }
    
    // Generate enhanced reasoning with ML insights
    generateEnhancedReasoning(recommendation, mlScore) {
        const confidence = mlScore > 0.8 ? 'high' : mlScore > 0.6 ? 'medium' : 'low';
        const baseReasoning = recommendation.reasoning;
        
        const enhancedReasons = [];
        
        if (mlScore > 0.7) {
            enhancedReasons.push("Strong match with your personality and patterns");
        }
        
        if (this.contextVector?.timeOfDay) {
            enhancedReasons.push(`Optimal timing for your ${appState.timeOfDay} energy`);
        }
        
        if (this.userEmbedding?.trustLevel > 0.75) {
            enhancedReasons.push("Based on deep understanding of your preferences");
        }
        
        return enhancedReasons.length > 0 
            ? enhancedReasons.join(" + ")
            : baseReasoning;
    }
}

// Vector Database simulation (replace with real vector DB)
class VectorDatabase {
    constructor() {
        this.users = new Map();
        this.recommendations = new Map();
        this.feedback = new Map();
    }
    
    async findSimilarUsers(userEmbedding, options = {}) {
        // Simulate vector similarity search
        const similarUsers = [];
        
        for (const [userId, userData] of this.users) {
            const similarity = this.calculateCosineSimilarity(
                userEmbedding.personality,
                userData.embedding.personality
            );
            
            if (similarity > (options.threshold || 0.7)) {
                similarUsers.push({
                    id: userId,
                    similarity,
                    embedding: userData.embedding
                });
            }
        }
        
        return similarUsers
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, options.limit || 5);
    }
    
    calculateCosineSimilarity(vectorA, vectorB) {
        const keysA = Object.keys(vectorA);
        const keysB = Object.keys(vectorB);
        const commonKeys = keysA.filter(key => keysB.includes(key));
        
        if (commonKeys.length === 0) return 0;
        
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        
        commonKeys.forEach(key => {
            const a = vectorA[key] || 0;
            const b = vectorB[key] || 0;
            
            dotProduct += a * b;
            normA += a * a;
            normB += b * b;
        });
        
        if (normA === 0 || normB === 0) return 0;
        
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
    
    async storeRecommendationBatch(batch) {
        this.recommendations.set(batch.userId + '_' + batch.timestamp, batch);
        
        // Store user embedding
        if (!this.users.has(batch.userId)) {
            this.users.set(batch.userId, {
                embedding: batch.userEmbedding,
                lastUpdated: batch.timestamp
            });
        }
    }
    
    async storeFeedback(feedback) {
        const key = feedback.userId + '_' + feedback.recommendationId;
        this.feedback.set(key, feedback);
    }
    
    async getUserSuccessfulRecs(userId)