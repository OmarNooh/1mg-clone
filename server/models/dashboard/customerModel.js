import mongoose from 'mongoose';

// Customer Schema
const customerSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: false,
      trim: true
    },
    addresses: [
      {
        type: {
          type: String,
          enum: ['billing', 'shipping', 'both'],
          default: 'both'
        },
        street: {
          type: String,
          required: true
        },
        city: {
          type: String,
          required: true
        },
        state: {
          type: String,
          required: true
        },
        zipCode: {
          type: String,
          required: true
        },
        country: {
          type: String,
          required: true,
          default: 'USA'
        },
        isDefault: {
          type: Boolean,
          default: false
        }
      }
    ],
    company: {
      type: String,
      required: false
    },
    taxId: {
      type: String,
      required: false
    },
    notes: {
      type: String,
      required: false
    },
    customerSince: {
      type: Date,
      default: Date.now
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    lastPurchaseDate: {
      type: Date,
      required: false
    },
    tags: [String],
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked'],
      default: 'active'
    },
    paymentMethods: [
      {
        type: {
          type: String,
          required: true
        },
        cardBrand: String,
        last4: String,
        expiryMonth: Number,
        expiryYear: Number,
        isDefault: {
          type: Boolean,
          default: false
        }
      }
    ],
    marketingPreferences: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: false
      },
      unsubscribed: {
        type: Boolean,
        default: false
      }
    },
    user: {
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

// Feedback Schema
const feedbackSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: false
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: false
    },
    category: {
      type: String,
      enum: ['product', 'service', 'delivery', 'staff', 'overall'],
      required: false
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'responded'],
      default: 'pending'
    },
    response: {
      text: String,
      date: Date,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Contract Schema
const contractSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContractTemplate',
      required: false
    },
    content: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'viewed', 'signed', 'expired', 'cancelled'],
      default: 'draft'
    },
    issueDate: {
      type: Date,
      default: Date.now
    },
    expiryDate: {
      type: Date,
      required: false
    },
    signedDate: {
      type: Date,
      required: false
    },
    customerSignature: {
      name: String,
      signature: String,
      date: Date,
      ipAddress: String
    },
    businessSignature: {
      name: String,
      signature: String,
      date: Date,
      ipAddress: String,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    attachments: [{
      name: String,
      fileUrl: String,
      uploadDate: Date
    }],
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

// Contract Template Schema
const contractTemplateSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    clauses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContractClause'
    }],
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

// Contract Clause Schema
const contractClauseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: false
    },
    isActive: {
      type: Boolean,
      default: true
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

// Marketing Campaign Schema
const marketingCampaignSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    type: {
      type: String,
      enum: ['email', 'sms', 'push', 'social', 'other'],
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled'],
      default: 'draft'
    },
    audience: {
      type: String,
      enum: ['all', 'segment', 'tag', 'custom'],
      required: true
    },
    audienceFilter: {
      tags: [String],
      segment: String,
      customQuery: mongoose.Schema.Types.Mixed
    },
    content: {
      subject: String,
      body: String,
      template: String,
      imageUrl: String,
      callToAction: {
        text: String,
        url: String
      }
    },
    schedule: {
      startDate: {
        type: Date,
        required: function() { return this.status === 'scheduled'; }
      },
      endDate: Date,
      sendTime: String,
      timezone: String,
      frequency: {
        type: String,
        enum: ['once', 'daily', 'weekly', 'monthly']
      },
      daysOfWeek: [Number] // 0 = Sunday, 1 = Monday, etc.
    },
    metrics: {
      sent: {
        type: Number,
        default: 0
      },
      delivered: {
        type: Number,
        default: 0
      },
      opened: {
        type: Number,
        default: 0
      },
      clicked: {
        type: Number,
        default: 0
      },
      bounced: {
        type: Number,
        default: 0
      },
      unsubscribed: {
        type: Number,
        default: 0
      },
      complaints: {
        type: Number,
        default: 0
      }
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

// Loyalty Program Schema
const loyaltyProgramSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    pointsConfig: {
      earnRate: {
        type: Number,
        required: true,
        default: 1 // Points earned per dollar spent
      },
      redeemRate: {
        type: Number,
        required: true,
        default: 0.01 // Dollar value per point
      },
      minimumRedemption: {
        type: Number,
        required: true,
        default: 100 // Minimum points to redeem
      },
      expiryDays: {
        type: Number,
        required: false // Number of days until points expire, null = no expiry
      }
    },
    tiers: [{
      name: {
        type: String,
        required: true
      },
      threshold: {
        type: Number,
        required: true // Points or spend threshold to reach tier
      },
      multiplier: {
        type: Number,
        default: 1 // Points multiplier for this tier
      },
      benefits: [String],
      icon: String
    }],
    earningRules: [{
      name: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['purchase', 'visit', 'signup', 'birthday', 'referral', 'review', 'social', 'custom'],
        required: true
      },
      points: {
        type: Number,
        required: true
      },
      conditions: mongoose.Schema.Types.Mixed,
      isActive: {
        type: Boolean,
        default: true
      }
    }],
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

// Loyalty Customer Schema
const loyaltyCustomerSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      unique: true
    },
    membershipId: {
      type: String,
      required: true,
      unique: true
    },
    points: {
      type: Number,
      default: 0
    },
    lifetimePoints: {
      type: Number,
      default: 0
    },
    tier: {
      type: String,
      default: 'Standard'
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    pointsHistory: [{
      date: {
        type: Date,
        default: Date.now
      },
      points: Number,
      type: {
        type: String,
        enum: ['earn', 'redeem', 'expire', 'adjust']
      },
      description: String,
      reference: {
        type: String,
        required: false // Order ID, etc.
      },
      balance: Number
    }],
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Loyalty Promotion Schema
const loyaltyPromotionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    type: {
      type: String,
      enum: ['bonus_points', 'multiplier', 'special_reward'],
      required: true
    },
    value: {
      type: Number,
      required: true // Points or multiplier value
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    endDate: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    applicableTo: {
      type: String,
      enum: ['all', 'tier', 'tag', 'custom'],
      default: 'all'
    },
    tiers: [String],
    tags: [String],
    customFilter: mongoose.Schema.Types.Mixed,
    conditions: {
      minPurchase: Number,
      categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }],
      items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
      }],
      dayOfWeek: [Number], // 0 = Sunday, 1 = Monday, etc.
      timeOfDay: {
        start: String, // HH:MM format
        end: String // HH:MM format
      }
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
const Customer = mongoose.model('Customer', customerSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const Contract = mongoose.model('Contract', contractSchema);
const ContractTemplate = mongoose.model('ContractTemplate', contractTemplateSchema);
const ContractClause = mongoose.model('ContractClause', contractClauseSchema);
const MarketingCampaign = mongoose.model('MarketingCampaign', marketingCampaignSchema);
const LoyaltyProgram = mongoose.model('LoyaltyProgram', loyaltyProgramSchema);
const LoyaltyCustomer = mongoose.model('LoyaltyCustomer', loyaltyCustomerSchema);
const LoyaltyPromotion = mongoose.model('LoyaltyPromotion', loyaltyPromotionSchema);

export {
  Customer,
  Feedback,
  Contract,
  ContractTemplate,
  ContractClause,
  MarketingCampaign,
  LoyaltyProgram,
  LoyaltyCustomer,
  LoyaltyPromotion
};
