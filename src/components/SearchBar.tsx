import React, { useState } from "react";
import profileIcon from "../../public/assets/profileicon.png";
import "../css/SearchBar.css";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Searching for:", searchTerm);
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
            <button type="submit" className="search-icon">
              {" "}
              {/* Add button */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                style={{ stroke: '#ccc' }}
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
</svg>

            {showNotifications && (
              <div className="dropdown-menu">NEED PAG INFO</div>
            )}
          </div>
          <div className="icon-profile" onClick={toggleProfileOptions}>
            <img src={profileIcon} alt="Profile" />
            {showProfileOptions && (
              <div className="dropdown-menu">NEED PAG INFO</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
