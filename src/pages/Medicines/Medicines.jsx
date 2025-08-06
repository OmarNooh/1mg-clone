import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaFilter, FaSort } from 'react-icons/fa';
import AddToCartButton from '../../components/AddToCartButton/AddToCartButton';
import { products } from '../../data/products';
import styles from './Medicines.module.css';

const Medicines = () => {
  const [medicineProducts, setMedicineProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  
  const categories = [
    { id: 'all', name: 'All Medicines' },
    { id: 'covid', name: 'COVID Essentials' },
    { id: 'diabetes', name: 'Diabetes' },
    { id: 'eyecare', name: 'Eye Care' },
    { id: 'skincare', name: 'Skin Care' },
    { id: 'vitamins', name: 'Vitamins & Supplements' },
    { id: 'ayurveda', name: 'Ayurveda' },
    { id: 'homeopathy', name: 'Homeopathy' },
  ];
  
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Filter products that are medicines
      const medicineItems = products.filter(product => 
        product.type === 'medicine' || !product.type
      );
      
      setMedicineProducts(medicineItems);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const getFilteredProducts = () => {
    let filtered = [...medicineProducts];
    
    // Apply category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(product => product.category === activeCategory);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popularity':
      default:
        // Assuming popularity is already factored in the original order
        break;
    }
    
    return filtered;
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const filteredProducts = getFilteredProducts();
  
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading medicines...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.medicines}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Medicines</h1>
          <div className={styles.controls}>
            <button className={styles.filterButton} onClick={toggleFilters}>
              <FaFilter /> Filters
            </button>
            <div className={styles.sortDropdown}>
              <label htmlFor="sort"><FaSort /> Sort by:</label>
              <select 
                id="sort" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className={styles.content}>
          {showFilters && (
            <div className={styles.sidebar}>
              <h3>Categories</h3>
              <ul className={styles.categoryList}>
                {categories.map(category => (
                  <li 
                    key={category.id}
                    className={`${styles.categoryItem} ${activeCategory === category.id ? styles.active : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className={styles.productGrid}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div key={product.id} className={styles.productCard}>
                  <Link to={`/product/${product.id}`} className={styles.productLink}>
                    <div className={styles.productImageContainer}>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className={styles.productImage}
                      />
                    </div>
                    
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.productManufacturer}>{product.manufacturer}</p>
                      
                      {product.rating && (
                        <div className={styles.productRating}>
                          <span className={styles.ratingValue}>
                            {product.rating} <FaStar />
                          </span>
                          {product.ratingCount && (
                            <span className={styles.ratingCount}>({product.ratingCount})</span>
                          )}
                        </div>
                      )}
                      
                      <div className={styles.productPricing}>
                        <span className={styles.discountedPrice}>${product.discountedPrice}</span>
                        {product.mrp !== product.discountedPrice && (
                          <>
                            <span className={styles.mrp}>${product.mrp}</span>
                            <span className={styles.discountTag}>
                              {Math.round(((product.mrp - product.discountedPrice) / product.mrp) * 100)}% off
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                  
                  <div className={styles.addToCartWrapper}>
                    <AddToCartButton product={product} className={styles.addToCartButton} />
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noProducts}>
                <p>No medicines found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Medicines;
