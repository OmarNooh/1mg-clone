/**
 * Validation utilities for the application
 */

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid flag and feedback
 */
export const validatePasswordStrength = (password) => {
  if (!password) {
    return {
      isValid: false,
      strength: 'none',
      feedback: 'Password is required'
    };
  }

  // Check password length
  if (password.length < 6) {
    return {
      isValid: false,
      strength: 'weak',
      feedback: 'Password must be at least 6 characters long'
    };
  }

  // Initialize score
  let score = 0;

  // Check for lowercase letters
  if (/[a-z]/.test(password)) {
    score += 1;
  }

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) {
    score += 1;
  }

  // Check for numbers
  if (/[0-9]/.test(password)) {
    score += 1;
  }

  // Check for special characters
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  }

  // Determine strength based on score
  let strength = 'weak';
  let feedback = 'Password is too weak';
  let isValid = false;

  if (score === 4) {
    strength = 'strong';
    feedback = 'Strong password';
    isValid = true;
  } else if (score === 3) {
    strength = 'good';
    feedback = 'Good password, but could be stronger';
    isValid = true;
  } else if (score === 2) {
    strength = 'medium';
    feedback = 'Medium strength password. Consider adding numbers, symbols, or mixed case';
    isValid = true;
  }

  return {
    isValid,
    strength,
    feedback
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} - Validation result with isValid flag and message
 */
export const validateEmail = (email) => {
  if (!email) {
    return {
      isValid: false,
      message: 'Email is required'
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  return {
    isValid,
    message: isValid ? 'Valid email' : 'Invalid email format'
  };
};

/**
 * Validate Tanzania phone number format
 * @param {string} phone - Phone number to validate
 * @returns {Object} - Validation result with isValid flag and message
 */
export const validateTanzaniaPhone = (phone) => {
  if (!phone) {
    return {
      isValid: false,
      message: 'Phone number is required'
    };
  }

  // Tanzania phone number formats: +255XXXXXXXXX, 255XXXXXXXXX, 0XXXXXXXXX
  const phoneRegex = /^(\+255|255|0)[67]\d{8}$/;
  const isValid = phoneRegex.test(phone.replace(/\s/g, ''));

  return {
    isValid,
    message: isValid ? 'Valid phone number' : 'Invalid Tanzania phone number format'
  };
};
