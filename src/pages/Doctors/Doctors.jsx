import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Doctors.module.css';
import {
  FaSearch,
  FaMapMarkerAlt,
  FaFilter,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCalendarAlt,
  FaVideo,
  FaPhoneAlt,
  FaChevronDown,
  FaChevronUp,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

// Mock data for specializations
const specializations = [
  { id: 'sp1', name: 'General Physician', count: 120 },
  { id: 'sp2', name: 'Dermatologist', count: 85 },
  { id: 'sp3', name: 'Pediatrician', count: 64 },
  { id: 'sp4', name: 'Gynecologist', count: 52 },
  { id: 'sp5', name: 'Orthopedist', count: 48 },
  { id: 'sp6', name: 'Cardiologist', count: 43 },
  { id: 'sp7', name: 'Neurologist', count: 38 },
  { id: 'sp8', name: 'Psychiatrist', count: 35 },
  { id: 'sp9', name: 'Endocrinologist', count: 30 },
  { id: 'sp10', name: 'Ophthalmologist', count: 28 },
];

// Mock data for doctors
const doctorsData = [
  {
    id: 'doc1',
    name: 'Dr. Rajesh Kumar',
    specialization: 'General Physician',
    experience: 15,
    rating: 4.8,
    reviewCount: 235,
    consultationFee: 499,
    nextAvailable: '10:00 AM Today',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    languages: ['English', 'Hindi'],
    education: 'MBBS, MD - General Medicine',
    specializations: ['sp1'],
  },
  {
    id: 'doc2',
    name: 'Dr. Priya Sharma',
    specialization: 'Dermatologist',
    experience: 10,
    rating: 4.9,
    reviewCount: 187,
    consultationFee: 699,
    nextAvailable: '11:30 AM Today',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    languages: ['English', 'Hindi', 'Tamil'],
    education: 'MBBS, MD - Dermatology',
    specializations: ['sp2'],
  },
  {
    id: 'doc3',
    name: 'Dr. Amit Patel',
    specialization: 'Pediatrician',
    experience: 12,
    rating: 4.7,
    reviewCount: 156,
    consultationFee: 599,
    nextAvailable: '02:15 PM Today',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    languages: ['English', 'Hindi', 'Gujarati'],
    education: 'MBBS, MD - Pediatrics',
    specializations: ['sp3'],
  },
  {
    id: 'doc4',
    name: 'Dr. Neha Gupta',
    specialization: 'Gynecologist',
    experience: 14,
    rating: 4.9,
    reviewCount: 210,
    consultationFee: 799,
    nextAvailable: '04:30 PM Today',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    languages: ['English', 'Hindi'],
    education: 'MBBS, MD - Obstetrics & Gynecology',
    specializations: ['sp4'],
  },
  {
    id: 'doc5',
    name: 'Dr. Suresh Reddy',
    specialization: 'Orthopedist',
    experience: 18,
    rating: 4.8,
    reviewCount: 178,
    consultationFee: 899,
    nextAvailable: '11:00 AM Tomorrow',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    languages: ['English', 'Hindi', 'Telugu'],
    education: 'MBBS, MS - Orthopedics',
    specializations: ['sp5'],
  },
  {
    id: 'doc6',
    name: 'Dr. Ananya Singh',
    specialization: 'Cardiologist',
    experience: 16,
    rating: 4.9,
    reviewCount: 195,
    consultationFee: 999,
    nextAvailable: '01:45 PM Tomorrow',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    languages: ['English', 'Hindi'],
    education: 'MBBS, MD - Cardiology',
    specializations: ['sp6'],
  },
];

const Doctors = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Delhi');
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    appointmentType: 'video',
    appointmentDate: '',
    appointmentTime: '',
    patientName: '',
    patientAge: '',
    patientGender: '',
    patientMobile: '',
    patientEmail: '',
    symptoms: '',
  });
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle specialization filter change
  const handleSpecializationChange = (specializationId) => {
    setSelectedSpecializations(prev => {
      if (prev.includes(specializationId)) {
        return prev.filter(id => id !== specializationId);
      } else {
        return [...prev, specializationId];
      }
    });
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Filter and sort doctors
  const filteredDoctors = doctorsData.filter(doctor => {
    // Filter by search query
    if (searchQuery && !doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by specialization
    if (selectedSpecializations.length > 0 && 
        !doctor.specializations.some(sp => selectedSpecializations.includes(sp))) {
      return false;
    }
    
    return true;
  });
  
  // Sort doctors
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    switch (sortBy) {
      case 'experience':
        return b.experience - a.experience;
      case 'rating':
        return b.rating - a.rating;
      case 'fee_low_to_high':
        return a.consultationFee - b.consultationFee;
      case 'fee_high_to_low':
        return b.consultationFee - a.consultationFee;
      default: // relevance
        return b.rating * 0.7 + b.experience * 0.3 - (a.rating * 0.7 + a.experience * 0.3);
    }
  });
  
  // Handle booking button click
  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };
  
  // Handle booking form input change
  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle booking submission
  const handleSubmitBooking = (e) => {
    e.preventDefault();
    console.log('Booking submitted:', { doctor: selectedDoctor, details: bookingDetails });
    // Here you would submit the booking to your backend
    
    // Close modal and reset form
    setShowBookingModal(false);
    setSelectedDoctor(null);
    setBookingDetails({
      appointmentType: 'video',
      appointmentDate: '',
      appointmentTime: '',
      patientName: '',
      patientAge: '',
      patientGender: '',
      patientMobile: '',
      patientEmail: '',
      symptoms: '',
    });
  };
  
  // Render star ratings
  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className={styles.starIcon} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className={styles.starIcon} />);
      } else {
        stars.push(<FaRegStar key={i} className={styles.starIcon} />);
      }
    }
    
    return stars;
  };
  
  // Doctor card component
  const DoctorCard = ({ doctor }) => {
    const [expanded, setExpanded] = useState(false);
    
    return (
      <div className={styles.doctorCard}>
        <div className={styles.doctorCardHeader}>
          <div className={styles.doctorImage}>
            <img src={doctor.image} alt={doctor.name} />
          </div>
          <div className={styles.doctorInfo}>
            <h3 className={styles.doctorName}>{doctor.name}</h3>
            <p className={styles.doctorSpecialization}>{doctor.specialization}</p>
            
            <div className={styles.doctorMeta}>
              <span className={styles.experience}>{doctor.experience} years exp</span>
              <div className={styles.rating}>
                <div className={styles.stars}>
                  {renderStarRating(doctor.rating)}
                </div>
                <span className={styles.ratingValue}>{doctor.rating}</span>
                <span className={styles.reviewCount}>({doctor.reviewCount})</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.doctorCardBody}>
          <div className={styles.consultationInfo}>
            <div className={styles.consultationFee}>
              <span className={styles.feeLabel}>Consultation Fee</span>
              <span className={styles.feeValue}>₹{doctor.consultationFee}</span>
            </div>
            <div className={styles.nextAvailable}>
              <span className={styles.availableLabel}>Next Available</span>
              <span className={styles.availableValue}>{doctor.nextAvailable}</span>
            </div>
          </div>
          
          <div className={styles.consultationTypes}>
            <button className={styles.videoConsult}>
              <FaVideo /> Video Consult
            </button>
            <button className={styles.audioConsult}>
              <FaPhoneAlt /> Audio Consult
            </button>
          </div>
          
          <button 
            className={styles.bookButton}
            onClick={() => handleBookAppointment(doctor)}
          >
            Book Appointment
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
          <div className={styles.doctorDetails}>
            <div className={styles.detailSection}>
              <h4>Education</h4>
              <p>{doctor.education}</p>
            </div>
            
            <div className={styles.detailSection}>
              <h4>Languages</h4>
              <p>{doctor.languages.join(', ')}</p>
            </div>
            
            <div className={styles.detailSection}>
              <h4>About</h4>
              <p>
                {doctor.name} is a highly qualified {doctor.specialization} with {doctor.experience} years 
                of experience. Specializes in diagnosing and treating various health conditions with 
                a patient-centric approach.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Booking modal component
  const BookingModal = () => {
    if (!showBookingModal || !selectedDoctor) return null;
    
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2>Book Appointment</h2>
            <button 
              className={styles.closeButton}
              onClick={() => setShowBookingModal(false)}
            >
              &times;
            </button>
          </div>
          
          <div className={styles.modalBody}>
            <div className={styles.doctorSummary}>
              <div className={styles.doctorSummaryImage}>
                <img src={selectedDoctor.image} alt={selectedDoctor.name} />
              </div>
              <div className={styles.doctorSummaryInfo}>
                <h3>{selectedDoctor.name}</h3>
                <p>{selectedDoctor.specialization}</p>
                <div className={styles.doctorSummaryRating}>
                  {renderStarRating(selectedDoctor.rating)}
                  <span>{selectedDoctor.rating} ({selectedDoctor.reviewCount})</span>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmitBooking}>
              <div className={styles.formSection}>
                <h3>Appointment Type</h3>
                <div className={styles.appointmentTypes}>
                  <label className={`${styles.appointmentType} ${bookingDetails.appointmentType === 'video' ? styles.active : ''}`}>
                    <input 
                      type="radio" 
                      name="appointmentType" 
                      value="video" 
                      checked={bookingDetails.appointmentType === 'video'}
                      onChange={handleBookingInputChange}
                    />
                    <FaVideo /> Video Consultation
                  </label>
                  <label className={`${styles.appointmentType} ${bookingDetails.appointmentType === 'audio' ? styles.active : ''}`}>
                    <input 
                      type="radio" 
                      name="appointmentType" 
                      value="audio" 
                      checked={bookingDetails.appointmentType === 'audio'}
                      onChange={handleBookingInputChange}
                    />
                    <FaPhoneAlt /> Audio Consultation
                  </label>
                </div>
              </div>
              
              <div className={styles.formSection}>
                <h3>Select Date & Time</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="appointmentDate">
                      <FaCalendarAlt /> Date
                    </label>
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
                    <label htmlFor="appointmentTime">Time Slot</label>
                    <select 
                      id="appointmentTime" 
                      name="appointmentTime" 
                      value={bookingDetails.appointmentTime} 
                      onChange={handleBookingInputChange}
                      required
                    >
                      <option value="">Select Time</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className={styles.formSection}>
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
              
              <div className={styles.formSection}>
                <h3>Health Concern</h3>
                <div className={styles.formGroup}>
                  <label htmlFor="symptoms">Describe your symptoms</label>
                  <textarea 
                    id="symptoms" 
                    name="symptoms" 
                    value={bookingDetails.symptoms} 
                    onChange={handleBookingInputChange}
                    placeholder="Please describe your symptoms or health concern"
                    required
                  ></textarea>
                </div>
              </div>
              
              <div className={styles.paymentSummary}>
                <div className={styles.paymentItem}>
                  <span>Consultation Fee</span>
                  <span>₹{selectedDoctor.consultationFee}</span>
                </div>
                <div className={styles.paymentItem}>
                  <span>Platform Fee</span>
                  <span>₹50</span>
                </div>
                <div className={`${styles.paymentItem} ${styles.totalItem}`}>
                  <span>Total Amount</span>
                  <span>₹{selectedDoctor.consultationFee + 50}</span>
                </div>
              </div>
              
              <div className={styles.modalFooter}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowBookingModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.confirmButton}
                >
                  Confirm & Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className={styles.doctors}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Consult with Specialist Doctors</h1>
          <p>Private online consultations with verified doctors in all specialists</p>
          
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
                placeholder="Search doctors, specialties" 
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.container}>
        {/* Mobile Filter Toggle */}
        <div 
          className={styles.mobileFilterToggle}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </div>
        
        <div className={styles.mainContent}>
          {/* Filters Section */}
          <div className={`${styles.filtersSection} ${showFilters ? styles.showFilters : ''}`}>
            <div className={styles.filterHeader}>
              <h2>Filters</h2>
              <button 
                className={styles.clearFilters}
                onClick={() => setSelectedSpecializations([])}
              >
                Clear All
              </button>
            </div>
            
            <div className={styles.filterGroup}>
              <h3>Specialization</h3>
              <div className={styles.filterOptions}>
                {specializations.map(specialization => (
                  <label key={specialization.id} className={styles.filterOption}>
                    <input 
                      type="checkbox" 
                      checked={selectedSpecializations.includes(specialization.id)}
                      onChange={() => handleSpecializationChange(specialization.id)}
                    />
                    <span className={styles.checkmark}>
                      {selectedSpecializations.includes(specialization.id) ? <FaCheck /> : null}
                    </span>
                    <span className={styles.optionLabel}>{specialization.name}</span>
                    <span className={styles.optionCount}>({specialization.count})</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          {/* Doctors List Section */}
          <div className={styles.doctorsListSection}>
            <div className={styles.listHeader}>
              <div className={styles.resultCount}>
                {sortedDoctors.length} {sortedDoctors.length === 1 ? 'Doctor' : 'Doctors'} available
              </div>
              
              <div className={styles.sortOptions}>
                <label htmlFor="sortBy">Sort by:</label>
                <select 
                  id="sortBy" 
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="relevance">Relevance</option>
                  <option value="experience">Experience</option>
                  <option value="rating">Rating</option>
                  <option value="fee_low_to_high">Fee: Low to High</option>
                  <option value="fee_high_to_low">Fee: High to Low</option>
                </select>
              </div>
            </div>
            
            {sortedDoctors.length > 0 ? (
              <div className={styles.doctorsList}>
                {sortedDoctors.map(doctor => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            ) : (
              <div className={styles.noDoctors}>
                <FaTimes className={styles.noResultsIcon} />
                <h3>No doctors found</h3>
                <p>Try changing your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Booking Modal */}
      <BookingModal />
    </div>
  );
};

export default Doctors;
