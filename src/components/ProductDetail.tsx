import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Product } from '../types';
import '../styles/ProductDetail.css';

interface DetailedProduct extends Product {
  categories?: string;
  packaging?: string;
  serving_size?: string;
  'energy-kcal_100g'?: number;
  proteins_100g?: number;
  fat_100g?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  fiber_100g?: number;
  salt_100g?: number;
  allergens?: string;
  additives_tags?: string[];
  labels_tags?: string[];
  nova_group?: number;
  ecoscore_grade?: string;
  origins?: string;
  manufacturing_places?: string;
  expiration_date?: string;
  storage_conditions?: string;
}

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${productId}.json`);
        const data = await response.json();
        
        if (data.status === 1) {
          setProduct(data.product);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Error fetching product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return <section className="loading-container">Loading product information...</section>;
  }

  if (error) {
    return (
      <section className="error-container">
        <p>{error}</p>
        <Link 
          to="/"
          className="error-button"
        >
          Back to Search
        </Link>
      </section>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <article className="product-detail-container">
      <Link 
        to="/"
        className="back-button"
      >
        ← Back to Search
      </Link>

      {/* Product Header */}
      <header className="product-header">
        <figure className="product-image-container">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.product_name} 
              className="product-image"
            />
          ) : (
            <div className="no-image">
              No Image Available
            </div>
          )}
        </figure>
        <div>
          <h1 className="product-title">{product.product_name || 'Unnamed Product'}</h1>
          <div className="product-info">
            <p className="product-info-text"><strong>Brand:</strong> {product.brands || 'Unknown'}</p>
            <p className="product-info-text"><strong>Barcode:</strong> {product.code}</p>
            {product.categories && (
              <p className="product-info-text"><strong>Category:</strong> {product.categories.split(',')[0]}</p>
            )}
          </div>
        </div>
      </header>

      {/* Nutri-Score Section */}
      {product.nutriscore_grade && (
        <section className="nutri-score-section">
          <div className="nutri-score-grid">
            <figure className="product-image-container">
              <div className="nutri-score-grade" style={{ color: getNutriScoreColor(product.nutriscore_grade) }}>
                {product.nutriscore_grade.toUpperCase()}
              </div>
              <h3 className="nutri-score-label">Nutri-Score</h3>
            </figure>
            <div>
              <h2 className="nutri-score-title">Nutritional Quality</h2>
              <p className="nutri-score-description">
                The Nutri-Score is a nutritional rating system that helps you quickly identify the nutritional quality of food products. 
                It ranges from A (best) to E (worst), taking into account both positive and negative nutrients.
              </p>
              <div className="nutri-score-scale">
                {['A', 'B', 'C', 'D', 'E'].map((grade) => (
                  <div 
                    key={grade}
                    className="nutri-score-grade-item"
                    style={{ backgroundColor: getNutriScoreColor(grade.toLowerCase()) }}
                  >
                    {grade}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other Scores */}
      <section className="other-scores-container">
        {product.nova_group && (
          <article className="score-item">
            <h3 className="score-title">NOVA Group</h3>
            <div className="score-value" style={{ color: getNovaGroupColor(product.nova_group) }}>
              {product.nova_group}
            </div>
            <p className="score-description">Level of food processing</p>
            <div className="score-scale">
              {[1, 2, 3, 4].map((group) => (
                <div 
                  key={group}
                  className="score-item"
                  style={{ backgroundColor: getNovaGroupColor(group) }}
                >
                  {group}
                </div>
              ))}
            </div>
            <p className="score-notes">
              1: Unprocessed or minimally processed foods<br />
              2: Processed culinary ingredients<br />
              3: Processed foods<br />
              4: Ultra-processed foods
            </p>
          </article>
        )}
        
        {product.ecoscore_grade && (
          <article className="score-item">
            <h3 className="score-title">Eco-Score</h3>
            <div className="score-value" style={{ color: getEcoScoreColor(product.ecoscore_grade) }}>
              {product.ecoscore_grade.toUpperCase()}
            </div>
            <p className="score-description">Environmental impact</p>
            <div className="score-scale">
              {['A', 'B', 'C', 'D', 'E'].map((grade) => (
                <div 
                  key={grade}
                  className="score-item"
                  style={{ backgroundColor: getEcoScoreColor(grade.toLowerCase()) }}
                >
                  {grade}
                </div>
              ))}
            </div>
            <p className="score-notes">
              A: Minimal environmental impact<br />
              E: Significant environmental impact
            </p>
          </article>
        )}
      </section>

      {/* Nutrition Facts */}
      <section className="nutrition-facts-container">
        <h2 className="nutrition-facts-title">Nutrition Facts</h2>
        <div className="nutrition-facts-grid">
          {product['energy-kcal_100g'] && (
            <article className="nutrition-fact-item">
              <div className="nutrition-fact-label">Energy</div>
              <div className="nutrition-fact-value"><strong>{product['energy-kcal_100g']} kcal</strong></div>
              <div className="nutrition-fact-unit">per 100g</div>
            </article>
          )}
          {product.proteins_100g && (
            <article className="nutrition-fact-item">
              <div className="nutrition-fact-label">Proteins</div>
              <div className="nutrition-fact-value"><strong>{product.proteins_100g}g</strong></div>
              <div className="nutrition-fact-unit">per 100g</div>
            </article>
          )}
          {product.fat_100g && (
            <article className="nutrition-fact-item">
              <div className="nutrition-fact-label">Fat</div>
              <div className="nutrition-fact-value"><strong>{product.fat_100g}g</strong></div>
              <div className="nutrition-fact-unit">per 100g</div>
            </article>
          )}
          {product.carbohydrates_100g && (
            <article className="nutrition-fact-item">
              <div className="nutrition-fact-label">Carbohydrates</div>
              <div className="nutrition-fact-value"><strong>{product.carbohydrates_100g}g</strong></div>
              <div className="nutrition-fact-unit">per 100g</div>
            </article>
          )}
          {product.sugars_100g && (
            <article className="nutrition-fact-item">
              <div className="nutrition-fact-label">Sugars</div>
              <div className="nutrition-fact-value"><strong>{product.sugars_100g}g</strong></div>
              <div className="nutrition-fact-unit">per 100g</div>
            </article>
          )}
          {product.salt_100g && (
            <article className="nutrition-fact-item">
              <div className="nutrition-fact-label">Salt</div>
              <div className="nutrition-fact-value"><strong>{product.salt_100g}g</strong></div>
              <div className="nutrition-fact-unit">per 100g</div>
            </article>
          )}
        </div>
      </section>

      {/* Ingredients */}
      {product.ingredients_text && (
        <section className="ingredients-container">
          <h2 className="ingredients-title">Ingredients</h2>
          <p className="ingredients-text">{product.ingredients_text}</p>
        </section>
      )}

      {/* Allergens */}
      {product.allergens && (
        <section className="allergens-container">
          <h2 className="allergens-title">Allergens</h2>
          <p className="allergens-text">{product.allergens}</p>
        </section>
      )}

      {/* Labels */}
      {product.labels_tags && product.labels_tags.length > 0 && (
        <section className="labels-container">
          <h2 className="labels-title">Certifications & Labels</h2>
          <div className="labels-grid">
            {product.labels_tags.map((label, index) => (
              <span 
                key={index}
                className="label-item"
              >
                {formatLabel(label)}
              </span>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

// Helper functions
const getNutriScoreColor = (grade: string): string => {
  const colors: { [key: string]: string } = {
    'a': '#038141',
    'b': '#85bb2f',
    'c': '#fecb02',
    'd': '#ee8100',
    'e': '#e63e11'
  };
  return colors[grade.toLowerCase()] || '#666';
};

const getNovaGroupColor = (group: number): string => {
  const colors: { [key: number]: string } = {
    1: '#038141',
    2: '#85bb2f',
    3: '#ee8100',
    4: '#e63e11'
  };
  return colors[group] || '#666';
};

const getEcoScoreColor = (grade: string): string => {
  const colors: { [key: string]: string } = {
    'a': '#038141',
    'b': '#85bb2f',
    'c': '#fecb02',
    'd': '#ee8100',
    'e': '#e63e11'
  };
  return colors[grade.toLowerCase()] || '#666';
};

const formatLabel = (label: string): string => {
  return label
    .split(':')
    .pop()
    ?.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || label;
};

export default ProductDetail; 