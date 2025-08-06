import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'items':
        return <ItemsDashboard />;
      case 'payments':
        return <PaymentsDashboard />;
      case 'customers':
        return <CustomersDashboard />;
      case 'reports':
        return <ReportsDashboard />;
      case 'staff':
        return <StaffDashboard />;
      case 'settings':
        return <SettingsDashboard />;
      case 'overview':
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <DashboardLayout 
      activeSection={activeSection} 
      setActiveSection={setActiveSection}
    >
      {renderActiveSection()}
    </DashboardLayout>
  );
};

// Dashboard Overview Component
const DashboardOverview = () => {
  const stats = [
    { title: 'Total Items', value: '1,234', change: '+12%', icon: '📦' },
    { title: 'Total Customers', value: '890', change: '+8%', icon: '👥' },
    { title: 'Total Payments', value: '₹45,678', change: '+15%', icon: '💳' },
    { title: 'Active Staff', value: '23', change: '+2%', icon: '👨‍💼' },
  ];

  return (
    <div className={styles.overviewContainer}>
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statContent}>
              <h3>{stat.title}</h3>
              <p className={styles.statValue}>{stat.value}</p>
              <span className={styles.statChange}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.recentActivity}>
        <h2>Recent Activity</h2>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <span className={styles.activityIcon}>🆕</span>
            <div className={styles.activityContent}>
              <p>New item added to inventory</p>
              <span>2 hours ago</span>
            </div>
          </div>
          <div className={styles.activityItem}>
            <span className={styles.activityIcon}>💰</span>
            <div className={styles.activityContent}>
              <p>Payment processed successfully</p>
              <span>3 hours ago</span>
            </div>
          </div>
          <div className={styles.activityItem}>
            <span className={styles.activityIcon}>👤</span>
            <div className={styles.activityContent}>
              <p>New customer registration</p>
              <span>5 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <button className={styles.actionBtn}>Add New Item</button>
          <button className={styles.actionBtn}>Process Payment</button>
          <button className={styles.actionBtn}>Add Staff Member</button>
          <button className={styles.actionBtn}>Generate Report</button>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for dashboard sections
const ItemsDashboard = () => (
  <div className={styles.sectionContainer}>
    <h2>Items Management</h2>
    <p>Manage your inventory items here</p>
  </div>
);

const PaymentsDashboard = () => (
  <div className={styles.sectionContainer}>
    <h2>Payments Dashboard</h2>
    <p>Manage payments and transactions</p>
  </div>
);

const CustomersDashboard = () => (
  <div className={styles.sectionContainer}>
    <h2>Customers Dashboard</h2>
    <p>Manage customer information</p>
  </div>
);

const ReportsDashboard = () => (
  <div className={styles.sectionContainer}>
    <h2>Reports Dashboard</h2>
    <p>View and generate reports</p>
  </div>
);

const StaffDashboard = () => (
  <div className={styles.sectionContainer}>
    <h2>Staff Management</h2>
    <p>Manage team members and staff</p>
  </div>
);

const SettingsDashboard = () => (
  <div className={styles.sectionContainer}>
    <h2>Settings Dashboard</h2>
    <p>Configure system settings</p>
  </div>
);

export default AdminDashboard;
