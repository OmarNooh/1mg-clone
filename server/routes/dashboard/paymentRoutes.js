import express from 'express';
import { 
  Transaction, 
  Order, 
  Invoice, 
  Estimate, 
  Dispute, 
  PaymentLink, 
  Subscription,
  RiskRule
} from '../../models/dashboard/index.js';
import { protect, admin } from '../../middleware/authMiddleware.js';

const router = express.Router();

// TRANSACTION ROUTES

// @desc    Fetch all transactions
// @route   GET /api/dashboard/payments/transactions
// @access  Private
router.get('/transactions', protect, async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    
    const dateFilter = {};
    if (req.query.startDate && req.query.endDate) {
      dateFilter.paymentDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    const statusFilter = req.query.status ? { status: req.query.status } : {};
    
    const count = await Transaction.countDocuments({ ...dateFilter, ...statusFilter });
    const transactions = await Transaction.find({ ...dateFilter, ...statusFilter })
      .populate('customer', 'firstName lastName email')
      .populate('order', 'orderNumber')
      .populate('invoice', 'invoiceNumber')
      .populate('processedBy', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ paymentDate: -1 });

    res.json({
      transactions,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single transaction
// @route   GET /api/dashboard/payments/transactions/:id
// @access  Private
router.get('/transactions/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('customer', 'firstName lastName email')
      .populate('order', 'orderNumber items total')
      .populate('invoice', 'invoiceNumber items total')
      .populate('processedBy', 'name')
      .populate('location', 'name');

    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a transaction
// @route   POST /api/dashboard/payments/transactions
// @access  Private/Admin
router.post('/transactions', protect, admin, async (req, res) => {
  try {
    const {
      transactionId,
      amount,
      paymentMethod,
      status,
      customer,
      order,
      invoice,
      paymentDate,
      fees,
      tax,
      tip,
      notes,
      cardDetails,
      location
    } = req.body;

    const transaction = new Transaction({
      transactionId,
      amount,
      paymentMethod,
      status,
      customer,
      order,
      invoice,
      paymentDate: paymentDate || Date.now(),
      fees,
      tax,
      tip,
      notes,
      cardDetails,
      location,
      processedBy: req.user._id
    });

    const createdTransaction = await transaction.save();
    res.status(201).json(createdTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update transaction status
// @route   PUT /api/dashboard/payments/transactions/:id/status
// @access  Private/Admin
router.put('/transactions/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (transaction) {
      transaction.status = status;
      const updatedTransaction = await transaction.save();
      res.json(updatedTransaction);
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Process refund
// @route   POST /api/dashboard/payments/transactions/:id/refund
// @access  Private/Admin
router.post('/transactions/:id/refund', protect, admin, async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (transaction) {
      // Add refund to transaction
      transaction.refunds.push({
        amount,
        reason,
        date: Date.now(),
        processedBy: req.user._id
      });
      
      // Update transaction status based on refund amount
      if (amount === transaction.amount) {
        transaction.status = 'refunded';
      } else {
        transaction.status = 'partially_refunded';
      }
      
      const updatedTransaction = await transaction.save();
      res.json(updatedTransaction);
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ORDER ROUTES

// @desc    Fetch all orders
// @route   GET /api/dashboard/payments/orders
// @access  Private
router.get('/orders', protect, async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    
    const dateFilter = {};
    if (req.query.startDate && req.query.endDate) {
      dateFilter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    const statusFilter = req.query.status ? { status: req.query.status } : {};
    
    const count = await Order.countDocuments({ ...dateFilter, ...statusFilter });
    const orders = await Order.find({ ...dateFilter, ...statusFilter })
      .populate('customer', 'firstName lastName email')
      .populate('createdBy', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      orders,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single order
// @route   GET /api/dashboard/payments/orders/:id
// @access  Private
router.get('/orders/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'firstName lastName email phone')
      .populate('createdBy', 'name')
      .populate('location', 'name');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create an order
// @route   POST /api/dashboard/payments/orders
// @access  Private
router.post('/orders', protect, async (req, res) => {
  try {
    const {
      orderNumber,
      customer,
      items,
      services,
      subtotal,
      tax,
      discount,
      discountCode,
      tip,
      total,
      status,
      paymentStatus,
      fulfillmentType,
      fulfillmentStatus,
      shippingAddress,
      shippingMethod,
      shippingCost,
      trackingNumber,
      notes,
      source,
      location
    } = req.body;

    const order = new Order({
      orderNumber: orderNumber || `ORD-${Date.now()}`,
      customer,
      items,
      services,
      subtotal,
      tax,
      discount,
      discountCode,
      tip,
      total,
      status,
      paymentStatus,
      fulfillmentType,
      fulfillmentStatus,
      shippingAddress,
      shippingMethod,
      shippingCost,
      trackingNumber,
      notes,
      source,
      location,
      createdBy: req.user._id
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/dashboard/payments/orders/:id/status
// @access  Private
router.put('/orders/:id/status', protect, async (req, res) => {
  try {
    const { status, paymentStatus, fulfillmentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      if (status) order.status = status;
      if (paymentStatus) order.paymentStatus = paymentStatus;
      if (fulfillmentStatus) order.fulfillmentStatus = fulfillmentStatus;
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// INVOICE ROUTES

// @desc    Fetch all invoices
// @route   GET /api/dashboard/payments/invoices
// @access  Private
router.get('/invoices', protect, async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    
    const dateFilter = {};
    if (req.query.startDate && req.query.endDate) {
      dateFilter.issueDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    const statusFilter = req.query.status ? { status: req.query.status } : {};
    
    const count = await Invoice.countDocuments({ ...dateFilter, ...statusFilter });
    const invoices = await Invoice.find({ ...dateFilter, ...statusFilter })
      .populate('customer', 'firstName lastName email')
      .populate('createdBy', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ issueDate: -1 });

    res.json({
      invoices,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single invoice
// @route   GET /api/dashboard/payments/invoices/:id
// @access  Private
router.get('/invoices/:id', protect, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer', 'firstName lastName email phone company')
      .populate('payments')
      .populate('createdBy', 'name');

    if (invoice) {
      res.json(invoice);
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create an invoice
// @route   POST /api/dashboard/payments/invoices
// @access  Private
router.post('/invoices', protect, async (req, res) => {
  try {
    const {
      invoiceNumber,
      customer,
      items,
      subtotal,
      taxRate,
      taxAmount,
      discount,
      total,
      amountPaid,
      balance,
      issueDate,
      dueDate,
      status,
      notes,
      terms,
      isRecurring,
      recurringSchedule
    } = req.body;

    const invoice = new Invoice({
      invoiceNumber: invoiceNumber || `INV-${Date.now()}`,
      customer,
      items,
      subtotal,
      taxRate,
      taxAmount,
      discount,
      total,
      amountPaid: amountPaid || 0,
      balance: balance || total,
      issueDate: issueDate || Date.now(),
      dueDate,
      status,
      notes,
      terms,
      isRecurring,
      recurringSchedule,
      createdBy: req.user._id
    });

    const createdInvoice = await invoice.save();
    res.status(201).json(createdInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update invoice status
// @route   PUT /api/dashboard/payments/invoices/:id/status
// @access  Private
router.put('/invoices/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    if (invoice) {
      invoice.status = status;
      const updatedInvoice = await invoice.save();
      res.json(updatedInvoice);
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Record payment for invoice
// @route   POST /api/dashboard/payments/invoices/:id/payment
// @access  Private
router.post('/invoices/:id/payment', protect, async (req, res) => {
  try {
    const { amount, paymentMethod, transactionId } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    if (invoice) {
      // Create transaction
      const transaction = new Transaction({
        transactionId: transactionId || `TXN-${Date.now()}`,
        amount,
        paymentMethod,
        status: 'completed',
        customer: invoice.customer,
        invoice: invoice._id,
        paymentDate: Date.now(),
        processedBy: req.user._id
      });
      
      const createdTransaction = await transaction.save();
      
      // Update invoice
      invoice.payments.push(createdTransaction._id);
      invoice.amountPaid += amount;
      invoice.balance -= amount;
      
      // Update status based on payment
      if (invoice.balance <= 0) {
        invoice.status = 'paid';
      } else if (invoice.amountPaid > 0) {
        invoice.status = 'partially_paid';
      }
      
      const updatedInvoice = await invoice.save();
      res.json({
        invoice: updatedInvoice,
        transaction: createdTransaction
      });
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ESTIMATE ROUTES

// @desc    Fetch all estimates
// @route   GET /api/dashboard/payments/estimates
// @access  Private
router.get('/estimates', protect, async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    
    const dateFilter = {};
    if (req.query.startDate && req.query.endDate) {
      dateFilter.issueDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    const statusFilter = req.query.status ? { status: req.query.status } : {};
    
    const count = await Estimate.countDocuments({ ...dateFilter, ...statusFilter });
    const estimates = await Estimate.find({ ...dateFilter, ...statusFilter })
      .populate('customer', 'firstName lastName email')
      .populate('createdBy', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ issueDate: -1 });

    res.json({
      estimates,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Convert estimate to invoice
// @route   POST /api/dashboard/payments/estimates/:id/convert
// @access  Private
router.post('/estimates/:id/convert', protect, async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id)
      .populate('customer');

    if (estimate) {
      // Create invoice from estimate
      const invoice = new Invoice({
        invoiceNumber: `INV-${Date.now()}`,
        customer: estimate.customer._id,
        items: estimate.items,
        subtotal: estimate.subtotal,
        taxRate: estimate.taxRate,
        taxAmount: estimate.taxAmount,
        discount: estimate.discount,
        total: estimate.total,
        amountPaid: 0,
        balance: estimate.total,
        issueDate: Date.now(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'sent',
        notes: estimate.notes,
        terms: estimate.terms,
        createdBy: req.user._id
      });
      
      const createdInvoice = await invoice.save();
      
      // Update estimate status
      estimate.status = 'converted';
      estimate.convertedToInvoice = createdInvoice._id;
      await estimate.save();
      
      res.json(createdInvoice);
    } else {
      res.status(404).json({ message: 'Estimate not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PAYMENT LINK ROUTES

// @desc    Fetch all payment links
// @route   GET /api/dashboard/payments/links
// @access  Private
router.get('/links', protect, async (req, res) => {
  try {
    const paymentLinks = await PaymentLink.find({})
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(paymentLinks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a payment link
// @route   POST /api/dashboard/payments/links
// @access  Private
router.post('/links', protect, async (req, res) => {
  try {
    const {
      title,
      description,
      amount,
      currency,
      allowCustomAmount,
      minAmount,
      maxAmount,
      items,
      expiryDate,
      limitUses,
      maxUses,
      redirectUrl
    } = req.body;

    // Generate unique link ID
    const linkId = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
    
    // Create payment link URL
    const url = `${process.env.FRONTEND_URL}/pay/${linkId}`;

    const paymentLink = new PaymentLink({
      title,
      description,
      amount,
      currency,
      allowCustomAmount,
      minAmount,
      maxAmount,
      linkId,
      url,
      expiryDate,
      limitUses,
      maxUses,
      currentUses: 0,
      redirectUrl,
      items,
      createdBy: req.user._id
    });

    const createdPaymentLink = await paymentLink.save();
    res.status(201).json(createdPaymentLink);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// SUBSCRIPTION ROUTES

// @desc    Fetch all subscriptions
// @route   GET /api/dashboard/payments/subscriptions
// @access  Private
router.get('/subscriptions', protect, async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    
    const statusFilter = req.query.status ? { status: req.query.status } : {};
    
    const count = await Subscription.countDocuments({ ...statusFilter });
    const subscriptions = await Subscription.find({ ...statusFilter })
      .populate('customer', 'firstName lastName email')
      .populate('invoices')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      subscriptions,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DISPUTE ROUTES

// @desc    Fetch all disputes
// @route   GET /api/dashboard/payments/disputes
// @access  Private
router.get('/disputes', protect, async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    
    const statusFilter = req.query.status ? { status: req.query.status } : {};
    
    const count = await Dispute.countDocuments({ ...statusFilter });
    const disputes = await Dispute.find({ ...statusFilter })
      .populate('transaction')
      .populate('assignedTo', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ openedDate: -1 });

    res.json({
      disputes,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// RISK RULES ROUTES

// @desc    Fetch all risk rules
// @route   GET /api/dashboard/payments/risk-rules
// @access  Private/Admin
router.get('/risk-rules', protect, admin, async (req, res) => {
  try {
    const riskRules = await RiskRule.find({})
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(riskRules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a risk rule
// @route   POST /api/dashboard/payments/risk-rules
// @access  Private/Admin
router.post('/risk-rules', protect, admin, async (req, res) => {
  try {
    const { name, description, isActive, action, conditions } = req.body;

    const riskRule = new RiskRule({
      name,
      description,
      isActive,
      action,
      conditions,
      createdBy: req.user._id
    });

    const createdRiskRule = await riskRule.save();
    res.status(201).json(createdRiskRule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
