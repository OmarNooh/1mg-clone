import React, { useState, useEffect } from 'react';
import { FaSave, FaGlobe, FaEnvelope, FaLock, FaUser, FaShieldAlt } from 'react-icons/fa';
import styles from './AdminComponents.module.css';
import { StoreAPI, UserAPI } from '../../../backend/api/index';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [storeSettings, setStoreSettings] = useState(null);
  const [userSettings, setUserSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  
  // Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const store = await StoreAPI.getStoreSettings();
        const user = await UserAPI.getCurrentUserSettings();
        
        setStoreSettings(store);
        setUserSettings(user);
        setError(null);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const tabs = [
    { id: 'general', label: 'General', icon: <FaGlobe /> },
    { id: 'account', label: 'Account', icon: <FaUser /> },
    { id: 'notifications', label: 'Notifications', icon: <FaEnvelope /> },
    { id: 'security', label: 'Security', icon: <FaLock /> },
    { id: 'permissions', label: 'Permissions', icon: <FaShieldAlt /> },
  ];
  
  const handleSaveSettings = async (e, settingsType) => {
    e.preventDefault();
    setSaveStatus({ status: 'saving' });
    
    try {
      const formData = new FormData(e.target);
      let result;
      
      if (settingsType === 'general') {
        const generalSettings = {
          storeName: formData.get('storeName'),
          storeEmail: formData.get('storeEmail'),
          storePhone: formData.get('storePhone'),
          currency: formData.get('currency'),
          language: formData.get('language')
        };
        
        result = await StoreAPI.updateStoreSettings(generalSettings);
        setStoreSettings(prev => ({ ...prev, ...generalSettings }));
      } else if (settingsType === 'account') {
        const accountSettings = {
          name: formData.get('adminName'),
          email: formData.get('adminEmail')
        };
        
        result = await UserAPI.updateCurrentUserSettings(accountSettings);
        setUserSettings(prev => ({ ...prev, ...accountSettings }));
      } else if (settingsType === 'notifications') {
        const notificationSettings = {
          emailNotifications: {
            newOrder: formData.get('newOrder') === 'on',
            lowStock: formData.get('lowStock') === 'on',
            newCustomer: formData.get('newCustomer') === 'on',
            productReview: formData.get('productReview') === 'on'
          },
          systemNotifications: {
            systemUpdates: formData.get('systemUpdates') === 'on',
            securityAlerts: formData.get('securityAlerts') === 'on'
          }
        };
        
        result = await UserAPI.updateNotificationSettings(notificationSettings);
        setUserSettings(prev => ({ ...prev, notifications: notificationSettings }));
      } else if (settingsType === 'security') {
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');
        
        if (newPassword && newPassword === confirmPassword) {
          result = await UserAPI.changePassword(currentPassword, newPassword);
        } else if (newPassword) {
          throw new Error('New passwords do not match');
        }
        
        const twoFactorEnabled = formData.get('twoFactor') === 'on';
        if (twoFactorEnabled !== userSettings?.security?.twoFactorEnabled) {
          await UserAPI.updateSecuritySettings({ twoFactorEnabled });
          setUserSettings(prev => ({ 
            ...prev, 
            security: { ...prev?.security, twoFactorEnabled } 
          }));
        }
      } else if (settingsType === 'permissions') {
        // Handle permissions update
        const permissionsData = {};
        // Extract permission data from form
        result = await UserAPI.updateRolePermissions(permissionsData);
      }
      
      setSaveStatus({ status: 'success', message: 'Settings saved successfully!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setSaveStatus({ 
        status: 'error', 
        message: err.message || 'Failed to save settings. Please try again.' 
      });
    }
  };
  
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading settings...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className={styles.error}>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      );
    }
    
    switch (activeTab) {
      case 'general':
        return (
          <div className={styles.settingsForm}>
            <form onSubmit={(e) => handleSaveSettings(e, 'general')}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Store Name</label>
                <input 
                  type="text" 
                  name="storeName"
                  className={styles.formInput}
                  defaultValue={storeSettings?.storeName || "HOOD Medical Store"}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Store Email</label>
                <input 
                  type="email" 
                  name="storeEmail"
                  className={styles.formInput}
                  defaultValue={storeSettings?.storeEmail || "contact@hoodmedical.co.tz"}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Store Phone</label>
                <input 
                  type="text" 
                  name="storePhone"
                  className={styles.formInput}
                  defaultValue={storeSettings?.storePhone || "+255 755 123 456"}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Currency</label>
                <select 
                  name="currency"
                  className={styles.formSelect} 
                  defaultValue={storeSettings?.currency || "TZS"}
                >
                  <option value="TZS">TZS (Tanzanian Shilling)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Default Language</label>
                <select 
                  name="language"
                  className={styles.formSelect} 
                  defaultValue={storeSettings?.language || "en"}
                >
                  <option value="en">English</option>
                  <option value="sw">Swahili</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  <FaSave /> Save Changes
                </button>
              </div>
            </form>
          </div>
        );
        
      case 'account':
        return (
          <div className={styles.settingsForm}>
            <form onSubmit={(e) => handleSaveSettings(e, 'account')}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Admin Name</label>
                <input 
                  type="text" 
                  name="adminName"
                  className={styles.formInput}
                  defaultValue={userSettings?.name || "Admin User"}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Admin Email</label>
                <input 
                  type="email" 
                  name="adminEmail"
                  className={styles.formInput}
                  defaultValue={userSettings?.email || "admin@hoodmedical.co.tz"}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Profile Picture</label>
                <div className={styles.fileUpload}>
                  <input type="file" id="profilePicture" className={styles.fileInput} />
                  <label htmlFor="profilePicture" className={styles.fileLabel}>Choose File</label>
                  <span className={styles.fileName}>No file chosen</span>
                </div>
              </div>
              
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  <FaSave /> Save Changes
                </button>
              </div>
            </form>
          </div>
        );
        
      case 'notifications':
        return (
          <div className={styles.settingsForm}>
            <form onSubmit={(e) => handleSaveSettings(e, 'notifications')}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Notifications</label>
                <div className={styles.checkboxGroup}>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="newOrder" defaultChecked />
                    <label htmlFor="newOrder">New Order</label>
                  </div>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="lowStock" defaultChecked />
                    <label htmlFor="lowStock">Low Stock Alert</label>
                  </div>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="newCustomer" defaultChecked />
                    <label htmlFor="newCustomer">New Customer Registration</label>
                  </div>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="productReview" />
                    <label htmlFor="productReview">New Product Review</label>
                  </div>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>System Notifications</label>
                <div className={styles.checkboxGroup}>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="systemUpdates" defaultChecked />
                    <label htmlFor="systemUpdates">System Updates</label>
                  </div>
                  <div className={styles.checkboxItem}>
                    <input type="checkbox" id="securityAlerts" defaultChecked />
                    <label htmlFor="securityAlerts">Security Alerts</label>
                  </div>
                </div>
              </div>
              
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  <FaSave /> Save Changes
                </button>
              </div>
            </form>
          </div>
        );
        
      case 'security':
        return (
          <div className={styles.settingsForm}>
            <form onSubmit={(e) => handleSaveSettings(e, 'security')}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Change Password</label>
                <input 
                  type="password" 
                  name="currentPassword"
                  className={styles.formInput}
                  placeholder="Current Password"
                />
              </div>
              
              <div className={styles.formGroup}>
                <input 
                  type="password" 
                  name="newPassword"
                  className={styles.formInput}
                  placeholder="New Password"
                />
              </div>
              
              <div className={styles.formGroup}>
                <input 
                  type="password" 
                  name="confirmPassword"
                  className={styles.formInput}
                  placeholder="Confirm New Password"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Two-Factor Authentication</label>
                <div className={styles.toggleSwitch}>
                  <input 
                    type="checkbox" 
                    id="twoFactor" 
                    name="twoFactor"
                    className={styles.toggleInput} 
                    defaultChecked={userSettings?.security?.twoFactorEnabled}
                  />
                  <label htmlFor="twoFactor" className={styles.toggleLabel}>
                    <span className={styles.toggleButton}></span>
                  </label>
                  <span className={styles.toggleText}>Enable two-factor authentication</span>
                </div>
              </div>
              
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  <FaSave /> Save Changes
                </button>
              </div>
            </form>
          </div>
        );
        
      case 'permissions':
        return (
          <div className={styles.settingsForm}>
            <div className={styles.permissionsTable}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Dashboard</th>
                    <th>Products</th>
                    <th>Orders</th>
                    <th>Customers</th>
                    <th>Settings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Admin</td>
                    <td><input type="checkbox" defaultChecked disabled /></td>
                    <td><input type="checkbox" defaultChecked disabled /></td>
                    <td><input type="checkbox" defaultChecked disabled /></td>
                    <td><input type="checkbox" defaultChecked disabled /></td>
                    <td><input type="checkbox" defaultChecked disabled /></td>
                  </tr>
                  <tr>
                    <td>Manager</td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                  <tr>
                    <td>Staff</td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                  <tr>
                    <td>Customer Support</td>
                    <td><input type="checkbox" /></td>
                    <td><input type="checkbox" /></td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" defaultChecked /></td>
                    <td><input type="checkbox" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className={styles.formActions}>
              <button type="button" className={styles.saveButton}>
                <FaSave /> Save Changes
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={styles.settings}>
      <div className={styles.settingsTabs}>
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`${styles.settingsTab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </div>
        ))}
      </div>
      
      <div className={styles.settingsContent}>
        <h2 className={styles.settingsTitle}>{tabs.find(tab => tab.id === activeTab)?.label} Settings</h2>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Settings;
