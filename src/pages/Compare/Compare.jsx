import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useCompare } from '../../contexts/CompareContext';
import { useCart } from '../../contexts/CartContext';
import styles from './Compare.module.css';

const Compare = () => {
  const { compareList, removeFromCompare, clearCompareList } = useCompare();
  const { addToCart } = useCart();

  // Get all unique attributes across all products
  const getAllAttributes = () => {
    const attributes = new Set();
    
    compareList.forEach(product => {
      Object.keys(product).forEach(key => {
        // Skip certain keys that are not comparable attributes
        if (!['id', 'image', 'category', 'name', 'manufacturer'].includes(key)) {
          attributes.add(key);
        }
      });
    });
    
    return Array.from(attributes).sort();
  };

  const attributes = getAllAttributes();

  // Format attribute names for display
  const formatAttributeName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  };

  // Format attribute values for display
  const formatAttributeValue = (attribute, value) => {
    if (value === undefined || value === null) return 'N/A';
    
    if (attribute === 'discountedPrice' || attribute === 'mrp') {
      return `$${value}`;
    }
    
    if (attribute === 'rating') {
      return `${value}★`;
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    return value;
  };

  if (compareList.length === 0) {
    return (
      <div className={styles.emptyCompare}>
        <div className={styles.emptyMessage}>
          <h2>Your comparison list is empty</h2>
          <p>Add products to compare by clicking the compare icon on any product.</p>
          <Link to="/medicines" className={styles.shopNowButton}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.comparePage}>
      <div className={styles.compareHeader}>
        <Link to="/medicines" className={styles.backButton}>
          <FaArrowLeft /> Back to Shopping
        </Link>
        <h1 className={styles.compareTitle}>Product Comparison</h1>
        <button 
          className={styles.clearButton} 
          onClick={clearCompareList}
          title="Clear comparison"
        >
          <FaTrash /> Clear All
        </button>
      </div>

      <div className={styles.compareTable}>
        <div className={styles.compareRow}>
          <div className={styles.attributeCell}>
            <strong>Product</strong>
          </div>
          {compareList.map(product => (
            <div key={product.id} className={styles.productCell}>
              <div className={styles.productImage}>
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} />
                </Link>
                <button 
                  className={styles.removeButton}
                  onClick={() => removeFromCompare(product.id)}
                  title="Remove from comparison"
                >
                  <FaTrash />
                </button>
              </div>
              <Link to={`/product/${product.id}`} className={styles.productName}>
                {product.name}
              </Link>
              <div className={styles.productManufacturer}>
                {product.manufacturer}
              </div>
              <div className={styles.productPrice}>
                <span className={styles.discountedPrice}>${product.discountedPrice}</span>
                {product.mrp > product.discountedPrice && (
                  <span className={styles.originalPrice}>${product.mrp}</span>
                )}
              </div>
              <button 
                className={styles.addToCartButton}
                onClick={() => addToCart(product)}
              >
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          ))}
        </div>

        {attributes.map(attribute => (
          <div key={attribute} className={styles.compareRow}>
            <div className={styles.attributeCell}>
              <strong>{formatAttributeName(attribute)}</strong>
            </div>
            {compareList.map(product => (
              <div key={product.id} className={styles.valueCell}>
                {formatAttributeValue(attribute, product[attribute])}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Compare;
