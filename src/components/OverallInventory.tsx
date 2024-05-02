import '../css/Inventory.css';

const OverallInventory = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:gap-8">
        <div className="inv-inventory-container">
          <h1 className="inv-inventory-header">Overall Inventory</h1>
          <div className="inv-header-row">
            <div className="inv-column">Categories</div>
            <div className="inv-column">Total Products</div>
            <div className="inv-column">Top Selling</div>
            <div className="inv-column">Low Stocks</div>
          </div>
        </div>
        <div className="h-48 rounded-lg bg-white-950"></div>
      </div>
    </div>
  );
};

export default OverallInventory;