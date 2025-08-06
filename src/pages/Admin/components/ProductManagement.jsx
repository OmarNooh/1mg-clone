import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import styles from './AdminComponents.module.css';
import { ProductAPI } from '../../../backend/api/index';

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await ProductAPI.getAllProducts();
        setProductList(products);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Filter products based on search term
  const filteredProducts = productList.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddProduct = () => {
    setShowAddForm(true);
    setEditingProduct(null);
  };
  
  const handleEditProduct = async (product) => {
    try {
      // Get full product details if needed
      const fullProduct = await ProductAPI.getProductById(product.id);
      setEditingProduct(fullProduct || product);
      setShowAddForm(true);
    } catch (err) {
      console.error('Error fetching product details:', err);
      setEditingProduct(product); // Fallback to basic product info
      setShowAddForm(true);
    }
  };
  
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await ProductAPI.deleteProduct(productId);
        setProductList(prevProducts => prevProducts.filter(p => p.id !== productId));
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product. Please try again.');
      }
    }
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get form data
      const formData = new FormData(e.target);
      const productData = {
        id: editingProduct ? editingProduct.id : Date.now().toString(),
        name: formData.get('name'),
        manufacturer: formData.get('manufacturer'),
        description: formData.get('description'),
        mrp: parseFloat(formData.get('mrp')),
        discountedPrice: parseFloat(formData.get('discountedPrice')),
        image: formData.get('image') || 'https://via.placeholder.com/300',
        category: formData.get('category'),
        stock: parseInt(formData.get('stock')),
        rating: parseFloat(formData.get('rating')),
        ratingCount: parseInt(formData.get('ratingCount')),
      };
      
      if (editingProduct) {
        // Update existing product via API
        await ProductAPI.updateProduct(productData);
        setProductList(prevProducts => 
          prevProducts.map(p => p.id === editingProduct.id ? productData : p)
        );
      } else {
        // Add new product via API
        const newProduct = await ProductAPI.createProduct(productData);
        setProductList(prevProducts => [...prevProducts, newProduct]);
      }
      
      // Reset form
      setShowAddForm(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product. Please try again.');
    }
  };
  
  return (
    <div className={styles.productManagement}>
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : !showAddForm ? (
        <>
          <div className={styles.productHeader}>
            <div className={styles.searchBar}>
              <FaSearch className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className={styles.addButton} onClick={handleAddProduct}>
              <FaPlus /> Add Product
            </button>
          </div>
          
          <div className={styles.productGrid}>
            {filteredProducts.map(product => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={product.image} alt={product.name} />
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productPrice}>TZS{product.discountedPrice}</p>
                  <div className={styles.productMeta}>
                    <span>Stock: {product.stock || 'N/A'}</span>
                    <span>Category: {product.category || 'N/A'}</span>
                  </div>
                  <div className={styles.productActions}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEditProduct(product)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className={styles.noProducts}>
                <p>No products found matching your search.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className={styles.productForm}>
          <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleFormSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Product Name</label>
              <input 
                type="text" 
                name="name" 
                className={styles.formInput}
                defaultValue={editingProduct?.name || ''}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Manufacturer</label>
              <input 
                type="text" 
                name="manufacturer" 
                className={styles.formInput}
                defaultValue={editingProduct?.manufacturer || ''}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Description</label>
              <textarea 
                name="description" 
                className={styles.formTextarea}
                defaultValue={editingProduct?.description || ''}
                required
              ></textarea>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>MRP (TZS)</label>
                <input 
                  type="number" 
                  name="mrp" 
                  step="0.01"
                  className={styles.formInput}
                  defaultValue={editingProduct?.mrp || ''}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Discounted Price (TZS)</label>
                <input 
                  type="number" 
                  name="discountedPrice" 
                  step="0.01"
                  className={styles.formInput}
                  defaultValue={editingProduct?.discountedPrice || ''}
                  required
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category</label>
                <select 
                  name="category" 
                  className={styles.formSelect}
                  defaultValue={editingProduct?.category || ''}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="vitamins">Vitamins & Supplements</option>
                  <option value="ayurveda">Ayurveda</option>
                  <option value="healthcare">Healthcare Devices</option>
                  <option value="personal-care">Personal Care</option>
                  <option value="health-food">Health Food & Drinks</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Stock</label>
                <input 
                  type="number" 
                  name="stock" 
                  className={styles.formInput}
                  defaultValue={editingProduct?.stock || ''}
                  required
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Rating</label>
                <input 
                  type="number" 
                  name="rating" 
                  step="0.1"
                  min="0"
                  max="5"
                  className={styles.formInput}
                  defaultValue={editingProduct?.rating || ''}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Rating Count</label>
                <input 
                  type="number" 
                  name="ratingCount" 
                  className={styles.formInput}
                  defaultValue={editingProduct?.ratingCount || ''}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Image URL</label>
              <input 
                type="text" 
                name="image" 
                className={styles.formInput}
                defaultValue={editingProduct?.image || ''}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                }}
              >
                Cancel
              </button>
              <button type="submit" className={styles.saveButton}>
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
