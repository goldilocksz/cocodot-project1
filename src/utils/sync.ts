export const registerSync = async () => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready
    try {
      await registration.sync.register('sync-gps-data')
      console.log('Sync registered')
    } catch (error) {
      console.error('Sync registration failed:', error)
    }
  } else {
    console.warn('Background Sync is not supported')
  }
}
