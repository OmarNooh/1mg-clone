import React, { useState, useRef, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import styles from './AccountButton.module.css';
import { useAuth } from '../../../contexts/AuthContext';

const AccountButton = ({ onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { currentUser } = useAuth();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSignInClick = () => {
    setIsOpen(false);
    if (onLoginClick) onLoginClick();
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
        className={`${styles.accountButton} ${isOpen ? styles.active : ''}`}
        onClick={handleToggle}
      >
        <FaUser className={styles.userIcon} />
        <div className={styles.buttonText}>
          <span className={styles.signInText}>Sign In</span>
          <span className={styles.accountText}>Account</span>
        </div>
      </button>
      
      {isOpen && (
        <div className={styles.dropdown}>
          {!currentUser ? (
            <>
              <button 
                className={styles.signInButton}
                onClick={handleSignInClick}
              >
                Sign in or create account
              </button>
              
              <div className={styles.dropdownDivider}></div>
              
              <div className={styles.dropdownItem}>
                <span className={styles.icon}>🌐</span>
                Language | English
              </div>
              
              <div className={styles.dropdownItem}>
                <span className={styles.icon}>📋</span>
                Purchase History
              </div>
              
              <div className={styles.dropdownItem}>
                <span className={styles.icon}>W+</span>
                Walmart+
              </div>
            </>
          ) : (
            <>
              <div className={styles.userInfo}>
                <div className={styles.userName}>
                  {currentUser.name || 'User'}
                </div>
                <div className={styles.userEmail}>
                  {currentUser.email || 'user@example.com'}
                </div>
              </div>
              
              <div className={styles.dropdownDivider}></div>
              
              <div className={styles.dropdownItem}>
                <span className={styles.icon}>👤</span>
                Account
              </div>
              
              <div className={styles.dropdownItem}>
                <span className={styles.icon}>📋</span>
                Orders
              </div>
              
              <div className={styles.dropdownItem}>
                <span className={styles.icon}>⚙️</span>
                Settings
              </div>
              
              <div className={styles.dropdownDivider}></div>
              
              <div className={styles.dropdownItem}>
                <span className={styles.icon}>🚪</span>
                Sign Out
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountButton;
