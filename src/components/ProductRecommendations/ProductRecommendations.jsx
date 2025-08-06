import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import AddToCartButton from '../AddToCartButton/AddToCartButton';
import styles from './ProductRecommendations.module.css';

const ProductRecommendations = ({ title, products }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const handleScrollLeft = () => {
    const newPosition = Math.max(0, scrollPosition - 300);
    setScrollPosition(newPosition);
    document.getElementById('recommendationsTrack').scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  };
  
  const handleScrollRight = () => {
    const container = document.getElementById('recommendationsTrack');
    const maxScroll = container.scrollWidth - container.clientWidth;
    const newPosition = Math.min(maxScroll, scrollPosition + 300);
    setScrollPosition(newPosition);
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  };
  
  if (!products || products.length === 0) {
    return null;
  }
  
  return (
    <div className={styles.recommendationsContainer}>
      <div className={styles.recommendationsHeader}>
        <h2 className={styles.recommendationsTitle}>{title}</h2>
        <div className={styles.navigationControls}>
          <button 
            className={`${styles.navButton} ${scrollPosition === 0 ? styles.disabled : ''}`}
            onClick={handleScrollLeft}
            disabled={scrollPosition === 0}
          >
            <FaChevronLeft />
          </button>
          <button 
            className={styles.navButton}
            onClick={handleScrollRight}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      
      <div className={styles.recommendationsWrapper}>
        <div className={styles.recommendationsTrack} id="recommendationsTrack">
          {products.map(product => (
            <Link 
              to={`/product/${product.id}`} 
              key={product.id}
              className={styles.productCard}
            >
              <div className={styles.productImageContainer}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className={styles.productImage}
                />
              </div>
              
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productManufacturer}>{product.manufacturer}</p>
                
                {product.rating && (
                  <div className={styles.productRating}>
                    <span className={styles.ratingValue}>
                      {product.rating} <FaStar />
                    </span>
                    {product.ratingCount && (
                      <span className={styles.ratingCount}>({product.ratingCount})</span>
                    )}
                  </div>
                )}
                
                <div className={styles.productPricing}>
                  <span className={styles.discountedPrice}>${product.discountedPrice}</span>
                  {product.mrp !== product.discountedPrice && (
                    <>
                      <span className={styles.mrp}>${product.mrp}</span>
                      <span className={styles.discountTag}>
                        {Math.round(((product.mrp - product.discountedPrice) / product.mrp) * 100)}% off
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              <div onClick={(e) => e.preventDefault()} className={styles.addToCartWrapper}>
                <AddToCartButton product={product} className={styles.addToCartButton} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductRecommendations;
