import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaTruck, FaCheck, FaClock, FaDownload, FaEye } from 'react-icons/fa';
import styles from './OrderHistory.module.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Load orders from localStorage
    const loadOrders = () => {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(storedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    };

    loadOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return FaCheck;
      case 'processing':
        return FaClock;
      case 'shipped':
        return FaTruck;
      case 'delivered':
        return FaBox;
      default:
        return FaClock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#28a745';
      case 'processing':
        return '#ffc107';
      case 'shipped':
        return '#17a2b8';
      case 'delivered':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const handleDownloadInvoice = (order) => {
    const invoiceText = `
HOOD Online Pharmacy - Invoice
==============================

Order ID: ${order.id}
Date: ${new Date(order.createdAt).toLocaleDateString()}

Billing Address:
${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
${order.shippingAddress.address}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}

Items:
${order.items.map(item => `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: ₹${order.subtotal.toFixed(2)}
Shipping: ₹${order.shippingCost.toFixed(2)}
${order.paymentFee > 0 ? `Payment Fee: ₹${order.paymentFee.toFixed(2)}` : ''}
Total: ₹${order.total.toFixed(2)}

Thank you for your order!
    `;
    
    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Order History</h1>
        <p>Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <FaBox className={styles.emptyIcon} />
          <h2>No orders yet</h2>
          <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
          <Link to="/medicines" className={styles.shopButton}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.filters}>
            <button
              className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
              onClick={() => setFilter('all')}
            >
              All Orders ({orders.length})
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'confirmed' ? styles.active : ''}`}
              onClick={() => setFilter('confirmed')}
            >
              Confirmed
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'processing' ? styles.active : ''}`}
              onClick={() => setFilter('processing')}
            >
              Processing
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'shipped' ? styles.active : ''}`}
              onClick={() => setFilter('shipped')}
            >
              Shipped
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'delivered' ? styles.active : ''}`}
              onClick={() => setFilter('delivered')}
            >
              Delivered
            </button>
          </div>

          <div className={styles.ordersList}>
            {filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              
              return (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderInfo}>
                      <h3>Order #{order.id}</h3>
                      <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className={styles.orderStatus}>
                      <StatusIcon 
                        style={{ color: getStatusColor(order.status) }}
                        className={styles.statusIcon}
                      />
                      <span 
                        className={styles.statusText}
                        style={{ color: getStatusColor(order.status) }}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.orderItems}>
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className={styles.orderItem}>
                        <img 
                          src={item.image || '/api/placeholder/50/50'} 
                          alt={item.name}
                          className={styles.itemImage}
                        />
                        <div className={styles.itemDetails}>
                          <h4>{item.name}</h4>
                          <p>Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className={styles.moreItems}>
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>

                  <div className={styles.orderSummary}>
                    <div className={styles.orderTotal}>
                      <span>Total: ₹{order.total.toFixed(2)}</span>
                    </div>
                    
                    <div className={styles.deliveryInfo}>
                      <p>
                        <strong>Delivery to:</strong> {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                      {order.estimatedDelivery && (
                        <p>
                          <strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={styles.orderActions}>
                    <Link 
                      to={`/order/${order.id}`}
                      className={styles.viewButton}
                    >
                      <FaEye /> View Details
                    </Link>
                    
                    <button
                      onClick={() => handleDownloadInvoice(order)}
                      className={styles.downloadButton}
                    >
                      <FaDownload /> Invoice
                    </button>
                    
                    {order.status === 'delivered' && (
                      <button className={styles.reorderButton}>
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderHistory;
