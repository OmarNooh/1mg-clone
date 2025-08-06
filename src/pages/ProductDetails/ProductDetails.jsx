import React, { useState } from 'react';
import styles from './ProductDetails.module.css';
import image1 from '../../assets/images/La-Roche-Posay/images.png';
import image2 from '../../assets/images/La-Roche-Posay/images 2.png';
import image3 from '../../assets/images/La-Roche-Posay/images3.png';
import image4 from '../../assets/images/La-Roche-Posay/images4.png';
import image5 from '../../assets/images/La-Roche-Posay/images5.png';

const ProductDetails = () => {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState('subscribe');
  const [selectedImage, setSelectedImage] = useState(image1);
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [image1, image2, image4, image3, image5, image3, image5];

  const handleThumbnailClick = (image, index) => {
    setSelectedImage(image);
    setCurrentSlide(index);
  };

  const previousSlide = () => {
    const prevIndex = currentSlide === 0 ? images.length - 1 : currentSlide - 1;
    setCurrentSlide(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  const nextSlide = () => {
    const nextIndex = currentSlide === images.length - 1 ? 0 : currentSlide + 1;
    setCurrentSlide(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setSelectedImage(images[index]);
  };

  // Helper functions for action buttons
  const handleShare = () => {
    console.log('Share clicked');
  };

  const handleFavorite = () => {
    console.log('Favorite clicked');
  };

  const handleZoom = () => {
    console.log('Zoom clicked');
  };

  const handleVideoPlay = () => {
    console.log('Video play clicked');
  };
  
  const handleClick = () => {
    console.log('View in 3D clicked');
  };

  return (
    <div className={styles.container}>
      {/* Empty div with specified height and margins */}
      <div className={styles.emptyDiv}></div>
      
      <div className={styles.productDetails}>
        <div className={styles.productDetailsContainer}>
          {/* Left side - Product images */}
          <div className={styles.leftSection}> 
            <section className={styles.mainLeftContainer}>
              <div className={styles.thumbnails}>
                <div className={styles.thumbnailContainer}>

                  <div className={styles.thumbnailImage}>
                    <button 
                      className={styles.thumbnailButton}
                      onClick={() => handleThumbnailClick(image1, 0)}
                    >
                      <div className={styles.thumbnailImageWrapper}>
                        <img loading="lazy" src={image1} alt="image 1" className={styles.thumbnailImage} />
                      </div>
                    </button>
                  </div>

                  <div className={styles.thumbnailImage}>
                    <button 
                      className={styles.thumbnailButton}
                      onClick={() => handleThumbnailClick(image2, 1)}
                    >
                      <div className={styles.thumbnailImageWrapper}>
                        <img loading="lazy" src={image2} alt="image 2" className={styles.thumbnailImage} />
                      </div>
                    </button>
                  </div>

                  <div className={styles.thumbnailImage}>
                    <button 
                      className={styles.thumbnailButton}
                      onClick={() => handleThumbnailClick(image4, 2)}
                    >
                      <div className={styles.thumbnailImageWrapper}>
                        <img loading="lazy" src={image4} alt="image 3" className={styles.thumbnailImage} />
                      </div>
                    </button>
                  </div>

                  <div className={styles.thumbnailImage}>
                    <button 
                      className={styles.thumbnailButton}
                      onClick={() => handleThumbnailClick(image3, 3)}
                    >
                      <div className={styles.thumbnailImageWrapper}>
                        <img loading="lazy" src={image3} alt="image 4" className={styles.thumbnailImage} />
                      </div>
                    </button>
                  </div>

                  <div className={styles.thumbnailImage}>
                    <button 
                      className={styles.thumbnailButton}
                      onClick={() => handleThumbnailClick(image5, 4)}
                    >
                      <div className={styles.thumbnailImageWrapper}>
                        <img loading="lazy" src={image5} alt="image 5" className={styles.thumbnailImage} />
                      </div>
                    </button>
                  </div>

                  <div className={styles.thumbnailImage}>
                    <button 
                      className={styles.thumbnailButton}
                      onClick={() => handleThumbnailClick(image3, 5)}
                    >
                      <div className={styles.thumbnailImageWrapper}>
                        <img loading="lazy" src={image3} alt="image 6" className={styles.thumbnailImage} />
                      </div>
                    </button>
                  </div>

                  <div className={styles.thumbnailImage}>
                    <button 
                      className={styles.thumbnailButton}
                      onClick={() => handleThumbnailClick(image5, 6)}
                    >
                      <div className={styles.thumbnailImageWrapper}>
                        <img loading="lazy" src={image5} alt="image 7" className={styles.thumbnailImage} />
                        <div className={styles.thumbnailImageOverlay} aria-hidden="true">
                          <div className={styles.thumbnailImageOverlayText}>
                            <div className={styles.thumbnailImageOverlayNumbers}>
                              <span className={styles.thumbnailImageOverlayPlus}>+</span>
                              <span className={styles.thumbnailImageOverlayNumber}>4</span>
                            </div>
                            <span>View All</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>

                </div>
              </div>
              
              <div className={styles.productCarousel}>
                <div className={styles.carouselWrapper}>
                  <div className={styles.carouselSlides} id="carouselSlides">
                    <div className={styles.carouselSlide}>
                      <img src={selectedImage} alt="Product Image" className={styles.productImage}/>
                    </div>
                  </div>
                  
                  {/* Navigation arrows */}
                  <button className={`${styles.navArrow} ${styles.prev}`} onClick={previousSlide}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15,18 9,12 15,6"></polyline>
                    </svg>
                  </button>
                  <button className={`${styles.navArrow} ${styles.next}`} onClick={nextSlide}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                  </button>

                  {/* Action buttons */}
                  <div className={styles.actionButtons}>
                    <button className={styles.actionBtn} title="Share" onClick={handleShare}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                        <polyline points="16,6 12,2 8,6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                      </svg>
                    </button>
                    <button className={styles.actionBtn} title="Add to favorites" onClick={handleFavorite}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                    <button className={styles.actionBtn} title="Zoom" onClick={handleZoom}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="21 21l-4.35-4.35"/>
                        <line x1="11" y1="8" x2="11" y2="14"/>
                        <line x1="8" y1="11" x2="14" y2="11"/>
                      </svg>
                    </button>
                    <button className={styles.actionBtn} title="Play video" onClick={handleVideoPlay}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21"/>
                      </svg>
                    </button>
                  </div>

                  {/* Carousel indicators */}
                  <div className={styles.carouselIndicators}>
                    {images.map((_, index) => (
                      <div 
                        key={index} 
                        className={`${styles.indicator} ${currentSlide === index ? styles.active : ''}`} 
                        onClick={() => goToSlide(index)}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
                
            {/* Removed duplicate action buttons since they're now in the carousel */}
            
            </section>
          </div>

          {/* Middle section - Product info */}
          <div className={styles.productInfo}>
            <div className={styles.popularTag}>
              <span className={styles.popularBadge}>Popular pick</span>
              <span className={styles.premiumHour}>"premium hour"</span>
            </div>
            
            <div className={styles.brand}>Nexium</div>
            
            <h1 className={styles.productTitle}>
              Nexium 24HR Acid Reducer Heartburn Relief Capsules with 
              Esomeprazole Magnesium - 42 Count
            </h1>
            
            <div className={styles.rating}>
              <div className={styles.stars}>
                ★★★★★
              </div>
              <span className={styles.ratingCount}>(4.8)</span>
              <span className={styles.reviewCount}>167 reviews</span>
            </div>

            <div className={styles.healthConcern}>
              <span>Health Concern:</span> <span>Acid Reflux</span>
            </div>

            <div className={styles.options}>
              <div className={styles.optionGroup}>
                <button className={styles.optionButton}>
                  <div>Acid Indigestion</div>
                  <div>$30.26</div>
                </button>
                <button className={`${styles.optionButton} ${styles.selected}`}>
                  <div>Acid Reflux</div>
                  <div>$26.54</div>
                  <div className={styles.countInfo}>42 count</div>
                </button>
              </div>
            </div>

            <div className={styles.quantity}>
              <div className={styles.quantityLabel}>Multipack Quantity: <span>1</span></div>
              <div className={styles.quantityButtons}>
                <button 
                  className={selectedQuantity === 1 ? styles.quantitySelected : styles.quantityButton}
                  onClick={() => setSelectedQuantity(1)}
                >
                  1
                </button>
                <button 
                  className={selectedQuantity === 2 ? styles.quantitySelected : styles.quantityButton}
                  onClick={() => setSelectedQuantity(2)}
                >
                  2
                </button>
              </div>
            </div>

            <div className={styles.aboutSection}>
              <h3>About this item</h3>
              <div className={styles.aboutText}>
                <p>Contains: 42 Nexium 24HR Acid Reducer Heartburn Relief Capsules with Esomeprazole Magnesium*</p>
                <p>24-Hour Heartburn Relief: Nexium provides protection from heartburn*</p>
                <p>Blocks Acid at the Source: Acid reducers that turn the body's acid pumps from on to off for complete heartburn protection*</p>
                <p>Daily Heartburn Medicine: Just one easy to swallow capsule provides 24-hour relief, letting you get through day and night without interruptions*</p>
                <p>Frequent Heartburn Treatment: May take 1 to 4 days for full effect; this ingredient esomeprazole magnesium shuts down stomach's acid pumps to treat heartburn...</p>
              </div>
              <button className={styles.viewMore}>View more ▽</button>
            </div>

            <div className={styles.specifications}>
              <h3>At a glance</h3>
              <div className={styles.specGrid}>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Brand</div>
                  <div className={styles.specValue}>Nexium</div>
                </div>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Form</div>
                  <div className={styles.specValue}>Capsules</div>
                </div>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Count</div>
                  <div className={styles.specValue}>42</div>
                </div>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Age group</div>
                  <div className={styles.specValue}>Adult</div>
                </div>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Symptoms</div>
                  <div className={styles.specValue}>Heartburn</div>
                </div>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Condition</div>
                  <div className={styles.specValue}>New</div>
                </div>
              </div>
              <button className={styles.viewSpecs}>View all specifications</button>
            </div>
          </div>

          {/* Right side - Purchase section */}
          <div className={styles.purchaseSection}>
            <div className={styles.price}>$26.54 <span className={styles.priceUnit}>65.2¢/count</span></div>
            <div className={styles.returnInfo}>🔵 Free 90-day returns</div>
            
            <button className={styles.addToCart}>Add to cart</button>

            <div className={styles.purchaseOptions}>
              <label className={`${styles.option} ${selectedOption === 'subscribe' ? styles.optionSelected : ''}`}>
                <input 
                  type="radio" 
                  name="purchaseOption" 
                  value="subscribe" 
                  checked={selectedOption === 'subscribe'}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <div className={styles.optionContent}>
                  <div className={styles.optionTitle}>Subscribe</div>
                  <div className={styles.optionPrice}>$26.54</div>
                  <div className={styles.optionDetails}>
                    <div className={styles.userIcon}>👤</div>
                    <div>
                      <div>Your usual, on your schedule</div>
                      <div>Save time and stay stocked!</div>
                      <div className={styles.howItWorks}>How it works</div>
                    </div>
                  </div>
                </div>
              </label>

              <label className={`${styles.option} ${selectedOption === 'onetime' ? styles.optionSelected : ''}`}>
                <input 
                  type="radio" 
                  name="purchaseOption" 
                  value="onetime" 
                  checked={selectedOption === 'onetime'}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <div className={styles.optionContent}>
                  <div className={styles.optionTitle}>One-time purchase</div>
                  <div className={styles.optionPrice}>$26.54</div>
                </div>
              </label>
            </div>

            <div className={styles.deliveryInfo}>
              <h4>How you'll get this item:</h4>
              <div className={styles.deliveryOptions}>
                <div className={styles.deliveryOption}>
                  <div className={styles.deliveryIcon}>🚚</div>
                  <div className={styles.deliveryText}>
                    <div>Shipping</div>
                    <div>Arrives tomorrow</div>
                    <div>Order within 1 hr</div>
                    <div>48 min</div>
                  </div>
                </div>
                <div className={styles.deliveryOption}>
                  <div className={styles.deliveryIcon}>🏪</div>
                  <div className={styles.deliveryText}>
                    <div>Pickup</div>
                    <div>As soon as 2pm today</div>
                  </div>
                </div>
                <div className={styles.deliveryOption}>
                  <div className={styles.deliveryIcon}>🚚</div>
                  <div className={styles.deliveryText}>
                    <div>Delivery</div>
                    <div>As soon as 2pm tomorrow</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.locationInfo}>
              <div>Sacramento, 95829 <button className={styles.changeLocation}>Change</button></div>
              <div>Arrives by Tomorrow. Order within 4 hr 46 min</div>
            </div>

            <div className={styles.sellerInfo}>
              <span>★</span> Sold and shipped by Walmart.com
            </div>

            <div className={styles.returnPolicy}>
              🔵 Free 90-day returns Details
            </div>

            <div className={styles.eligibility}>
              📦 FSA and HSA eligible Details
            </div>

            <div className={styles.actions}>
              <button className={styles.addToList}>♡ Add to list</button>
              <button className={styles.addToRegistry}>⚹ Add to registry</button>
            </div>

            <div className={styles.moreOptions}>
              <div className={styles.moreOptionsHeader}>More seller options (1)</div>
              <div className={styles.moreOptionsText}>
                Starting from $24.39 <button>Compare all sellers</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;