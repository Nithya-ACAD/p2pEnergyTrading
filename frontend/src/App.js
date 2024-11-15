import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ConsumerDashboard from './components/ConsumerDashboard';
import ProsumerDashboard from './components/ProsumerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/consumer-dashboard" element={<ConsumerDashboard />} />
        <Route path="/prosumer-dashboard" element={<ProsumerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
