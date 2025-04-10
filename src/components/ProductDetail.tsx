import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';

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
  const [translatedIngredients, setTranslatedIngredients] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Function to detect if text is in English
  const isEnglish = (text: string): boolean => {
    // Simple heuristic: check if the text contains common English words
    const commonEnglishWords = ['the', 'and', 'of', 'to', 'in', 'is', 'it', 'that', 'for', 'on'];
    const textLower = text.toLowerCase();
    return commonEnglishWords.some(word => textLower.includes(word));
  };

  // Function to translate text to English using LibreTranslate
  const translateToEnglish = async (text: string) => {
    try {
      setIsTranslating(true);
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'auto',
          target: 'en',
          format: 'text'
        })
      });

      const data = await response.json();
      setTranslatedIngredients(data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedIngredients(null);
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${productId}.json`);
        const data = await response.json();
        
        if (data.status === 1) {
          setProduct(data.product);
          // Check if ingredients text exists and is not in English
          if (data.product.ingredients_text && !isEnglish(data.product.ingredients_text)) {
            translateToEnglish(data.product.ingredients_text);
          }
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
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading product information...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            marginTop: '20px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        >
          Back to Search
        </button>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div style={{ 
      padding: '15px', 
      maxWidth: '1000px', 
      margin: '0 auto',
      maxHeight: '100vh',
      overflowY: 'auto'
    }}>
      <button 
        onClick={() => navigate('/')}
        style={{
          padding: '8px 16px',
          marginBottom: '15px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          cursor: 'pointer',
          backgroundColor: '#f5f5f5',
          fontSize: '14px'
        }}
      >
        ← Back to Search
      </button>

      {/* Product Header */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '200px 1fr', 
        gap: '20px',
        marginBottom: '20px',
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center' }}>
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.product_name} 
              style={{ 
                width: '100%', 
                maxWidth: '200px',
                height: '200px',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} 
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: '200px', 
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px'
            }}>
              No Image Available
            </div>
          )}
        </div>
        <div>
          <h1 style={{ marginBottom: '10px', fontSize: '20px' }}>{product.product_name || 'Unnamed Product'}</h1>
          <div style={{ marginBottom: '10px' }}>
            <p style={{ marginBottom: '5px', fontSize: '14px' }}><strong>Brand:</strong> {product.brands || 'Unknown'}</p>
            <p style={{ marginBottom: '5px', fontSize: '14px' }}><strong>Barcode:</strong> {product.code}</p>
            {product.categories && (
              <p style={{ marginBottom: '5px', fontSize: '14px' }}><strong>Category:</strong> {product.categories.split(',')[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Nutri-Score Section */}
      {product.nutriscore_grade && (
        <div style={{ 
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '120px 1fr', 
            gap: '20px',
            alignItems: 'center'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: 'bold',
                color: getNutriScoreColor(product.nutriscore_grade),
                marginBottom: '5px'
              }}>
                {product.nutriscore_grade.toUpperCase()}
              </div>
              <h3 style={{ margin: '0', color: '#666', fontSize: '14px' }}>Nutri-Score</h3>
            </div>
            <div>
              <h2 style={{ marginBottom: '10px', color: '#333', fontSize: '16px' }}>Nutritional Quality</h2>
              <p style={{ lineHeight: '1.4', color: '#666', marginBottom: '10px', fontSize: '14px' }}>
                The Nutri-Score is a nutritional rating system that helps you quickly identify the nutritional quality of food products. 
                It ranges from A (best) to E (worst), taking into account both positive and negative nutrients.
              </p>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(5, 1fr)', 
                gap: '5px',
                marginTop: '10px'
              }}>
                {['A', 'B', 'C', 'D', 'E'].map((grade) => (
                  <div 
                    key={grade}
                    style={{ 
                      textAlign: 'center',
                      padding: '5px',
                      backgroundColor: getNutriScoreColor(grade.toLowerCase()),
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  >
                    {grade}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Scores */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '15px',
        marginBottom: '20px'
      }}>
        {product.nova_group && (
          <div style={{ 
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '5px', color: '#666', fontSize: '14px' }}>NOVA Group</h3>
            <div style={{ 
              fontSize: '36px', 
              fontWeight: 'bold',
              color: getNovaGroupColor(product.nova_group),
              marginBottom: '5px'
            }}>
              {product.nova_group}
            </div>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
              Level of food processing
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '5px',
              marginTop: '5px'
            }}>
              {[1, 2, 3, 4].map((group) => (
                <div 
                  key={group}
                  style={{ 
                    textAlign: 'center',
                    padding: '3px',
                    backgroundColor: getNovaGroupColor(group),
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '10px'
                  }}
                >
                  {group}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
              1: Unprocessed or minimally processed foods<br />
              2: Processed culinary ingredients<br />
              3: Processed foods<br />
              4: Ultra-processed foods
            </p>
          </div>
        )}
        
        {product.ecoscore_grade && (
          <div style={{ 
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '5px', color: '#666', fontSize: '14px' }}>Eco-Score</h3>
            <div style={{ 
              fontSize: '36px', 
              fontWeight: 'bold',
              color: getEcoScoreColor(product.ecoscore_grade),
              marginBottom: '5px'
            }}>
              {product.ecoscore_grade.toUpperCase()}
            </div>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
              Environmental impact
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(5, 1fr)', 
              gap: '5px',
              marginTop: '5px'
            }}>
              {['A', 'B', 'C', 'D', 'E'].map((grade) => (
                <div 
                  key={grade}
                  style={{ 
                    textAlign: 'center',
                    padding: '3px',
                    backgroundColor: getEcoScoreColor(grade.toLowerCase()),
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '10px'
                  }}
                >
                  {grade}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
              A: Minimal environmental impact<br />
              E: Significant environmental impact
            </p>
          </div>
        )}
      </div>

      {/* Nutrition Facts */}
      <div style={{ 
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ marginBottom: '15px', color: '#333', fontSize: '16px' }}>Nutrition Facts</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '15px'
        }}>
          {product['energy-kcal_100g'] && (
            <div style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Energy</span>
                <span><strong>{product['energy-kcal_100g']} kcal</strong></span>
              </div>
              <div style={{ fontSize: '10px', color: '#666' }}>per 100g</div>
            </div>
          )}
          {product.proteins_100g && (
            <div style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Proteins</span>
                <span><strong>{product.proteins_100g}g</strong></span>
              </div>
              <div style={{ fontSize: '10px', color: '#666' }}>per 100g</div>
            </div>
          )}
          {product.fat_100g && (
            <div style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Fat</span>
                <span><strong>{product.fat_100g}g</strong></span>
              </div>
              <div style={{ fontSize: '10px', color: '#666' }}>per 100g</div>
            </div>
          )}
          {product.carbohydrates_100g && (
            <div style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Carbohydrates</span>
                <span><strong>{product.carbohydrates_100g}g</strong></span>
              </div>
              <div style={{ fontSize: '10px', color: '#666' }}>per 100g</div>
            </div>
          )}
          {product.sugars_100g && (
            <div style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Sugars</span>
                <span><strong>{product.sugars_100g}g</strong></span>
              </div>
              <div style={{ fontSize: '10px', color: '#666' }}>per 100g</div>
            </div>
          )}
          {product.salt_100g && (
            <div style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Salt</span>
                <span><strong>{product.salt_100g}g</strong></span>
              </div>
              <div style={{ fontSize: '10px', color: '#666' }}>per 100g</div>
            </div>
          )}
        </div>
      </div>

      {/* Ingredients */}
      {product.ingredients_text && (
        <div style={{ 
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ marginBottom: '15px', color: '#333', fontSize: '16px' }}>Ingredients</h2>
          {isTranslating ? (
            <p style={{ color: '#666', fontStyle: 'italic', fontSize: '14px' }}>Translating ingredients...</p>
          ) : (
            <>
              {translatedIngredients ? (
                <>
                  <p style={{ lineHeight: '1.4', marginBottom: '10px', fontSize: '14px' }}>
                    <strong>Original:</strong> {product.ingredients_text}
                  </p>
                  <p style={{ lineHeight: '1.4', color: '#666', fontSize: '14px' }}>
                    <strong>Translated:</strong> {translatedIngredients}
                  </p>
                </>
              ) : (
                <p style={{ lineHeight: '1.4', fontSize: '14px' }}>{product.ingredients_text}</p>
              )}
            </>
          )}
        </div>
      )}

      {/* Allergens */}
      {product.allergens && (
        <div style={{ 
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ marginBottom: '15px', color: '#333', fontSize: '16px' }}>Allergens</h2>
          <p style={{ lineHeight: '1.4', fontSize: '14px' }}>{product.allergens}</p>
        </div>
      )}

      {/* Labels */}
      {product.labels_tags && product.labels_tags.length > 0 && (
        <div style={{ 
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ marginBottom: '15px', color: '#333', fontSize: '16px' }}>Certifications & Labels</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {product.labels_tags.map((label, index) => (
              <span 
                key={index}
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '16px',
                  fontSize: '12px',
                  color: '#666'
                }}
              >
                {formatLabel(label)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
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