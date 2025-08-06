/**
 * User Service
 * Handles all user-related operations
 */

import { saveToStorage, getFromStorage } from '../utils/storage';
import { validateUser, formatTanzaniaPhone } from '../models/User';
import { validatePasswordStrength } from '../utils/validation';
import { recordFailedLoginAttempt, isAccountLocked, resetFailedAttempts, formatLockoutTime } from '../utils/security';

// Storage keys
const USERS_STORAGE_KEY = 'hood_medical_users';
const CURRENT_USER_KEY = 'hood_medical_current_user';

/**
 * Initialize user service with default data if needed
 * @param {Array} initialUsers - Initial users data to use if no data exists
 */
export const initializeUserService = (initialUsers = []) => {
  const existingUsers = getFromStorage(USERS_STORAGE_KEY);
  
  if (!existingUsers) {
    // Format phone numbers to Tanzania format
    const usersWithFormattedPhones = initialUsers.map(user => ({
      ...user,
      phone: formatTanzaniaPhone(user.phone)
    }));
    
    saveToStorage(USERS_STORAGE_KEY, usersWithFormattedPhones);
  }
};

/**
 * Get customers count
 * @returns {number} - Number of customers
 */
export const getCustomersCount = () => {
  const users = getAllUsers();
  // Count only regular customers (non-admin users)
  return users.filter(user => user.role !== 'Admin').length;
};

/**
 * Get current user settings
 * @returns {Object} - Current user settings
 */
export const getCurrentUserSettings = () => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return null;
  }
  
  // Return user settings or default settings if not set
  return currentUser.settings || {
    notifications: {
      email: true,
      sms: true,
      push: false
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true
    },
    preferences: {
      language: 'en',
      currency: 'TZS'
    }
  };
};

/**
 * Update current user settings
 * @param {Object} settings - Updated settings
 * @returns {Object} - Result object
 */
export const updateCurrentUserSettings = (settings) => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return {
      success: false,
      error: 'No user logged in'
    };
  }
  
  const users = getAllUsers();
  const userIndex = users.findIndex(user => user.id === currentUser.id);
  
  if (userIndex === -1) {
    return {
      success: false,
      error: 'User not found'
    };
  }
  
  // Update user settings
  users[userIndex] = {
    ...users[userIndex],
    settings: {
      ...users[userIndex].settings,
      ...settings
    }
  };
  
  // Save updated users to storage
  saveToStorage(USERS_STORAGE_KEY, users);
  
  // Update current user in session
  saveToStorage(CURRENT_USER_KEY, users[userIndex]);
  
  return {
    success: true,
    user: users[userIndex]
  };
};

/**
 * Update notification settings
 * @param {Object} settings - Updated notification settings
 * @returns {Object} - Result object
 */
export const updateNotificationSettings = (settings) => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return {
      success: false,
      error: 'No user logged in'
    };
  }
  
  return updateCurrentUserSettings({
    notifications: {
      ...currentUser.settings?.notifications,
      ...settings
    }
  });
};

/**
 * Change password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Object} - Result object
 */
export const changePassword = (currentPassword, newPassword) => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return {
      success: false,
      error: 'No user logged in'
    };
  }
  
  // In a real app, we would verify the current password
  // For this mock implementation, we'll just update the password
  
  const users = getAllUsers();
  const userIndex = users.findIndex(user => user.id === currentUser.id);
  
  if (userIndex === -1) {
    return {
      success: false,
      error: 'User not found'
    };
  }
  
  // Update user password (in a real app, this would be hashed)
  users[userIndex] = {
    ...users[userIndex],
    password: newPassword
  };
  
  // Save updated users to storage
  saveToStorage(USERS_STORAGE_KEY, users);
  
  // Update current user in session
  saveToStorage(CURRENT_USER_KEY, users[userIndex]);
  
  return {
    success: true
  };
};

/**
 * Update security settings
 * @param {Object} settings - Updated security settings
 * @returns {Object} - Result object
 */
export const updateSecuritySettings = (settings) => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return {
      success: false,
      error: 'No user logged in'
    };
  }
  
  return updateCurrentUserSettings({
    security: {
      ...currentUser.settings?.security,
      ...settings
    }
  });
};

