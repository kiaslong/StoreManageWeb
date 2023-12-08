import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { Navigate, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  const { currentUser, loading } = useContext(AuthContext);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    setAuthReady(true);
  }, []);

  if (!authReady || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={currentUser ? <Home /> : <Navigate to="/login" replace />} 
          />
          <Route
            path="/login"
            element={!currentUser ? <Login /> : <Navigate to="/" replace />} 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
