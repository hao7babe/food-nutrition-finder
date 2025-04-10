import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

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
    return <p>No products found. Try another search.</p>;
  }

  return (
    <div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(5, 1fr)', 
        gap: '20px',
        padding: '20px'
      }}>
        {currentProducts.map((product) => (
          <div 
            key={product.code} 
            onClick={() => handleProductClick(product.code)}
            style={{ 
              border: '1px solid #ccc', 
              padding: '10px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {product.image_url && (
              <img 
                src={product.image_url} 
                alt={product.product_name} 
                style={{ 
                  width: '100%', 
                  height: '150px',
                  objectFit: 'contain',
                  marginBottom: '10px'
                }} 
              />
            )}
            <h3 style={{ margin: '10px 0', fontSize: '1rem' }}>
              {product.product_name || 'Unnamed Product'}
            </h3>
            <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>
              <strong>Brand:</strong> {product.brands}
            </p>
            <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>
              <strong>Nutriscore:</strong> {product.nutriscore_grade?.toUpperCase()}
            </p>
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px', 
          marginTop: '20px',
          padding: '20px'
        }}>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              cursor: 'pointer'
            }}
          >
            Previous
          </button>
          <span style={{ lineHeight: '32px' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              cursor: 'pointer'
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