/**
 * Update role permissions
 * @param {Object} permissions - Updated role permissions
 * @returns {Object} - Result object
 */
export const updateRolePermissions = (permissions) => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return {
      success: false,
      error: 'No user logged in'
    };
  }
  
  // Only admins can update role permissions
  if (currentUser.role !== 'Admin') {
    return {
      success: false,
      error: 'Insufficient permissions'
    };
  }
  
  // In a real app, this would update role permissions in a database
  // For this mock implementation, we'll just save to localStorage
  
  const rolePermissions = getFromStorage('hood_role_permissions', {});
  const updatedPermissions = { ...rolePermissions, ...permissions };
  
  saveToStorage('hood_role_permissions', updatedPermissions);
  
  return {
    success: true,
    permissions: updatedPermissions
  };
};

/**
 * Get all users
 * @returns {Array} - Array of users
 */
export const getAllUsers = () => {
  return getFromStorage(USERS_STORAGE_KEY, []);
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Object|null} - User object or null if not found
 */
export const getUserById = (userId) => {
  const users = getAllUsers();
  return users.find(user => user.id === userId) || null;
};

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Object|null} - User object or null if not found
 */
export const getUserByEmail = (email) => {
  const users = getAllUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Object} - Result object with success flag and user or errors
 */
export const createUser = (userData) => {
  // Validate required fields
  const errors = {};
  if (!userData.name) errors.name = 'Name is required';
  if (!userData.email) errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(userData.email)) errors.email = 'Email is invalid';
  if (!userData.password) errors.password = 'Password is required';
  else if (userData.password.length < 6) errors.password = 'Password must be at least 6 characters';
  if (!userData.phone) errors.phone = 'Phone number is required';
  if (!userData.address) errors.address = 'Address is required';
  
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors
    };
  }
  
  // Check if user already exists
  const existingUser = getUserByEmail(userData.email);
  if (existingUser) {
    return {
      success: false,
      errors: { general: 'User with this email already exists' }
    };
  }
  
  // Create new user
  const users = getAllUsers();
  const newUser = {
    id: generateId(),
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    address: userData.address,
    password: userData.password, // In a real app, this would be hashed
    role: userData.role || 'customer',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    loginCount: 1,
    status: 'active',
    wishlist: [],
    settings: {
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      privacy: {
        shareData: false
      }
    }
  };
  
  users.push(newUser);
  saveToStorage(USERS_STORAGE_KEY, users);
  
  // Create session after registration
  const sessionExpiry = 24 * 60 * 60 * 1000; // 24 hours
  const session = {
    user: { ...newUser, password: undefined }, // Don't store password in session
    expiresAt: Date.now() + sessionExpiry,
    rememberMe: false
  };
  
  // Store session
  setCurrentUser(session);
  
  return {
    success: true,
    user: { ...newUser, password: undefined } // Don't return password
  };
};

/**
 * Register a new user
 * @param {Object} userData - User data
 * @returns {Object} - Result object with success flag and user or errors
 */
export const registerUser = (userData) => {
  const validation = validateUser(userData);
  
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors
    };
  }
  
  // Check if email already exists
  const existingUser = getUserByEmail(userData.email);
  if (existingUser) {
    return {
      success: false,
      errors: { email: 'Email already in use' }
    };
  }
  
  const users = getAllUsers();
  
  // Format phone number and create new user
  const newUser = {
    ...userData,
    id: userData.id || Date.now().toString(),
    phone: formatTanzaniaPhone(userData.phone),
    role: userData.role || 'Customer',
    status: 'Active',
    joinDate: new Date().toISOString().split('T')[0],
    orders: 0,
    addresses: userData.addresses || [],
    wishlist: userData.wishlist || []
  };
  
  const updatedUsers = [...users, newUser];
  saveToStorage(USERS_STORAGE_KEY, updatedUsers);
  
  return {
    success: true,
    user: newUser
  };
};

