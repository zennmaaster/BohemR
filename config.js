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
    
    // Microsoft Graph API (Azure AD)
    MICROSOFT: {
        CLIENT_ID: 'YOUR_AZURE_APP_CLIENT_ID',
        AUTHORITY: 'https://login.microsoftonline.com/common',
        REDIRECT_URI: window.location.origin,
        SCOPES: ['https://graph.microsoft.com/calendars.read']
    },
    
    // App Settings
    APP: {
        NAME: 'BohemR',
        VERSION: '1.0.0',
        DEBUG: false // Set to true for development
    }
};

// Environment-specific settings
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    CONFIG.APP.DEBUG = true;
}

// Export for use in other files
window.CONFIG = CONFIG;