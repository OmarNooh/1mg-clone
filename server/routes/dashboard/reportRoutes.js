import express from 'express';
import {
  SalesReport,
  ItemSalesReport,
  TaxReport,
  InventoryReport,
  StaffSalesReport,
  CustomReport,
  ActivityLog
} from '../../models/dashboard/index.js';
import { protect, admin } from '../../middleware/authMiddleware.js';

const router = express.Router();

// SALES REPORT ROUTES

// @desc    Generate sales report
// @route   POST /api/dashboard/reports/sales
// @access  Private
router.post('/sales', protect, async (req, res) => {
  try {
    const {
      title,
      startDate,
      endDate,
      location,
      reportType,
      groupBy,
      filters,
      includeRefunds,
      includeTaxes,
      includeDiscounts,
      includeTips
    } = req.body;

    // Validate date range
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const report = new SalesReport({
      title: title || `Sales Report ${new Date().toLocaleDateString()}`,
      startDate,
      endDate,
      location,
      reportType,
      groupBy,
      filters,
      includeRefunds: includeRefunds !== undefined ? includeRefunds : true,
      includeTaxes: includeTaxes !== undefined ? includeTaxes : true,
      includeDiscounts: includeDiscounts !== undefined ? includeDiscounts : true,
      includeTips: includeTips !== undefined ? includeTips : true,
      createdBy: req.user._id
    });

    // Save report metadata
    const savedReport = await report.save();

    // Generate report data (this would typically involve aggregation queries)
    // For demonstration, we're just returning the report metadata
    // In a real implementation, you would query transactions, calculate totals, etc.
    
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all sales reports
// @route   GET /api/dashboard/reports/sales
// @access  Private
router.get('/sales', protect, async (req, res) => {
  try {
    const reports = await SalesReport.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single sales report
// @route   GET /api/dashboard/reports/sales/:id
// @access  Private
router.get('/sales/:id', protect, async (req, res) => {
  try {
    const report = await SalesReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user has permission to view this report
    if (report.createdBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this report' });
    }

    // In a real implementation, you would fetch the actual report data here
    // For now, we're just returning the report metadata
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ITEM SALES REPORT ROUTES

// @desc    Generate item sales report
// @route   POST /api/dashboard/reports/item-sales
// @access  Private
router.post('/item-sales', protect, async (req, res) => {
  try {
    const {
      title,
      startDate,
      endDate,
      location,
      categories,
      items,
      sortBy,
      topItems,
      includeServices
    } = req.body;

    // Validate date range
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const report = new ItemSalesReport({
      title: title || `Item Sales Report ${new Date().toLocaleDateString()}`,
      startDate,
      endDate,
      location,
      categories,
      items,
      sortBy: sortBy || 'quantity',
      topItems: topItems || 10,
      includeServices: includeServices !== undefined ? includeServices : true,
      createdBy: req.user._id
    });

    // Save report metadata
    const savedReport = await report.save();
    
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all item sales reports
// @route   GET /api/dashboard/reports/item-sales
// @access  Private
router.get('/item-sales', protect, async (req, res) => {
  try {
    const reports = await ItemSalesReport.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// TAX REPORT ROUTES

// @desc    Generate tax report
// @route   POST /api/dashboard/reports/tax
// @access  Private
router.post('/tax', protect, async (req, res) => {
  try {
    const {
      title,
      startDate,
      endDate,
      location,
      taxRates,
      groupBy
    } = req.body;

    // Validate date range
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const report = new TaxReport({
      title: title || `Tax Report ${new Date().toLocaleDateString()}`,
      startDate,
      endDate,
      location,
      taxRates,
      groupBy: groupBy || 'day',
      createdBy: req.user._id
    });

    // Save report metadata
    const savedReport = await report.save();
    
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all tax reports
// @route   GET /api/dashboard/reports/tax
// @access  Private
router.get('/tax', protect, async (req, res) => {
  try {
    const reports = await TaxReport.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// INVENTORY REPORT ROUTES

// @desc    Generate inventory report
// @route   POST /api/dashboard/reports/inventory
// @access  Private
router.post('/inventory', protect, async (req, res) => {
  try {
    const {
      title,
      location,
      categories,
      items,
      showLowStock,
      lowStockThreshold,
      includeInactive,
      sortBy
    } = req.body;

    const report = new InventoryReport({
      title: title || `Inventory Report ${new Date().toLocaleDateString()}`,
      reportDate: new Date(),
      location,
      categories,
      items,
      showLowStock: showLowStock !== undefined ? showLowStock : true,
      lowStockThreshold: lowStockThreshold || 5,
      includeInactive: includeInactive !== undefined ? includeInactive : false,
      sortBy: sortBy || 'name',
      createdBy: req.user._id
    });

    // Save report metadata
    const savedReport = await report.save();
    
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all inventory reports
// @route   GET /api/dashboard/reports/inventory
// @access  Private
router.get('/inventory', protect, async (req, res) => {
  try {
    const reports = await InventoryReport.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// STAFF SALES REPORT ROUTES

// @desc    Generate staff sales report
// @route   POST /api/dashboard/reports/staff-sales
// @access  Private/Admin
router.post('/staff-sales', protect, admin, async (req, res) => {
  try {
    const {
      title,
      startDate,
      endDate,
      location,
      staff,
      includeCommissions,
      includeServices,
      sortBy
    } = req.body;

    // Validate date range
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const report = new StaffSalesReport({
      title: title || `Staff Sales Report ${new Date().toLocaleDateString()}`,
      startDate,
      endDate,
      location,
      staff,
      includeCommissions: includeCommissions !== undefined ? includeCommissions : true,
      includeServices: includeServices !== undefined ? includeServices : true,
      sortBy: sortBy || 'total',
      createdBy: req.user._id
    });

    // Save report metadata
    const savedReport = await report.save();
    
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all staff sales reports
// @route   GET /api/dashboard/reports/staff-sales
// @access  Private/Admin
router.get('/staff-sales', protect, admin, async (req, res) => {
  try {
    const reports = await StaffSalesReport.find({})
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CUSTOM REPORT ROUTES

// @desc    Create custom report
// @route   POST /api/dashboard/reports/custom
// @access  Private
router.post('/custom', protect, async (req, res) => {
  try {
    const {
      title,
      description,
      reportType,
      filters,
      columns,
      sortBy,
      groupBy,
      chartType,
      isPublic
    } = req.body;

    const report = new CustomReport({
      title,
      description,
      reportType,
      filters,
      columns,
      sortBy,
      groupBy,
      chartType,
      isPublic: isPublic !== undefined ? isPublic : false,
      createdBy: req.user._id
    });

    // Save report configuration
    const savedReport = await report.save();
    
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all custom reports
// @route   GET /api/dashboard/reports/custom
// @access  Private
router.get('/custom', protect, async (req, res) => {
  try {
    // Get reports created by the user or public reports
    const reports = await CustomReport.find({
      $or: [
        { createdBy: req.user._id },
        { isPublic: true }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Run custom report
// @route   POST /api/dashboard/reports/custom/:id/run
// @access  Private
router.post('/custom/:id/run', protect, async (req, res) => {
  try {
    const report = await CustomReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user has permission to run this report
    if (!report.isPublic && report.createdBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to run this report' });
    }

    // In a real implementation, you would execute the report query here
    // For now, we're just returning a success message
    
    res.json({ 
      message: 'Report executed successfully',
      reportId: report._id,
      title: report.title,
      executedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ACTIVITY LOG ROUTES

// @desc    Get activity logs
// @route   GET /api/dashboard/reports/activity
// @access  Private/Admin
router.get('/activity', protect, admin, async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 20;
    const page = Number(req.query.pageNumber) || 1;
    
    const dateFilter = {};
    if (req.query.startDate && req.query.endDate) {
      dateFilter.timestamp = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    const userFilter = req.query.userId ? { user: req.query.userId } : {};
    const actionFilter = req.query.action ? { action: req.query.action } : {};
    
    const count = await ActivityLog.countDocuments({ 
      ...dateFilter, 
      ...userFilter,
      ...actionFilter
    });
    
    const logs = await ActivityLog.find({ 
      ...dateFilter, 
      ...userFilter,
      ...actionFilter
    })
      .populate('user', 'name email')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ timestamp: -1 });

    res.json({
      logs,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Log activity (internal use)
// @route   POST /api/dashboard/reports/activity
// @access  Private
router.post('/activity', protect, async (req, res) => {
  try {
    const { action, details, resourceType, resourceId, ipAddress } = req.body;

    const log = new ActivityLog({
      user: req.user._id,
      action,
      details,
      resourceType,
      resourceId,
      ipAddress: ipAddress || req.ip,
      timestamp: Date.now()
    });

    const savedLog = await log.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
