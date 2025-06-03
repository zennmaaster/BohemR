// BohemR Service Worker for PWA functionality

const CACHE_NAME = 'bohemr-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/config.js',
    '/permissions.js',
    '/personality.js',
    '/recommendations.js',
    '/app.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', event => {
    console.log('[SW] Install event');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('[SW] App shell cached');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activate event');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[SW] Cache cleanup complete');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version if available
                if (response) {
                    console.log('[SW] Serving from cache:', event.request.url);
                    return response;
                }
                
                // Otherwise fetch from network
                console.log('[SW] Fetching from network:', event.request.url);
                return fetch(event.request).then(response => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response since it's a stream
                    const responseToCache = response.clone();
                    
                    // Add to cache for future use
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
            .catch(() => {
                // If both cache and network fail, show offline page
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});

// Background sync for data when connection restored
self.addEventListener('sync', event => {
    console.log('[SW] Background sync:', event.tag);
    
    if (event.tag === 'background-sync-recommendations') {
        event.waitUntil(syncRecommendations());
    }
});

// Sync recommendations when back online
async function syncRecommendations() {
    try {
        // Send any pending feedback or analytics
        console.log('[SW] Syncing recommendations data');
        
        // Notify app that sync is complete
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_COMPLETE',
                data: 'recommendations'
            });
        });
    } catch (error) {
        console.log('[SW] Sync failed:', error);
    }
}

// Handle push notifications
self.addEventListener('push', event => {
    console.log('[SW] Push received');
    
    const options = {
        body: event.data ? event.data.text() : 'New personalized recommendation available!',
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'See Recommendation',
                icon: '/icon-72x72.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icon-72x72.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('BohemR', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('[SW] Notification click received');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        // Open app and navigate to recommendations
        event.waitUntil(
            clients.openWindow('/?notification=true')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Handle messages from main app
self.addEventListener('message', event => {
    console.log('[SW] Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Periodic background fetch for fresh recommendations
self.addEventListener('periodicsync', event => {
    if (event.tag === 'refresh-recommendations') {
        event.waitUntil(refreshRecommendations());
    }
});

async function refreshRecommendations() {
    try {
        console.log('[SW] Refreshing recommendations in background');
        
        // This would fetch new recommendations based on user patterns
        // For now, just notify the app
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'RECOMMENDATIONS_REFRESHED',
                timestamp: Date.now()
            });
        });
    } catch (error) {
        console.log('[SW] Background refresh failed:', error);
    }
}