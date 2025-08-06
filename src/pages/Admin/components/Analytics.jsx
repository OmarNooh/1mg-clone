import React, { useState, useEffect } from 'react';
import styles from './AdminComponents.module.css';
import { OrderAPI, ProductAPI } from '../../../backend/api/index';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for analytics data
  const [monthlySales, setMonthlySales] = useState([]);
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [customerMetrics, setCustomerMetrics] = useState({
    totalCustomers: 0,
    newCustomers: 0,
    returningRate: '0%',
    averageOrderValue: 'TZS 0.00',
  });
  const [topLocations, setTopLocations] = useState([]);
  
  // Fetch analytics data from API
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Fetch monthly sales data
        const salesData = await OrderAPI.getMonthlySales();
        setMonthlySales(salesData);
        
        // Fetch category performance data
        const categoryData = await ProductAPI.getCategoryPerformance();
        setCategoryPerformance(categoryData);
        
        // Fetch customer metrics
        const metrics = await OrderAPI.getCustomerMetrics();
        setCustomerMetrics(metrics);
        
        // Fetch top locations
        const locations = await OrderAPI.getTopLocations();
        setTopLocations(locations);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);
  
  // Calculate max sales for chart scaling
  const maxSales = monthlySales.length > 0 ? Math.max(...monthlySales.map(item => item.sales)) : 0;
  
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className={styles.analytics}>
      <div className={styles.analyticsSection}>
        <h2 className={styles.sectionTitle}>Sales Overview</h2>
        <div className={styles.chartContainer}>
          <div className={styles.barChart}>
            {monthlySales.map((item, index) => (
              <div key={index} className={styles.barChartItem}>
                <div 
                  className={styles.bar} 
                  style={{ 
                    height: `${(item.sales / maxSales) * 200}px`,
                    backgroundColor: index === monthlySales.length - 1 ? '#0071dc' : '#8cc7ff'
                  }}
                >
                  <span className={styles.barValue}>TZS {(item.sales / 1000).toFixed(1)}k</span>
                </div>
                <div className={styles.barLabel}>{item.month}</div>
              </div>
            ))}
          </div>
          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#8cc7ff' }}></div>
              <span>Previous Months</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#0071dc' }}></div>
              <span>Current Month</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.analyticsRow}>
        <div className={styles.analyticsCard}>
          <h2 className={styles.cardTitle}>Category Performance</h2>
          <div className={styles.pieChartContainer}>
            <div className={styles.pieChart}>
              {categoryPerformance.map((item, index) => (
                <div 
                  key={index} 
                  className={styles.pieSlice}
                  style={{
                    '--percentage': `${item.sales}%`,
                    '--color': getColorForIndex(index),
                    '--rotation': getRotationForIndex(index, categoryPerformance)
                  }}
                ></div>
              ))}
              <div className={styles.pieCenter}>
                <span>Sales by Category</span>
              </div>
            </div>
            <div className={styles.pieChartLegend}>
              {categoryPerformance.map((item, index) => (
                <div key={index} className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: getColorForIndex(index) }}></div>
                  <div className={styles.legendText}>
                    <span>{item.category}</span>
                    <span className={styles.legendValue}>{item.sales}% ({item.growth})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className={styles.analyticsCard}>
          <h2 className={styles.cardTitle}>Customer Insights</h2>
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>Total Customers</h3>
              <p className={styles.metricValue}>{customerMetrics.totalCustomers}</p>
            </div>
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>New Customers</h3>
              <p className={styles.metricValue}>{customerMetrics.newCustomers}</p>
              <span className={styles.metricSubtext}>Last 30 days</span>
            </div>
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>Returning Rate</h3>
              <p className={styles.metricValue}>{customerMetrics.returningRate}</p>
            </div>
            <div className={styles.metricCard}>
              <h3 className={styles.metricTitle}>Avg. Order Value</h3>
              <p className={styles.metricValue}>{customerMetrics.averageOrderValue}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.analyticsSection}>
        <h2 className={styles.sectionTitle}>Top Locations</h2>
        <div className={styles.locationChart}>
          {topLocations.map((item, index) => (
            <div key={index} className={styles.locationItem}>
              <div className={styles.locationInfo}>
                <span className={styles.locationName}>{item.location}</span>
                <span className={styles.locationOrders}>{item.orders} orders</span>
              </div>
              <div className={styles.locationBarContainer}>
                <div 
                  className={styles.locationBar} 
                  style={{ 
                    width: item.percentage,
                    backgroundColor: getColorForIndex(index)
                  }}
                ></div>
                <span className={styles.locationPercentage}>{item.percentage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper functions for chart colors and rotations
function getColorForIndex(index) {
  const colors = ['#0071dc', '#ffc220', '#2a8703', '#e91e63', '#9c27b0'];
  return colors[index % colors.length];
}

function getRotationForIndex(index, data) {
  let rotation = 0;
  for (let i = 0; i < index; i++) {
    rotation += data[i].sales * 3.6; // 3.6 degrees per percentage point (360 / 100)
  }
  return `${rotation}deg`;
}

export default Analytics;
