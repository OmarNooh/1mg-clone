import express from 'express';
import {
  Customer,
  Feedback,
  Contract,
  ContractTemplate,
  ContractClause,
  MarketingCampaign,
  LoyaltyProgram,
  LoyaltyCustomer,
  LoyaltyPromotion
} from '../../models/dashboard/index.js';
import { protect, admin } from '../../middleware/authMiddleware.js';

const router = express.Router();

// CUSTOMER ROUTES

// @desc    Fetch all customers
// @route   GET /api/dashboard/customers
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    
    const keyword = req.query.keyword
      ? {
          $or: [
            { firstName: { $regex: req.query.keyword, $options: 'i' } },
            { lastName: { $regex: req.query.keyword, $options: 'i' } },
            { email: { $regex: req.query.keyword, $options: 'i' } },
            { phone: { $regex: req.query.keyword, $options: 'i' } }
          ]
        }
      : {};

    const count = await Customer.countDocuments({ ...keyword });
    const customers = await Customer.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      customers,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single customer
// @route   GET /api/dashboard/customers/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a customer
// @route   POST /api/dashboard/customers
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      address,
      notes,
      tags,
      source,
      customerType
    } = req.body;

    const customerExists = await Customer.findOne({ email });

    if (customerExists) {
      res.status(400).json({ message: 'Customer already exists' });
      return;
    }

    const customer = new Customer({
      firstName,
      lastName,
      email,
      phone,
      company,
      address,
      notes,
      tags,
      source,
      customerType,
      createdBy: req.user._id
    });

    const createdCustomer = await customer.save();
    res.status(201).json(createdCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a customer
// @route   PUT /api/dashboard/customers/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      address,
      notes,
      tags,
      source,
      customerType,
      isActive
    } = req.body;

    const customer = await Customer.findById(req.params.id);

    if (customer) {
      customer.firstName = firstName || customer.firstName;
      customer.lastName = lastName || customer.lastName;
      customer.email = email || customer.email;
      customer.phone = phone || customer.phone;
      customer.company = company || customer.company;
      customer.address = address || customer.address;
      customer.notes = notes || customer.notes;
      customer.tags = tags || customer.tags;
      customer.source = source || customer.source;
      customer.customerType = customerType || customer.customerType;
      customer.isActive = isActive !== undefined ? isActive : customer.isActive;
      customer.updatedBy = req.user._id;

      const updatedCustomer = await customer.save();
      res.json(updatedCustomer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a customer
// @route   DELETE /api/dashboard/customers/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (customer) {
      await customer.deleteOne();
      res.json({ message: 'Customer removed' });
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// FEEDBACK ROUTES

// @desc    Fetch all feedback for a customer
// @route   GET /api/dashboard/customers/:id/feedback
// @access  Private
router.get('/:id/feedback', protect, async (req, res) => {
  try {
    const feedback = await Feedback.find({ customer: req.params.id })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create feedback for a customer
// @route   POST /api/dashboard/customers/:id/feedback
// @access  Private
router.post('/:id/feedback', protect, async (req, res) => {
  try {
    const { rating, comment, source, category } = req.body;
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    const feedback = new Feedback({
      customer: req.params.id,
      rating,
      comment,
      source,
      category,
      createdBy: req.user._id
    });

    const createdFeedback = await feedback.save();
    res.status(201).json(createdFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// CONTRACT ROUTES

// @desc    Fetch all contracts
// @route   GET /api/dashboard/customers/contracts
// @access  Private
router.get('/contracts/all', protect, async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    
    const statusFilter = req.query.status ? { status: req.query.status } : {};
    
    const count = await Contract.countDocuments({ ...statusFilter });
    const contracts = await Contract.find({ ...statusFilter })
      .populate('customer', 'firstName lastName email')
      .populate('template', 'name')
      .populate('createdBy', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      contracts,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch contracts for a customer
// @route   GET /api/dashboard/customers/:id/contracts
// @access  Private
router.get('/:id/contracts', protect, async (req, res) => {
  try {
    const contracts = await Contract.find({ customer: req.params.id })
      .populate('template', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a contract for a customer
// @route   POST /api/dashboard/customers/:id/contracts
// @access  Private
router.post('/:id/contracts', protect, async (req, res) => {
  try {
    const {
      title,
      template,
      content,
      startDate,
      endDate,
      value,
      status,
      documents,
      notes
    } = req.body;

    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    const contract = new Contract({
      customer: req.params.id,
      title,
      template,
      content,
      startDate,
      endDate,
      value,
      status,
      documents,
      notes,
      createdBy: req.user._id
    });

    const createdContract = await contract.save();
    res.status(201).json(createdContract);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// CONTRACT TEMPLATE ROUTES

// @desc    Fetch all contract templates
// @route   GET /api/dashboard/customers/contract-templates
// @access  Private
router.get('/contract-templates/all', protect, async (req, res) => {
  try {
    const templates = await ContractTemplate.find({})
      .populate('clauses', 'title')
      .populate('createdBy', 'name')
      .sort({ name: 1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a contract template
// @route   POST /api/dashboard/customers/contract-templates
// @access  Private/Admin
router.post('/contract-templates', protect, admin, async (req, res) => {
  try {
    const { name, description, content, clauses, category } = req.body;

    const template = new ContractTemplate({
      name,
      description,
      content,
      clauses,
      category,
      createdBy: req.user._id
    });

    const createdTemplate = await template.save();
    res.status(201).json(createdTemplate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// CONTRACT CLAUSE ROUTES

// @desc    Fetch all contract clauses
// @route   GET /api/dashboard/customers/contract-clauses
// @access  Private
router.get('/contract-clauses/all', protect, async (req, res) => {
  try {
    const clauses = await ContractClause.find({})
      .populate('createdBy', 'name')
      .sort({ title: 1 });
    res.json(clauses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a contract clause
// @route   POST /api/dashboard/customers/contract-clauses
// @access  Private/Admin
router.post('/contract-clauses', protect, admin, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const clause = new ContractClause({
      title,
      content,
      category,
      createdBy: req.user._id
    });

    const createdClause = await clause.save();
    res.status(201).json(createdClause);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// MARKETING CAMPAIGN ROUTES

// @desc    Fetch all marketing campaigns
// @route   GET /api/dashboard/customers/campaigns
// @access  Private
router.get('/campaigns/all', protect, async (req, res) => {
  try {
    const campaigns = await MarketingCampaign.find({})
      .populate('targetAudience.customers', 'firstName lastName email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a marketing campaign
// @route   POST /api/dashboard/customers/campaigns
// @access  Private
router.post('/campaigns', protect, async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      channel,
      content,
      targetAudience,
      scheduledDate,
      status,
      budget,
      metrics
    } = req.body;

    const campaign = new MarketingCampaign({
      name,
      description,
      type,
      channel,
      content,
      targetAudience,
      scheduledDate,
      status,
      budget,
      metrics,
      createdBy: req.user._id
    });

    const createdCampaign = await campaign.save();
    res.status(201).json(createdCampaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// LOYALTY PROGRAM ROUTES

// @desc    Fetch all loyalty programs
// @route   GET /api/dashboard/customers/loyalty-programs
// @access  Private
router.get('/loyalty-programs/all', protect, async (req, res) => {
  try {
    const programs = await LoyaltyProgram.find({})
      .populate('promotions')
      .populate('createdBy', 'name')
      .sort({ name: 1 });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a loyalty program
// @route   POST /api/dashboard/customers/loyalty-programs
// @access  Private/Admin
router.post('/loyalty-programs', protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      pointsPerPurchase,
      pointsPerDollar,
      minimumPointsRedemption,
      pointValueInCents,
      expirationPolicy,
      tiers,
      isActive
    } = req.body;

    const program = new LoyaltyProgram({
      name,
      description,
      pointsPerPurchase,
      pointsPerDollar,
      minimumPointsRedemption,
      pointValueInCents,
      expirationPolicy,
      tiers,
      isActive,
      createdBy: req.user._id
    });

    const createdProgram = await program.save();
    res.status(201).json(createdProgram);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Enroll customer in loyalty program
// @route   POST /api/dashboard/customers/:id/enroll-loyalty
// @access  Private
router.post('/:id/enroll-loyalty', protect, async (req, res) => {
  try {
    const { programId } = req.body;
    const customer = await Customer.findById(req.params.id);
    const program = await LoyaltyProgram.findById(programId);

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    if (!program) {
      res.status(404).json({ message: 'Loyalty program not found' });
      return;
    }

    // Check if already enrolled
    const existingEnrollment = await LoyaltyCustomer.findOne({
      customer: req.params.id,
      program: programId
    });

    if (existingEnrollment) {
      res.status(400).json({ message: 'Customer already enrolled in this program' });
      return;
    }

    const loyaltyCustomer = new LoyaltyCustomer({
      customer: req.params.id,
      program: programId,
      membershipId: `LP-${Date.now().toString().slice(-6)}`,
      points: 0,
      tier: program.tiers && program.tiers.length > 0 ? program.tiers[0].name : 'Standard',
      enrollmentDate: Date.now(),
      createdBy: req.user._id
    });

    const enrolledCustomer = await loyaltyCustomer.save();
    res.status(201).json(enrolledCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// LOYALTY PROMOTION ROUTES

// @desc    Fetch all loyalty promotions
// @route   GET /api/dashboard/customers/loyalty-promotions
// @access  Private
router.get('/loyalty-promotions/all', protect, async (req, res) => {
  try {
    const promotions = await LoyaltyPromotion.find({})
      .populate('program', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a loyalty promotion
// @route   POST /api/dashboard/customers/loyalty-promotions
// @access  Private/Admin
router.post('/loyalty-promotions', protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      program,
      promotionType,
      bonusPoints,
      discountPercentage,
      startDate,
      endDate,
      minimumPurchase,
      applicableItems,
      isActive,
      code
    } = req.body;

    const promotion = new LoyaltyPromotion({
      name,
      description,
      program,
      promotionType,
      bonusPoints,
      discountPercentage,
      startDate,
      endDate,
      minimumPurchase,
      applicableItems,
      isActive,
      code,
      createdBy: req.user._id
    });

    const createdPromotion = await promotion.save();
    res.status(201).json(createdPromotion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
