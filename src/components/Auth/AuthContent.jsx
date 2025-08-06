import React from 'react';
import { FaEye, FaEyeSlash, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import styles from './Auth.module.css';

const AuthContent = ({
  activeTab,
  switchTab,
  formData,
  handleChange,
  handleSubmit,
  errors,
  isSubmitting,
  loginSuccess,
  signupSuccess,
  rememberMe,
  setRememberMe,
  passwordVisible,
  setPasswordVisible
}) => {
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
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
              <div className={styles.formHeader}>
                <h3>Sign in to your account</h3>
                <p>Access your HOOD Medical account</p>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? styles.errorInput : ''}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
                {errors.email && <div className={styles.errorText}>{errors.email}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <div className={styles.passwordInputContainer}>
                  <input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? styles.errorInput : ''}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
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
              </div>
              
              <div className={styles.formOptions}>
                <div className={styles.rememberMe}>
                  <input
                    id="rememberMe"
                    type="checkbox"
                    name="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
                <button 
                  type="button" 
                  className={styles.forgotPassword}
                  onClick={() => switchTab('reset')}
                >
                  Forgot password?
                </button>
              </div>
              
              {errors.general && (
                <div className={styles.errorBox}>
                  <FaExclamationTriangle className={styles.errorIcon} />
                  <div className={styles.errorText}>{errors.general}</div>
                </div>
              )}
              
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
              
              <div className={styles.switchForm}>
                <p>Don't have an account? <button type="button" onClick={() => switchTab('signup')}>Sign up</button></p>
              </div>
            </form>
          )}
        </>
      ) : activeTab === 'signup' ? (
        <>
          {signupSuccess ? (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}><FaCheckCircle /></div>
              <h3>Registration successful!</h3>
              <p>Your account has been created successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formHeader}>
                <h3>Create an account</h3>
                <p>Join HOOD Medical for better healthcare</p>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? styles.errorInput : ''}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
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
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
                {errors.email && <div className={styles.errorText}>{errors.email}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? styles.errorInput : ''}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  required
                />
                {errors.phone && <div className={styles.errorText}>{errors.phone}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="address" className={styles.label}>Address</label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? styles.errorInput : ''}
                  placeholder="Enter your address"
                  autoComplete="street-address"
                  required
                />
                {errors.address && <div className={styles.errorText}>{errors.address}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="signup-password" className={styles.label}>Password</label>
                <div className={styles.passwordInputContainer}>
                  <input
                    id="signup-password"
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? styles.errorInput : ''}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
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
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? styles.errorInput : ''}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                />
                {errors.confirmPassword && <div className={styles.errorText}>{errors.confirmPassword}</div>}
              </div>
              
              {errors.general && (
                <div className={styles.errorBox}>
                  <FaExclamationTriangle className={styles.errorIcon} />
                  <div className={styles.errorText}>{errors.general}</div>
                </div>
              )}
              
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
              
              <div className={styles.switchForm}>
                <p>Already have an account? <button type="button" onClick={() => switchTab('login')}>Sign in</button></p>
              </div>
            </form>
          )}
        </>
      ) : (
        <div className={styles.resetPasswordContainer}>
          <div className={styles.formHeader}>
            <h3>Reset Password</h3>
            <p>Enter your email to receive a password reset link</p>
          </div>
          
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="reset-email" className={styles.label}>Email</label>
              <input
                id="reset-email"
                type="email"
                name="resetEmail"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.secondaryButton}
                onClick={() => switchTab('login')}
              >
                Back to Login
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
              >
                Send Reset Link
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AuthContent;
