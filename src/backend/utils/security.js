/**
 * Security utilities for the application
 */

import { saveToStorage, getFromStorage } from './storage';

// Storage key for failed login attempts
const FAILED_ATTEMPTS_KEY = 'hood_medical_failed_attempts';

// Maximum number of failed attempts before lockout
const MAX_FAILED_ATTEMPTS = 5;

// Lockout duration in milliseconds (15 minutes)
const LOCKOUT_DURATION = 15 * 60 * 1000;

/**
 * Record a failed login attempt
 * @param {string} email - User email
 * @returns {Object} - Result with lockout status and remaining attempts
 */
export const recordFailedLoginAttempt = (email) => {
  if (!email) return { isLocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS };
  
  const failedAttempts = getFromStorage(FAILED_ATTEMPTS_KEY, {});
  const userAttempts = failedAttempts[email] || { count: 0, timestamp: Date.now() };
  
  // Check if user is locked out
  if (isAccountLocked(email)) {
    const lockoutRemaining = calculateLockoutRemaining(userAttempts.timestamp);
    return { 
      isLocked: true, 
      remainingAttempts: 0,
      lockoutRemaining
    };
  }
  
  // Increment failed attempts
  userAttempts.count += 1;
  userAttempts.timestamp = Date.now();
  
  // Save updated attempts
  failedAttempts[email] = userAttempts;
  saveToStorage(FAILED_ATTEMPTS_KEY, failedAttempts);
  
  // Check if account should be locked
  const isLocked = userAttempts.count >= MAX_FAILED_ATTEMPTS;
  const remainingAttempts = Math.max(0, MAX_FAILED_ATTEMPTS - userAttempts.count);
  
  return {
    isLocked,
    remainingAttempts,
    lockoutRemaining: isLocked ? LOCKOUT_DURATION : 0
  };
};

/**
 * Check if an account is locked due to too many failed attempts
 * @param {string} email - User email
 * @returns {boolean} - True if account is locked
 */
export const isAccountLocked = (email) => {
  if (!email) return false;
  
  const failedAttempts = getFromStorage(FAILED_ATTEMPTS_KEY, {});
  const userAttempts = failedAttempts[email];
  
  if (!userAttempts) return false;
  
  // If user has reached max attempts and lockout period hasn't expired
  if (userAttempts.count >= MAX_FAILED_ATTEMPTS) {
    const lockoutExpiry = userAttempts.timestamp + LOCKOUT_DURATION;
    return Date.now() < lockoutExpiry;
  }
  
  return false;
};

/**
 * Calculate remaining lockout time in milliseconds
 * @param {number} timestamp - Timestamp of last failed attempt
 * @returns {number} - Remaining lockout time in milliseconds
 */
export const calculateLockoutRemaining = (timestamp) => {
  const lockoutExpiry = timestamp + LOCKOUT_DURATION;
  return Math.max(0, lockoutExpiry - Date.now());
};

/**
 * Reset failed login attempts for a user
 * @param {string} email - User email
 */
export const resetFailedAttempts = (email) => {
  if (!email) return;
  
  const failedAttempts = getFromStorage(FAILED_ATTEMPTS_KEY, {});
  
  if (failedAttempts[email]) {
    delete failedAttempts[email];
    saveToStorage(FAILED_ATTEMPTS_KEY, failedAttempts);
  }
};

/**
 * Format lockout time remaining to human-readable format
 * @param {number} milliseconds - Lockout time remaining in milliseconds
 * @returns {string} - Formatted time string (e.g., "12 minutes, 30 seconds")
 */
export const formatLockoutTime = (milliseconds) => {
  if (milliseconds <= 0) return '0 seconds';
  
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  
  let result = '';
  if (minutes > 0) {
    result += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  if (seconds > 0) {
    if (result) result += ', ';
    result += `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  
  return result;
};
