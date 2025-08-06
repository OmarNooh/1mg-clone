import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ children, activeSection, setActiveSection }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navigationItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
    { id: 'items', label: 'Items', icon: '📦' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'staff', label: 'Staff', icon: '👨‍💼' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>1mg Admin Dashboard</h2>
        </div>
        
        <nav className={styles.navigation}>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${activeSection === item.id ? styles.active : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.userInfo}>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{currentUser?.name || 'Admin'}</span>
            <span className={styles.userEmail}>{currentUser?.email || 'admin@1mg.com'}</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>{navigationItems.find(item => item.id === activeSection)?.label || 'Dashboard'}</h1>
          <div className={styles.headerActions}>
            <span className={styles.lastSync}>Last sync: {new Date().toLocaleString()}</span>
          </div>
        </header>

        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
