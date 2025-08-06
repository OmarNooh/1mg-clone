import React from 'react';
import PropTypes from 'prop-types';
import { FaRegHeart } from 'react-icons/fa';
import styles from './ProductCard.module.css';

/**
 * ProductCard - A reusable product card component with navigation to product detail
 * @param {Object} props - Component props
 * @param {string} props.id - Product ID
 * @param {string} props.name - Product name
 * @param {string} props.image - Product image URL
 * @param {number} props.price - Product price
 * @param {number} props.originalPrice - Original price (for discounted items)
 * @param {string} props.currency - Currency symbol or code
 * @param {string} props.className - Additional CSS class
 * @returns {React.ReactElement} - Rendered component
 */
const ProductCard = ({ 
  id, 
  name, 
  image, 
  price, 
  originalPrice, 
  details,
  currency = 'TZS',
  className = ''
}) => {
  return (
    <div className={`${styles.productCard} ${className}`}>
      <div className={styles.imageContainer}>
        <img src={image} alt={name} className={styles.productImage} />
        <button className={styles.wishlistButton} aria-label="Add to wishlist">
          <FaRegHeart />
        </button>
      </div>
      <div className={styles.productInfo}>
        <div className={styles.productName}>{name}</div>
        {originalPrice ? (
          <div className={styles.priceContainer}>
            <span className={styles.currentPrice}>
              <span className={styles.currency}>{currency}</span>
              <span className={styles.price}>{Math.floor(price)}</span>
            </span>
            <span className={styles.originalPrice}>
              {currency} {Math.floor(originalPrice)}
            </span>
            <span className={styles.discount}>
              {Math.floor(((originalPrice - price) / originalPrice) * 100)}% off
            </span>
          </div>
        ) : (
          <div className={styles.priceContainer}>
            <span className={styles.currentPrice}>
              <span className={styles.currency}>{currency}</span>
              <span className={styles.price}>{Math.floor(price)}</span>
            </span>
          </div>
        )}
        <div className={styles.addButtonContainer}>
          <button className={styles.addButton}>
            <span className={styles.plusSign}>+</span> Add
          </button>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  originalPrice: PropTypes.number,
  details: PropTypes.string,
  currency: PropTypes.string,
  className: PropTypes.string
};

export default ProductCard;
