import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoCloseSharp, IoChevronDown } from 'react-icons/io5';
import ItemWizard from './ItemWizard';
import styles from './ItemDetail.module.css';

const ItemDetail = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(true);

  // Item type options
  const itemTypeOptions = [
    {
      id: 'physical',
      name: 'Physical good',
      description: 'Best for retail items such as clothing or jewelry.',
      current: true
    },
    {
      id: 'prepared',
      name: 'Prepared food and beverage',
      description: 'Best for restaurants or other food venues. Add nutritional information and identify food allergens for a better online ordering experience.'
    },
    {
      id: 'digital',
      name: 'Digital',
      description: 'Lets you provide a digital file for download.'
    },
    {
      id: 'other',
      name: 'Other',
      description: 'Best for items you will fulfill manually.'
    },
    {
      id: 'service',
      name: 'Service',
      description: 'Best for bookable services like massages or hair styling.'
    }
  ];

  const handleClose = () => {
    navigate('/admin/dashboard/items/library');
  };

  const handleWizardClose = () => {
    setShowWizard(false);
    navigate('/admin/dashboard/items/library');
  };

  // Mock data - same as in ItemLibrary
  const mockItems = [
    { id: 1, uniqueId: 'RSUGLT6QVJHPQHKI6MWTZVIV', name: '10CC - SYRINGE ( NEOJECT ) 10MLS 100\'S', category: 'SYRINGES', locations: 'All locations', stock: 44, available: 44, price: 'TSH 500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 2, uniqueId: 'BKJHG7TYUI9OPLMNBVCXZAQW', name: '10CC SYRINGE ( SURGIMED )', category: 'SYRINGES', locations: 'All locations', stock: -1, available: -1, price: 'TSH 500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 3, uniqueId: 'MNBVCXZLKJHGFDSAPOIUYTRE', name: '10CM GAUZE W . O . W ( GENSAFE - BANDA)', category: 'SURGICALS', locations: 'All locations', stock: 0, available: 0, price: 'TSH 500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 4, uniqueId: 'QWERTYUIOPASDFGHJKLZXCVB', name: '10CM SPANDEX CREPE (SPANDEX - NEOSP', category: 'SURGICALS', locations: 'All locations', stock: 13, available: 13, price: 'TSH 2,500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 5, uniqueId: 'ZXCVBNMASDFGHJKLQWERTYUI', name: '10CM - CREPE BAND 10CM (NEOSPORT) 1', category: 'SURGICALS', locations: 'All locations', stock: 5, available: 5, price: 'TSH 2,500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 6, uniqueId: 'POIUYTREWQLKJHGFDSAMNBVC', name: '15CM GAUZE W . O . W ( GENSAFE - BANDA', category: 'SURGICALS', locations: 'All locations', stock: 18, available: 18, price: 'TSH 600.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 7, uniqueId: 'LKJHGFDSAPOIUYTREWQMNBVC', name: '15CM SPANDEX CREPE (SPANDEX - NEOSP', category: 'SURGICALS', locations: 'All locations', stock: -1, available: -1, price: 'TSH 3,500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 8, uniqueId: 'ASDFGHJKLZXCVBNMQWERTYUI', name: '15CM - CREPE BAND 15CM (NEOSPORT) 1', category: 'SURGICALS', locations: 'All locations', stock: 6, available: 6, price: 'TSH 3,500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 9, uniqueId: 'HJKLZXCVBNMQWERTYUIOPASDF', name: '1CC SYRINGE INSULIN ( NEOJET - YELLOW', category: 'SYRINGES', locations: 'All locations', stock: 100, available: 100, price: 'TSH 750.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 10, uniqueId: 'XCVBNMQWERTYUIOPASDFGHJKL', name: '1L Kilimanjaro Water', category: 'LIQUID', locations: 'All locations', stock: -38, available: -38, price: 'TSH 1,000.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 11, uniqueId: 'QWERTYUIOPASDFGHJKLZXCVBN', name: '21ST - JOINT SUPPORT 30\'S ( UK - MMS - G', category: 'TABLETS', locations: 'All locations', stock: 0, available: 0, price: 'TSH 23,500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 12, uniqueId: 'TYUIOPASDFGHJKLZXCVBNMQWE', name: '21ST - PreNATAL (USA) 30\'S', category: 'TABLETS', locations: 'All locations', stock: -1, available: -1, price: 'TSH 19,500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 13, uniqueId: 'OPASDFGHJKLZXCVBNMQWERTY', name: '21ST- FISH OIL ( USA - OMEGA3,6,9 - 1000', category: 'CAPSULES', locations: 'All locations', stock: 0, available: 0, price: 'TSH 23,500.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 14, uniqueId: 'DFGHJKLZXCVBNMQWERTYUIOP', name: '21ST- LUTEIN ( UK - EYE SUPPORT) 30\'S', category: 'TABLETS', locations: 'All locations', stock: 0, available: 0, price: 'TSH 20,000.00/ea', image: 'https://via.placeholder.com/40' },
    { id: 15, uniqueId: 'HJKLZXCVBNMQWERTYUIOPASDF', name: '21ST- OSTEO SUPPORT TAS 30\'S (US - CAL', category: 'TABLETS', locations: 'All locations', stock: 0, available: 0, price: 'TSH 19,500.00/ea', image: 'https://via.placeholder.com/40' },
  ];

  useEffect(() => {
    // Find the item by uniqueId
    const foundItem = mockItems.find(item => item.uniqueId === itemId);
    if (foundItem) {
      setItem(foundItem);
    }
    setLoading(false);
  }, [itemId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading item details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className={styles.errorContainer}>
        <h2>Item not found</h2>
        <p>The item you're looking for doesn't exist.</p>
        <button onClick={handleClose} className={styles.backButton}>
          Back to Items
        </button>
      </div>
    );
  }

  if (showWizard) {
    return (
      <ItemWizard 
        itemId={itemId}
        onClose={handleWizardClose}
      />
    );
  }

  return (
    <div className={styles.itemDetailContainer}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.closeButton} onClick={handleClose}>
          <IoCloseSharp />
        </button>
        <h1 className={styles.title}>Edit item</h1>
        <div className={styles.headerActions}>
          <button className={styles.saveButton}>Save</button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.scrollContainer}>
          {/* Details Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Details</h2>
            
            <div className={styles.detailsGrid}>
              <div className={styles.leftColumn}>
                {/* Item type field */}
                <div className={styles.itemTypeField}>
                  <div className={styles.itemTypeLeft}>
                    <span className={styles.itemTypeLabel}>Item type</span>
                    <span className={styles.itemTypeValue}>Physical good</span>
                  </div>
                  <div className={styles.itemTypeRight}>
                    <button className={styles.changeButton}>Change</button>
                  </div>
                </div>

                {/* Name field */}
                <div className={styles.field}>
                  <span className={styles.label}>Name</span>
                  <input
                    type="text"
                    className={styles.input}
                    defaultValue={item.name}
                  />
                </div>

                {/* Optional selling name field */}
                <div className={styles.field}>
                  <span className={styles.label}>Optional selling name</span>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder=""
                  />
                </div>

                {/* Description field */}
                <div className={styles.field}>
                  <span className={styles.label}>Description</span>
                  <textarea
                    className={styles.textarea}
                    rows="4"
                    defaultValue="SALAMA ="
                  />
                </div>

                {/* Generate description notice */}
                <div className={styles.notice}>
                  <span>📱 Get this image tagged. Then, upload it to create image library</span>
                </div>

                {/* Location field */}
                <div className={styles.field}>
                  <span className={styles.label}>Location</span>
                  <select className={styles.input}>
                    <option>All locations</option>
                  </select>
                </div>

                {/* Age restriction field */}
                <div className={styles.field}>
                  <span className={styles.label}>Age restriction</span>
                  <select className={styles.input}>
                    <option>None</option>
                  </select>
                </div>

                {/* Brand Name field */}
                <div className={styles.field}>
                  <span className={styles.label}>Brand Name</span>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Enter brand name"
                  />
                </div>

                <div className={styles.dateFieldsRow}>
                  <div className={styles.field}>
                    <span className={styles.label}>Expiry Date</span>
                    <input
                      type="date"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <span className={styles.label}>Manufacturing Date</span>
                    <input
                      type="date"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <span className={styles.label}>Batch No</span>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Enter batch number"
                  />
                </div>

                <div className={styles.field}>
                  <span className={styles.label}>Lot No</span>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Enter lot number"
                  />
                </div>

                <div className={styles.field}>
                  <span className={styles.label}>Manufactured By</span>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Enter manufacturer"
                  />
                </div>
              </div>

              <div className={styles.rightColumn}>
                <div className={styles.imageUpload}>
                  <div className={styles.imagePlaceholder}>
                    Add
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Categorization Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Categorization</h2>
            <p className={styles.sectionDescription}>
              Create, edit, or organize the categories where this item will appear. Online sales, Categories, online for Square Online, POS, and other integrations.
            </p>
            
            <div className={styles.categoryItem}>
              <div className={styles.categoryCheckbox}>
                <input type="checkbox" />
                <span>Menu organization</span>
              </div>
              <button className={styles.selectButton}>Select</button>
            </div>

            <div className={styles.categoryItem}>
              <div className={styles.categoryCheckbox}>
                <input type="checkbox" />
                <span>Categories</span>
              </div>
              <button className={styles.selectButton}>Select</button>
            </div>
          </section>

          {/* Options Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Options</h2>
            <p className={styles.sectionDescription}>
              Customize items with size, color, or optional or required variations to create variations. Learn more.
            </p>
            <button className={styles.addButton}>Add</button>
          </section>

          {/* Units Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Units</h2>
            <p className={styles.sectionDescription}>
              Set unit price and how this item is measured, and choose if you'll sell it both a unit and in bulk. Learn more.
            </p>
            
            <div className={styles.unitsGrid}>
              <div className={styles.unitField}>
                <span className={styles.label}>SKU</span>
                <input type="text" className={styles.input} />
              </div>
              <button className={styles.generateButton}>Add base unit and pricing</button>
            </div>
          </section>

          {/* Variations Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Variations</h2>
            <div className={styles.variationsActions}>
              <button className={styles.editButton}>Edit variations details</button>
              <button className={styles.addButton}>Add</button>
            </div>
            
            <div className={styles.variationItem}>
              <span className={styles.label}>SKU</span>
              <input type="text" className={styles.input} />
              <span className={styles.label}>Price</span>
              <select className={styles.input}>
                <option>Options</option>
              </select>
            </div>
          </section>

          {/* Tracking Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Tracking</h2>
            <div className={styles.toggleItem}>
              <span>Stock</span>
              <div className={styles.itemDetailToggle}>
                <input type="checkbox" defaultChecked />
                <span className={styles.itemDetailSlider}></span>
              </div>
            </div>
            <button className={styles.addButton}>Add low stock alert - Receive stock</button>
          </section>

          {/* Units Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Units</h2>
            <p className={styles.sectionDescription}>
              Add additional units to track and measure this item. For example, sell a case of wine by both a glass and bottle. <span className={styles.learnMore}>Learn more</span>
            </p>

            <div className={styles.unitsGrid}>
              <div className={styles.unitField}>
                <label className={styles.label}>Unit</label>
                <div className={styles.unitDropdown}>
                  <select className={styles.select}>
                    <option>Per item</option>
                  </select>
                </div>
              </div>
              <div className={styles.unitField}>
                <label className={styles.label}>Unit Cost and Vendor</label>
                <button className={styles.addUnitButton}>Add</button>
              </div>
            </div>
          </section>

          {/* Variations Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Variations</h2>
            <div className={styles.variationsActions}>
              <button className={styles.linkButton}>View stock history</button>
              <span className={styles.separator}>|</span>
              <button className={styles.linkButton}>Edit variation details</button>
              <button className={styles.addButton}>Add</button>
            </div>

            <div className={styles.variationsGrid}>
              <div className={styles.variationField}>
                <label className={styles.label}>GTIN</label>
                <input type="text" className={styles.input} />
              </div>
              <div className={styles.variationField}>
                <label className={styles.label}>SKU</label>
                <input type="text" className={styles.input} defaultValue="D980974" />
              </div>
              <div className={styles.variationField}>
                <label className={styles.label}>Weight</label>
                <div className={styles.weightInput}>
                  <input type="text" className={styles.input} placeholder="Weight" />
                  <span className={styles.unit}>kg</span>
                </div>
              </div>
              <div className={styles.variationField}>
                <label className={styles.label}>Price</label>
                <div className={styles.priceField}>
                  <input type="text" className={styles.input} defaultValue="$500.00" />
                  <button className={styles.optionsButton}>Options</button>
                </div>
              </div>
            </div>

            <div className={styles.trackingToggle}>
              <label className={styles.toggleLabel}>
                <span>Tracking</span>
                <div className={styles.toggle}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.slider}></span>
                </div>
              </label>
            </div>

            <div className={styles.stockSection}>
              <h3 className={styles.stockTitle}>Stock</h3>
              <p className={styles.stockInfo}>{item.stock} on hand | {item.available} available</p>
              <button className={styles.receiveStockButton}>Receive stock</button>

              <div className={styles.stockFields}>
                <div className={styles.stockField}>
                  <label className={styles.label}>Low stock alert</label>
                  <input type="text" className={styles.input} defaultValue="10" />
                </div>
                <div className={styles.stockField}>
                  <label className={styles.label}>Dosage Form (Square)</label>
                  <input type="text" className={styles.input} />
                </div>
              </div>
            </div>
          </section>

          {/* Modifiers Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Modifiers</h2>
            <p className={styles.sectionDescription}>
              Allow customizations such as add-ons or special requests. <span className={styles.learnMore}>Learn more</span>
            </p>
            <button className={styles.addButton}>Add</button>
          </section>

          {/* Custom Attributes Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Custom attributes</h2>
            <p className={styles.sectionDescription}>
              Track additional details such as a book's author or a difficulty level for a game. <span className={styles.learnMore}>Learn more</span>
            </p>
            <button className={styles.addButton}>Add</button>
          </section>

          {/* Checkout Behavior Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Checkout behavior</h2>
            
            <div className={styles.checkoutOption}>
              <div className={styles.checkoutToggle}>
                <label className={styles.toggleLabel}>
                  <span>Skip item details screen</span>
                  <div className={styles.toggle}>
                    <input type="checkbox" />
                    <span className={styles.slider}></span>
                  </div>
                </label>
              </div>
              <p className={styles.checkoutDescription}>
                When this item is added to the cart, the first item variation along with any pre-selected modifiers will be applied. You will not be shown the item detail screen. <span className={styles.learnMore}>Learn more</span>
              </p>
            </div>
          </section>

          {/* Where it's sold Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Where it's sold</h2>
            <div className={styles.errorMessage}>
              <span className={styles.warningIcon}>⚠️</span>
              <span>Online channels didn't load successfully. Try refreshing this page or come back again.</span>
            </div>
          </section>

          {/* Fulfillment Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Fulfillment</h2>
            
            <div className={styles.fulfillmentItem}>
              <h3 className={styles.fulfillmentSubtitle}>Online fulfillment methods</h3>
              <p className={styles.fulfillmentDescription}>Shipping, pickup, local delivery and self-serve or kiosk</p>
              <button className={styles.editButton}>Edit</button>
            </div>

            <div className={styles.fulfillmentItem}>
              <h3 className={styles.fulfillmentSubtitle}>Item prep time</h3>
              <p className={styles.fulfillmentDescription}>Based on location default</p>
              <button className={styles.editButton}>Edit</button>
            </div>

            <div className={styles.fulfillmentItem}>
              <h3 className={styles.fulfillmentSubtitle}>Item contains alcohol</h3>
              <div className={styles.alcoholToggle}>
                <span>Indicate if an alcoholic item should have an ID code online</span>
                <button className={styles.assignButton}>Assign</button>
              </div>
            </div>
          </section>

          {/* Search Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Search</h2>
            
            <div className={styles.searchItem}>
              <h3 className={styles.searchSubtitle}>Search engine optimization (SEO)</h3>
              <p className={styles.searchDescription}>Customize how this item is displayed for search engines.</p>
              <button className={styles.editButton}>Edit</button>
            </div>

            <div className={styles.searchItem}>
              <h3 className={styles.searchSubtitle}>Social media links</h3>
              <p className={styles.searchDescription}>Customize how this item is displayed in social media.</p>
              <button className={styles.editButton}>Edit</button>
            </div>
          </section>

          {/* Subscriptions Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Subscriptions</h2>
            <p className={styles.sectionDescription}>
              Offer this item as a recurring basis with subscriptions. <span className={styles.learnMore}>Learn more</span>
            </p>
            <button className={styles.addButton}>Add</button>
          </section>

          {/* Payment Links Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment Links</h2>
            
            <div className={styles.paymentLinksItem}>
              <div className={styles.paymentLinksToggle}>
                <label className={styles.toggleLabel}>
                  <span>Create a payment link or buy button</span>
                  <div className={styles.toggle}>
                    <input type="checkbox" />
                    <span className={styles.slider}></span>
                  </div>
                </label>
              </div>
              <p className={styles.paymentLinksDescription}>
                Share the link via email, text, or social, or embed on any website. <span className={styles.learnMore}>Learn more</span>
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Item Type Modal */}
      {showItemTypeModal && (
        <div className={styles.modalOverlay} onClick={handleCloseItemTypeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <button className={styles.modalCloseButton} onClick={handleCloseItemTypeModal}>
                <IoCloseSharp />
              </button>
              <h2 className={styles.modalTitle}>Change item type</h2>
              <button className={styles.modalChangeButton}>Change</button>
            </div>
            
            <div className={styles.modalContent}>
              <p className={styles.modalDescription}>
                Item types help you by providing specific fields and settings for each kind of item you want to sell. Change the default item type in <span className={styles.modalLink}>item defaults</span>.
              </p>
              
              <div className={styles.itemTypeOptions}>
                {itemTypeOptions.map((option) => (
                  <div 
                    key={option.id} 
                    className={`${styles.itemTypeOption} ${selectedItemType === option.name ? styles.selectedOption : ''}`}
                    onClick={() => handleSelectItemType(option)}
                  >
                    <div className={styles.optionContent}>
                      <div className={styles.optionHeader}>
                        <h3 className={styles.optionName}>{option.name}</h3>
                        {selectedItemType === option.name && (
                          <span className={styles.currentBadge}>Current type</span>
                        )}
                      </div>
                      <p className={styles.optionDescription}>{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.modalFooter}>
                <p className={styles.serviceNote}>
                  Create the following item type in Service Library: <span className={styles.serviceLink}>Go to Service Library</span>
                </p>
                <div className={styles.serviceOption}>
                  <h4 className={styles.serviceName}>Service</h4>
                  <p className={styles.serviceDescription}>Best for bookable services like massages or hair styling.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
