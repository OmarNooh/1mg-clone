import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerTop}>
          <div className={styles.footerColumn}>
            <h3>Know Us</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/press">Press Coverage</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/business">Business Partnership</Link></li>
              <li><Link to="/become-seller">Become a Health Partner</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerColumn}>
            <h3>Our Policies</h3>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms and Conditions</Link></li>
              <li><Link to="/editorial">Editorial Policy</Link></li>
              <li><Link to="/return">Return Policy</Link></li>
              <li><Link to="/ip">IP Policy</Link></li>
              <li><Link to="/grievance">Grievance Redressal Policy</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerColumn}>
            <h3>Our Services</h3>
            <ul>
              <li><Link to="/order-medicines">Order Medicines</Link></li>
              <li><Link to="/book-lab-tests">Book Lab Tests</Link></li>
              <li><Link to="/consult-doctors">Consult a Doctor</Link></li>
              <li><Link to="/ayurveda">Ayurveda Articles</Link></li>
              <li><Link to="/hindi">Hindi Articles</Link></li>
              <li><Link to="/care-plan">Care Plan</Link></li>
            </ul>
          </div>
          
          <div className={styles.footerColumn}>
            <h3>Connect</h3>
            <div className={styles.socialLinks}>
              <a href="https://www.facebook.com/hoodmedical" target="_blank" rel="noopener noreferrer">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com/hoodmedical" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://www.instagram.com/hoodmedical/" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://www.linkedin.com/company/hoodmedical" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn />
              </a>
              <a href="https://www.youtube.com/c/hoodmedical" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
            </div>
            <div className={styles.appDownload}>
              <h4>Download App</h4>
              <div className={styles.appLinks}>
                <a href="https://play.google.com/store/apps/details?id=com.hoodmedical.app" target="_blank" rel="noopener noreferrer">
                  <img src="https://www.1mg.com/images/google_play.png" alt="Google Play" />
                </a>
                <a href="https://apps.apple.com/tz/app/hoodmedical/id123456789" target="_blank" rel="noopener noreferrer">
                  <img src="https://www.1mg.com/images/app_store.png" alt="App Store" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.footerMiddle}>
          <div className={styles.reliableSection}>
            <div className={styles.reliableItem}>
              <img src="https://www.1mg.com/images/reliable_icon.png" alt="Reliable" />
              <div>
                <h4>Reliable</h4>
                <p>All products displayed on HOOD Medical are procured from verified and licensed pharmacies.</p>
              </div>
            </div>
            <div className={styles.reliableItem}>
              <img src="https://www.1mg.com/images/secure_icon.png" alt="Secure" />
              <div>
                <h4>Secure</h4>
                <p>All transactions on HOOD Medical are safe and secure.</p>
              </div>
            </div>
            <div className={styles.reliableItem}>
              <img src="https://www.1mg.com/images/affordable_icon.png" alt="Affordable" />
              <div>
                <h4>Affordable</h4>
                <p>Find affordable medicine substitutes, save up to 50% on health products.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <div className={styles.paymentOptions}>
            <span>Payment Options</span>
            <div className={styles.paymentIcons}>
              <img src="https://www.1mg.com/images/payment-icons/visa.png" alt="Visa" />
              <img src="https://www.1mg.com/images/payment-icons/mastercard.png" alt="Mastercard" />
              <img src="https://www.1mg.com/images/payment-icons/mpesa.png" alt="M-Pesa" />
              <img src="https://www.1mg.com/images/payment-icons/tigopesa.png" alt="Tigo Pesa" />
            </div>
          </div>
          <div className={styles.copyright}>
            <p>© 2025 HOOD Medical. All rights reserved. In compliance with Tanzania Food and Drugs Authority (TFDA) regulations and Tanzania Pharmacy Act.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
