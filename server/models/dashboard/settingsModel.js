import mongoose from 'mongoose';

// Business Settings Schema
const businessSettingsSchema = mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true
    },
    legalName: {
      type: String,
      required: false
    },
    businessType: {
      type: String,
      required: false
    },
    industry: {
      type: String,
      required: false
    },
    taxId: {
      type: String,
      required: false
    },
    website: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      required: false
    },
    favicon: {
      type: String,
      required: false
    },
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
      youtube: String
    },
    businessHours: [{
      day: {
        type: Number, // 0 = Sunday, 1 = Monday, etc.
        required: true
      },
      isOpen: {
        type: Boolean,
        default: true
      },
      openTime: String, // HH:MM format
      closeTime: String, // HH:MM format
      breaks: [{
        startTime: String, // HH:MM format
        endTime: String // HH:MM format
      }]
    }],
    timezone: {
      type: String,
      required: true,
      default: 'UTC'
    },
    dateFormat: {
      type: String,
      required: true,
      default: 'MM/DD/YYYY'
    },
    timeFormat: {
      type: String,
      required: true,
      default: '12h' // 12h or 24h
    },
    currency: {
      code: {
        type: String,
        required: true,
        default: 'USD'
      },
      symbol: {
        type: String,
        required: true,
        default: '$'
      },
      position: {
        type: String,
        enum: ['prefix', 'suffix'],
        default: 'prefix'
      }
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Location Schema
const locationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['physical', 'online', 'warehouse', 'other'],
      default: 'physical'
    },
    address: {
      street: {
        type: String,
        required: function() { return this.type === 'physical' || this.type === 'warehouse'; }
      },
      city: {
        type: String,
        required: function() { return this.type === 'physical' || this.type === 'warehouse'; }
      },
      state: {
        type: String,
        required: function() { return this.type === 'physical' || this.type === 'warehouse'; }
      },
      zipCode: {
        type: String,
        required: function() { return this.type === 'physical' || this.type === 'warehouse'; }
      },
      country: {
        type: String,
        required: function() { return this.type === 'physical' || this.type === 'warehouse'; },
        default: 'USA'
      }
    },
    contactInfo: {
      phone: String,
      email: String,
      website: String
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    businessHours: [{
      day: {
        type: Number, // 0 = Sunday, 1 = Monday, etc.
        required: true
      },
      isOpen: {
        type: Boolean,
        default: true
      },
      openTime: String, // HH:MM format
      closeTime: String, // HH:MM format
      breaks: [{
        startTime: String, // HH:MM format
        endTime: String // HH:MM format
      }]
    }],
    timezone: {
      type: String,
      required: true,
      default: 'UTC'
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'temporary', 'closed'],
      default: 'active'
    },
    taxRates: [{
      name: String,
      rate: Number,
      isDefault: Boolean
    }],
    serviceCharges: [{
      name: String,
      rate: Number,
      isDefault: Boolean
    }],
    isDefault: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Payment Settings Schema
