import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaCreditCard, FaMoneyBillWave, FaMobile, FaCheck, FaLock } from 'react-icons/fa';
import { setPaymentMethod, setCurrentStep, createPaymentIntentAsync } from '../../store/slices/checkoutSlice';
import styles from './PaymentMethodSelection.module.css';

const PaymentMethodSelection = () => {
  const dispatch = useDispatch();
  const { paymentMethod, paymentLoading } = useSelector(state => state.checkout);
  const { totalAmount } = useSelector(state => state.cart);
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod?.type || '');
  
  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: FaCreditCard,
      popular: true
    },
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      description: 'M-Pesa, Tigo Pesa, Airtel Money',
      icon: FaMobile,
      popular: true
    },
    {
      id: 'cash_on_delivery',
      name: 'Cash on Delivery',
      description: 'Pay when your order arrives',
      icon: FaMoneyBillWave,
      fee: 50
    }
  ];
  
  const handleMethodSelect = (method) => {
    setSelectedMethod(method.id);
    dispatch(setPaymentMethod({
      type: method.id,
      name: method.name,
      fee: method.fee || 0
    }));
  };
  
  const handleContinue = async () => {
    if (selectedMethod) {
      // Create payment intent for card payments
      if (selectedMethod === 'credit_card') {
        const paymentMethodData = paymentMethods.find(m => m.id === selectedMethod);
        const totalWithFees = totalAmount + (paymentMethodData.fee || 0);
        
        await dispatch(createPaymentIntentAsync({
          amount: totalWithFees,
          paymentMethod: selectedMethod
        }));
      }
      
      dispatch(setCurrentStep(4));
    }
  };
  
  const handleBack = () => {
    dispatch(setCurrentStep(2));
  };
  
  const getTotal = () => {
    const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);
    const fee = selectedPaymentMethod?.fee || 0;
    return totalAmount + fee;
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.paymentSection}>
        <h2>Choose Payment Method</h2>
        <p>Select how you'd like to pay for your order</p>
        
        <div className={styles.paymentMethods}>
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            
            return (
              <div
                key={method.id}
                className={`${styles.paymentMethod} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleMethodSelect(method)}
              >
                <div className={styles.methodContent}>
                  <div className={styles.methodHeader}>
                    <div className={styles.methodIcon}>
                      <Icon />
                    </div>
                    <div className={styles.methodInfo}>
                      <h4>
                        {method.name}
                        {method.popular && <span className={styles.popularBadge}>Popular</span>}
                      </h4>
                      <p>{method.description}</p>
                      {method.fee && (
                        <span className={styles.fee}>+₹{method.fee} processing fee</span>
                      )}
                    </div>
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
        
        {selectedMethod === 'credit_card' && (
          <div className={styles.cardForm}>
            <h3>Card Details</h3>
            <div className={styles.formGroup}>
              <label>Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className={styles.cardInput}
                maxLength="19"
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className={styles.cardInput}
                  maxLength="5"
                />
              </div>
              <div className={styles.formGroup}>
                <label>CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className={styles.cardInput}
                  maxLength="4"
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className={styles.cardInput}
              />
            </div>
          </div>
        )}
        
        {selectedMethod === 'mobile_money' && (
          <div className={styles.mobileMoneyForm}>
            <h3>Mobile Money Details</h3>
            <div className={styles.formGroup}>
              <label>Select Provider</label>
              <select className={styles.selectInput}>
                <option value="">Choose provider</option>
                <option value="mpesa">M-Pesa</option>
                <option value="tigo">Tigo Pesa</option>
                <option value="airtel">Airtel Money</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="+255 XXX XXX XXX"
                className={styles.cardInput}
              />
            </div>
          </div>
        )}
        
        <div className={styles.orderSummary}>
          <h3>Order Summary</h3>
          <div className={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
          {selectedMethod && paymentMethods.find(m => m.id === selectedMethod)?.fee && (
            <div className={styles.summaryRow}>
              <span>Processing Fee:</span>
              <span>₹{paymentMethods.find(m => m.id === selectedMethod).fee}</span>
            </div>
          )}
          <div className={styles.summaryRow + ' ' + styles.total}>
            <span>Total:</span>
            <span>₹{getTotal().toFixed(2)}</span>
          </div>
        </div>
        
        <div className={styles.actions}>
          <button 
            onClick={handleBack}
            className={styles.backButton}
          >
            Back to Shipping
          </button>
          
          <button 
            onClick={handleContinue}
            className={styles.continueButton}
            disabled={!selectedMethod || paymentLoading}
          >
            {paymentLoading ? 'Processing...' : 'Review Order'}
          </button>
        </div>
      </div>
      
      <div className={styles.securitySection}>
        <div className={styles.securityCard}>
          <div className={styles.securityHeader}>
            <FaLock />
            <h3>Secure Payment</h3>
          </div>
          <ul>
            <li>256-bit SSL encryption</li>
            <li>PCI DSS compliant</li>
            <li>Your payment information is never stored</li>
            <li>Fraud protection included</li>
          </ul>
        </div>
        
        <div className={styles.acceptedCards}>
          <h4>We Accept</h4>
          <div className={styles.cardLogos}>
            <div className={styles.cardLogo}>Visa</div>
            <div className={styles.cardLogo}>Mastercard</div>
            <div className={styles.cardLogo}>M-Pesa</div>
            <div className={styles.cardLogo}>Tigo Pesa</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelection;
