import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-aU1eRT7yDuH0WqA49kj5gp_M3nTX168",
  authDomain: "website-d1f45.firebaseapp.com",
  projectId: "website-d1f45",
  storageBucket: "website-d1f45.firebasestorage.app",
  messagingSenderId: "918193011490",
  appId: "1:918193011490:web:f36ed6566c92231606837b",
  measurementId: "G-FN91CS8KQW"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  // Prevent multiple initializations in hot-reload environments
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  
  auth = getAuth(app);
  db = getFirestore(app);
  
} catch (error) {
  console.error("Firebase Initialization Error:", error);
  // We allow the app to crash or degrade gracefully if keys are invalid in this demo env
}

export { auth, db, app };
export const appId = "website-d1f45";
