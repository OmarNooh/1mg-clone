import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaTruck, FaCheck, FaTimes } from 'react-icons/fa';
import styles from './AdminComponents.module.css';
import { OrderAPI } from '../../../backend/api/index';

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingOrder, setViewingOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const orderData = await OrderAPI.getAllOrders();
        setOrders(orderData);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Sample order structure for reference
  /* const orders = [
    {
      id: '1001',
      customer: 'John Doe',
      email: 'john.doe@example.com',
      date: '2025-07-09',
      status: 'Delivered',
      total: 'TZS 125.99',
      items: [
        { id: '101', name: 'Vitamin C Tablets', quantity: 2, price: 'TZS 45.99' },
        { id: '102', name: 'Blood Pressure Monitor', quantity: 1, price: 'TZS 80.00' }
      ],
      address: '123 Msasani Road, Dar es Salaam, Tanzania',
      phone: '+255 755 123 456',
      paymentMethod: 'Credit Card'
    },
    {
      id: '1002',
      customer: 'Jane Smith',
      email: 'jane.smith@example.com',
      date: '2025-07-09',
      status: 'Processing',
      total: 'TZS 89.50',
      items: [
        { id: '103', name: 'Glucose Test Strips', quantity: 3, price: 'TZS 65.50' },
        { id: '104', name: 'Multivitamin Capsules', quantity: 1, price: 'TZS 24.00' }
      ],
      address: '456 Sokoine Road, Arusha, Tanzania',
      phone: '+255 765 987 654',
      paymentMethod: 'PayPal'
    },
    {
      id: '1003',
      customer: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      date: '2025-07-08',
      status: 'Shipped',
      total: 'TZS 210.75',
      items: [
        { id: '105', name: 'Digital Thermometer', quantity: 1, price: 'TZS 35.75' },
        { id: '106', name: 'First Aid Kit', quantity: 1, price: 'TZS 45.00' },
        { id: '107', name: 'Protein Powder', quantity: 2, price: 'TZS 65.00' }
      ],
      address: '789 Nyerere Road, Mwanza, Tanzania',
      phone: '+255 745 456 789',
      paymentMethod: 'Credit Card'
    },
    {
      id: '1004',
      customer: 'Emily Davis',
      email: 'emily.davis@example.com',
      date: '2025-07-08',
      status: 'Delivered',
      total: 'TZS 45.25',
      items: [
        { id: '108', name: 'Hand Sanitizer', quantity: 3, price: 'TZS 15.75' },
        { id: '109', name: 'Face Masks', quantity: 1, price: 'TZS 29.50' }
      ],
      address: '101 Kigamboni Street, Dodoma, Tanzania',
      phone: '+255 775 789 012',
      paymentMethod: 'Debit Card'
    },
    {
      id: '1005',
      customer: 'Michael Brown',
      email: 'michael.brown@example.com',
      date: '2025-07-07',
      status: 'Cancelled',
      total: 'TZS 78.00',
      items: [
        { id: '110', name: 'Calcium Supplements', quantity: 2, price: 'TZS 38.00' },
        { id: '111', name: 'Heating Pad', quantity: 1, price: 'TZS 40.00' }
      ],
      address: '202 Bagamoyo Road, Tanga, Tanzania',
      phone: '+255 735 321 654',
      paymentMethod: 'Credit Card'
    }
  ]; */
  
  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order.id.includes(searchTerm) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleViewOrder = async (order) => {
    try {
      // Get detailed order information if needed
      const detailedOrder = await OrderAPI.getOrderById(order.id);
      setViewingOrder(detailedOrder || order);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setViewingOrder(order); // Fallback to the basic order info
    }
  };
  
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // Update the order status via API
      await OrderAPI.updateOrderStatus(orderId, newStatus);
      
      // Update local state
      if (viewingOrder && viewingOrder.id === orderId) {
        setViewingOrder({
          ...viewingOrder,
          status: newStatus
        });
      }
      
      // Update the orders list
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error(`Error updating order ${orderId} status:`, err);
    }
  };
  
  return (
    <div className={styles.orderManagement}>
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading orders...</p>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : !viewingOrder ? (
        <>
          <div className={styles.orderHeader}>
            <div className={styles.searchBar}>
              <FaSearch className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.date}</td>
                    <td>
                      <span className={`${styles.status} ${styles[order.status.toLowerCase()] || styles.processing}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.total}</td>
                    <td>
                      <button 
                        className={styles.viewButton}
                        onClick={() => handleViewOrder(order)}
                      >
                        <FaEye /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredOrders.length === 0 && (
              <div className={styles.noOrders}>
                <p>No orders found matching your search.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className={styles.orderDetails}>
          <div className={styles.orderDetailsHeader}>
            <h2>Order #{viewingOrder.id}</h2>
            <button 
              className={styles.backButton}
              onClick={() => setViewingOrder(null)}
            >
              Back to Orders
            </button>
          </div>
          
          <div className={styles.orderCard}>
            <div className={styles.orderCardHeader}>
              <div className={styles.orderInfo}>
                <div className={styles.orderInfoItem}>
                  <span className={styles.orderInfoLabel}>Date:</span>
                  <span>{viewingOrder.date}</span>
                </div>
                <div className={styles.orderInfoItem}>
                  <span className={styles.orderInfoLabel}>Status:</span>
                  <span className={`${styles.status} ${styles[viewingOrder.status.toLowerCase()] || styles.processing}`}>
                    {viewingOrder.status}
                  </span>
                </div>
                <div className={styles.orderInfoItem}>
                  <span className={styles.orderInfoLabel}>Total:</span>
                  <span className={styles.orderTotal}>{viewingOrder.total}</span>
                </div>
              </div>
              
              <div className={styles.orderActions}>
                {viewingOrder.status !== 'Delivered' && viewingOrder.status !== 'Cancelled' && (
                  <>
                    {viewingOrder.status === 'Processing' && (
                      <button 
                        className={`${styles.actionButton} ${styles.shipButton}`}
                        onClick={() => handleUpdateStatus(viewingOrder.id, 'Shipped')}
                      >
                        <FaTruck /> Mark as Shipped
                      </button>
                    )}
                    {viewingOrder.status === 'Shipped' && (
                      <button 
                        className={`${styles.actionButton} ${styles.deliverButton}`}
                        onClick={() => handleUpdateStatus(viewingOrder.id, 'Delivered')}
                      >
                        <FaCheck /> Mark as Delivered
                      </button>
                    )}
                    <button 
                      className={`${styles.actionButton} ${styles.cancelButton}`}
                      onClick={() => handleUpdateStatus(viewingOrder.id, 'Cancelled')}
                    >
                      <FaTimes /> Cancel Order
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className={styles.orderDetailsGrid}>
              <div className={styles.orderCustomerInfo}>
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> {viewingOrder.customer}</p>
                <p><strong>Email:</strong> {viewingOrder.email}</p>
                <p><strong>Phone:</strong> {viewingOrder.phone}</p>
                <p><strong>Address:</strong> {viewingOrder.address}</p>
                <p><strong>Payment Method:</strong> {viewingOrder.paymentMethod}</p>
              </div>
              
              <div className={styles.orderItems}>
                <h3>Order Items</h3>
                <table className={styles.itemsTable}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingOrder.items.map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2" className={styles.totalLabel}>Total:</td>
                      <td className={styles.totalValue}>{viewingOrder.total}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
