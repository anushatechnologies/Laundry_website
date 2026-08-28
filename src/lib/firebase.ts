// Firebase initialisation — singleton safe for Next.js SSR
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential, type ConfirmationResult, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBa1Arilraettuqi_8IA0v4Qae0mwrkYjQ',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'anushabazaar-2288e.firebaseapp.com',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'anushabazaar-2288e',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'anushabazaar-2288e.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '64875938387',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:64875938387:web:18a14146ee6d32c6ba7ca6',
};

let auth: Auth | null = null;
if (typeof window !== 'undefined' && firebaseConfig.apiKey) {
  try {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (err) {
    console.warn('Firebase client auth init notice:', err);
  }
}

export { auth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential };
export type { ConfirmationResult };
