// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDChuuX9RJqqaqZ2kaVXJlbH_TaHPQjyT4",
  authDomain: "quizz-2bfd1.firebaseapp.com",
  projectId: "quizz-2bfd1",
  storageBucket: "quizz-2bfd1.firebasestorage.app",
  messagingSenderId: "642519187981",
  appId: "1:642519187981:web:5c5948ae9404edf95a4b44",
  measurementId: "G-Z4Z01CTDNZ"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Analytics (optionnel)
const analytics = getAnalytics(app);

// Initialiser Firestore et l'exporter
const db = getFirestore(app);

// Exporter tout ce qu'il faut
export { app, db, analytics };
