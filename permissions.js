// BohemR Permission Management System

class PermissionManager {
    constructor() {
        this.permissions = {
            location: false,
            notifications: false,
            calendar: false
        };
        
        this.googleAuth = null;
        this.msalInstance = null;
        
        this.initializeMSAL();
    }
    
    // Initialize Microsoft Graph authentication
    initializeMSAL() {
        if (typeof msal !== 'undefined') {
            const msalConfig = {
                auth: {
                    clientId: CONFIG.MICROSOFT.CLIENT_ID,
                    authority: CONFIG.MICROSOFT.AUTHORITY,
                    redirectUri: CONFIG.MICROSOFT.REDIRECT_URI
                },
                cache: {
                    cacheLocation: "sessionStorage",
                    storeAuthStateInCookie: false,
                }
            };
            
            try {
                this.msalInstance = new msal.PublicClientApplication(msalConfig);
            } catch (error) {
                console.log('MSAL initialization failed:', error);
            }
        }
    }
    
    // Request Location Permission
    async requestLocationPermission() {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                });
            });
            
            appState.location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            this.permissions.location = true;
            this.updatePermissionUI('locationPerm', true);
            
            // Fetch weather with real location
            await this.fetchWeatherByLocation(appState.location.lat, appState.location.lng);
            
            if (CONFIG.APP.DEBUG) {
                console.log('Location permission granted:', appState.location);
            }
            
        } catch (error) {
            console.log('Location access denied:', error.message);
            this.updatePermissionUI('locationPerm', false);
            
            // Use default weather
            await this.fetchWeather();
        }
    }
    
    // Request Notification Permission
    async requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            const granted = permission === 'granted';
            this.permissions.notifications = granted;
            this.updatePermissionUI('notificationPerm', granted);
            
            if (granted) {
                // Show welcome notification
                new Notification('BohemR is ready!', {
                    body: 'I can now send you personalized reminders',
                    icon: '/favicon.ico',
                    tag: 'bohemr-welcome'
                });
                
                if (CONFIG.APP.DEBUG) {
                    console.log('Notification permission granted');
                }
            }
        } catch (error) {
            console.log('Notification permission denied:', error);
            this.updatePermissionUI('notificationPerm', false);
        }
    }
    
    // Request Google Calendar Permission
    async requestGoogleCalendar() {
        try {
            if (typeof gapi === 'undefined') {
                throw new Error('Google API not loaded');
            }
            
            await new Promise((resolve) => {
                gapi.load('auth2', resolve);
            });
            
            const authInstance = await gapi.auth2.init({
                apiKey: CONFIG.GOOGLE.API_KEY,
                clientId: CONFIG.GOOGLE.CLIENT_ID,
                discoveryDocs: [CONFIG.GOOGLE.DISCOVERY_DOC],
                scope: CONFIG.GOOGLE.SCOPES
            });
            
            if (!authInstance.isSignedIn.get()) {
                await authInstance.signIn();
            }
            
            this.googleAuth = authInstance;
            this.permissions.calendar = true;
            this.updatePermissionUI('calendarPerm', true);
            
            // Fetch calendar events
            await this.fetchCalendarEvents();
            
            if (CONFIG.APP.DEBUG) {
                console.log('Google Calendar connected');
            }
            
        } catch (error) {
            console.log('Google Calendar connection failed:', error);
            this.updatePermissionUI('calendarPerm', false);
        }
    }
    
    // Request Outlook Calendar Permission
    async requestOutlookCalendar() {
        try {
            if (!this.msalInstance) {
                throw new Error('MSAL not initialized');
            }
            
            const loginRequest = {
                scopes: CONFIG.MICROSOFT.SCOPES
            };
            
            const response = await this.msalInstance.loginPopup(loginRequest);
            
            this.permissions.calendar = true;
            this.updatePermissionUI('calendarPerm', true);
            
            // Fetch Outlook calendar events
            await this.fetchOutlookEvents(response.accessToken);
            
            if (CONFIG.APP.DEBUG) {
                console.log('Outlook Calendar connected');
            }
            
        } catch (error) {
            console.log('Outlook Calendar connection failed:', error);
            this.updatePermissionUI('calendarPerm', false);
        }
    }
    
    // Calendar Permission Handler (detects provider)
    async requestCalendarPermission() {
        // For demo purposes, let user choose
        const provider = await this.showCalendarProviderChoice();
        
        if (provider === 'google') {
            await this.requestGoogleCalendar();
        } else if (provider === 'outlook') {
            await this.requestOutlookCalendar();
        }
    }
    
    // Show calendar provider selection
    showCalendarProviderChoice() {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'follow-up-overlay';
            modal.innerHTML = `
                <div class="follow-up-card glass-strong">
                    <h3>Connect Your Calendar</h3>
                    <p style="margin-bottom: 20px; opacity: 0.8;">Choose your calendar provider:</p>
                    <div class="follow-up-options">
                        <button class="choice-btn" onclick="selectCalendarProvider('google')">
                            <i class="fab fa-google"></i> Google Calendar
                        </button>
                        <button class="choice-btn" onclick="selectCalendarProvider('outlook')">
                            <i class="fab fa-microsoft"></i> Outlook Calendar
                        </button>
                    </div>
                    <button class="skip-btn" onclick="selectCalendarProvider('skip')">Skip for now</button>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            window.selectCalendarProvider = (provider) => {
                modal.remove();
                delete window.selectCalendarProvider;
                resolve(provider);
            };
        });
    }
    
    // Fetch weather by location
    async fetchWeatherByLocation(lat, lng) {
        try {
            const response = await fetch(
                `${CONFIG.WEATHER_API_URL}?lat=${lat}&lon=${lng}&appid=${CONFIG.WEATHER_API_KEY}&units=metric`
            );
            const data = await response.json();
            
            appState.weather = data.weather[0].main.toLowerCase();
            appState.location.city = data.name;
            appState.location.country = data.sys.country;
            
            this.updateWeatherDisplay(appState.weather, data.name);
            
            if (CONFIG.APP.DEBUG) {
                console.log('Weather data:', data);
            }
            
        } catch (error) {
            console.log('Weather fetch failed:', error);
            await this.fetchWeather();
        }
    }
    
    // Fallback weather fetch
    async fetchWeather() {
        const weatherConditions = ['sunny', 'cloudy', 'rainy', 'clear'];
        appState.weather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        this.updateWeatherDisplay(appState.weather);
    }
    
    // Update weather display
    updateWeatherDisplay(weather, location = '') {
        const contextualDescriptions = {
            sunny: `Sunny ${appState.timeOfDay} - high energy vibes`,
            cloudy: `Cloudy ${appState.timeOfDay} - perfect for focus`,
            rainy: `Rainy ${appState.timeOfDay} - cozy thinking weather`,
            clear: `Clear ${appState.timeOfDay} - optimal clarity`
        };
        
        const weatherDisplay = contextualDescriptions[weather] || `${weather} ${appState.timeOfDay}`;
        
        if (location) {
            document.title = `BohemR - ${location}`;
        }
        
        // Update context display if it exists
        const contextValue = document.querySelector('.context-strip .context-item:nth-child(2) .context-value');
        if (contextValue) {
            contextValue.textContent = `${weather} ${appState.timeOfDay}`;
        }
    }
    
    // Fetch Google Calendar events
    async fetchCalendarEvents() {
        try {
            const response = await gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': new Date().toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime'
            });
            
            const events = response.result.items;
            appState.calendarEvents = events;
            
            if (CONFIG.APP.DEBUG) {
                console.log('Calendar events:', events);
            }
            
        } catch (error) {
            console.log('Failed to fetch calendar events:', error);
        }
    }
    
    // Fetch Outlook calendar events
    async fetchOutlookEvents(accessToken) {
        try {
            const response = await fetch('https://graph.microsoft.com/v1.0/me/events?$top=10', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            appState.calendarEvents = data.value;
            
            if (CONFIG.APP.DEBUG) {
                console.log('Outlook events:', data.value);
            }
            
        } catch (error) {
            console.log('Failed to fetch Outlook events:', error);
        }
    }
    
    // Update permission UI
    updatePermissionUI(elementId, granted) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.classList.remove('granted', 'denied');
        element.classList.add(granted ? 'granted' : 'denied');
        
        const icon = element.querySelector('i');
        if (granted && icon) {
            // Change icon to checkmark when granted
            const originalClass = icon.className;
            icon.className = icon.className.replace(/fa-\w+/, 'fa-check');
            
            // Revert after 2 seconds
            setTimeout(() => {
                icon.className = originalClass;
            }, 2000);
        }
    }
    
    // Check initial permissions
    checkInitialPermissions() {
        // Check notification permission
        if ('Notification' in window) {
            this.permissions.notifications = Notification.permission === 'granted';
            this.updatePermissionUI('notificationPerm', this.permissions.notifications);
        }
        
        // Note: We can't check geolocation permission without requesting it
        // Calendar permissions need to be checked individually per provider
    }
    
    // Send personalized notification
    sendNotification(title, body, data = {}) {
        if (!this.permissions.notifications) return;
        
        const notification = new Notification(title, {
            body,
            icon: '/favicon.ico',
            data,
            tag: 'bohemr-recommendation'
        });
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
        
        // Auto-close after 5 seconds
        setTimeout(() => notification.close(), 5000);
    }
}

// Global permission manager instance
window.permissionManager = new PermissionManager();

// Expose methods for HTML onclick handlers
window.requestLocationPermission = () => permissionManager.requestLocationPermission();
window.requestNotificationPermission = () => permissionManager.requestNotificationPermission();
window.requestCalendarPermission = () => permissionManager.requestCalendarPermission();