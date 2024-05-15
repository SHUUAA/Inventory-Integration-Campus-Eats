import React, { useEffect, useState } from "react";
import { database } from "../firebase/Config";
import { collection, getDocs, query } from "firebase/firestore";
import "../css/InventorySummary.css";
import FirebaseController from "../firebase/FirebaseController";

import SalesIcon from '../assets/cash-outline.svg';
import QuantityIcon from '../assets/cube-outline.svg';
import PurchaseIcon from '../assets/bag-check-outline.svg';
import SuppliersIcon from '../assets/people-outline.svg';

const InventorySummary  = () => {
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const firebaseController = new FirebaseController();

  useEffect(() => {
    const getProductList = async () => {
      try {
        const user = await firebaseController.getCurrentUser();
        if (!user) {
          console.error("User not authenticated!");
          return;
        }
        const userID = user.uid;
        const userProductsQuery = query(
          collection(database, "products", userID, "userProducts")
        );
        const data = await getDocs(userProductsQuery);
        const products = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductList(products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getProductList();
  }, []);

  // Filter products with quantity less than or equal to the threshold
  const lowStockProducts = productList.filter(product => product.quantity <= product.threshold);

  // Sort products based on sales for the top selling products
  const topSellingProducts = productList.sort((a, b) => b.sales - a.sales);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='main-content'>
      <div className="summary-containers">
        <div className="summary-container">
          <div>
            <h3>₱{productList.reduce((sum, product) => sum + parseFloat(product.sales || 0), 0).toFixed(2)}</h3>
            <span>Sales</span>
          </div>
          <img src={SalesIcon} alt="Sales Icon" className="svg-icon" />
        </div>
        <div className="summary-container">
          <div>
            <h3>{productList.reduce((sum, product) => sum + parseInt(product.quantity || 0), 0)}</h3>
            <span>Quantity in Hand</span>
          </div>
          <img src={QuantityIcon} alt="Quantity Icon" className="svg-icon" />
        </div>
        <div className="summary-container">
          <div>
            <h3>--</h3>
            <span>Purchase</span>
          </div>
          <img src={PurchaseIcon} alt="Purchase Icon" className="svg-icon" />
        </div>
        <div className="summary-container">
          <div>
            <h3>--</h3>
            <span>Number of Suppliers</span>
          </div>
          <img src={SuppliersIcon} alt="Suppliers Icon" className="svg-icon" />
        </div>
      </div>
      <div className="flex-container">
        <div className="product-list-container">
          <h1>Top Selling Stock</h1>
          <div className="table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sold Quantity</th>
                  <th>Remaining Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {topSellingProducts.length === 0 ? (
                  <tr>
                    <td colSpan="4">No products available</td>
                  </tr>
                ) : (
                  topSellingProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>--</td>
                      <td>{product.quantity}</td>
                      <td>₱{product.buyingPrice}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="see-all">See All</div>
        </div>
        <div className="low-stock-container">
  <h1>Low Quantity Stock</h1>
  <div className="table-container">
    <table className="product-table">
      <tbody>
        {lowStockProducts.length === 0 ? (
          <tr>
            <td colSpan="3">No low stock products</td>
          </tr>
        ) : (
          lowStockProducts.map((product) => (
            <tr key={product.id}>
              <td>
                <img
                  src={product.imageUrl || "/path-to-default-image.png"}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = "/path-to-default-image.png";
                  }}
                />
              </td>
              <td>
                <div>
                  <span>{product.name}</span>
                  <span>Remaining Quantity: {product.quantity}</span>
                </div>
              </td>
              <td>
                  low
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
  <div className="see-all">See All</div>
</div>
      </div>
    </div>
  );
}

export default InventorySummary;
