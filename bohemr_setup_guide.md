# BohemR Setup Guide

## 🚀 Quick Start

1. **Copy all files** to your web server or hosting platform
2. **Update API keys** in `config.js`
3. **Deploy** and share the URL for testing

## 📁 File Structure

```
bohemr/
├── index.html              # Main app file
├── styles.css              # All styling
├── config.js               # API keys and configuration
├── permissions.js          # Permission handling
├── personality.js          # Personality assessment
├── recommendations.js      # Recommendation engine
├── app.js                  # Main application logic
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
└── icons/                  # App icons (create these)
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    └── icon-512x512.png
```

## 🔑 API Keys Setup

### 1. OpenWeatherMap (Already configured)
- ✅ **API Key**: `d53d12aaa3d02f42aab749a0860e17c0`
- ✅ **Already added** to `config.js`

### 2. Google Calendar OAuth Setup

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing one
3. Enable **Google Calendar API**

#### Step 2: Create OAuth Credentials
1. Go to **APIs & Services > Credentials**
2. Click **+ CREATE CREDENTIALS > OAuth client ID**
3. Choose **Web application**
4. Add your domain to **Authorized JavaScript origins**:
   ```
   https://yourdomain.com
   https://yourapp.netlify.app
   ```
5. Add to **Authorized redirect URIs**:
   ```
   https://yourdomain.com
   https://yourapp.netlify.app
   ```

#### Step 3: Update config.js
```javascript
GOOGLE: {
    CLIENT_ID: 'your-client-id.apps.googleusercontent.com',
    API_KEY: 'your-google-api-key',
    // ... rest stays the same
}
```

### 3. Microsoft Graph (Outlook) Setup

#### Step 1: Register Azure AD Application
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory > App registrations**
3. Click **+ New registration**
4. Fill in:
   - **Name**: BohemR
   - **Supported account types**: Accounts in any organizational directory and personal Microsoft accounts
   - **Redirect URI**: Web - `https://yourdomain.com`

#### Step 2: Configure API Permissions
1. Go to **API permissions**
2. Click **+ Add a permission**
3. Choose **Microsoft Graph > Delegated permissions**
4. Add: `Calendars.Read`
5. Click **Grant admin consent**

#### Step 3: Update config.js
```javascript
MICROSOFT: {
    CLIENT_ID: 'your-azure-app-client-id',
    // ... rest stays the same
}
```

## 🌐 Deployment Options

### Option 1: Netlify (Recommended)
1. Drag & drop all files to [netlify.com](https://netlify.com)
2. Get instant URL: `https://amazing-app-123.netlify.app`
3. Custom domain available

### Option 2: Vercel
1. Upload to [vercel.com](https://vercel.com)
2. Automatic deployment from GitHub
3. Edge functions support

### Option 3: GitHub Pages
1. Create GitHub repository
2. Upload all files
3. Enable Pages in repository settings
4. URL: `https://username.github.io/bohemr`

### Option 4: Your Own Server
1. Upload files to web root
2. Ensure HTTPS (required for PWA features)
3. Configure proper MIME types

## 📱 PWA Icon Setup

Create icons in these sizes and place in `/icons/` folder:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

**Quick icon generation**:
1. Create a 512x512 PNG logo
2. Use [PWA Icon Generator](https://www.pwabuilder.com/imageGenerator)
3. Download all sizes

## ✅ Testing Checklist

### Local Testing
- [ ] All files load without errors
- [ ] Personality assessment works (5 questions)
- [ ] Progressive onboarding works (3 questions)
- [ ] Recommendations generate properly
- [ ] Feedback system works (5 levels)
- [ ] Visual effects and animations work

### Permission Testing
- [ ] Location permission requests properly
- [ ] Weather updates with real location
- [ ] Notification permission works
- [ ] Test notifications send correctly
- [ ] Calendar permission flow works

### PWA Testing
- [ ] Manifest loads correctly
- [ ] Service worker registers
- [ ] App is installable on mobile
- [ ] Works offline after first visit
- [ ] Icons appear correctly

### API Testing
- [ ] Weather API returns data
- [ ] Google Calendar connects (if configured)
- [ ] Outlook Calendar connects (if configured)

## 🐛 Troubleshooting

### Common Issues

#### "Weather not loading"
- Check API key in `config.js`
- Verify HTTPS (required for geolocation)
- Check browser console for errors

#### "Calendar won't connect"
- Verify OAuth credentials
- Check redirect URIs match exactly
- Ensure APIs are enabled in Google Cloud/Azure

#### "App won't install"
- Check manifest.json is accessible
- Verify all required icon sizes exist
- Ensure HTTPS deployment

#### "Notifications not working"
- Check HTTPS requirement
- Verify permission was granted
- Test in different browsers

### Debug Mode
Set `CONFIG.APP.DEBUG = true` in `config.js` for detailed console logging.

## 🚀 Going Live

1. **Update config.js** with all real API keys
2. **Test thoroughly** on different devices
3. **Deploy to production** hosting
4. **Share URL** with test users
5. **Collect feedback** using built-in feedback system

## 📊 Analytics & Learning

The app includes built-in learning systems:
- User feedback collection
- Personality pattern analysis
- Recommendation effectiveness tracking
- Context awareness learning

All data is stored locally and in console logs (in debug mode) for analysis.

## 🔒 Privacy & Security

- No personal data sent to external servers
- All processing happens client-side
- API keys are for publicly available data only
- User preferences stored locally only

## 📞 Support

For technical issues:
1. Check browser console for errors
2. Verify all files are uploaded correctly
3. Test API endpoints manually
4. Check HTTPS requirements

The app is designed to work progressively - core functionality works even if some APIs fail.
