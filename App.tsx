import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// A Layout wrapper if we want consistent Navbar/Footer, 
// but Home has its own structure and Dashboard might differ.
// For now, simple routing is best.

const App: React.FC = () => {
  return (
    <div className="font-sans text-darkText bg-page min-h-screen selection:bg-smile-mid selection:text-white">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;