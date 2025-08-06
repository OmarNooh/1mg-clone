/**
 * Order Model
 * Defines the structure and validation for order data
 */

/**
 * Validate order data
 * @param {Object} order - The order data to validate
 * @returns {Object} - Object with isValid flag and any validation errors
 */
export const validateOrder = (order) => {
  const errors = {};
  
  // Required fields
  if (!order.customer || order.customer.trim() === '') {
    errors.customer = 'Customer name is required';
  }
  
  if (!order.email || order.email.trim() === '') {
    errors.email = 'Email is required';
  }
  
  if (!order.address || order.address.trim() === '') {
    errors.address = 'Shipping address is required';
  }
  
  if (!order.phone || order.phone.trim() === '') {
    errors.phone = 'Phone number is required';
  }
  
  if (!order.paymentMethod || order.paymentMethod.trim() === '') {
    errors.paymentMethod = 'Payment method is required';
  }
  
  // Items validation
  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    errors.items = 'Order must contain at least one item';
  } else {
    // Validate each item
    const itemErrors = [];
    order.items.forEach((item, index) => {
      const itemError = {};
      
      if (!item.id) {
        itemError.id = 'Item ID is required';
      }
      
      if (!item.name) {
        itemError.name = 'Item name is required';
      }
      
      if (isNaN(parseFloat(item.price)) || parseFloat(item.price) <= 0) {
        itemError.price = 'Item price must be a positive number';
      }
      
      if (isNaN(parseInt(item.quantity)) || parseInt(item.quantity) <= 0) {
        itemError.quantity = 'Item quantity must be a positive integer';
      }
      
      if (Object.keys(itemError).length > 0) {
        itemErrors[index] = itemError;
      }
    });
    
    if (itemErrors.length > 0) {
      errors.itemDetails = itemErrors;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Create a new order object with default values
 * @param {Object} user - User data for the order
 * @param {Array} cartItems - Cart items for the order
 * @param {Object} shippingDetails - Shipping details for the order
 * @returns {Object} - A new order object
 */
export const createOrder = (user, cartItems, shippingDetails) => {
  // Calculate order totals
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
    id: `ORD-${Date.now()}`,
    customer: user.name || shippingDetails.name,
    email: user.email || shippingDetails.email,
    date: new Date().toISOString().split('T')[0],
    status: 'Processing',
    items: cartItems.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: `TZS ${parseFloat(item.discountedPrice).toFixed(2)}`
    })),
    address: shippingDetails.address || '',
    phone: shippingDetails.phone || user.phone || '',
    paymentMethod: shippingDetails.paymentMethod || 'Credit Card',
    subtotal: `TZS ${subtotal.toFixed(2)}`,
    totalMRP: `TZS ${totalMRP.toFixed(2)}`,
    totalDiscount: `TZS ${totalDiscount.toFixed(2)}`,
    deliveryCharges: `TZS ${deliveryCharges.toFixed(2)}`,
    total: `TZS ${totalAmount.toFixed(2)}`
  };
};

/**
 * Get available order statuses
 * @returns {Array} - Array of available order statuses
 */
export const getOrderStatuses = () => {
  return [
    'Processing',
    'Confirmed',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Returned'
  ];
};

/**
 * Update order status
 * @param {Object} order - The order to update
 * @param {string} newStatus - The new status
 * @returns {Object} - Updated order
 */
export const updateOrderStatus = (order, newStatus) => {
  const validStatuses = getOrderStatuses();
  
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid order status: ${newStatus}`);
  }
  
  return {
    ...order,
    status: newStatus,
    statusUpdatedAt: new Date().toISOString()
  };
};
