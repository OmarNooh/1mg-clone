import React, { useState, useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from './SearchBar.module.css';

const TRENDING_SEARCHES = [
  'headphones for kids',
  'backpacks for girls',
  '$1 coloring books',
  'superman shirt',
  'miracle-gro',
  'prismatic poster collection'
];

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    if (onSearch) {
      onSearch(searchQuery);
    }
    
    // Simulate search completion
    setTimeout(() => {
      setIsSearching(false);
      setIsFocused(false);
    }, 1000);
  };

  const handleTrendingSearch = (query) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
    setIsFocused(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          ref={searchInputRef}
          type="text"
          className={styles.searchInput}
          placeholder="Search everything at Walmart online and in store"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        <button 
          type="submit" 
          className={`${styles.searchButton} ${isSearching ? styles.searching : ''}`}
          disabled={isSearching}
        >
          <span className={styles.searchIcon}>🔍</span>
        </button>
      </form>

      {isFocused && (
        <div className={styles.searchDropdown} ref={dropdownRef}>
          <div className={styles.trendingSection}>
            <h3 className={styles.trendingTitle}>Trending</h3>
            <div className={styles.trendingItems}>
              {TRENDING_SEARCHES.map((item, index) => (
                <button 
                  key={index} 
                  className={styles.trendingItem}
                  onClick={() => handleTrendingSearch(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
