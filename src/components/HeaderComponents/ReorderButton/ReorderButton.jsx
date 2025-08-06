import React, { useState, useRef, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import styles from './ReorderButton.module.css';

const ReorderButton = ({ onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (onClick) onClick();
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
        className={`${styles.reorderButton} ${isOpen ? styles.active : ''}`}
        onClick={handleToggle}
      >
        <FaHeart className={styles.heartIcon} />
        <span className={styles.buttonText}>
          Reorder
          <br />
          My Items
        </span>
      </button>
      
      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownItem}>
            <span className={styles.icon}>↻</span>
            Reorder
          </div>
          <div className={styles.dropdownItem}>
            <FaHeart className={styles.icon} />
            Lists
          </div>
          <div className={styles.dropdownItem}>
            <span className={styles.icon}>🎁</span>
            Registries
          </div>
        </div>
      )}
    </div>
  );
};

export default ReorderButton;
