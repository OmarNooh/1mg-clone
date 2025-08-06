/**
 * Product Model
 * Defines the structure and validation for product data
 */

/**
 * Validate product data
 * @param {Object} product - The product data to validate
 * @returns {Object} - Object with isValid flag and any validation errors
 */
export const validateProduct = (product) => {
  const errors = {};
  
  // Required fields
  if (!product.name || product.name.trim() === '') {
    errors.name = 'Product name is required';
  }
  
  if (!product.manufacturer || product.manufacturer.trim() === '') {
    errors.manufacturer = 'Manufacturer is required';
  }
  
  if (!product.category || product.category.trim() === '') {
    errors.category = 'Category is required';
  }
  
  // Numeric fields
  if (isNaN(parseFloat(product.mrp)) || parseFloat(product.mrp) <= 0) {
    errors.mrp = 'MRP must be a positive number';
  }
  
  if (isNaN(parseFloat(product.discountedPrice)) || parseFloat(product.discountedPrice) < 0) {
    errors.discountedPrice = 'Discounted price must be a non-negative number';
  }
  
  if (parseFloat(product.discountedPrice) > parseFloat(product.mrp)) {
    errors.discountedPrice = 'Discounted price cannot be greater than MRP';
  }
  
  if (isNaN(parseInt(product.stock)) || parseInt(product.stock) < 0) {
    errors.stock = 'Stock must be a non-negative integer';
  }
  
  // Optional numeric fields
  if (product.rating !== undefined && (isNaN(parseFloat(product.rating)) || parseFloat(product.rating) < 0 || parseFloat(product.rating) > 5)) {
    errors.rating = 'Rating must be between 0 and 5';
  }
  
  if (product.ratingCount !== undefined && (isNaN(parseInt(product.ratingCount)) || parseInt(product.ratingCount) < 0)) {
    errors.ratingCount = 'Rating count must be a non-negative integer';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Create a new product object with default values
 * @returns {Object} - A new product object with default values
 */
export const createEmptyProduct = () => {
  return {
    id: Date.now().toString(),
    name: '',
    manufacturer: '',
    description: '',
    mrp: 0,
    discountedPrice: 0,
    image: 'https://via.placeholder.com/300',
    category: '',
    stock: 0,
    rating: 0,
    ratingCount: 0,
    discountPercentage: 0,
    tags: []
  };
};

/**
 * Calculate discount percentage
 * @param {number} mrp - Maximum Retail Price
 * @param {number} discountedPrice - Discounted Price
 * @returns {number} - Discount percentage
 */
export const calculateDiscountPercentage = (mrp, discountedPrice) => {
  if (mrp <= 0 || discountedPrice >= mrp) {
    return 0;
  }
  
  return Math.round(((mrp - discountedPrice) / mrp) * 100);
};
