// Script to create an admin user directly in localStorage
// Run this script with: node create-admin.js

// Admin user data
const adminUser = {
  id: "admin-" + Date.now().toString(),
  name: "Admin User",
  email: "admin@hoodmedical.com",
  phone: "+255712345678",
  address: "Dar es Salaam, Tanzania",
  password: "Admin@123", // In a real app, this would be hashed
  role: "ADMIN", // This is the important part for admin access
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  loginCount: 1,
  status: "active",
  wishlist: [],
  settings: {
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    privacy: {
      shareData: false
    }
  }
};

// Function to add the admin user to localStorage
function createAdminUser() {
  try {
    // Get existing users or create empty array
    const existingUsersJson = localStorage.getItem('hood_medical_users');
    const users = existingUsersJson ? JSON.parse(existingUsersJson) : [];
    
    // Check if admin user already exists
    const adminExists = users.some(user => user.email === adminUser.email);
    
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }
    
    // Add admin user
    users.push(adminUser);
    
    // Save back to localStorage
    localStorage.setItem('hood_medical_users', JSON.stringify(users));
    
    console.log('Admin user created successfully');
    console.log('Email: admin@hoodmedical.com');
    console.log('Password: Admin@123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Execute in browser environment
if (typeof window !== 'undefined') {
  createAdminUser();
} else {
  console.log('This script must be run in a browser environment');
}
