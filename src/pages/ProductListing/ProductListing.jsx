import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { FaFilter, FaStar, FaHeart, FaRegHeart, FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAsync } from '../../store/slices/cartSlice';
import { useWishlist } from '../../contexts/WishlistContext';
import styles from './ProductListing.module.css';

// Mock categories data
const categories = {
  'medicines': {
    name: 'Medicines',
    description: 'Prescription and over-the-counter medicines',
    image: '/api/placeholder/1200/300'
  },
  'vitamins': {
    name: 'Vitamins & Supplements',
    description: 'Health supplements and vitamins',
    image: '/api/placeholder/1200/300'
  },
  'personal-care': {
    name: 'Personal Care',
    description: 'Personal hygiene and care products',
    image: '/api/placeholder/1200/300'
  },
  'medical-devices': {
    name: 'Medical Devices',
    description: 'Healthcare and medical equipment',
    image: '/api/placeholder/1200/300'
  }
};

// Mock products data for categories
const mockProducts = {
  'medicines': [
    { id: 1, name: 'Paracetamol 500mg', price: 25, originalPrice: 30, brand: 'Generic', rating: 4.2, reviews: 156, image: '/api/placeholder/200/200', discount: 17 },
    { id: 2, name: 'Cough Syrup', price: 85, originalPrice: 100, brand: 'Benadryl', rating: 4.0, reviews: 89, image: '/api/placeholder/200/200', discount: 15 },
    { id: 3, name: 'Aspirin 75mg', price: 45, originalPrice: 55, brand: 'Disprin', rating: 4.3, reviews: 234, image: '/api/placeholder/200/200', discount: 18 },
    { id: 4, name: 'Antacid Tablets', price: 35, originalPrice: 40, brand: 'ENO', rating: 4.1, reviews: 67, image: '/api/placeholder/200/200', discount: 13 },
    { id: 5, name: 'Vitamin C Tablets', price: 120, originalPrice: 150, brand: 'Limcee', rating: 4.4, reviews: 198, image: '/api/placeholder/200/200', discount: 20 },
    { id: 6, name: 'Pain Relief Gel', price: 95, originalPrice: 110, brand: 'Volini', rating: 4.2, reviews: 145, image: '/api/placeholder/200/200', discount: 14 },
  ],
  'vitamins': [
    { id: 7, name: 'Multivitamin Capsules', price: 300, originalPrice: 400, brand: 'Centrum', rating: 4.5, reviews: 312, image: '/api/placeholder/200/200', discount: 25 },
    { id: 8, name: 'Omega-3 Fish Oil', price: 450, originalPrice: 550, brand: 'Seven Seas', rating: 4.3, reviews: 189, image: '/api/placeholder/200/200', discount: 18 },
    { id: 9, name: 'Calcium + D3', price: 250, originalPrice: 300, brand: 'Shelcal', rating: 4.2, reviews: 267, image: '/api/placeholder/200/200', discount: 17 },
    { id: 10, name: 'Iron Tablets', price: 180, originalPrice: 220, brand: 'Autrin', rating: 4.0, reviews: 134, image: '/api/placeholder/200/200', discount: 18 },
  ],
  'personal-care': [
    { id: 11, name: 'Face Wash', price: 75, originalPrice: 90, brand: 'Cetaphil', rating: 4.3, reviews: 456, image: '/api/placeholder/200/200', discount: 17 },
    { id: 12, name: 'Hand Sanitizer', price: 45, originalPrice: 55, brand: 'Dettol', rating: 4.4, reviews: 289, image: '/api/placeholder/200/200', discount: 18 },
    { id: 13, name: 'Moisturizer', price: 120, originalPrice: 150, brand: 'Nivea', rating: 4.2, reviews: 178, image: '/api/placeholder/200/200', discount: 20 },
  ],
  'medical-devices': [
    { id: 14, name: 'Digital Thermometer', price: 250, originalPrice: 300, brand: 'Omron', rating: 4.5, reviews: 123, image: '/api/placeholder/200/200', discount: 17 },
    { id: 15, name: 'Blood Pressure Monitor', price: 1200, originalPrice: 1500, brand: 'Omron', rating: 4.4, reviews: 89, image: '/api/placeholder/200/200', discount: 20 },
  ]
};

