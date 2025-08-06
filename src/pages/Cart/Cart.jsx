import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Cart.module.css';
import { useCart } from '../../context/CartContext';
import { products } from '../../data/products';
import AddToCartButton from '../../components/AddToCartButton/AddToCartButton';
import {
  FaShoppingCart,
  FaTrashAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaRegHeart,
  FaChevronRight,
  FaCreditCard,
  FaPlus,
  FaMinus
} from 'react-icons/fa';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Calculate cart summary
  const calculateSummary = () => {
    // Add safety checks for item properties
    const subtotal = cart.reduce((total, item) => {
      const price = item.discountedPrice || 0;
      const qty = item.quantity || 1;
      return total + (price * qty);
    }, 0);
    
    const totalMRP = cart.reduce((total, item) => {
      const mrp = item.mrp || 0;
      const qty = item.quantity || 1;
      return total + (mrp * qty);
    }, 0);
    
    const totalDiscount = totalMRP - subtotal;
    const deliveryCharges = subtotal < 500 ? 49 : 0;
    const totalAmount = subtotal + deliveryCharges;
    
    return {
      subtotal: subtotal.toFixed(2),
      totalMRP: totalMRP.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      deliveryCharges,
      totalAmount: totalAmount.toFixed(2),
      totalSavings: totalDiscount.toFixed(2)
    };
  };
  
  const summary = calculateSummary();
  
  // Handle quantity change
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };
  
  // Handle item removal
  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  // Toggle item selection
  const toggleSelectItem = (id) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Toggle select all items
  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map(item => item.id));
    }
  };

  // Delete selected items
  const deleteSelectedItems = () => {
    selectedItems.forEach(id => removeFromCart(id));
    setSelectedItems([]);
  };

  // Empty cart component
  const EmptyCartView = () => (
    <div className={styles.emptyCart}>
      <div className={styles.emptyCartIcon}>
        <FaShoppingCart />
      </div>
      <h2>Your Cart is Empty</h2>
      <p>Looks like you haven't added any items to your cart yet.</p>
      <Link to="/" className={styles.continueShoppingBtn}>
        Continue Shopping
      </Link>
    </div>
  );

  // Order success component
  const OrderSuccessView = () => (
    <div className={styles.orderSuccess}>
      <div className={styles.successIcon}>
        <FaCheckCircle />
      </div>
      <h2>Order Placed Successfully!</h2>
      <p>Thank you for your purchase. Your order has been received.</p>
      <p className={styles.orderNote}>Order details have been sent to your email.</p>
      <Link to="/" className={styles.continueShoppingBtn}>
        Continue Shopping
      </Link>
    </div>
  );
  
  // Get recommended products (24 products in a 6x4 grid)
  const recommendedProducts = products.slice(0, 24);

  return (
    <div className={styles.cart}>
      <div className={styles.container}>
        {orderPlaced ? (
          <OrderSuccessView />
        ) : cart.length === 0 ? (
          <EmptyCartView />
        ) : (
          <>
            {/* Cart layout with summary on the right */}
            <div className={styles.cartLayout}>
              {/* Main cart content - left side */}
              <div className={styles.cartMainContent}>
                {/* Cart header */}
                <div className={styles.cartHeader}>
                  <h2>Cart ({cart.length})</h2>
                  <div className={styles.cartActions}>
                    <label className={styles.selectAllLabel}>
                      <input 
                        type="checkbox" 
                        checked={selectedItems.length === cart.length && cart.length > 0}
                        onChange={toggleSelectAll}
                      /> 
                      Select all items
                    </label>
                    <button 
                      className={styles.deleteSelectedBtn}
                      onClick={deleteSelectedItems}
                      disabled={selectedItems.length === 0}
                    >
                      Delete selected items
                    </button>
                  </div>
                </div>
                
                {/* Promotion banner */}
                <div className={styles.promotionBanner}>
                  <div className={styles.promotionContent}>
                    <span className={styles.promotionTitle}>Fun Summer Savings</span>
                    <span className={styles.promotionDate}>Ends: Jul 12, 09:59 (GMT+3)</span>
                  </div>
                  <FaChevronRight className={styles.promotionArrow} />
                </div>
                
                {/* Shipping info */}
                <div className={styles.shippingInfo}>
                  <div className={styles.shippingLabel}>
                    <input type="checkbox" checked readOnly />
                    <span>Shipped by global sellers</span>
                    <FaInfoCircle className={styles.infoIcon} />
                  </div>
                </div>
                
                {/* Cart items */}
                <div className={styles.cartItems}>
                  {cart.map(item => (
                    <div key={item.id} className={styles.cartItem}>
                      <div className={styles.itemSelection}>
                        <input 
                          type="checkbox" 
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                        />
                      </div>
                      
                      <div className={styles.sellerInfo}>
                        <div className={styles.sellerDot}></div>
                        <span>{item.manufacturer || 'Store'}'s Store</span>
                      </div>
                      
                      <div className={styles.itemDetails}>
                        <div className={styles.itemImageContainer}>
                          <img src={item.image} alt={item.name} className={styles.itemImage} />
                        </div>
                        
                        <div className={styles.itemInfo}>
                          <div className={styles.itemName}>{item.name}</div>
                          <div className={styles.itemOptions}>
                            {item.variant && <span className={styles.itemVariant}>{item.variant}</span>}
                          </div>
                          
                          <div className={styles.itemActions}>
                            <button className={styles.actionButton}><FaRegHeart /></button>
                            <button 
                              className={styles.actionButton}
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </div>
                        
                        <div className={styles.itemPricing}>
                          <div className={styles.itemPrice}>TZS{(item.discountedPrice || 0).toFixed(2)}</div>
                          {item.mrp && item.mrp !== item.discountedPrice && (
                            <div className={styles.itemOriginalPrice}>TZS{(item.mrp || 0).toFixed(2)}</div>
                          )}
                        </div>
                        
                        <div className={styles.quantityControl}>
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className={styles.quantityBtn}
                          >
                            <FaMinus />
                          </button>
                          <input 
                            type="text" 
                            value={item.quantity} 
                            readOnly 
                            className={styles.quantityInput}
                          />
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className={styles.quantityBtn}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Cart summary - right side */}
              <div className={styles.cartSummary}>
                <h3>Summary</h3>
                
                <div className={styles.summaryItems}>
                  <div className={styles.summaryImages}>
                    {cart.slice(0, 3).map(item => (
                      <img key={item.id} src={item.image} alt={item.name} className={styles.summaryItemImage} />
                    ))}
                  </div>
                  
                  <div className={styles.summaryRow}>
                    <span>Items total</span>
                    <span>TZS{summary.totalMRP}</span>
                  </div>
                  
                  <div className={styles.summaryRow}>
                    <span>Items discount</span>
                    <span className={styles.discount}>-TZS{summary.totalDiscount}</span>
                  </div>
                  
                  <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>TZS{summary.subtotal}</span>
                  </div>
                  
                  <div className={styles.summaryRow}>
                    <span>Shipping</span>
                    <span>TZS{summary.deliveryCharges.toFixed(2)}</span>
                  </div>
                  
                  <div className={`${styles.summaryRow} ${styles.total}`}>
                    <span>Estimated total</span>
                    <span>TZS{summary.totalAmount}</span>
                  </div>
                  
                  <button className={styles.checkoutBtn}>
                    Checkout ({cart.length})
                    <span className={styles.checkoutBtnSubtext}>Now lower prices!</span>
                  </button>
                  
                  <div className={styles.paymentMethods}>
                    <h4>Pay with</h4>
                    <div className={styles.paymentIcons}>
                      <span className={styles.paymentIcon}>VISA</span>
                      <span className={styles.paymentIcon}>MC</span>
                      <span className={styles.paymentIcon}>JCB</span>
                      <span className={styles.paymentIcon}>AMEX</span>
                    </div>
                  </div>
                  
                  <div className={styles.buyerProtection}>
                    <h4>Buyer protection</h4>
                    <div className={styles.protectionInfo}>
                      <input type="checkbox" checked readOnly />
                      <span>Get a full refund if the item is not as described or not delivered</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recommended Products - 6x4 grid */}
            <div className={styles.recommendedProducts}>
              <h2>Recommended Products</h2>
              <div className={styles.productsGrid}>
                {recommendedProducts.map(product => (
                  <div key={product.id} className={styles.productCard}>
                    <div className={styles.productImageContainer}>
                      <img src={product.image} alt={product.name} className={styles.productImage} />
                    </div>
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <div className={styles.productPrice}>
                        <span className={styles.currentPrice}>TZS{(product.discountedPrice || 0).toFixed(2)}</span>
                        {product.mrp && product.mrp !== product.discountedPrice && (
                          <span className={styles.originalPrice}>TZS{(product.mrp || 0).toFixed(2)}</span>
                        )}
                      </div>
                      <div className={styles.addToCartContainer}>
                        <AddToCartButton product={product} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
