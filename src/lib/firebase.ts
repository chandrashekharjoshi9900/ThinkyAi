// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBXMrhGtxRubcHYWQzQRQgutknt9flgcf0",
  authDomain: "learn-ai-37745.firebaseapp.com",
  projectId: "learn-ai-37745",
  storageBucket: "learn-ai-37745.firebasestorage.app",
  messagingSenderId: "1091612791084",
  appId: "1:1091612791084:web:2f7342be3535e83e9a9c89",
  measurementId: "G-5RJYWPW07K"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
