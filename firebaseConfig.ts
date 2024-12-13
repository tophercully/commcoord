import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "commcoord-app.firebaseapp.com",
  projectId: "commcoord-app",
  storageBucket: "commcoord-app.firebasestorage.app",
  messagingSenderId: "1029271475238",
  appId: "1:1029271475238:web:09dba179dc40b1a0ed02e7",
  measurementId: "G-WJXJ735WFH",
  // Realtime Database URL
  databaseURL: "https://commcoord-app-default-rtdb.firebaseio.com",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
