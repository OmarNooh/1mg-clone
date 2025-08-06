import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BrandsSection.module.css';

const BrandsSection = () => {
  const brands = [
    {
      id: 1,
      name: 'Himalaya',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      productCount: 320
    },
    {
      id: 2,
      name: 'Dabur',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      productCount: 280
    },
    {
      id: 3,
      name: 'Patanjali',
      image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      productCount: 250
    },
    {
      id: 4,
      name: 'Baidyanath',
      image: 'https://images.unsplash.com/photo-1581594549595-35f6edc7b762?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      productCount: 180
    },
    {
      id: 5,
      name: 'Dr. Morepen',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      productCount: 210
    },
    {
      id: 6,
      name: 'Zandu',
      image: 'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      productCount: 150
    }
  ];

  return (
    <div className={styles.brandsSection}>
      <div className={styles.brandsGrid}>
        {brands.map((brand) => (
          <Link to={`/brands/${brand.id}`} key={brand.id} className={styles.brandCard}>
            <div className={styles.brandImage}>
              <img src={brand.image} alt={brand.name} />
            </div>
            <div className={styles.brandInfo}>
              <h3 className={styles.brandName}>{brand.name}</h3>
              <p className={styles.productCount}>{brand.productCount}+ Products</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BrandsSection;
