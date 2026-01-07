// Run this in browser console to completely clear all caches
(async function() {
  console.log('🧹 Starting cache cleanup...');
  
  // Unregister all service workers
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log('✅ Service worker unregistered');
    }
  }
  
  // Clear all caches
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      await caches.delete(cacheName);
      console.log('✅ Cache deleted:', cacheName);
    }
  }
  
  // Clear localStorage
  localStorage.clear();
  console.log('✅ LocalStorage cleared');
  
  // Clear sessionStorage
  sessionStorage.clear();
  console.log('✅ SessionStorage cleared');
  
  console.log('✨ All caches cleared! Reloading page...');
  window.location.reload(true);
})();
