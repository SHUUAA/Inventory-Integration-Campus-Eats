import React from 'react';
import '../css/ProductSummary.css'; 

interface ProductSummaryProps {
    product: {
        id: string;
        name: string;
        buyingPrice: string;
        category: string;
        expiryDate: string;
        threshold: number;
        supplierName: string;
        contactNumber: string;
        storeNames: string[]; 
        stockInHand: number[];
        imageUrl?: string;
    };
    closeModal: () => void;
}

//@ts-ignore
const ProductSummary: React.FC<ProductSummaryProps> = ({ product, closeModal }) => {
    return (
        <div>
        </div>
    );
}

export default ProductSummary;
