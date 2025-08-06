import React from 'react';
import { FaMobileAlt, FaGooglePlay, FaApple } from 'react-icons/fa';
import styles from './DownloadApp.module.css';

const DownloadApp = () => {
  return (
    <div className={styles.downloadApp}>
      <div className={styles.downloadContent}>
        <div className={styles.leftContent}>
          <div className={styles.iconContainer}>
            <FaMobileAlt className={styles.mobileIcon} />
          </div>
          <div className={styles.textContent}>
            <h3>Download the HOOD Medical App</h3>
            <p>Get 20% off on your first order</p>
            <div className={styles.appStores}>
              <a 
                href="https://play.google.com/store/apps/details?id=com.hoodmedical.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.storeButton}
              >
                <FaGooglePlay />
                <span>Google Play</span>
              </a>
              <a 
                href="https://apps.apple.com/tz/app/hoodmedical/id123456789" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.storeButton}
              >
                <FaApple />
                <span>App Store</span>
              </a>
            </div>
          </div>
        </div>
        <div className={styles.rightContent}>
          <div className={styles.phoneImage}>
            <img 
              src="https://images.unsplash.com/photo-1585399000684-d2f72660f092?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
              alt="HOOD Medical Mobile App" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
