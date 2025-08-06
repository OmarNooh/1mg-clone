import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserPlus, FaEdit, FaTrash, FaUserLock, FaUserCheck } from 'react-icons/fa';
import styles from './AdminComponents.module.css';
import { UserAPI } from '../../../backend/api/index';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const userData = await UserAPI.getAllUsers();
        setUsers(userData);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddUser = () => {
    setShowAddForm(true);
    setEditingUser(null);
  };
  
  const handleEditUser = async (user) => {
    try {
      // Get full user details if needed
      const fullUser = await UserAPI.getUserById(user.id);
      setEditingUser(fullUser || user);
      setShowAddForm(true);
    } catch (err) {
      console.error('Error fetching user details:', err);
      setEditingUser(user); // Fallback to basic user info
      setShowAddForm(true);
    }
  };
  
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await UserAPI.deleteUser(userId);
        setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user. Please try again.');
      }
    }
  };
  
  const handleToggleStatus = async (userId) => {
    try {
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) return;
      
      const newStatus = userToUpdate.status === 'Active' ? 'Inactive' : 'Active';
      await UserAPI.updateUserStatus(userId, newStatus);
      
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user.id === userId) {
            return {
              ...user,
              status: newStatus
            };
          }
          return user;
        })
      );
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Failed to update user status. Please try again.');
    }
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get form data
      const formData = new FormData(e.target);
      const userData = {
        id: editingUser ? editingUser.id : Date.now().toString(),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        role: formData.get('role'),
        status: formData.get('status'),
        joinDate: editingUser ? editingUser.joinDate : new Date().toISOString().split('T')[0],
        orders: editingUser ? editingUser.orders : 0
      };
      
      if (editingUser) {
        // Update existing user via API
        await UserAPI.updateUser(userData);
        setUsers(prevUsers => 
          prevUsers.map(u => u.id === editingUser.id ? userData : u)
        );
      } else {
        // Add new user via API
        const newUser = await UserAPI.createUser(userData);
        setUsers(prevUsers => [...prevUsers, newUser]);
      }
      
      // Reset form
      setShowAddForm(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Error saving user:', err);
      alert('Failed to save user. Please try again.');
    }
  };
  
  return (
    <div className={styles.userManagement}>
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading users...</p>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : !showAddForm ? (
        <>
          <div className={styles.userHeader}>
            <div className={styles.searchBar}>
              <FaSearch className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className={styles.addButton} onClick={handleAddUser}>
              <FaUserPlus /> Add User
            </button>
          </div>
          
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Orders</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`${styles.status} ${user.status === 'Active' ? styles.delivered : styles.cancelled || styles.processing}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.joinDate}</td>
                    <td>{user.orders}</td>
                    <td className={styles.actionButtons}>
                      <button 
                        className={styles.editButton}
                        onClick={() => handleEditUser(user)}
                        title="Edit User"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className={styles.statusButton}
                        onClick={() => handleToggleStatus(user.id)}
                        title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                      >
                        {user.status === 'Active' ? <FaUserLock /> : <FaUserCheck />}
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete User"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className={styles.noUsers}>
                <p>No users found matching your search.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className={styles.userForm}>
          <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
          <form onSubmit={handleFormSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Full Name</label>
              <input 
                type="text" 
                name="name" 
                className={styles.formInput}
                defaultValue={editingUser?.name || ''}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input 
                type="email" 
                name="email" 
                className={styles.formInput}
                defaultValue={editingUser?.email || ''}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Phone</label>
              <input 
                type="text" 
                name="phone" 
                className={styles.formInput}
                defaultValue={editingUser?.phone || ''}
                required
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Role</label>
                <select 
                  name="role" 
                  className={styles.formSelect}
                  defaultValue={editingUser?.role || 'Customer'}
                  required
                >
                  <option value="Customer">Customer</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Status</label>
                <select 
                  name="status" 
                  className={styles.formSelect}
                  defaultValue={editingUser?.status || 'Active'}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            {editingUser && (
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Join Date</label>
                  <input 
                    type="text" 
                    className={styles.formInput}
                    value={editingUser.joinDate}
                    disabled
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Orders</label>
                  <input 
                    type="text" 
                    className={styles.formInput}
                    value={editingUser.orders}
                    disabled
                  />
                </div>
              </div>
            )}
            
            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => {
                  setShowAddForm(false);
                  setEditingUser(null);
                }}
              >
                Cancel
              </button>
              <button type="submit" className={styles.saveButton}>
                {editingUser ? 'Update User' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
