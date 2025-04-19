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

import React, { useState } from 'react';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard username={username} />
      )}
    </div>
  );
}

export default App;
