import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaClock, 
  FaChevronDown, 
  FaChevronUp,
  FaCheck,
  FaShieldAlt,
  FaFlask,
  FaFileMedicalAlt,
  FaHome,
  FaStar
} from 'react-icons/fa';
import styles from './LabTests.module.css';

// Mock data for lab tests
const labTests = [
  {
    id: 'lt1',
    name: 'Complete Blood Count (CBC)',
    description: 'Measures different components of your blood to check for infections, anemia, and other health issues.',
    price: 299,
    mrp: 599,
    discount: 50,
    reportTime: '24 Hours',
    homeCollection: true,
    parameters: 32,
    rating: 4.8,
    ratingCount: 1245,
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    recommended: true
  },
  {
    id: 'lt2',
    name: 'Diabetes Screening',
    description: 'Comprehensive test to check blood sugar levels and assess risk of diabetes.',
    price: 499,
    mrp: 999,
    discount: 50,
    reportTime: '24 Hours',
    homeCollection: true,
    parameters: 15,
    rating: 4.7,
    ratingCount: 987,
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'lt3',
    name: 'Thyroid Profile',
    description: 'Measures thyroid hormone levels to check for thyroid disorders.',
    price: 399,
    mrp: 799,
    discount: 50,
    reportTime: '24 Hours',
    homeCollection: true,
    parameters: 8,
    rating: 4.9,
    ratingCount: 1056,
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'lt4',
    name: 'Liver Function Test',
    description: 'Evaluates the health of your liver by measuring proteins, enzymes, and bilirubin levels.',
    price: 599,
    mrp: 1199,
    discount: 50,
    reportTime: '24 Hours',
    homeCollection: true,
    parameters: 12,
    rating: 4.6,
    ratingCount: 876,
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'lt5',
    name: 'Vitamin D Test',
    description: 'Measures the level of Vitamin D in your blood to check for deficiency.',
    price: 699,
    mrp: 1399,
    discount: 50,
    reportTime: '24 Hours',
    homeCollection: true,
    parameters: 1,
    rating: 4.7,
    ratingCount: 654,
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'lt6',
    name: 'COVID-19 Antibody Test',
    description: 'Detects antibodies developed after COVID-19 infection or vaccination.',
    price: 799,
    mrp: 1599,
    discount: 50,
    reportTime: '24 Hours',
    homeCollection: true,
    parameters: 2,
    rating: 4.8,
    ratingCount: 1432,
    image: 'https://images.unsplash.com/photo-1584483720412-ce931f4aefa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  }
];

// Mock data for popular packages
const popularPackages = [
  {
    id: 'pp1',
    name: 'Comprehensive Full Body Checkup',
    description: 'Complete health assessment with 90+ tests including liver, kidney, heart, thyroid, and more.',
    price: 1999,
    mrp: 3999,
    discount: 50,
    reportTime: '24 Hours',
    homeCollection: true,
    parameters: 90,
    rating: 4.9,
    ratingCount: 2345,
    image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    recommended: true
  },
  {
    id: 'pp2',
    name: 'Women\'s Health Package',
    description: 'Complete health assessment for women including hormonal tests, vitamin levels, and more.',
    price: 1499,
    mrp: 2999,
    discount: 50,
    reportTime: '24 Hours',
    homeCollection: true,
    parameters: 65,
    rating: 4.8,
    ratingCount: 1876,
    image: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'pp3',
    name: 'Men\'s Health Package',
    description: 'Complete health assessment for men including cardiac risk, prostate health, and more.',
    price: 1499,
    mrp: 2999,
    discount: 50,
    reportTime: '24 Hours',
    homeCollection: true,
    parameters: 60,
    rating: 4.7,
    ratingCount: 1654,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'pp4',
    name: 'Senior Citizen Health Package',
    description: 'Comprehensive health assessment for seniors with focus on age-related health concerns.',
    price: 2499,
    mrp: 4999,
    discount: 50,
    reportTime: '24 Hours',
    homeCollection: true,
    parameters: 100,
    rating: 4.9,
    ratingCount: 1432,
    image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  }
];

// Mock data for health concerns
const healthConcerns = [
  { id: 'hc1', name: 'Fever', image: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
  { id: 'hc2', name: 'Diabetes', image: 'https://images.unsplash.com/photo-1579126038374-6064e9370f0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
  { id: 'hc3', name: 'Thyroid', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
  { id: 'hc4', name: 'Heart', image: 'https://images.unsplash.com/photo-1559757152-0ce3f52fa59c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
  { id: 'hc5', name: 'COVID-19', image: 'https://images.unsplash.com/photo-1584483720412-ce931f4aefa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
  { id: 'hc6', name: 'Pregnancy', image: 'https://images.unsplash.com/photo-1584187839132-d9a2e9a5a848?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' }
];

const LabTests = () => {
  const [location, setLocation] = useState('Delhi');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingDetails, setBookingDetails] = useState({
    patientName: '',
    patientAge: '',
    patientGender: '',
    patientMobile: '',
    patientEmail: '',
    appointmentDate: '',
    appointmentTime: '',
    address: ''
  });
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle booking button click
  const handleBookTest = (test) => {
    setSelectedTest(test);
    setShowBookingModal(true);
    setBookingStep(1);
  };
  
  // Handle booking form input change
  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle booking step navigation
  const handleNextStep = () => {
    if (bookingStep < 3) {
      setBookingStep(prev => prev + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (bookingStep > 1) {
      setBookingStep(prev => prev - 1);
    }
  };
  
  // Handle booking submission
  const handleSubmitBooking = (e) => {
    e.preventDefault();
    console.log('Booking submitted:', { test: selectedTest, details: bookingDetails });
    // Here you would submit the booking to your backend
    
    // Close modal and reset form
    setShowBookingModal(false);
    setSelectedTest(null);
    setBookingStep(1);
    setBookingDetails({
      patientName: '',
      patientAge: '',
      patientGender: '',
      patientMobile: '',
      patientEmail: '',
      appointmentDate: '',
      appointmentTime: '',
      address: ''
    });
  };
  
  // Test card component
  const TestCard = ({ test }) => {
    const [expanded, setExpanded] = useState(false);
    
    return (
      <div className={styles.testCard}>
        {test.recommended && (
          <div className={styles.recommendedTag}>Recommended</div>
        )}
        
        <div className={styles.testCardHeader}>
          <div className={styles.testImage}>
            <img src={test.image} alt={test.name} />
          </div>
          <div className={styles.testInfo}>
            <h3 className={styles.testName}>{test.name}</h3>
            <p className={styles.testDescription}>{test.description}</p>
            
            <div className={styles.testMeta}>
              <div className={styles.metaItem}>
                <FaFlask />
                <span>{test.parameters} Parameters</span>
              </div>
              <div className={styles.metaItem}>
                <FaClock />
                <span>Report in {test.reportTime}</span>
              </div>
              <div className={styles.metaItem}>
                <FaHome />
                <span>Home Collection</span>
              </div>
            </div>
            
            {test.rating && (
              <div className={styles.testRating}>
                <span className={styles.ratingValue}>
                  {test.rating} <FaStar />
                </span>
                <span className={styles.ratingCount}>({test.ratingCount})</span>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.testCardFooter}>
          <div className={styles.testPricing}>
            <span className={styles.discountedPrice}>₹{test.price}</span>
            <span className={styles.mrp}>₹{test.mrp}</span>
            <span className={styles.discountTag}>{test.discount}% OFF</span>
          </div>
          
          <button 
            className={styles.bookButton}
            onClick={() => handleBookTest(test)}
          >
            BOOK NOW
          </button>
        </div>
        
        <div 
          className={styles.viewDetailsButton}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              Hide Details <FaChevronUp />
            </>
          ) : (
            <>
              View Details <FaChevronDown />
            </>
          )}
        </div>
        
        {expanded && (
          <div className={styles.testDetails}>
            <h4>Test Details</h4>
            <p>
              {test.description} This test is conducted by certified professionals
              and the samples are analyzed in state-of-the-art laboratories to ensure
              accurate results.
            </p>
            
            <h4>Sample Collection</h4>
            <p>
              Our trained phlebotomist will visit your home at the scheduled time
              to collect the sample. Please ensure you are fasting for at least 8-10 hours
              before the sample collection for accurate results.
            </p>
            
            <h4>Report Delivery</h4>
            <p>
              The test report will be delivered within {test.reportTime} after sample collection.
              You will receive the report via email and it will also be available in your account.
            </p>
          </div>
        )}
      </div>
    );
  };
  
  // Booking modal component
  const BookingModal = () => {
    if (!showBookingModal) return null;
    
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2>Book Lab Test</h2>
            <button 
              className={styles.closeButton}
              onClick={() => setShowBookingModal(false)}
            >
              &times;
            </button>
          </div>
          
          <div className={styles.modalBody}>
            <div className={styles.bookingSteps}>
              <div className={`${styles.step} ${bookingStep >= 1 ? styles.active : ''}`}>
                <div className={styles.stepNumber}>1</div>
                <span>Patient Details</span>
              </div>
              <div className={styles.stepConnector}></div>
              <div className={`${styles.step} ${bookingStep >= 2 ? styles.active : ''}`}>
                <div className={styles.stepNumber}>2</div>
                <span>Appointment</span>
              </div>
              <div className={styles.stepConnector}></div>
              <div className={`${styles.step} ${bookingStep >= 3 ? styles.active : ''}`}>
                <div className={styles.stepNumber}>3</div>
                <span>Confirmation</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmitBooking}>
              {bookingStep === 1 && (
                <div className={styles.formStep}>
                  <h3>Patient Details</h3>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="patientName">Full Name</label>
                    <input 
                      type="text" 
                      id="patientName" 
                      name="patientName" 
                      value={bookingDetails.patientName} 
                      onChange={handleBookingInputChange}
                      required
                    />
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="patientAge">Age</label>
                      <input 
                        type="number" 
                        id="patientAge" 
                        name="patientAge" 
                        value={bookingDetails.patientAge} 
                        onChange={handleBookingInputChange}
                        required
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="patientGender">Gender</label>
                      <select 
                        id="patientGender" 
                        name="patientGender" 
                        value={bookingDetails.patientGender} 
                        onChange={handleBookingInputChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="patientMobile">Mobile Number</label>
                    <input 
                      type="tel" 
                      id="patientMobile" 
                      name="patientMobile" 
                      value={bookingDetails.patientMobile} 
                      onChange={handleBookingInputChange}
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="patientEmail">Email Address</label>
                    <input 
                      type="email" 
                      id="patientEmail" 
                      name="patientEmail" 
                      value={bookingDetails.patientEmail} 
                      onChange={handleBookingInputChange}
                      required
                    />
                  </div>
                </div>
              )}
              
              {bookingStep === 2 && (
                <div className={styles.formStep}>
                  <h3>Appointment Details</h3>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="appointmentDate">Preferred Date</label>
                    <input 
                      type="date" 
                      id="appointmentDate" 
                      name="appointmentDate" 
                      value={bookingDetails.appointmentDate} 
                      onChange={handleBookingInputChange}
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="appointmentTime">Preferred Time</label>
                    <select 
                      id="appointmentTime" 
                      name="appointmentTime" 
                      value={bookingDetails.appointmentTime} 
                      onChange={handleBookingInputChange}
                      required
                    >
                      <option value="">Select Time Slot</option>
                      <option value="06:00 - 08:00">06:00 AM - 08:00 AM</option>
                      <option value="08:00 - 10:00">08:00 AM - 10:00 AM</option>
                      <option value="10:00 - 12:00">10:00 AM - 12:00 PM</option>
                      <option value="12:00 - 14:00">12:00 PM - 02:00 PM</option>
                      <option value="14:00 - 16:00">02:00 PM - 04:00 PM</option>
                      <option value="16:00 - 18:00">04:00 PM - 06:00 PM</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="address">Collection Address</label>
                    <textarea 
                      id="address" 
                      name="address" 
                      value={bookingDetails.address} 
                      onChange={handleBookingInputChange}
                      required
                    ></textarea>
                  </div>
                </div>
              )}
              
              {bookingStep === 3 && (
                <div className={styles.formStep}>
                  <h3>Confirm Booking</h3>
                  
                  <div className={styles.bookingSummary}>
                    <div className={styles.summaryTest}>
                      <h4>{selectedTest.name}</h4>
                      <div className={styles.summaryPrice}>
                        <span className={styles.discountedPrice}>₹{selectedTest.price}</span>
                        <span className={styles.mrp}>₹{selectedTest.mrp}</span>
                      </div>
                    </div>
                    
                    <div className={styles.summaryDetails}>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Patient:</span>
                        <span className={styles.summaryValue}>
                          {bookingDetails.patientName}, {bookingDetails.patientAge} years, {bookingDetails.patientGender}
                        </span>
                      </div>
                      
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Contact:</span>
                        <span className={styles.summaryValue}>
                          {bookingDetails.patientMobile}, {bookingDetails.patientEmail}
                        </span>
                      </div>
                      
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Appointment:</span>
                        <span className={styles.summaryValue}>
                          {bookingDetails.appointmentDate}, {bookingDetails.appointmentTime}
                        </span>
                      </div>
                      
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Address:</span>
                        <span className={styles.summaryValue}>
                          {bookingDetails.address}
                        </span>
                      </div>
                    </div>
                    
                    <div className={styles.paymentSummary}>
                      <div className={styles.paymentItem}>
                        <span>Test Price</span>
                        <span>₹{selectedTest.mrp}</span>
                      </div>
                      <div className={styles.paymentItem}>
                        <span>Discount</span>
                        <span>-₹{selectedTest.mrp - selectedTest.price}</span>
                      </div>
                      <div className={styles.paymentItem}>
                        <span>Home Collection</span>
                        <span>Free</span>
                      </div>
                      <div className={`${styles.paymentItem} ${styles.totalItem}`}>
                        <span>Total Amount</span>
                        <span>₹{selectedTest.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className={styles.modalFooter}>
                {bookingStep > 1 && (
                  <button 
                    type="button" 
                    className={styles.backButton}
                    onClick={handlePrevStep}
                  >
                    Back
                  </button>
                )}
                
                {bookingStep < 3 ? (
                  <button 
                    type="button" 
                    className={styles.nextButton}
                    onClick={handleNextStep}
                  >
                    Next
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className={styles.confirmButton}
                  >
                    Confirm Booking
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className={styles.labTests}>
      <div className={styles.container}>
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Lab Tests & Health Checkups</h1>
            <p>Book diagnostic tests from the comfort of your home with free sample collection</p>
            
            <div className={styles.searchContainer}>
              <div className={styles.locationSelector}>
                <FaMapMarkerAlt />
                <select 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
              </div>
              
              <div className={styles.searchBox}>
                <FaSearch />
                <input 
                  type="text" 
                  placeholder="Search for tests, packages, and more" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <FaShieldAlt />
            </div>
            <div className={styles.featureText}>
              <h3>NABL Certified Labs</h3>
              <p>Accurate & reliable results</p>
            </div>
          </div>
          
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <FaHome />
            </div>
            <div className={styles.featureText}>
              <h3>Free Home Collection</h3>
              <p>Samples collected at your convenience</p>
            </div>
          </div>
          
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <FaFileMedicalAlt />
            </div>
            <div className={styles.featureText}>
              <h3>Digital Reports</h3>
              <p>Receive reports online</p>
            </div>
          </div>
        </div>
        
        {/* Health Concerns Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Browse Tests by Health Concern</h2>
            <Link to="/lab-tests/all" className={styles.viewAllLink}>
              View All
            </Link>
          </div>
          
          <div className={styles.healthConcerns}>
            {healthConcerns.map(concern => (
              <Link 
                to={`/lab-tests/concern/${concern.id}`} 
                key={concern.id}
                className={styles.concernCard}
              >
                <div className={styles.concernImage}>
                  <img src={concern.image} alt={concern.name} />
                </div>
                <h3>{concern.name}</h3>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Popular Packages Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Popular Health Packages</h2>
            <Link to="/lab-tests/packages" className={styles.viewAllLink}>
              View All
            </Link>
          </div>
          
          <div className={styles.testGrid}>
            {popularPackages.map(test => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </div>
        
        {/* Individual Tests Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Popular Lab Tests</h2>
            <Link to="/lab-tests/all" className={styles.viewAllLink}>
              View All
            </Link>
          </div>
          
          <div className={styles.testGrid}>
            {labTests.map(test => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className={styles.faqSection}>
          <h2>Frequently Asked Questions</h2>
          
          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3>How do I book a lab test?</h3>
              <p>
                You can book a lab test by selecting the test or package you want, 
                providing your details, selecting a convenient date and time for sample 
                collection, and confirming your booking.
              </p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>Is fasting required for blood tests?</h3>
              <p>
                Fasting requirements vary depending on the test. For tests like blood glucose, 
                lipid profile, etc., 8-12 hours of fasting is typically required. Specific 
                instructions will be provided when you book the test.
              </p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>How are samples collected?</h3>
              <p>
                A trained phlebotomist will visit your home at the scheduled time to collect 
                the sample. They will carry all necessary equipment and follow strict hygiene 
                protocols.
              </p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>How will I receive my test reports?</h3>
              <p>
                Your test reports will be sent to you via email and will also be available 
                in your account on our website/app. You can download and print them as needed.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Modal */}
      <BookingModal />
    </div>
  );
};

export default LabTests;
