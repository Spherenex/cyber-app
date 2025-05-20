// firebase.js - Centralized Firebase configuration
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9nu_vtGgDos64AarR88Z7CfTWksHN_3I",
  authDomain: "cyber-security-89312.firebaseapp.com",
  databaseURL: "https://cyber-security-89312-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cyber-security-89312",
  storageBucket: "cyber-security-89312.firebasestorage.app",
  messagingSenderId: "556823345671",
  appId: "1:556823345671:web:de3bd455f1bcf56e3748a2",
  measurementId: "G-SD5H9V3163"
};

// Initialize Firebase with unique name to prevent duplicate app errors
let app;
let database;
let storage;

// Wrap initialization in try-catch to handle potential errors
try {
  // Use a unique app name 'cybershield' to avoid conflicts
  app = initializeApp(firebaseConfig, 'cybershield');
  database = getDatabase(app);
  storage = getStorage(app);
  
  // Initialize analytics if not in a test environment
  try {
    const analytics = getAnalytics(app);
  } catch (analyticsError) {
    console.log("Analytics initialization skipped");
  }
  
  console.log("Firebase initialized successfully with app name: cybershield");
} catch (error) {
  // Handle initialization errors
  console.error("Firebase initialization error:", error);
  
  // If duplicate app error, try to get the existing app
  if (error.code === 'app/duplicate-app') {
    console.log("Using existing Firebase app");
    try {
      // Get the existing instances
      app = initializeApp(firebaseConfig);
      database = getDatabase();
      storage = getStorage();
    } catch (secondaryError) {
      console.error("Failed to get existing Firebase instances:", secondaryError);
    }
  }
}

// Export the initialized instances
export { app, database, storage };