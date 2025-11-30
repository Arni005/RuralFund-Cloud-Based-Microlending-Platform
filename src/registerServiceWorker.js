// src/registerServiceWorker.js
import { Workbox } from 'workbox-window';

export function registerSW(onMessage) {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');

    wb.addEventListener('installed', (evt) => {
      // you can use this to prompt user about update
      console.log('Service Worker installed:', evt);
    });

    wb.addEventListener('message', (evt) => {
      if (onMessage) onMessage(evt);
    });

    wb.register().catch(err => console.error('SW registration failed:', err));
  }
}
