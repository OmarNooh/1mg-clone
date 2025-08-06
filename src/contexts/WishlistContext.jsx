import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserAPI } from '../backend/api/index';

// Create the wishlist context
const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist from API on initial render
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const currentUser = await UserAPI.getCurrentUser();
        
        if (currentUser) {
          const userWishlist = await UserAPI.getWishlist();
          setWishlist(userWishlist);
        } else {
          // If no user is logged in, try to get wishlist from local storage
          const storedWishlist = localStorage.getItem('wishlist');
          if (storedWishlist) {
            try {
              setWishlist(JSON.parse(storedWishlist));
            } catch (err) {
              console.error('Failed to parse stored wishlist:', err);
              localStorage.removeItem('wishlist');
            }
          }
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadWishlist();
  }, []);

  /**
   * Add a product to the wishlist
   * @param {Object} product - The product to add
   */
  const addToWishlist = async (product) => {
    try {
      if (!wishlist.some(item => item.id === product.id)) {
        const updatedWishlist = await UserAPI.addToWishlist(product);
        setWishlist(updatedWishlist);
        
        // Also update local storage as fallback
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  };

  /**
   * Remove a product from the wishlist
   * @param {string} productId - The ID of the product to remove
   */
  const removeFromWishlist = async (productId) => {
    try {
      const updatedWishlist = await UserAPI.removeFromWishlist(productId);
      setWishlist(updatedWishlist);
      
      // Also update local storage as fallback
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      // Fallback to client-side removal if API fails
      setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== productId));
    }
  };

  /**
   * Check if a product is in the wishlist
   * @param {string} productId - The ID of the product to check
   * @returns {boolean} - True if the product is in the wishlist
   */
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  /**
   * Clear the entire wishlist
   */
  const clearWishlist = async () => {
    try {
      await UserAPI.clearWishlist();
      setWishlist([]);
      localStorage.removeItem('wishlist');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      // Fallback to client-side clearing if API fails
      setWishlist([]);
      localStorage.removeItem('wishlist');
    }
  };

  /**
   * Move a product from wishlist to cart
   * @param {string} productId - The ID of the product to move
   * @param {Function} addToCart - Function to add product to cart
   */
  const moveToCart = async (productId, addToCart) => {
    try {
      const product = wishlist.find(item => item.id === productId);
      if (product && addToCart) {
        await addToCart(product);
        await removeFromWishlist(productId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error moving product to cart:', error);
      return false;
    }
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    moveToCart,
    wishlistCount: wishlist.length
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

// Custom hook to use the wishlist context
export const useWishlist = () => {
  return useContext(WishlistContext);
};

export default WishlistContext;