/**
 * Update an existing user
 * @param {string} userId - User ID
 * @param {Object} userData - Updated user data
 * @returns {Object} - Result object with success flag and user or errors
 */
export const updateUser = (userId, userData) => {
  const validation = validateUser(userData);
  
  if (userData.password) {
    const passwordValidation = validatePasswordStrength(userData.password);
    if (!passwordValidation.isValid) {
      validation.isValid = false;
      validation.errors.password = passwordValidation.feedback;
    }
  }
  
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors
    };
  }
  
  const users = getAllUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    return {
      success: false,
      errors: { general: 'User not found' }
    };
  }
  
  // Check if email is being changed and already exists
  if (userData.email !== users[userIndex].email) {
    const existingUser = getUserByEmail(userData.email);
    if (existingUser) {
      return {
        success: false,
        errors: { email: 'Email already in use' }
      };
    }
  }
  
  // Update user with new data
  const updatedUser = {
    ...users[userIndex],
    ...userData,
    phone: formatTanzaniaPhone(userData.phone)
  };
  
  const updatedUsers = [
    ...users.slice(0, userIndex),
    updatedUser,
    ...users.slice(userIndex + 1)
  ];
  
  saveToStorage(USERS_STORAGE_KEY, updatedUsers);
  
  // Update current user if this is the logged-in user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    setCurrentUser(updatedUser);
  }
  
  return {
    success: true,
    user: updatedUser
  };
};

/**
 * Delete a user
 * @param {string} userId - User ID
 * @returns {Object} - Result object with success flag
 */
export const deleteUser = (userId) => {
  const users = getAllUsers();
  const updatedUsers = users.filter(user => user.id !== userId);
  
  if (updatedUsers.length === users.length) {
    return {
      success: false,
      errors: { general: 'User not found' }
    };
  }
  
  saveToStorage(USERS_STORAGE_KEY, updatedUsers);
  
  // Logout if the deleted user is the current user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    logout();
  }
  
  return {
    success: true
  };
};

/**
 * Login a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} rememberMe - Whether to remember the user session
 * @returns {Object} - Result object with success flag and user or errors
 */
export const login = (email, password, rememberMe = false) => {
  // Input validation
  if (!email || !password) {
    return {
      success: false,
      errors: {
        general: 'Email and password are required'
      }
    };
  }
  
  // Check if account is locked
  if (isAccountLocked(email)) {
    const lockoutStatus = recordFailedLoginAttempt(email);
    const lockoutTimeFormatted = formatLockoutTime(lockoutStatus.lockoutRemaining);
    
    return {
      success: false,
      errors: {
        general: `Account is temporarily locked due to too many failed attempts. Please try again in ${lockoutTimeFormatted}.`
      },
      isLocked: true,
      lockoutRemaining: lockoutStatus.lockoutRemaining
    };
  }
  
  // Get user by email
  const user = getUserByEmail(email);
  
  // Check if user exists and password matches
  if (!user || user.password !== password) {
    // Record failed attempt and check if account should be locked
    const failedAttemptStatus = recordFailedLoginAttempt(email);
    
    let errorMessage = 'Invalid email or password';
    
    // If account is now locked or close to being locked, provide more specific message
    if (failedAttemptStatus.isLocked) {
      const lockoutTimeFormatted = formatLockoutTime(failedAttemptStatus.lockoutRemaining);
      errorMessage = `Account is temporarily locked due to too many failed attempts. Please try again in ${lockoutTimeFormatted}.`;
    } else if (failedAttemptStatus.remainingAttempts <= 2) {
      errorMessage = `Invalid email or password. ${failedAttemptStatus.remainingAttempts} attempts remaining before account is temporarily locked.`;
    }
    
    return {
      success: false,
      errors: {
        general: errorMessage
      },
      isLocked: failedAttemptStatus.isLocked,
      remainingAttempts: failedAttemptStatus.remainingAttempts
    };
  }
  
  // Login successful, reset failed attempts
  resetFailedAttempts(email);
  
  // Create session with expiry
  const sessionExpiry = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const session = {
    user: { ...user, password: undefined }, // Don't store password in session
    expiresAt: Date.now() + sessionExpiry,
    rememberMe
  };
  
  // Store session
  setCurrentUser(session);
  
  // Track login activity
  trackLoginActivity(user.id);
  
  return {
    success: true,
    user: { ...user, password: undefined } // Don't return password
  };
};

