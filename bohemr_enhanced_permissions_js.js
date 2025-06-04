// BohemR Enhanced Permission & API Integration System

class EnhancedPermissionManager extends PermissionManager {
    constructor() {
        super();
        this.fitnessData = null;
        this.calendarEvents = [];
        this.newsPreferences = [];
        this.lastSyncTime = null;
    }
    
    // Enhanced Calendar Integration with Schedule-Aware Suggestions
    async requestEnhancedCalendar() {
        try {
            await this.requestGoogleCalendar();
            
            if (this.permissions.calendar) {
                // Fetch detailed calendar data
                await this.fetchDetailedCalendarEvents();
                
                // Analyze calendar patterns
                this.analyzeCalendarPatterns();
                
                if (CONFIG.APP.DEBUG) {
                    console.log('Enhanced calendar integration complete');
                }
            }
        } catch (error) {
            console.log('Enhanced calendar integration failed:', error);
        }
    }
    
    // Google Fit Integration
    async requestGoogleFitPermission() {
        try {
            if (!this.googleAuth) {
                await this.requestGoogleCalendar(); // This initializes googleAuth
            }
            
            // Request additional Fit scopes
            const response = await gapi.client.request({
                'path': 'https://www.googleapis.com/auth/fitness.activity.read'
            });
            
            this.permissions.fitness = true;
            this.updatePermissionUI('fitnessPerm', true);
            
            // Fetch fitness data
            await this.fetchGoogleFitData();
            
            if (CONFIG.APP.DEBUG) {
                console.log('Google Fit connected');
            }
            
        } catch (error) {
            console.log('Google Fit connection failed:', error);
            this.updatePermissionUI('fitnessPerm', false);
        }
    }
    
    // Fetch Google Fit Data
    async fetchGoogleFitData() {
        try {
            const now = new Date();
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            
            // Fetch step count
            const stepsResponse = await gapi.client.request({
                'path': 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
                'method': 'POST',
                'body': {
                    'aggregateBy': [{
                        'dataTypeName': 'com.google.step_count.delta',
                        'dataSourceId': 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
                    }],
                    'bucketByTime': { 'durationMillis': 86400000 }, // 1 day
                    'startTimeMillis': oneWeekAgo.getTime(),
                    'endTimeMillis': now.getTime()
                }
            });
            
            // Fetch activity segments
            const activityResponse = await gapi.client.request({
                'path': 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
                'method': 'POST',
                'body': {
                    'aggregateBy': [{
                        'dataTypeName': 'com.google.activity.segment'
                    }],
                    'bucketByTime': { 'durationMillis': 86400000 },
                    'startTimeMillis': oneWeekAgo.getTime(),
                    'endTimeMillis': now.getTime()
                }
            });
            
            this.fitnessData = {
                steps: this.parseStepsData(stepsResponse.result),
                activities: this.parseActivityData(activityResponse.result),
                lastUpdated: new Date().toISOString()
            };
            
            appState.fitnessData = this.fitnessData;
            
            if (CONFIG.APP.DEBUG) {
                console.log('Fitness data:', this.fitnessData);
            }
            
        } catch (error) {
            console.log('Failed to fetch fitness data:', error);
        }
    }
    
    // Parse steps data
    parseStepsData(response) {
        const steps = [];
        if (response.bucket) {
            response.bucket.forEach(bucket => {
                if (bucket.dataset && bucket.dataset[0] && bucket.dataset[0].point) {
                    const totalSteps = bucket.dataset[0].point.reduce((sum, point) => {
                        return sum + (point.value[0].intVal || 0);
                    }, 0);
                    
                    steps.push({
                        date: new Date(parseInt(bucket.startTimeMillis)),
                        steps: totalSteps
                    });
                }
            });
        }
        return steps;
    }
    
    // Parse activity data
    parseActivityData(response) {
        const activities = [];
        if (response.bucket) {
            response.bucket.forEach(bucket => {
                if (bucket.dataset && bucket.dataset[0] && bucket.dataset[0].point) {
                    bucket.dataset[0].point.forEach(point => {
                        activities.push({
                            date: new Date(parseInt(point.startTimeNanos) / 1000000),
                            activity: point.value[0].intVal,
                            duration: parseInt(point.endTimeNanos) - parseInt(point.startTimeNanos)
                        });
                    });
                }
            });
        }
        return activities;
    }
    
