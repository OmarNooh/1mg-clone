import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import { USER_ROLES } from '../contexts/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

// Lazy load pages for better performance
const Home = lazy(() => import('../pages/Home/Home'));
const Medicines = lazy(() => import('../pages/Medicines/Medicines'));
const ProductDetails = lazy(() => import('../pages/ProductDetails/ProductDetails'));
const SearchResults = lazy(() => import('../pages/SearchResults/SearchResults'));
const LabTests = lazy(() => import('../pages/LabTests/LabTests'));
const Doctors = lazy(() => import('../pages/Doctors/Doctors'));
const ProductListing = lazy(() => import('../pages/ProductListing/ProductListing'));
const Cart = lazy(() => import('../pages/Cart/Cart'));
const Login = lazy(() => import('../pages/Auth/Login'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));
const Unauthorized = lazy(() => import('../pages/Unauthorized/Unauthorized'));
const Wishlist = lazy(() => import('../pages/Wishlist/Wishlist'));
const Compare = lazy(() => import('../pages/Compare/Compare'));
const Checkout = lazy(() => import('../pages/Checkout/Checkout'));
const OrderHistory = lazy(() => import('../pages/OrderHistory/OrderHistory'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <Routes>
        <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/lab-tests" element={<LabTests />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/category/:categoryId" element={<ProductListing />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/account/orders" element={<OrderHistory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Admin Routes - No restrictions */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
