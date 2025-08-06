/**
 * Product Service
 * Handles all product-related operations
 */


import { saveToStorage, getFromStorage } from '../utils/storage';
import { validateProduct, calculateDiscountPercentage } from '../models/Product';

// Storage key for products
const PRODUCTS_STORAGE_KEY = 'hood_medical_products';

/**
 * Initialize product service with default data if needed
 * @param {Array} initialProducts - Initial products data to use if no data exists
 */
export const initializeProductService = (initialProducts = []) => {
  const existingProducts = getFromStorage(PRODUCTS_STORAGE_KEY);
  
  if (!existingProducts) {
    // Add discount percentage to each product
    const productsWithDiscount = initialProducts.map(product => ({
      ...product,
      discountPercentage: calculateDiscountPercentage(product.mrp, product.discountedPrice)
    }));
    
    saveToStorage(PRODUCTS_STORAGE_KEY, productsWithDiscount);
  }
};

/**
 * Get products count
 * @returns {number} - Number of products
 */
export const getProductsCount = () => {
  const products = getAllProducts();
  return products.length;
};

/**
 * Get top selling products
 * @param {number} limit - Maximum number of products to return
 * @returns {Array} - Array of top selling products
 */
export const getTopSellingProducts = (limit = 5) => {
  const products = getAllProducts();
  
  // In a real app, this would be based on actual sales data
  // For now, we'll simulate by adding a random salesCount to each product
  const productsWithSales = products.map(product => ({
    ...product,
    salesCount: Math.floor(Math.random() * 200) + 1,
    stockQuantity: Math.floor(Math.random() * 300) + 1
  }));
  
  // Sort by sales count (descending)
  productsWithSales.sort((a, b) => b.salesCount - a.salesCount);
  
  // Return top N products
  return productsWithSales.slice(0, limit);
};

/**
 * Get all products
 * @returns {Array} - Array of products
 */
export const getAllProducts = () => {
  return getFromStorage(PRODUCTS_STORAGE_KEY, []);
};

/**
 * Get product by ID
 * @param {string} productId - Product ID
 * @returns {Object|null} - Product object or null if not found
 */
export const getProductById = (productId) => {
  const products = getAllProducts();
  return products.find(product => product.id === productId) || null;
};

/**
 * Add a new product
 * @param {Object} productData - Product data
 * @returns {Object} - Result object with success flag and product or errors
 */
export const addProduct = (productData) => {
  const validation = validateProduct(productData);
  
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors
    };
  }
  
  const products = getAllProducts();
  
  // Add discount percentage
  const newProduct = {
    ...productData,
    id: productData.id || Date.now().toString(),
    discountPercentage: calculateDiscountPercentage(productData.mrp, productData.discountedPrice)
  };
  
  const updatedProducts = [...products, newProduct];
  saveToStorage(PRODUCTS_STORAGE_KEY, updatedProducts);
  
  return {
    success: true,
    product: newProduct
  };
};

/**
 * Update an existing product
 * @param {string} productId - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Object} - Result object with success flag and product or errors
 */
export const updateProduct = (productId, productData) => {
  const validation = validateProduct(productData);
  
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors
    };
  }
  
  const products = getAllProducts();
  const productIndex = products.findIndex(product => product.id === productId);
  
  if (productIndex === -1) {
    return {
      success: false,
      errors: { general: 'Product not found' }
    };
  }
  
  // Update product with new data and recalculate discount percentage
  const updatedProduct = {
    ...products[productIndex],
    ...productData,
    discountPercentage: calculateDiscountPercentage(productData.mrp, productData.discountedPrice)
  };
  
  const updatedProducts = [
    ...products.slice(0, productIndex),
    updatedProduct,
    ...products.slice(productIndex + 1)
  ];
  
  saveToStorage(PRODUCTS_STORAGE_KEY, updatedProducts);
  
  return {
    success: true,
    product: updatedProduct
  };
};

/**
 * Delete a product
 * @param {string} productId - Product ID
 * @returns {Object} - Result object with success flag
 */
export const deleteProduct = (productId) => {
  const products = getAllProducts();
  const updatedProducts = products.filter(product => product.id !== productId);
  
  if (updatedProducts.length === products.length) {
    return {
      success: false,
      errors: { general: 'Product not found' }
    };
  }
  
  saveToStorage(PRODUCTS_STORAGE_KEY, updatedProducts);
  
  return {
    success: true
  };
};

/**
 * Search products by name, manufacturer, or category
 * @param {string} query - Search query
 * @returns {Array} - Array of matching products
 */
export const searchProducts = (query) => {
  if (!query || query.trim() === '') {
    return getAllProducts();
  }
  
  const products = getAllProducts();
  const lowerQuery = query.toLowerCase().trim();
  
  return products.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.manufacturer.toLowerCase().includes(lowerQuery) ||
    product.category.toLowerCase().includes(lowerQuery) ||
    (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
  );
};

/**
 * Get products by category
 * @param {string} category - Category name
 * @returns {Array} - Array of products in the category
 */
export const getProductsByCategory = (category) => {
  if (!category || category.trim() === '') {
    return [];
  }
  
  const products = getAllProducts();
  const lowerCategory = category.toLowerCase().trim();
  
  return products.filter(product => 
    product.category.toLowerCase() === lowerCategory
  );
};

/**
 * Get top-rated products
 * @param {number} limit - Maximum number of products to return
 * @returns {Array} - Array of top-rated products
 */
export const getTopRatedProducts = (limit = 10) => {
  const products = getAllProducts();
  
  return products
    .filter(product => product.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

/**
 * Get recommended products
 * @param {number} limit - Maximum number of products to return
 * @param {string} excludeProductId - Product ID to exclude from recommendations
 * @returns {Array} - Array of recommended products
 */
export const getRecommendedProducts = (limit = 24, excludeProductId = null) => {
  const products = getAllProducts();
  
  let filtered = products;
  
  // Exclude the specified product if any
  if (excludeProductId) {
    filtered = filtered.filter(product => product.id !== excludeProductId);
  }
  
  // Sort by a combination of rating and discount percentage to get "best" recommendations
  return filtered
    .sort((a, b) => {
      const scoreA = (a.rating || 0) * 0.7 + (a.discountPercentage || 0) * 0.3;
      const scoreB = (b.rating || 0) * 0.7 + (b.discountPercentage || 0) * 0.3;
      return scoreB - scoreA;
    })
    .slice(0, limit);
};
