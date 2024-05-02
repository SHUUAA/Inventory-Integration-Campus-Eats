import React from 'react';
import OverallInventory from "../components/OverallInventory";
import ProductList from "../components/ProductList";

const Inventory: React.FC = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:gap-12">
        <div className="h-auto rounded-lg bg-white-950 container-rounded">
          <OverallInventory />
        </div>
        <div className="h-auto rounded-lg bg-white-950 container-rounded">
          <ProductList />
        </div>
      </div>
    </div>
  );
};

export default Inventory;
