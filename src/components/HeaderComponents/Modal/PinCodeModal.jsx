import React, { useState } from 'react';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import Modal from './Modal';
import styles from './PinCodeModal.module.css';

/**
 * Pin Code Modal Component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to call when modal is closed
 * @param {function} props.onSelectLocation - Function to call when location is selected
 */
const PinCodeModal = ({ isOpen, onClose, onSelectLocation }) => {
  const [pincode, setPincode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Popular cities for quick selection
  const popularCities = [
    { name: 'Dar es Salaam', pincode: '11101' },
    { name: 'Arusha', pincode: '23101' },
    { name: 'Mwanza', pincode: '33101' },
    { name: 'Dodoma', pincode: '41101' },
    { name: 'Tanga', pincode: '53101' },
    { name: 'Zanzibar', pincode: '61101' },
    { name: 'Mbeya', pincode: '71101' },
    { name: 'Morogoro', pincode: '83101' }
  ];

  const handlePincodeChange = (e) => {
    const value = e.target.value;
    setPincode(value);
    
    // Clear previous results and errors when input changes
    setSearchResults([]);
    setError('');
    setSelectedLocation(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    
    // Validate pincode
    if (!pincode || pincode.length < 5) {
      setError('Please enter a valid pincode');
      return;
    }
    
    // Mock search process
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, generate mock results
      if (pincode.length === 6 && /^\d+$/.test(pincode)) {
        setSearchResults([
          { id: 1, area: 'Area 1', city: 'City 1', state: 'State 1', pincode },
          { id: 2, area: 'Area 2', city: 'City 1', state: 'State 1', pincode },
          { id: 3, area: 'Area 3', city: 'City 1', state: 'State 1', pincode }
        ]);
      } else {
        setError('No locations found for this pincode');
      }
    }, 800);
  };

  const handleSelectCity = (city) => {
    setPincode(city.pincode);
    
    // Simulate search with the selected city's pincode
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setSearchResults([
        { id: 1, area: `${city.name} Central`, city: city.name, state: 'State', pincode: city.pincode },
        { id: 2, area: `${city.name} North`, city: city.name, state: 'State', pincode: city.pincode },
        { id: 3, area: `${city.name} South`, city: city.name, state: 'State', pincode: city.pincode }
      ]);
    }, 500);
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation);
      onClose();
    } else {
      setError('Please select a location');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Your Location"
      size="medium"
    >
      <div className={styles.pinCodeContainer}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.inputWithIcon}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              value={pincode}
              onChange={handlePincodeChange}
              placeholder="Enter PIN code"
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className={styles.searchButton}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        <div className={styles.popularCities}>
          <h3>Popular Cities</h3>
          <div className={styles.cityGrid}>
            {popularCities.map((city) => (
              <div 
                key={city.pincode}
                className={styles.cityItem}
                onClick={() => handleSelectCity(city)}
              >
                <FaMapMarkerAlt className={styles.cityIcon} />
                <span>{city.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {searchResults.length > 0 && (
          <div className={styles.searchResults}>
            <h3>Search Results</h3>
            <div className={styles.resultsList}>
              {searchResults.map((location) => (
                <div 
                  key={location.id}
                  className={`${styles.locationItem} ${selectedLocation && selectedLocation.id === location.id ? styles.selected : ''}`}
                  onClick={() => handleSelectLocation(location)}
                >
                  <div className={styles.locationInfo}>
                    <h4>{location.area}</h4>
                    <p>{location.city}, {location.state} - {location.pincode}</p>
                  </div>
                  <div className={styles.radioButton}>
                    <span className={styles.radioCircle}></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {searchResults.length > 0 && (
          <div className={styles.actionButtons}>
            <button 
              className={styles.confirmButton}
              onClick={handleConfirm}
              disabled={!selectedLocation}
            >
              Confirm Location
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PinCodeModal;
