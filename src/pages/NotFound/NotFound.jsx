import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.container}>
        <div className={styles.errorIcon}>
          <FaExclamationTriangle />
        </div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className={styles.homeButton}>
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
