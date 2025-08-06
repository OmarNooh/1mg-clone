import React, { useState, useRef, useEffect } from 'react';
import { FaMapMarkerAlt, FaAngleDown, FaAngleUp, FaTimes } from 'react-icons/fa';
import styles from './LocationSelector.module.css';

// Icons for the location options
const ShippingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.optionIcon}>
    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="currentColor"/>
  </svg>
);

const PickupIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.optionIcon}>
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z" fill="currentColor"/>
    <circle cx="7.5" cy="14.5" r="1.5" fill="currentColor"/>
    <circle cx="16.5" cy="14.5" r="1.5" fill="currentColor"/>
  </svg>
);

const DeliveryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.optionIcon}>
    <path d="M19 7V5.5C19 4.12 17.88 3 16.5 3H4.5C3.12 3 2 4.12 2 5.5v9C2 15.88 3.12 17 4.5 17H5c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h1c.55 0 1-.45 1-1v-5.5L19 7zM8 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-3-5H5V5h10v8z" fill="currentColor"/>
  </svg>
);

const LocationSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeOption, setActiveOption] = useState('delivery'); // 'shipping', 'pickup', 'delivery'
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setActiveOption(option);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button 
        className={`${styles.locationButton} ${isOpen ? styles.active : ''}`}
        onClick={handleToggle}
      >
        <div className={styles.locationIcon}>
          <FaMapMarkerAlt />
        </div>
        <div className={styles.locationText}>
          <span className={styles.locationLabel}>Delivery</span>
          <span className={styles.locationValue}>Dar es Salaam, 11101</span>
        </div>
        <div className={styles.arrowIcon}>
          {isOpen ? <FaAngleUp /> : <FaAngleDown />}
        </div>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.optionTabs}>
            <button 
              className={`${styles.optionTab} ${activeOption === 'shipping' ? styles.active : ''}`}
              onClick={() => handleOptionClick('shipping')}
            >
              <div className={styles.optionIconWrapper}>
                <ShippingIcon />
                {activeOption === 'shipping' && (
                  <div className={styles.selectedMark}>
                    <FaTimes />
                  </div>
                )}
              </div>
              <span>Shipping</span>
            </button>
            
            <button 
              className={`${styles.optionTab} ${activeOption === 'pickup' ? styles.active : ''}`}
              onClick={() => handleOptionClick('pickup')}
            >
              <div className={styles.optionIconWrapper}>
                <PickupIcon />
                {activeOption === 'pickup' && (
                  <div className={styles.selectedMark}>
                    <FaTimes />
                  </div>
                )}
              </div>
              <span>Pickup</span>
            </button>
            
            <button 
              className={`${styles.optionTab} ${activeOption === 'delivery' ? styles.active : ''}`}
              onClick={() => handleOptionClick('delivery')}
            >
              <div className={styles.optionIconWrapper}>
                <DeliveryIcon />
                {activeOption === 'delivery' && (
                  <div className={styles.selectedMark}>
                    <FaTimes />
                  </div>
                )}
              </div>
              <span>Delivery</span>
            </button>
          </div>

          {activeOption === 'shipping' && (
            <div className={styles.optionContent}>
              <div className={styles.addressSection}>
                <div className={styles.addressHeader}>
                  <FaMapMarkerAlt className={styles.addressIcon} />
                  <div className={styles.addressText}>
                    <div className={styles.addressLabel}>Add an address for shipping</div>
                    <div className={styles.addressValue}>Dar es Salaam, TZ 11101</div>
                  </div>
                </div>
                <button className={styles.addAddressButton}>Add address</button>
              </div>
              <div className={styles.shippingInfo}>
                <div className={styles.shippingInfoIcon}>2-d</div>
                <div className={styles.shippingInfoText}>
                  2-day shipping, dropped off by FedEx or UPS.<br />
                  Orders over $35 ship free!
                </div>
              </div>
            </div>
          )}

          {activeOption === 'pickup' && (
            <div className={styles.optionContent}>
              <div className={styles.storeSection}>
                <div className={styles.storeHeader}>
                  <div className={styles.storeName}>Dar es Salaam Supercenter</div>
                  <div className={styles.storeAddress}>Msasani Road, Dar es Salaam, TZ 11101</div>
                  <div className={styles.storeArrow}>›</div>
                </div>
                <div className={styles.pickupTimeSection}>
                  <div className={styles.pickupTimeLabel}>Reserve a pickup time</div>
                  <div className={styles.pickupTimeMessage}>To see pickup times, please sign in.</div>
                  <button className={styles.signInButton}>Sign in</button>
                </div>
              </div>
            </div>
          )}

          {activeOption === 'delivery' && (
            <div className={styles.optionContent}>
              <div className={styles.addressSection}>
                <div className={styles.addressHeader}>
                  <FaMapMarkerAlt className={styles.addressIcon} />
                  <div className={styles.addressText}>
                    <div className={styles.addressLabel}>Add an address for delivery</div>
                    <div className={styles.addressValue}>Dar es Salaam, TZ 11101</div>
                  </div>
                </div>
                <button className={styles.addAddressButton}>Add address</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
