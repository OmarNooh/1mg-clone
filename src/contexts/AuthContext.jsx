import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserAPI } from '../backend/api/index';

// Create the authentication context
const AuthContext = createContext();

// User roles
export const USER_ROLES = {
  GUEST: 'guest',
  USER: 'user',
  ADMIN: 'admin'
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionValid, setSessionValid] = useState(false);
  const [accountLocked, setAccountLocked] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(null);

  // Check if user is already logged in and refresh session if needed
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await UserAPI.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setSessionValid(true);
          
          // Refresh session to extend expiry
          await UserAPI.refreshSession();
        }
      } catch (err) {
        console.error('Failed to get current user:', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
    
    // Set up interval to check session validity periodically
    const sessionCheckInterval = setInterval(() => {
      const user = UserAPI.getCurrentUser();
      setSessionValid(user !== null);
      if (!user && currentUser) {
        // Session expired, update state
        setCurrentUser(null);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(sessionCheckInterval);
  }, [currentUser]);

  // Login function
  const login = async (email, password, rememberMe = false) => {
    setError(null);
    setAccountLocked(false);
    setRemainingAttempts(null);
    setLockoutRemaining(null);
    
    try {
      const result = await UserAPI.login(email, password, rememberMe);
      
      if (result.success) {
        setCurrentUser(result.user);
        setSessionValid(true);
        return true;
      } else {
        // Handle account lockout
        if (result.isLocked) {
          setAccountLocked(true);
          setLockoutRemaining(result.lockoutRemaining);
        }
        
        // Handle remaining attempts
        if (result.remainingAttempts !== undefined) {
          setRemainingAttempts(result.remainingAttempts);
        }
        
        setError(result.errors?.general || 'Invalid email or password');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    }
  };

  // Signup function
  const signup = async (userData) => {
    setError(null);
    
    try {
      // Ensure role is set
      if (!userData.role) {
        userData.role = USER_ROLES.USER;
      }
      
      const result = await UserAPI.signup(userData);
      
      if (result.success) {
        setCurrentUser(result.user);
        setSessionValid(true);
        return result;
      } else {
        setError(result.errors?.general || 'Registration failed');
        return result;
      }
    } catch (err) {
      const errorResult = {
        success: false,
        errors: { general: err.message || 'Registration failed' }
      };
      setError(errorResult.errors.general);
      return errorResult;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await UserAPI.logout();
      setCurrentUser(null);
      setSessionValid(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return currentUser && currentUser.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole(USER_ROLES.ADMIN);
  };

  const value = {
    currentUser,
    loading,
    error,
    sessionValid,
    login,
    signup,
    logout,
    hasRole,
    isAdmin,
    USER_ROLES,
    accountLocked,
    remainingAttempts,
    lockoutRemaining
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
