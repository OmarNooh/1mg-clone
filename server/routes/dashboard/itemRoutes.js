import express from 'express';
import { Item, Category, Modifier, Unit, Service, Resource, Discount } from '../../models/dashboard/index.js';
import { protect, admin } from '../../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Fetch all items
// @route   GET /api/dashboard/items
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const count = await Item.countDocuments({ ...keyword });
    const items = await Item.find({ ...keyword })
      .populate('category', 'name')
      .populate('unit', 'name abbreviation')
      .populate('vendor', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      items,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single item
// @route   GET /api/dashboard/items/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('category', 'name')
      .populate('modifiers')
      .populate('unit', 'name abbreviation')
      .populate('vendor', 'name');

    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a item
// @route   POST /api/dashboard/items
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      category,
      price,
      countInStock,
      sku,
      barcode,
      cost,
      taxRate,
      modifiers,
      attributes,
      unit,
      vendor
    } = req.body;

    const item = new Item({
      name,
      description,
      image,
      category,
      price,
      countInStock,
      sku,
      barcode,
      cost,
      taxRate,
      modifiers,
      attributes,
      unit,
      vendor,
      createdBy: req.user._id,
      updatedBy: req.user._id
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a item
// @route   PUT /api/dashboard/items/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      category,
      price,
      countInStock,
      isActive,
      sku,
      barcode,
      cost,
      taxRate,
      modifiers,
      attributes,
      unit,
      vendor
    } = req.body;

    const item = await Item.findById(req.params.id);

    if (item) {
      item.name = name || item.name;
      item.description = description || item.description;
      item.image = image || item.image;
      item.category = category || item.category;
      item.price = price || item.price;
      item.countInStock = countInStock !== undefined ? countInStock : item.countInStock;
      item.isActive = isActive !== undefined ? isActive : item.isActive;
      item.sku = sku || item.sku;
      item.barcode = barcode || item.barcode;
      item.cost = cost !== undefined ? cost : item.cost;
      item.taxRate = taxRate !== undefined ? taxRate : item.taxRate;
      item.modifiers = modifiers || item.modifiers;
      item.attributes = attributes || item.attributes;
      item.unit = unit || item.unit;
      item.vendor = vendor || item.vendor;
      item.updatedBy = req.user._id;

      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a item
// @route   DELETE /api/dashboard/items/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (item) {
      await item.deleteOne();
      res.json({ message: 'Item removed' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CATEGORY ROUTES

// @desc    Fetch all categories
// @route   GET /api/dashboard/items/categories
// @access  Private
router.get('/categories/all', protect, async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a category
// @route   POST /api/dashboard/items/categories
// @access  Private/Admin
router.post('/categories', protect, admin, async (req, res) => {
  try {
    const { name, description, image, parent, isActive, sortOrder } = req.body;

    const category = new Category({
      name,
      description,
      image,
      parent,
      isActive,
      sortOrder,
      createdBy: req.user._id
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// MODIFIER ROUTES

// @desc    Fetch all modifiers
// @route   GET /api/dashboard/items/modifiers
// @access  Private
router.get('/modifiers/all', protect, async (req, res) => {
  try {
    const modifiers = await Modifier.find({}).sort({ name: 1 });
    res.json(modifiers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a modifier
// @route   POST /api/dashboard/items/modifiers
// @access  Private/Admin
router.post('/modifiers', protect, admin, async (req, res) => {
  try {
    const { name, options, required, multiSelect } = req.body;

    const modifier = new Modifier({
      name,
      options,
      required,
      multiSelect,
      createdBy: req.user._id
    });

    const createdModifier = await modifier.save();
    res.status(201).json(createdModifier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// SERVICE ROUTES

// @desc    Fetch all services
// @route   GET /api/dashboard/items/services
// @access  Private
router.get('/services/all', protect, async (req, res) => {
  try {
    const services = await Service.find({})
      .populate('category', 'name')
      .populate('resources', 'name')
      .sort({ name: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a service
// @route   POST /api/dashboard/items/services
// @access  Private/Admin
router.post('/services', protect, admin, async (req, res) => {
  try {
    const { name, description, price, duration, category, isActive, resources } = req.body;

    const service = new Service({
      name,
      description,
      price,
      duration,
      category,
      isActive,
      resources,
      createdBy: req.user._id
    });

    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DISCOUNT ROUTES

// @desc    Fetch all discounts
// @route   GET /api/dashboard/items/discounts
// @access  Private
router.get('/discounts/all', protect, async (req, res) => {
  try {
    const discounts = await Discount.find({})
      .populate('categories', 'name')
      .populate('items', 'name')
      .sort({ createdAt: -1 });
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a discount
// @route   POST /api/dashboard/items/discounts
// @access  Private/Admin
router.post('/discounts', protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      discountType,
      value,
      startDate,
      endDate,
      isActive,
      applicableTo,
      categories,
      items
    } = req.body;

    const discount = new Discount({
      name,
      description,
      discountType,
      value,
      startDate,
      endDate,
      isActive,
      applicableTo,
      categories,
      items,
      createdBy: req.user._id
    });

    const createdDiscount = await discount.save();
    res.status(201).json(createdDiscount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
