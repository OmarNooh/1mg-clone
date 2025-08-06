import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaShare } from 'react-icons/fa';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../context/CartContext';
import styles from './Wishlist.module.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    // For now, we'll just copy a link to the clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Wishlist link copied to clipboard!'))
        .catch(err => console.error('Failed to copy: ', err));
    } else {
      alert('Clipboard API not available in your browser');
    }
  };

  return (
    <div className={styles.wishlistPage}>
      <div className={styles.wishlistHeader}>
        <h1 className={styles.wishlistTitle}>My Wishlist</h1>
        <div className={styles.wishlistActions}>
          {wishlist.length > 0 && (
            <>
              <button 
                className={styles.shareButton} 
                onClick={handleShare}
                title="Share wishlist"
              >
                <FaShare /> Share
              </button>
              <button 
                className={styles.clearButton} 
                onClick={clearWishlist}
                title="Clear wishlist"
              >
                <FaTrash /> Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className={styles.emptyWishlist}>
          <div className={styles.emptyMessage}>
            <h2>Your wishlist is empty</h2>
            <p>Add items you want to save for later by clicking the heart icon on any product.</p>
            <Link to="/medicines" className={styles.shopNowButton}>
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.wishlistContent}>
          <div className={styles.wishlistGrid}>
            {wishlist.map(product => (
              <div key={product.id} className={styles.wishlistItem}>
                <div className={styles.productImage}>
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                </div>
                <div className={styles.productInfo}>
                  <Link to={`/product/${product.id}`} className={styles.productName}>
                    {product.name}
                  </Link>
                  <div className={styles.productMeta}>
                    <span className={styles.manufacturer}>{product.manufacturer}</span>
                    {product.rating && (
                      <span className={styles.rating}>
                        {product.rating}★ ({product.ratingCount || 0})
                      </span>
                    )}
                  </div>
                  <div className={styles.productPrice}>
                    <span className={styles.discountedPrice}>TZS{product.discountedPrice}</span>
                    {product.mrp > product.discountedPrice && (
                      <>
                        <span className={styles.originalPrice}>TZS{product.mrp}</span>
                        <span className={styles.discount}>
                          {Math.round((1 - product.discountedPrice / product.mrp) * 100)}% off
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className={styles.itemActions}>
                  <button 
                    className={styles.moveToCartButton}
                    onClick={() => handleMoveToCart(product)}
                    title="Move to cart"
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button 
                    className={styles.removeButton}
                    onClick={() => removeFromWishlist(product.id)}
                    title="Remove from wishlist"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
