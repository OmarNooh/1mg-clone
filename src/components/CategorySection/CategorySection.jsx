import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CategorySection.module.css';

const CategorySection = ({ categories }) => {
  return (
    <div className={styles.categorySection}>
      <div className={styles.categoriesGrid}>
        {categories.map((category) => (
          <Link 
            to={`/category/${category.id}`} 
            key={category.id} 
            className={styles.categoryCard}
          >
            <div className={styles.categoryImage}>
              <img src={category.image} alt={category.name} />
            </div>
            <h3 className={styles.categoryName}>{category.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
