import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Log Firebase config (without sensitive values)
const logFirebaseConfig = () => {
  console.log('Firebase Configuration:');
  console.log('- API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Not set');
  console.log('- Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  console.log('- Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  console.log('- Storage Bucket:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
  console.log('- Messaging Sender ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Not set');
  console.log('- App ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Not set');
};

// Check that all required environment variables are set
const checkEnvVars = () => {
  const required = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required Firebase environment variables:', missing.join(', '));
    return false;
  }
  
  return true;
};

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Log environment info
logFirebaseConfig();
checkEnvVars();

// Initialize Firebase
let app;
let db;
let auth;
let storage;

try {
  console.log('Initializing Firebase...');
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  console.log('Firebase app initialized successfully');
  
  console.log('Initializing Firestore...');
  db = getFirestore(app);
  console.log('Firestore initialized successfully');
  
  console.log('Initializing Auth...');
  auth = getAuth(app);
  console.log('Auth initialized successfully');
  
  console.log('Initializing Storage...');
  storage = getStorage(app);
  console.log('Storage initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw new Error(`Firebase initialization failed: ${error instanceof Error ? error.message : String(error)}`);
}

export { app, db, auth, storage }; 