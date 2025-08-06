import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>1mg Admin</h2>
        </div>
        <nav className={styles.nav}>
          <a href="#" className={styles.navItem}>Dashboard</a>
          <a href="#" className={styles.navItem}>Products</a>
          <a href="#" className={styles.navItem}>Orders</a>
          <a href="#" className={styles.navItem}>Users</a>
          <a href="#" className={styles.navItem}>Analytics</a>
          <a href="#" className={styles.navItem}>Settings</a>
        </nav>
      </div>
      
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Admin Dashboard</h1>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.userInfo}>
              Welcome, {currentUser?.name || 'Admin'}
            </span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </header>
        
        <div className={styles.contentArea}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Total Products</h3>
              <p className={styles.statNumber}>1,234</p>
            </div>
            <div className={styles.statCard}>
              <h3>Total Orders</h3>
              <p className={styles.statNumber}>567</p>
            </div>
            <div className={styles.statCard}>
              <h3>Total Users</h3>
              <p className={styles.statNumber}>890</p>
            </div>
            <div className={styles.statCard}>
              <h3>Revenue</h3>
              <p className={styles.statNumber}>₹45,678</p>
            </div>
          </div>
          
          <div className={styles.recentActivity}>
            <h2>Recent Activity</h2>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <span>New order #1234 placed</span>
                <span>2 hours ago</span>
              </div>
              <div className={styles.activityItem}>
                <span>Product "Paracetamol" updated</span>
                <span>3 hours ago</span>
              </div>
              <div className={styles.activityItem}>
                <span>New user registration</span>
                <span>5 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
