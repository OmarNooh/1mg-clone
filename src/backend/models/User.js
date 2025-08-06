/**
 * User Model
 * Defines the structure and validation for user data
 */

import { validatePasswordStrength, validateEmail, validateTanzaniaPhone } from '../utils/validation';

/**
 * Validate user data
 * @param {Object} user - The user data to validate
 * @returns {Object} - Object with isValid flag and any validation errors
 */
export const validateUser = (user) => {
  const errors = {};
  
  // Required fields
  if (!user.name || user.name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  if (!user.email || user.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!isValidEmail(user.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!user.phone || user.phone.trim() === '') {
    errors.phone = 'Phone number is required';
  } else if (!isValidTanzaniaPhone(user.phone)) {
    errors.phone = 'Invalid Tanzania phone number format';
  }
  
  // Password validation (for registration/update)
  if (user.password !== undefined) {
    const passwordValidation = validatePasswordStrength(user.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.feedback;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Create a new user object with default values
 * @returns {Object} - A new user object with default values
 */
export const createEmptyUser = () => {
  return {
    id: Date.now().toString(),
    name: '',
    email: '',
    phone: '',
    role: 'Customer',
    status: 'Active',
    joinDate: new Date().toISOString().split('T')[0],
    orders: 0,
    addresses: [],
    wishlist: []
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
export const isValidEmail = (email) => {
  return validateEmail(email).isValid;
};

/**
 * Validate Tanzania phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if phone number is valid
 */
export const isValidTanzaniaPhone = (phone) => {
  return validateTanzaniaPhone(phone).isValid;
};

/**
 * Format phone number to Tanzania standard format
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatTanzaniaPhone = (phone) => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Check if it starts with 0
  if (digits.startsWith('0') && digits.length === 10) {
    // Convert 07XX XXX XXX to +255 7XX XXX XXX
    const formatted = '+255 ' + digits.substring(1, 4) + ' ' + 
                     digits.substring(4, 7) + ' ' + 
                     digits.substring(7, 10);
    return formatted;
  }
  
  // Check if it's already in international format
  if (digits.startsWith('255') && digits.length === 12) {
    const formatted = '+255 ' + digits.substring(3, 6) + ' ' + 
                     digits.substring(6, 9) + ' ' + 
                     digits.substring(9, 12);
    return formatted;
  }
  
  // If it doesn't match expected formats, return as is
  return phone;
};
