import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useWishlist } from '../../contexts/WishlistContext';
import styles from './WishlistButton.module.css';

/**
 * WishlistButton component for adding/removing products from wishlist
 * @param {Object} props
 * @param {Object} props.product - The product to add/remove from wishlist
 * @param {string} [props.className] - Additional CSS class
 * @param {boolean} [props.showText=false] - Whether to show text next to icon
 * @param {string} [props.size='medium'] - Button size (small, medium, large)
 */
const WishlistButton = ({ 
  product, 
  className = '', 
  showText = false,
  size = 'medium'
}) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const inWishlist = isInWishlist(product.id);
  
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  return (
    <button 
      className={`${styles.wishlistButton} ${styles[size]} ${inWishlist ? styles.active : ''} ${isAnimating ? styles.animate : ''} ${className}`}
      onClick={handleToggleWishlist}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {inWishlist ? <FaHeart className={styles.icon} /> : <FaRegHeart className={styles.icon} />}
      {showText && (
        <span className={styles.buttonText}>
          {inWishlist ? "Saved" : "Save for later"}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;
