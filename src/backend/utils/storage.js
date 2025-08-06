/**
 * Storage utility for handling localStorage operations
 * Provides a consistent API for storing and retrieving data
 */

/**
 * Save data to localStorage
 * @param {string} key - The key to store data under
 * @param {any} data - The data to store (will be JSON stringified)
 * @returns {boolean} - True if operation was successful
 */
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving data to localStorage: ${error.message}`);
    return false;
  }
};

/**
 * Get data from localStorage
 * @param {string} key - The key to retrieve data from
 * @param {any} defaultValue - Default value to return if key doesn't exist
 * @returns {any} - The retrieved data or defaultValue if not found
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting data from localStorage: ${error.message}`);
    return defaultValue;
  }
};

/**
 * Remove data from localStorage
 * @param {string} key - The key to remove
 * @returns {boolean} - True if operation was successful
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data from localStorage: ${error.message}`);
    return false;
  }
};

/**
 * Clear all data from localStorage
 * @returns {boolean} - True if operation was successful
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error(`Error clearing localStorage: ${error.message}`);
    return false;
  }
};

/**
 * Check if a key exists in localStorage
 * @param {string} key - The key to check
 * @returns {boolean} - True if key exists
 */
export const hasStorageItem = (key) => {
  return localStorage.getItem(key) !== null;
};

/**
 * Get all keys from localStorage
 * @returns {string[]} - Array of keys
 */
export const getStorageKeys = () => {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    keys.push(localStorage.key(i));
  }
  return keys;
};
