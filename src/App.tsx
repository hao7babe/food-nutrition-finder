import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import { Product } from './types';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchTerm}&json=1`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>What's in My Food?</h1>
        </Link>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '20px',
          gap: '10px'
        }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a product..."
            style={{
              padding: '10px',
              width: '300px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
          <button 
            onClick={handleSearch}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </div>

        <Routes>
          <Route path="/" element={<ProductList products={products} />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