/**
 * Track user login activity
 * @param {string} userId - User ID
 */
const trackLoginActivity = (userId) => {
  const users = getAllUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex !== -1) {
    // Update last login time and increment login count
    users[userIndex] = {
      ...users[userIndex],
      lastLogin: new Date().toISOString(),
      loginCount: (users[userIndex].loginCount || 0) + 1
    };
    
    saveToStorage(USERS_STORAGE_KEY, users);
  }
};

/**
 * Logout the current user
 * @returns {Object} - Result object with success flag
 */
export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  
  return {
    success: true
  };
};

/**
 * Check if user session is valid
 * @returns {boolean} - True if session is valid
 */
export const isSessionValid = () => {
  return getCurrentUser() !== null;
};

/**
 * Refresh user session
 * @returns {Object} - Result object with success flag and user
 */
export const refreshSession = () => {
  const session = getFromStorage(CURRENT_USER_KEY, null);
  
  if (!session || !session.user) {
    return {
      success: false,
      errors: { general: 'No active session' }
    };
  }
  
  // Update session expiry
  const sessionExpiry = session.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const updatedSession = {
    ...session,
    expiresAt: Date.now() + sessionExpiry
  };
  
  setCurrentUser(updatedSession);
  
  return {
    success: true,
    user: updatedSession.user
  };
};

/**
 * Get the current logged-in user
 * @returns {Object|null} - Current user or null if not logged in
 */
export const getCurrentUser = () => {
  const session = getFromStorage(CURRENT_USER_KEY, null);
  
  // If no session exists
  if (!session) {
    return null;
  }
  
  // Check if session has expired
  if (session.expiresAt && session.expiresAt < Date.now()) {
    // Session expired, clear it
    logout();
    return null;
  }
  
  return session.user;
};

/**
 * Set the current user session
 * @param {Object} session - Session object containing user and expiry
 */
export const setCurrentUser = (session) => {
  saveToStorage(CURRENT_USER_KEY, session);
};

/**
 * Add address to user
 * @param {string} userId - User ID
 * @param {Object} address - Address object
 * @returns {Object} - Result object with success flag and user or errors
 */
export const addUserAddress = (userId, address) => {
  const user = getUserById(userId);
  
  if (!user) {
    return {
      success: false,
      errors: { general: 'User not found' }
    };
  }
  
  const updatedAddresses = [...(user.addresses || []), {
    id: Date.now().toString(),
    ...address
  }];
  
  return updateUser(userId, {
    ...user,
    addresses: updatedAddresses
  });
};

/**
 * Add product to user's wishlist
 * @param {string} userId - User ID
 * @param {Object} product - Product to add to wishlist
 * @returns {Object} - Result object with success flag and user or errors
 */
export const addToWishlist = (userId, product) => {
  const user = getUserById(userId);
  
  if (!user) {
    return {
      success: false,
      errors: { general: 'User not found' }
    };
  }
  
  // Check if product is already in wishlist
  const existingWishlist = user.wishlist || [];
  if (existingWishlist.some(item => item.id === product.id)) {
    return {
      success: true,
      user
    };
  }
  
  const updatedWishlist = [...existingWishlist, product];
  
  return updateUser(userId, {
    ...user,
    wishlist: updatedWishlist
  });
};

/**
 * Remove product from user's wishlist
 * @param {string} userId - User ID
 * @param {string} productId - Product ID to remove
 * @returns {Object} - Result object with success flag and user or errors
 */
export const removeFromWishlist = (userId, productId) => {
  const user = getUserById(userId);
  
  if (!user) {
    return {
      success: false,
      errors: { general: 'User not found' }
    };
  }
  
  const existingWishlist = user.wishlist || [];
  const updatedWishlist = existingWishlist.filter(item => item.id !== productId);
  
  return updateUser(userId, {
    ...user,
    wishlist: updatedWishlist
  });
};
