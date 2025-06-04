// BohemR Configuration File
// Update these values with your actual API keys and credentials

const CONFIG = {
    // OpenWeatherMap API
    WEATHER_API_KEY: 'd53d12aaa3d02f42aab749a0860e17c0',
    WEATHER_API_URL: 'https://api.openweathermap.org/data/2.5/weather',
    
    // Google Calendar API (OAuth 2.0)
    GOOGLE: {
        CLIENT_ID: '439810014163-3pkns76lom5r7p7ddbvavh5hc9m6p036.apps.googleusercontent.com',
        API_KEY: 'AIzaSyCDsbHizah-4Ld8G3cldjT_jv2spnicgW4',
        DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
        SCOPES: 'https://www.googleapis.com/auth/calendar.readonly'
    },
    
    // Google Fit API
    GOOGLE_FIT: {
        SCOPES: [
            'https://www.googleapis.com/auth/fitness.activity.read',
            'https://www.googleapis.com/auth/fitness.body.read',
            'https://www.googleapis.com/auth/fitness.location.read'
        ],
        DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest'
    },
    
    // News API
    NEWS_API: {
        API_KEY: 'YOUR_NEWS_API_KEY', // Get from newsapi.org
        BASE_URL: 'https://newsapi.org/v2/'
    },
    
    // Microsoft Graph API (Azure AD)
    MICROSOFT: {
        CLIENT_ID: 'YOUR_AZURE_APP_CLIENT_ID',
        AUTHORITY: 'https://login.microsoftonline.com/common',
        REDIRECT_URI: window.location.origin,
        SCOPES: ['https://graph.microsoft.com/calendars.read']
    },
    
    // Backend Services
    BACKEND: {
        AUTH_SERVER: 'https://your-auth-server.com', // Your authentication server
        ML_API: 'https://your-ml-api.com', // Your ML recommendation API
        DATABASE_URL: 'https://your-database.com', // Firebase/Supabase URL
        VECTOR_DB: 'https://your-vector-db.com' // Pinecone/Weaviate endpoint
    },
    
    // Firebase Configuration (if using Firebase)
    FIREBASE: {
        API_KEY: 'YOUR_FIREBASE_API_KEY',
        AUTH_DOMAIN: 'your-project.firebaseapp.com',
        PROJECT_ID: 'your-project-id',
        STORAGE_BUCKET: 'your-project.appspot.com',
        MESSAGING_SENDER_ID: 'your-sender-id',
        APP_ID: 'your-app-id'
    },
    
    // Supabase Configuration (alternative to Firebase)
    SUPABASE: {
        URL: 'https://your-project.supabase.co',
        ANON_KEY: 'your-anon-key'
    },
    
    // App Settings
    APP: {
        NAME: 'BohemR',
        VERSION: '2.0.0',
        DEBUG: false, // Set to true for development
        FEATURES: {
            GOOGLE_AUTH: true,
            CALENDAR_INTEGRATION: true,
            FITNESS_TRACKING: true,
            NEWS_INTEGRATION: true,
            ML_RECOMMENDATIONS: true,
            VECTOR_SEARCH: true
        }
    }
};

// Environment-specific settings
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    CONFIG.APP.DEBUG = true;
}

// Export for use in other files
window.CONFIG = CONFIG;