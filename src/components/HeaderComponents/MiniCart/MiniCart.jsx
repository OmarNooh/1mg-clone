import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import { updateQuantityAsync, removeFromCartAsync } from "../../../store/slices/cartSlice";
import styles from './MiniCart.module.css';

const MiniCart = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  
  const { items, totalQuantity, totalAmount } = useSelector(state => state.cart);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuantityUpdate = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCartAsync(productId));
    } else {
      dispatch(updateQuantityAsync({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCartAsync(productId));
  };

  return (
    <div className={styles.miniCartContainer}>
      <button
        ref={buttonRef}
        className={styles.cartButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Shopping cart"
      >
        <div className={styles.cartIconContainer}>
          <FaShoppingCart className={styles.cartIcon} />
          <span className={styles.cartBadge}>{totalQuantity}</span>
        </div>
        <div className={styles.cartTotal}>
          <span className={styles.currency}>TSH</span>
          <span className={styles.amount}>{totalAmount.toFixed(2)}</span>
        </div>
      </button>

      {isOpen && (
        <div ref={dropdownRef} className={styles.miniCartDropdown}>
          <div className={styles.miniCartHeader}>
            <h3>Shopping Cart ({totalQuantity} items)</h3>
            <button 
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close cart"
            >
              <FaTimes />
            </button>
          </div>

          <div className={styles.miniCartContent}>
            {items.length === 0 ? (
              <div className={styles.emptyCart}>
                <FaShoppingCart className={styles.emptyCartIcon} />
                <p>Your cart is empty</p>
                <Link 
                  to="/medicines" 
                  className={styles.shopNowButton}
                  onClick={() => setIsOpen(false)}
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className={styles.cartItems}>
                  {items.map((item) => (
                    <div key={item.id} className={styles.cartItem}>
                      <Link 
                        to={`/product/${item.id}`}
                        className={styles.itemImage}
                        onClick={() => setIsOpen(false)}
                      >
                        <img src={item.image || '/api/placeholder/60/60'} alt={item.name} />
                      </Link>
                      
                      <div className={styles.itemDetails}>
                        <Link 
                          to={`/product/${item.id}`}
                          className={styles.itemName}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                        <p className={styles.itemBrand}>{item.brand}</p>
                        
                        <div className={styles.itemActions}>
                          <div className={styles.quantityControls}>
                            <button
                              onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                              className={styles.quantityButton}
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus />
                            </button>
                            <span className={styles.quantity}>{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                              className={styles.quantityButton}
                            >
                              <FaPlus />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className={styles.removeButton}
                            aria-label="Remove item"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                      
                      <div className={styles.itemPrice}>
                        <span className={styles.currentPrice}>₹{item.price}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className={styles.originalPrice}>₹{item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.cartSummary}>
                  <div className={styles.subtotal}>
                    <span>Subtotal ({totalQuantity} items):</span>
                    <span className={styles.totalAmount}>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className={styles.cartActions}>
                    <Link 
                      to="/cart" 
                      className={styles.viewCartButton}
                      onClick={() => setIsOpen(false)}
                    >
                      View Cart
                    </Link>
                    <Link 
                      to="/checkout" 
                      className={styles.checkoutButton}
                      onClick={() => setIsOpen(false)}
                    >
                      Checkout
                    </Link>
                  </div>
                  
                  <div className={styles.freeShipping}>
                    {totalAmount >= 500 ? (
                      <p className={styles.freeShippingEligible}>
                        🎉 You qualify for FREE shipping!
                      </p>
                    ) : (
                      <p className={styles.freeShippingProgress}>
                        Add ₹{(500 - totalAmount).toFixed(2)} more for FREE shipping
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCart;
