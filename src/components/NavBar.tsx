import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/NavBar.css';

const NavBar = () => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <nav className="navbar">
      <button className="navbar-toggle" onClick={toggleCollapsed}>
        <span className="navbar-toggle-icon"></span>
      </button>
      <ul className={collapsed? 'navbar-collapse collapsed' : 'navbar-collapse'}>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/inventory">Inventory</Link>
        </li>
        <li>
          <Link to="/orders">Orders</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;