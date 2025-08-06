import React, { useState } from 'react';
import { FaShoppingCart, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import styles from './AddToCartButton.module.css';

const AddToCartButton = ({ product, showQuantity = false, className = '' }) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  
  // Validate product object
  if (!product || !product.id) {
    console.error('Invalid product object provided to AddToCartButton:', product);
    return <div className={`${styles.errorState} ${className}`}>Invalid product</div>;
  }
  
  // Check if product is already in cart
  const cartItem = cart.find(item => item.id === product.id);
  const isInCart = !!cartItem;
  
  const handleAddToCart = () => {
    setError(null);
    setIsAdding(true);
    try {
      console.log('Adding product to cart:', product);
      setTimeout(() => {
        addToCart(product);
        setIsAdding(false);
      }, 300);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item');
      setIsAdding(false);
    }
  };
  
  const handleIncreaseQuantity = () => {
    const newQuantity = (cartItem?.quantity || 0) + 1;
    const maxQty = product.maxQuantity || 10; // Default max quantity if not specified
    
    if (newQuantity <= maxQty) {
      updateQuantity(product.id, newQuantity);
    }
  };
  
  const handleDecreaseQuantity = () => {
    const newQuantity = (cartItem?.quantity || 0) - 1;
    
    if (newQuantity <= 0) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };
  
  return (
    <div className={`${styles.addToCartContainer} ${className}`}>
      {!isInCart ? (
        <button 
          className={`${styles.addToCartBtn} ${isAdding ? styles.adding : ''}`}
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          <FaShoppingCart className={styles.cartIcon} />
          <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
        </button>
      ) : showQuantity ? (
        <div className={styles.quantityControls}>
          <button 
            className={styles.quantityBtn} 
            onClick={handleDecreaseQuantity}
          >
            <FaMinus />
          </button>
          <span className={styles.quantity}>{cartItem.quantity}</span>
          <button 
            className={styles.quantityBtn} 
            onClick={handleIncreaseQuantity}
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <div className={styles.addedContainer}>
          <div className={styles.quantityControls}>
            <button 
              className={styles.quantityBtn} 
              onClick={handleDecreaseQuantity}
            >
              <FaMinus />
            </button>
            <span className={styles.quantity}>{cartItem.quantity}</span>
            <button 
              className={styles.quantityBtn} 
              onClick={handleIncreaseQuantity}
            >
              <FaPlus />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;
