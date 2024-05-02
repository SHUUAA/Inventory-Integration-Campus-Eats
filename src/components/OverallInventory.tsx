import '../css/OverallInventory.css';

const OverallInventory = () => {
  return (
    <div>
      <div className="overall-inventory-container container-rounded">
    <h1 className="overall-inventory-header">Overall Inventory</h1>
    <div className="overall-header-row">
        <div className="overall-column">
            Categories
            <span className="column-text">14</span>
            <span className="column-subtext">Last 7 Days</span>
        </div>
        <div className="overall-column">
            Total Products
            <span className="column-text">342</span>
            <span className="column-subtext">Last 7 Days</span>
        </div>
        <div className="overall-column">
            Top Selling
            <span className="column-text">5</span>
            <span className="column-subtext">Last 7 Days</span>
        </div>
        <div className="overall-column">
            Low Stocks
            <span className="column-text">12</span>
            <span className="column-subtext">Ordered</span>
        </div>
    </div>
</div>
    </div>
  );
};

export default OverallInventory;
