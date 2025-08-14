 import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiMenuUnfoldFill } from "react-icons/ri";
import { RxDoubleArrowLeft } from 'react-icons/rx';
import { IoIosAddCircleOutline } from "react-icons/io";
import { 
  FaSearch, 
  FaEllipsisH, 
  FaPlus, 
  FaChevronDown,
  FaSpinner,
  FaCaretDown
} from 'react-icons/fa';
import { IoCloseSharp, IoChevronBack } from 'react-icons/io5';
import { MdArrowForwardIos } from 'react-icons/md';
import ItemWizard from './ItemWizard';
import styles from './ItemLibrary.module.css';

const ItemLibrary = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  // Generic sub-panel state
  const [activeSubPanel, setActiveSubPanel] = useState(null); // 'category' | 'channel' | 'custom' | 'inventory' | 'itemType' | 'location' | 'visibility' | 'salePrice' | 'status' | 'stockQty' | 'alcohol'
  // Category
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  // Status
  const [tempStatus, setTempStatus] = useState(['Active']);
  // Stock quantity
  const [stockComparator, setStockComparator] = useState('Less than');
  const [showComparatorMenu, setShowComparatorMenu] = useState(false);
  const [stockAmount, setStockAmount] = useState('');
  // Inventory
  const [inventoryFilter, setInventoryFilter] = useState('All inventory'); // All inventory | In stock | Out of stock
  // Item type
  const [itemTypeTemp, setItemTypeTemp] = useState([]); // e.g., ['Physical','Digital','Service']
  const [itemTypeSummary, setItemTypeSummary] = useState('Any');
  // Online visibility
  const [visibilityTemp, setVisibilityTemp] = useState('Any'); // Any | Visible | Hidden
  const [visibilitySummary, setVisibilitySummary] = useState('Any');
  // Sale price
  const [saleComparator, setSaleComparator] = useState('Less than');
  const [saleAmount, setSaleAmount] = useState('');
  const [showSaleMenu, setShowSaleMenu] = useState(false);
  const [saleSummary, setSaleSummary] = useState('Any');
  // Alcohol
  const [alcoholTemp, setAlcoholTemp] = useState('Any'); // Any | Yes | No
  const [alcoholSummary, setAlcoholSummary] = useState('Any');
  const [activeLocation, setActiveLocation] = useState('All');  
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState(['All locations']);
  const locationDropdownRef = useRef(null);
  // Status dropdown state and ref
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef(null);
  // Actions dropdown state
  const [showActionsDropdown, setShowActionsDropdown] = useState(null); // stores item id
  const actionsDropdownRef = useRef(null);
  // Column toggle state
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const columnToggleRef = useRef(null);
  const [visibleColumns, setVisibleColumns] = useState({
    itemImage: true,
    gtin: true,
    sku: true,
    reportingCategory: true,
    locations: true,
    stockOnHand: true,
    availableToSell: true,
    price: false,
    weight: false,
    ageRestriction: false,
    unitCost: false,
    defaultVendor: false,
    vendorCode: false
  });
  const [activeStatus, setActiveStatus] = useState('Active');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddItemWizard, setShowAddItemWizard] = useState(false);
  const [duplicateItemData, setDuplicateItemData] = useState(null);
  const [editItemData, setEditItemData] = useState(null);

  // Mock data for demonstration
  const locations = [
    { id: 1, name: 'All locations', count: 2 },
    { id: 2, name: 'HILL CARE', count: 0 },
    { id: 3, name: 'STADIUM PHARMACY', count: 0 },
  ];
  
  const mockItems = [
    { 
      id: 1, 
      uniqueId: 'RSUGLT6QVJHPQHKI6MWTZVIV', 
      name: '10CC - SYRINGE ( NEOJECT ) 10MLS 100\'S', 
      category: 'SYRINGES', 
      reportingCategory: 'SYRINGES',
      locations: 'All locations', 
      stock: 44, 
      available: 44, 
      price: 500.00, 
      image: 'https://via.placeholder.com/40',
      sku: 'SYR-10CC-NEO-001',
      visible: true,
      taxable: true,
      status: 'Active',
      lowStockThreshold: 10
    },
    { 
      id: 2, 
      uniqueId: 'BKJHG7TYUI9OPLMNBVCXZAQW', 
      name: '10CC SYRINGE ( SURGIMED )', 
      category: 'SYRINGES', 
      reportingCategory: 'SYRINGES',
      locations: 'All locations', 
      stock: -1, 
      available: -1, 
      price: 500.00, 
      image: 'https://via.placeholder.com/40',
      sku: 'SYR-10CC-SUR-002',
      visible: true,
      taxable: true,
      status: 'Active',
      lowStockThreshold: 5
    },
    { 
      id: 3, 
      uniqueId: 'MNBVCXZLKJHGFDSAPOIUYTRE', 
      name: '10CM GAUZE W . O . W ( GENSAFE - BANDA)', 
      category: 'SURGICALS', 
      reportingCategory: 'SURGICALS',
      locations: 'All locations', 
      stock: 0, 
      available: 0, 
      price: 500.00, 
      image: 'https://via.placeholder.com/40',
      sku: 'GAU-10CM-GEN-003',
      visible: true,
      taxable: true,
      status: 'Active',
      lowStockThreshold: 15
    },
    { 
      id: 4, 
      uniqueId: 'QWERTYUIOPASDFGHJKLZXCVB', 
      name: '10CM SPANDEX CREPE (SPANDEX - NEOSP', 
      category: 'SURGICALS', 
      reportingCategory: 'SURGICALS',
      locations: 'All locations', 
      stock: 13, 
      available: 13, 
      price: 2500.00, 
      image: 'https://via.placeholder.com/40',
      sku: 'CRE-10CM-NEO-004',
      visible: true,
      taxable: false,
      status: 'Active',
      lowStockThreshold: 8
    },
    { 
      id: 5, 
      uniqueId: 'ZXCVBNMASDFGHJKLQWERTYUI', 
      name: '10CM - CREPE BAND 10CM (NEOSPORT) 1', 
      category: 'SURGICALS', 
      reportingCategory: 'SURGICALS',
      locations: 'All locations', 
      stock: 5, 
      available: 5, 
      price: 2500.00, 
      image: 'https://via.placeholder.com/40',
      sku: 'CRE-10CM-NEO-005',
      visible: false,
      taxable: true,
      status: 'Active',
      lowStockThreshold: 12
    },
    { 
      id: 6, 
      uniqueId: 'POIUYTREWQLKJHGFDSAMNBVC', 
      name: '15CM GAUZE W . O . W ( GENSAFE - BANDA', 
      category: 'SURGICALS', 
      reportingCategory: 'SURGICALS',
      locations: 'All locations', 
      stock: 18, 
      available: 18, 
      price: 600.00, 
      image: 'https://via.placeholder.com/40',
      sku: 'GAU-15CM-GEN-006',
      visible: true,
      taxable: true,
      status: 'Active',
      lowStockThreshold: 20
    },
    { 
      id: 7, 
      uniqueId: 'LKJHGFDSAPOIUYTREWQMNBVC', 
      name: '15CM SPANDEX CREPE (SPANDEX - NEOSP', 
      category: 'SURGICALS', 
      reportingCategory: 'SURGICALS',
      locations: 'All locations', 
      stock: -1, 
      available: -1, 
      price: 3500.00, 
      image: 'https://via.placeholder.com/40',
      sku: 'CRE-15CM-NEO-007',
      visible: true,
      taxable: false,
      status: 'Active',
      lowStockThreshold: 6
    },
    { 
      id: 8, 
      uniqueId: 'ASDFGHJKLZXCVBNMQWERTYUI', 
      name: '15CM - CREPE BAND 15CM (NEOSPORT) 1', 
      category: 'SURGICALS', 
      reportingCategory: 'SURGICALS',
      locations: 'All locations', 
      stock: 6, 
      available: 6, 
      price: 3500.00, 
      image: 'https://via.placeholder.com/40',
      sku: 'CRE-15CM-NEO-008',
      visible: true,
      taxable: true,
      status: 'Active',
      lowStockThreshold: 10
    },
    { 
      id: 9, 
      uniqueId: 'HJKLZXCVBNMQWERTYUIOPASDF', 
      name: '1CC SYRINGE INSULIN ( NEOJET - YELLOW', 
      category: 'SYRINGES', 
      reportingCategory: 'SYRINGES',
      locations: 'All locations', 
      stock: 100, 
      available: 100, 
      price: 750.00, 
      image: 'https://via.placeholder.com/40',
      sku: 'SYR-1CC-NEO-009',
      visible: true,
      taxable: true,
      status: 'Active',
      lowStockThreshold: 25
    },
    { 
      id: 10, 
      uniqueId: 'XCVBNMQWERTYUIOPASDFGHJKL', 
      name: '1L Kilimanjaro Water', 
      category: 'LIQUID', 
      reportingCategory: 'LIQUID',
      locations: 'All locations', 
      stock: -38, 
      available: -38, 
      price: 1000.00, 
      image: 'https://via.placeholder.com/40',
      sku: 'WAT-1L-KIL-010',
      visible: true,
      taxable: false,
      status: 'Active',
      lowStockThreshold: 50
    },
    { 
      id: 11, 
      uniqueId: 'QWERTYUIOPASDFGHJKLZXCVBN', 
      name: '21ST - JOINT SUPPORT 30\'S ( UK - MMS - G', 
      category: 'TABLETS', 
      reportingCategory: 'TABLETS',
      locations: 'All locations', 
      stock: 0, 
      available: 0, 
      price: 23500.00, 
      image: 'https://via.placeholder.com/40',
      sku: 'TAB-21ST-JOI-011',
      visible: false,
      taxable: true,
      status: 'Active',
      lowStockThreshold: 5
    },
    { 
      id: 12, 
      uniqueId: 'TYUIOPASDFGHJKLZXCVBNMQWE', 
      name: '21ST - PreNATAL (USA) 30\'S', 
      category: 'TABLETS', 
      reportingCategory: 'TABLETS',
      locations: 'All locations', 
      stock: -1, 
      available: -1, 
      price: 19500.00, 
      image: 'https://via.placeholder.com/40',
      sku: 'TAB-21ST-PRE-012',
      visible: true,
      taxable: true,
      status: 'Active',
      lowStockThreshold: 3
    },
    { 
      id: 13, 
      uniqueId: 'OPASDFGHJKLZXCVBNMQWERTY', 
      name: '21ST- FISH OIL ( USA - OMEGA3,6,9 - 1000', 
      category: 'CAPSULES', 
      reportingCategory: 'CAPSULES',
      locations: 'All locations', 
      stock: 0, 
      available: 0, 
      price: 23500.00, 
      image: 'https://via.placeholder.com/40',
      sku: 'CAP-21ST-FIS-013',
      visible: true,
      taxable: false,
      status: 'Active',
      lowStockThreshold: 4
    },
    { 
      id: 14, 
      uniqueId: 'DFGHJKLZXCVBNMQWERTYUIOP', 
      name: '21ST- LUTEIN ( UK - EYE SUPPORT) 30\'S', 
      category: 'TABLETS', 
      reportingCategory: 'TABLETS',
      locations: 'All locations', 
      stock: 0, 
      available: 0, 
      price: 20000.00, 
      image: 'https://via.placeholder.com/40',
      sku: 'TAB-21ST-LUT-014',
      visible: true,
      taxable: true,
      status: 'Active',
      lowStockThreshold: 6
    },
    { 
      id: 15, 
      uniqueId: 'HJKLZXCVBNMQWERTYUIOPASDF', 
      name: '21ST- OSTEO SUPPORT TAS 30\'S (US - CAL', 
      category: 'TABLETS', 
      reportingCategory: 'TABLETS',
      locations: 'All locations', 
      stock: 0, 
      available: 0, 
      price: 19500.00, 
      image: 'https://via.placeholder.com/40',
      sku: 'TAB-21ST-OST-015',
      visible: true,
      taxable: true,
      status: 'Active',
      lowStockThreshold: 7
    },
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

  // Handle location search
  const handleLocationSearch = (e) => {
    setLocationSearchQuery(e.target.value);
  };

  // Handle location selection with improved dropdown persistence
  const handleLocationSelect = (locationName, event) => {
    // Prevent any event bubbling that might close the dropdown
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (locationName === 'All locations') {
      const allLocationNames = locations.map(loc => loc.name);
      const allIndividualLocations = locations.filter(loc => loc.name !== 'All locations').map(loc => loc.name);
      
      // Check if all individual locations are currently selected
      const allIndividualSelected = allIndividualLocations.every(loc => selectedLocations.includes(loc));
      
      if (allIndividualSelected) {
        // If all are selected, deselect all
        setSelectedLocations([]);
        setActiveLocation('None');
      } else {
        // Otherwise select all locations
        setSelectedLocations(allLocationNames);
        setActiveLocation('All');
      }
    } else {
      setSelectedLocations(prev => {
        // If location is already selected, remove it
        if (prev.includes(locationName)) {
          const newLocations = prev.filter(loc => loc !== locationName && loc !== 'All locations');
          // If no locations left, set activeLocation to 'None'
          if (newLocations.length === 0) {
            setActiveLocation('None');
          } else {
            setActiveLocation(newLocations.length === 1 ? newLocations[0] : 'Multiple');
          }
          return newLocations;
        } else {
          // Add the location
          const newLocations = [...prev.filter(loc => loc !== 'All locations'), locationName];
          
          // Check if all individual locations are now selected
          const allIndividualLocations = locations.filter(loc => loc.name !== 'All locations').map(loc => loc.name);
          const allSelected = allIndividualLocations.every(loc => 
            newLocations.includes(loc) || loc === locationName
          );
          
          // If all individual locations are selected, also select 'All locations'
          if (allSelected) {
            newLocations.push('All locations');
          }
          
          setActiveLocation(newLocations.length === 1 ? newLocations[0] : 'Multiple');
          return newLocations;
        }
      });
    }
    
    // Ensure dropdown stays open
    setShowLocationDropdown(true);
  };
  
  // Simple toggle for location dropdown
  const toggleLocationDropdown = (e) => {
    setShowLocationDropdown(prev => !prev);
  };

  // Close dropdowns only when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Location dropdown
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target)
      ) {
        setShowLocationDropdown(false);
      }
      // Status dropdown
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setShowStatusDropdown(false);
      }
      // Actions dropdown
      if (
        actionsDropdownRef.current &&
        !actionsDropdownRef.current.contains(event.target)
      ) {
        setShowActionsDropdown(null);
      }
      // Column toggle dropdown
      if (
        columnToggleRef.current &&
        !columnToggleRef.current.contains(event.target)
      ) {
        setShowColumnToggle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter items based on search query and filters
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    
    // Handle location filtering based on selected locations
    let matchesLocation = false;
    if (activeLocation === 'All') {
      matchesLocation = true;
    } else if (activeLocation === 'Multiple') {
      // Check if item has any of the selected locations
      matchesLocation = selectedLocations.some(loc => 
        loc !== 'All locations' && item.locations.includes(loc)
      );
    } else {
      matchesLocation = item.locations.includes(activeLocation);
    }
    
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

  // Handle item click to navigate to detail page
  const handleItemClick = (item) => {
    navigate(`/admin/dashboard/items/library/v1/${item.uniqueId}/`, {
      state: { item },
    });
  };

  // Handle add new item
  const handleAddItem = () => {
    setShowAddItemWizard(true);
  };
  
  // Handle actions dropdown toggle
  const handleActionsToggle = (itemId, event) => {
    event.stopPropagation();
    setShowActionsDropdown(showActionsDropdown === itemId ? null : itemId);
  };
  
  // Handle column toggle
  const handleColumnToggle = (event) => {
    event.stopPropagation();
    setShowColumnToggle(!showColumnToggle);
  };
  
  // Handle column visibility change
  const handleColumnVisibilityChange = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };
  
  // Get visible columns limited to 9
  const getVisibleDataColumns = () => {
    const allColumns = [
      { key: 'gtin', label: 'GTIN', field: 'gtin' },
      { key: 'sku', label: 'SKU', field: 'sku' },
      { key: 'reportingCategory', label: 'Reporting category', field: 'category' },
      { key: 'locations', label: 'Locations', field: 'locations' },
      { key: 'stockOnHand', label: 'Stock on hand', field: 'stock' },
      { key: 'availableToSell', label: 'Available to sell', field: 'available' },
      { key: 'price', label: 'Price', field: 'price' },
      { key: 'weight', label: 'Weight', field: 'weight' },
      { key: 'ageRestriction', label: 'Age restriction', field: 'ageRestriction' },
      { key: 'unitCost', label: 'Unit cost', field: 'unitCost' },
      { key: 'defaultVendor', label: 'Default vendor', field: 'defaultVendor' },
      { key: 'vendorCode', label: 'Vendor code', field: 'vendorCode' }
    ];
    
    return allColumns.filter(col => visibleColumns[col.key]).slice(0, 9);
  };
  
  // Handle action selection
  const handleActionSelect = (action, itemId) => {
    console.log(`Action: ${action} for item: ${itemId}`);
    setShowActionsDropdown(null);
    
    const item = items.find(item => item.id === itemId);
    if (!item) return;
    
    switch (action) {
      case 'edit':
        handleEditItem(item);
        break;
      case 'duplicate':
        handleDuplicateItem(item);
        break;
      case 'updateSalesChannels':
        handleUpdateSalesChannels(item);
        break;
      case 'updateSiteVisibility':
        handleUpdateSiteVisibility(item);
        break;
      case 'updateOnlineSalePrice':
        handleUpdateOnlineSalePrice(item);
        break;
      case 'updateCategories':
        handleUpdateCategories(item);
        break;
      case 'updateFulfillmentMethods':
        handleUpdateFulfillmentMethods(item);
        break;
      case 'setAsNonTaxable':
        handleSetAsNonTaxable(item);
        break;
      case 'archive':
        handleArchiveItem(item);
        break;
      case 'updateLowStockAlert':
        handleUpdateLowStockAlert(item);
        break;
      case 'delete':
        handleDeleteItem(item);
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  };

  // Handle saving items from the wizard
  const handleSaveItem = (newItem) => {
    if (duplicateItemData) {
      // Adding a new duplicated item
      setItems(prevItems => [...prevItems, newItem]);
      console.log('Duplicated item added:', newItem.name);
    } else if (editItemData) {
      // Updating an existing item
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === editItemData.id ? newItem : item
        )
      );
      console.log('Item updated:', newItem.name);
    } else {
      // Adding a completely new item
      setItems(prevItems => [...prevItems, newItem]);
      console.log('New item added:', newItem.name);
    }
  };

  // Individual action handlers
  const handleEditItem = (item) => {
    // Set the item data for editing and open the wizard
    setEditItemData(item);
    setShowAddItemWizard(true);
    console.log('Editing item:', item.name);
  };

  const handleDuplicateItem = (item) => {
    // Generate smart numbering for duplicate names
    const generateDuplicateName = (originalName) => {
      const existingNames = items.map(item => item.name);
      let counter = 1;
      let newName = `${originalName} (${counter})`;
      
      // Keep incrementing counter until we find a unique name
      while (existingNames.includes(newName)) {
        counter++;
        newName = `${originalName} (${counter})`;
      }
      
      return newName;
    };

    // Generate smart SKU numbering
    const generateDuplicateSKU = (originalSKU) => {
      const existingSKUs = items.map(item => item.sku);
      let counter = 1;
      let newSKU = `${originalSKU}-${counter}`;
      
      // Keep incrementing counter until we find a unique SKU
      while (existingSKUs.includes(newSKU)) {
        counter++;
        newSKU = `${originalSKU}-${counter}`;
      }
      
      return newSKU;
    };

    const duplicatedItem = {
      ...item,
      id: Date.now(), // Generate new ID
      uniqueId: `DUP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: generateDuplicateName(item.name),
      sku: generateDuplicateSKU(item.sku),
      status: 'Draft' // Set as draft for new duplicated items
    };
    
    // Set the duplicate item data and open the wizard
    setDuplicateItemData(duplicatedItem);
    setShowAddItemWizard(true);
  };

  const handleUpdateSalesChannels = (item) => {
    // This would typically open a modal to manage sales channels
    const channels = prompt(
      `Update sales channels for "${item.name}"\nCurrent: Online, In-store\nEnter new channels (comma-separated):`,
      'Online, In-store'
    );
    
    if (channels !== null) {
      // Update item with new sales channels
      setItems(prevItems => 
        prevItems.map(i => 
          i.id === item.id 
            ? { ...i, salesChannels: channels.split(',').map(c => c.trim()) }
            : i
        )
      );
      alert(`Sales channels updated for "${item.name}"`);
    }
  };

  const handleUpdateSiteVisibility = (item) => {
    const visibility = confirm(
      `Current visibility for "${item.name}": ${item.visible ? 'Visible' : 'Hidden'}\n\nClick OK to make it ${item.visible ? 'Hidden' : 'Visible'}, or Cancel to keep current setting.`
    );
    
    if (visibility !== null) {
      setItems(prevItems => 
        prevItems.map(i => 
          i.id === item.id 
            ? { ...i, visible: !item.visible }
            : i
        )
      );
      alert(`Site visibility updated for "${item.name}"`);
    }
  };

  const handleUpdateOnlineSalePrice = (item) => {
    const newPrice = prompt(
      `Update online sale price for "${item.name}"\nCurrent price: $${item.price}`,
      item.price.toString()
    );
    
    if (newPrice !== null && !isNaN(parseFloat(newPrice))) {
      setItems(prevItems => 
        prevItems.map(i => 
          i.id === item.id 
            ? { ...i, price: parseFloat(newPrice) }
            : i
        )
      );
      alert(`Price updated for "${item.name}" to $${newPrice}`);
    }
  };

  const handleUpdateCategories = (item) => {
    const categories = prompt(
      `Update categories for "${item.name}"\nCurrent: ${item.category}\nEnter new categories (comma-separated):`,
      item.category
    );
    
    if (categories !== null) {
      setItems(prevItems => 
        prevItems.map(i => 
          i.id === item.id 
            ? { ...i, category: categories, reportingCategory: categories.split(',')[0]?.trim() }
            : i
        )
      );
      alert(`Categories updated for "${item.name}"`);
    }
  };

  const handleUpdateFulfillmentMethods = (item) => {
    const methods = prompt(
      `Update fulfillment methods for "${item.name}"\nCurrent: Pickup, Delivery\nEnter new methods (comma-separated):`,
      'Pickup, Delivery'
    );
    
    if (methods !== null) {
      // Update item with new fulfillment methods
      setItems(prevItems => 
        prevItems.map(i => 
          i.id === item.id 
            ? { ...i, fulfillmentMethods: methods.split(',').map(m => m.trim()) }
            : i
        )
      );
      alert(`Fulfillment methods updated for "${item.name}"`);
    }
  };

  const handleSetAsNonTaxable = (item) => {
    const confirm = window.confirm(
      `Set "${item.name}" as ${item.taxable ? 'non-taxable' : 'taxable'}?`
    );
    
    if (confirm) {
      setItems(prevItems => 
        prevItems.map(i => 
          i.id === item.id 
            ? { ...i, taxable: !item.taxable }
            : i
        )
      );
      alert(`"${item.name}" is now ${item.taxable ? 'non-taxable' : 'taxable'}`);
    }
  };

  const handleArchiveItem = (item) => {
    const confirm = window.confirm(
      `Are you sure you want to archive "${item.name}"?\n\nArchived items will be hidden from the main view but can be restored later.`
    );
    
    if (confirm) {
      setItems(prevItems => 
        prevItems.map(i => 
          i.id === item.id 
            ? { ...i, archived: true, status: 'Archived' }
            : i
        )
      );
      alert(`"${item.name}" has been archived successfully!`);
    }
  };

  const handleUpdateLowStockAlert = (item) => {
    const threshold = prompt(
      `Set low stock alert threshold for "${item.name}"\nCurrent threshold: ${item.lowStockThreshold || 'Not set'}\nEnter new threshold:`,
      (item.lowStockThreshold || 5).toString()
    );
    
    if (threshold !== null && !isNaN(parseInt(threshold))) {
      setItems(prevItems => 
        prevItems.map(i => 
          i.id === item.id 
            ? { ...i, lowStockThreshold: parseInt(threshold) }
            : i
        )
      );
      alert(`Low stock alert threshold set to ${threshold} for "${item.name}"`);
    }
  };

  const handleDeleteItem = (item) => {
    const confirm = window.confirm(
      `⚠️ WARNING: This action cannot be undone!\n\nAre you sure you want to permanently delete "${item.name}"?\n\nThis will remove all associated data including:\n• Product information\n• Inventory records\n• Sales history\n• Images and documents`
    );
    
    if (confirm) {
      const secondConfirm = window.confirm(
        `Final confirmation required!\n\nType the item name to confirm deletion: "${item.name}"\n\nClick OK only if you're absolutely sure.`
      );
      
      if (secondConfirm) {
        setItems(prevItems => prevItems.filter(i => i.id !== item.id));
        alert(`"${item.name}" has been permanently deleted.`);
      }
    }
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





  // Main item library view
  return (
    <div className={styles.itemLibraryContainer}>
      {/* Header with search and filters */}
      <div className={styles.itemLibraryHeader}>
        <div className={styles.searchContainer}>
          <div className={styles.searchIconContainer}>
            <FaSearch className={styles.searchIcon} />
          </div>
          <div className={styles.searchInputContainer}>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>
          {searchQuery && (
            <button className={styles.clearSearch} onClick={() => setSearchQuery('')}>
              &times;
            </button>
          )}
        </div>
        
        <div className={styles.filterContainer}>
          <div
            className={styles.filterDropdown}
            onClick={() => {
              setShowFilters(true);
              setActiveSubPanel('category');
            }}
          >
            <span className={styles.filterLabel}>Category</span>
            <span className={styles.filterValue}>{activeCategory}</span>
          </div>
          
          <div className={styles.filterDropdown} onClick={toggleLocationDropdown} ref={locationDropdownRef}>
            <span className={styles.filterLabel}>Locations</span>
            <span className={styles.filterValue}>{activeLocation}</span>
            
            {showLocationDropdown && (
              <div className={styles.customDropdown}>
                <div 
                  className={styles.dropdownSearchContainer}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.leadingAccessory}>
                    <FaSearch style={{ color: 'rgba(0, 0, 0, 0.4)', fontSize: '14px' }} />
                  </div>
                  <div className={styles.inputContainer}>
                    <input
                      type="text"
                      placeholder="Filter Locations"
                      className={styles.dropdownSearchInput}
                      value={locationSearchQuery}
                      onChange={handleLocationSearch}
                    />
                  </div>
                  {locationSearchQuery && (
                    <div className={styles.trailingAccessory}>
                      <button 
                        className={styles.clearSearch}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocationSearchQuery('');
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>
                
                <div className={styles.locationsList}>
                  {/* List Body - Contains all location items */}
                  <div className={styles.listBody}>
                    {/* All locations item - always first */}
                    {locations
                      .filter(location => location.name === 'All locations')
                      .filter(location => location.name.toLowerCase().includes(locationSearchQuery.toLowerCase()))
                      .map(location => {
                        const isAllLocations = true;
                        const isSelected = selectedLocations.includes(location.name);
                        const allIndividualLocationsSelected = 
                          locations.filter(loc => loc.name !== 'All locations')
                                .every(loc => selectedLocations.includes(loc.name));
                        
                        // Determine checkbox state for All locations
                        let checkboxElement;
                        if (selectedLocations.length > 0 && selectedLocations.length < locations.length - 1) {
                          // Partial selection
                          checkboxElement = (
                            <div className={styles.marketCheckboxPartialSelected}>
                              <div className={styles.partialCheck}></div>
                            </div>
                          );
                        } else {
                          // Full selection or no selection
                          checkboxElement = (
                            <input 
                              type="checkbox" 
                              id={`location-${location.id}`}
                              checked={isSelected}
                              onChange={() => {}} // Handled by parent div click
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleLocationSelect(location.name, e);
                              }}
                              className={styles.marketCheckboxInput}
                            />
                          );
                        }
                        
                        return (
                          <div 
                            key={location.id} 
                            className={`${styles.locationItem} ${isSelected ? styles.locationItemSelected : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleLocationSelect(location.name, e);
                            }}
                          >
                            <div className={styles.container}>
                              <div className={styles.main}>
                                <div className={styles.label}>
                                  <span className={styles.locationName}>{location.name}</span>
                                </div>
                              </div>
                              <div className={styles.subtext}>
                                <span className={styles.locationCount}>{location.count}</span>
                              </div>
                              <div className={styles.trailingAccessory}>
                                <div className={styles.control}>
                                  {checkboxElement}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    
                    {/* Individual location items */}
                    {locations
                      .filter(location => location.name !== 'All locations')
                      .filter(location => location.name.toLowerCase().includes(locationSearchQuery.toLowerCase()))
                      .map(location => {
                        const isSelected = selectedLocations.includes(location.name);
                        
                        return (
                          <div 
                            key={location.id} 
                            className={`${styles.locationItem} ${isSelected ? styles.locationItemSelected : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleLocationSelect(location.name, e);
                            }}
                          >
                            <div className={styles.container}>
                              <div className={styles.main}>
                                <div className={styles.label}>
                                  <span className={styles.locationName}>{location.name}</span>
                                </div>
                              </div>
                              <div className={styles.subtext}>
                                <span className={styles.locationCount}>{location.count}</span>
                              </div>
                              <div className={styles.trailingAccessory}>
                                <div className={styles.control}>
                                  <input 
                                    type="checkbox" 
                                    id={`location-${location.id}`}
                                    checked={isSelected}
                                    onChange={() => {}} // Handled by parent div click
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      handleLocationSelect(location.name, e);
                                    }}
                                    className={styles.marketCheckboxInput}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div
            className={styles.filterDropdown}
            onClick={(e) => {
              e.stopPropagation();
              setShowStatusDropdown(prev => !prev);
            }}
            ref={statusDropdownRef}
          >
            <span className={styles.filterLabel}>Status</span>
            <span className={styles.filterValue}>{activeStatus}</span>

            {showStatusDropdown && (
              <div className={styles.customDropdown} onClick={(e) => e.stopPropagation()}>
                <div className={styles.dropdownList}>
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => {
                      // All statuses selected
                      setTempStatus(['Active','Archived']);
                      setActiveStatus('Any');
                      setShowStatusDropdown(false);
                    }}
                  >
                    <span>All statuses</span>
                    <input type="checkbox" readOnly checked={Array.isArray(tempStatus) && tempStatus.length === 2} />
                  </button>

                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => {
                      setTempStatus(['Active']);
                      setActiveStatus('Active');
                      setShowStatusDropdown(false);
                    }}
                  >
                    <span>Active</span>
                    <input type="checkbox" readOnly checked={Array.isArray(tempStatus) && tempStatus.includes('Active')} />
                  </button>

                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => {
                      setTempStatus(['Archived']);
                      setActiveStatus('Archived');
                      setShowStatusDropdown(false);
                    }}
                  >
                    <span>Archived</span>
                    <input type="checkbox" readOnly checked={Array.isArray(tempStatus) && tempStatus.includes('Archived')} />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className={styles.filterToggle}>
            <button onClick={() => setShowFilters(!showFilters)}>
              <RiMenuUnfoldFill style={{fontSize: '16px', marginRight: '4px'}} />
              <span>All filters</span>
            </button>
          </div>
        </div>
        
        <div className={styles.actionsContainer}>
          <button 
            className={styles.actionButton}
            onClick={handleAddItem}
          >
            <FaPlus style={{fontSize: '12px'}} />
            <span>Create item</span>
          </button>
        </div>
      </div>

      
      {/* All Filters slide-in panel and overlay */}
      <div 
        className={`${styles.filtersPanelOverlay} ${showFilters ? styles.open : ''}`}
        onClick={() => setShowFilters(false)}
      />
      <aside className={`${styles.filtersPanel} ${showFilters ? styles.open : ''}`} aria-hidden={!showFilters}>
        <div className={styles.filtersHeader}>
          <div className={styles.filtersHeaderLeft}>
            <button className={styles.filtersCloseBtn} onClick={() => setShowFilters(false)}>
              <IoCloseSharp style={{ fontSize: '24px' }}/>
            </button>
            <span className={styles.filtersTitle}>Filter by</span>
          </div>
          <div className={styles.filtersHeaderRight}>
            <button className={styles.filtersResetBtn} onClick={() => {
              setActiveCategory('All');
              setActiveStatus('Active');
              setSelectedLocations(['All locations']);
            }}>Reset all filters</button>
            <button className={styles.filtersApplyBtn} onClick={() => setShowFilters(false)}>Apply</button>
          </div>
        </div>
        <div className={styles.filtersBody} onClick={(e) => e.stopPropagation()}>
          {/* Rows - replicate visual from reference */}
          <div className={styles.filterRow} onClick={() => setActiveSubPanel('category')}>
            <div className={styles.filterRowLeft}>
              <span className={styles.filterRowLabel}>Category</span>
              <span className={styles.filterRowValue}>{activeCategory === 'All' ? 'Any' : activeCategory}</span>
            </div>
              <div className={styles.filterRowRight}>
                <MdArrowForwardIos size={20} style={{ cursor: 'pointer' }} />
              </div>
          </div>

          <div className={styles.filterRow} onClick={() => setActiveSubPanel('channel')}>
            <div className={styles.filterRowLeft}>
              <span className={styles.filterRowLabel}>Channel assignment</span>
              <span className={styles.filterRowValue}>Any</span>
            </div>
              <div className={styles.filterRowRight}>
                <MdArrowForwardIos size={16} />
              </div>
          </div>

          <div className={styles.filterRow} onClick={() => setActiveSubPanel('custom')}>
            <div className={styles.filterRowLeft}>
              <span className={styles.filterRowLabel}>Custom attribute</span>
              <span className={styles.filterRowValue}>Any</span>
            </div>
              <div className={styles.filterRowRight}>
                <MdArrowForwardIos size={16} />
              </div>
          </div>

          <div className={styles.filterRow} onClick={() => setActiveSubPanel('inventory')}>
            <div className={styles.filterRowLeft}>
              <span className={styles.filterRowLabel}>Inventory</span>
              <span className={styles.filterRowValue}>{inventoryFilter}</span>
            </div>
              <div className={styles.filterRowRight}>
                <MdArrowForwardIos size={16} />
              </div>
          </div>

          <div className={styles.filterRow} onClick={() => setActiveSubPanel('itemType')}>
            <div className={styles.filterRowLeft}>
              <span className={styles.filterRowLabel}>Item type</span>
              <span className={styles.filterRowValue}>{itemTypeSummary}</span>
            </div>
              <div className={styles.filterRowRight}>
                <MdArrowForwardIos size={16} />
              </div>
          </div>

          <div className={styles.filterRow} onClick={() => setActiveSubPanel('location')}>
            <div className={styles.filterRowLeft}>
              <span className={styles.filterRowLabel}>Location</span>
              <span className={styles.filterRowValue}>{
                selectedLocations.includes('All locations') ? 'Any' : selectedLocations.join(', ')
              }</span>
            </div>
              <div className={styles.filterRowRight}>
                <MdArrowForwardIos size={16} />
              </div>
          </div>

          <div className={styles.filterRow} onClick={() => setActiveSubPanel('visibility')}>
            <div className={styles.filterRowLeft}>
              <span className={styles.filterRowLabel}>Online visibility</span>
              <span className={styles.filterRowValue}>{visibilitySummary}</span>
            </div>
              <div className={styles.filterRowRight}>
                <MdArrowForwardIos size={16} />
              </div>
          </div>

          <div className={styles.filterRow} onClick={() => setActiveSubPanel('salePrice')}>
            <div className={styles.filterRowLeft}>
              <span className={styles.filterRowLabel}>Sale price</span>
              <span className={styles.filterRowValue}>{saleSummary}</span>
            </div>
              <div className={styles.filterRowRight}>
                <MdArrowForwardIos size={16} />
              </div>
          </div>

          <div className={styles.filterRow} onClick={() => setActiveSubPanel('status')}>
            <div className={styles.filterRowLeft}>
              <span className={styles.filterRowLabel}>Status</span>
              <span className={styles.filterRowValue}>{activeStatus}</span>
            </div>
              <div className={styles.filterRowRight}>
                <MdArrowForwardIos size={16} />
              </div>
          </div>

          <div className={styles.filterRow} onClick={() => setActiveSubPanel('stockQty')}>
            <div className={styles.filterRowLeft}>
              <span className={styles.filterRowLabel}>Stock quantity</span>
              <span className={styles.filterRowValue}>Any</span>
            </div>
              <div className={styles.filterRowRight}>
                <MdArrowForwardIos size={16} />
              </div>
          </div>

          <div className={styles.filterRow} onClick={() => setActiveSubPanel('alcohol')}>
            <div className={styles.filterRowLeft}>
              <span className={styles.filterRowLabel}>Item contains alcohol</span>
              <span className={styles.filterRowValue}>{alcoholSummary}</span>
            </div>
              <div className={styles.filterRowRight}>
                <MdArrowForwardIos size={16} />
              </div>
          </div>
        </div>
      </aside>

      {/* Generic Sub-Panel */}
      <aside className={`${styles.filtersSubPanel} ${activeSubPanel ? styles.open : ''}`} aria-hidden={!activeSubPanel}>
        <div className={styles.subPanelHeader}>
          <button className={styles.navIconBtn} onClick={() => setActiveSubPanel(null)}>
            <RxDoubleArrowLeft size={24} color="#333" style={{ cursor: 'pointer' }} />
          </button>
          <div className={styles.subHeaderActions}>
            <button className={styles.filtersResetBtn}
              onClick={() => {
                if (activeSubPanel === 'category') { setCategorySearch(''); setSelectedCategories([]); }
                if (activeSubPanel === 'status') { setTempStatus([]); }
                if (activeSubPanel === 'stockQty') { setStockComparator('Less than'); setStockAmount(''); setShowComparatorMenu(false); }
                if (activeSubPanel === 'inventory') { setInventoryFilter('All inventory'); }
                if (activeSubPanel === 'itemType') { setItemTypeTemp([]); }
                if (activeSubPanel === 'visibility') { setVisibilityTemp('Any'); }
                if (activeSubPanel === 'salePrice') { setSaleComparator('Less than'); setSaleAmount(''); setShowSaleMenu(false); }
                if (activeSubPanel === 'alcohol') { setAlcoholTemp('Any'); }
              }}
            >Reset</button>
            <button className={styles.filtersApplyBtn}
              onClick={() => {
                if (activeSubPanel === 'category') {
                  if (selectedCategories.length === 0) setActiveCategory('All');
                  else if (selectedCategories.length === 1) setActiveCategory(selectedCategories[0]);
                  else setActiveCategory('Multiple');
                }
                if (activeSubPanel === 'status') {
                  if (tempStatus.length === 0) setActiveStatus('Any');
                  else if (tempStatus.length === 1) setActiveStatus(tempStatus[0]);
                  else setActiveStatus('Multiple');
                }
                if (activeSubPanel === 'stockQty') {
                  // nothing to persist globally yet besides summary
                }
                if (activeSubPanel === 'inventory') {
                  // inventoryFilter is already bound
                }
                if (activeSubPanel === 'itemType') {
                  if (itemTypeTemp.length === 0) setItemTypeSummary('Any');
                  else if (itemTypeTemp.length === 1) setItemTypeSummary(itemTypeTemp[0]);
                  else setItemTypeSummary('Multiple');
                }
                if (activeSubPanel === 'visibility') {
                  setVisibilitySummary(visibilityTemp);
                }
                if (activeSubPanel === 'salePrice') {
                  if (!saleAmount) setSaleSummary('Any');
                  else setSaleSummary(`${saleComparator} ${saleAmount}`);
                }
                if (activeSubPanel === 'alcohol') {
                  setAlcoholSummary(alcoholTemp);
                }
                setActiveSubPanel(null);
              }}
            >Apply</button>
          </div>
        </div>
        <div className={styles.subPanelBody}>
          {/* Dynamic Title */}
          <div className={styles.subPanelTitleBlock}>
            <div className={styles.subPanelEyebrow}>Filter by</div>
            <div className={styles.subPanelTitle}>
              {activeSubPanel === 'category' && 'Category'}
              {activeSubPanel === 'channel' && 'Channel assignment'}
              {activeSubPanel === 'custom' && 'Custom attribute'}
              {activeSubPanel === 'inventory' && 'Inventory'}
              {activeSubPanel === 'itemType' && 'Item type'}
              {activeSubPanel === 'location' && 'Location'}
              {activeSubPanel === 'visibility' && 'Online visibility'}
              {activeSubPanel === 'salePrice' && 'Sale price'}
              {activeSubPanel === 'status' && 'Status'}
              {activeSubPanel === 'stockQty' && 'Stock quantity'}
              {activeSubPanel === 'alcohol' && 'Item contains alcohol'}
            </div>
          </div>

          {/* Category Content */}
          {activeSubPanel === 'category' && (
            <>
              <div className={styles.searchInputWrap}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search categories"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                />
              </div>
              <div className={styles.categoryList}>
                {(() => {
                  const derived = Array.from(new Set((items || []).map(it => (it.category || '').trim()).filter(Boolean)));
                  const fallback = ['Uncategorized','PLASTA','SUPPOSITORIES','PAMPERS','KIT','POWDER','SURGICALS','LUBRICANTS','NASAL DROPS'];
                  const data = derived.length ? derived : fallback;
                  const filtered = data.filter(c => c.toLowerCase().includes(categorySearch.toLowerCase()));
                  return filtered.map((cat) => {
                    const checked = selectedCategories.includes(cat);
                    return (
                      <label key={cat} className={styles.categoryRow}>
                        <div className={styles.categoryLeft}>
                          <div className={styles.categoryIconPlaceholder} />
                          <div className={styles.categoryTexts}>
                            <div className={styles.categoryName}>{cat}</div>
                            {cat === 'Uncategorized' && (
                              <div className={styles.categorySub}>Items with no categorization</div>
                            )}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setSelectedCategories(prev => prev.includes(cat) ? prev.filter(x => x !== cat) : [...prev, cat]);
                          }}
                        />
                      </label>
                    );
                  });
                })()}
              </div>
            </>
          )}

          {/* Channel assignment Content */}
          {activeSubPanel === 'channel' && (
            <div className={styles.emptyCard}>
              <div className={styles.emptyTitle}>You don’t have any channels</div>
              <div className={styles.emptySub}>To manage channels, go to <a className={styles.link} href="#">Online Sales Channels</a></div>
            </div>
          )}

          {/* Custom attribute Content */}
          {activeSubPanel === 'custom' && (
            <>
              <div className={styles.searchInputWrap}>
                <input type="text" className={styles.searchInput} placeholder="Search" />
              </div>
              <div className={styles.simpleList}>
                <div className={styles.simpleRow}>
                  <div className={styles.simpleRowTexts}>
                    <div className={styles.simpleRowTitle}>Dosage Form (Square)</div>
                    <div className={styles.simpleRowSub}>Any</div>
                  </div>
                  <MdArrowForwardIos size={16} />
                </div>
              </div>
            </>
          )}

          {/* Location Content */}
          {activeSubPanel === 'location' && (
            <>
              <div className={styles.searchInputWrap}>
                <input type="text" className={styles.searchInput} placeholder="Search" value={locationSearchQuery} onChange={handleLocationSearch} />
              </div>
              <div className={styles.locationList}>
                <label className={styles.locationRow}>
                  <span className={styles.locationName}>Select all</span>
                  <input type="checkbox" onChange={(e) => handleLocationSelect('All locations', e)} checked={selectedLocations.includes('All locations')} />
                </label>
                {locations
                  .filter(loc => loc.name.toLowerCase().includes(locationSearchQuery.toLowerCase()))
                  .map(loc => (
                    <label key={loc.id} className={styles.locationRow}>
                      <span className={styles.locationName}>{loc.name}</span>
                      <input type="checkbox" onChange={(e)=> handleLocationSelect(loc.name, e)} checked={selectedLocations.includes(loc.name)} />
                    </label>
                  ))}
              </div>
            </>
          )}

          {/* Status Content */}
          {activeSubPanel === 'status' && (
            <div className={styles.checkList}>
              <label className={styles.checkRow}>
                <span>Select all</span>
                <input type="checkbox" checked={tempStatus.length === 2} onChange={(e)=> setTempStatus(e.target.checked ? ['Active','Archived'] : [])} />
              </label>
              <label className={styles.checkRow}>
                <span>Active</span>
                <input type="checkbox" checked={tempStatus.includes('Active')} onChange={(e)=> setTempStatus(prev => e.target.checked ? Array.from(new Set([...prev,'Active'])) : prev.filter(v=>v!=='Active'))} />
              </label>
              <label className={styles.checkRow}>
                <span>Archived</span>
                <input type="checkbox" checked={tempStatus.includes('Archived')} onChange={(e)=> setTempStatus(prev => e.target.checked ? Array.from(new Set([...prev,'Archived'])) : prev.filter(v=>v!=='Archived'))} />
              </label>
            </div>
          )}

          {/* Stock quantity Content */}
          {activeSubPanel === 'stockQty' && (
            <div className={styles.stockControls}>
              <div className={styles.selectWrap} onClick={() => setShowComparatorMenu(v=>!v)}>
                <span>{stockComparator}</span>
                <FaChevronDown className={styles.selectChevron} />
                {showComparatorMenu && (
                  <div className={styles.selectMenu} onClick={(e)=> e.stopPropagation()}>
                    {['Less than','Greater than','Equal to'].map(opt => (
                      <div key={opt} className={`${styles.selectOption} ${opt===stockComparator ? styles.selected : ''}`} onClick={() => { setStockComparator(opt); setShowComparatorMenu(false); }}>
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input type="number" className={styles.amountInput} placeholder="Amount" value={stockAmount} onChange={(e)=> setStockAmount(e.target.value)} />
            </div>
          )}

          {/* Inventory Content */}
          {activeSubPanel === 'inventory' && (
            <div className={styles.checkList}>
              {['All inventory','In stock','Out of stock'].map(opt => (
                <label key={opt} className={styles.checkRow}>
                  <span>{opt}</span>
                  <input type="radio" name="inv" checked={inventoryFilter===opt} onChange={()=> setInventoryFilter(opt)} />
                </label>
              ))}
            </div>
          )}

          {/* Item type Content */}
          {activeSubPanel === 'itemType' && (
            <div className={styles.checkList}>
              {['Physical','Digital','Service'].map(opt => (
                <label key={opt} className={styles.checkRow}>
                  <span>{opt}</span>
                  <input type="checkbox" checked={itemTypeTemp.includes(opt)} onChange={(e)=> setItemTypeTemp(prev => e.target.checked ? Array.from(new Set([...prev,opt])) : prev.filter(v=> v!==opt))} />
                </label>
              ))}
            </div>
          )}

          {/* Online visibility Content */}
          {activeSubPanel === 'visibility' && (
            <div className={styles.checkList}>
              {['Any','Visible','Hidden'].map(opt => (
                <label key={opt} className={styles.checkRow}>
                  <span>{opt}</span>
                  <input type="radio" name="vis" checked={visibilityTemp===opt} onChange={()=> setVisibilityTemp(opt)} />
                </label>
              ))}
            </div>
          )}

          {/* Sale price Content */}
          {activeSubPanel === 'salePrice' && (
            <div className={styles.stockControls}>
              <div className={styles.selectWrap} onClick={() => setShowSaleMenu(v=>!v)}>
                <span>{saleComparator}</span>
                <FaChevronDown className={styles.selectChevron} />
                {showSaleMenu && (
                  <div className={styles.selectMenu} onClick={(e)=> e.stopPropagation()}>
                    {['Less than','Greater than','Equal to'].map(opt => (
                      <div key={opt} className={styles.selectOption} onClick={() => { setSaleComparator(opt); setShowSaleMenu(false); }}>
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input type="number" className={styles.amountInput} placeholder="Amount" value={saleAmount} onChange={(e)=> setSaleAmount(e.target.value)} />
            </div>
          )}

          {/* Alcohol Content */}
          {activeSubPanel === 'alcohol' && (
            <div className={styles.checkList}>
              {['Any','Yes','No'].map(opt => (
                <label key={opt} className={styles.checkRow}>
                  <span>{opt}</span>
                  <input type="radio" name="alc" checked={alcoholTemp===opt} onChange={()=> setAlcoholTemp(opt)} />
                </label>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Item table */}
      {selectedLocations.length === 0 ? (
        <div className={styles.noLocationContainer}>
          <div className={styles.noLocationIcon}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="28" fill="#F0F1F2"/>
              <path d="M37.3333 22.6667H18.6666L16 30.6667V36H40V30.6667L37.3333 22.6667Z" stroke="#7F8C9A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 36V40H40V36" stroke="#7F8C9A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M28 22.6667V20" stroke="#7F8C9A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 22.6667V20" stroke="#7F8C9A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M34 22.6667V20" stroke="#7F8C9A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p className={styles.noLocationText}>Please select at least one location</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.itemTable}>
            <thead>
              <tr>
                <th className={styles.itemColumn}>
                  <div className={styles.itemColumnHeader}>
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll} 
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    />
                    <span>Item</span>
                  </div>
                </th>
                <th className={styles.spacerColumn}></th>
                {getVisibleDataColumns().map(column => (
                  <th key={column.key} className={styles.dataColumn}>{column.label}</th>
                ))}
                <th className={styles.spacerColumn}></th>
                <th className={styles.actionsColumn}>
                  <div className={styles.actionsHeader} ref={columnToggleRef}>
                    <button 
                      className={styles.columnToggleBtn}
                      onClick={handleColumnToggle}
                    >
                      <IoIosAddCircleOutline style={{ fontSize: '30px' }} fontWeight={"bold"}/>
                    </button>
                    {showColumnToggle && (
                      <div className={styles.columnToggleDropdown}>
                        <div className={styles.columnToggleList}>
                          {Object.entries({
                            itemImage: 'Images',
                            gtin: 'GTIN',
                            sku: 'SKU',
                            reportingCategory: 'Reporting category',
                            locations: 'Locations',
                            stockOnHand: 'Stock on hand',
                            availableToSell: 'Available to sell',
                            price: 'Price',
                            weight: 'Weight',
                            ageRestriction: 'Age restriction',
                            unitCost: 'Unit cost',
                            defaultVendor: 'Default vendor',
                            vendorCode: 'Vendor code'
                          }).map(([key, label]) => (
                            <label key={key} className={styles.columnToggleItem}>
                              <input
                                type="checkbox"
                                checked={visibleColumns[key]}
                                onChange={() => handleColumnVisibilityChange(key)}
                              />
                              <span>{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr 
                  key={item.id} 
                  className={selectedItems.includes(item.id) ? styles.selectedRow : ''}
                  onClick={() => handleItemClick(item)}
                >
                  <td className={styles.itemColumn}>
                    <div className={styles.itemCellContent}>
                      <input 
                        type="checkbox" 
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      {visibleColumns.itemImage && (
                        item.image && !item.image.includes('placeholder') ? (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className={styles.itemImage}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null
                      )}
                      {visibleColumns.itemImage && (
                        <div 
                          className={styles.itemImagePlaceholder}
                          style={{ display: (!item.image || item.image.includes('placeholder')) ? 'flex' : 'none' }}
                        >
                          <svg width="30" height="30" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V3Z" fill="#E5E7EB"/>
                            <path d="M5.5 6.5C5.5 7.05228 5.05228 7.5 4.5 7.5C3.94772 7.5 3.5 7.05228 3.5 6.5C3.5 5.94772 3.94772 5.5 4.5 5.5C5.05228 5.5 5.5 5.94772 5.5 6.5Z" fill="#9CA3AF"/>
                            <path d="M3 11L6 8L8 10L12 6V13H3V11Z" fill="#9CA3AF"/>
                          </svg>
                        </div>
                      )}
                      <span className={styles.itemName}>{item.name}</span>
                    </div>
                  </td>
                  <td className={styles.spacerColumn}></td>
                  {getVisibleDataColumns().map(column => {
                    let cellContent;
                    switch(column.key) {
                      case 'gtin':
                        cellContent = item.gtin || 'D980974';
                        break;
                      case 'sku':
                        cellContent = item.sku || item.id;
                        break;
                      case 'reportingCategory':
                        cellContent = item.category;
                        break;
                      case 'locations':
                        cellContent = item.locations;
                        break;
                      case 'stockOnHand':
                        cellContent = (
                          <span className={item.stock < 0 ? styles.negativeStock : styles.normalStock}>
                            {item.stock}
                          </span>
                        );
                        break;
                      case 'availableToSell':
                        cellContent = (
                          <span className={item.available < 0 ? styles.negativeStock : styles.availableStock}>
                            {item.available}
                          </span>
                        );
                        break;
                      case 'price':
                        cellContent = item.price;
                        break;
                      case 'weight':
                        cellContent = item.weight || '--';
                        break;
                      case 'ageRestriction':
                        cellContent = item.ageRestriction || '--';
                        break;
                      case 'unitCost':
                        cellContent = item.unitCost || '--';
                        break;
                      case 'defaultVendor':
                        cellContent = item.defaultVendor || '--';
                        break;
                      case 'vendorCode':
                        cellContent = item.vendorCode || '--';
                        break;
                      default:
                        cellContent = '--';
                    }
                    return (
                      <td key={column.key} className={styles.dataColumn}>
                        {cellContent}
                      </td>
                    );
                  })}
                  <td className={styles.spacerColumn}></td>
                  <td className={styles.actionsColumn} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.actionsCell} ref={showActionsDropdown === item.id ? actionsDropdownRef : null}>
                      <button 
                        className={styles.moreButton}
                        onClick={(e) => handleActionsToggle(item.id, e)}
                      >
                        <FaEllipsisH />
                      </button>
                      {showActionsDropdown === item.id && (
                        <div className={styles.actionsDropdown}>
                          <div className={styles.actionsDropdownList}>
                            <button onClick={() => handleActionSelect('edit', item.id)}>Edit</button>
                            <button onClick={() => handleActionSelect('duplicate', item.id)}>Duplicate</button>
                            <button onClick={() => handleActionSelect('updateSalesChannels', item.id)}>Update sales channels</button>
                            <button onClick={() => handleActionSelect('updateSiteVisibility', item.id)}>Update site visibility</button>
                            <button onClick={() => handleActionSelect('updateOnlineSalePrice', item.id)}>Update online sale price</button>
                            <button onClick={() => handleActionSelect('updateCategories', item.id)}>Update categories</button>
                            <button onClick={() => handleActionSelect('updateFulfillmentMethods', item.id)}>Update fulfillment methods</button>
                            <button onClick={() => handleActionSelect('setAsNonTaxable', item.id)}>Set as non-taxable</button>
                            <button onClick={() => handleActionSelect('archive', item.id)}>Archive</button>
                            <button onClick={() => handleActionSelect('updateLowStockAlert', item.id)}>Update low stock alert</button>
                            <button onClick={() => handleActionSelect('delete', item.id)} className={styles.deleteAction}>Delete</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {showAddItemWizard && (
        <ItemWizard 
          onClose={() => {
            setShowAddItemWizard(false);
            setDuplicateItemData(null); // Clear duplicate data when closing
            setEditItemData(null); // Clear edit data when closing
          }}
          duplicateItem={duplicateItemData} // Pass duplicate item data to wizard
          editItem={editItemData} // Pass edit item data to wizard
          onSave={handleSaveItem} // Pass save callback to add items to library
        />
      )}
    </div>
  );
};

export default ItemLibrary;
