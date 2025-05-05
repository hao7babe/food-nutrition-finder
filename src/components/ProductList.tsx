import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import '../styles/ProductList.css';

interface ProductListProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 15; // 5 columns x 3 rows

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (products.length === 0) {
    return (
      <section className="welcome-message">
        <h2>Welcome to Food Nutrition Finder! 🍎</h2>
        <p>Here's how to get started:</p>
        <ol>
          <li>Search for any food product using the search bar above</li>
          <li>You'll see detailed information including:</li>
          <ul>
            <li>Nutritional facts (calories, proteins, fats, etc.)</li>
            <li>Nutri-Score rating (A to E)</li>
            <li>Ingredients list</li>
            <li>Allergen information</li>
            <li>Environmental impact (Eco-Score)</li>
          </ul>
          <li>Click on any product to view its complete details</li>
        </ol>
        <p>Try searching for products like "coca cola", "chocolate", or "pasta" to get started!</p>
      </section>
    );
  }

  return (
    <section>
      <ul className="product-list-container">
        {currentProducts.map((product) => (
          <li 
            key={product.code} 
            onClick={() => handleProductClick(product.code)}
            className="product-card"
          >
            {product.image_url && (
              <img 
                src={product.image_url} 
                alt={product.product_name} 
                className="product-image"
              />
            )}
            <h3 className="product-name">
              {product.product_name || 'Unnamed Product'}
            </h3>
            <p className="product-info">
              <strong>Brand:</strong> {product.brands}
            </p>
            <p className="product-info">
              <strong>Nutriscore:</strong> {product.nutriscore_grade?.toUpperCase()}
            </p>
          </li>
        ))}
      </ul>
      
      {totalPages > 1 && (
        <nav className="pagination-container">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
};

export default ProductList;
