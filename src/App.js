import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard'; // Import other components for routes
import Inventory from './components/Inventory';
import Settings from './components/Settings';
import Orders from './components/Orders';
const App = () => {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/settings" element={<Settings />} />
          {/* Define other routes here */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
