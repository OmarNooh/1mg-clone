export const doctors = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    specialization: "Cardiology",
    experience: "15 years",
    qualification: "MBBS, MD (Cardiology)",
    clinicName: "Heart Care Clinic",
    location: "Delhi",
    consultationFee: 800,
    rating: 4.8,
    ratingCount: 235,
    availability: [
      {
        day: "Monday",
        slots: ["10:00 AM", "11:00 AM", "12:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"]
      },
      {
        day: "Tuesday",
        slots: ["10:00 AM", "11:00 AM", "12:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"]
      },
      {
        day: "Wednesday",
        slots: ["10:00 AM", "11:00 AM", "12:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"]
      },
      {
        day: "Thursday",
        slots: ["10:00 AM", "11:00 AM", "12:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"]
      },
      {
        day: "Friday",
        slots: ["10:00 AM", "11:00 AM", "12:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"]
      }
    ],
    about: "Dr. Rajesh Kumar is a renowned cardiologist with over 15 years of experience in treating heart-related conditions. He specializes in interventional cardiology and has performed more than 5000 successful procedures."
  },
  {
    id: 2,
    name: "Dr. Priya Sharma",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    specialization: "Dermatology",
    experience: "10 years",
    qualification: "MBBS, MD (Dermatology)",
    clinicName: "Skin Care Clinic",
    location: "Mumbai",
    consultationFee: 700,
    rating: 4.7,
    ratingCount: 189,
    availability: [
      {
        day: "Monday",
        slots: ["9:00 AM", "10:00 AM", "11:00 AM", "5:00 PM", "6:00 PM", "7:00 PM"]
      },
      {
        day: "Wednesday",
        slots: ["9:00 AM", "10:00 AM", "11:00 AM", "5:00 PM", "6:00 PM", "7:00 PM"]
      },
      {
        day: "Friday",
        slots: ["9:00 AM", "10:00 AM", "11:00 AM", "5:00 PM", "6:00 PM", "7:00 PM"]
      }
    ],
    about: "Dr. Priya Sharma is a skilled dermatologist with 10 years of experience in treating various skin conditions. She specializes in cosmetic dermatology and has helped numerous patients achieve healthy and glowing skin."
  },
  {
    id: 3,
    name: "Dr. Amit Patel",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    specialization: "Orthopedics",
    experience: "12 years",
    qualification: "MBBS, MS (Orthopedics)",
    clinicName: "Bone & Joint Care",
    location: "Bangalore",
    consultationFee: 750,
    rating: 4.6,
    ratingCount: 210,
    availability: [
      {
        day: "Tuesday",
        slots: ["10:00 AM", "11:00 AM", "12:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"]
      },
      {
        day: "Thursday",
        slots: ["10:00 AM", "11:00 AM", "12:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"]
      },
      {
        day: "Saturday",
        slots: ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]
      }
    ],
    about: "Dr. Amit Patel is an experienced orthopedic surgeon with 12 years of practice in treating bone and joint disorders. He specializes in sports injuries and joint replacement surgeries."
  },
  {
    id: 4,
    name: "Dr. Sunita Gupta",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    specialization: "Gynecology",
    experience: "14 years",
    qualification: "MBBS, MD (Gynecology)",
    clinicName: "Women's Health Clinic",
    location: "Chennai",
    consultationFee: 850,
    rating: 4.9,
    ratingCount: 278,
    availability: [
      {
        day: "Monday",
        slots: ["9:00 AM", "10:00 AM", "11:00 AM", "4:00 PM", "5:00 PM", "6:00 PM"]
      },
      {
        day: "Wednesday",
        slots: ["9:00 AM", "10:00 AM", "11:00 AM", "4:00 PM", "5:00 PM", "6:00 PM"]
      },
      {
        day: "Friday",
        slots: ["9:00 AM", "10:00 AM", "11:00 AM", "4:00 PM", "5:00 PM", "6:00 PM"]
      }
    ],
    about: "Dr. Sunita Gupta is a renowned gynecologist with 14 years of experience in women's health. She specializes in high-risk pregnancies and gynecological surgeries."
  },
  {
    id: 5,
    name: "Dr. Vikram Singh",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    specialization: "Pediatrics",
    experience: "11 years",
    qualification: "MBBS, MD (Pediatrics)",
    clinicName: "Child Care Clinic",
    location: "Hyderabad",
    consultationFee: 650,
    rating: 4.7,
    ratingCount: 195,
    availability: [
      {
        day: "Monday",
        slots: ["10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"]
      },
      {
        day: "Tuesday",
        slots: ["10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"]
      },
      {
        day: "Thursday",
        slots: ["10:00 AM", "11:00 AM", "12:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"]
      },
      {
        day: "Saturday",
        slots: ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]
      }
    ],
    about: "Dr. Vikram Singh is a dedicated pediatrician with 11 years of experience in child healthcare. He specializes in pediatric infectious diseases and newborn care."
  },
  {
    id: 6,
    name: "Dr. Meera Reddy",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    specialization: "Neurology",
    experience: "13 years",
    qualification: "MBBS, DM (Neurology)",
    clinicName: "Brain & Nerve Care",
    location: "Kolkata",
    consultationFee: 900,
    rating: 4.8,
    ratingCount: 220,
    availability: [
      {
        day: "Tuesday",
        slots: ["9:00 AM", "10:00 AM", "11:00 AM", "4:00 PM", "5:00 PM", "6:00 PM"]
      },
      {
        day: "Thursday",
        slots: ["9:00 AM", "10:00 AM", "11:00 AM", "4:00 PM", "5:00 PM", "6:00 PM"]
      },
      {
        day: "Saturday",
        slots: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"]
      }
    ],
    about: "Dr. Meera Reddy is a skilled neurologist with 13 years of experience in treating neurological disorders. She specializes in headache management, epilepsy, and stroke care."
  },
  {
    id: 7,
    name: "Dr. Rahul Verma",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    specialization: "Endocrinology",
    experience: "9 years",
    qualification: "MBBS, DM (Endocrinology)",
    clinicName: "Diabetes & Hormone Care",
    location: "Pune",
    consultationFee: 800,
    rating: 4.6,
    ratingCount: 175,
    availability: [
      {
        day: "Monday",
        slots: ["10:00 AM", "11:00 AM", "12:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"]
      },
      {
        day: "Wednesday",
        slots: ["10:00 AM", "11:00 AM", "12:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"]
      },
      {
        day: "Friday",
        slots: ["10:00 AM", "11:00 AM", "12:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"]
      }
    ],
    about: "Dr. Rahul Verma is an endocrinologist with 9 years of experience in treating hormonal disorders. He specializes in diabetes management and thyroid disorders."
  },
  {
    id: 8,
    name: "Dr. Ananya Das",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    specialization: "Psychiatry",
    experience: "8 years",
    qualification: "MBBS, MD (Psychiatry)",
    clinicName: "Mind Care Clinic",
    location: "Delhi",
    consultationFee: 750,
    rating: 4.7,
    ratingCount: 160,
    availability: [
      {
        day: "Tuesday",
        slots: ["9:00 AM", "10:00 AM", "11:00 AM", "5:00 PM", "6:00 PM", "7:00 PM"]
      },
      {
        day: "Thursday",
        slots: ["9:00 AM", "10:00 AM", "11:00 AM", "5:00 PM", "6:00 PM", "7:00 PM"]
      },
      {
        day: "Saturday",
        slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]
      }
    ],
    about: "Dr. Ananya Das is a compassionate psychiatrist with 8 years of experience in mental health care. She specializes in anxiety disorders, depression, and stress management."
  }
];

export default doctors;
