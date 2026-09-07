/* global importScripts, firebase */
// Background FCM handler. Loaded by the browser directly (not via Vite), so
// it uses the classic importScripts + compat SDK rather than ES modules.
// Config values below are the public Firebase client config (same as
// src/firebase.js) - safe to ship, they are not secrets.
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAaPIoTXn09_uYHdrCi0XS3P4nnCSzMbEM',
  authDomain: 'crop-companion-ee589.firebaseapp.com',
  projectId: 'crop-companion-ee589',
  storageBucket: 'crop-companion-ee589.firebasestorage.app',
  messagingSenderId: '261559538656',
  appId: '1:261559538656:web:f8c145231d8c2672c3d185'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'Crop Companion', {
    body: body || '',
    icon: '/vite.svg'
  });
});
