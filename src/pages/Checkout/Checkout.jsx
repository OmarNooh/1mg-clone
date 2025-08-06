import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaMapMarkerAlt, FaTruck, FaCreditCard, FaCheck } from 'react-icons/fa';
import { setCurrentStep, resetCheckout } from '../../store/slices/checkoutSlice';
import { loadCartFromStorage } from '../../store/slices/cartSlice';
import ShippingAddressForm from '../../components/Checkout/ShippingAddressForm';
import ShippingMethodSelection from '../../components/Checkout/ShippingMethodSelection';
import PaymentMethodSelection from '../../components/Checkout/PaymentMethodSelection';
import OrderReview from '../../components/Checkout/OrderReview';
import OrderConfirmation from '../../components/Checkout/OrderConfirmation';
import styles from './Checkout.module.css';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items: cartItems, totalAmount } = useSelector(state => state.cart);
  const { currentStep, order } = useSelector(state => state.checkout);
  
  // Load cart from storage on mount
  useEffect(() => {
    dispatch(loadCartFromStorage());
  }, [dispatch]);
  
  // Redirect to cart if empty
  useEffect(() => {
    if (cartItems.length === 0 && currentStep < 5) {
      navigate('/cart');
    }
  }, [cartItems.length, currentStep, navigate]);
  
  // Reset checkout on unmount
  useEffect(() => {
    return () => {
      if (currentStep < 5) {
        dispatch(resetCheckout());
      }
    };
  }, [dispatch, currentStep]);
  
  const steps = [
    { id: 1, title: 'Shipping Address', icon: FaMapMarkerAlt },
    { id: 2, title: 'Shipping Method', icon: FaTruck },
    { id: 3, title: 'Payment Method', icon: FaCreditCard },
    { id: 4, title: 'Review Order', icon: FaCheck },
    { id: 5, title: 'Order Confirmation', icon: FaCheck }
  ];
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ShippingAddressForm />;
      case 2:
        return <ShippingMethodSelection />;
      case 3:
        return <PaymentMethodSelection />;
      case 4:
        return <OrderReview />;
      case 5:
        return <OrderConfirmation order={order} />;
      default:
        return <ShippingAddressForm />;
    }
  };
  
  if (cartItems.length === 0 && currentStep < 5) {
    return (
      <div className={styles.emptyCheckout}>
        <FaShoppingCart className={styles.emptyIcon} />
        <h2>Your cart is empty</h2>
        <p>Add some items to your cart before proceeding to checkout.</p>
        <button 
          className={styles.shopButton}
          onClick={() => navigate('/medicines')}
        >
          Start Shopping
        </button>
      </div>
    );
  }
  
  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutHeader}>
        <h1>Checkout</h1>
        {currentStep < 5 && (
          <div className={styles.orderSummary}>
            <span>{cartItems.length} items</span>
            <span className={styles.totalAmount}>₹{totalAmount.toFixed(2)}</span>
          </div>
        )}
      </div>
      
      {/* Progress Steps */}
      <div className={styles.progressSteps}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isAccessible = currentStep >= step.id;
          
          return (
            <div 
              key={step.id}
              className={`${styles.step} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''} ${!isAccessible ? styles.disabled : ''}`}
            >
              <div className={styles.stepIcon}>
                {isCompleted ? <FaCheck /> : <Icon />}
              </div>
              <span className={styles.stepTitle}>{step.title}</span>
              {index < steps.length - 1 && (
                <div className={`${styles.stepConnector} ${isCompleted ? styles.completed : ''}`} />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Step Content */}
      <div className={styles.stepContent}>
        {renderStepContent()}
      </div>
    </div>
  );
};

export default Checkout;
