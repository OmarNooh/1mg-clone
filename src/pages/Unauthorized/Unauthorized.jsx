import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaHome } from 'react-icons/fa';
import styles from './Unauthorized.module.css';

const Unauthorized = () => {
  return (
    <div className={styles.unauthorizedContainer}>
      <div className={styles.unauthorizedContent}>
        <div className={styles.iconContainer}>
          <FaLock className={styles.lockIcon} />
        </div>
        <h1 className={styles.title}>Access Denied</h1>
        <p className={styles.message}>
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.homeButton}>
            <FaHome className={styles.homeIcon} />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