const paymentSettingsSchema = mongoose.Schema(
  {
    paymentMethods: [{
      name: {
        type: String,
        required: true
      },
      isEnabled: {
        type: Boolean,
        default: true
      },
      processingFee: {
        type: Number,
        default: 0
      },
      isDefault: {
        type: Boolean,
        default: false
      },
      configuration: {
        type: mongoose.Schema.Types.Mixed,
        required: false
      }
    }],
    receiptSettings: {
      businessName: {
        type: String,
        required: true
      },
      showLogo: {
        type: Boolean,
        default: true
      },
      footer: {
        type: String,
        required: false
      },
      emailReceipts: {
        type: Boolean,
        default: true
      },
      printReceipts: {
        type: Boolean,
        default: true
      },
      additionalInfo: {
        type: String,
        required: false
      }
    },
    taxSettings: {
      collectTax: {
        type: Boolean,
        default: true
      },
      taxIncluded: {
        type: Boolean,
        default: false
      },
      defaultTaxRate: {
        type: Number,
        default: 0
      }
    },
    serviceChargeSettings: {
      enableServiceCharges: {
        type: Boolean,
        default: false
      },
      defaultServiceCharge: {
        type: Number,
        default: 0
      },
      serviceChargeOptions: [{
        name: String,
        rate: Number,
        isDefault: Boolean
      }]
    },
    tipping: {
      enableTipping: {
        type: Boolean,
        default: true
      },
      suggestedTipPercentages: [Number],
      allowCustomTip: {
        type: Boolean,
        default: true
      }
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Notification Settings Schema
const notificationSettingsSchema = mongoose.Schema(
  {
    email: {
      salesReceipts: {
        type: Boolean,
        default: true
      },
      lowInventory: {
        type: Boolean,
        default: true
      },
      newOrders: {
        type: Boolean,
        default: true
      },
      customerFeedback: {
        type: Boolean,
        default: true
      },
      invoicePaid: {
        type: Boolean,
        default: true
      },
      invoiceOverdue: {
        type: Boolean,
        default: true
      },
      disputes: {
        type: Boolean,
        default: true
      },
      staffSchedule: {
        type: Boolean,
        default: true
      },
      systemUpdates: {
        type: Boolean,
        default: true
      }
    },
    sms: {
      newOrders: {
        type: Boolean,
        default: false
      },
      lowInventory: {
        type: Boolean,
        default: false
      },
      customerFeedback: {
        type: Boolean,
        default: false
      },
      disputes: {
        type: Boolean,
        default: false
      }
    },
    push: {
      newOrders: {
        type: Boolean,
        default: true
      },
      lowInventory: {
        type: Boolean,
        default: false
      },
      customerFeedback: {
        type: Boolean,
        default: true
      },
      invoicePaid: {
        type: Boolean,
        default: true
      },
      disputes: {
        type: Boolean,
        default: true
      }
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Fulfillment Settings Schema
const fulfillmentSettingsSchema = mongoose.Schema(
  {
    pickupSettings: {
      enabled: {
        type: Boolean,
        default: true
      },
      locations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
      }],
      instructions: {
        type: String,
        required: false
      },
      estimatedReadyTime: {
        type: Number, // in minutes
        default: 30
      },
      allowScheduling: {
        type: Boolean,
        default: true
      },
      schedulingIntervals: {
        type: Number, // in minutes
        default: 15
      },
      minimumLeadTime: {
        type: Number, // in minutes
        default: 30
      },
      maximumAdvanceTime: {
        type: Number, // in hours
        default: 24
      }
    },
    deliverySettings: {
      enabled: {
        type: Boolean,
        default: false
      },
      inHouseDelivery: {
        type: Boolean,
        default: false
      },
      thirdPartyServices: [{
        name: String,
        isEnabled: Boolean,
        apiCredentials: mongoose.Schema.Types.Mixed
      }],
      deliveryZones: [{
        name: String,
        zipCodes: [String],
        fee: Number,
        minimumOrderAmount: Number,
        estimatedDeliveryTime: Number // in minutes
      }],
      minimumOrderAmount: {
        type: Number,
        default: 0
      },
      deliveryFee: {
        type: Number,
        default: 0
      },
      allowScheduling: {
        type: Boolean,
        default: true
      },
      schedulingIntervals: {
        type: Number, // in minutes
        default: 30
      }
    },
    shippingSettings: {
      enabled: {
        type: Boolean,
        default: false
      },
      carriers: [{
        name: String,
        isEnabled: Boolean,
        apiCredentials: mongoose.Schema.Types.Mixed
      }],
      defaultPackageSizes: [{
        name: String,
        length: Number,
        width: Number,
        height: Number,
        weight: Number
      }],
      returnPolicy: {
        type: String,
        required: false
      },
      shippingRates: [{
        name: String,
        rate: Number,
        conditions: mongoose.Schema.Types.Mixed
      }],
      freeShippingThreshold: {
        type: Number,
        required: false
      }
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Device Settings Schema
const deviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['pos', 'kiosk', 'kitchen_display', 'customer_display', 'printer', 'cash_drawer', 'scanner', 'other'],
      required: true
    },
    model: {
      type: String,
      required: false
    },
    serialNumber: {
      type: String,
      required: false
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: false
    },
    ipAddress: {
      type: String,
      required: false
    },
    macAddress: {
      type: String,
      required: false
    },
    deviceCode: {
      type: String,
      required: false
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance', 'offline'],
      default: 'active'
    },
    lastConnected: {
      type: Date,
      required: false
    },
    settings: {
      type: mongoose.Schema.Types.Mixed,
      required: false
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Integration Schema
const integrationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    provider: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    category: {
      type: String,
      enum: ['accounting', 'ecommerce', 'marketing', 'delivery', 'payment', 'inventory', 'crm', 'other'],
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    configuration: {
      apiKey: String,
      apiSecret: String,
      accessToken: String,
      refreshToken: String,
      endpoint: String,
      webhookUrl: String,
      additionalSettings: mongoose.Schema.Types.Mixed
    },
    lastSyncDate: {
      type: Date,
      required: false
    },
    syncStatus: {
      type: String,
      enum: ['success', 'failed', 'in_progress', 'not_synced'],
      default: 'not_synced'
    },
    syncError: {
      type: String,
      required: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Create models
const BusinessSettings = mongoose.model('BusinessSettings', businessSettingsSchema);
const Location = mongoose.model('Location', locationSchema);
const PaymentSettings = mongoose.model('PaymentSettings', paymentSettingsSchema);
const NotificationSettings = mongoose.model('NotificationSettings', notificationSettingsSchema);
const FulfillmentSettings = mongoose.model('FulfillmentSettings', fulfillmentSettingsSchema);
const Device = mongoose.model('Device', deviceSchema);
const Integration = mongoose.model('Integration', integrationSchema);

export {
  BusinessSettings,
  Location,
  PaymentSettings,
  NotificationSettings,
  FulfillmentSettings,
  Device,
  Integration
};
