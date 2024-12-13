// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "commcoord-app.firebaseapp.com",
  projectId: "commcoord-app",
  storageBucket: "commcoord-app.firebasestorage.app",
  messagingSenderId: "1029271475238",
  appId: "1:1029271475238:web:09dba179dc40b1a0ed02e7",
  measurementId: "G-WJXJ735WFH",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
