import express from 'express';
import {
  BusinessSettings,
  Location,
  PaymentSettings,
  NotificationSettings,
  FulfillmentSettings,
  Device,
  Integration
} from '../../models/dashboard/index.js';
import { protect, admin } from '../../middleware/authMiddleware.js';

const router = express.Router();

// BUSINESS SETTINGS ROUTES

// @desc    Fetch business settings
// @route   GET /api/dashboard/settings/business
// @access  Private/Admin
router.get('/business', protect, admin, async (req, res) => {
  try {
    const businessSettings = await BusinessSettings.findOne({})
      .populate('locations');
    
    if (businessSettings) {
      res.json(businessSettings);
    } else {
      // If no settings exist yet, return empty settings object
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create or update business settings
// @route   PUT /api/dashboard/settings/business
// @access  Private/Admin
router.put('/business', protect, admin, async (req, res) => {
  try {
    const {
      businessName,
      legalName,
      industry,
      description,
      logo,
      website,
      email,
      phone,
      address,
      taxIdentifiers,
      businessHours,
      timezone,
      dateFormat,
      currencyFormat,
      fiscalYearStart,
      businessType,
      numberOfEmployees,
      yearEstablished,
      socialMedia
    } = req.body;

    // Find existing settings or create new
    let businessSettings = await BusinessSettings.findOne({});
    
    if (businessSettings) {
      // Update existing settings
      businessSettings.businessName = businessName || businessSettings.businessName;
      businessSettings.legalName = legalName || businessSettings.legalName;
      businessSettings.industry = industry || businessSettings.industry;
      businessSettings.description = description || businessSettings.description;
      businessSettings.logo = logo || businessSettings.logo;
      businessSettings.website = website || businessSettings.website;
      businessSettings.email = email || businessSettings.email;
      businessSettings.phone = phone || businessSettings.phone;
      businessSettings.address = address || businessSettings.address;
      businessSettings.taxIdentifiers = taxIdentifiers || businessSettings.taxIdentifiers;
      businessSettings.businessHours = businessHours || businessSettings.businessHours;
      businessSettings.timezone = timezone || businessSettings.timezone;
      businessSettings.dateFormat = dateFormat || businessSettings.dateFormat;
      businessSettings.currencyFormat = currencyFormat || businessSettings.currencyFormat;
      businessSettings.fiscalYearStart = fiscalYearStart || businessSettings.fiscalYearStart;
      businessSettings.businessType = businessType || businessSettings.businessType;
      businessSettings.numberOfEmployees = numberOfEmployees || businessSettings.numberOfEmployees;
      businessSettings.yearEstablished = yearEstablished || businessSettings.yearEstablished;
      businessSettings.socialMedia = socialMedia || businessSettings.socialMedia;
      businessSettings.updatedBy = req.user._id;
    } else {
      // Create new settings
      businessSettings = new BusinessSettings({
        businessName,
        legalName,
        industry,
        description,
        logo,
        website,
        email,
        phone,
        address,
        taxIdentifiers,
        businessHours,
        timezone,
        dateFormat,
        currencyFormat,
        fiscalYearStart,
        businessType,
        numberOfEmployees,
        yearEstablished,
        socialMedia,
        createdBy: req.user._id
      });
    }

    const updatedSettings = await businessSettings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// LOCATION ROUTES

// @desc    Fetch all locations
// @route   GET /api/dashboard/settings/locations
// @access  Private/Admin
router.get('/locations', protect, admin, async (req, res) => {
  try {
    const locations = await Location.find({}).sort({ name: 1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single location
// @route   GET /api/dashboard/settings/locations/:id
// @access  Private/Admin
router.get('/locations/:id', protect, admin, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (location) {
      res.json(location);
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a location
// @route   POST /api/dashboard/settings/locations
// @access  Private/Admin
router.post('/locations', protect, admin, async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      email,
      capacity,
      status,
      businessHours,
      timezone,
      managers,
      features,
      notes
    } = req.body;

    const locationExists = await Location.findOne({ name });

    if (locationExists) {
      res.status(400).json({ message: 'Location with this name already exists' });
      return;
    }

    const location = new Location({
      name,
      address,
      phone,
      email,
      capacity,
      status: status || 'active',
      businessHours,
      timezone,
      managers,
      features,
      notes,
      createdBy: req.user._id
    });

    const createdLocation = await location.save();
    
    // Add location to business settings
    const businessSettings = await BusinessSettings.findOne({});
    if (businessSettings) {
      businessSettings.locations.push(createdLocation._id);
      await businessSettings.save();
    }
    
    res.status(201).json(createdLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a location
// @route   PUT /api/dashboard/settings/locations/:id
// @access  Private/Admin
router.put('/locations/:id', protect, admin, async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      email,
      capacity,
      status,
      businessHours,
      timezone,
      managers,
      features,
      notes
    } = req.body;

    const location = await Location.findById(req.params.id);

    if (location) {
      location.name = name || location.name;
      location.address = address || location.address;
      location.phone = phone || location.phone;
      location.email = email || location.email;
      location.capacity = capacity !== undefined ? capacity : location.capacity;
      location.status = status || location.status;
      location.businessHours = businessHours || location.businessHours;
      location.timezone = timezone || location.timezone;
      location.managers = managers || location.managers;
      location.features = features || location.features;
      location.notes = notes || location.notes;
      location.updatedBy = req.user._id;

      const updatedLocation = await location.save();
      res.json(updatedLocation);
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a location
// @route   DELETE /api/dashboard/settings/locations/:id
// @access  Private/Admin
router.delete('/locations/:id', protect, admin, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (location) {
      await location.deleteOne();
      
      // Remove location from business settings
      const businessSettings = await BusinessSettings.findOne({});
      if (businessSettings) {
        businessSettings.locations = businessSettings.locations.filter(
          loc => loc.toString() !== req.params.id
        );
        await businessSettings.save();
      }
      
      res.json({ message: 'Location removed' });
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PAYMENT SETTINGS ROUTES

// @desc    Fetch payment settings
// @route   GET /api/dashboard/settings/payment
// @access  Private/Admin
router.get('/payment', protect, admin, async (req, res) => {
  try {
    const paymentSettings = await PaymentSettings.findOne({});
    
    if (paymentSettings) {
      res.json(paymentSettings);
    } else {
      // If no settings exist yet, return empty settings object
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create or update payment settings
// @route   PUT /api/dashboard/settings/payment
// @access  Private/Admin
router.put('/payment', protect, admin, async (req, res) => {
  try {
    const {
      acceptedPaymentMethods,
      defaultPaymentMethod,
      taxSettings,
      invoiceSettings,
      paymentProcessors,
      refundPolicy,
      depositRequirements,
      currencySettings,
      autoPaymentReminders,
      lateFees
    } = req.body;

    // Find existing settings or create new
    let paymentSettings = await PaymentSettings.findOne({});
    
    if (paymentSettings) {
      // Update existing settings
      paymentSettings.acceptedPaymentMethods = acceptedPaymentMethods || paymentSettings.acceptedPaymentMethods;
      paymentSettings.defaultPaymentMethod = defaultPaymentMethod || paymentSettings.defaultPaymentMethod;
      paymentSettings.taxSettings = taxSettings || paymentSettings.taxSettings;
      paymentSettings.invoiceSettings = invoiceSettings || paymentSettings.invoiceSettings;
      paymentSettings.paymentProcessors = paymentProcessors || paymentSettings.paymentProcessors;
      paymentSettings.refundPolicy = refundPolicy || paymentSettings.refundPolicy;
      paymentSettings.depositRequirements = depositRequirements || paymentSettings.depositRequirements;
      paymentSettings.currencySettings = currencySettings || paymentSettings.currencySettings;
      paymentSettings.autoPaymentReminders = autoPaymentReminders || paymentSettings.autoPaymentReminders;
      paymentSettings.lateFees = lateFees || paymentSettings.lateFees;
      paymentSettings.updatedBy = req.user._id;
    } else {
      // Create new settings
      paymentSettings = new PaymentSettings({
        acceptedPaymentMethods,
        defaultPaymentMethod,
        taxSettings,
        invoiceSettings,
        paymentProcessors,
        refundPolicy,
        depositRequirements,
        currencySettings,
        autoPaymentReminders,
        lateFees,
        createdBy: req.user._id
      });
    }

    const updatedSettings = await paymentSettings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// NOTIFICATION SETTINGS ROUTES

// @desc    Fetch notification settings
// @route   GET /api/dashboard/settings/notifications
// @access  Private/Admin
router.get('/notifications', protect, admin, async (req, res) => {
  try {
    const notificationSettings = await NotificationSettings.findOne({});
    
    if (notificationSettings) {
      res.json(notificationSettings);
    } else {
      // If no settings exist yet, return empty settings object
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create or update notification settings
// @route   PUT /api/dashboard/settings/notifications
// @access  Private/Admin
router.put('/notifications', protect, admin, async (req, res) => {
  try {
    const {
      emailNotifications,
      smsNotifications,
      pushNotifications,
      appointmentReminders,
      marketingNotifications,
      systemAlerts,
      notificationSchedule,
      staffNotifications,
      customerNotifications
    } = req.body;

    // Find existing settings or create new
    let notificationSettings = await NotificationSettings.findOne({});
    
    if (notificationSettings) {
      // Update existing settings
      notificationSettings.emailNotifications = emailNotifications || notificationSettings.emailNotifications;
      notificationSettings.smsNotifications = smsNotifications || notificationSettings.smsNotifications;
      notificationSettings.pushNotifications = pushNotifications || notificationSettings.pushNotifications;
      notificationSettings.appointmentReminders = appointmentReminders || notificationSettings.appointmentReminders;
      notificationSettings.marketingNotifications = marketingNotifications || notificationSettings.marketingNotifications;
      notificationSettings.systemAlerts = systemAlerts || notificationSettings.systemAlerts;
      notificationSettings.notificationSchedule = notificationSchedule || notificationSettings.notificationSchedule;
      notificationSettings.staffNotifications = staffNotifications || notificationSettings.staffNotifications;
      notificationSettings.customerNotifications = customerNotifications || notificationSettings.customerNotifications;
      notificationSettings.updatedBy = req.user._id;
    } else {
      // Create new settings
      notificationSettings = new NotificationSettings({
        emailNotifications,
        smsNotifications,
        pushNotifications,
        appointmentReminders,
        marketingNotifications,
        systemAlerts,
        notificationSchedule,
        staffNotifications,
        customerNotifications,
        createdBy: req.user._id
      });
    }

    const updatedSettings = await notificationSettings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// FULFILLMENT SETTINGS ROUTES

// @desc    Fetch fulfillment settings
// @route   GET /api/dashboard/settings/fulfillment
// @access  Private/Admin
router.get('/fulfillment', protect, admin, async (req, res) => {
  try {
    const fulfillmentSettings = await FulfillmentSettings.findOne({});
    
    if (fulfillmentSettings) {
      res.json(fulfillmentSettings);
    } else {
      // If no settings exist yet, return empty settings object
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create or update fulfillment settings
// @route   PUT /api/dashboard/settings/fulfillment
// @access  Private/Admin
router.put('/fulfillment', protect, admin, async (req, res) => {
  try {
    const {
      shippingMethods,
      defaultShippingMethod,
      pickupOptions,
      deliveryOptions,
      packagingOptions,
      shippingZones,
      shippingRates,
      fulfillmentWorkflow,
      automatedMessages,
      returnPolicy
    } = req.body;

    // Find existing settings or create new
    let fulfillmentSettings = await FulfillmentSettings.findOne({});
    
    if (fulfillmentSettings) {
      // Update existing settings
      fulfillmentSettings.shippingMethods = shippingMethods || fulfillmentSettings.shippingMethods;
      fulfillmentSettings.defaultShippingMethod = defaultShippingMethod || fulfillmentSettings.defaultShippingMethod;
      fulfillmentSettings.pickupOptions = pickupOptions || fulfillmentSettings.pickupOptions;
      fulfillmentSettings.deliveryOptions = deliveryOptions || fulfillmentSettings.deliveryOptions;
      fulfillmentSettings.packagingOptions = packagingOptions || fulfillmentSettings.packagingOptions;
      fulfillmentSettings.shippingZones = shippingZones || fulfillmentSettings.shippingZones;
      fulfillmentSettings.shippingRates = shippingRates || fulfillmentSettings.shippingRates;
      fulfillmentSettings.fulfillmentWorkflow = fulfillmentWorkflow || fulfillmentSettings.fulfillmentWorkflow;
      fulfillmentSettings.automatedMessages = automatedMessages || fulfillmentSettings.automatedMessages;
      fulfillmentSettings.returnPolicy = returnPolicy || fulfillmentSettings.returnPolicy;
      fulfillmentSettings.updatedBy = req.user._id;
    } else {
      // Create new settings
      fulfillmentSettings = new FulfillmentSettings({
        shippingMethods,
        defaultShippingMethod,
        pickupOptions,
        deliveryOptions,
        packagingOptions,
        shippingZones,
        shippingRates,
        fulfillmentWorkflow,
        automatedMessages,
        returnPolicy,
        createdBy: req.user._id
      });
    }

    const updatedSettings = await fulfillmentSettings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DEVICE ROUTES

// @desc    Fetch all devices
// @route   GET /api/dashboard/settings/devices
// @access  Private/Admin
router.get('/devices', protect, admin, async (req, res) => {
  try {
    const devices = await Device.find({})
      .populate('assignedTo', 'firstName lastName')
      .populate('location', 'name')
      .sort({ name: 1 });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single device
// @route   GET /api/dashboard/settings/devices/:id
// @access  Private/Admin
router.get('/devices/:id', protect, admin, async (req, res) => {
  try {
    const device = await Device.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName')
      .populate('location', 'name');
    
    if (device) {
      res.json(device);
    } else {
      res.status(404).json({ message: 'Device not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Register a device
// @route   POST /api/dashboard/settings/devices
// @access  Private/Admin
router.post('/devices', protect, admin, async (req, res) => {
  try {
    const {
      name,
      type,
      model,
      serialNumber,
      status,
      assignedTo,
      location,
      lastMaintenance,
      nextMaintenance,
      purchaseDate,
      warrantyExpiration,
      notes
    } = req.body;

    const deviceExists = await Device.findOne({ serialNumber });

    if (deviceExists) {
      res.status(400).json({ message: 'Device with this serial number already exists' });
      return;
    }

    const device = new Device({
      name,
      type,
      model,
      serialNumber,
      status: status || 'active',
      assignedTo,
      location,
      lastMaintenance,
      nextMaintenance,
      purchaseDate,
      warrantyExpiration,
      notes,
      createdBy: req.user._id
    });

    const createdDevice = await device.save();
    res.status(201).json(createdDevice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a device
// @route   PUT /api/dashboard/settings/devices/:id
// @access  Private/Admin
router.put('/devices/:id', protect, admin, async (req, res) => {
  try {
    const {
      name,
      type,
      model,
      serialNumber,
      status,
      assignedTo,
      location,
      lastMaintenance,
      nextMaintenance,
      purchaseDate,
      warrantyExpiration,
      notes
    } = req.body;

    const device = await Device.findById(req.params.id);

    if (device) {
      device.name = name || device.name;
      device.type = type || device.type;
      device.model = model || device.model;
      device.serialNumber = serialNumber || device.serialNumber;
      device.status = status || device.status;
      device.assignedTo = assignedTo || device.assignedTo;
      device.location = location || device.location;
      device.lastMaintenance = lastMaintenance || device.lastMaintenance;
      device.nextMaintenance = nextMaintenance || device.nextMaintenance;
      device.purchaseDate = purchaseDate || device.purchaseDate;
      device.warrantyExpiration = warrantyExpiration || device.warrantyExpiration;
      device.notes = notes || device.notes;
      device.updatedBy = req.user._id;

      const updatedDevice = await device.save();
      res.json(updatedDevice);
    } else {
      res.status(404).json({ message: 'Device not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a device
// @route   DELETE /api/dashboard/settings/devices/:id
// @access  Private/Admin
router.delete('/devices/:id', protect, admin, async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (device) {
      await device.deleteOne();
      res.json({ message: 'Device removed' });
    } else {
      res.status(404).json({ message: 'Device not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// INTEGRATION ROUTES

// @desc    Fetch all integrations
// @route   GET /api/dashboard/settings/integrations
// @access  Private/Admin
router.get('/integrations', protect, admin, async (req, res) => {
  try {
    const integrations = await Integration.find({}).sort({ name: 1 });
    res.json(integrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single integration
// @route   GET /api/dashboard/settings/integrations/:id
// @access  Private/Admin
router.get('/integrations/:id', protect, admin, async (req, res) => {
  try {
    const integration = await Integration.findById(req.params.id);
    
    if (integration) {
      res.json(integration);
    } else {
      res.status(404).json({ message: 'Integration not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create an integration
// @route   POST /api/dashboard/settings/integrations
// @access  Private/Admin
router.post('/integrations', protect, admin, async (req, res) => {
  try {
    const {
      name,
      type,
      provider,
      apiKey,
      apiSecret,
      accessToken,
      refreshToken,
      endpoint,
      status,
      settings,
      dataSync,
      lastSynced,
      syncFrequency,
      notes
    } = req.body;

    const integrationExists = await Integration.findOne({ 
      name, 
      provider 
    });

    if (integrationExists) {
      res.status(400).json({ message: 'Integration with this name and provider already exists' });
      return;
    }

    const integration = new Integration({
      name,
      type,
      provider,
      apiKey,
      apiSecret,
      accessToken,
      refreshToken,
      endpoint,
      status: status || 'active',
      settings,
      dataSync,
      lastSynced,
      syncFrequency,
      notes,
      createdBy: req.user._id
    });

    const createdIntegration = await integration.save();
    res.status(201).json(createdIntegration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update an integration
// @route   PUT /api/dashboard/settings/integrations/:id
// @access  Private/Admin
router.put('/integrations/:id', protect, admin, async (req, res) => {
  try {
    const {
      name,
      type,
      provider,
      apiKey,
      apiSecret,
      accessToken,
      refreshToken,
      endpoint,
      status,
      settings,
      dataSync,
      lastSynced,
      syncFrequency,
      notes
    } = req.body;

    const integration = await Integration.findById(req.params.id);

    if (integration) {
      integration.name = name || integration.name;
      integration.type = type || integration.type;
      integration.provider = provider || integration.provider;
      integration.apiKey = apiKey || integration.apiKey;
      integration.apiSecret = apiSecret || integration.apiSecret;
      integration.accessToken = accessToken || integration.accessToken;
      integration.refreshToken = refreshToken || integration.refreshToken;
      integration.endpoint = endpoint || integration.endpoint;
      integration.status = status || integration.status;
      integration.settings = settings || integration.settings;
      integration.dataSync = dataSync || integration.dataSync;
      integration.lastSynced = lastSynced || integration.lastSynced;
      integration.syncFrequency = syncFrequency || integration.syncFrequency;
      integration.notes = notes || integration.notes;
      integration.updatedBy = req.user._id;

      const updatedIntegration = await integration.save();
      res.json(updatedIntegration);
    } else {
      res.status(404).json({ message: 'Integration not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete an integration
// @route   DELETE /api/dashboard/settings/integrations/:id
// @access  Private/Admin
router.delete('/integrations/:id', protect, admin, async (req, res) => {
  try {
    const integration = await Integration.findById(req.params.id);

    if (integration) {
      await integration.deleteOne();
      res.json({ message: 'Integration removed' });
    } else {
      res.status(404).json({ message: 'Integration not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Test an integration connection
// @route   POST /api/dashboard/settings/integrations/:id/test
// @access  Private/Admin
router.post('/integrations/:id/test', protect, admin, async (req, res) => {
  try {
    const integration = await Integration.findById(req.params.id);

    if (!integration) {
      return res.status(404).json({ message: 'Integration not found' });
    }

    // This is a placeholder for actual integration testing logic
    // In a real application, this would connect to the third-party service
    // and verify the credentials/connection
    
    // Simulate testing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response - in a real app, this would be the actual test result
    const testResult = {
      success: true,
      message: 'Connection successful',
      timestamp: new Date(),
      details: {
        responseTime: '0.8s',
        endpoints: ['users', 'products', 'orders'],
        permissions: ['read', 'write']
      }
    };
    
    // Update last tested timestamp
    integration.lastTested = new Date();
    await integration.save();
    
    res.json(testResult);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message,
      timestamp: new Date()
    });
  }
});

export default router;
