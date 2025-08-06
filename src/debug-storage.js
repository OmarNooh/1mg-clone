// Debug script to check local storage state
console.log('Checking local storage state...');

// Storage keys
const USERS_STORAGE_KEY = 'hood_medical_users';
const CURRENT_USER_KEY = 'hood_medical_current_user';

// Get users from storage
const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY));
console.log('Users in storage:', users);

// Check if admin user exists
if (users) {
  const adminUser = users.find(user => user.email === 'admin@hoodmedical.com');
  console.log('Admin user found:', adminUser);
}

// Get current user session
const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
console.log('Current user session:', currentUser);

// Export function to reset storage
window.resetStorage = () => {
  localStorage.removeItem(USERS_STORAGE_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
  console.log('Storage reset complete. Please refresh the page to re-initialize.');
};

console.log('To reset storage, run: resetStorage()');
