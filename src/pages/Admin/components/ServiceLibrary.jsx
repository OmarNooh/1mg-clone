import React, { useState, useEffect } from 'react';
import { FaBriefcase, FaPlus, FaExchangeAlt } from 'react-icons/fa';
import styles from './ServiceLibrary.module.css';
import ServiceWizard from './ServiceWizard';
import ConvertItemsModal from './ConvertItemsModal';

const ServiceLibrary = () => {
  const [services, setServices] = useState([]);
  const [showServiceWizard, setShowServiceWizard] = useState(false);
  const [showConvertItemsModal, setShowConvertItemsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration - in real app this would come from API
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      // For now, start with empty services to show the first-time experience
      // Later you can populate this with actual service data
      setServices([]);
    }, 500);
  }, []);

  const handleCreateService = () => {
    setShowServiceWizard(true);
  };

  const handleConvertItems = () => {
    setShowConvertItemsModal(true);
  };

  const handleServiceSaved = (newService) => {
    setServices(prevServices => [...prevServices, newService]);
    setShowServiceWizard(false);
  };

  const handleConvertItemsComplete = (convertedServices) => {
    setServices(prevServices => [...prevServices, ...convertedServices]);
    setShowConvertItemsModal(false);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading services...</p>
      </div>
    );
  }

  // If no services exist, show the empty state (first-time experience)
  if (services.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <FaBriefcase />
          </div>
          <h1 className={styles.emptyStateTitle}>Your Service Library</h1>
          <p className={styles.emptyStateDescription}>
            Selling your time? Create and sell services with a duration.
          </p>
          
          <div className={styles.actionButtons}>
            <button 
              className={styles.primaryButton}
              onClick={handleConvertItems}
            >
              <FaExchangeAlt />
              Convert Items
            </button>
            <button 
              className={styles.secondaryButton}
              onClick={handleCreateService}
            >
              <FaPlus />
              Create service
            </button>
          </div>
        </div>

        {/* Service Creation Wizard */}
        {showServiceWizard && (
          <ServiceWizard 
            onClose={() => setShowServiceWizard(false)}
            onSave={handleServiceSaved}
          />
        )}

        {/* Convert Items Modal */}
        {showConvertItemsModal && (
          <ConvertItemsModal 
            onClose={() => setShowConvertItemsModal(false)}
            onComplete={handleConvertItemsComplete}
          />
        )}
      </div>
    );
  }

  // If services exist, show the populated service library
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Services</h1>
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Search by name, description, or SKU"
              className={styles.searchInput}
            />
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.filterControls}>
            <select className={styles.categoryFilter}>
              <option value="">Categories</option>
              <option value="all">All categories</option>
            </select>
            <select className={styles.locationFilter}>
              <option value="">All locations</option>
            </select>
          </div>
          <div className={styles.actionButtons}>
            <button className={styles.actionsButton}>
              Actions
            </button>
            <button 
              className={styles.createServiceButton}
              onClick={handleCreateService}
            >
              Create service
            </button>
          </div>
        </div>
      </div>

      <div className={styles.serviceTable}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Reporting category</th>
              <th>Locations</th>
              <th>Duration</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>
                  <div className={styles.serviceInfo}>
                    <div className={styles.serviceIcon}>
                      <FaBriefcase />
                    </div>
                    <span>{service.name}</span>
                  </div>
                </td>
                <td>{service.category}</td>
                <td>{service.locations}</td>
                <td>{service.duration}</td>
                <td>{service.price}</td>
                <td>
                  <button className={styles.moreButton}>⋯</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Service Creation Wizard */}
      {showServiceWizard && (
        <ServiceWizard 
          onClose={() => setShowServiceWizard(false)}
          onSave={handleServiceSaved}
        />
      )}

      {/* Convert Items Modal */}
      {showConvertItemsModal && (
        <ConvertItemsModal 
          onClose={() => setShowConvertItemsModal(false)}
          onComplete={handleConvertItemsComplete}
        />
      )}
    </div>
  );
};

export default ServiceLibrary;
