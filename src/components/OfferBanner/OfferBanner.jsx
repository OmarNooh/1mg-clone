import React from 'react';
import { Link } from 'react-router-dom';
import styles from './OfferBanner.module.css';

const OfferBanner = ({ offers }) => {
  return (
    <div className={styles.offerBanner}>
      <div className={styles.offerGrid}>
        {offers.map((offer) => (
          <Link to={`/offers/${offer.id}`} key={offer.id} className={styles.offerCard}>
            <div className={styles.offerImage}>
              <img src={offer.image} alt={offer.title} />
            </div>
            <div className={styles.offerContent}>
              <h3 className={styles.offerTitle}>{offer.title}</h3>
              <p className={styles.offerDescription}>{offer.description}</p>
              {offer.code && (
                <div className={styles.offerCode}>
                  <span>Use Code: </span>
                  <strong>{offer.code}</strong>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OfferBanner;
