import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
const ItemDetail = lazy(() => import('../pages/Admin/components/ItemDetail'));
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
        
        {/* Admin Routes - Comprehensive nested structure */}
        <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
        <Route path="/admin/dashboard" element={<Navigate to="/admin/overview" replace />} />
        
        {/* Admin Overview */}
        <Route path="/admin/overview" element={<AdminDashboard />} />
        
        {/* Items & Services Routes */}
        <Route path="/admin/items-services" element={<AdminDashboard />} />
        <Route path="/admin/items-services/items" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/items/library" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/items/library/v1/:itemId/" element={<ItemDetail />} />
        <Route path="/admin/items-services/items/service-library" element={<AdminDashboard />} />
        <Route path="/admin/items-services/items/image-library" element={<AdminDashboard />} />
        <Route path="/admin/items-services/items/resources" element={<AdminDashboard />} />
        <Route path="/admin/items-services/items/modifiers" element={<AdminDashboard />} />
        <Route path="/admin/items-services/items/categories" element={<AdminDashboard />} />
        <Route path="/admin/items-services/items/discounts" element={<AdminDashboard />} />
        <Route path="/admin/items-services/items/options" element={<AdminDashboard />} />
        <Route path="/admin/items-services/items/units" element={<AdminDashboard />} />
        <Route path="/admin/items-services/items/custom-attributes" element={<AdminDashboard />} />
        
        {/* Inventory Management Routes */}
        <Route path="/admin/items-services/inventory" element={<AdminDashboard />} />
        <Route path="/admin/items-services/inventory/history" element={<AdminDashboard />} />
        <Route path="/admin/items-services/inventory/purchase-orders" element={<AdminDashboard />} />
        <Route path="/admin/items-services/inventory/vendors" element={<AdminDashboard />} />
        <Route path="/admin/items-services/inventory/pending-restocks" element={<AdminDashboard />} />
        
        {/* Gift Cards Routes */}
        <Route path="/admin/items-services/gift-cards" element={<AdminDashboard />} />
        <Route path="/admin/items-services/gift-cards/gift-overview" element={<AdminDashboard />} />
        <Route path="/admin/items-services/gift-cards/egift-cards" element={<AdminDashboard />} />
        <Route path="/admin/items-services/gift-cards/egift-cards/configure" element={<AdminDashboard />} />
        <Route path="/admin/items-services/gift-cards/egift-cards/discounts" element={<AdminDashboard />} />
        <Route path="/admin/items-services/gift-cards/plastic-cards" element={<AdminDashboard />} />
        <Route path="/admin/items-services/gift-cards/promotional-tools" element={<AdminDashboard />} />
        <Route path="/admin/items-services/gift-cards/gift-settings" element={<AdminDashboard />} />
        
        {/* Item Settings Routes */}
        <Route path="/admin/items-services/item-settings" element={<AdminDashboard />} />
        <Route path="/admin/items-services/item-settings/item-defaults" element={<AdminDashboard />} />
        <Route path="/admin/items-services/item-settings/comp-void" element={<AdminDashboard />} />
        <Route path="/admin/items-services/item-settings/inventory-settings" element={<AdminDashboard />} />
        <Route path="/admin/items-services/item-settings/payment-links" element={<AdminDashboard />} />
        
        {/* Payments & Invoices Routes */}
        <Route path="/admin/payments" element={<AdminDashboard />} />
        <Route path="/admin/payments/transactions" element={<AdminDashboard />} />
        <Route path="/admin/payments/orders" element={<AdminDashboard />} />
        <Route path="/admin/payments/orders/all-orders" element={<AdminDashboard />} />
        <Route path="/admin/payments/orders/shipments" element={<AdminDashboard />} />
        <Route path="/admin/payments/orders/order-partners" element={<AdminDashboard />} />
        <Route path="/admin/payments/orders/fulfillment-settings" element={<AdminDashboard />} />
        <Route path="/admin/payments/invoices" element={<AdminDashboard />} />
        <Route path="/admin/payments/invoices/invoice-overview" element={<AdminDashboard />} />
        <Route path="/admin/payments/invoices/projects" element={<AdminDashboard />} />
        <Route path="/admin/payments/invoices/invoice-list" element={<AdminDashboard />} />
        <Route path="/admin/payments/invoices/recurring-series" element={<AdminDashboard />} />
        <Route path="/admin/payments/invoices/estimates" element={<AdminDashboard />} />
        <Route path="/admin/payments/invoices/invoice-reports" element={<AdminDashboard />} />
        <Route path="/admin/payments/invoices/invoice-apps" element={<AdminDashboard />} />
        <Route path="/admin/payments/invoices/invoice-settings" element={<AdminDashboard />} />
        <Route path="/admin/payments/invoices/invoice-settings/invoice-templates" element={<AdminDashboard />} />
        <Route path="/admin/payments/invoices/invoice-settings/estimate-defaults" element={<AdminDashboard />} />
        <Route path="/admin/payments/invoices/invoice-settings/customization" element={<AdminDashboard />} />
        <Route path="/admin/payments/virtual-terminal" element={<AdminDashboard />} />
        <Route path="/admin/payments/virtual-terminal/terminal-overview" element={<AdminDashboard />} />
        <Route path="/admin/payments/virtual-terminal/terminal-settings" element={<AdminDashboard />} />
        <Route path="/admin/payments/payment-links" element={<AdminDashboard />} />
        <Route path="/admin/payments/payment-links/links-list" element={<AdminDashboard />} />
        <Route path="/admin/payments/payment-links/links-settings" element={<AdminDashboard />} />
        <Route path="/admin/payments/payment-links/links-settings/general" element={<AdminDashboard />} />
        <Route path="/admin/payments/payment-links/links-settings/branding" element={<AdminDashboard />} />
        <Route path="/admin/payments/subscriptions" element={<AdminDashboard />} />
        <Route path="/admin/payments/disputes" element={<AdminDashboard />} />
        <Route path="/admin/payments/risk-manager" element={<AdminDashboard />} />
        <Route path="/admin/payments/risk-manager/analytics" element={<AdminDashboard />} />
        <Route path="/admin/payments/risk-manager/analytics/key-metrics" element={<AdminDashboard />} />
        <Route path="/admin/payments/risk-manager/analytics/active-rules" element={<AdminDashboard />} />
        <Route path="/admin/payments/risk-manager/alerts" element={<AdminDashboard />} />
        <Route path="/admin/payments/risk-manager/rules" element={<AdminDashboard />} />
        <Route path="/admin/payments/risk-manager/block-list" element={<AdminDashboard />} />
        <Route path="/admin/payments/risk-manager/allow-list" element={<AdminDashboard />} />
        <Route path="/admin/payments/risk-manager/blocked-payments" element={<AdminDashboard />} />
        <Route path="/admin/payments/risk-manager/allowed-payments" element={<AdminDashboard />} />
        <Route path="/admin/payments/risk-manager/risk-settings" element={<AdminDashboard />} />
        
        {/* Customers Routes */}
        <Route path="/admin/customers" element={<AdminDashboard />} />
        <Route path="/admin/customers/customer-directory" element={<AdminDashboard />} />
        <Route path="/admin/customers/customer-directory/directory" element={<AdminDashboard />} />
        <Route path="/admin/customers/customer-directory/feedback" element={<AdminDashboard />} />
        <Route path="/admin/customers/customer-directory/insights" element={<AdminDashboard />} />
        <Route path="/admin/customers/customer-directory/insights/visits" element={<AdminDashboard />} />
        <Route path="/admin/customers/customer-directory/insights/satisfaction-ratings" element={<AdminDashboard />} />
        <Route path="/admin/customers/customer-directory/customer-settings" element={<AdminDashboard />} />
        <Route path="/admin/customers/customer-directory/customer-settings/configure-profiles" element={<AdminDashboard />} />
        <Route path="/admin/customers/customer-directory/customer-settings/instant-profiles" element={<AdminDashboard />} />
        <Route path="/admin/customers/customer-directory/customer-settings/feedback-settings" element={<AdminDashboard />} />
        <Route path="/admin/customers/customer-directory/customer-settings/card-on-file" element={<AdminDashboard />} />
        <Route path="/admin/customers/contracts" element={<AdminDashboard />} />
        <Route path="/admin/customers/contracts/contracts-list" element={<AdminDashboard />} />
        <Route path="/admin/customers/contracts/templates" element={<AdminDashboard />} />
        <Route path="/admin/customers/contracts/clauses" element={<AdminDashboard />} />
        <Route path="/admin/customers/marketing" element={<AdminDashboard />} />
        <Route path="/admin/customers/marketing/campaigns" element={<AdminDashboard />} />
        <Route path="/admin/customers/marketing/automations" element={<AdminDashboard />} />
        <Route path="/admin/customers/marketing/google-reviews" element={<AdminDashboard />} />
        <Route path="/admin/customers/marketing/coupons" element={<AdminDashboard />} />
        <Route path="/admin/customers/marketing/marketing-settings" element={<AdminDashboard />} />
        <Route path="/admin/customers/loyalty" element={<AdminDashboard />} />
        <Route path="/admin/customers/loyalty/loyalty-overview" element={<AdminDashboard />} />
        <Route path="/admin/customers/loyalty/reports" element={<AdminDashboard />} />
        <Route path="/admin/customers/loyalty/reports/loyalty-visits" element={<AdminDashboard />} />
        <Route path="/admin/customers/loyalty/reports/loyalty-sales" element={<AdminDashboard />} />
        <Route path="/admin/customers/loyalty/reports/top-customers" element={<AdminDashboard />} />
        <Route path="/admin/customers/loyalty/activity" element={<AdminDashboard />} />
        <Route path="/admin/customers/loyalty/activity/all-activity" element={<AdminDashboard />} />
        <Route path="/admin/customers/loyalty/activity/suspicious-activity" element={<AdminDashboard />} />
        <Route path="/admin/customers/loyalty/loyalty-marketing" element={<AdminDashboard />} />
        <Route path="/admin/customers/loyalty/loyalty-marketing/email" element={<AdminDashboard />} />
        <Route path="/admin/customers/loyalty/loyalty-marketing/other" element={<AdminDashboard />} />
        <Route path="/admin/customers/loyalty/promotions" element={<AdminDashboard />} />
        <Route path="/admin/customers/loyalty/loyalty-settings" element={<AdminDashboard />} />
        
        {/* Staff Routes */}
        <Route path="/admin/staff" element={<AdminDashboard />} />
        <Route path="/admin/staff/staff-directory" element={<AdminDashboard />} />
        <Route path="/admin/staff/permissions" element={<AdminDashboard />} />
        <Route path="/admin/staff/permissions/roles" element={<AdminDashboard />} />
        <Route path="/admin/staff/permissions/permissions-list" element={<AdminDashboard />} />
        <Route path="/admin/staff/scheduling" element={<AdminDashboard />} />
        <Route path="/admin/staff/scheduling/schedule" element={<AdminDashboard />} />
        <Route path="/admin/staff/scheduling/availability" element={<AdminDashboard />} />
        <Route path="/admin/staff/scheduling/time-off" element={<AdminDashboard />} />
        <Route path="/admin/staff/time-tracking" element={<AdminDashboard />} />
        <Route path="/admin/staff/time-tracking/workday" element={<AdminDashboard />} />
        <Route path="/admin/staff/time-tracking/timecards" element={<AdminDashboard />} />
        <Route path="/admin/staff/announcements" element={<AdminDashboard />} />
        <Route path="/admin/staff/staff-settings" element={<AdminDashboard />} />
        <Route path="/admin/staff/staff-settings/schedule-settings" element={<AdminDashboard />} />
        <Route path="/admin/staff/staff-settings/clock-in-out" element={<AdminDashboard />} />
        <Route path="/admin/staff/staff-settings/breaks" element={<AdminDashboard />} />
        <Route path="/admin/staff/staff-settings/overtime" element={<AdminDashboard />} />
        <Route path="/admin/staff/staff-settings/messaging" element={<AdminDashboard />} />
        <Route path="/admin/staff/staff-settings/tips" element={<AdminDashboard />} />
        <Route path="/admin/staff/staff-settings/commissions" element={<AdminDashboard />} />
        <Route path="/admin/staff/staff-settings/alerts" element={<AdminDashboard />} />
        
        {/* Settings Routes */}
        <Route path="/admin/settings" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/sign-in-security" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/my-business" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/my-business/about" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/my-business/security" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/my-business/locations" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/verified-information" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/pricing-subscriptions" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/payments-settings" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/payments-settings/receipts" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/payments-settings/sales-taxes-settings" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/payments-settings/service-charges-settings" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/payments-settings/payment-methods-settings" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/money" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/money/bank-accounts" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/money/transfers" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/notifications" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/notifications/account-notifications" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/notifications/outages" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/notifications/invoices-notifications" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/notifications/disputes-notifications" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/notifications/tax-invoices" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/fulfillment-methods" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/fulfillment-methods/pickup-delivery" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/fulfillment-methods/shipment" element={<AdminDashboard />} />
        <Route path="/admin/settings/account-settings/fulfillment-methods/non-physical" element={<AdminDashboard />} />
        
        {/* Analytics Routes */}
        <Route path="/admin/analytics" element={<AdminDashboard />} />
        <Route path="/admin/analytics/overview" element={<AdminDashboard />} />
        <Route path="/admin/analytics/sales" element={<AdminDashboard />} />
        <Route path="/admin/analytics/items" element={<AdminDashboard />} />
        <Route path="/admin/analytics/customers" element={<AdminDashboard />} />
        <Route path="/admin/analytics/staff" element={<AdminDashboard />} />
        <Route path="/admin/analytics/taxes" element={<AdminDashboard />} />
        <Route path="/admin/analytics/tips" element={<AdminDashboard />} />
        <Route path="/admin/analytics/discounts" element={<AdminDashboard />} />
        <Route path="/admin/analytics/modifiers" element={<AdminDashboard />} />
        <Route path="/admin/analytics/refunds" element={<AdminDashboard />} />
        <Route path="/admin/analytics/gift-cards" element={<AdminDashboard />} />
        <Route path="/admin/analytics/loyalty" element={<AdminDashboard />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
