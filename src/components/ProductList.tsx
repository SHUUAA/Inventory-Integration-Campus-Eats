import React, { useEffect, useState } from 'react';
import { database } from '../firebase/Config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import AddProductForm from './AddProductForm';
import '../css/ProductList.css';

interface Product {
  id: string;
  name: string;
  buyingPrice: string;
  quantity: number;
  threshold: number;
  expiryDate: string;
  availability: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'ascending' | 'descending' } | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(database, 'products'));
      const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productList);
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(database, 'products', id));
    setProducts(products.filter(product => product.id !== id));
  };

  const sortProducts = (key: keyof Product) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof Product): string => {
    if (sortConfig && sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ↓' : ' ↑';
    }
    return '';
  };

  return (
    <div className="inv-inventory-container">
      <div className="header-and-buttons">
        <h1 className="inv-inventory-header">Products</h1>
        <div className="button-row">
          <button className="add-product-button" onClick={() => setShowModal(true)}>Add Product</button>
          <button className="other-button">Download all</button>
        </div>
      </div>
      <div className="inv-header-row">
        <button className="inv-column" onClick={() => sortProducts('name')}>Product{getSortIndicator('name')}</button>
        <button className="inv-column" onClick={() => sortProducts('buyingPrice')}>Buying Price{getSortIndicator('buyingPrice')}</button>
        <button className="inv-column" onClick={() => sortProducts('quantity')}>Quantity{getSortIndicator('quantity')}</button>
        <button className="inv-column" onClick={() => sortProducts('threshold')}>Threshold Value{getSortIndicator('threshold')}</button>
        <button className="inv-column" onClick={() => sortProducts('expiryDate')}>Expiry Date{getSortIndicator('expiryDate')}</button>
        <button className="inv-column" onClick={() => sortProducts('availability')}>Availability{getSortIndicator('availability')}</button>
      </div>
      {products.map(product => (
        <div className="inv-header-row inv-data-row" key={product.id}>
          <div className="inv-column">{product.name}</div>
          <div className="inv-column">{product.buyingPrice}</div>
          <div className="inv-column">{product.quantity}</div>
          <div className="inv-column">{product.threshold}</div>
          <div className="inv-column">{product.expiryDate}</div>
          <div className="inv-column">{product.availability}</div>
          <button className="inv-delete-btn" onClick={() => deleteProduct(product.id)}>×</button>
        </div>
      ))}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <AddProductForm closeModal={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
