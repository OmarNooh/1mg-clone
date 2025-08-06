/**
 * API Abstraction Layer
 * Provides a consistent interface for frontend components to communicate with backend services
 */

import * as ProductService from '../services/ProductService';
import * as UserService from '../services/UserService';
import * as OrderService from '../services/OrderService';
import * as PasswordResetService from '../services/PasswordResetService';
import { products } from '../../data/products';

// Initialize services with mock data
const initializeServices = () => {
  ProductService.initializeProductService(products);
  UserService.initializeUserService([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@hoodmedical.com',
      phone: '+255 755 123 456',
      password: 'Admin@123',
      role: 'Admin',
      status: 'Active',
      joinDate: '2025-01-01',
      orders: 0,
      addresses: [
        {
          id: '1',
          type: 'Office',
          address: 'HOOD Medical HQ, Msasani Peninsula',
          city: 'Dar es Salaam',
          postalCode: '11101',
          isDefault: true
        }
      ],
      wishlist: []
    }
  ]);
  OrderService.initializeOrderService([]);
};

// Initialize on first import
initializeServices();

/**
 * Product API
 */
export const ProductAPI = {
  /**
   * Get products count
   * @returns {Promise<number>} - Promise resolving to number of products
   */
  getProductsCount: () => {
    return Promise.resolve(ProductService.getProductsCount());
  },
  
  /**
   * Get top selling products
   * @param {number} limit - Maximum number of products to return
   * @returns {Promise<Array>} - Promise resolving to array of top selling products
   */
  getTopSellingProducts: (limit = 5) => {
    return Promise.resolve(ProductService.getTopSellingProducts(limit));
  },
  
  /**
   * Get all products
   * @returns {Promise<Array>} - Promise resolving to array of products
   */
  getAllProducts: () => {
    return Promise.resolve(ProductService.getAllProducts());
  },
  
  /**
   * Get product by ID
   * @param {string} productId - Product ID
   * @returns {Promise<Object|null>} - Promise resolving to product or null
   */
  getProductById: (productId) => {
    return Promise.resolve(ProductService.getProductById(productId));
  },
  
  /**
   * Search products
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Promise resolving to array of matching products
   */
  searchProducts: (query) => {
    return Promise.resolve(ProductService.searchProducts(query));
  },
  
  /**
   * Get products by category
   * @param {string} category - Category name
   * @returns {Promise<Array>} - Promise resolving to array of products
   */
  getProductsByCategory: (category) => {
    return Promise.resolve(ProductService.getProductsByCategory(category));
  },
  
  /**
   * Get top-rated products
   * @param {number} limit - Maximum number of products to return
   * @returns {Promise<Array>} - Promise resolving to array of products
   */
  getTopRatedProducts: (limit = 10) => {
    return Promise.resolve(ProductService.getTopRatedProducts(limit));
  },
  
  /**
   * Get recommended products
   * @param {number} limit - Maximum number of products to return
   * @param {string} excludeProductId - Product ID to exclude
   * @returns {Promise<Array>} - Promise resolving to array of products
   */
  getRecommendedProducts: (limit = 24, excludeProductId = null) => {
    return Promise.resolve(ProductService.getRecommendedProducts(limit, excludeProductId));
  },
  
  /**
   * Add a new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  addProduct: (productData) => {
    return Promise.resolve(ProductService.addProduct(productData));
  },
  
  /**
   * Update an existing product
   * @param {string} productId - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  updateProduct: (productId, productData) => {
    return Promise.resolve(ProductService.updateProduct(productId, productData));
  },
  
  /**
   * Delete a product
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  deleteProduct: (productId) => {
    return Promise.resolve(ProductService.deleteProduct(productId));
  }
};

/**
 * User API
 */
export const UserAPI = {
  /**
   * Get customers count
   * @returns {Promise<number>} - Promise resolving to number of customers
   */
  getCustomersCount: () => {
    return Promise.resolve(UserService.getCustomersCount());
  },
  
  /**
   * Get current user settings
   * @returns {Promise<Object>} - Promise resolving to current user settings
   */
  getCurrentUserSettings: () => {
    return Promise.resolve(UserService.getCurrentUserSettings());
  },
  
  /**
   * Update current user settings
   * @param {Object} settings - Updated settings
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  updateCurrentUserSettings: (settings) => {
    return Promise.resolve(UserService.updateCurrentUserSettings(settings));
  },
  
  /**
   * Update notification settings
   * @param {Object} settings - Updated notification settings
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  updateNotificationSettings: (settings) => {
    return Promise.resolve(UserService.updateNotificationSettings(settings));
  },
  
  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  changePassword: (currentPassword, newPassword) => {
    return Promise.resolve(UserService.changePassword(currentPassword, newPassword));
  },
  
  /**
   * Update security settings
   * @param {Object} settings - Updated security settings
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  updateSecuritySettings: (settings) => {
    return Promise.resolve(UserService.updateSecuritySettings(settings));
  },
  
  /**
   * Update role permissions
   * @param {Object} permissions - Updated role permissions
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  updateRolePermissions: (permissions) => {
    return Promise.resolve(UserService.updateRolePermissions(permissions));
  },
  
  /**
   * Get all users
   * @returns {Promise<Array>} - Promise resolving to array of users
   */
  getAllUsers: () => {
    return Promise.resolve(UserService.getAllUsers());
  },
  
  /**
   * Get user's wishlist
   * @returns {Promise<Array>} - Promise resolving to array of wishlist items
   */
  getWishlist: async () => {
    const currentUser = UserService.getCurrentUser();
    if (!currentUser) {
      return Promise.resolve([]);
    }
    return Promise.resolve(currentUser.wishlist || []);
  },
  
  /**
   * Add product to wishlist
   * @param {Object} product - Product to add to wishlist
   * @returns {Promise<Array>} - Promise resolving to updated wishlist
   */
  addToWishlist: async (product) => {
    const currentUser = UserService.getCurrentUser();
    if (!currentUser) {
      return Promise.reject(new Error('User not logged in'));
    }
    
    const result = UserService.addToWishlist(currentUser.id, product);
    if (result.success) {
      return Promise.resolve(result.user.wishlist || []);
    }
    return Promise.reject(new Error(result.errors?.general || 'Failed to add to wishlist'));
  },
  
  /**
   * Remove product from wishlist
   * @param {string} productId - Product ID to remove
   * @returns {Promise<Array>} - Promise resolving to updated wishlist
   */
  removeFromWishlist: async (productId) => {
    const currentUser = UserService.getCurrentUser();
    if (!currentUser) {
      return Promise.reject(new Error('User not logged in'));
    }
    
    const result = UserService.removeFromWishlist(currentUser.id, productId);
    if (result.success) {
      return Promise.resolve(result.user.wishlist || []);
    }
    return Promise.reject(new Error(result.errors?.general || 'Failed to remove from wishlist'));
  },
  
  /**
   * Clear entire wishlist
   * @returns {Promise<Array>} - Promise resolving to empty array
   */
  clearWishlist: async () => {
    const currentUser = UserService.getCurrentUser();
    if (!currentUser) {
      return Promise.reject(new Error('User not logged in'));
    }
    
    // Update user with empty wishlist
    const result = UserService.updateUser(currentUser.id, {
      ...currentUser,
      wishlist: []
    });
    
    if (result.success) {
      return Promise.resolve([]);
    }
    return Promise.reject(new Error(result.errors?.general || 'Failed to clear wishlist'));
  },
  
  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  requestPasswordReset: (email) => {
    return Promise.resolve(PasswordResetService.requestPasswordReset(email));
  },
  
  /**
   * Reset password with token
   * @param {string} email - User email
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  resetPassword: (email, token, newPassword) => {
    return Promise.resolve(PasswordResetService.resetPassword(email, token, newPassword));
  },
  
  /**
   * Validate reset token
   * @param {string} email - User email
   * @param {string} token - Reset token
   * @returns {Promise<boolean>} - Promise resolving to token validity
   */
  validateResetToken: (email, token) => {
    return Promise.resolve(PasswordResetService.validateResetToken(email, token));
  },
  
  /**
   * Reset password
   * @param {string} email - User email
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  resetPassword: (email, token, newPassword) => {
    return Promise.resolve(PasswordResetService.resetPassword(email, token, newPassword));
  },
  
  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} - Promise resolving to user or null
   */
  getUserById: (userId) => {
    return Promise.resolve(UserService.getUserById(userId));
  },
  
  /**
   * Register a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  signup: (userData) => {
    return Promise.resolve(UserService.createUser(userData));
  },
  
  /**
   * Login a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} rememberMe - Whether to remember the user session
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  login: (email, password, rememberMe = false) => {
    return Promise.resolve(UserService.login(email, password, rememberMe));
  },
  
  logout: async () => {
    return UserService.logout();
  },
  
  signup: async (userData) => {
    return UserService.createUser(userData);
  },
  
  getCurrentUser: async () => {
    return UserService.getCurrentUser();
  },
  
  isSessionValid: async () => {
    return UserService.isSessionValid();
  },
  
  refreshSession: async () => {
    return UserService.refreshSession();
  },
  
  /**
   * Update an existing user
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  updateUser: (userId, userData) => {
    return Promise.resolve(UserService.updateUser(userId, userData));
  },
  
  /**
   * Delete a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  deleteUser: (userId) => {
    return Promise.resolve(UserService.deleteUser(userId));
  },
  
  /**
   * Add address to user
   * @param {string} userId - User ID
   * @param {Object} address - Address object
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  addUserAddress: (userId, address) => {
    return Promise.resolve(UserService.addUserAddress(userId, address));
  },
  
  /**
   * Add product to user's wishlist
   * @param {string} userId - User ID
   * @param {Object} product - Product to add to wishlist
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  addToWishlist: (userId, product) => {
    return Promise.resolve(UserService.addToWishlist(userId, product));
  },
  
  /**
   * Remove product from user's wishlist
   * @param {string} userId - User ID
   * @param {string} productId - Product ID to remove
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  removeFromWishlist: (userId, productId) => {
    return Promise.resolve(UserService.removeFromWishlist(userId, productId));
  }
};

/**
 * Order API
 */
export const OrderAPI = {
  /**
   * Get total sales
   * @returns {Promise<number>} - Promise resolving to total sales amount
   */
  getTotalSales: () => {
    return Promise.resolve(OrderService.getTotalSales());
  },
  
  /**
   * Get orders count
   * @returns {Promise<number>} - Promise resolving to number of orders
   */
  getOrdersCount: () => {
    return Promise.resolve(OrderService.getOrdersCount());
  },
  
  /**
   * Get all orders
   * @returns {Promise<Array>} - Promise resolving to array of orders
   */
  getAllOrders: () => {
    return Promise.resolve(OrderService.getAllOrders());
  },
  
  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Object|null>} - Promise resolving to order or null
   */
  getOrderById: (orderId) => {
    return Promise.resolve(OrderService.getOrderById(orderId));
  },
  
  /**
   * Get orders by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Promise resolving to array of orders
   */
  getOrdersByUserId: (userId) => {
    return Promise.resolve(OrderService.getOrdersByUserId(userId));
  },
  
  /**
   * Place a new order
   * @param {Object} user - User data
   * @param {Array} cartItems - Cart items
   * @param {Object} shippingDetails - Shipping details
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  placeOrder: (user, cartItems, shippingDetails) => {
    return Promise.resolve(OrderService.placeOrder(user, cartItems, shippingDetails));
  },
  
  /**
   * Update an order's status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  updateOrder: (orderId, status) => {
    return Promise.resolve(OrderService.updateOrder(orderId, status));
  },
  
  /**
   * Delete an order
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} - Promise resolving to result object
   */
  deleteOrder: (orderId) => {
    return Promise.resolve(OrderService.deleteOrder(orderId));
  },
  
  /**
   * Get recent orders
   * @param {number} limit - Maximum number of orders to return
   * @returns {Promise<Array>} - Promise resolving to array of orders
   */
  getRecentOrders: (limit = 5) => {
    return Promise.resolve(OrderService.getRecentOrders(limit));
  },
  
  /**
   * Get order statistics
   * @returns {Promise<Object>} - Promise resolving to order statistics
   */
  getOrderStatistics: () => {
    return Promise.resolve(OrderService.getOrderStatistics());
  }
};

/**
 * Cart API
 * Handles cart operations using localStorage
 */
export const CartAPI = {
  CART_STORAGE_KEY: 'hood_medical_cart',
  
  /**
   * Get cart items
   * @returns {Promise<Array>} - Promise resolving to array of cart items
   */
  getCartItems: () => {
    const cartItems = JSON.parse(localStorage.getItem(CartAPI.CART_STORAGE_KEY) || '[]');
    return Promise.resolve(cartItems);
  },
  
  /**
   * Add item to cart
   * @param {Object} product - Product to add
   * @param {number} quantity - Quantity to add
   * @returns {Promise<Array>} - Promise resolving to updated cart items
   */
  addToCart: (product, quantity = 1) => {
    const cartItems = JSON.parse(localStorage.getItem(CartAPI.CART_STORAGE_KEY) || '[]');
    
    // Check if product is already in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Update quantity if product exists
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item if product doesn't exist
      cartItems.push({
        ...product,
        quantity
      });
    }
    
    localStorage.setItem(CartAPI.CART_STORAGE_KEY, JSON.stringify(cartItems));
    return Promise.resolve(cartItems);
  },
  
  /**
   * Update cart item quantity
   * @param {string} productId - Product ID
   * @param {number} quantity - New quantity
   * @returns {Promise<Array>} - Promise resolving to updated cart items
   */
  updateCartItemQuantity: (productId, quantity) => {
    const cartItems = JSON.parse(localStorage.getItem(CartAPI.CART_STORAGE_KEY) || '[]');
    
    const updatedItems = cartItems.map(item => {
      if (item.id === productId) {
        return {
          ...item,
          quantity: Math.max(1, quantity) // Ensure quantity is at least 1
        };
      }
      return item;
    });
    
    localStorage.setItem(CartAPI.CART_STORAGE_KEY, JSON.stringify(updatedItems));
    return Promise.resolve(updatedItems);
  },
  
  /**
   * Remove item from cart
   * @param {string} productId - Product ID to remove
   * @returns {Promise<Array>} - Promise resolving to updated cart items
   */
  removeFromCart: (productId) => {
    const cartItems = JSON.parse(localStorage.getItem(CartAPI.CART_STORAGE_KEY) || '[]');
    
    const updatedItems = cartItems.filter(item => item.id !== productId);
    
    localStorage.setItem(CartAPI.CART_STORAGE_KEY, JSON.stringify(updatedItems));
    return Promise.resolve(updatedItems);
  },
  
  /**
   * Clear cart
   * @returns {Promise<Array>} - Promise resolving to empty array
   */
  clearCart: () => {
    localStorage.setItem(CartAPI.CART_STORAGE_KEY, '[]');
    return Promise.resolve([]);
  },
  
  /**
   * Calculate cart summary
   * @returns {Promise<Object>} - Promise resolving to cart summary
   */
  getCartSummary: async () => {
    const cartItems = await CartAPI.getCartItems();
    
    const subtotal = cartItems.reduce((total, item) => {
      return total + (parseFloat(item.discountedPrice) * parseInt(item.quantity));
    }, 0);
    
    const totalMRP = cartItems.reduce((total, item) => {
      return total + (parseFloat(item.mrp) * parseInt(item.quantity));
    }, 0);
    
    const totalDiscount = totalMRP - subtotal;
    const deliveryCharges = subtotal < 500 ? 49 : 0;
    const totalAmount = subtotal + deliveryCharges;
    
    return {
      subtotal: `TZS ${subtotal.toFixed(2)}`,
      totalMRP: `TZS ${totalMRP.toFixed(2)}`,
      totalDiscount: `TZS ${totalDiscount.toFixed(2)}`,
      deliveryCharges: `TZS ${deliveryCharges.toFixed(2)}`,
      totalAmount: `TZS ${totalAmount.toFixed(2)}`,
      itemCount: cartItems.length,
      totalQuantity: cartItems.reduce((total, item) => total + parseInt(item.quantity), 0)
    };
  }
};

/**
 * Store API
 * Handles store settings operations
 */
export const StoreAPI = {
  /**
   * Get store settings
   * @returns {Promise<Object>} - Promise resolving to store settings
   */
  getStoreSettings: () => {
    const settings = JSON.parse(localStorage.getItem('hood_store_settings') || JSON.stringify({
      storeName: 'HOOD Medical Store',
      storeEmail: 'contact@hoodmedical.co.tz',
      storePhone: '+255 755 123 456',
      currency: 'TZS',
      language: 'en'
    }));
    
    return Promise.resolve(settings);
  },
  
  /**
   * Update store settings
   * @param {Object} settings - Updated store settings
   * @returns {Promise<Object>} - Promise resolving to updated store settings
   */
  updateStoreSettings: (settings) => {
    const currentSettings = JSON.parse(localStorage.getItem('hood_store_settings') || '{}');
    const updatedSettings = { ...currentSettings, ...settings };
    
    localStorage.setItem('hood_store_settings', JSON.stringify(updatedSettings));
    return Promise.resolve(updatedSettings);
  }
};

// Export a default API object with all APIs
export default {
  Product: ProductAPI,
  User: UserAPI,
  Order: OrderAPI,
  Cart: CartAPI,
  Store: StoreAPI
};
