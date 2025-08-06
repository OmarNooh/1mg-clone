import React, { useState, useEffect } from 'react';
import { products } from '../../data/products';
import styles from './RecommendationEngine.module.css';
import AddToCartButton from '../Cart/AddToCartButton';
import { Link } from 'react-router-dom';

/**
 * RecommendationEngine component that provides different types of product recommendations
 * based on user behavior, current product, or purchase history
 */
const RecommendationEngine = ({ 
  currentProductId, 
  type = 'similar', // 'similar', 'frequently-bought-together', 'recently-viewed', 'popular'
  limit = 5,
  title = 'You might also like'
}) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // In a real application, this would be an API call to a recommendation service
    // For now, we'll simulate different recommendation types
    const getRecommendations = () => {
      const currentProduct = products.find(p => p.id === currentProductId);
      
      if (!currentProduct) {
        return [];
      }

      let recommendedProducts = [];
      
      switch (type) {
        case 'similar':
          // Find products in the same category
          recommendedProducts = products
            .filter(p => p.id !== currentProductId && p.category === currentProduct.category)
            .sort(() => 0.5 - Math.random()); // Shuffle
          break;
          
        case 'frequently-bought-together':
          // In a real app, this would be based on purchase history analysis
          // For now, we'll simulate with products from the same manufacturer
          recommendedProducts = products
            .filter(p => p.id !== currentProductId && p.manufacturer === currentProduct.manufacturer)
            .sort(() => 0.5 - Math.random()); // Shuffle
          break;
          
        case 'recently-viewed':
          // In a real app, this would be from user's browsing history
          // For now, we'll simulate with random products
          recommendedProducts = products
            .filter(p => p.id !== currentProductId)
            .sort(() => 0.5 - Math.random()); // Shuffle
          break;
          
        case 'popular':
          // In a real app, this would be based on sales or view counts
          // For now, we'll simulate with products that have high ratings
          recommendedProducts = products
            .filter(p => p.id !== currentProductId)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0)); // Sort by rating
          break;
          
        default:
          recommendedProducts = products
            .filter(p => p.id !== currentProductId)
            .sort(() => 0.5 - Math.random()); // Shuffle
      }
      
      return recommendedProducts.slice(0, limit);
    };

    setRecommendations(getRecommendations());
  }, [currentProductId, type, limit]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className={styles.recommendationEngine}>
      <h3 className={styles.recommendationTitle}>{title}</h3>
      <div className={styles.recommendationGrid}>
        {recommendations.map(product => (
          <div key={product.id} className={styles.recommendationCard}>
            <Link to={`/product/${product.id}`} className={styles.productLink}>
              <div className={styles.productImage}>
                <img src={product.image} alt={product.name} />
              </div>
              <h4 className={styles.productName}>{product.name}</h4>
            </Link>
            <div className={styles.productPrice}>
              <span className={styles.discountedPrice}>${product.discountedPrice}</span>
              {product.mrp > product.discountedPrice && (
                <span className={styles.originalPrice}>${product.mrp}</span>
              )}
            </div>
            <div className={styles.productRating}>
              {product.rating && (
                <>
                  <span className={styles.ratingValue}>{product.rating}★</span>
                  <span className={styles.ratingCount}>({product.ratingCount || 0})</span>
                </>
              )}
            </div>
            <AddToCartButton product={product} className={styles.addToCartButton} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationEngine;
