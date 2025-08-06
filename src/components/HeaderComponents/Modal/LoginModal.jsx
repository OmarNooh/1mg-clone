import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from './Modal';
import styles from './LoginModal.module.css';
import { useAuth } from "../../../contexts/AuthContext";

/**
 * Login Modal Component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to call when modal is closed
 * @param {function} props.onSignUpClick - Function to call when sign up is clicked
 */
const LoginModal = ({ isOpen, onClose, onSignUpClick }) => {
  const [step, setStep] = useState(1); // 1: email/phone, 2: password
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect location from state, or default to home page
  const from = location.state?.from?.pathname || '/';

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
    
    setStep(2); // Move to password step
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    // Start login process
    setIsLoading(true);
    
    try {
      const email = identifier.includes('@') ? identifier : `${identifier}@temp.com`;
      const success = login(email, password);
      
      setIsLoading(false);
      
      if (success) {
        // Close modal and redirect if needed
        onClose();
        
        // Navigate to the page they were trying to access, or home
        if (from !== '/') {
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      setIsLoading(false);
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    }
  };

  const handleSocialLogin = (provider) => {
    setError('');
    setIsLoading(true);
    
    // In a real app, this would connect to OAuth providers
    // For now, we'll simulate a successful login with the first mock user
    try {
      const success = login('user@example.com', 'user123');
      
      setIsLoading(false);
      
      if (success) {
        onClose();
        if (from !== '/') {
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      setIsLoading(false);
      setError(`${provider} login failed. Please try again.`);
      console.error(`${provider} login error:`, err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign In"
      size="small"
    >
      <div className={styles.loginContainer}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className={styles.loginForm}>
            <h3>Step 1: Enter Your Details</h3>
            <div className={styles.formGroup}>
              <label htmlFor="identifier">Email or Phone Number</label>
              <div className={styles.inputWithIcon}>
                <FaEnvelope className={styles.inputIcon} />
                <input
                  type="text"
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your email or phone"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className={styles.loginButton}
              disabled={isLoading}
            >
              Continue
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2Submit} className={styles.loginForm}>
            <h3>Step 2: Enter Your Password</h3>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWithIcon}>
                <FaLock className={styles.inputIcon} />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className={styles.formOptions}>
              <div className={styles.rememberMe}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <a href="#" className={styles.forgotPassword}>Forgot Password?</a>
            </div>
            
            <button 
              type="submit" 
              className={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}
        
        <div className={styles.divider}>
          <span>OR</span>
        </div>
        
        <div className={styles.socialLogin}>
          <button 
            className={`${styles.socialButton} ${styles.googleButton}`}
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
          >
            <FaGoogle />
            <span>Continue with Google</span>
          </button>
          
          <button 
            className={`${styles.socialButton} ${styles.facebookButton}`}
            onClick={() => handleSocialLogin('facebook')}
            disabled={isLoading}
          >
            <FaFacebook />
            <span>Continue with Facebook</span>
          </button>
        </div>
        
        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>1</div>
          <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>2</div>
        </div>
        
        <div className={styles.signupPrompt}>
          <p>
            Don't have an account? 
            <button 
              className={styles.signupLink}
              onClick={onSignUpClick}
              disabled={isLoading}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
