import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// IMPORTANT: Replace with your actual Firebase project configuration
// You can find these values in your Firebase project settings.
export const firebaseConfig = {
  apiKey: "AIzaSyCCuv7JPPVbPJZxQVz4EBwP5MJ-pLR4GfY",
  authDomain: "vigha-calculate.firebaseapp.com",
  projectId: "vigha-calculate",
  storageBucket: "vigha-calculate.appspot.com",
  messagingSenderId: "731017751410",
  appId: "1:731017751410:web:a1866fb14d0fe5e6e3cbeb",
  measurementId: ""
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
