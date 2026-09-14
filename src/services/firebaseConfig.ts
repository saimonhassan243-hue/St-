/**
 * Centralized Firebase Configuration referencing environment variables
 */

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'toppers-progresss',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    'https://toppers-progresss-default-rtdb.firebaseio.com',
};

// Base Realtime Database REST API endpoint URL
export const RTDB_BASE_URL: string = (
  firebaseConfig.databaseURL || 'https://toppers-progresss-default-rtdb.firebaseio.com'
).replace(/\/$/, '');
