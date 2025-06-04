// BohemR Authentication & User Management System

class AuthenticationManager {
    constructor() {
        this.currentUser = null;
        this.isSignedIn = false;
        this.authInstance = null;
        this.userProfile = null;
        
        this.initializeGoogleAuth();
    }
    
    // Initialize Google Authentication
    async initializeGoogleAuth() {
        try {
            await new Promise((resolve) => {
                gapi.load('auth2', resolve);
            });
            
            this.authInstance = await gapi.auth2.init({
                client_id: CONFIG.GOOGLE.CLIENT_ID,
                scope: [
                    CONFIG.GOOGLE.SCOPES,
                    ...CONFIG.GOOGLE_FIT.SCOPES
                ].join(' ')
            });
            
            // Check if user is already signed in
            this.isSignedIn = this.authInstance.isSignedIn.get();
            if (this.isSignedIn) {
                await this.handleSignInSuccess();
            }
            
            // Listen for sign-in state changes
            this.authInstance.isSignedIn.listen(this.onSignInStatusChange.bind(this));
            
            this.updateAuthUI();
            
            if (CONFIG.APP.DEBUG) {
                console.log('Google Auth initialized:', this.isSignedIn);
            }
            
        } catch (error) {
            console.log('Google Auth initialization failed:', error);
        }
    }
    
    // Handle sign-in button click
    async signIn() {
        try {
            const authResult = await this.authInstance.signIn();
            await this.handleSignInSuccess();
            return true;
        } catch (error) {
            console.log('Sign-in failed:', error);
            this.showNotification('Sign-in failed. Please try again.', 'error');
            return false;
        }
    }
    
    // Handle sign-out
    async signOut() {
        try {
            await this.authInstance.signOut();
            this.currentUser = null;
            this.userProfile = null;
            this.isSignedIn = false;
            
            // Clear local data
            this.clearUserData();
            this.updateAuthUI();
            
            this.showNotification('Signed out successfully', 'success');
            
        } catch (error) {
            console.log('Sign-out failed:', error);
        }
    }
    
    // Handle successful sign-in
    async handleSignInSuccess() {
        this.currentUser = this.authInstance.currentUser.get();
        this.isSignedIn = true;
        
        // Get user profile
        const basicProfile = this.currentUser.getBasicProfile();
        this.userProfile = {
            id: basicProfile.getId(),
            name: basicProfile.getName(),
            email: basicProfile.getEmail(),
            picture: basicProfile.getImageUrl(),
            signInTime: new Date().toISOString()
        };
        
        // Store user data
        await this.storeUserProfile();
        
        // Load user's app data
        await this.loadUserAppData();
        
        this.updateAuthUI();
        this.showNotification(`Welcome back, ${this.userProfile.name}!`, 'success');
        
        if (CONFIG.APP.DEBUG) {
            console.log('User signed in:', this.userProfile);
        }
    }
    
    // Handle sign-in status changes
    onSignInStatusChange(isSignedIn) {
        this.isSignedIn = isSignedIn;
        if (isSignedIn) {
            this.handleSignInSuccess();
        } else {
            this.currentUser = null;
            this.userProfile = null;
            this.clearUserData();
        }
        this.updateAuthUI();
    }
    
    // Store user profile in database
    async storeUserProfile() {
        try {
            const userData = {
                ...this.userProfile,
                appData: {
                    personality: appState.personality,
                    personalityScores: appState.personalityScores,
                    userProfile: appState.userProfile,
                    trustLevel: appState.trustLevel,
                    lastUpdated: new Date().toISOString()
                }
            };
            
            // Store in your backend database
            if (CONFIG.BACKEND.DATABASE_URL) {
                await this.saveToDatabase(userData);
            }
            
            // Also store locally as backup
            localStorage.setItem('bohemr_user_profile', JSON.stringify(userData));
            
        } catch (error) {
            console.log('Failed to store user profile:', error);
        }
    }
    
    // Load user's app data from database
    async loadUserAppData() {
        try {
            let userData = null;
            
            // Try to load from backend first
            if (CONFIG.BACKEND.DATABASE_URL) {
                userData = await this.loadFromDatabase(this.userProfile.id);
            }
            
            // Fallback to local storage
            if (!userData) {
                const localData = localStorage.getItem('bohemr_user_profile');
                userData = localData ? JSON.parse(localData) : null;
            }
            
            if (userData && userData.appData) {
                // Restore app state
                appState.personality = userData.appData.personality;
                appState.personalityScores = userData.appData.personalityScores || {};
                appState.userProfile = userData.appData.userProfile || {};
                appState.trustLevel = userData.appData.trustLevel || 1;
                
                if (CONFIG.APP.DEBUG) {
                    console.log('User app data loaded:', userData.appData);
                }
                
                return true;
            }
            
        } catch (error) {
            console.log('Failed to load user app data:', error);
        }
        
        return false;
    }
    
