import React, { useState, useEffect, useRef } from 'react';
import { FaUsers, FaShoppingCart, FaBoxes, FaChartLine, FaSync, FaChevronDown, FaCalendarAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './AdminComponents.module.css';
import { OrderAPI, ProductAPI, UserAPI } from '../../../backend/api/index';

const Overview = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showChecksDropdown, setShowChecksDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCheck, setSelectedCheck] = useState('All');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarView, setCalendarView] = useState('date'); // 'date', 'month', or 'year'
  const [yearRange, setYearRange] = useState([2020, 2029]); // Range of years to display
  const calendarRef = useRef(null);
  const checksDropdownRef = useRef(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
      if (checksDropdownRef.current && !checksDropdownRef.current.contains(event.target)) {
        setShowChecksDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleCalendar = () => {
    console.log('Calendar toggle clicked, current state:', showCalendar);
    setShowCalendar(!showCalendar);
    setShowChecksDropdown(false);
  };
  
  const toggleChecksDropdown = () => {
    setShowChecksDropdown(!showChecksDropdown);
    setShowCalendar(false);
  };
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };
  
  const handleCheckSelect = (check) => {
    setSelectedCheck(check);
    setShowChecksDropdown(false);
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextYear = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1));
  };

  const prevYear = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1));
  };

  const nextDecade = () => {
    const startYear = yearRange[0] + 10;
    setYearRange([startYear, startYear + 9]);
  };

  const prevDecade = () => {
    const startYear = yearRange[0] - 10;
    setYearRange([startYear, startYear + 9]);
  };

  const switchToMonthView = () => {
    setCalendarView('month');
  };

  const switchToYearView = () => {
    setCalendarView('year');
  };

  const switchToDateView = () => {
    setCalendarView('date');
  };

  const handleMonthSelect = (month) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), month, 1));
    setCalendarView('date');
  };

  const handleYearSelect = (year) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setCalendarView('month');
  };
  
  const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  const renderCalendar = () => {
    if (!showCalendar) return null;
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Helper functions for date calculations
    const getThisWeekStart = () => {
      const today = new Date();
      const day = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const diff = today.getDate() - day;
      return new Date(today.setDate(diff));
    };
    
    const getLastWeekStart = () => {
      const thisWeek = getThisWeekStart();
      const lastWeek = new Date(thisWeek);
      lastWeek.setDate(thisWeek.getDate() - 7);
      return lastWeek;
    };
    
    const getThisMonthStart = () => {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), 1);
    };
    
    const getLastMonthStart = () => {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth() - 1, 1);
    };
    
    const getThisYearStart = () => {
      const today = new Date();
      return new Date(today.getFullYear(), 0, 1);
    };
    
    const getLastYearStart = () => {
      const today = new Date();
      return new Date(today.getFullYear() - 1, 0, 1);
    };
    
    // Sidebar content is the same for all views
    const sidebarContent = (
      <div className={styles.calendarSidebar}>
        <button className={styles.calendarOption} onClick={() => {
          const today = new Date();
          setSelectedDate(today);
          setCurrentMonth(today);
          setCalendarView('date');
          handleDateSelect(today);
        }}>Today</button>
        <button className={styles.calendarOption} onClick={() => {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          setSelectedDate(yesterday);
          setCurrentMonth(yesterday);
          setCalendarView('date');
          handleDateSelect(yesterday);
        }}>Yesterday</button>
        <button className={styles.calendarOption} onClick={() => {
          const thisWeek = getThisWeekStart();
          setSelectedDate(thisWeek);
          setCurrentMonth(thisWeek);
          setCalendarView('date');
          handleDateSelect(thisWeek);
        }}>This week</button>
        <button className={styles.calendarOption} onClick={() => {
          const lastWeek = getLastWeekStart();
          setSelectedDate(lastWeek);
          setCurrentMonth(lastWeek);
          setCalendarView('date');
          handleDateSelect(lastWeek);
        }}>Last week</button>
        <button className={styles.calendarOption} onClick={() => {
          const thisMonth = getThisMonthStart();
          setSelectedDate(thisMonth);
          setCurrentMonth(thisMonth);
          setCalendarView('date');
          handleDateSelect(thisMonth);
        }}>This month</button>
        <button className={styles.calendarOption} onClick={() => {
          const lastMonth = getLastMonthStart();
          setSelectedDate(lastMonth);
          setCurrentMonth(lastMonth);
          setCalendarView('date');
          handleDateSelect(lastMonth);
        }}>Last month</button>
        <button className={styles.calendarOption} onClick={() => {
          const thisYear = getThisYearStart();
          setSelectedDate(thisYear);
          setCurrentMonth(thisYear);
          setCalendarView('date');
          handleDateSelect(thisYear);
        }}>This year</button>
        <button className={styles.calendarOption} onClick={() => {
          const lastYear = getLastYearStart();
          setSelectedDate(lastYear);
          setCurrentMonth(lastYear);
          setCalendarView('date');
          handleDateSelect(lastYear);
        }}>Last year</button>
        <button className={styles.customOption} onClick={() => {
          setCalendarView('year');
        }}>Custom</button>
      </div>
    );
    
    // Render date view (days of the month)
    const renderDateView = () => {
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      const days = [];
      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className={styles.calendarDay}></div>);
      }
      
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const isSelected = 
          selectedDate.getDate() === i && 
          selectedDate.getMonth() === month && 
          selectedDate.getFullYear() === year;
        
        days.push(
          <div 
            key={`day-${i}`} 
            className={`${styles.calendarDay} ${isSelected ? styles.selectedDay : ''}`}
            onClick={() => handleDateSelect(date)}
          >
            {i}
          </div>
        );
      }
      
      const monthName = currentMonth.toLocaleString('default', { month: 'long' });
      
      return (
        <div className={styles.calendarContent}>
          <div className={styles.calendarHeader}>
            <button className={styles.calendarNavButton} onClick={prevMonth}>
              <FaArrowLeft />
            </button>
            <div 
              className={styles.calendarTitle} 
              onClick={switchToMonthView}
            >
              {monthName} {year} <FaChevronDown />
            </div>
            <button className={styles.calendarNavButton} onClick={nextMonth}>
              <FaArrowRight />
            </button>
          </div>
          <div className={styles.calendarGrid}>
            <div className={styles.calendarDay}>Sun</div>
            <div className={styles.calendarDay}>Mon</div>
            <div className={styles.calendarDay}>Tue</div>
            <div className={styles.calendarDay}>Wed</div>
            <div className={styles.calendarDay}>Thu</div>
            <div className={styles.calendarDay}>Fri</div>
            <div className={styles.calendarDay}>Sat</div>
            {days}
          </div>
        </div>
      );
    };
    
    // Render month view (12 months of the year)
    const renderMonthView = () => {
      const months = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
      ];
      
      return (
        <div className={styles.calendarContent}>
          <div className={styles.calendarHeader}>
            <button className={styles.calendarNavButton} onClick={prevYear}>
              <FaArrowLeft />
            </button>
            <div 
              className={styles.calendarTitle}
              onClick={switchToYearView}
            >
              {year} <FaChevronDown />
            </div>
            <button className={styles.calendarNavButton} onClick={nextYear}>
              <FaArrowRight />
            </button>
          </div>
          <div className={styles.monthGrid}>
            {months.map((monthName, index) => {
              const isSelected = month === index && currentMonth.getFullYear() === year;
              return (
                <div 
                  key={monthName} 
                  className={`${styles.monthItem} ${isSelected ? styles.selectedMonth : ''}`}
                  onClick={() => handleMonthSelect(index)}
                >
                  {monthName.substring(0, 3)}
                </div>
              );
            })}
          </div>
        </div>
      );
    };
    
    // Render year view (decade of years)
    const renderYearView = () => {
      const years = [];
      for (let i = yearRange[0]; i <= yearRange[1]; i++) {
        years.push(i);
      }
      
      return (
        <div className={styles.calendarContent}>
          <div className={styles.calendarHeader}>
            <button className={styles.calendarNavButton} onClick={prevDecade}>
              <FaArrowLeft />
            </button>
            <div className={styles.calendarTitle}>
              {yearRange[0]} - {yearRange[1]}
            </div>
            <button className={styles.calendarNavButton} onClick={nextDecade}>
              <FaArrowRight />
            </button>
          </div>
          <div className={styles.yearGrid}>
            {years.map(yearNum => {
              const isSelected = yearNum === year;
              return (
                <div 
                  key={yearNum} 
                  className={`${styles.yearItem} ${isSelected ? styles.selectedYear : ''}`}
                  onClick={() => handleYearSelect(yearNum)}
                >
                  {yearNum}
                </div>
              );
            })}
          </div>
        </div>
      );
    };
    
    // Determine which view to render
    let contentView;
    switch (calendarView) {
      case 'month':
        contentView = renderMonthView();
        break;
      case 'year':
        contentView = renderYearView();
        break;
      default: // 'date'
        contentView = renderDateView();
    }
    
    return (
      <div className={styles.calendarDropdown} ref={calendarRef}>
        {sidebarContent}
        {contentView}
      </div>
    );
  };
  
  const renderChecksDropdown = () => {
    if (!showChecksDropdown) return null;
    
    return (
      <div className={styles.checksDropdown} ref={checksDropdownRef}>
        <button className={styles.dropdownOption} onClick={() => handleCheckSelect('All')}>All</button>
        <button className={styles.dropdownOption} onClick={() => handleCheckSelect('Paid')}>Paid</button>
        <button className={styles.dropdownOption} onClick={() => handleCheckSelect('Unpaid')}>Unpaid</button>
      </div>
    );
  };
  
  const [stats, setStats] = useState([
    { id: 'sales', label: 'Total Sales', value: '...', icon: <FaChartLine />, color: '#0071dc' },
    { id: 'orders', label: 'Orders', value: '...', icon: <FaShoppingCart />, color: '#ffc220' },
    { id: 'products', label: 'Products', value: '...', icon: <FaBoxes />, color: '#2a8703' },
    { id: 'customers', label: 'Customers', value: '...', icon: <FaUsers />, color: '#e91e63' },
  ]);
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  
  const [loading, setLoading] = useState({
    stats: true,
    orders: true,
    products: true
  });
  
  const [error, setError] = useState({
    stats: null,
    orders: null,
    products: null
  });
  
  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch stats
      try {
        const [salesData, ordersCount, productsCount, customersCount] = await Promise.all([
          OrderAPI.getTotalSales(),
          OrderAPI.getOrdersCount(),
          ProductAPI.getProductsCount(),
          UserAPI.getCustomersCount()
        ]);
        
        setStats([
          { id: 'sales', label: 'Total Sales', value: `TZS ${salesData.toLocaleString()}`, icon: <FaChartLine />, color: '#0071dc' },
          { id: 'orders', label: 'Orders', value: ordersCount.toString(), icon: <FaShoppingCart />, color: '#ffc220' },
          { id: 'products', label: 'Products', value: productsCount.toLocaleString(), icon: <FaBoxes />, color: '#2a8703' },
          { id: 'customers', label: 'Customers', value: customersCount.toString(), icon: <FaUsers />, color: '#e91e63' },
        ]);
        
        setLoading(prev => ({ ...prev, stats: false }));
        setError(prev => ({ ...prev, stats: null }));
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(prev => ({ ...prev, stats: 'Failed to load statistics' }));
        setLoading(prev => ({ ...prev, stats: false }));
      }
      
      // Fetch recent orders
      try {
        const orders = await OrderAPI.getRecentOrders(5); // Get 5 most recent orders
        setRecentOrders(orders.map(order => ({
          id: order.id || 'N/A',
          customer: order.customerName || order.email || 'Unknown',
          date: order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A',
          status: order.status || 'Processing',
          total: order.totalAmount || (order.total ? `TZS ${parseFloat(order.total.replace(/[^0-9.]/g, '')).toLocaleString()}` : 'TZS 0')
        })));
        
        setLoading(prev => ({ ...prev, orders: false }));
        setError(prev => ({ ...prev, orders: null }));
      } catch (err) {
        console.error('Error fetching recent orders:', err);
        setError(prev => ({ ...prev, orders: 'Failed to load recent orders' }));
        setLoading(prev => ({ ...prev, orders: false }));
      }
      
      // Fetch top products
      try {
        const products = await ProductAPI.getTopSellingProducts(5); // Get top 5 selling products
        setTopProducts(products.map(product => ({
          id: product.id,
          name: product.name,
          sales: product.salesCount,
          stock: product.stockQuantity
        })));
        
        setLoading(prev => ({ ...prev, products: false }));
        setError(prev => ({ ...prev, products: null }));
      } catch (err) {
        console.error('Error fetching top products:', err);
        setError(prev => ({ ...prev, products: 'Failed to load top products' }));
        setLoading(prev => ({ ...prev, products: false }));
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Function to retry loading data
  const handleRetry = async (section) => {
    setLoading(prev => ({ ...prev, [section]: true }));
    setError(prev => ({ ...prev, [section]: null }));
    
    try {
      if (section === 'stats') {
        const [salesData, ordersCount, productsCount, customersCount] = await Promise.all([
          OrderAPI.getTotalSales(),
          OrderAPI.getOrdersCount(),
          ProductAPI.getProductsCount(),
          UserAPI.getCustomersCount()
        ]);
        
        setStats([
          { id: 'sales', label: 'Total Sales', value: `TZS ${salesData.toLocaleString()}`, icon: <FaChartLine />, color: '#0071dc' },
          { id: 'orders', label: 'Orders', value: ordersCount.toString(), icon: <FaShoppingCart />, color: '#ffc220' },
          { id: 'products', label: 'Products', value: productsCount.toLocaleString(), icon: <FaBoxes />, color: '#2a8703' },
          { id: 'customers', label: 'Customers', value: customersCount.toString(), icon: <FaUsers />, color: '#e91e63' },
        ]);
      } else if (section === 'orders') {
        const orders = await OrderAPI.getRecentOrders(5);
        setRecentOrders(orders.map(order => ({
          id: order.id || 'N/A',
          customer: order.customerName || order.email || 'Unknown',
          date: order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A',
          status: order.status || 'Processing',
          total: order.totalAmount || (order.total ? `TZS ${parseFloat(order.total.replace(/[^0-9.]/g, '')).toLocaleString()}` : 'TZS 0')
        })));
      } else if (section === 'products') {
        const products = await ProductAPI.getTopSellingProducts(5);
        setTopProducts(products.map(product => ({
          id: product.id,
          name: product.name,
          sales: product.salesCount,
          stock: product.stockQuantity
        })));
      }
      
      setLoading(prev => ({ ...prev, [section]: false }));
    } catch (err) {
      console.error(`Error retrying ${section}:`, err);
      setError(prev => ({ ...prev, [section]: `Failed to load ${section}` }));
      setLoading(prev => ({ ...prev, [section]: false }));
    }
  };
  
  // Render loading or error state for stats
  const renderStatsSection = () => {
    if (loading.stats) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading statistics...</p>
        </div>
      );
    }
    
    if (error.stats) {
      return (
        <div className={styles.errorContainer}>
          <p>{error.stats}</p>
          <button 
            className={styles.retryButton}
            onClick={() => handleRetry('stats')}
          >
            <FaSync /> Retry
          </button>
        </div>
      );
    }
    
    return (
      <div className={styles.statsGrid}>
        {stats.map(stat => (
          <div 
            key={stat.id} 
            className={styles.statCard}
            style={{ borderColor: stat.color }}
          >
            <div className={styles.statIcon} style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className={styles.statInfo}>
              <h3 className={styles.statValue}>{stat.value}</h3>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render loading or error state for recent orders
  const renderRecentOrdersSection = () => {
    if (loading.orders) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading recent orders...</p>
        </div>
      );
    }
    
    if (error.orders) {
      return (
        <div className={styles.errorContainer}>
          <p>{error.orders}</p>
          <button 
            className={styles.retryButton}
            onClick={() => handleRetry('orders')}
          >
            <FaSync /> Retry
          </button>
        </div>
      );
    }
    
    return (
      <div className={styles.tableContainer}>
        {recentOrders.length > 0 ? (
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>
                    <span className={`${styles.status} ${styles[order.status.toLowerCase()] || styles.processing}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noData}>No recent orders found</p>
        )}
      </div>
    );
  };
  
  // Render loading or error state for top products
  const renderTopProductsSection = () => {
    if (loading.products) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading top products...</p>
        </div>
      );
    }
    
    if (error.products) {
      return (
        <div className={styles.errorContainer}>
          <p>{error.products}</p>
          <button 
            className={styles.retryButton}
            onClick={() => handleRetry('products')}
          >
            <FaSync /> Retry
          </button>
        </div>
      );
    }
    
    return (
      <div className={styles.tableContainer}>
        {topProducts.length > 0 ? (
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Sales</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.sales}</td>
                  <td>
                    <span className={product.stock < 50 ? styles.lowStock : ''}>
                      {product.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noData}>No top products found</p>
        )}
      </div>
    );
  };
  
  return (
    <div className={styles.overview}>
      <div className={styles.dashboardHeader}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeText}>Welcome back.</h1>
          <div className={styles.headerActions}>
            <button className={styles.actionButton}>Go to Balance</button>
            <button className={styles.actionButton}>Take a payment</button>
            <button className={styles.actionButton}>Edit a menu</button>
            <button className={styles.actionButton}>Add an item</button>
            <button className={styles.moreButton}>•••</button>
          </div>
        </div>
        
        <div className={styles.performanceSection}>
          <h2 className={styles.performanceTitle}>Performance</h2>
          <div className={styles.filterSection}>
            <button className={styles.filterButton} onClick={toggleCalendar}>
              <span className={styles.filterButtonLabel}>Date</span>
              <span className={styles.filterButtonValue}>{formatDate(selectedDate)}</span>
            </button>
            <button className={styles.filterButton} onClick={toggleChecksDropdown}>
              <span className={styles.filterButtonLabel}>Checks</span>
              <span className={styles.filterButtonValue}>{selectedCheck}</span>
            </button>
            {renderCalendar()}
            {renderChecksDropdown()}
          </div>
          
          <div className={styles.metricsSection}>
            <h1 className={styles.metricsTitle}>Key Metrics</h1>
            
            {renderStatsSection()}
          </div>
        </div>
      </div>
      
      <div className={styles.dashboardRow}>
        <div className={styles.dashboardColumn}>
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h2>Customers</h2>
            </div>
            <div className={styles.customerStats}>
              <div className={styles.customerStat}>
                <span className={styles.statLabel}>Total customers</span>
                <span className={styles.statValue}>0</span>
              </div>
              <div className={styles.customerStat}>
                <span className={styles.statLabel}>Returning customers</span>
                <span className={styles.statValue}>0</span>
              </div>
              <div className={styles.customerStat}>
                <span className={styles.statLabel}>Avg. visits per customer</span>
                <span className={styles.statValue}>0</span>
              </div>
              <div className={styles.customerStat}>
                <span className={styles.statLabel}>Avg. spent per visit</span>
                <span className={styles.statValue}>TZS 0.00</span>
              </div>
              <div className={styles.customerStat}>
                <span className={styles.statLabel}>Feedback</span>
                <span className={styles.statValue}>0 positive, 0 negative</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.dashboardColumn}>
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h2>Payment Types</h2>
              <span className={styles.cardSubtitle}>by Payment amount</span>
            </div>
            <div className={styles.paymentChart}>
              <div className={styles.paymentBar} style={{ width: '100%', backgroundColor: '#0070E0' }}></div>
              <div className={styles.paymentTypes}>
                <div className={styles.paymentType}>
                  <span className={styles.paymentColor} style={{ backgroundColor: '#0070E0' }}></span>
                  <span className={styles.paymentName}>Cash</span>
                  <span className={styles.paymentAmount}>TZS 267,960.00</span>
                  <span className={styles.paymentPercentage}>100%</span>
                </div>
                <div className={styles.paymentType}>
                  <span className={styles.paymentColor} style={{ backgroundColor: '#007D2A' }}></span>
                  <span className={styles.paymentName}>Card</span>
                  <span className={styles.paymentAmount}>TZS 0.00</span>
                  <span className={styles.paymentPercentage}>0%</span>
                </div>
                <div className={styles.paymentType}>
                  <span className={styles.paymentColor} style={{ backgroundColor: '#FFC220' }}></span>
                  <span className={styles.paymentName}>Other</span>
                  <span className={styles.paymentAmount}>TZS 0.00</span>
                  <span className={styles.paymentPercentage}>0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        

      </div>
      
      <div className={styles.dashboardRow}>
        <div className={styles.dashboardColumn}>
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h2>Categories</h2>
              <span className={styles.cardSubtitle}>by Gross sales</span>
            </div>
            <div className={styles.categoriesChart}>
              <div className={styles.barChartContainer}>
                <div className={styles.barChart}>
                  {[
                    { value: 5, color: '#87CEEB', label: 'INHALERS', amount: 'TZS 5,000.00' },
                    { value: 10, color: '#DDA0DD', label: 'DROPS', amount: 'TZS 10,000.00' },
                    { value: 15, color: '#FFA07A', label: 'SYRUPS', amount: 'TZS 15,000.00' },
                    { value: 25, color: '#90EE90', label: 'TABLETS', amount: 'TZS 25,000.00' },
                    { value: 35, color: '#FFD700', label: 'INJECTIONS', amount: 'TZS 35,000.00' },
                    { value: 50, color: '#F2F2F2', label: 'CAPSULES', amount: 'TZS 50,000.00' },
                    { value: 65, color: '#E5EFFE', label: 'LIQUID', amount: 'TZS 65,000.00' },
                    { value: 75, color: '#0070E0', label: 'TABLETS', amount: 'TZS 75,000.00' },
                    { value: 80, color: '#87CEEB', label: 'INHALERS', amount: 'TZS 80,000.00' },
                    { value: 90, color: '#DDA0DD', label: 'DROPS', amount: 'TZS 90,000.00' },
                    { value: 95, color: '#FFA07A', label: 'SYRUPS', amount: 'TZS 95,000.00' },
                    { value: 100, color: '#90EE90', label: 'TABLETS', amount: 'TZS 100,000.00' }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className={styles.barChartBar} 
                      style={{ 
                        height: `${item.value}%`,
                        backgroundColor: item.color,
                        width: 'calc((100% - 44px) / 12)',
                        marginLeft: index > 0 ? '15px' : '0'
                      }}
                    >
                      <span className={styles.barChartValue}>{item.amount}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.barChartAxis}>
                  <span>Lowest</span>
                  <span>Highest</span>
                </div>
              </div>
              <div className={styles.categoriesList}>
                {[
                        { color: '#87CEEB', name: 'INHALERS', amount: 'TZS 5,000.00', quantity: '5' },
                        { color: '#DDA0DD', name: 'DROPS', amount: 'TZS 10,000.00', quantity: '10' },
                        { color: '#FFA07A', name: 'SYRUPS', amount: 'TZS 15,000.00', quantity: '15' },
                        { color: '#90EE90', name: 'TABLETS', amount: 'TZS 25,000.00', quantity: '25' },
                        { color: '#FFD700', name: 'INJECTIONS', amount: 'TZS 35,000.00', quantity: '35' },
                        { color: '#F2F2F2', name: 'CAPSULES', amount: 'TZS 50,000.00', quantity: '50' },
                        { color: '#E5EFFE', name: 'LIQUID', amount: 'TZS 65,000.00', quantity: '65' },
                        { color: '#0070E0', name: 'TABLETS', amount: 'TZS 75,000.00', quantity: '75' },
                        { color: '#87CEEB', name: 'INHALERS', amount: 'TZS 80,000.00', quantity: '80' },
                        { color: '#DDA0DD', name: 'DROPS', amount: 'TZS 90,000.00', quantity: '90' },
                        { color: '#FFA07A', name: 'SYRUPS', amount: 'TZS 95,000.00', quantity: '95' },
                        { color: '#90EE90', name: 'TABLETS', amount: 'TZS 100,000.00', quantity: '100' }  
                ].map((item, index) => (
                  <div key={index} className={styles.categoryRow}>
                    <span className={styles.categoryColor} style={{ backgroundColor: item.color }}></span>
                    <span className={styles.categoryName}>{item.name}</span>
                    <span className={styles.categoryAmount}>{item.amount}</span>
                    <span className={styles.categoryQuantity}>{item.quantity}</span>
                  </div>    
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.dashboardColumn}>
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h2>Items</h2>
              <span className={styles.cardSubtitle}>by Gross sales</span>
            </div>
            <div className={styles.itemsChart}>
              <div className={styles.barChartContainer}>
                <div className={styles.barChart}>
                  {[
                 { color: '#87CEEB', name: 'INHALERS', amount: 'TZS 5,000.00', quantity: '5' },
                 { color: '#DDA0DD', name: 'DROPS', amount: 'TZS 10,000.00', quantity: '10' },
                 { color: '#FFA07A', name: 'SYRUPS', amount: 'TZS 15,000.00', quantity: '15' },
                 { color: '#90EE90', name: 'TABLETS', amount: 'TZS 25,000.00', quantity: '25' },
                 { color: '#FFD700', name: 'INJECTIONS', amount: 'TZS 35,000.00', quantity: '35' },
                 { color: '#F2F2F2', name: 'CAPSULES', amount: 'TZS 50,000.00', quantity: '50' },
                 { color: '#E5EFFE', name: 'LIQUID', amount: 'TZS 65,000.00', quantity: '65' },
                 { color: '#0070E0', name: 'TABLETS', amount: 'TZS 75,000.00', quantity: '75' },
                 { color: '#87CEEB', name: 'INHALERS', amount: 'TZS 80,000.00', quantity: '80' },
                 { color: '#DDA0DD', name: 'DROPS', amount: 'TZS 90,000.00', quantity: '90' },
                 { color: '#FFA07A', name: 'SYRUPS', amount: 'TZS 95,000.00', quantity: '95' },
                 { color: '#90EE90', name: 'TABLETS', amount: 'TZS 100,000.00', quantity: '100' }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className={styles.barChartBar} 
                      style={{ 
                        height: `${item.value}%`,
                        backgroundColor: item.color,
                        marginLeft: index > 0 ? '4px' : '0'
                      }}
                    >
                      <span className={styles.barChartValue}>{item.amount}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.barChartAxis}>
                  <span>Lowest</span>
                  <span>Highest</span>
                </div>
              </div>
              <div className={styles.itemsList}>
                {[
                  { color: '#87CEEB', name: 'INHALERS', amount: 'TZS 5,000.00', quantity: '5' },
                  { color: '#DDA0DD', name: 'DROPS', amount: 'TZS 10,000.00', quantity: '10' },
                  { color: '#FFA07A', name: 'SYRUPS', amount: 'TZS 15,000.00', quantity: '15' },
                  { color: '#90EE90', name: 'TABLETS', amount: 'TZS 25,000.00', quantity: '25' },
                  { color: '#FFD700', name: 'INJECTIONS', amount: 'TZS 35,000.00', quantity: '35' },
                  { color: '#F2F2F2', name: 'CAPSULES', amount: 'TZS 50,000.00', quantity: '50' },
                  { color: '#E5EFFE', name: 'LIQUID', amount: 'TZS 65,000.00', quantity: '65' },
                  { color: '#0070E0', name: 'TABLETS', amount: 'TZS 75,000.00', quantity: '75' },
                  { color: '#87CEEB', name: 'INHALERS', amount: 'TZS 80,000.00', quantity: '80' },
                  { color: '#DDA0DD', name: 'DROPS', amount: 'TZS 90,000.00', quantity: '90' },
                  { color: '#FFA07A', name: 'SYRUPS', amount: 'TZS 95,000.00', quantity: '95' },
                  { color: '#90EE90', name: 'TABLETS', amount: 'TZS 100,000.00', quantity: '100' }
                ].map((item, index) => (
                  <div key={index} className={styles.itemRow}>
                    <span className={styles.itemColor} style={{ backgroundColor: item.color }}></span>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemAmount}>{item.amount}</span>
                    <span className={styles.itemQuantity}>{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
