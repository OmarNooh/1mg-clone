import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaGoogle, FaFacebook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import styles from './SignUpModal.module.css';
import { useAuth } from "../../../contexts/AuthContext";

/**
 * Sign Up Modal Component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to call when modal is closed
 * @param {function} props.onLoginClick - Function to call when login is clicked
 */
const SignUpModal = ({ isOpen, onClose, onLoginClick }) => {
  const [step, setStep] = useState(1); // 1: email/phone, 2: password, 3: name/details
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [identifier, setIdentifier] = useState(''); // email or phone
  
  const { signup, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'identifier') {
      setIdentifier(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Update error from auth context
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleStep1Submit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!identifier) {
      setError('Please enter your email or phone number');
      return;
    }
    
    // Validate email format or phone format
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isPhone = /^\+?[\d\s-()]+$/.test(identifier);
    
    if (!isEmail && !isPhone) {
      setError('Please enter a valid email or phone number');
      return;
    }
    
    // Check if user exists (mock implementation)
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2); // Move to password step
    }, 1000);
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.password) {
      setError('Please enter your password');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setStep(3); // Move to final details step
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name) {
      setError('Please enter your name');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!agreeTerms) {
      setError('Please agree to the Terms and Conditions');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const email = identifier.includes('@') ? identifier : `${identifier}@temp.com`;
      const success = signup(email, formData.password, formData.name);
      
      setIsLoading(false);
      
      if (success) {
        onClose();
        navigate('/');
      }
    } catch (err) {
      setIsLoading(false);
      setError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', err);
    }
  };

  const handleSocialSignUp = (provider) => {
    setError('');
    setIsLoading(true);
    
    // In a real app, this would connect to OAuth providers
    // For now, we'll simulate a successful signup with a mock user
    try {
      // Create a mock user with the provider name
      const mockName = `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`;
      const mockEmail = `${provider.toLowerCase()}.user@example.com`;
      const mockPassword = 'password123';
      
      const success = signup(mockEmail, mockPassword, mockName);
      
      setIsLoading(false);
      
      if (success) {
        onClose();
        navigate('/');
      }
    } catch (err) {
      setIsLoading(false);
      setError(`${provider} signup failed. Please try again.`);
      console.error(`${provider} signup error:`, err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Account"
      size="small"
    >
      <div className={styles.signupContainer}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className={styles.signupForm}>
            <h3>Step 1: Enter Your Details</h3>
            <div className={styles.formGroup}>
              <label htmlFor="identifier">Email or Phone Number</label>
              <div className={styles.inputWithIcon}>
                <FaEnvelope className={styles.inputIcon} />
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={identifier}
                  onChange={handleChange}
                  placeholder="Enter your email or phone"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className={styles.signupButton}
              disabled={isLoading}
            >
              {isLoading ? 'Checking...' : 'Continue'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2Submit} className={styles.signupForm}>
            <h3>Step 2: Create Password</h3>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWithIcon}>
                <FaLock className={styles.inputIcon} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className={styles.signupButton}
              disabled={isLoading}
            >
              Continue
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className={styles.signupForm}>
            <h3>Step 3: Complete Your Profile</h3>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <div className={styles.inputWithIcon}>
                <FaUser className={styles.inputIcon} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <div className={styles.inputWithIcon}>
                <FaEnvelope className={styles.inputIcon} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <div className={styles.inputWithIcon}>
                <FaPhone className={styles.inputIcon} />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWithIcon}>
                <FaLock className={styles.inputIcon} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className={styles.inputWithIcon}>
                <FaLock className={styles.inputIcon} />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className={styles.termsContainer}>
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
                disabled={isLoading}
              />
              <label htmlFor="agreeTerms">
                I agree to the <a href="#" className={styles.termsLink}>Terms and Conditions</a>
              </label>
            </div>
            
            <button 
              type="submit" 
              className={styles.signupButton}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Complete Sign Up'}
            </button>
          </form>
        )}
        
        <div className={styles.divider}>
          <span>OR</span>
        </div>
        
        <div className={styles.socialSignup}>
          <button 
            className={`${styles.socialButton} ${styles.googleButton}`}
            onClick={() => handleSocialSignUp('google')}
            disabled={isLoading}
          >
            <FaGoogle />
            <span>Sign up with Google</span>
          </button>
          
          <button 
            className={`${styles.socialButton} ${styles.facebookButton}`}
            onClick={() => handleSocialSignUp('facebook')}
            disabled={isLoading}
          >
            <FaFacebook />
            <span>Sign up with Facebook</span>
          </button>
        </div>
        
        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>1</div>
          <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>2</div>
          <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>3</div>
        </div>
        
        <div className={styles.loginPrompt}>
          <p>
            Already have an account? 
            <button 
              className={styles.loginLink}
              onClick={onLoginClick}
              disabled={isLoading}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default SignUpModal;
