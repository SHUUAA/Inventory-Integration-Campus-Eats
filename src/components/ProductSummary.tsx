import React from "react";
import "../css/ProductSummary.css";

interface ProductSummaryProps {
  product: {
    supplier: {
      name: string;
      email: string;
      contactNumber: number;
      category: string;
      buyingPrice: number;
      imageUrl?: string;
    };
    id: number;
    name: string;
    sellingPrice: number;
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
  };
  closeModal: () => void;
}

//@ts-ignore
const ProductSummary: React.FC<ProductSummaryProps> = ({
  product,
  closeModal,
}) => {
  return <div></div>;
};

export default ProductSummary;
