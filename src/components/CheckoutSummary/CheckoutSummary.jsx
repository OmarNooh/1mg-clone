import React, { useState, useEffect } from 'react';
import { FaInfoCircle, FaShieldAlt, FaTruck } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import styles from './CheckoutSummary.module.css';
import { CartAPI } from '../../backend/api/index';

const CheckoutSummary = ({ onCheckout }) => {
  const { cart, cartSummary } = useCart();
  const [summary, setSummary] = useState({
    subtotal: '0.00',
    totalMRP: '0.00',
    totalDiscount: '0.00',
    deliveryCharges: 0,
    totalAmount: '0.00',
    totalSavings: '0.00'
  });
  
  // Get summary from CartAPI
  useEffect(() => {
    const fetchCartSummary = async () => {
      try {
        if (cartSummary) {
          // Use the cart summary from context if available
          setSummary({
            subtotal: cartSummary.subtotal.toFixed(2),
            totalMRP: cartSummary.totalMRP.toFixed(2),
            totalDiscount: cartSummary.totalDiscount.toFixed(2),
            deliveryCharges: cartSummary.deliveryCharges,
            totalAmount: cartSummary.totalAmount.toFixed(2),
            totalSavings: cartSummary.totalDiscount.toFixed(2)
          });
        } else {
          // Fallback to direct API call if context summary is not available
          const apiSummary = await CartAPI.getCartSummary();
          setSummary({
            subtotal: apiSummary.subtotal.toFixed(2),
            totalMRP: apiSummary.totalMRP.toFixed(2),
            totalDiscount: apiSummary.totalDiscount.toFixed(2),
            deliveryCharges: apiSummary.deliveryCharges,
            totalAmount: apiSummary.totalAmount.toFixed(2),
            totalSavings: apiSummary.totalDiscount.toFixed(2)
          });
        }
      } catch (error) {
        console.error('Error fetching cart summary:', error);
      }
    };
    
    fetchCartSummary();
  }, [cart, cartSummary]);

  return (
    <div className={styles.checkoutSummary}>
      <h2 className={styles.summaryTitle}>Order Summary</h2>
      
      <div className={styles.summaryContent}>
        <ul className={styles.summaryList}>
          <li>
            <span>MRP Total</span>
            <span>TZS {summary.totalMRP}</span>
          </li>
          <li>
            <span>Product Discount</span>
            <span className={styles.discount}>-TZS {summary.totalDiscount}</span>
          </li>
          <li>
            <span>Delivery Charges</span>
            <span>{summary.deliveryCharges === 0 ? 
              <span className={styles.free}>FREE</span> : 
              `TZS ${summary.deliveryCharges}`}
            </span>
          </li>
          <li className={styles.total}>
            <span>Total Amount</span>
            <span>TZS {summary.totalAmount}</span>
          </li>
        </ul>
        
        <div className={styles.savings}>
          <FaInfoCircle /> Total Savings: TZS {summary.totalSavings}
        </div>
        
        <div className={styles.benefits}>
          <div className={styles.benefit}>
            <FaShieldAlt className={styles.benefitIcon} />
            <span>Genuine Products</span>
          </div>
          <div className={styles.benefit}>
            <FaTruck className={styles.benefitIcon} />
            <span>Free Delivery on orders above TZS 500</span>
          </div>
        </div>
        
        <button 
          className={styles.checkoutBtn} 
          onClick={onCheckout}
          disabled={cart.length === 0}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CheckoutSummary;
