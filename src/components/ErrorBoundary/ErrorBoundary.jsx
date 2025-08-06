import React, { Component } from 'react';
import styles from './ErrorBoundary.module.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("React Error Boundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
    
    // Optional: send to error logging service
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className={styles.errorContainer}>
          <h2>Something went wrong.</h2>
          <details className={styles.errorDetails}>
            <summary>Show error details</summary>
            <p>{this.state.error && this.state.error.toString()}</p>
            <div className={styles.componentStack}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </div>
          </details>
          <button 
            className={styles.resetButton}
            onClick={() => {
              this.setState({ hasError: false, error: null, errorInfo: null });
              window.location.reload();
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