    // Save to database (implement based on your backend)
    async saveToDatabase(userData) {
        if (CONFIG.BACKEND.DATABASE_URL) {
            const response = await fetch(`${CONFIG.BACKEND.DATABASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAccessToken()}`
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                throw new Error('Database save failed');
            }
        }
    }
    
    // Load from database
    async loadFromDatabase(userId) {
        if (CONFIG.BACKEND.DATABASE_URL) {
            const response = await fetch(`${CONFIG.BACKEND.DATABASE_URL}/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${this.getAccessToken()}`
                }
            });
            
            if (response.ok) {
                return await response.json();
            }
        }
        return null;
    }
    
    // Get current access token
    getAccessToken() {
        if (this.currentUser) {
            return this.currentUser.getAuthResponse().access_token;
        }
        return null;
    }
    
    // Clear user data
    clearUserData() {
        localStorage.removeItem('bohemr_user_profile');
        localStorage.removeItem('bohemr_state');
        
        // Reset app state to defaults
        appState.personality = null;
        appState.personalityScores = {};
        appState.userProfile = {};
        appState.trustLevel = 1;
        appState.recommendations = [];
        appState.userFeedback = {};
    }
    
    // Update authentication UI
    updateAuthUI() {
        const authButton = document.getElementById('authButton');
        const userInfo = document.getElementById('userInfo');
        
        if (this.isSignedIn && this.userProfile) {
            // Show signed-in state
            if (authButton) {
                authButton.innerHTML = `
                    <div class="user-profile" onclick="toggleUserMenu()">
                        <img src="${this.userProfile.picture}" alt="Profile" class="profile-pic">
                        <span class="user-name">${this.userProfile.name}</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                `;
            }
            
            if (userInfo) {
                userInfo.style.display = 'block';
                userInfo.innerHTML = `
                    <div class="user-welcome">
                        <span>Welcome back, ${this.userProfile.name.split(' ')[0]}!</span>
                        <div class="sync-status">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Synced across devices</span>
                        </div>
                    </div>
                `;
            }
        } else {
            // Show sign-in state
            if (authButton) {
                authButton.innerHTML = `
                    <button class="btn btn-primary" onclick="authManager.signIn()">
                        <i class="fab fa-google"></i>
                        Sign in with Google
                    </button>
                `;
            }
            
            if (userInfo) {
                userInfo.style.display = 'none';
            }
        }
    }
    
    // Show user menu
    showUserMenu() {
        const menuHTML = `
            <div class="user-menu-overlay" onclick="hideUserMenu()">
                <div class="user-menu glass-strong">
                    <div class="user-info">
                        <img src="${this.userProfile.picture}" alt="Profile" class="profile-pic-large">
                        <div class="user-details">
                            <h3>${this.userProfile.name}</h3>
                            <p>${this.userProfile.email}</p>
                        </div>
                    </div>
                    <div class="menu-divider"></div>
                    <div class="menu-items">
                        <button class="menu-item" onclick="exportUserData()">
                            <i class="fas fa-download"></i>
                            Export My Data
                        </button>
                        <button class="menu-item" onclick="clearAllData()">
                            <i class="fas fa-trash"></i>
                            Clear All Data
                        </button>
                        <button class="menu-item" onclick="authManager.signOut()">
                            <i class="fas fa-sign-out-alt"></i>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', menuHTML);
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Get user embedding for ML
    getUserEmbedding() {
        if (!this.userProfile || !appState.personality) return null;
        
        return {
            userId: this.userProfile.id,
            personality: appState.personality,
            personalityScores: appState.personalityScores,
            userProfile: appState.userProfile,
            trustLevel: appState.trustLevel,
            contextData: {
                routine: appState.userProfile.routineContext,
                goals: appState.userProfile.goalsContext,
                interests: appState.userProfile.interestsContext
            },
            timestamp: new Date().toISOString()
        };
    }
}

// Global functions for UI interactions
function toggleUserMenu() {
    if (document.querySelector('.user-menu-overlay')) {
        hideUserMenu();
    } else {
        authManager.showUserMenu();
    }
}

function hideUserMenu() {
    const menu = document.querySelector('.user-menu-overlay');
    if (menu) menu.remove();
}

function exportUserData() {
    const userData = {
        profile: authManager.userProfile,
        appData: {
            personality: appState.personality,
            personalityScores: appState.personalityScores,
            userProfile: appState.userProfile,
            recommendations: appState.recommendations,
            feedback: recommendationEngine.userFeedback
        },
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bohemr-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    hideUserMenu();
    authManager.showNotification('Data exported successfully!', 'success');
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
        authManager.clearUserData();
        hideUserMenu();
        authManager.showNotification('All data cleared', 'success');
        
        // Redirect to start
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// Initialize auth manager
window.authManager = new AuthenticationManager();