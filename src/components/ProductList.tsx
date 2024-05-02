import '../css/Inventory.css';

const ProductList = () => {
    return (
        <div>
            <div className="grid grid-cols-1 gap-4 lg:gap-8">
                <div className="inv-inventory-container">
                    <div className="header-and-buttons">
                        <h1 className="inv-inventory-header">Products</h1>
                        <div className="button-row">
                            <button className="add-product-button">Add Product</button>
                            <button className="other-button">Filters</button>
                            <button className="other-button">Download all</button>
                        </div>
                    </div>
                    <div className="inv-header-row">
                        <div className="inv-column">Products</div>
                        <div className="inv-column">Buying Price</div>
                        <div className="inv-column">Quantity</div>
                        <div className="inv-column">Threshold Value</div>
                        <div className="inv-column">Expiry Date</div>
                        <div className="inv-column">Availability</div>
                    </div>
                </div>
                <div className="h-48 rounded-lg bg-white-950"></div>
            </div>
        </div>
    );
}

export default ProductList;
