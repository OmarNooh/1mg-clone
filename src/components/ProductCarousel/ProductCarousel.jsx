import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaStar, FaHeart } from 'react-icons/fa';
import styles from './ProductCarousel.module.css';

const ProductCarousel = ({ products }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth / 2;
      carouselRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
      setScrollPosition(Math.max(0, scrollPosition - scrollAmount));
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth / 2;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setScrollPosition(scrollPosition + scrollAmount);
    }
  };

  const handleAddToCart = (e, productId) => {
    e.preventDefault();
    console.log(`Added product ${productId} to cart`);
    // Here you would add the product to the cart state
  };

  return (
    <div className={styles.productCarouselContainer}>
      <button 
        className={`${styles.navButton} ${styles.prevButton} ${scrollPosition <= 0 ? styles.hidden : ''}`} 
        onClick={scrollLeft}
      >
        <FaChevronLeft />
      </button>
      
      <div className={styles.productCarousel} ref={carouselRef}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <Link to={`/product/${product.id}`} className={styles.productLink}>
              <div className={styles.wishlistButton}>
                <FaHeart />
              </div>
              
              <div className={styles.productImage}>
                <img src={product.image} alt={product.name} />
              </div>
              
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productManufacturer}>{product.manufacturer}</p>
                
                {product.rating && (
                  <div className={styles.productRating}>
                    <span className={styles.ratingValue}>
                      {product.rating} <FaStar />
                    </span>
                    <span className={styles.ratingCount}>({product.ratingCount})</span>
                  </div>
                )}
                
                <div className={styles.productPricing}>
                  <div className={styles.priceContainer}>
                    <span className={styles.discountedPrice}>₹{product.discountedPrice}</span>
                    {product.mrp !== product.discountedPrice && (
                      <span className={styles.mrp}>₹{product.mrp}</span>
                    )}
                  </div>
                  
                  {product.discountPercentage > 0 && (
                    <span className={styles.discountTag}>{product.discountPercentage}% OFF</span>
                  )}
                </div>
              </div>
            </Link>
            
            <button 
              className={styles.addToCartButton}
              onClick={(e) => handleAddToCart(e, product.id)}
            >
              ADD
            </button>
          </div>
        ))}
      </div>
      
      <button 
        className={`${styles.navButton} ${styles.nextButton}`} 
        onClick={scrollRight}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default ProductCarousel;
