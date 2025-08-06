import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartAPI } from '../backend/api/index';

// Create the context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  return useContext(CartContext);
};

// Provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartSummary, setCartSummary] = useState({
    subtotal: 'TZS 0.00',
    totalMRP: 'TZS 0.00',
    totalDiscount: 'TZS 0.00',
    deliveryCharges: 'TZS 0.00',
    totalAmount: 'TZS 0.00'
  });
  
  // Load cart from API on initial render
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartItems = await CartAPI.getCartItems();
        setCart(cartItems);
        updateCartCount(cartItems);
        updateCartSummary();
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };
    
    loadCart();
  }, []);
  
  // Update cart count
  const updateCartCount = (currentCart) => {
    const count = currentCart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };
  
  // Update cart summary
  const updateCartSummary = async () => {
    try {
      const summary = await CartAPI.getCartSummary();
      setCartSummary(summary);
    } catch (error) {
      console.error('Error updating cart summary:', error);
    }
  };
  
  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    console.log('Adding to cart:', product, 'quantity:', quantity);
    
    if (!product || !product.id) {
      console.error('Invalid product object:', product);
      return;
    }
    
    try {
      const updatedCart = await CartAPI.addToCart(product, quantity);
      setCart(updatedCart);
      updateCartCount(updatedCart);
      updateCartSummary();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  
  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const updatedCart = await CartAPI.removeFromCart(productId);
      setCart(updatedCart);
      updateCartCount(updatedCart);
      updateCartSummary();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };
  
  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    
    try {
      const updatedCart = await CartAPI.updateCartItemQuantity(productId, quantity);
      setCart(updatedCart);
      updateCartCount(updatedCart);
      updateCartSummary();
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };
  
  // Clear cart
  const clearCart = async () => {
    try {
      await CartAPI.clearCart();
      setCart([]);
      setCartCount(0);
      updateCartSummary();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };
  
  // Value to be provided by the context
  const value = {
    cart,
    cartCount,
    cartSummary,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Export the context
export { CartContext as default };