    // News API Integration
    async setupNewsPreferences() {
        if (!CONFIG.NEWS_API.API_KEY || CONFIG.NEWS_API.API_KEY === 'YOUR_NEWS_API_KEY') {
            console.log('News API key not configured');
            return;
        }
        
        // Show news preference selection
        this.showNewsPreferenceDialog();
    }
    
    showNewsPreferenceDialog() {
        const modal = document.createElement('div');
        modal.className = 'follow-up-overlay';
        modal.innerHTML = `
            <div class="follow-up-card glass-strong">
                <h3>What topics interest you?</h3>
                <p style="margin-bottom: 20px; opacity: 0.8;">Select topics to get personalized content recommendations:</p>
                <div class="news-categories">
                    ${[
                        '💼 Business', '💻 Technology', '🏥 Health', '🧬 Science',
                        '🎨 Arts', '⚽ Sports', '🎬 Entertainment', '🌍 World News',
                        '🏛️ Politics', '💰 Finance', '🌱 Environment', '🍔 Food'
                    ].map(category => `
                        <button class="choice-btn small news-category" onclick="toggleNewsCategory('${category}')" data-category="${category}">
                            ${category}
                        </button>
                    `).join('')}
                </div>
                <div style="margin-top: 20px;">
                    <button class="btn btn-primary" onclick="saveNewsPreferences()">
                        Save Preferences
                    </button>
                    <button class="btn btn-secondary" onclick="closeNewsDialog()">
                        Skip
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Fetch detailed calendar events with analysis
    async fetchDetailedCalendarEvents() {
        try {
            const now = new Date();
            const oneMonthAhead = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            
            const response = await gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': now.toISOString(),
                'timeMax': oneMonthAhead.toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 50,
                'orderBy': 'startTime'
            });
            
            this.calendarEvents = response.result.items;
            appState.calendarEvents = this.calendarEvents;
            
            if (CONFIG.APP.DEBUG) {
                console.log('Detailed calendar events:', this.calendarEvents);
            }
            
        } catch (error) {
            console.log('Failed to fetch detailed calendar events:', error);
        }
    }
    
    // Analyze calendar patterns for insights
    analyzeCalendarPatterns() {
        if (!this.calendarEvents || this.calendarEvents.length === 0) return;
        
        const patterns = {
            busyDays: [],
            freeTimes: [],
            meetingTypes: {},
            peakHours: {},
            weeklyLoad: Array(7).fill(0)
        };
        
        this.calendarEvents.forEach(event => {
            if (!event.start || !event.start.dateTime) return;
            
            const startTime = new Date(event.start.dateTime);
            const endTime = new Date(event.end?.dateTime || startTime);
            const duration = endTime - startTime;
            const dayOfWeek = startTime.getDay();
            const hour = startTime.getHours();
            
            // Count weekly load
            patterns.weeklyLoad[dayOfWeek] += duration / (1000 * 60 * 60); // Hours
            
            // Track peak hours
            patterns.peakHours[hour] = (patterns.peakHours[hour] || 0) + 1;
            
            // Categorize meeting types
            const summary = event.summary?.toLowerCase() || '';
            if (summary.includes('meeting') || summary.includes('call')) {
                patterns.meetingTypes.meetings = (patterns.meetingTypes.meetings || 0) + 1;
            } else if (summary.includes('focus') || summary.includes('work')) {
                patterns.meetingTypes.focusTime = (patterns.meetingTypes.focusTime || 0) + 1;
            } else if (summary.includes('break') || summary.includes('lunch')) {
                patterns.meetingTypes.breaks = (patterns.meetingTypes.breaks || 0) + 1;
            }
        });
        
        appState.calendarPatterns = patterns;
        
        if (CONFIG.APP.DEBUG) {
            console.log('Calendar patterns:', patterns);
        }
    }
    
    // Fetch news based on user interests
    async fetchPersonalizedNews() {
        if (!this.newsPreferences.length || !CONFIG.NEWS_API.API_KEY) return;
        
        try {
            const category = this.newsPreferences[Math.floor(Math.random() * this.newsPreferences.length)];
            const cleanCategory = category.replace(/[^\w]/g, '').toLowerCase();
            
            const response = await fetch(
                `${CONFIG.NEWS_API.BASE_URL}top-headlines?category=${cleanCategory}&country=us&pageSize=5&apiKey=${CONFIG.NEWS_API.API_KEY}`
            );
            
            const data = await response.json();
            
            if (data.articles) {
                appState.newsArticles = data.articles.slice(0, 3); // Top 3 articles
                
                if (CONFIG.APP.DEBUG) {
                    console.log('Personalized news:', appState.