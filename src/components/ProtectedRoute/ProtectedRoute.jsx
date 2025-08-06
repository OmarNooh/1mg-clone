import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Protected Route component to handle authentication and authorization
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} [props.allowedRoles] - List of roles allowed to access this route
 * @param {boolean} [props.requireAuth=true] - Whether authentication is required
 * @returns {React.ReactNode}
 */
const ProtectedRoute = ({ children, allowedRoles = [], requireAuth = true }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading state if auth is still initializing
  if (loading) {
    return <div>Loading...</div>;
  }

  // If authentication is required and user is not logged in
  if (requireAuth && !currentUser) {
    // Redirect to login page, but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check if user has one of them
  if (allowedRoles.length > 0 && (!currentUser || !allowedRoles.includes(currentUser.role))) {
    // Redirect to unauthorized page or home
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authorized, render the protected content
  return children;
};

export default ProtectedRoute;
