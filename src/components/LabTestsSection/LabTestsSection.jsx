import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import styles from './LabTestsSection.module.css';

const LabTestsSection = () => {
  const labTests = [
    {
      id: 1,
      name: 'Complete Blood Count (CBC)',
      description: 'Measures different components of blood including red blood cells, white blood cells, and platelets',
      price: 299,
      discountedPrice: 199,
      image: 'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 2,
      name: 'Diabetes Screening',
      description: 'Tests for blood glucose levels to detect diabetes or pre-diabetes',
      price: 599,
      discountedPrice: 399,
      image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 3,
      name: 'Thyroid Profile',
      description: 'Measures thyroid hormone levels to assess thyroid function',
      price: 499,
      discountedPrice: 349,
      image: 'https://images.unsplash.com/photo-1581594549595-35f6edc7b762?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 4,
      name: 'Vitamin D Test',
      description: 'Measures the level of vitamin D in your blood',
      price: 799,
      discountedPrice: 599,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ];

  return (
    <div className={styles.labTestsSection}>
      <div className={styles.labTestsGrid}>
        {labTests.map((test) => (
          <div key={test.id} className={styles.testCard}>
            <div className={styles.testImage}>
              <img src={test.image} alt={test.name} />
            </div>
            <div className={styles.testContent}>
              <h3 className={styles.testName}>{test.name}</h3>
              <p className={styles.testDescription}>{test.description}</p>
              <div className={styles.testPricing}>
                <span className={styles.discountedPrice}>₹{test.discountedPrice}</span>
                <span className={styles.originalPrice}>₹{test.price}</span>
                <span className={styles.discountTag}>
                  {Math.round(((test.price - test.discountedPrice) / test.price) * 100)}% OFF
                </span>
              </div>
              <Link to={`/lab-tests/${test.id}`} className={styles.bookNowButton}>
                Book Now <FaArrowRight />
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.labTestsInfo}>
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>
            <img src="https://www.1mg.com/images/lab_icon.png" alt="Lab Icon" />
          </div>
          <div className={styles.infoContent}>
            <h4>Certified Labs</h4>
            <p>All labs are NABL accredited and follow strict quality guidelines</p>
          </div>
        </div>
        
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>
            <img src="https://www.1mg.com/images/home_icon.png" alt="Home Icon" />
          </div>
          <div className={styles.infoContent}>
            <h4>Home Sample Collection</h4>
            <p>Samples collected from your doorstep by trained professionals</p>
          </div>
        </div>
        
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>
            <img src="https://www.1mg.com/images/report_icon.png" alt="Report Icon" />
          </div>
          <div className={styles.infoContent}>
            <h4>Digital Reports</h4>
            <p>Get digital reports within 24-48 hours of sample collection</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTestsSection;
