import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './componets/login';
import DayNotePage from './componets/daynote';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData); // Save user data, including userId
    console.log("User logged in:", userData);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/daynote" element={<DayNotePage user={user} />} /> {/* Pass user data */}
      </Routes>
    </Router>
  );
};

export default App;
