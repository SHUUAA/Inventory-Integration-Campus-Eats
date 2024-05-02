import '../css/ProductList.css';

const ProductList = () => {
    const products = [
        { name: "Adobo", buyingPrice: "₱320", quantity: 50, threshold: 10, expiryDate: "N/A", availability: "In stock" },
        { name: "Sinigang", buyingPrice: "₱350", quantity: 40, threshold: 8, expiryDate: "N/A", availability: "In stock" },
        { name: "Lechon", buyingPrice: "₱1500", quantity: 5, threshold: 2, expiryDate: "N/A", availability: "Limited stock" },
        { name: "Pancit", buyingPrice: "₱250", quantity: 30, threshold: 5, expiryDate: "N/A", availability: "In stock" }
    ];

    return (
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
                <div className="inv-column">Product</div>
                <div className="inv-column">Buying Price</div>
                <div className="inv-column">Quantity</div>
                <div className="inv-column">Threshold Value</div>
                <div className="inv-column">Expiry Date</div>
                <div className="inv-column">Availability</div>
            </div>
            {products.map(product => (
                <div className="inv-header-row inv-data-row" key={product.name}>
                    <div className="inv-column">{product.name}</div>
                    <div className="inv-column">{product.buyingPrice}</div>
                    <div className="inv-column">{product.quantity}</div>
                    <div className="inv-column">{product.threshold}</div>
                    <div className="inv-column">{product.expiryDate}</div>
                    <div className="inv-column">{product.availability}</div>
                </div>
            ))}
        </div>
    );
}

export default ProductList;
