// service-worker.js
self.addEventListener('push', function(event) {
    const options = {
        body: 'Il y a une nouveauté sur le site ! Revenez vite pour découvrir les dernières informations.',
        icon: './assets/Icon.png',
        badge: './assets/badge.png'
    };

    event.waitUntil(
        self.registration.showNotification('Il y a une nouveauté sur le site Accompagnement Finale ! Revenez vite pour découvrir les dernières informations en cliquant ici.', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});