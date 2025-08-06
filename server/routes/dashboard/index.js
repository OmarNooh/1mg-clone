import express from 'express';
import itemRoutes from './itemRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import customerRoutes from './customerRoutes.js';
import reportRoutes from './reportRoutes.js';
import staffRoutes from './staffRoutes.js';
import settingsRoutes from './settingsRoutes.js';

const router = express.Router();

// Register all dashboard routes
router.use('/items', itemRoutes);
router.use('/payments', paymentRoutes);
router.use('/customers', customerRoutes);
router.use('/reports', reportRoutes);
router.use('/staff', staffRoutes);
router.use('/settings', settingsRoutes);

export default router;
