import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the compare context
const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load compare list from localStorage on initial render
  useEffect(() => {
    const storedCompareList = localStorage.getItem('compareList');
    if (storedCompareList) {
      try {
        setCompareList(JSON.parse(storedCompareList));
      } catch (err) {
        console.error('Failed to parse stored compare list:', err);
        localStorage.removeItem('compareList');
      }
    }
    setLoading(false);
  }, []);

  // Save compare list to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('compareList', JSON.stringify(compareList));
    }
  }, [compareList, loading]);

  /**
   * Add a product to the compare list
   * @param {Object} product - The product to add
   * @param {string} category - The category of the product
   */
  const addToCompare = (product, category) => {
    // Only allow comparing products in the same category
    if (compareList.length > 0 && compareList[0].category !== category) {
      return {
        success: false,
        message: 'You can only compare products from the same category'
      };
    }
    
    // Limit to 4 products for comparison
    if (compareList.length >= 4) {
      return {
        success: false,
        message: 'You can compare up to 4 products at a time'
      };
    }
    
    // Check if product is already in the list
    if (compareList.some(item => item.id === product.id)) {
      return {
        success: false,
        message: 'This product is already in your compare list'
      };
    }
    
    // Add product with its category
    const productWithCategory = { ...product, category };
    setCompareList(prevList => [...prevList, productWithCategory]);
    
    return {
      success: true,
      message: 'Product added to compare list'
    };
  };

  /**
   * Remove a product from the compare list
   * @param {string} productId - The ID of the product to remove
   */
  const removeFromCompare = (productId) => {
    setCompareList(prevList => prevList.filter(item => item.id !== productId));
    
    return {
      success: true,
      message: 'Product removed from compare list'
    };
  };

  /**
   * Check if a product is in the compare list
   * @param {string} productId - The ID of the product to check
   * @returns {boolean} - True if the product is in the compare list
   */
  const isInCompareList = (productId) => {
    return compareList.some(item => item.id === productId);
  };

  /**
   * Clear the entire compare list
   */
  const clearCompareList = () => {
    setCompareList([]);
    
    return {
      success: true,
      message: 'Compare list cleared'
    };
  };

  const value = {
    compareList,
    loading,
    addToCompare,
    removeFromCompare,
    isInCompareList,
    clearCompareList,
    compareCount: compareList.length
  };

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
};

// Custom hook to use the compare context
export const useCompare = () => {
  return useContext(CompareContext);
};

export default CompareContext;