const ProductListing = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();
  
  // Get current page from URL params
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const sortBy = searchParams.get('sort') || 'popularity';
  const priceRange = searchParams.get('price') || '';
  const brandFilter = searchParams.get('brand') || '';
  const ratingFilter = searchParams.get('rating') || '';
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  const itemsPerPage = 12;
  const category = categories[categoryId] || { name: 'Products', description: 'Browse our products' };
  
  // Filter options
  const filterOptions = {
    brands: ['Generic', 'Benadryl', 'Disprin', 'ENO', 'Limcee', 'Volini', 'Centrum', 'Seven Seas', 'Shelcal', 'Autrin', 'Cetaphil', 'Dettol', 'Nivea', 'Omron'],
    priceRanges: [
      { label: 'Under ₹50', value: '0-50' },
      { label: '₹50 - ₹100', value: '50-100' },
      { label: '₹100 - ₹200', value: '100-200' },
      { label: '₹200 - ₹500', value: '200-500' },
      { label: 'Above ₹500', value: '500-9999' }
    ],
    ratings: [
      { label: '4★ & above', value: '4' },
      { label: '3★ & above', value: '3' },
      { label: '2★ & above', value: '2' },
      { label: '1★ & above', value: '1' }
    ]
  };
  
  // Sort options
  const sortOptions = [
    { label: 'Popularity', value: 'popularity' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Customer Rating', value: 'rating' },
    { label: 'Discount', value: 'discount' }
  ];
  
  // Load products for category
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const categoryProducts = mockProducts[categoryId] || [];
      setProducts(categoryProducts);
      setLoading(false);
    };
    
    loadProducts();
  }, [categoryId]);
  
  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];
    
    // Apply brand filter
    if (brandFilter) {
      filtered = filtered.filter(product => product.brand === brandFilter);
    }
    
    // Apply price range filter
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }
    
    // Apply rating filter
    if (ratingFilter) {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter(product => product.rating >= minRating);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        filtered.sort((a, b) => b.discount - a.discount);
        break;
      default: // popularity
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }
    
    setTotalProducts(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    
    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredProducts(filtered.slice(startIndex, endIndex));
  }, [products, currentPage, sortBy, priceRange, brandFilter, ratingFilter]);
  
  const handleFilterChange = (filterType, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value) {
      newParams.set(filterType, value);
    } else {
      newParams.delete(filterType);
    }
    
    newParams.set('page', '1'); // Reset to first page when filtering
    setSearchParams(newParams);
  };
  
  const handleSortChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', value);
    newParams.set('page', '1'); // Reset to first page when sorting
    setSearchParams(newParams);
  };
  
  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleAddToCart = (product) => {
    dispatch(addToCartAsync({ product, quantity: 1 }));
  };
  
  const toggleWishlist = (product) => {
    if (wishlistItems && wishlistItems.some(item => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const clearAllFilters = () => {
    setSearchParams({ page: '1' });
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading products...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      {/* Category Header */}
      <div className={styles.categoryHeader}>
        <div className={styles.categoryBanner}>
          <img src={category.image} alt={category.name} className={styles.categoryImage} />
          <div className={styles.categoryInfo}>
            <h1 className={styles.categoryTitle}>{category.name}</h1>
            <p className={styles.categoryDescription}>{category.description}</p>
          </div>
        </div>
      </div>
      
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link to="/">Home</Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>{category.name}</span>
      </div>
      
      <div className={styles.contentWrapper}>
        {/* Mobile Filter Toggle */}
        <div className={styles.mobileFilterToggle}>
          <button 
            className={styles.filterToggleBtn}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters
          </button>
          
          <div className={styles.resultInfo}>
            <span>{totalProducts} products found</span>
          </div>
        </div>
        
        <div className={styles.mainContent}>
          {/* Sidebar Filters */}
          <aside className={`${styles.sidebar} ${showFilters ? styles.showMobile : ''}`}>
            <div className={styles.filtersHeader}>
              <h3>Filters</h3>
              <button 
                className={styles.clearFilters}
                onClick={clearAllFilters}
              >
                Clear All
              </button>
            </div>
            
            {/* Brand Filter */}
            <div className={styles.filterSection}>
              <h4>Brand</h4>
              <div className={styles.filterOptions}>
                {filterOptions.brands.map(brand => (
                  <label key={brand} className={styles.filterOption}>
                    <input
                      type="radio"
                      name="brand"
                      value={brand}
                      checked={brandFilter === brand}
                      onChange={(e) => handleFilterChange('brand', e.target.checked ? brand : '')}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Price Range Filter */}
            <div className={styles.filterSection}>
              <h4>Price Range</h4>
              <div className={styles.filterOptions}>
                {filterOptions.priceRanges.map(range => (
                  <label key={range.value} className={styles.filterOption}>
                    <input
                      type="radio"
                      name="price"
                      value={range.value}
                      checked={priceRange === range.value}
                      onChange={(e) => handleFilterChange('price', e.target.checked ? range.value : '')}
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Rating Filter */}
            <div className={styles.filterSection}>
              <h4>Customer Rating</h4>
              <div className={styles.filterOptions}>
                {filterOptions.ratings.map(rating => (
                  <label key={rating.value} className={styles.filterOption}>
                    <input
                      type="radio"
                      name="rating"
                      value={rating.value}
                      checked={ratingFilter === rating.value}
                      onChange={(e) => handleFilterChange('rating', e.target.checked ? rating.value : '')}
                    />
                    <span>{rating.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>
          
          {/* Products Section */}
          <main className={styles.productsSection}>
            {/* Sort Options */}
            <div className={styles.sortBar}>
              <div className={styles.sortOptions}>
                <span>Sort by:</span>
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    className={`${styles.sortOption} ${sortBy === option.value ? styles.active : ''}`}
                    onClick={() => handleSortChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Products Grid */}
            <div className={styles.productsGrid}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div key={product.id} className={styles.productCard}>
                    <div className={styles.productImageWrapper}>
                      <button
                        className={styles.wishlistBtn}
                        onClick={() => toggleWishlist(product)}
                        aria-label="Add to wishlist"
                      >
                        {wishlistItems && wishlistItems.some(item => item.id === product.id) ? 
                          <FaHeart className={styles.wishlistActive} /> : 
                          <FaRegHeart />
                        }
                      </button>
                      
                      <Link to={`/product/${product.id}`}>
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className={styles.productImage}
                        />
                      </Link>
                      
                      {product.discount > 0 && (
                        <span className={styles.discountBadge}>
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                    
                    <div className={styles.productInfo}>
                      <Link to={`/product/${product.id}`} className={styles.productName}>
                        {product.name}
                      </Link>
                      
                      <p className={styles.productBrand}>{product.brand}</p>
                      
                      <div className={styles.productRating}>
                        <span className={styles.ratingValue}>
                          {product.rating} <FaStar className={styles.starIcon} />
                        </span>
                        <span className={styles.reviewCount}>({product.reviews})</span>
                      </div>
                      
                      <div className={styles.productPricing}>
                        <span className={styles.currentPrice}>₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className={styles.originalPrice}>₹{product.originalPrice}</span>
                        )}
                      </div>
                      
                      <button
                        className={styles.addToCartBtn}
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noProducts}>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search criteria</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <FaChevronLeft /> Previous
                </button>
                
                <div className={styles.pageNumbers}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`${styles.pageNumber} ${currentPage === page ? styles.active : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  className={styles.pageBtn}
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next <FaChevronRight />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
