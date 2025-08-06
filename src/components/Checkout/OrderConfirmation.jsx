import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaDownload, FaEnvelope, FaTruck, FaPhone, FaHome } from 'react-icons/fa';
import styles from './OrderConfirmation.module.css';

const OrderConfirmation = ({ order }) => {
  // Set page title for order confirmation
  useEffect(() => {
    document.title = `Order Confirmed - ${order?.id} | HOOD Online Pharmacy`;
  }, [order]);

  if (!order) {
    return (
      <div className={styles.errorContainer}>
        <h2>Order not found</h2>
        <p>There was an issue loading your order details.</p>
        <Link to="/" className={styles.homeButton}>
          Return to Home
        </Link>
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    // Mock PDF generation - in real app, this would generate and download a PDF
    const invoiceData = {
      orderId: order.id,
      date: new Date(order.createdAt).toLocaleDateString(),
      items: order.items,
      total: order.total,
      shippingAddress: order.shippingAddress
    };
    
    // Create a simple text-based invoice for demo
    const invoiceText = `
HOOD Online Pharmacy - Invoice
==============================

Order ID: ${invoiceData.orderId}
Date: ${invoiceData.date}

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

  return (
    <div className={styles.container}>
      <div className={styles.confirmationSection}>
        <div className={styles.successHeader}>
          <FaCheckCircle className={styles.successIcon} />
          <h1>Order Confirmed!</h1>
          <p>Thank you for your order. We've received your order and will process it shortly.</p>
        </div>

        <div className={styles.orderDetails}>
          <div className={styles.orderHeader}>
            <h2>Order #{order.id}</h2>
            <div className={styles.orderMeta}>
              <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
              <span className={styles.status}>Status: {order.status}</span>
            </div>
          </div>

          <div className={styles.orderItems}>
            <h3>Items Ordered</h3>
            {order.items.map((item) => (
              <div key={item.id} className={styles.orderItem}>
                <img 
                  src={item.image || '/api/placeholder/60/60'} 
                  alt={item.name}
                  className={styles.itemImage}
                />
                <div className={styles.itemDetails}>
                  <h4>{item.name}</h4>
                  <p>{item.brand}</p>
                  <span>Quantity: {item.quantity}</span>
                </div>
                <div className={styles.itemPrice}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.orderSummary}>
            <h3>Order Summary</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping:</span>
              <span>₹{order.shippingCost.toFixed(2)}</span>
            </div>
            {order.paymentFee > 0 && (
              <div className={styles.summaryRow}>
                <span>Payment Fee:</span>
                <span>₹{order.paymentFee.toFixed(2)}</span>
              </div>
            )}
            <div className={styles.summaryRow + ' ' + styles.total}>
              <span>Total:</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.shippingInfo}>
            <h3>Shipping Information</h3>
            <div className={styles.shippingDetails}>
              <div className={styles.address}>
                <h4>Delivery Address</h4>
                <p>
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                  {order.shippingAddress.country}
                </p>
              </div>
              <div className={styles.delivery}>
                <h4>Delivery Method</h4>
                <p>
                  {order.shippingMethod.name}<br />
                  <strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button 
              onClick={handleDownloadInvoice}
              className={styles.downloadButton}
            >
              <FaDownload /> Download Invoice
            </button>
            
            <Link to="/account/orders" className={styles.ordersButton}>
              View All Orders
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.nextSteps}>
        <div className={styles.stepCard}>
          <FaEnvelope className={styles.stepIcon} />
          <h3>Email Confirmation</h3>
          <p>We've sent an order confirmation email to {order.shippingAddress.email}</p>
        </div>

        <div className={styles.stepCard}>
          <FaTruck className={styles.stepIcon} />
          <h3>Order Processing</h3>
          <p>Your order will be processed within 24 hours. You'll receive tracking information once shipped.</p>
        </div>

        <div className={styles.stepCard}>
          <FaPhone className={styles.stepIcon} />
          <h3>Need Help?</h3>
          <p>Contact our customer support team for any questions about your order.</p>
          <button className={styles.contactButton}>Contact Support</button>
        </div>
      </div>

      <div className={styles.continueShopping}>
        <h3>Continue Shopping</h3>
        <p>Discover more health products and medicines</p>
        <div className={styles.shopButtons}>
          <Link to="/medicines" className={styles.shopButton}>
            Shop Medicines
          </Link>
          <Link to="/vitamins" className={styles.shopButton}>
            Shop Vitamins
          </Link>
          <Link to="/" className={styles.homeButton}>
            <FaHome /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
