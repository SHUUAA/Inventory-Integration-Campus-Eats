import React, { useState } from 'react';
import { database, storage } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../css/AddProductForm.css';

interface Props {
  closeModal: () => void;
}

const AddProductForm: React.FC<Props> = ({ closeModal }) => {
  const [name, setName] = useState('');
  const [productId, setProductId] = useState('');
  const [category, setCategory] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [threshold, setThreshold] = useState(0);
  const [file, setFile] = useState(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const newFile = event.target.files[0];
      setFile(newFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let imageUrl = '';
    if (file) {
      const imageRef = ref(storage, `ProductImages/${Date.now()}_${file.name}`);
      await uploadBytes(imageRef, file);
      imageUrl = await getDownloadURL(imageRef);
    }

    try {
      await addDoc(collection(database, 'products'), {
        name,
        productId,
        category,
        buyingPrice,
        quantity,
        unit,
        expiryDate,
        threshold,
        imageUrl
      });
      console.log('Product added successfully');
      closeModal();
    } catch (error) {
      console.error('Error adding product: ', error);
    }
  };

  return (
    <div className="modal-content">
      <form onSubmit={handleSubmit} className="add-product-form">
        <h1>New Product</h1>
        <div className="form-row">
          <label>Upload Photo:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div className="form-row">
          <label>Product Name:</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter product name" required />
        </div>
        <div className="form-row">
          <label>Product ID:</label>
          <input type="text" value={productId} onChange={e => setProductId(e.target.value)} placeholder="Enter product ID" required />
        </div>
        <div className="form-row">
          <label>Category:</label>
          <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Select product category" required />
        </div>
        <div className="form-row">
          <label>Buying Price:</label>
          <input type="text" value={buyingPrice} onChange={e => setBuyingPrice(e.target.value)} placeholder="Enter buying price" required />
        </div>
        <div className="form-row">
          <label>Quantity:</label>
          <input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value, 10))} placeholder="Enter product quantity" required />
        </div>
        <div className="form-row">
          <label>Unit:</label>
          <input type="text" value={unit} onChange={e => setUnit(e.target.value)} placeholder="Enter product unit" required />
        </div>
        <div className="form-row">
          <label>Expiry Date:</label>
          <input type="text" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} placeholder="Enter expiry date" required />
        </div>
        <div className="form-row">
          <label>Threshold Value:</label>
          <input type="number" value={threshold} onChange={e => setThreshold(parseInt(e.target.value, 10))} placeholder="Enter threshold value" required />
        </div>
        <div className="buttons">
          <button className="other-button" type="button" onClick={closeModal}>Discard</button>
          <button className="add-product-button" type="submit">Add Product</button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
