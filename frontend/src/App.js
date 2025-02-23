import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/user", { withCredentials: true })
      .then(response => setUser(response.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <Router>
      <Routes>
        {/* If user is logged in, show Dashboard, otherwise redirect to Home */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

const Home = () => (
  <div>
    <h2>Welcome to GitHub OAuth Explorer</h2>
    <button onClick={() => window.location.href = "http://localhost:5000/auth/github"}>
      Login with GitHub
    </button>
  </div>
);


export default App;
