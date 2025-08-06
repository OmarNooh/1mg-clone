import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaFilter, FaStar, FaHeart, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import AddToCartButton from '../../components/AddToCartButton/AddToCartButton';
import styles from './SearchResults.module.css';

// Import mock data
import { products } from '../../data/products';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    brands: [],
    discounts: [],
    ratings: []
  });
  
  // Filter options
  const filterOptions = {
    categories: [
      { id: 'ayurveda', name: 'Ayurveda' },
      { id: 'vitamins', name: 'Vitamins & Supplements' },
      { id: 'healthcare', name: 'Healthcare Devices' },
      { id: 'personal-care', name: 'Personal Care' },
      { id: 'health-food', name: 'Health Food & Drinks' }
    ],
    brands: [
      { id: 'himalaya', name: 'Himalaya' },
      { id: 'dabur', name: 'Dabur' },
      { id: 'patanjali', name: 'Patanjali' },
      { id: 'baidyanath', name: 'Baidyanath' },
      { id: 'dr-morepen', name: 'Dr. Morepen' }
    ],
    discounts: [
      { id: '10', name: '10% and above' },
      { id: '20', name: '20% and above' },
      { id: '30', name: '30% and above' },
      { id: '40', name: '40% and above' },
      { id: '50', name: '50% and above' }
    ],
    ratings: [
      { id: '4', name: '4★ & above' },
      { id: '3', name: '3★ & above' },
      { id: '2', name: '2★ & above' },
      { id: '1', name: '1★ & above' }
    ]
  };
  
  // Sort options
  const sortOptions = [
    { id: 'popularity', name: 'Popularity' },
    { id: 'price-low-to-high', name: 'Price: Low to High' },
    { id: 'price-high-to-low', name: 'Price: High to Low' },
    { id: 'discount', name: 'Discount' }
  ];
  
  // Filter products based on search query and selected filters
  useEffect(() => {
    let results = [...products];
    
    // Filter by search query
    if (query) {
      results = results.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.manufacturer.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Apply category filters
    if (selectedFilters.categories.length > 0) {
      results = results.filter(product => 
        selectedFilters.categories.includes(product.category)
      );
    }
    
    // Apply brand filters
    if (selectedFilters.brands.length > 0) {
      results = results.filter(product => 
        selectedFilters.brands.includes(product.manufacturer.toLowerCase())
      );
    }
    
    // Apply discount filters
    if (selectedFilters.discounts.length > 0) {
      results = results.filter(product => {
        const discount = product.discountPercentage;
        return selectedFilters.discounts.some(d => discount >= parseInt(d));
      });
    }
    
    // Apply rating filters
    if (selectedFilters.ratings.length > 0) {
      results = results.filter(product => {
        const rating = product.rating;
        return selectedFilters.ratings.some(r => rating >= parseInt(r));
      });
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low-to-high':
        results.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case 'price-high-to-low':
        results.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case 'discount':
        results.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      default: // popularity
        // No sorting needed as products are already sorted by popularity
        break;
    }
    
    setFilteredProducts(results);
  }, [query, selectedFilters, sortOption]);
  
  // Toggle filter selection
  const toggleFilter = (type, id) => {
    setSelectedFilters(prev => {
      const updatedFilters = { ...prev };
      
      if (updatedFilters[type].includes(id)) {
        updatedFilters[type] = updatedFilters[type].filter(item => item !== id);
      } else {
        updatedFilters[type] = [...updatedFilters[type], id];
      }
      
      return updatedFilters;
    });
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      brands: [],
      discounts: [],
      ratings: []
    });
  };
  
  // Handle add to cart is now handled by the AddToCartButton component
  
  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Filter section component
  const FilterSection = ({ title, options, type }) => {
    const [expanded, setExpanded] = useState(true);
    
    return (
      <div className={styles.filterSection}>
        <div 
          className={styles.filterHeader} 
          onClick={() => setExpanded(!expanded)}
        >
          <h3>{title}</h3>
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        
        {expanded && (
          <div className={styles.filterOptions}>
            {options.map(option => (
              <label key={option.id} className={styles.filterOption}>
                <input 
                  type="checkbox" 
                  checked={selectedFilters[type].includes(option.id)}
                  onChange={() => toggleFilter(type, option.id)}
                />
                <span>{option.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.searchResults}>
      <div className={styles.container}>
        <div className={styles.searchHeader}>
          <h1>Search Results for "{query}"</h1>
          <p>{filteredProducts.length} products found</p>
        </div>
        
        <div className={styles.mobileFilterSort}>
          <button 
            className={styles.filterButton} 
            onClick={toggleMobileFilters}
          >
            <FaFilter /> Filters
          </button>
          
          <div className={styles.sortDropdown}>
            <select 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="" disabled>Sort By</option>
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className={styles.searchContent}>
          <aside className={`${styles.filtersPanel} ${showFilters ? styles.showFilters : ''}`}>
            <div className={styles.filtersPanelHeader}>
              <h2>Filters</h2>
              <button 
                className={styles.clearButton}
                onClick={clearAllFilters}
              >
                Clear All
              </button>
              <button 
                className={styles.closeButton}
                onClick={toggleMobileFilters}
              >
                &times;
              </button>
            </div>
            
            <FilterSection 
              title="Categories" 
              options={filterOptions.categories} 
              type="categories" 
            />
            
            <FilterSection 
              title="Brands" 
              options={filterOptions.brands} 
              type="brands" 
            />
            
            <FilterSection 
              title="Discounts" 
              options={filterOptions.discounts} 
              type="discounts" 
            />
            
            <FilterSection 
              title="Ratings" 
              options={filterOptions.ratings} 
              type="ratings" 
            />
          </aside>
          
          <div className={styles.productsPanel}>
            <div className={styles.sortBar}>
              <span>Sort By:</span>
              {sortOptions.map(option => (
                <button 
                  key={option.id}
                  className={`${styles.sortOption} ${sortOption === option.id ? styles.active : ''}`}
                  onClick={() => setSortOption(option.id)}
                >
                  {option.name}
                </button>
              ))}
            </div>
            
            <div className={styles.productsGrid}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div key={product.id} className={styles.productCard}>
                    <div className={styles.wishlistButton}>
                      <FaHeart />
                    </div>
                    
                    <Link to={`/product/${product.id}`} className={styles.productImageLink}>
                      <div className={styles.productImage}>
                        <img src={product.image} alt={product.name} />
                      </div>
                    </Link>
                    
                    <div className={styles.productInfo}>
                      <Link to={`/product/${product.id}`} className={styles.productNameLink}>
                        <h3 className={styles.productName}>{product.name}</h3>
                      </Link>
                      <p className={styles.productManufacturer}>{product.manufacturer}</p>
                      
                      {product.rating && (
                        <div className={styles.productRating}>
                          <span className={styles.ratingValue}>
                            {product.rating} <FaStar />
                          </span>
                          <span className={styles.ratingCount}>({product.ratingCount})</span>
                        </div>
                      )}
                      
                      <div className={styles.productPricing}>
                        <div className={styles.priceContainer}>
                          <span className={styles.discountedPrice}>₹{product.discountedPrice}</span>
                          {product.mrp !== product.discountedPrice && (
                            <span className={styles.mrp}>₹{product.mrp}</span>
                          )}
                        </div>
                        
                        {product.discountPercentage > 0 && (
                          <span className={styles.discountTag}>{product.discountPercentage}% OFF</span>
                        )}
                      </div>
                      
                      <div className={styles.addToCartWrapper}>
                        <AddToCartButton product={product} className={styles.addToCartButton} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
