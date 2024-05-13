// import React from 'react';
// import '../css/ProductSummary.css'; // Make sure CSS file is imported

// interface ProductSummaryProps {
//     product: {
//         id: string;
//         name: string;
//         buyingPrice: string;
//         category: string;
//         expiryDate: string;
//         threshold: number;
//         supplierName: string;
//         contactNumber: string;
//         storeNames: string[]; // Assuming multiple stores
//         stockInHand: number[];
//         imageUrl?: string;
//     };
//     closeModal: () => void;
// }

// const ProductSummary: React.FC<ProductSummaryProps> = ({ product, closeModal }) => {
//     return (
//         <div className="modal-backdrop">
//             <div className="modal-content">
//                 <div className="modal-header">
//                     <h1>{product.name}</h1>
//                     <div className="header-buttons">
//                         <button>Edit</button>
//                         <button>Download</button>
//                     </div>
//                 </div>
//                 <div className="modal-body">
//                     <div className="left-panel">
//                         <section className="primary-details">
//                             <h2>Primary Details</h2>
//                             <p><strong>Product ID:</strong> {product.id}</p>
//                             <p><strong>Product Category:</strong> {product.category}</p>
//                             <p><strong>Expiry Date:</strong> {product.expiryDate}</p>
//                             <p><strong>Threshold Value:</strong> {product.threshold}</p>
//                         </section>
//                         <section className="supplier-details">
//                             <h2>Supplier Details</h2>
//                             <p><strong>Supplier Name:</strong> {product.supplierName}</p>
//                             <p><strong>Contact Number:</strong> {product.contactNumber}</p>
//                         </section>
//                         <section className="stock-locations">
//                             <h2>Stock Locations</h2>
//                             {product.storeNames.map((storeName, index) => (
//                                 <p key={storeName}><strong>{storeName}:</strong> {product.stockInHand[index]}</p>
//                             ))}
//                         </section>
//                     </div>
//                     <div className="right-panel">
//                         <img src={product.imageUrl || "path/to/default/image.png"} alt="Product" />
//                     </div>
//                 </div>
//                 <button className="close-button" onClick={closeModal}>Close</button>
//             </div>
//         </div>
//     );
// }

// export default ProductSummary;
