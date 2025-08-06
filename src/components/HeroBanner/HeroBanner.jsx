import React, { useState, useEffect } from 'react';
import styles from './HeroBanner.module.css';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const banners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      alt: "Health Offers",
      link: "/offers"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      alt: "Lab Tests",
      link: "/lab-tests"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      alt: "Doctor Consultation",
      link: "/doctors"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + banners.length) % banners.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
  };

  return (
    <div className={styles.heroBanner}>
      <div className={styles.bannerContainer}>
        <button className={`${styles.navButton} ${styles.prevButton}`} onClick={goToPrevSlide}>
          &#10094;
        </button>
        
        <div className={styles.slidesContainer}>
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
            >
              <a href={banner.link}>
                <img src={banner.image} alt={banner.alt} />
              </a>
            </div>
          ))}
        </div>
        
        <button className={`${styles.navButton} ${styles.nextButton}`} onClick={goToNextSlide}>
          &#10095;
        </button>
      </div>
      
      <div className={styles.dotsContainer}>
        {banners.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
