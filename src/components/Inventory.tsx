import React, { useState } from 'react';
import '../css/Inventory.css';
import searchIcon from '../../public/assets/searchicon.png';

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      console.log('Searching for:', searchTerm); 
  };

  return (
      <div className="inventory-container">
          <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-box">
                  <img src={searchIcon} alt="Search" className="search-icon" onClick={handleSearchSubmit}/>
                  <input
                      type="text"
                      placeholder="Search product, supplier, order"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="search-input"
                  />
              </div>
          </form>
      </div>
  );
};

export default Inventory;
