import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTruck, FaShippingFast, FaBolt, FaCheck } from 'react-icons/fa';
import { setShippingMethod, setCurrentStep } from '../../store/slices/checkoutSlice';
import styles from './ShippingMethodSelection.module.css';

const ShippingMethodSelection = () => {
  const dispatch = useDispatch();
  const { shippingRates, shippingMethod, shippingRatesLoading, shippingAddress } = useSelector(state => state.checkout);
  const { totalAmount } = useSelector(state => state.cart);
  
  const handleMethodSelect = (method) => {
    dispatch(setShippingMethod(method));
  };
  
  const handleContinue = () => {
    if (shippingMethod) {
      dispatch(setCurrentStep(3));
    }
  };
  
  const handleBack = () => {
    dispatch(setCurrentStep(1));
  };
  
  const getShippingIcon = (methodId) => {
    switch (methodId) {
      case 'standard':
        return FaTruck;
      case 'express':
        return FaShippingFast;
      case 'overnight':
        return FaBolt;
      default:
        return FaTruck;
    }
  };
  
  if (shippingRatesLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading shipping options...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.shippingSection}>
        <h2>Choose Shipping Method</h2>
        <p>Select your preferred delivery option</p>
        
        <div className={styles.addressSummary}>
          <h3>Delivering to:</h3>
          <p>
            {shippingAddress.firstName} {shippingAddress.lastName}<br />
            {shippingAddress.address}<br />
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
          </p>
          <button onClick={handleBack} className={styles.changeAddressBtn}>
            Change Address
          </button>
        </div>
        
        <div className={styles.shippingOptions}>
          {shippingRates.map((rate) => {
            const Icon = getShippingIcon(rate.id);
            const isSelected = shippingMethod?.id === rate.id;
            const isFree = totalAmount >= 500 && rate.id === 'standard';
            const finalPrice = isFree ? 0 : rate.price;
            
            return (
              <div
                key={rate.id}
                className={`${styles.shippingOption} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleMethodSelect({ ...rate, price: finalPrice })}
              >
                <div className={styles.optionContent}>
                  <div className={styles.optionHeader}>
                    <div className={styles.optionIcon}>
                      <Icon />
                    </div>
                    <div className={styles.optionInfo}>
                      <h4>{rate.name}</h4>
                      <p>{rate.estimatedDays}</p>
                    </div>
                  </div>
                  
                  <div className={styles.optionPrice}>
                    {isFree ? (
                      <div className={styles.freeShipping}>
                        <span className={styles.originalPrice}>₹{rate.price}</span>
                        <span className={styles.freeText}>FREE</span>
                      </div>
                    ) : (
                      <span className={styles.price}>₹{rate.price}</span>
                    )}
                  </div>
                </div>
                
                {isSelected && (
                  <div className={styles.selectedIndicator}>
                    <FaCheck />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {totalAmount < 500 && (
          <div className={styles.freeShippingPromo}>
            <p>
              💡 Add ₹{(500 - totalAmount).toFixed(2)} more to your order for FREE standard shipping!
            </p>
          </div>
        )}
        
        <div className={styles.actions}>
          <button 
            onClick={handleBack}
            className={styles.backButton}
          >
            Back to Address
          </button>
          
          <button 
            onClick={handleContinue}
            className={styles.continueButton}
            disabled={!shippingMethod}
          >
            Continue to Payment
          </button>
        </div>
      </div>
      
      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <h3>Shipping Information</h3>
          <ul>
            <li>All deliveries require signature confirmation</li>
            <li>Tracking information will be sent via email</li>
            <li>Delivery times are estimates and may vary</li>
            <li>Special handling for temperature-sensitive items</li>
          </ul>
        </div>
        
        <div className={styles.infoCard}>
          <h3>Delivery Areas</h3>
          <ul>
            <li>Same-day delivery in Dar es Salaam city center</li>
            <li>Express delivery to major cities</li>
            <li>Standard delivery nationwide</li>
            <li>Remote area surcharges may apply</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShippingMethodSelection;
