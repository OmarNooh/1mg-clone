import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HealthConcerns.module.css';

const HealthConcerns = ({ categories }) => {
  // Filter categories to only show health concerns
  const healthConcerns = categories.filter(category => 
    ['Diabetes Care', 'Heart Care', 'Stomach Care', 'Liver Care', 'Bone & Joint Care', 'Kidney Care', 'Respiratory Care', 'Eye Care'].includes(category.name)
  ).slice(0, 8);

  return (
    <div className={styles.healthConcerns}>
      <div className={styles.concernsGrid}>
        {healthConcerns.map((concern) => (
          <Link 
            to={`/category/${concern.id}`} 
            key={concern.id} 
            className={styles.concernCard}
          >
            <div className={styles.concernImage}>
              <img src={concern.image} alt={concern.name} />
            </div>
            <h3 className={styles.concernName}>{concern.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HealthConcerns;
