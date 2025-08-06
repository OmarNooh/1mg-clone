import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import styles from './Auth.module.css';
import { useAuth } from '../../contexts/AuthContext';
import { validatePasswordStrength } from '../../backend/utils/validation';
import { UserAPI } from '../../backend/api/index';

const Auth = ({ isModal = false, onClose, redirect = '/' }) => {
  const { 
    login, 
    signup, 
    error: authError, 
    currentUser, 
    accountLocked, 
    remainingAttempts, 
    lockoutRemaining 
  } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetStep, setResetStep] = useState('request'); // request, verify, reset, success
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    confirmPassword: '',
    address: ''
  });
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    strength: 'none',
    feedback: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      if (isModal) {
        onClose();
      } else {
        window.location.href = redirect;
      }
    }
  }, [currentUser, isModal, onClose, redirect]);
  
  // Handle auth errors
  useEffect(() => {
    if (authError) {
      setErrors(prev => ({
        ...prev,
        general: authError
      }));
      setIsSubmitting(false);
    }
  }, [authError, accountLocked, remainingAttempts]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'rememberMe') {
        setRememberMe(checked);
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Check password strength when password changes
      if (name === 'password') {
        const result = validatePasswordStrength(value);
        setPasswordStrength(result);
      }
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (activeTab === 'login') {
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
    } else {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle password reset request
  const handleResetRequest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResetError(null);
    
    try {
      const result = await UserAPI.requestPasswordReset(resetEmail);
      if (result.success) {
        // In a real app, we would wait for the user to receive an email
        // For this demo, we'll just show the token and move to the next step
        setResetToken(result.token);
        setResetStep('verify');
      } else {
        setResetError(result.message || 'Failed to request password reset');
      }
    } catch (error) {
      setResetError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle token verification
  const handleVerifyToken = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResetError(null);
    
    try {
      const isValid = await UserAPI.validateResetToken(resetEmail, resetToken);
      if (isValid) {
        setResetStep('reset');
      } else {
        setResetError('Invalid or expired token. Please request a new one.');
      }
    } catch (error) {
      setResetError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResetError(null);
    
    try {
      const result = await UserAPI.resetPassword(resetEmail, resetToken, resetPassword);
      if (result.success) {
        setResetSuccess(true);
        setResetStep('success');
      } else {
        setResetError(result.errors?.password || result.errors?.general || 'Failed to reset password');
      }
    } catch (error) {
      setResetError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        if (activeTab === 'login') {
          const success = await login(formData.email, formData.password, rememberMe);
          setIsSubmitting(false);
          
          if (success) {
            setLoginSuccess(true);
            
            // Redirect to admin dashboard after successful login
            setTimeout(() => {
              if (isModal) {
                onClose();
              }
              navigate('/admin/dashboard');
            }, 1500);
          }
        } else {
          // Signup
          const userData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            password: formData.password,
            role: 'customer'
          };
          
          const result = await signup(userData);
          setIsSubmitting(false);
          
          if (result.success) {
            setSignupSuccess(true);
            
            // Redirect to admin dashboard after successful signup
            setTimeout(() => {
              if (isModal) {
                onClose();
              }
              navigate('/admin/dashboard');
            }, 1500);
          }
        }
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          general: error.message || 'An error occurred. Please try again.'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Switch between login and signup tabs
  const switchTab = (tab) => {
    setActiveTab(tab);
    setErrors({});
    setLoginSuccess(false);
    setSignupSuccess(false);
  };

  return (
    <div className={styles.authContainer}>
      {isModal ? (
        <div className={styles.modal}>
          <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <button className={styles.closeBtn} onClick={onClose}>
                <FaTimes />
              </button>
              <div className={styles.authContent}>
                {activeTab !== 'reset' && (
                  <div className={styles.tabs}>
                    <button
                      className={`${styles.tabButton} ${activeTab === 'login' ? styles.activeTab : ''}`}
                      onClick={() => setActiveTab('login')}
                    >
                      Login
                    </button>
                    <button
                      className={`${styles.tabButton} ${activeTab === 'signup' ? styles.activeTab : ''}`}
                      onClick={() => setActiveTab('signup')}
                    >
                      Signup
                    </button>
                  </div>
                )}
              </div>
              
              <div className={styles.formContainer}>
                {activeTab === 'login' ? (
                  <>
                    {loginSuccess ? (
                      <div className={styles.successMessage}>
                        <div className={styles.successIcon}>✓</div>
                        <h3>Sign-in successful!</h3>
                        <p>You are being redirected to your account...</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className={styles.form}>
                        {errors.general && (
                          <div className={styles.generalError}>
                            <h4>There was a problem</h4>
                            {errors.general}
                          </div>
                        )}
                        
                        {activeTab === 'login' && !isModal && (
                          <p className={styles.newToSquare}>New to HOOD Medical? <a onClick={() => switchTab('signup')} className={styles.signupLink}>Sign up</a></p>
                        )}
                        
                        <div className={styles.formGroup}>
                          <label htmlFor="login-email" className={styles.label}>Email or phone number</label>
                          <input
                            id="login-email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? styles.errorInput : ''}
                            autoComplete="email"
                            placeholder="email@gmail.com"
                          />
                          {errors.email && <div className={styles.errorText}>{errors.email}</div>}
                        </div>
                        
                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                          {isSubmitting ? 'Signing in...' : 'Continue'}
                        </button>
                        
                        <div className={styles.orDivider}>
                          <span>or</span>
                        </div>
                        
                        <button 
                          type="button" 
                          className={styles.passkeyButton}
                          onClick={() => alert('Passkey authentication not implemented yet')}
                        >
                          Sign in with a passkey
                        </button>
                      </form>
                    )}
                  </>
                ) : activeTab === 'signup' ? (
                  <>
                    {signupSuccess ? (
                      <div className={styles.successMessage}>
                        <div className={styles.successIcon}><FaCheckCircle /></div>
                        <h3>Account created successfully!</h3>
                        <p>You can now sign in with your new account.</p>
                        <button 
                          className={styles.submitButton}
                          onClick={() => switchTab('login')}
                        >
                          Go to Sign in
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className={styles.form}>
                        {errors.general && (
                          <div className={styles.generalError}>
                            <h4>There was a problem</h4>
                            {errors.general}
                          </div>
                        )}
                        
                        <div className={styles.formGroup}>
                          <label htmlFor="signup-name" className={styles.label}>Full name</label>
                          <input
                            id="signup-name"
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            className={errors.name ? styles.errorInput : ''}
                            placeholder="First and last name"
                          />
                          {errors.name && <div className={styles.errorText}>{errors.name}</div>}
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label htmlFor="signup-email" className={styles.label}>Email</label>
                          <input
                            id="signup-email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? styles.errorInput : ''}
                            placeholder="email@example.com"
                          />
                          {errors.email && <div className={styles.errorText}>{errors.email}</div>}
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label htmlFor="signup-password" className={styles.label}>Create password</label>
                          <div className={styles.passwordInputContainer}>
                            <input
                              id="signup-password"
                              type={passwordVisible ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              className={errors.password ? styles.errorInput : ''}
                              placeholder="Password"
                            />
                            <button 
                              type="button" 
                              className={styles.passwordToggle}
                              onClick={togglePasswordVisibility}
                            >
                              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                          {errors.password && <div className={styles.errorText}>{errors.password}</div>}
                          
                          <div className={styles.passwordStrength}>
                            <div className={styles.strengthLabel}>Password strength:</div>
                            <div className={styles.strengthMeter}>
                              <div 
                                className={`${styles.strengthIndicator} ${styles[`strength${passwordStrength}`]}`}
                                style={{ width: `${passwordStrength * 25}%` }}
                              ></div>
                            </div>
                            <div className={styles.strengthText}>
                              {passwordStrength === 0 && 'Too weak'}
                              {passwordStrength === 1 && 'Weak'}
                              {passwordStrength === 2 && 'Medium'}
                              {passwordStrength === 3 && 'Strong'}
                              {passwordStrength === 4 && 'Very strong'}
                            </div>
                          </div>
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label htmlFor="signup-confirm" className={styles.label}>Confirm password</label>
                          <div className={styles.passwordInputContainer}>
                            <input
                              id="signup-confirm"
                              type={confirmPasswordVisible ? "text" : "password"}
                              name="confirmPassword"
                              value={formData.confirmPassword || ''}
                              onChange={handleChange}
                              className={errors.confirmPassword ? styles.errorInput : ''}
                              placeholder="Re-enter password"
                            />
                            <button 
                              type="button" 
                              className={styles.passwordToggle}
                              onClick={toggleConfirmPasswordVisibility}
                            >
                              {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                          {errors.confirmPassword && <div className={styles.errorText}>{errors.confirmPassword}</div>}
                        </div>
                        
                        <div className={styles.termsCheckbox}>
                          <input
                            type="checkbox"
                            id="terms"
                            name="termsAccepted"
                            checked={formData.termsAccepted || false}
                            onChange={handleChange}
                          />
                          <label htmlFor="terms">
                            I agree to the <a href="#" className={styles.termsLink}>Terms of Service</a> and <a href="#" className={styles.termsLink}>Privacy Policy</a>
                          </label>
                          {errors.termsAccepted && <div className={styles.errorText}>{errors.termsAccepted}</div>}
                        </div>
                        
                        <button type="submit" className={styles.submitButton} disabled={isSubmitting || !formData.termsAccepted}>
                          {isSubmitting ? 'Creating account...' : 'Create account'}
                        </button>
                        
                        <p className={styles.loginLink}>
                          Already have an account? <a onClick={() => switchTab('login')} className={styles.signupLink}>Sign in</a>
                        </p>
                      </form>
                    )}
                  </>
                ) : (
                  <>
                    {resetStep === 'email' && (
                      <div className={styles.resetPasswordForm}>
                        <div className={styles.formTitle}>Reset your password</div>
                        <p className={styles.resetInstructions}>
                          Enter the email address associated with your account and we'll send you a link to reset your password.
                        </p>
                        <div className={styles.formGroup}>
                          <label htmlFor="reset-email" className={styles.label}>Email</label>
                          <input
                            id="reset-email"
                            type="email"
                            name="resetEmail"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className={resetEmailError ? styles.errorInput : ''}
                            placeholder="Enter your email"
                          />
                          {resetEmailError && <div className={styles.errorText}>{resetEmailError}</div>}
                        </div>
                        <button 
                          type="button" 
                          className={styles.submitButton}
                          onClick={handleResetEmailSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Sending...' : 'Send reset link'}
                        </button>
                        <button 
                          type="button" 
                          className={styles.backToLoginBtn}
                          onClick={() => switchTab('login')}
                        >
                          Back to login
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.pageContainer}>
          <div className={styles.authHeader}>
            <h1>HOOD Medical</h1>
          </div>
          <div className={styles.authContent}>
            {activeTab !== 'reset' && (
              <div className={styles.tabs}>
                <button
                  className={`${styles.tabButton} ${activeTab === 'login' ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab('login')}
                >
                  Login
                </button>
                <button
                  className={`${styles.tabButton} ${activeTab === 'signup' ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab('signup')}
                >
                  Signup
                </button>
              </div>
            )}
          </div>
          
          <div className={styles.formContainer}>
            {activeTab === 'login' ? (
              <>
                {loginSuccess ? (
                  <div className={styles.successMessage}>
                    <div className={styles.successIcon}>✓</div>
                    <h3>Sign-in successful!</h3>
                    <p>You are being redirected to your account...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className={styles.form}>
                    {errors.general && (
                      <div className={styles.generalError}>
                        <h4>There was a problem</h4>
                        {errors.general}
                      </div>
                    )}
                    
                    <div className={styles.formTitle}>Sign in</div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="login-email" className={styles.label}>Email</label>
                      <input
                        id="login-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? styles.errorInput : ''}
                        autoComplete="email"
                        placeholder="Enter your email"
                      />
                      {errors.email && <div className={styles.errorText}>{errors.email}</div>}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="login-password" className={styles.label}>Password</label>
                      <div className={styles.passwordInputContainer}>
                        <input
                          id="login-password"
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={errors.password ? styles.errorInput : ''}
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                      {errors.password && <div className={styles.errorText}>{errors.password}</div>}
                      <div className={styles.forgotPassword}>
                        <button type="button" onClick={() => setResetStep('request')} className={styles.forgotPasswordLink}>
                          Forgot password?
                        </button>
                      </div>
                    </div>
                      
                    <div className={styles.formActions}>
                        <div className={styles.rememberMe}>
                          <input
                            type="checkbox"
                            id="remember-me"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                          />
                          <label htmlFor="remember-me">Remember me</label>
                        </div>
                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                          {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              ) : activeTab === 'signup' ? (
                <>
                  {signupSuccess ? (
                    <div className={styles.successMessage}>
                      <div className={styles.successIcon}><FaCheckCircle /></div>
                      <h3>Account created successfully!</h3>
                      <p>You can now sign in with your new account.</p>
                      <button 
                        className={styles.submitButton}
                        onClick={() => switchTab('login')}
                      >
                        Go to Sign in
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                      {errors.general && (
                        <div className={styles.generalError}>
                          <h4>There was a problem</h4>
                          {errors.general}
                        </div>
                      )}
                      
                      <div className={styles.formTitle}>Create account</div>
                      
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel} htmlFor="signup-name">Your name</label>
                        <input
                          id="signup-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={errors.name ? styles.errorInput : ''}
                          autoComplete="name"
                        />
                        {errors.name && <div className={styles.errorText}>{errors.name}</div>}
                      </div>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="signup-email">Email</label>
                      <input
                        id="signup-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? styles.errorInput : ''}
                        autoComplete="email"
                      />
                      {errors.email && <div className={styles.errorText}>{errors.email}</div>}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="signup-phone">Mobile phone number</label>
                      <input
                        id="signup-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={errors.phone ? styles.errorInput : ''}
                        autoComplete="tel"
                        placeholder="+255 format preferred"
                      />
                      {errors.phone && <div className={styles.errorText}>{errors.phone}</div>}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="signup-address">Address (Tanzania)</label>
                      <input
                        id="signup-address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={errors.address ? styles.errorInput : ''}
                        autoComplete="street-address"
                      />
                      {errors.address && <div className={styles.errorText}>{errors.address}</div>}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="signup-password">Password</label>
                      <input
                        id="signup-password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? styles.errorInput : ''}
                        autoComplete="new-password"
                        placeholder="At least 6 characters"
                      />
                        {errors.password && <div className={styles.errorText}>{errors.password}</div>}
                        {formData.password && !errors.password && (
                          <div className={`${styles.passwordStrength} ${styles[passwordStrength.strength]}`}>
                          {passwordStrength.strength === 'strong' && <FaCheckCircle />}
                          {passwordStrength.strength === 'good' && <FaInfoCircle />}
                          {(passwordStrength.strength === 'weak' || passwordStrength.strength === 'medium') && <FaExclamationTriangle />}
                          {passwordStrength.feedback}
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="signup-confirm-password">Re-enter password</label>
                      <input
                        id="signup-confirm-password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? styles.errorInput : ''}
                        autoComplete="new-password"
                      />
                      {errors.confirmPassword && <div className={styles.errorText}>{errors.confirmPassword}</div>}
                    </div>
                    
                    <div className={styles.termsConditions}>
                      <input type="checkbox" id="terms" required />
                      <label htmlFor="terms">
                        By creating an account, you agree to HOOD Medical's <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>
                      </label>
                    </div>
                    
                    <button 
                      type="submit" 
                      className={styles.submitBtn}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating account...' : 'Create your HOOD account'}
                    </button>
                    </form>
                  )}
                </>
              ) : (
                <>
                </>
              )}
            </div>
        </div>
      )}
    </div>
  );
  
  // Go back to login from password reset
  const handleBackToLogin = () => {
    setActiveTab('login');
    setResetStep('request');
    setResetEmail('');
    setResetToken('');
    setResetPassword('');
    setResetError(null);
    setResetSuccess(false);
  };


  
  return (
    <div className={`${styles.authContainer} ${isModal ? styles.modal : ''}`}>
      {isModal && (
        <div className={styles.modalHeader}>
          <h2>{activeTab === 'reset' ? 'Reset Password' : 'Login / Signup'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>
      )}
      
      <div className={styles.authContent}>
        {!isModal && (
          <div className={styles.authHeader}>
            <div className={styles.logo}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="#000"/>
              </svg>
            </div>
            <h1>{activeTab === 'login' ? 'Sign in' : activeTab === 'signup' ? 'Create your account' : 'Reset Password'}</h1>
          </div>
        )}
        
        {activeTab !== 'reset' && (
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'login' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'signup' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('signup')}
            >
              Signup
            </button>
          </div>
        )}
      </div>
      
      <div className={styles.formContainer}>
        {activeTab === 'login' ? (
          <>
            {loginSuccess ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <h3>Sign-in successful!</h3>
                <p>You are being redirected to your account...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                {errors.general && (
                  <div className={styles.generalError}>
                    <h4>There was a problem</h4>
                    {errors.general}
                  </div>
                )}
                
                <div className={styles.formTitle}>Sign in</div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="login-email" className={styles.label}>Email</label>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? styles.errorInput : ''}
                    autoComplete="email"
                    placeholder="Enter your email"
                  />
                  {errors.email && <div className={styles.errorText}>{errors.email}</div>}
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="login-password" className={styles.label}>Password</label>
                  <div className={styles.passwordInputContainer}>
                    <input
                      id="login-password"
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={errors.password ? styles.errorInput : ''}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                    />
                    <button 
                      type="button" 
                      className={styles.passwordToggle}
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && <div className={styles.errorText}>{errors.password}</div>}
                  <div className={styles.forgotPassword}>
                    <button type="button" onClick={() => setResetStep('request')} className={styles.forgotPasswordLink}>
                      Forgot password?
                    </button>
                  </div>
                </div>
                  
                <div className={styles.formActions}>
                    <div className={styles.rememberMe}>
                      <input
                        type="checkbox"
                        id="remember-me"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                      <label htmlFor="remember-me">Remember me</label>
                    </div>
                    <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                      {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : activeTab === 'signup' ? (
            <>
              {signupSuccess ? (
                <div className={styles.successMessage}>
                  <div className={styles.successIcon}><FaCheckCircle /></div>
                  <h3>Account created successfully!</h3>
                  <p>You can now sign in with your new account.</p>
                  <button 
                    className={styles.submitButton}
                    onClick={() => switchTab('login')}
                  >
                    Go to Sign in
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  {errors.general && (
                    <div className={styles.generalError}>
                      <h4>There was a problem</h4>
                      {errors.general}
                    </div>
                  )}
                  
                  <div className={styles.formTitle}>Create account</div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="signup-name">Your name</label>
                    <input
                      id="signup-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? styles.errorInput : ''}
                      autoComplete="name"
                    />
                    {errors.name && <div className={styles.errorText}>{errors.name}</div>}
                  </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="signup-email">Email</label>
                  <input
                    id="signup-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? styles.errorInput : ''}
                    autoComplete="email"
                  />
                  {errors.email && <div className={styles.errorText}>{errors.email}</div>}
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="signup-phone">Mobile phone number</label>
                  <input
                    id="signup-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? styles.errorInput : ''}
                    autoComplete="tel"
                    placeholder="+255 format preferred"
                  />
                  {errors.phone && <div className={styles.errorText}>{errors.phone}</div>}
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="signup-address">Address (Tanzania)</label>
                  <input
                    id="signup-address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={errors.address ? styles.errorInput : ''}
                    autoComplete="street-address"
                  />
                  {errors.address && <div className={styles.errorText}>{errors.address}</div>}
                </div>
                
                <div className={styles.formGroup}>
                  <div className={styles.passwordHeader}>
                    <label className={styles.formLabel} htmlFor="signup-password">Password</label>
                    <button 
                      type="button" 
                      className={styles.showPasswordBtn}
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    id="signup-password"
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? styles.errorInput : ''}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                  />
                    {errors.password && <div className={styles.errorText}>{errors.password}</div>}
                    {formData.password && !errors.password && (
                      <div className={`${styles.passwordStrength} ${styles[passwordStrength.strength]}`}>
                      {passwordStrength.strength === 'strong' && <FaCheckCircle />}
                      {passwordStrength.strength === 'good' && <FaInfoCircle />}
                      {(passwordStrength.strength === 'weak' || passwordStrength.strength === 'medium') && <FaExclamationTriangle />}
                      {passwordStrength.feedback}
                    </div>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="signup-confirm-password">Re-enter password</label>
                  <input
                    id="signup-confirm-password"
                    type={passwordVisible ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? styles.errorInput : ''}
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && <div className={styles.errorText}>{errors.confirmPassword}</div>}
                </div>
                
                <div className={styles.termsConditions}>
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms">
                    By creating an account, you agree to HOOD Medical's <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating account...' : 'Create your HOOD account'}
                </button>
              </form>
            )}
          </>
        ) : (
          <>
          </>
        )}
        
        {activeTab === 'reset' && (
          <div className={styles.resetPasswordContainer}>
            {resetStep === 'request' && (
              <form onSubmit={handleResetRequest} className={styles.form}>
                <div className={styles.formHeader}>
                  <h3>Reset Your Password</h3>
                  <p>Enter your email address and we'll send you a link to reset your password.</p>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="reset-email" className={styles.label}>Email</label>
                  <input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className={resetError ? styles.errorInput : ''}
                    autoComplete="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                {resetError && (
                  <div className={styles.errorBox}>
                    <FaExclamationTriangle className={styles.errorIcon} />
                    <div className={styles.errorText}>{resetError}</div>
                  </div>
                )}
                
                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.secondaryButton}
                    onClick={handleBackToLogin}
                  >
                    Back to Login
                  </button>
                  <button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={isSubmitting || !resetEmail}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
            
            {resetStep === 'verify' && (
              <form onSubmit={handleVerifyToken} className={styles.form}>
                <div className={styles.formHeader}>
                  <h3>Verify Reset Code</h3>
                  <p>Enter the verification code sent to your email.</p>
                  <p className={styles.demoNote}>For demo purposes, the code is: {resetToken}</p>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="reset-token" className={styles.label}>Verification Code</label>
                  <input
                    id="reset-token"
                    type="text"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className={resetError ? styles.errorInput : ''}
                    placeholder="Enter verification code"
                    required
                  />
                </div>
                
                {resetError && (
                  <div className={styles.errorBox}>
                    <FaExclamationTriangle className={styles.errorIcon} />
                    <div className={styles.errorText}>{resetError}</div>
                  </div>
                )}
                
                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.secondaryButton}
                    onClick={() => setResetStep('request')}
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={isSubmitting || !resetToken}
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify Code'}
                  </button>
                </div>
              </form>
            )}
            
            {resetStep === 'reset' && (
              <form onSubmit={handleResetPassword} className={styles.form}>
                <div className={styles.formHeader}>
                  <h3>Create New Password</h3>
                  <p>Please create a new password for your account.</p>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="new-password" className={styles.label}>New Password</label>
                  <input
                    id="new-password"
                    type="password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    className={resetError ? styles.errorInput : ''}
                    placeholder="Create new password"
                    autoComplete="new-password"
                    required
                  />
                </div>
                
                {resetError && (
                  <div className={styles.errorBox}>
                    <FaExclamationTriangle className={styles.errorIcon} />
                    <div className={styles.errorText}>{resetError}</div>
                  </div>
                )}
                
                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.secondaryButton}
                    onClick={() => setResetStep('verify')}
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={isSubmitting || !resetPassword}
                  >
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            )}
            
            {resetStep === 'success' && (
              <div className={styles.successContainer}>
                <div className={styles.successIcon}>
                  <FaCheckCircle />
                </div>
                <h3>Password Reset Successful!</h3>
                <p>Your password has been reset successfully.</p>
                <button 
                  className={styles.submitButton}
                  onClick={handleBackToLogin}
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
