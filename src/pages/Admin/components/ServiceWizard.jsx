import React, { useState } from 'react';
import { FaTimes, FaInfoCircle } from 'react-icons/fa';
import styles from './ServiceWizard.module.css';

const ServiceWizard = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    durationType: 'mins',
    locations: 'All locations',
    trackQuantity: false,
    bookable: false,
    onlineBooking: false,
    productDescription: '',
    cost: '',
    taxable: true,
    advancedSettings: false
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.duration) {
      alert('Please fill in all required fields (Name, Price, and Duration).');
      return;
    }

    const newService = {
      id: Date.now(),
      uniqueId: `SERVICE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name,
      description: formData.description,
      category: formData.category || 'Uncategorized',
      price: `$${parseFloat(formData.price).toFixed(2)}`,
      duration: `${formData.duration} ${formData.durationType}`,
      locations: formData.locations,
      trackQuantity: formData.trackQuantity,
      bookable: formData.bookable,
      onlineBooking: formData.onlineBooking,
      cost: formData.cost,
      taxable: formData.taxable,
      createdAt: new Date().toISOString()
    };

    onSave(newService);
    setHasUnsavedChanges(false);
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      onClose();
    }
  };

  const handleDiscardChanges = () => {
    setHasUnsavedChanges(false);
    setShowUnsavedDialog(false);
    onClose();
  };

  const handleSaveChanges = () => {
    setShowUnsavedDialog(false);
    handleSave();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.closeButton} onClick={handleClose}>
              <FaTimes />
            </button>
          </div>
          <h1 className={styles.title}>Create service</h1>
          <div className={styles.headerRight}>
            <button className={styles.saveButton} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.form}>
            {/* Basic Information */}
            <div className={styles.section}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Name *
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter service name"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Description
                </label>
                <textarea
                  className={styles.textarea}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter service description"
                  rows={3}
                />
              </div>
            </div>

            {/* Categorization */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Categorization</h3>
              <div className={styles.field}>
                <label className={styles.label}>
                  Categories
                </label>
                <select
                  className={styles.select}
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="">Select category</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Treatment">Treatment</option>
                  <option value="Therapy">Therapy</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Price */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Price</h3>
              <div className={styles.field}>
                <label className={styles.label}>
                  Price *
                </label>
                <div className={styles.priceInput}>
                  <span className={styles.currency}>$</span>
                  <input
                    type="number"
                    className={styles.input}
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Duration</h3>
              <div className={styles.field}>
                <label className={styles.label}>
                  Service duration *
                </label>
                <div className={styles.durationInput}>
                  <input
                    type="number"
                    className={styles.input}
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="0"
                    min="1"
                  />
                  <select
                    className={styles.select}
                    value={formData.durationType}
                    onChange={(e) => handleInputChange('durationType', e.target.value)}
                  >
                    <option value="mins">mins</option>
                    <option value="hours">hours</option>
                    <option value="days">days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Cost */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Cost</h3>
              <div className={styles.field}>
                <label className={styles.label}>
                  Track service cost
                </label>
                <div className={styles.priceInput}>
                  <span className={styles.currency}>$</span>
                  <input
                    type="number"
                    className={styles.input}
                    value={formData.cost}
                    onChange={(e) => handleInputChange('cost', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                <p className={styles.helpText}>
                  Track how much this service costs you to provide. This won't be shown to customers.
                </p>
              </div>
            </div>

            {/* Taxation */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Taxation</h3>
              <div className={styles.checkboxField}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.taxable}
                    onChange={(e) => handleInputChange('taxable', e.target.checked)}
                  />
                  <span className={styles.checkboxText}>Subject to taxes</span>
                </label>
              </div>
            </div>

            {/* Online booking */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Online booking</h3>
              <div className={styles.checkboxField}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.bookable}
                    onChange={(e) => handleInputChange('bookable', e.target.checked)}
                  />
                  <span className={styles.checkboxText}>Bookable by customers online</span>
                </label>
                <p className={styles.helpText}>
                  Publish online with description
                </p>
              </div>

              {formData.bookable && (
                <div className={styles.field}>
                  <label className={styles.label}>
                    Product with description
                  </label>
                  <textarea
                    className={styles.textarea}
                    value={formData.productDescription}
                    onChange={(e) => handleInputChange('productDescription', e.target.value)}
                    placeholder="Enter product description for online booking"
                    rows={3}
                  />
                </div>
              )}
            </div>

            {/* Advanced settings */}
            <div className={styles.section}>
              <div className={styles.advancedToggle}>
                <button
                  type="button"
                  className={styles.toggleButton}
                  onClick={() => handleInputChange('advancedSettings', !formData.advancedSettings)}
                >
                  Advanced settings
                  <span className={formData.advancedSettings ? styles.expanded : styles.collapsed}>
                    ▼
                  </span>
                </button>
              </div>

              {formData.advancedSettings && (
                <div className={styles.advancedContent}>
                  <div className={styles.checkboxField}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.trackQuantity}
                        onChange={(e) => handleInputChange('trackQuantity', e.target.checked)}
                      />
                      <span className={styles.checkboxText}>Track quantity</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Unsaved Changes Dialog */}
        {showUnsavedDialog && (
          <div className={styles.dialogOverlay}>
            <div className={styles.dialogContainer}>
              <div className={styles.dialogHeader}>
                <button 
                  className={styles.dialogCloseButton} 
                  onClick={() => setShowUnsavedDialog(false)}
                >
                  ×
                </button>
              </div>
              <div className={styles.dialogContent}>
                <h3 className={styles.dialogTitle}>You have unsaved changes.</h3>
                <p className={styles.dialogMessage}>
                  Are you sure you want to leave this screen and discard your changes?
                </p>
                <div className={styles.dialogWarning}>
                  <strong>Warning:</strong> All unsaved changes will be permanently lost.
                </div>
              </div>
              <div className={styles.dialogActions}>
                <button 
                  className={styles.discardButton} 
                  onClick={handleDiscardChanges}
                >
                  Discard Changes
                </button>
                <button 
                  className={styles.saveChangesButton} 
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceWizard;
