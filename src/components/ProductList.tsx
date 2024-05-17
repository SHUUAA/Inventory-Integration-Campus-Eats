import React, { useEffect, useState } from "react";
import { database } from "../firebase/Config";
import { collection, doc, getDocs, query } from "firebase/firestore";
import AddProductForm from "./AddProductForm";
import ProductSummary from "./ProductSummary";
import "../css/ProductList.css";
import FirebaseController from "../firebase/FirebaseController";
import { useNavigate } from "react-router-dom";
const firebaseController = new FirebaseController();
const user = await firebaseController.getCurrentUser();
export interface Product {
  id: number;
  name: string;
  buyingPrice: number;
  quantity: number;
  threshold: number;
  expiryDate: string;
  availability: string;
  category: string;
  supplierName: string;
  contactNumber: string;
  storeNames: string[];
  stockInHand: number[];
  imageUrl?: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: "ascending" | "descending";
  } | null>(null);
  const userID = user?.uid;

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user || !userID) {
        console.error("User not authenticated or missing UID!");
        return;
      }
      const userProductsQuery = query(
        collection(database, "products", userID, "userProducts")
      );
      const querySnapshot = await getDocs(userProductsQuery);
      const productList = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Product)
      );
      setProducts(productList);
    };
    fetchProducts();
  }, []);

  const sortProducts = (key: keyof Product) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    } else {
      direction = "ascending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof Product): string => {
    if (sortConfig && sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? " ↓" : " ↑";
    }
    return "";
  };

  const navigate = useNavigate();
  const handleProductList = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  const getAvailabilityStatus = (quantity: number) => {
    if (quantity <= 0) {
      return { text: "Out of Stock", color: "red" };
    } else if (quantity <= 10) {
      return { text: "Low Stock", color: "#FFBA18" };
    } else {
      return { text: "In Stock", color: "green" };
    }
  };



  return (
    <div className="inv-inventory-container">
      <div className="header-and-buttons">
        <h1 className="inv-inventory-header">Products</h1>
        <div className="button-row">
          <button
            className="add-product-button shadow-md"
            onClick={() => setShowModal(true)}
          >
            Add Product
          </button>
        </div>
      </div>
      <div className="inv-header-row">
        <button
          className="inv-column bg-white-950"
          onClick={() => sortProducts("name")}
        >
          Product{getSortIndicator("name")}
        </button>
        <button
          className="inv-column bg-white-950"
          onClick={() => sortProducts("buyingPrice")}
        >
          Buying Price{getSortIndicator("buyingPrice")}
        </button>
        <button
          className="inv-column bg-white-950"
          onClick={() => sortProducts("quantity")}
        >
          Quantity{getSortIndicator("quantity")}
        </button>
        <button
          className="inv-column bg-white-950"
          onClick={() => sortProducts("threshold")}
        >
          Threshold Value{getSortIndicator("threshold")}
        </button>
        <button
          className="inv-column bg-white-950"
          onClick={() => sortProducts("expiryDate")}
        >
          Expiry Date{getSortIndicator("expiryDate")}
        </button>
        <button
          className="inv-column bg-white-950"
          onClick={() => sortProducts("availability")}
        >
          Availability{getSortIndicator("availability")}
        </button>
      </div>
      <div className="max-h-[350px] overflow-y-auto">
        {products.map((product) => {
          const { text, color } = getAvailabilityStatus(product.quantity);
          return (
            <div
              className="inv-header-row inv-data-row"
              key={product.id}
              onClick={() => handleProductList(product)}
            >
              <div className="inv-column">{product.name}</div>
              <div className="inv-column">{product.buyingPrice}</div>
              <div className="inv-column">{product.quantity}</div>
              <div className="inv-column">{product.threshold}</div>
              <div className="inv-column">{product.expiryDate}</div>
              <div className="inv-column" style={{ color }}>
                {text}
                {product.availability}
              </div>

            </div>
          );
        })}
      </div>
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <AddProductForm closeModal={() => setShowModal(false)} />
          </div>
        </div>
      )}
      {showModal && (
        <ProductSummary
          closeModal={() => setShowModal(false)}
          product={{
            id: "",
            name: "",
            buyingPrice: "",
            category: "",
            expiryDate: "",
            threshold: 0,
            supplierName: "",
            contactNumber: "",
            storeNames: [],
            stockInHand: [],
            imageUrl: undefined,
          }}
        />
      )}
    </div>
  );
};

export default ProductList;
