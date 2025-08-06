import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import styles from './DoctorsSection.module.css';

const DoctorsSection = ({ doctors }) => {
  return (
    <div className={styles.doctorsSection}>
      <div className={styles.doctorsGrid}>
        {doctors.map((doctor) => (
          <div key={doctor.id} className={styles.doctorCard}>
            <div className={styles.doctorImage}>
              <img src={doctor.image} alt={doctor.name} />
            </div>
            <div className={styles.doctorContent}>
              <h3 className={styles.doctorName}>Dr. {doctor.name}</h3>
              <p className={styles.doctorSpecialization}>{doctor.specialization}</p>
              <p className={styles.doctorExperience}>{doctor.experience} years experience</p>
              
              {doctor.rating && (
                <div className={styles.doctorRating}>
                  <span className={styles.ratingValue}>
                    {doctor.rating} <FaStar />
                  </span>
                  <span className={styles.ratingCount}>({doctor.ratingCount} ratings)</span>
                </div>
              )}
              
              <div className={styles.consultationFee}>
                <span className={styles.feeLabel}>Consultation Fee:</span>
                <span className={styles.feeAmount}>₹{doctor.consultationFee}</span>
              </div>
              
              <Link to={`/doctors/${doctor.id}`} className={styles.consultButton}>
                Consult Now <FaArrowRight />
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.doctorsInfo}>
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>
            <img src="https://www.1mg.com/images/doctor_icon.png" alt="Doctor Icon" />
          </div>
          <div className={styles.infoContent}>
            <h4>Verified Doctors</h4>
            <p>All doctors are verified and have valid medical registrations</p>
          </div>
        </div>
        
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>
            <img src="https://www.1mg.com/images/consultation_icon.png" alt="Consultation Icon" />
          </div>
          <div className={styles.infoContent}>
            <h4>Digital Consultation</h4>
            <p>Consult via chat, audio or video call from the comfort of your home</p>
          </div>
        </div>
        
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>
            <img src="https://www.1mg.com/images/prescription_icon.png" alt="Prescription Icon" />
          </div>
          <div className={styles.infoContent}>
            <h4>Digital Prescription</h4>
            <p>Get digital prescriptions that can be used to order medicines online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsSection;
