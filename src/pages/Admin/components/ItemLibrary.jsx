import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaEllipsisH, 
  FaPlus, 
  FaChevronDown,
  FaSpinner
} from 'react-icons/fa';
import styles from './ItemLibrary.module.css';

const ItemLibrary = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLocation, setActiveLocation] = useState('All');
  const [activeStatus, setActiveStatus] = useState('Active');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // Mock data for demonstration
  const mockItems = [
    { id: 1, name: '10CC - SYRINGE ( NEOJECT ) 10MLS 100\'S', category: 'SYRINGES', locations: 'All locations', stock: 44, available: 44, price: 'TSH 500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 2, name: '10CC SYRINGE ( SURGIMED )', category: 'SYRINGES', locations: 'All locations', stock: -1, available: -1, price: 'TSH 500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 3, name: '10CM GAUZE W . O . W ( GENSAFE - BANDA)', category: 'SURGICALS', locations: 'All locations', stock: 0, available: 0, price: 'TSH 500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 4, name: '10CM SPANDEX CREPE (SPANDEX - NEOSP', category: 'SURGICALS', locations: 'All locations', stock: 13, available: 13, price: 'TSH 2,500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 5, name: '10CM - CREPE BAND 10CM (NEOSPORT) 1', category: 'SURGICALS', locations: 'All locations', stock: 5, available: 5, price: 'TSH 2,500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 6, name: '15CM GAUZE W . O . W ( GENSAFE - BANDA', category: 'SURGICALS', locations: 'All locations', stock: 18, available: 18, price: 'TSH 600.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 7, name: '15CM SPANDEX CREPE (SPANDEX - NEOSP', category: 'SURGICALS', locations: 'All locations', stock: -1, available: -1, price: 'TSH 3,500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 8, name: '15CM - CREPE BAND 15CM (NEOSPORT) 1', category: 'SURGICALS', locations: 'All locations', stock: 6, available: 6, price: 'TSH 3,500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 9, name: '1CC SYRINGE INSULIN ( NEOJET - YELLOW', category: 'SYRINGES', locations: 'All locations', stock: 100, available: 100, price: 'TSH 750.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 10, name: '1L Kilimanjaro Water', category: 'LIQUID', locations: 'All locations', stock: -38, available: -38, price: 'TSH 1,000.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 11, name: '21ST - JOINT SUPPORT 30\'S ( UK - MMS - G', category: 'TABLETS', locations: 'All locations', stock: 0, available: 0, price: 'TSH 23,500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 12, name: '21ST - PreNATAL (USA) 30\'S', category: 'TABLETS', locations: 'All locations', stock: -1, available: -1, price: 'TSH 19,500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 13, name: '21ST- FISH OIL ( USA - OMEGA3,6,9 - 1000', category: 'CAPSULES', locations: 'All locations', stock: 0, available: 0, price: 'TSH 23,500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 14, name: '21ST- LUTEIN ( UK - EYE SUPPORT) 30\'S', category: 'TABLETS', locations: 'All locations', stock: 0, available: 0, price: 'TSH 20,000.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 15, name: '21ST- OSTEO SUPPORT TAS 30\'S (US - CAL', category: 'TABLETS', locations: 'All locations', stock: 0, available: 0, price: 'TSH 19,500.00/ea', image: 'https://via.placeholder.com/40' },
  ];

  // Load items
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setItems(mockItems);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter items based on search query and filters
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesLocation = activeLocation === 'All' || item.locations.includes(activeLocation);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Handle checkbox selection
  const handleCheckboxChange = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Handle select all checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(filteredItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Handle item click to view details
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  // Handle add new item
  const handleAddItem = () => {
    setShowAddItemModal(true);
  };

  // Loading view
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinner} />
        <p>Loading items...</p>
      </div>
    );
  }

  // Render item detail view if an item is selected
  if (selectedItem) {
    return (
      <div className={styles.itemDetailContainer}>
        <button 
          className={styles.backButton}
          onClick={() => setSelectedItem(null)}
        >
          Back to Items
        </button>
        
        <div className={styles.itemDetailHeader}>
          <h2>{selectedItem.name}</h2>
          <div className={styles.itemActions}>
            <button className={styles.editButton}>Edit</button>
            <button className={styles.deleteButton}>Delete</button>
          </div>
        </div>
        
        <div className={styles.itemDetailContent}>
          <div className={styles.itemImageContainer}>
            <img 
              src={selectedItem.image} 
              alt={selectedItem.name} 
              className={styles.itemDetailImage}
            />
            <button className={styles.changeImageButton}>Change Image</button>
          </div>
          
          <div className={styles.itemDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Category:</span>
              <span className={styles.detailValue}>{selectedItem.category}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Locations:</span>
              <span className={styles.detailValue}>{selectedItem.locations}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Stock:</span>
              <span className={styles.detailValue}>{selectedItem.stock}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Available:</span>
              <span className={styles.detailValue}>{selectedItem.available}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Price:</span>
              <span className={styles.detailValue}>{selectedItem.price.replace('$', 'TSH ')}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.itemDetailFooter}>
          <button className={styles.addToStoreButton}>Add to Store</button>
        </div>
      </div>
    );
  }

  // Render add item modal
  const renderAddItemModal = () => {
    if (!showAddItemModal) return null;
    
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.addItemModal}>
          <div className={styles.modalHeader}>
            <h2>Add New Item</h2>
            <button 
              className={styles.closeButton}
              onClick={() => setShowAddItemModal(false)}
            >
              &times;
            </button>
          </div>
          
          <div className={styles.modalContent}>
            <div className={styles.formGroup}>
              <label htmlFor="itemName">Item Name</label>
              <input type="text" id="itemName" placeholder="Enter item name" />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="itemCategory">Category</label>
              <select id="itemCategory">
                <option value="">Select category</option>
                <option value="SYRINGES">SYRINGES</option>
                <option value="SURGICALS">SURGICALS</option>
                <option value="LIQUID">LIQUID</option>
                <option value="TABLETS">TABLETS</option>
                <option value="CAPSULES">CAPSULES</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="itemLocation">Location</label>
              <select id="itemLocation">
                <option value="All locations">All locations</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="itemStock">Initial Stock</label>
              <input type="number" id="itemStock" placeholder="0" />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="itemPrice">Price</label>
              <input type="text" id="itemPrice" placeholder="TSH 0.00" />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="itemImage">Image</label>
              <div className={styles.imageUpload}>
                <button className={styles.uploadButton}>Upload Image</button>
                <span>No file selected</span>
              </div>
            </div>
          </div>
          
          <div className={styles.modalFooter}>
            <button 
              className={styles.cancelButton}
              onClick={() => setShowAddItemModal(false)}
            >
              Cancel
            </button>
            <button className={styles.saveButton}>Save Item</button>
          </div>
        </div>
      </div>
    );
  };

  // Main item library view
  return (
    <div className={styles.itemLibraryContainer}>
      {/* Header with search and filters */}
      <div className={styles.itemLibraryHeader}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterContainer}>
          <div className={styles.filterDropdown}>
            <span>Category</span>
            <select 
              value={activeCategory} 
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              <option value="All">All</option>
              <option value="SYRINGES">SYRINGES</option>
              <option value="SURGICALS">SURGICALS</option>
              <option value="LIQUID">LIQUID</option>
              <option value="TABLETS">TABLETS</option>
              <option value="CAPSULES">CAPSULES</option>
            </select>
          </div>
          
          <div className={styles.filterDropdown}>
            <span>Locations</span>
            <select 
              value={activeLocation} 
              onChange={(e) => setActiveLocation(e.target.value)}
            >
              <option value="All">All</option>
            </select>
          </div>
          
          <div className={styles.filterDropdown}>
            <span>Status</span>
            <select 
              value={activeStatus} 
              onChange={(e) => setActiveStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          
          <div className={styles.filterToggle}>
            <button onClick={() => setShowFilters(!showFilters)}>
              <span>All filters</span>
              <FaChevronDown />
            </button>
          </div>
        </div>
        
        <div className={styles.actionsContainer}>
          <button 
            className={styles.actionButton}
            onClick={handleAddItem}
          >
            <span>Create item</span>
          </button>
        </div>
      </div>
      
      {/* Bar Chart */}
      <div className={styles.barChartContainer}>
        <div className={styles.barChart}>
          {[
            { color: '#87CEEB', value: 5, amount: 'TZS 5,000.00' },
            { color: '#DDA0DD', value: 10, amount: 'TZS 10,000.00' },
            { color: '#FFA07A', value: 15, amount: 'TZS 15,000.00' },
            { color: '#90EE90', value: 25, amount: 'TZS 25,000.00' },
            { color: '#FFD700', value: 35, amount: 'TZS 35,000.00' },
            { color: '#F2F2F2', value: 50, amount: 'TZS 50,000.00' },
            { color: '#E5EFFE', value: 65, amount: 'TZS 65,000.00' },
            { color: '#B3D4FF', value: 80, amount: 'TZS 80,000.00' },
            { color: '#80B3FF', value: 95, amount: 'TZS 95,000.00' },
            { color: '#4D91FF', value: 100, amount: 'TZS 100,000.00' },
          ].map((item, index) => (
            <div 
              key={index}
              className={styles.barChartBar} 
              style={{ 
                height: `${item.value}%`,
                backgroundColor: item.color,
                marginLeft: index > 0 ? '15px' : '0'
              }}
            >
              <span className={styles.barChartValue}>{item.amount}</span>
            </div>
          ))}
        </div>
        <div className={styles.barChartAxis}>
          <span>Lowest</span>
          <span>Highest</span>
        </div>
      </div>
      
      {/* Item table */}
      <div className={styles.tableContainer}>
        <table className={styles.itemTable}>
          <thead>
            <tr>
              <th className={styles.checkboxColumn}>
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll} 
                  checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                />
              </th>
              <th className={styles.itemColumn}>Item</th>
              <th>Reporting category</th>
              <th>Locations</th>
              <th>Stock on hand</th>
              <th>Available to sell</th>
              <th>Price</th>
              <th className={styles.actionsColumn}></th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.slice(0, 2).map(item => (
              <tr 
                key={item.id} 
                className={selectedItems.includes(item.id) ? styles.selectedRow : ''}
                onClick={() => handleItemClick(item)}
              >
                <td className={styles.checkboxColumn} onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                </td>
                <td className={styles.itemColumn}>
                  <div className={styles.itemInfo}>
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                    <span className={styles.itemName}>{item.name}</span>
                  </div>
                </td>
                <td>{item.category}</td>
                <td>{item.locations}</td>
                <td className={item.stock < 0 ? styles.negativeStock : ''}>
                  {item.stock}
                </td>
                <td className={item.available < 0 ? styles.negativeStock : styles.availableStock}>
                  {item.available}
                </td>
                <td>{item.price}</td>
                <td>
                  <button className={styles.moreButton}>
                    <FaEllipsisH />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {renderAddItemModal()}
    </div>
  );
};

export default ItemLibrary;
