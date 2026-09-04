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

export function firebasePhoneErrorMessage(error: unknown): string {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
  const message = typeof error === 'object' && error && 'message' in error ? String(error.message) : '';

  if (code.includes('invalid-phone-number')) return 'Enter a valid 10-digit Indian mobile number.';
  if (code.includes('too-many-requests')) return 'Too many OTP attempts. Please wait a few minutes and try again.';
  if (code.includes('quota-exceeded')) return 'Firebase SMS quota is currently exhausted. Please try again later.';
  if (code.includes('invalid-verification-code')) return 'That 6-digit verification code is incorrect. Please check and try again.';
  if (code.includes('session-expired')) return 'This verification code has expired. Please request a new code.';
  if (code.includes('unauthorized-domain')) return 'This website is not authorised for Firebase phone verification.';
  if (code.includes('network-request-failed')) return 'Network error. Please check your internet connection and try again.';
  return message || 'Firebase could not complete phone verification. Please try again.';
}

export { auth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential };
export type { ConfirmationResult };
