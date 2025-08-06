import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { updateShippingAddress, setCurrentStep, fetchShippingRates } from '../../store/slices/checkoutSlice';
import styles from './ShippingAddressForm.module.css';

const ShippingAddressForm = () => {
  const dispatch = useDispatch();
  const { shippingAddress, loading } = useSelector(state => state.checkout);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: shippingAddress
  });
  
  const onSubmit = async (data) => {
    dispatch(updateShippingAddress(data));
    
    // Fetch shipping rates based on address
    await dispatch(fetchShippingRates(data));
    
    // Move to next step
    dispatch(setCurrentStep(2));
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h2>Shipping Address</h2>
        <p>Please provide your delivery address details</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First Name *</label>
              <input
                id="firstName"
                type="text"
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: { value: 2, message: 'First name must be at least 2 characters' }
                })}
                className={errors.firstName ? styles.error : ''}
              />
              {errors.firstName && (
                <span className={styles.errorMessage}>{errors.firstName.message}</span>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name *</label>
              <input
                id="lastName"
                type="text"
                {...register('lastName', {
                  required: 'Last name is required',
                  minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                })}
                className={errors.lastName ? styles.error : ''}
              />
              {errors.lastName && (
                <span className={styles.errorMessage}>{errors.lastName.message}</span>
              )}
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={errors.email ? styles.error : ''}
              />
              {errors.email && (
                <span className={styles.errorMessage}>{errors.email.message}</span>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                type="tel"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[+]?[\d\s\-\(\)]{10,}$/,
                    message: 'Invalid phone number'
                  }
                })}
                className={errors.phone ? styles.error : ''}
              />
              {errors.phone && (
                <span className={styles.errorMessage}>{errors.phone.message}</span>
              )}
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="address">Street Address *</label>
            <textarea
              id="address"
              rows="3"
              {...register('address', {
                required: 'Address is required',
                minLength: { value: 10, message: 'Address must be at least 10 characters' }
              })}
              className={errors.address ? styles.error : ''}
              placeholder="Enter your full street address"
            />
            {errors.address && (
              <span className={styles.errorMessage}>{errors.address.message}</span>
            )}
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="city">City *</label>
              <input
                id="city"
                type="text"
                {...register('city', {
                  required: 'City is required',
                  minLength: { value: 2, message: 'City must be at least 2 characters' }
                })}
                className={errors.city ? styles.error : ''}
              />
              {errors.city && (
                <span className={styles.errorMessage}>{errors.city.message}</span>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="state">State/Region *</label>
              <select
                id="state"
                {...register('state', { required: 'State is required' })}
                className={errors.state ? styles.error : ''}
              >
                <option value="">Select State</option>
                <option value="Dar es Salaam">Dar es Salaam</option>
                <option value="Arusha">Arusha</option>
                <option value="Mwanza">Mwanza</option>
                <option value="Dodoma">Dodoma</option>
                <option value="Mbeya">Mbeya</option>
                <option value="Morogoro">Morogoro</option>
                <option value="Tanga">Tanga</option>
                <option value="Iringa">Iringa</option>
                <option value="Mtwara">Mtwara</option>
                <option value="Tabora">Tabora</option>
              </select>
              {errors.state && (
                <span className={styles.errorMessage}>{errors.state.message}</span>
              )}
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="zipCode">Postal Code</label>
              <input
                id="zipCode"
                type="text"
                {...register('zipCode', {
                  pattern: {
                    value: /^\d{5}(-\d{4})?$/,
                    message: 'Invalid postal code format'
                  }
                })}
                className={errors.zipCode ? styles.error : ''}
                placeholder="12345"
              />
              {errors.zipCode && (
                <span className={styles.errorMessage}>{errors.zipCode.message}</span>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="country">Country *</label>
              <select
                id="country"
                {...register('country', { required: 'Country is required' })}
                className={errors.country ? styles.error : ''}
              >
                <option value="Tanzania">Tanzania</option>
              </select>
              {errors.country && (
                <span className={styles.errorMessage}>{errors.country.message}</span>
              )}
            </div>
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.continueButton}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Continue to Shipping Method'}
            </button>
          </div>
        </form>
      </div>
      
      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <h3>Delivery Information</h3>
          <ul>
            <li>Free delivery on orders above ₹500</li>
            <li>Standard delivery: 3-5 business days</li>
            <li>Express delivery: 1-2 business days</li>
            <li>Same-day delivery available in select areas</li>
          </ul>
        </div>
        
        <div className={styles.infoCard}>
          <h3>Secure Checkout</h3>
          <ul>
            <li>SSL encrypted secure checkout</li>
            <li>Multiple payment options</li>
            <li>100% secure transactions</li>
            <li>Your data is protected</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressForm;
