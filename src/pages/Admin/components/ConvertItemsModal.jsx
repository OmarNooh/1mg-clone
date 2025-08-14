import React, { useState, useEffect } from 'react';
import { FaTimes, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import styles from './ConvertItemsModal.module.css';

const ConvertItemsModal = ({ onClose, onComplete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock items data - in real app this would come from API
  useEffect(() => {
    setTimeout(() => {
      setItems([
        {
          id: 1,
          name: '10CC - SYRINGE ( NEOJECT ) 10MLS',
          price: 500.00,
          duration: null
        },
        {
          id: 2,
          name: '10CC SYRINGE ( SURGIMED )',
          price: 500.00,
          duration: null
        },
        {
          id: 3,
          name: '10CM GAUZE W. O. W ( GENSAFE )',
          price: 500.00,
          duration: null
        },
        {
          id: 4,
          name: '10CM SPANDEX CREPE (SPANDEX',
          price: 2500.00,
          duration: null
        },
        {
          id: 5,
          name: '10CM - CREPE BAND 10CM (NEOSP',
          price: 2500.00,
          duration: null
        },
        {
          id: 6,
          name: '15CM GAUZE W. O. W ( GENSAFE )',
          price: 600.00,
          duration: null
        },
        {
          id: 7,
          name: '15CM SPANDEX CREPE (SPANDEX',
          price: 3500.00,
          duration: null
        },
        {
          id: 8,
          name: '15CM - CREPE BAND 15CM (NEOSP',
          price: 3500.00,
          duration: null
        },
        {
          id: 9,
          name: '1CC SYRINGE INSULIN ( NEOJECT - VI',
          price: 250.00,
          duration: null
        },
        {
          id: 10,
          name: '1L Kilimanjaro Water',
          price: 1000.00,
          duration: null
        },
        {
          id: 11,
          name: '21st - CO 100mg TABS ( US - CO G',
          price: 30000.00,
          duration: null
        },
        {
          id: 12,
          name: '21ST - JOINT SUPPORT 30S ( UK - A',
          price: 23500.00,
          duration: null
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleConvert = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item to convert.');
      return;
    }

    const convertedServices = selectedItems.map(itemId => {
      const item = items.find(i => i.id === itemId);
      return {
        id: Date.now() + itemId,
        uniqueId: `SERVICE-${Date.now()}-${itemId}-${Math.random().toString(36).substr(2, 9)}`,
        name: item.name,
        description: `Converted from item: ${item.name}`,
        category: 'Converted Items',
        price: `$${item.price.toFixed(2)}`,
        duration: '30 mins', // Default duration for converted items
        locations: 'All locations',
        trackQuantity: false,
        bookable: true,
        onlineBooking: false,
        cost: '',
        taxable: true,
        createdAt: new Date().toISOString(),
        convertedFrom: item.id
      };
    });

    onComplete(convertedServices);
  };

  if (loading) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading items...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.closeButton} onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          <h1 className={styles.title}>Convert Items to Services</h1>
          <div className={styles.headerRight}>
            <button 
              className={styles.convertButton}
              onClick={handleConvert}
              disabled={selectedItems.length === 0}
            >
              Convert {selectedItems.length} Selected
            </button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.description}>
            <div className={styles.warningIcon}>
              <FaExclamationTriangle />
            </div>
            <div className={styles.descriptionText}>
              <p>
                Convert items in your catalog into time-based Services with a duration. Services can be made bookable by your customers through Square Appointments.{' '}
                <a href="#" className={styles.learnMoreLink}>Learn more →</a>
              </p>
              <div className={styles.warning}>
                <FaExclamationTriangle />
                <span>
                  <strong>Services do not support Inventory Tracking or Dining Options, and do not show up in Square Online. Only whole item units can be converted to a service, fractional item units do not work with this convertor.</strong>
                </span>
              </div>
            </div>
          </div>

          <div className={styles.searchSection}>
            <div className={styles.searchContainer}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by name, description, or SKU"
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.itemsTable}>
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Item Name</th>
                  <th>Duration</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleItemSelect(item.id)}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>
                      <span className={styles.durationPlaceholder}>
                        {item.duration || '—'}
                      </span>
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredItems.length === 0 && (
              <div className={styles.noResults}>
                <p>No items found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConvertItemsModal;
