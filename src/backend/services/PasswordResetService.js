/**
 * Password Reset Service
 * Handles password reset functionality
 */

import { saveToStorage, getFromStorage } from '../utils/storage';
import { getUserByEmail, updateUser } from './UserService';
import { resetFailedAttempts } from '../utils/security';
import { validatePasswordStrength } from '../utils/validation';

// Storage key for reset tokens
const RESET_TOKENS_KEY = 'hood_medical_reset_tokens';

// Token expiry time (15 minutes)
const TOKEN_EXPIRY = 15 * 60 * 1000;

/**
 * Generate a random token
 * @returns {string} - Random token
 */
const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Request a password reset
 * @param {string} email - User email
 * @returns {Object} - Result object with success flag
 */
export const requestPasswordReset = (email) => {
  // Check if user exists
  const user = getUserByEmail(email);
  
  if (!user) {
    // For security reasons, don't reveal that the user doesn't exist
    return {
      success: true,
      message: 'If your email is registered, you will receive a password reset link'
    };
  }
  
  // Generate token
  const token = generateToken();
  const expiresAt = Date.now() + TOKEN_EXPIRY;
  
  // Save token
  const resetTokens = getFromStorage(RESET_TOKENS_KEY, {});
  resetTokens[email] = {
    token,
    expiresAt
  };
  saveToStorage(RESET_TOKENS_KEY, resetTokens);
  
  // In a real app, we would send an email with the reset link
  // For this demo, we'll just return the token
  return {
    success: true,
    message: 'If your email is registered, you will receive a password reset link',
    // Only for demo purposes - in a real app, this would be sent via email
    token,
    expiresAt
  };
};

/**
 * Validate reset token
 * @param {string} email - User email
 * @param {string} token - Reset token
 * @returns {boolean} - True if token is valid
 */
export const validateResetToken = (email, token) => {
  const resetTokens = getFromStorage(RESET_TOKENS_KEY, {});
  const resetData = resetTokens[email];
  
  if (!resetData) return false;
  
  // Check if token matches and hasn't expired
  return resetData.token === token && resetData.expiresAt > Date.now();
};

/**
 * Reset password
 * @param {string} email - User email
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Object} - Result object with success flag
 */
export const resetPassword = (email, token, newPassword) => {
  // Validate token
  if (!validateResetToken(email, token)) {
    return {
      success: false,
      errors: {
        general: 'Invalid or expired reset token'
      }
    };
  }
  
  // Validate password strength
  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.isValid) {
    return {
      success: false,
      errors: {
        password: passwordValidation.feedback
      }
    };
  }
  
  // Get user
  const user = getUserByEmail(email);
  if (!user) {
    return {
      success: false,
      errors: {
        general: 'User not found'
      }
    };
  }
  
  // Update password
  const updateResult = updateUser(user.id, {
    ...user,
    password: newPassword
  });
  
  if (!updateResult.success) {
    return updateResult;
  }
  
  // Clear reset token
  const resetTokens = getFromStorage(RESET_TOKENS_KEY, {});
  delete resetTokens[email];
  saveToStorage(RESET_TOKENS_KEY, resetTokens);
  
  // Reset failed login attempts
  resetFailedAttempts(email);
  
  return {
    success: true,
    message: 'Password has been reset successfully'
  };
};
