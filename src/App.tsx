import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import { Product } from './types';
import './styles/App.css';

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
      <div className="app-container">
        <Link to="/" className="app-title">
          <h1>What's in My Food?</h1>
        </Link>
        
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a product..."
            className="search-input"
          />
          <button 
            onClick={handleSearch}
            className="search-button"
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
