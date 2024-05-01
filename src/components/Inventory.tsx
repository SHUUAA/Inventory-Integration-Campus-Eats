import React, { useState } from 'react';
import '../css/Inventory.css';
import searchIcon from '../../public/assets/searchicon.png';
import notificationIcon from '../../public/assets/notificationicon.png';
import profileIcon from '../../public/assets/profileicon.png';

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      console.log('Searching for:', searchTerm);
  };

  const toggleNotifications = () => {
      setShowNotifications(!showNotifications);
  };

  const toggleProfileOptions = () => {
      setShowProfileOptions(!showProfileOptions);
  };

  return (
      <div className="inventory-container">
          <div className="inventory-header">
              <form onSubmit={handleSearchSubmit} className="search-form">
                  <div className="search-box">
                      <img src={searchIcon} alt="Search" className="search-icon" onClick={handleSearchSubmit}/>
                      <input
                          type="text"
                          placeholder="Search product, supplier, orders"
                          value={searchTerm}
                          onChange={handleSearchChange}
                          className="search-input"
                      />
                  </div>
              </form>
              <div className="icon-container">
                  <div className="icon-notif" onClick={toggleNotifications}>
                      <img src={notificationIcon} alt="Notifications" />
                      {showNotifications && <div className="dropdown-menu">NEED PAG INFO</div>}
                  </div>
                  <div className="icon-profile" onClick={toggleProfileOptions}>
                      <img src={profileIcon} alt="Profile" />
                      {showProfileOptions && <div className="dropdown-menu">NEED PAG INFO</div>}
                  </div>
              </div>
          </div>
      </div>
  );
};

export default Inventory;
