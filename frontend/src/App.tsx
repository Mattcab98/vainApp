import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ShopDashboard from './pages/ShopDashboard';
import './index.css';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return token ? <>{children}</> : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup setToken={setToken} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard token={token} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop-dashboard"
          element={
            <ProtectedRoute>
              <ShopDashboard token={token} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
