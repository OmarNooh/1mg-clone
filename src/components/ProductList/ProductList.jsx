import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../services/api';
import styles from './ProductList.module.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getAllProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.productListContainer}>
      <h2 className={styles.productListTitle}>All Products</h2>
      
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <Link to={`/product/${product._id}`} className={styles.productLink}>
                <div className={styles.productImageContainer}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className={styles.productImage} 
                  />
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productBrand}>{product.brand}</p>
                  <div className={styles.priceContainer}>
                    <span className={styles.currentPrice}>₹{product.price}</span>
                    {product.discountPrice > 0 && (
                      <span className={styles.originalPrice}>₹{product.discountPrice}</span>
                    )}
                  </div>
                </div>
              </Link>
              <button className={styles.addToCartBtn}>+ Add</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
