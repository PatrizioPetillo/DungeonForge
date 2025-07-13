// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDGLK8tgrIlCQ7LFfV4bqKPdy79jp91Q_c",
  authDomain: "dungeon-forge-ea42c.firebaseapp.com",
  projectId: "dungeon-forge-ea42c",
  storageBucket: "dungeon-forge-ea42c.firebasestorage.app",
  messagingSenderId: "628724643805",
  appId: "1:628724643805:web:8e31a97b4d69915b0be834",
  measurementId: "G-HW0V6LVHM5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
