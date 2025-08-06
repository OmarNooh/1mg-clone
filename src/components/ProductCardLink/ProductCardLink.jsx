import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * ProductCardLink - A wrapper component that makes product cards clickable and navigable to product detail page
 * @param {Object} props - Component props
 * @param {string} props.to - The URL to navigate to
 * @param {React.ReactNode} props.children - The content to be wrapped
 * @param {string} props.className - Optional CSS class name
 * @returns {React.ReactElement} - Rendered component
 */
const ProductCardLink = ({ to, children, className }) => {
  return (
    <Link 
      to={to} 
      className={className} 
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      {children}
    </Link>
  );
};

ProductCardLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default ProductCardLink;
