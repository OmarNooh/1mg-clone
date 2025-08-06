import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaAngleDown } from 'react-icons/fa';
import styles from './Topbar.module.css';
import { PinCodeModal } from '../Modal';

const Topbar = () => {
  const [location, setLocation] = useState('Delhi');
  const [showLocationModal, setShowLocationModal] = useState(false);

  const toggleLocationModal = () => {
    setShowLocationModal(!showLocationModal);
  };

  const handleSelectLocation = (locationData) => {
    setLocation(locationData.city);
    setShowLocationModal(false);
  };



  return (
    <div className={styles.topbar}>
      <div className={styles.container}>
        <div className={styles.topbarLeft}>
          <div className={styles.locationSelector} onClick={toggleLocationModal}>
            <FaMapMarkerAlt className={styles.locationIcon} />
            <span>{location}</span>
            <FaAngleDown className={styles.arrowIcon} />
          </div>
          
          <PinCodeModal 
            isOpen={showLocationModal}
            onClose={toggleLocationModal}
            onSelectLocation={handleSelectLocation}
          />
        </div>
        
        <div className={styles.topbarRight}>
          <ul className={styles.topbarLinks}>
            <li><Link to="/download-app">Download App</Link></li>
            <li><Link to="/seller">Become a Seller</Link></li>
            <li><Link to="/need-help">Need Help?</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
