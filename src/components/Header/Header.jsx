import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logo/logo1.png';
import { FaBars } from 'react-icons/fa';
import styles from './Header.module.css';
import { LoginModal, SignUpModal } from '../HeaderComponents/Modal';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import ReorderButton from '../HeaderComponents/ReorderButton/ReorderButton';
import AccountButton from '../HeaderComponents/AccountButton/AccountButton';
import SearchBox from '../HeaderComponents/SearchBox/SearchBox';
import MiniCart from '../HeaderComponents/MiniCart/MiniCart';
import LocationSelector from '../HeaderComponents/LocationSelector/LocationSelector';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // Mobile menu removed as requested
  const [isSearching, setIsSearching] = useState(false);
  const [showDepartmentsMenu, setShowDepartmentsMenu] = useState(false);
  const [showServicesMenu, setShowServicesMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const locationRef = useRef(null);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      setTimeout(() => {
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        setIsSearching(false);
      }, 800);
    }
  };

  const toggleDepartmentsMenu = () => {
    setShowDepartmentsMenu(!showDepartmentsMenu);
    setShowServicesMenu(false);
  };

  const toggleServicesMenu = () => {
    setShowServicesMenu(!showServicesMenu);
    setShowDepartmentsMenu(false);
  };

  // Mobile menu toggle removed as requested

  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowSignUpModal(false);
  };

  const openSignUpModal = () => {
    setShowSignUpModal(true);
    setShowLoginModal(false);
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowSignUpModal(false);
  };

  return (
    <header className={styles.header}>
      {/* Top Header with Logo, Search, Account */}
      <div className={styles.topHeader}>
        <div className={styles.container}>
          <div className={styles.topHeaderContent}>
            {/* Left Section - Logo and Location */}
            <div className={styles.topHeaderLeft}>
              <Link to="/" className={styles.logo}>
                <div className={styles.logoIcon}>
                  <button className={styles.hoodButton}>
                    <img className={styles.HoodIcon} src={Logo} alt="Hood" />
                  </button>
                </div>
              </Link>
              
              <div className={styles.locationPill} ref={locationRef}>
                <LocationSelector />
              </div>
            </div>
            
            {/* Center Section - Search */}
            <div className={styles.topHeaderCenter}>
              <SearchBox className={styles.headerSearchBox} />
            </div>
            
            {/* Right Section - Account, Reorder, Cart */}
            <div className={styles.topHeaderRight}>
              <div className={styles.headerActionGroup}>
                <ReorderButton />
              </div>
              
              <div className={styles.headerActionGroup}>
                <AccountButton />
              </div>
              
              <div className={styles.headerActionGroup}>
                <MiniCart />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Header with Departments and Services */}
      <div className={styles.bottomHeader}>
        <div className={styles.container}>
          <div className={styles.bottomHeaderContent}>
            <div className={styles.navDropdowns}>
              <button 
                className={`${styles.navDropdownButton} ${showDepartmentsMenu ? styles.active : ''}`}
                onClick={toggleDepartmentsMenu}
                aria-expanded={showDepartmentsMenu}
              >
                <FaBars className={styles.menuIcon} />
                <span>Departments</span>
              </button>
              
              <button 
                className={`${styles.navDropdownButton} ${showServicesMenu ? styles.active : ''}`}
                onClick={toggleServicesMenu}
                aria-expanded={showServicesMenu}
              >
                <span>Services</span>
              </button>
            </div>
            
            <nav className={styles.mainNav}>
              <ul className={styles.navLinks}>
                <li><Link to="/medicines">Medicines</Link></li>
                <li><Link to="/lab-tests">Lab Tests</Link></li>
                <li><Link to="/doctors">Doctors</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
                <li><Link to="/compare">Compare</Link></li>
                <li><Link to="/product-listing">Products</Link></li>
                <li><Link to="/search-results">Search</Link></li>
              </ul>
            </nav>
            
            {/* Mobile menu toggle removed as requested */}
          </div>
        </div>
      </div>
      
      {/* Departments Mega Menu */}
      {showDepartmentsMenu && (
        <div className={styles.megaMenu}>
          <div className={styles.container}>
            <div className={styles.departmentsGrid}>
              <div className={styles.megaMenuColumn}>
                <h3 className={styles.megaMenuTitle}>Medicines</h3>
                <ul className={styles.megaMenuList}>
                  <li><Link to="/medicines/all">All Medicines</Link></li>
                  <li><Link to="/medicines/prescription">Prescription</Link></li>
                  <li><Link to="/medicines/otc">Over-the-Counter</Link></li>
                  <li><Link to="/medicines/generic">Generic Alternatives</Link></li>
                </ul>
              </div>
              <div className={styles.megaMenuColumn}>
                <h3 className={styles.megaMenuTitle}>Health Conditions</h3>
                <ul className={styles.megaMenuList}>
                  <li><Link to="/conditions/diabetes">Diabetes</Link></li>
                  <li><Link to="/conditions/heart">Heart Disease</Link></li>
                  <li><Link to="/conditions/hypertension">Hypertension</Link></li>
                  <li><Link to="/conditions/respiratory">Respiratory</Link></li>
                </ul>
              </div>
              <div className={styles.megaMenuColumn}>
                <h3 className={styles.megaMenuTitle}>Medical Supplies</h3>
                <ul className={styles.megaMenuList}>
                  <li><Link to="/supplies/first-aid">First Aid</Link></li>
                  <li><Link to="/supplies/home-tests">Home Tests</Link></li>
                  <li><Link to="/supplies/mobility">Mobility Aids</Link></li>
                  <li><Link to="/supplies/medical-devices">Medical Devices</Link></li>
                  <li><Link to="/supplies/home-care">Home Care</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Services Mega Menu */}
      {showServicesMenu && (
        <div className={styles.megaMenu}>
          <div className={styles.container}>
            <div className={styles.servicesGrid}>
              <div className={styles.megaMenuColumn}>
                <h3 className={styles.megaMenuTitle}>Health Services</h3>
                <ul className={styles.megaMenuList}>
                  <li><Link to="/services/lab-tests">Lab Tests</Link></li>
                  <li><Link to="/services/doctor-consultation">Doctor Consultation</Link></li>
                  <li><Link to="/services/health-checkup">Health Checkups</Link></li>
                  <li><Link to="/services/vaccination">Vaccination</Link></li>
                </ul>
              </div>
              <div className={styles.megaMenuColumn}>
                <h3 className={styles.megaMenuTitle}>Pharmacy Services</h3>
                <ul className={styles.megaMenuList}>
                  <li><Link to="/services/prescription-refill">Prescription Refill</Link></li>
                  <li><Link to="/services/medication-review">Medication Review</Link></li>
                  <li><Link to="/services/drug-information">Drug Information</Link></li>
                  <li><Link to="/services/home-delivery">Home Delivery</Link></li>
                </ul>
              </div>
              <div className={styles.megaMenuColumn}>
                <h3 className={styles.megaMenuTitle}>Wellness Programs</h3>
                <ul className={styles.megaMenuList}>
                  <li><Link to="/services/care-plan">Care Plan</Link></li>
                  <li><Link to="/services/diabetes-program">Diabetes Management</Link></li>
                  <li><Link to="/services/weight-management">Weight Management</Link></li>
                  <li><Link to="/services/senior-care">Senior Care</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Login/Signup Modals */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={closeModals}
        onSignUpClick={openSignUpModal}
      />
      
      <SignUpModal 
        isOpen={showSignUpModal}
        onClose={closeModals}
        onLoginClick={openLoginModal}
      />
      
      {/* Mobile Menu removed as requested */}
    </header>
  );
};

export default Header;
