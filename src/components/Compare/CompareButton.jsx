import React, { useState } from 'react';
import { FaBalanceScale } from 'react-icons/fa';
import { useCompare } from '../../contexts/CompareContext';
import styles from './CompareButton.module.css';

/**
 * CompareButton component for adding/removing products from comparison list
 * @param {Object} props
 * @param {Object} props.product - The product to add/remove from comparison
 * @param {string} props.category - The category of the product
 * @param {string} [props.className] - Additional CSS class
 * @param {boolean} [props.showText=false] - Whether to show text next to icon
 * @param {string} [props.size='medium'] - Button size (small, medium, large)
 */
const CompareButton = ({ 
  product, 
  category,
  className = '', 
  showText = false,
  size = 'medium'
}) => {
  const { isInCompareList, addToCompare, removeFromCompare } = useCompare();
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  
  const inCompareList = isInCompareList(product.id);
  
  const handleToggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    let result;
    if (inCompareList) {
      result = removeFromCompare(product.id);
    } else {
      result = addToCompare(product, category);
    }
    
    // Show feedback message
    setMessage(result.message);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };
  
  return (
    <>
      <button 
        className={`${styles.compareButton} ${styles[size]} ${inCompareList ? styles.active : ''} ${className}`}
        onClick={handleToggleCompare}
        aria-label={inCompareList ? "Remove from comparison" : "Add to comparison"}
        title={inCompareList ? "Remove from comparison" : "Add to comparison"}
      >
        <FaBalanceScale className={styles.icon} />
        {showText && (
          <span className={styles.buttonText}>
            {inCompareList ? "Remove from compare" : "Compare"}
          </span>
        )}
      </button>
      
      {showMessage && (
        <div className={`${styles.message} ${result?.success ? styles.success : styles.error}`}>
          {message}
        </div>
      )}
    </>
  );
};

export default CompareButton;
