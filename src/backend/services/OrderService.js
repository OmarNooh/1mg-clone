/**
 * Order Service
 * Handles all order-related operations
 */

import { saveToStorage, getFromStorage } from '../utils/storage';
import { validateOrder, createOrder, updateOrderStatus } from '../models/Order';
import { getUserById } from './UserService';

// Storage key for orders
const ORDERS_STORAGE_KEY = 'hood_medical_orders';

/**
 * Initialize order service with default data if needed
 * @param {Array} initialOrders - Initial orders data to use if no data exists
 */
export const initializeOrderService = (initialOrders = []) => {
  const existingOrders = getFromStorage(ORDERS_STORAGE_KEY);
  
  if (!existingOrders) {
    saveToStorage(ORDERS_STORAGE_KEY, initialOrders);
  }
};

/**
 * Get total sales
 * @returns {number} - Total sales amount
 */
export const getTotalSales = () => {
  const orders = getAllOrders();
  
  // Calculate total sales from all completed orders
  const totalSales = orders.reduce((total, order) => {
    // Only count completed or delivered orders
    if (order.status === 'Completed' || order.status === 'Delivered') {
      // Extract numeric value from totalAmount string (e.g., "TZS 1500.00" -> 1500)
      const amount = parseFloat(order.totalAmount.replace(/[^0-9.]/g, '')) || 0;
      return total + amount;
    }
    return total;
  }, 0);
  
  return totalSales;
};

/**
 * Get orders count
 * @returns {number} - Number of orders
 */
export const getOrdersCount = () => {
  const orders = getAllOrders();
  return orders.length;
};

/**
 * Get recent orders
 * @param {number} limit - Maximum number of orders to return
 * @returns {Array} - Array of recent orders
 */
export const getRecentOrders = (limit = 5) => {
  const orders = getAllOrders();
  
  // Sort by order date (descending)
  orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  
  // Return most recent N orders
  return orders.slice(0, limit);
};

/**
 * Get order statistics
 * @returns {Object} - Order statistics
 */
export const getOrderStatistics = () => {
  const orders = getAllOrders();
  
  // Calculate total sales
  const totalSales = getTotalSales();
  
  // Calculate average order value
  const completedOrders = orders.filter(order => 
    order.status === 'Completed' || order.status === 'Delivered'
  );
  
  const avgOrderValue = completedOrders.length > 0 ? 
    totalSales / completedOrders.length : 0;
  
  // Count orders by status
  const ordersByStatus = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
  
  // Get top locations
  const locationCounts = orders.reduce((acc, order) => {
    const city = order.shippingAddress?.city || 'Unknown';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});
  
  const topLocations = Object.entries(locationCounts)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return {
    totalSales: `TZS ${totalSales.toFixed(2)}`,
    ordersCount: orders.length,
    avgOrderValue: `TZS ${avgOrderValue.toFixed(2)}`,
    ordersByStatus,
    topLocations
  };
};

/**
 * Get all orders
 * @returns {Array} - Array of orders
 */
export const getAllOrders = () => {
  return getFromStorage(ORDERS_STORAGE_KEY, []);
};

/**
 * Get order by ID
 * @param {string} orderId - Order ID
 * @returns {Object|null} - Order object or null if not found
 */
export const getOrderById = (orderId) => {
  const orders = getAllOrders();
  return orders.find(order => order.id === orderId) || null;
};

/**
 * Get orders by user ID
 * @param {string} userId - User ID
 * @returns {Array} - Array of user's orders
 */
export const getOrdersByUserId = (userId) => {
  const user = getUserById(userId);
  
  if (!user) {
    return [];
  }
  
  const orders = getAllOrders();
  return orders.filter(order => order.email.toLowerCase() === user.email.toLowerCase());
};

/**
 * Create a new order
 * @param {Object} user - User data
 * @param {Array} cartItems - Cart items
 * @param {Object} shippingDetails - Shipping details
 * @returns {Object} - Result object with success flag and order or errors
 */
export const placeOrder = (user, cartItems, shippingDetails) => {
  if (!cartItems || cartItems.length === 0) {
    return {
      success: false,
      errors: { items: 'Cart is empty' }
    };
  }
  
  const newOrder = createOrder(user, cartItems, shippingDetails);
  const validation = validateOrder(newOrder);
  
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors
    };
  }
  
  const orders = getAllOrders();
  const updatedOrders = [...orders, newOrder];
  
  saveToStorage(ORDERS_STORAGE_KEY, updatedOrders);
  
  return {
    success: true,
    order: newOrder
  };
};

/**
 * Update an order's status
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Object} - Result object with success flag and order or errors
 */
export const updateOrder = (orderId, status) => {
  const orders = getAllOrders();
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return {
      success: false,
      errors: { general: 'Order not found' }
    };
  }
  
  try {
    const updatedOrder = updateOrderStatus(orders[orderIndex], status);
    
    const updatedOrders = [
      ...orders.slice(0, orderIndex),
      updatedOrder,
      ...orders.slice(orderIndex + 1)
    ];
    
    saveToStorage(ORDERS_STORAGE_KEY, updatedOrders);
    
    return {
      success: true,
      order: updatedOrder
    };
  } catch (error) {
    return {
      success: false,
      errors: { status: error.message }
    };
  }
};

/**
 * Delete an order
 * @param {string} orderId - Order ID
 * @returns {Object} - Result object with success flag
 */
export const deleteOrder = (orderId) => {
  const orders = getAllOrders();
  const updatedOrders = orders.filter(order => order.id !== orderId);
  
  if (updatedOrders.length === orders.length) {
    return {
      success: false,
      errors: { general: 'Order not found' }
    };
  }
  
  saveToStorage(ORDERS_STORAGE_KEY, updatedOrders);
  
  return {
    success: true
  };
};

// Duplicate functions removed
