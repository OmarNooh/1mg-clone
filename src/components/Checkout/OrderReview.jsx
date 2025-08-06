import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaEdit, FaShoppingCart, FaTruck, FaCreditCard, FaCheck, FaSpinner } from 'react-icons/fa';
import { setCurrentStep, processOrder, clearCartAsync } from '../../store/slices/checkoutSlice';
import { clearCartAsync as clearReduxCart } from '../../store/slices/cartSlice';
import styles from './OrderReview.module.css';

const OrderReview = () => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const { items: cartItems, totalAmount } = useSelector(state => state.cart);
  const { 
    shippingAddress, 
    shippingMethod, 
    paymentMethod, 
    orderProcessing 
  } = useSelector(state => state.checkout);
  
  const shippingCost = shippingMethod?.price || 0;
  const paymentFee = paymentMethod?.fee || 0;
  const finalTotal = totalAmount + shippingCost + paymentFee;
  
  const handlePlaceOrder = async () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    
    setIsProcessing(true);
    
    const orderData = {
      items: cartItems,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      subtotal: totalAmount,
      shippingCost,
      paymentFee,
      total: finalTotal,
      currency: 'TZS'
    };
    
    try {
      await dispatch(processOrder(orderData));
      // Clear cart after successful order
      dispatch(clearReduxCart());
      dispatch(setCurrentStep(5));
    } catch (error) {
      console.error('Order processing failed:', error);
      alert('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleEditStep = (step) => {
    dispatch(setCurrentStep(step));
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.reviewSection}>
        <h2>Review Your Order</h2>
        <p>Please review all details before placing your order</p>
        
        {/* Order Items */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3><FaShoppingCart /> Order Items ({cartItems.length})</h3>
          </div>
          
          <div className={styles.orderItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.orderItem}>
                <img 
                  src={item.image || '/api/placeholder/80/80'} 
                  alt={item.name}
                  className={styles.itemImage}
                />
                <div className={styles.itemDetails}>
                  <h4>{item.name}</h4>
                  <p>{item.brand}</p>
                  <div className={styles.itemMeta}>
                    <span>Qty: {item.quantity}</span>
                    <span>₹{item.price} each</span>
                  </div>
                </div>
                <div className={styles.itemTotal}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Shipping Address */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Shipping Address</h3>
            <button 
              onClick={() => handleEditStep(1)}
              className={styles.editButton}
            >
              <FaEdit /> Edit
            </button>
          </div>
          
          <div className={styles.addressDetails}>
            <p>
              <strong>{shippingAddress.firstName} {shippingAddress.lastName}</strong><br />
              {shippingAddress.address}<br />
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
              {shippingAddress.country}
            </p>
            <p>
              <strong>Email:</strong> {shippingAddress.email}<br />
              <strong>Phone:</strong> {shippingAddress.phone}
            </p>
          </div>
        </div>
        
        {/* Shipping Method */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3><FaTruck /> Shipping Method</h3>
            <button 
              onClick={() => handleEditStep(2)}
              className={styles.editButton}
            >
              <FaEdit /> Edit
            </button>
          </div>
          
          <div className={styles.shippingDetails}>
            <p>
              <strong>{shippingMethod?.name}</strong><br />
              {shippingMethod?.estimatedDays}<br />
              {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
            </p>
          </div>
        </div>
        
        {/* Payment Method */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3><FaCreditCard /> Payment Method</h3>
            <button 
              onClick={() => handleEditStep(3)}
              className={styles.editButton}
            >
              <FaEdit /> Edit
            </button>
          </div>
          
          <div className={styles.paymentDetails}>
            <p>
              <strong>{paymentMethod?.name}</strong><br />
              {paymentFee > 0 && `Processing fee: ₹${paymentFee}`}
            </p>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className={styles.orderSummary}>
          <h3>Order Summary</h3>
          <div className={styles.summaryDetails}>
            <div className={styles.summaryRow}>
              <span>Subtotal ({cartItems.length} items):</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping:</span>
              <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}</span>
            </div>
            {paymentFee > 0 && (
              <div className={styles.summaryRow}>
                <span>Payment Processing Fee:</span>
                <span>₹{paymentFee.toFixed(2)}</span>
              </div>
            )}
            <div className={styles.summaryRow + ' ' + styles.total}>
              <span>Total:</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Terms and Conditions */}
        <div className={styles.termsSection}>
          <label className={styles.termsCheckbox}>
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <span className={styles.checkmark}></span>
            I agree to the <a href="/terms" target="_blank">Terms and Conditions</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
          </label>
        </div>
        
        {/* Place Order Button */}
        <div className={styles.actions}>
          <button 
            onClick={() => handleEditStep(3)}
            className={styles.backButton}
          >
            Back to Payment
          </button>
          
          <button 
            onClick={handlePlaceOrder}
            className={styles.placeOrderButton}
            disabled={!agreedToTerms || isProcessing || orderProcessing}
          >
            {(isProcessing || orderProcessing) ? (
              <>
                <FaSpinner className={styles.spinner} />
                Processing Order...
              </>
            ) : (
              <>
                <FaCheck />
                Place Order - ₹{finalTotal.toFixed(2)}
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className={styles.guaranteeSection}>
        <div className={styles.guaranteeCard}>
          <h3>Our Guarantee</h3>
          <ul>
            <li>✓ 100% authentic products</li>
            <li>✓ Secure payment processing</li>
            <li>✓ Easy returns within 7 days</li>
            <li>✓ 24/7 customer support</li>
          </ul>
        </div>
        
        <div className={styles.supportCard}>
          <h3>Need Help?</h3>
          <p>Contact our customer support team if you have any questions about your order.</p>
          <button className={styles.supportButton}>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;
