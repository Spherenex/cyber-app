


// import React, { useState } from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from './components/Login/Login';
// import Dashboard from './components/Dashboard/Dashboard';
// import ImageDataCollector from './components/AIClassifier/ImageDataCollector';
// import './App.css';

// // Firebase is initialized in the firebase.js file
// // We don't need to initialize it again here

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
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;
