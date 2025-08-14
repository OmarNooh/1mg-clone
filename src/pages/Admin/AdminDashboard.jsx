import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaShoppingCart, 
  FaBoxes, 
  FaChartLine, 
  FaClipboardList, 
  FaCog, 
  FaHome,
  FaSearch, 
  FaRegBell, 
  FaRegCommentDots, 
  FaRegQuestionCircle, 
  FaChevronRight,
  FaLayerGroup,
  FaUser,
  FaArrowLeft,
  FaAngleDown,
  FaPlus,
  FaFilter
} from 'react-icons/fa';
import styles from './AdminDashboard.module.css';

// Import admin components
import ProductManagement from './components/ProductManagement';
import OrderManagement from './components/OrderManagement';
import UserManagement from './components/UserManagement';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Overview from './components/Overview';
import ItemLibrary from './components/ItemLibrary';
import ServiceLibrary from './components/ServiceLibrary';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Function to extract active tab from URL path
  const getActiveTabFromPath = (pathname) => {
    const path = pathname.replace('/admin', '').replace(/^\//, '');
    if (!path || path === '') return 'overview';
    return path.replace(/\//g, '-');
  };

  // Function to convert tab ID back to URL path
  const getPathFromTabId = (tabId) => {
    if (tabId === 'overview') return '/admin/overview';
    return `/admin/${tabId.replace(/-/g, '/')}`;
  };

  const [activeTab, setActiveTab] = useState(() => getActiveTabFromPath(location.pathname));
  const [openMenus, setOpenMenus] = useState({});
  const [activeNavPanel, setActiveNavPanel] = useState(null);
  const [navHistory, setNavHistory] = useState([]);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  // Update active tab when URL changes
  useEffect(() => {
    const newActiveTab = getActiveTabFromPath(location.pathname);
    setActiveTab(newActiveTab);
    
    // Redirect base admin route to overview
    if (location.pathname === '/admin' || location.pathname === '/admin/dashboard') {
      navigate('/admin/overview', { replace: true });
      return;
    }

    // Set navigation panel state based on URL
    const pathParts = location.pathname.replace('/admin/', '').split('/');
    if (pathParts.length > 1) {
      // We're in a nested route, so we need to open the appropriate navigation panel
      const parentId = pathParts[0].replace(/-/g, '-');
      
      // Find the parent menu item and set the navigation panel
      const parentItem = menuItems.find(item => item.id === parentId);
      if (parentItem && parentItem.hasSubMenu) {
        setActiveNavPanel(parentId);
        setNavHistory([{ id: parentId, label: parentItem.label }]);
        
        // If we're deeper than 2 levels, we need to open submenus too
        if (pathParts.length > 2) {
          const subMenuId = pathParts.slice(0, 2).join('-');
          setOpenMenus(prev => ({ ...prev, [subMenuId]: true }));
        }
      }
    } else {
      // We're at a top-level route, close navigation panels
      setActiveNavPanel(null);
      setNavHistory([]);
      setOpenMenus({});
    }
  }, [location.pathname, navigate]);

  // Handle main menu item click with URL navigation (preserves existing UI behavior)
  const handleMenuClick = (itemId) => {
    const item = menuItems.find(m => m.id === itemId);
    
    if (item && item.hasSubMenu) {
      // For items with submenus, open the navigation panel (existing behavior)
      setActiveNavPanel(itemId);
      setNavHistory([{ id: itemId, label: item.label }]);
      // Don't navigate for parent items, just open the panel to preserve UI
    } else {
      // For leaf items, navigate to the URL and update active tab
      const newPath = getPathFromTabId(itemId);
      navigate(newPath);
    }
  };

  // Handle submenu item click with URL navigation (preserves existing UI behavior)
  const handleSubMenuClick = (parentId, itemId, item) => {
    const fullId = `${parentId}-${itemId}`;
    
    if (item.hasSubMenu) {
      // Toggle submenu dropdown (existing behavior preserved)
      setOpenMenus(prev => ({
        ...prev,
        [fullId]: !prev[fullId]
      }));
    } else {
      // Navigate to URL for leaf items
      const newPath = getPathFromTabId(fullId);
      navigate(newPath);
    }
  };

  // Handle nested submenu item click with URL navigation
  const handleNestedSubMenuClick = (parentId, subParentId, itemId) => {
    const fullId = `${parentId}-${subParentId}-${itemId}`;
    const newPath = getPathFromTabId(fullId);
    navigate(newPath);
  };

  // Handle back navigation with URL updates (preserves existing UI behavior)
  const handleBackNavigation = () => {
    if (navHistory.length > 1) {
      const newHistory = navHistory.slice(0, -1);
      setNavHistory(newHistory);
      const parentId = newHistory[newHistory.length - 1].id;
      setActiveNavPanel(parentId);
      // Navigate to parent level
      const newPath = getPathFromTabId(parentId);
      navigate(newPath);
    } else {
      setActiveNavPanel(null);
      setNavHistory([]);
      navigate('/admin/overview');
    }
  };

  // Check if a submenu is open (existing function preserved)
  const isSubmenuOpen = (itemId) => {
    return openMenus[itemId] || false;
  };

  // Toggle submenu open/closed state (existing function preserved)
  const toggleSubmenu = (itemId) => {
    setOpenMenus(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId]
    }));
  };

  // Function to go back in navigation history (existing function preserved)
  const goBack = () => {
    if (navHistory.length > 0) {
      const previousItem = navHistory.pop();
      setActiveNavPanel(previousItem.id);
      setNavHistory([...navHistory]);
    } else {
      setActiveNavPanel(null);
    }
  };
  
  // Function to toggle user profile menu (existing function preserved)
  const toggleUserProfile = () => {
    setIsUserProfileOpen(!isUserProfileOpen);
  };
  
  // Define nested menu structure based on database schema
  const menuItems = [
    { id: 'overview', label: 'Home', icon: <FaHome /> },
    { 
      id: 'items-services', 
      label: 'Items & Services', 
      icon: <FaBoxes />,
      hasSubMenu: true,
      subMenu: [
        { 
          id: 'items', 
          label: 'Items', 
          hasSubMenu: true,
          subMenu: [
            { id: 'item-library', label: 'Item Library', hasSubMenu: false },
            { id: 'service-library', label: 'Service Library', hasSubMenu: false },
            { id: 'image-library', label: 'Image Library', hasSubMenu: false },
            { id: 'resources', label: 'Resources', hasSubMenu: false },
            { id: 'modifiers', label: 'Modifiers', hasSubMenu: false },
            { id: 'categories', label: 'Categories', hasSubMenu: false },
            { id: 'discounts', label: 'Discounts', hasSubMenu: false },
            { id: 'options', label: 'Options', hasSubMenu: false },
            { id: 'units', label: 'Units', hasSubMenu: false },
            { id: 'custom-attributes', label: 'Custom Attributes', hasSubMenu: false },
          ]
        },
        { 
          id: 'inventory', 
          label: 'Inventory Management', 
          hasSubMenu: true,
          subMenu: [
            { id: 'history', label: 'History', hasSubMenu: false },
            { id: 'purchase-orders', label: 'Purchase Orders', hasSubMenu: false },
            { id: 'vendors', label: 'Vendors', hasSubMenu: false },
            { id: 'pending-restocks', label: 'Pending Restocks', hasSubMenu: false },
          ]
        },
        { 
          id: 'gift-cards', 
          label: 'Gift Cards', 
          hasSubMenu: true,
          subMenu: [
            { id: 'gift-overview', label: 'Overview', hasSubMenu: false },
            { 
              id: 'egift-cards', 
              label: 'eGift Cards', 
              hasSubMenu: true,
              subMenu: [
                { id: 'configure', label: 'Configure', hasSubMenu: false },
                { id: 'discounts', label: 'Discounts', hasSubMenu: false },
              ]
            },
            { id: 'plastic-cards', label: 'Plastic Gift Cards', hasSubMenu: false },
            { id: 'promotional-tools', label: 'Promotional Tools', hasSubMenu: false },
            { id: 'gift-settings', label: 'Settings', hasSubMenu: false },
          ]
        },
        { 
          id: 'item-settings', 
          label: 'Settings', 
          hasSubMenu: true,
          subMenu: [
            { id: 'item-defaults', label: 'Item Defaults', hasSubMenu: false },
            { id: 'comp-void', label: 'Comp and Void', hasSubMenu: false },
            { id: 'inventory-settings', label: 'Inventory', hasSubMenu: false },
            { id: 'payment-links', label: 'Payment Links', hasSubMenu: false },
          ]
        },
      ]
    },
    { 
      id: 'payments', 
      label: 'Payments & Invoices', 
      icon: <FaShoppingCart />,
      hasSubMenu: true,
      subMenu: [
        { id: 'transactions', label: 'Transactions', hasSubMenu: false },
        { 
          id: 'orders', 
          label: 'Orders', 
          hasSubMenu: true,
          subMenu: [
            { id: 'all-orders', label: 'All Orders', hasSubMenu: false },
            { id: 'shipments', label: 'Shipments', hasSubMenu: false },
            { id: 'order-partners', label: 'Order Partners', hasSubMenu: false },
            { id: 'fulfillment-settings', label: 'Fulfillment Settings', hasSubMenu: false },
          ]
        },
        { 
          id: 'invoices', 
          label: 'Invoices', 
          hasSubMenu: true,
          subMenu: [
            { id: 'invoice-overview', label: 'Overview', hasSubMenu: false },
            { id: 'projects', label: 'Projects', hasSubMenu: false },
            { id: 'invoice-list', label: 'Invoices', hasSubMenu: false },
            { id: 'recurring-series', label: 'Recurring Series', hasSubMenu: false },
            { id: 'estimates', label: 'Estimates', hasSubMenu: false },
            { id: 'invoice-reports', label: 'Reports', hasSubMenu: false },
            { id: 'invoice-apps', label: 'Apps', hasSubMenu: false },
            { 
              id: 'invoice-settings', 
              label: 'Settings', 
              hasSubMenu: true,
              subMenu: [
                { id: 'invoice-templates', label: 'Invoices', hasSubMenu: false },
                { id: 'estimate-defaults', label: 'Estimates', hasSubMenu: false },
                { id: 'customization', label: 'Customization', hasSubMenu: false },
              ]
            },
          ]
        },
        { 
          id: 'virtual-terminal', 
          label: 'Virtual Terminal', 
          hasSubMenu: true,
          subMenu: [
            { id: 'terminal-overview', label: 'Overview', hasSubMenu: false },
            { id: 'terminal-settings', label: 'Settings', hasSubMenu: false },
          ]
        },
        { 
          id: 'payment-links', 
          label: 'Payment Links', 
          hasSubMenu: true,
          subMenu: [
            { id: 'links-list', label: 'Payment Links', hasSubMenu: false },
            { 
              id: 'links-settings', 
              label: 'Settings', 
              hasSubMenu: true,
              subMenu: [
                { id: 'general', label: 'General', hasSubMenu: false },
                { id: 'branding', label: 'Branding', hasSubMenu: false },
              ]
            },
          ]
        },
        { id: 'subscriptions', label: 'Subscriptions', hasSubMenu: false },
        { id: 'disputes', label: 'Disputes', hasSubMenu: false },
        { 
          id: 'risk-manager', 
          label: 'Risk Manager', 
          hasSubMenu: true,
          subMenu: [
            { 
              id: 'analytics', 
              label: 'Analytics', 
              hasSubMenu: true,
              subMenu: [
                { id: 'key-metrics', label: 'Key Metrics', hasSubMenu: false },
                { id: 'active-rules', label: 'Active Rules', hasSubMenu: false },
              ]
            },
            { id: 'alerts', label: 'Alerts', hasSubMenu: false },
            { id: 'rules', label: 'Rules', hasSubMenu: false },
            { id: 'block-list', label: 'Block List', hasSubMenu: false },
            { id: 'allow-list', label: 'Allow List', hasSubMenu: false },
            { id: 'blocked-payments', label: 'Blocked Payments', hasSubMenu: false },
            { id: 'allowed-payments', label: 'Allowed Payments', hasSubMenu: false },
            { id: 'risk-settings', label: 'Settings', hasSubMenu: false },
          ]
        },
      ]
    },
    { 
      id: 'customers', 
      label: 'Customers', 
      icon: <FaUsers />,
      hasSubMenu: true,
      subMenu: [
        { 
          id: 'customer-directory', 
          label: 'Customer Directory', 
          hasSubMenu: true,
          subMenu: [
            { id: 'directory', label: 'Directory', hasSubMenu: false },
            { id: 'feedback', label: 'Feedback', hasSubMenu: false },
            { 
              id: 'insights', 
              label: 'Insights', 
              hasSubMenu: true,
              subMenu: [
                { id: 'visits', label: 'Visits', hasSubMenu: false },
                { id: 'satisfaction-ratings', label: 'Satisfaction Ratings', hasSubMenu: false },
              ]
            },
            { 
              id: 'customer-settings', 
              label: 'Settings', 
              hasSubMenu: true,
              subMenu: [
                { id: 'configure-profiles', label: 'Configure Profiles', hasSubMenu: false },
                { id: 'instant-profiles', label: 'Instant Profiles', hasSubMenu: false },
                { id: 'feedback-settings', label: 'Feedback', hasSubMenu: false },
                { id: 'card-on-file', label: 'Card on File', hasSubMenu: false },
              ]
            },
          ]
        },
        { 
          id: 'contracts', 
          label: 'Contracts', 
          hasSubMenu: true,
          subMenu: [
            { id: 'contracts-list', label: 'Contracts', hasSubMenu: false },
            { id: 'templates', label: 'Templates', hasSubMenu: false },
            { id: 'clauses', label: 'Clauses', hasSubMenu: false },
          ]
        },
        { 
          id: 'marketing', 
          label: 'Marketing', 
          hasSubMenu: true,
          subMenu: [
            { id: 'campaigns', label: 'Campaigns', hasSubMenu: false },
            { id: 'automations', label: 'Automations', hasSubMenu: false },
            { id: 'google-reviews', label: 'Google Reviews', hasSubMenu: false },
            { id: 'coupons', label: 'Coupons', hasSubMenu: false },
            { id: 'marketing-settings', label: 'Settings', hasSubMenu: false },
          ]
        },
        { 
          id: 'loyalty', 
          label: 'Loyalty', 
          hasSubMenu: true,
          subMenu: [
            { id: 'loyalty-overview', label: 'Overview', hasSubMenu: false },
            { 
              id: 'reports', 
              label: 'Reports', 
              hasSubMenu: true,
              subMenu: [
                { id: 'loyalty-visits', label: 'Visits', hasSubMenu: false },
                { id: 'loyalty-sales', label: 'Sales', hasSubMenu: false },
                { id: 'top-customers', label: 'Top Customers', hasSubMenu: false },
              ]
            },
            { 
              id: 'activity', 
              label: 'Activity', 
              hasSubMenu: true,
              subMenu: [
                { id: 'all-activity', label: 'All Activity', hasSubMenu: false },
                { id: 'suspicious-activity', label: 'Suspicious Activity', hasSubMenu: false },
              ]
            },
            { 
              id: 'loyalty-marketing', 
              label: 'Marketing', 
              hasSubMenu: true,
              subMenu: [
                { id: 'email', label: 'Email', hasSubMenu: false },
                { id: 'other', label: 'Other', hasSubMenu: false },
              ]
            },
            { id: 'promotions', label: 'Promotions', hasSubMenu: false },
            { id: 'loyalty-settings', label: 'Settings', hasSubMenu: false },
          ]
        },
      ]
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: <FaChartLine />,
      hasSubMenu: true,
      subMenu: [
        { 
          id: 'sales-reports', 
          label: 'Sales', 
          hasSubMenu: true,
          subMenu: [
            { id: 'sales-summary', label: 'Sales Summary', hasSubMenu: false },
            { id: 'item-sales', label: 'Item Sales', hasSubMenu: false },
            { id: 'sales-trends', label: 'Sales Trends', hasSubMenu: false },
            { id: 'category-sales', label: 'Category Sales', hasSubMenu: false },
            { id: 'team-sales', label: 'Team Sales', hasSubMenu: false },
            { id: 'modifier-sales', label: 'Modifier Sales', hasSubMenu: false },
            { id: 'gift-cards-sales', label: 'Gift Cards', hasSubMenu: false },
            { id: 'section-sales', label: 'Section Sales', hasSubMenu: false },
            { id: 'vendor-sales', label: 'Vendor Sales', hasSubMenu: false },
          ]
        },
        { 
          id: 'accounting', 
          label: 'Accounting', 
          hasSubMenu: true,
          subMenu: [
            { id: 'sales-taxes', label: 'Sales Taxes', hasSubMenu: false },
            { id: 'fees', label: 'Fees', hasSubMenu: false },
            { id: 'service-charges', label: 'Service Charges', hasSubMenu: false },
            { id: 'reconciliation', label: 'Reconciliation', hasSubMenu: false },
          ]
        },
        { 
          id: 'payment-reports', 
          label: 'Payments', 
          hasSubMenu: true,
          subMenu: [
            { id: 'payment-methods', label: 'Payment Methods', hasSubMenu: false },
            { id: 'transaction-status', label: 'Transaction Status', hasSubMenu: false },
            { id: 'discounts-report', label: 'Discounts', hasSubMenu: false },
            { id: 'comps', label: 'Comps', hasSubMenu: false },
            { id: 'voids', label: 'Voids', hasSubMenu: false },
            { id: 'cash-drawers', label: 'Cash Drawers', hasSubMenu: false },
          ]
        },
        { 
          id: 'operations', 
          label: 'Operations', 
          hasSubMenu: true,
          subMenu: [
            { id: 'activity-log', label: 'Activity Log', hasSubMenu: false },
            { id: 'labor-vs-sales', label: 'Labor vs Sales', hasSubMenu: false },
            { id: 'kitchen-performance', label: 'Kitchen Performance', hasSubMenu: false },
          ]
        },
        { 
          id: 'online', 
          label: 'Online', 
          hasSubMenu: true,
          subMenu: [
            { id: 'traffic-sources', label: 'Traffic & Sources', hasSubMenu: false },
            { id: 'purchase-funnel', label: 'Purchase Funnel', hasSubMenu: false },
          ]
        },
        { 
          id: 'inventory-reports', 
          label: 'Inventory', 
          hasSubMenu: true,
          subMenu: [
            { id: 'cost-of-goods', label: 'Cost of Goods Sold', hasSubMenu: false },
            { id: 'inventory-by-category', label: 'Inventory by Category', hasSubMenu: false },
            { id: 'projected-profit', label: 'Projected Profit', hasSubMenu: false },
            { id: 'inventory-sell-through', label: 'Inventory Sell-Through', hasSubMenu: false },
            { id: 'aging-inventory', label: 'Aging Inventory', hasSubMenu: false },
          ]
        },
        { id: 'custom-reports', label: 'Custom Reports', hasSubMenu: false },
        { id: 'reporting-hours', label: 'Reporting Hours', hasSubMenu: false },
      ]
    },
    { 
      id: 'staff', 
      label: 'Staff', 
      icon: <FaUsers />,
      hasSubMenu: true,
      subMenu: [
        { 
          id: 'team', 
          label: 'Team', 
          hasSubMenu: true,
          subMenu: [
            { id: 'team-members', label: 'Team Members', hasSubMenu: false },
            { id: 'permissions', label: 'Permissions', hasSubMenu: false },
          ]
        },
        { 
          id: 'scheduling', 
          label: 'Scheduling', 
          hasSubMenu: true,
          subMenu: [
            { id: 'schedule', label: 'Schedule', hasSubMenu: false },
            { id: 'availability', label: 'Availability', hasSubMenu: false },
            { id: 'time-off', label: 'Time Off', hasSubMenu: false },
          ]
        },
        { 
          id: 'time-tracking', 
          label: 'Time Tracking', 
          hasSubMenu: true,
          subMenu: [
            { id: 'workday', label: 'Workday', hasSubMenu: false },
            { id: 'timecards', label: 'Timecards', hasSubMenu: false },
          ]
        },
        { id: 'announcements', label: 'Announcements', hasSubMenu: false },
        { 
          id: 'staff-settings', 
          label: 'Settings', 
          hasSubMenu: true,
          subMenu: [
            { id: 'schedule-settings', label: 'Schedule', hasSubMenu: false },
            { id: 'clock-in-out', label: 'Clock In/Out', hasSubMenu: false },
            { id: 'breaks', label: 'Breaks', hasSubMenu: false },
            { id: 'overtime', label: 'Overtime', hasSubMenu: false },
            { id: 'messaging', label: 'Messaging', hasSubMenu: false },
            { id: 'tips', label: 'Tips', hasSubMenu: false },
            { id: 'commissions', label: 'Commissions', hasSubMenu: false },
            { id: 'alerts', label: 'Alerts', hasSubMenu: false },
          ]
        },
      ]
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <FaCog />,
      hasSubMenu: true,
      subMenu: [
        { 
          id: 'account-settings', 
          label: 'Account & Settings', 
          hasSubMenu: true,
          subMenu: [
            { id: 'sign-in-security', label: 'Sign In & Security', hasSubMenu: false },
            { 
              id: 'my-business', 
              label: 'My Business', 
              hasSubMenu: true,
              subMenu: [
                { id: 'about', label: 'About', hasSubMenu: false },
                { id: 'security', label: 'Security', hasSubMenu: false },
                { id: 'locations', label: 'Locations', hasSubMenu: false },
              ]
            },
            { id: 'verified-information', label: 'Verified Information', hasSubMenu: false },
            { id: 'pricing-subscriptions', label: 'Pricing & Subscriptions', hasSubMenu: false },
            { 
              id: 'payments-settings', 
              label: 'Payments', 
              hasSubMenu: true,
              subMenu: [
                { id: 'receipts', label: 'Receipts', hasSubMenu: false },
                { id: 'sales-taxes-settings', label: 'Sales Taxes', hasSubMenu: false },
                { id: 'service-charges-settings', label: 'Service Charges', hasSubMenu: false },
                { id: 'payment-methods-settings', label: 'Payment Methods', hasSubMenu: false },
              ]
            },
            { 
              id: 'money', 
              label: 'Money', 
              hasSubMenu: true,
              subMenu: [
                { id: 'bank-accounts', label: 'Bank Accounts', hasSubMenu: false },
                { id: 'transfers', label: 'Transfers', hasSubMenu: false },
              ]
            },
            { 
              id: 'notifications', 
              label: 'Notifications', 
              hasSubMenu: true,
              subMenu: [
                { id: 'account-notifications', label: 'Account', hasSubMenu: false },
                { id: 'outages', label: 'Outages', hasSubMenu: false },
                { id: 'invoices-notifications', label: 'Invoices', hasSubMenu: false },
                { id: 'disputes-notifications', label: 'Disputes', hasSubMenu: false },
                { id: 'tax-invoices', label: 'Tax Invoices', hasSubMenu: false },
              ]
            },
            { 
              id: 'fulfillment-methods', 
              label: 'Fulfillment Methods', 
              hasSubMenu: true,
              subMenu: [
                { id: 'pickup-delivery', label: 'Online Pickup & Delivery', hasSubMenu: false },
                { id: 'shipment', label: 'Shipment', hasSubMenu: false },
                { id: 'non-physical', label: 'Non-Physical', hasSubMenu: false },
              ]
            },
            { id: 'information-requests', label: 'Information Requests', hasSubMenu: false },
            { id: 'free-processing', label: 'Get Free Processing', hasSubMenu: false },
          ]
        },
        { 
          id: 'device-management', 
          label: 'Device Management', 
          hasSubMenu: true,
          subMenu: [
            { id: 'devices', label: 'Devices', hasSubMenu: false },
            { id: 'printer-profiles', label: 'Printer Profiles', hasSubMenu: false },
            { id: 'device-codes', label: 'Device Codes', hasSubMenu: false },
            { id: 'modes', label: 'Modes', hasSubMenu: false },
            { id: 'kiosk', label: 'Kiosk', hasSubMenu: false },
          ]
        },
        { id: 'app-integrations', label: 'App Integrations', hasSubMenu: false },
        { id: 'release-manager', label: 'Release Manager', hasSubMenu: false },
      ]
    },
  ];

  // Navigate to a submenu panel (legacy function - replaced by URL navigation)
  const navigateToPanel = (itemId, label) => {
    setActiveNavPanel(itemId);
    setNavHistory(prev => [...prev, { id: itemId, label }]);
  };
  
  // Render main navigation items
  const renderMainNavItems = () => {
    return menuItems.map(item => (
      <li 
        key={item.id}
        className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
        style={{ paddingLeft: '16px' }}
        onClick={() => handleMenuClick(item.id)}
      >
        {item.icon && <span className={styles.icon}>{item.icon}</span>}
        <span className={styles.label}>{item.label}</span>
      </li>
    ));
  };

  // Render secondary navigation items with dropdowns
  const renderSecondaryNavItems = (parentId) => {
    const parent = menuItems.find(item => item.id === parentId);
    if (!parent || !parent.subMenu) return null;
    
    return parent.subMenu.map(item => (
      <React.Fragment key={item.id}>
        <li 
          className={`${styles.navItem} ${activeTab === `${parentId}-${item.id}` ? styles.active : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleSubMenuClick(parentId, item.id, item);
          }}
        >
          <span className={styles.label}>{item.label}</span>
          {item.hasSubMenu && (
            <FaAngleDown 
              className={`${styles.submenuIndicator} ${isSubmenuOpen(`${parentId}-${item.id}`) ? styles.rotated : ''}`} 
            />
          )}
        </li>
        <div 
          className={styles.submenuDropdown} 
          data-open={isSubmenuOpen(`${parentId}-${item.id}`) ? 'true' : 'false'}
        >
          {item.subMenu.map(subItem => (
            <React.Fragment key={subItem.id}>
              <li 
                className={`${styles.navItem} ${styles.subMenuItem} ${activeTab === subItem.id ? styles.active : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (subItem.hasSubMenu) {
                    toggleSubmenu(subItem.id);
                  } else {
                    setActiveTab(subItem.id);
                  }
                }}
              >
                <span className={styles.label}>{subItem.label}</span>
                {subItem.hasSubMenu && (
                  <FaAngleDown 
                    className={`${styles.submenuIndicator} ${isSubmenuOpen(subItem.id) ? styles.rotated : ''}`} 
                  />
                )}
              </li>
              {subItem.hasSubMenu && (
                <div 
                  className={styles.submenuDropdown} 
                  data-open={isSubmenuOpen(subItem.id) ? 'true' : 'false'}
                >
                  {subItem.subMenu.map(nestedItem => (
                    <li 
                      key={nestedItem.id}
                      className={`${styles.navItem} ${styles.subMenuItem} ${activeTab === nestedItem.id ? styles.active : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(nestedItem.id);
                      }}
                    >
                      <span className={styles.label}>{nestedItem.label}</span>
                    </li>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </React.Fragment>
    ));
  };

  // Update document title based on active tab
  useEffect(() => {
    const getActiveTabLabel = () => {
      if (activeTab === 'overview') return 'Home';
      
      // Find the active tab in the menu structure
      let activeItem = null;
      const findActiveItem = (items) => {
        for (const item of items) {
          if (item.id === activeTab) {
            activeItem = item;
            return true;
          }
          if (item.subMenu && findActiveItem(item.subMenu)) {
            // If we're in a submenu, include the parent label
            if (!activeItem) activeItem = item;
            return true;
          }
        }
        return false;
      };
      
      findActiveItem(menuItems);
      return activeItem ? activeItem.label : 'Home';
    };
    
    document.title = `${getActiveTabLabel()} | Hood Dashboard`;
  }, [activeTab]);

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'item-library':
        return <ItemLibrary />;
      case 'service-library':
        return <ServiceLibrary />;
      case 'overview':
      default:
        return <Overview />;
    }
  };
  
  return (
    <div className={styles.adminDashboard}>
      <div className={styles.sidebar}>
        {/* Top Section: User and Search */}
        <div className={styles.sidebarTop}>
          <button className={styles.userButton} onClick={toggleUserProfile}>
            <FaUser className={styles.userIcon} />
            <span className={styles.userName}>ONM PHARMACEUTICALS</span>
            <FaChevronRight className={styles.chevronIcon} />
          </button>
          
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input type="text" placeholder="Search" className={styles.searchInput} />
          </div>
        </div>
        
        {/* Middle Section: Main Navigation */}
        <nav className={styles.navigation}>
          <div className={styles.navViewport}>
            <div className={`${styles.navContainer} ${activeNavPanel ? styles.hasSubmenu : ''}`}>
              {/* Main Menu Panel */}
              <div className={styles.menuPanel}>
                <ul className={styles.navList}>
                  {renderMainNavItems()}
                  <li className={styles.navItem}>
                    <span className={styles.icon}><FaLayerGroup /></span>
                    <span className={styles.label}>Add more</span>
                  </li>
                </ul>
              </div>
              
              {/* Secondary Menu Panel */}
              <div className={styles.menuPanel}>
                {activeNavPanel && (
                  <>
                    <div 
                      className={styles.subMenuHeader} 
                      onClick={() => {
                        // Go directly back to main menu with URL navigation
                        handleBackNavigation();
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <FaArrowLeft />
                      <span style={{ marginLeft: '8px' }}>
                        {navHistory.length > 0 ? navHistory[navHistory.length - 1].label : 'Back'}
                      </span>
                    </div>
                    <ul className={styles.navList}>
                      {renderSecondaryNavItems(activeNavPanel)}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
        
        {/* Bottom Section: Utility Icons */}
        <div className={styles.sidebarBottom}>
          <div className={styles.iconWrapper}>
            <button className={styles.iconButton}>
              <FaRegBell className={styles.bottomIcon} />
              <span className={styles.tooltip}>Notifications</span>
            </button>
          </div>
          <div className={styles.iconWrapper}>
            <button className={styles.iconButton}>
              <FaRegCommentDots className={styles.bottomIcon} />
              <span className={styles.tooltip}>Messages</span>
            </button>
          </div>
          <div className={styles.iconWrapper}>
            <button className={styles.iconButton}>
              <FaRegQuestionCircle className={styles.bottomIcon} />
              <span className={styles.tooltip}>Setup Guide</span>
            </button>
          </div>
          <div className={styles.iconWrapper}>
            <button className={styles.iconButton}>
              <FaCog className={styles.bottomIcon} />
              <span className={styles.tooltip}>Support</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.content}>
        {/* Header removed as requested */}
        
        <main className={styles.mainContent}>
          {renderContent()}
        </main>
      </div>
      
      {/* User Profile Panel */}
      <div className={`${styles.userProfilePanel} ${isUserProfileOpen ? styles.open : ''}`}>
        <div className={styles.userProfileHeader}>
          <button className={styles.closeProfileButton} onClick={toggleUserProfile}>
            ×
          </button>
          <div className={styles.profileTitle}>Owner</div>
        </div>
        <div className={styles.userProfileContent}>
          <ul className={styles.profileMenu}>
            <li className={styles.profileMenuItem}>
              <a href="#" className={styles.profileMenuLink}>Account settings</a>
            </li>
            <li className={styles.profileMenuItem}>
              <a href="#" className={styles.profileMenuLink}>Cookie preferences</a>
            </li>
            <li className={styles.profileMenuItem}>
              <a href="#" className={styles.profileMenuLink}>Hood Community</a>
            </li>
            <li className={styles.profileMenuItem}>
              <a href="#" className={styles.profileMenuLink}>Order Hood hardware</a>
            </li>
            <li className={styles.profileMenuItem}>
              <a href="#" className={styles.profileMenuLink}>Sign out</a>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Overlay for when profile panel is open */}
      {isUserProfileOpen && (
        <div className={styles.overlay} onClick={toggleUserProfile}></div>
      )}
    </div>
  );
};

export default AdminDashboard;
