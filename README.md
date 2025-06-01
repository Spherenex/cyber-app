# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)




<!-- 

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
export { app, database, storage }; -->