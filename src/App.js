

// import React, { useState } from 'react';
// import Login from './components/Login/Login';
// import Dashboard from './components/Dashboard/Dashboard';
// import './App.css';

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [username, setUsername] = useState('');

//   const handleLogin = (user) => {
//     setUsername(user);
//     setIsLoggedIn(true);
//   };

//   return (
//     <div className="App">
//       {!isLoggedIn ? (
//         <Login onLogin={handleLogin} />
//       ) : (
//         <Dashboard username={username} />
//       )}
//     </div>
//   );
// }

// export default App;



// import React, { useState } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/Login/Login';
// import Dashboard from './components/Dashboard/Dashboard';
// import ImageDataCollector from './components/AIClassifier/ImageDataCollector';
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import './App.css';

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyA9nu_vtGgDos64AarR88Z7CfTWksHN_3I",
//   authDomain: "cyber-security-89312.firebaseapp.com",
//   projectId: "cyber-security-89312",
//   storageBucket: "cyber-security-89312.firebasestorage.app",
//   messagingSenderId: "556823345671",
//   appId: "1:556823345671:web:de3bd455f1bcf56e3748a2",
//   measurementId: "G-SD5H9V3163"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [username, setUsername] = useState('');

//   const handleLogin = (user) => {
//     setUsername(user);
//     setIsLoggedIn(true);
//   };

//   return (
//     <BrowserRouter>
//       <div className="App">
//         <Routes>
//           <Route path="/data-collector" element={<ImageDataCollector />} />
//           <Route path="/" element={
//             !isLoggedIn ? 
//               <Login onLogin={handleLogin} /> : 
//               <Dashboard username={username} />
//           } />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;



import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import ImageDataCollector from './components/AIClassifier/ImageDataCollector';
import './App.css';

// Firebase is initialized in the firebase.js file
// We don't need to initialize it again here

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/data-collector" element={<ImageDataCollector />} />
          <Route path="/" element={
            !isLoggedIn ? 
              <Login onLogin={handleLogin} /> : 
              <Dashboard username={username} />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;