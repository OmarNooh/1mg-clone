import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { 
  searchProducts, 
  getAutocompleteSuggestions, 
  setQuery, 
  hideSuggestions, 
  showSuggestions,
  clearSuggestions 
} from '../../../store/slices/searchSlice';
import styles from './SearchBox.module.css';

const SearchBox = ({ className = '' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  const { query, suggestions, showSuggestions: showSuggestionsState, suggestionsLoading } = useSelector(state => state.search);
  const [localQuery, setLocalQuery] = useState(query);
  const [isFocused, setIsFocused] = useState(false);

  // Debounce search suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery.length >= 2) {
        dispatch(getAutocompleteSuggestions(localQuery));
      } else {
        dispatch(clearSuggestions());
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, dispatch]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        dispatch(hideSuggestions());
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    dispatch(setQuery(value));
    
    if (value.length >= 2) {
      dispatch(showSuggestions());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      dispatch(searchProducts(localQuery.trim()));
      dispatch(hideSuggestions());
      navigate(`/search?q=${encodeURIComponent(localQuery.trim())}`);
      searchRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocalQuery(suggestion);
    dispatch(setQuery(suggestion));
    dispatch(searchProducts(suggestion));
    dispatch(hideSuggestions());
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    searchRef.current?.blur();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (localQuery.length >= 2 && suggestions.length > 0) {
      dispatch(showSuggestions());
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    dispatch(setQuery(''));
    dispatch(clearSuggestions());
    searchRef.current?.focus();
  };

  const shouldShowSuggestions = isFocused && showSuggestionsState && suggestions.length > 0;

  return (
    <div className={`${styles.searchContainer} ${className}`}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.searchInputWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input
            ref={searchRef}
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            onFocus={handleFocus}
            placeholder="Search for medicines, health products, lab tests..."
            className={styles.searchInput}
            autoComplete="off"
          />
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className={styles.clearButton}
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </div>
      </form>

      {shouldShowSuggestions && (
        <div ref={suggestionsRef} className={styles.suggestionsDropdown}>
          {suggestionsLoading ? (
            <div className={styles.suggestionItem}>
              <div className={styles.loadingSpinner}></div>
              <span>Loading suggestions...</span>
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(suggestion)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSuggestionClick(suggestion);
                  }
                }}
              >
                <FaSearch className={styles.suggestionIcon} />
                <span>{suggestion}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
