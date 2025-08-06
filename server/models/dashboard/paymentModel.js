import mongoose from 'mongoose';

// Transaction Schema
const transactionSchema = mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true
    },
    amount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'credit_card', 'debit_card', 'gift_card', 'mobile_payment', 'online', 'other'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded', 'voided'],
      required: true,
      default: 'pending'
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: false
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: false
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: false
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    fees: {
      type: Number,
      required: false,
      default: 0
    },
    tax: {
      type: Number,
      required: false,
      default: 0
    },
    tip: {
      type: Number,
      required: false,
      default: 0
    },
    notes: {
      type: String,
      required: false
    },
    cardDetails: {
      last4: String,
      brand: String,
      expiryMonth: Number,
      expiryYear: Number
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: false
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    refunds: [{
      amount: Number,
      reason: String,
      date: {
        type: Date,
        default: Date.now
      },
      processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  },
  {
    timestamps: true
  }
);

// Order Schema
const orderSchema = mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: false
    },
    items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Item',
          required: true
        },
        name: String,
        quantity: {
          type: Number,
          required: true,
          default: 1
        },
        price: {
          type: Number,
          required: true
        },
        modifiers: [
          {
            name: String,
            options: [
              {
                name: String,
                price: Number
              }
            ]
          }
        ],
        notes: String
      }
    ],
    services: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Service'
        },
        name: String,
        price: Number,
        duration: Number,
        scheduledTime: Date,
        notes: String
      }
    ],
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      required: true,
      default: 0
    },
    discount: {
      type: Number,
      required: false,
      default: 0
    },
    discountCode: {
      type: String,
      required: false
    },
    tip: {
      type: Number,
      required: false,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'],
      required: true,
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'partially_paid', 'refunded', 'failed'],
      required: true,
      default: 'pending'
    },
    fulfillmentType: {
      type: String,
      enum: ['pickup', 'delivery', 'shipping', 'dine_in', 'takeout', 'service'],
      required: true
    },
    fulfillmentStatus: {
      type: String,
      enum: ['pending', 'ready', 'in_progress', 'completed', 'cancelled'],
      required: true,
      default: 'pending'
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    shippingMethod: {
      type: String,
      required: false
    },
    shippingCost: {
      type: Number,
      required: false,
      default: 0
    },
    trackingNumber: {
      type: String,
      required: false
    },
    notes: {
      type: String,
      required: false
    },
    source: {
      type: String,
      enum: ['pos', 'online', 'mobile', 'phone', 'third_party'],
      required: true,
      default: 'pos'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: false
    }
  },
  {
    timestamps: true
  }
);

// Invoice Schema
const invoiceSchema = mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    items: [
      {
        description: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        },
        unitPrice: {
          type: Number,
          required: true
        },
        amount: {
          type: Number,
          required: true
        },
        taxable: {
          type: Boolean,
          default: true
        }
      }
    ],
    subtotal: {
      type: Number,
      required: true
    },
    taxRate: {
      type: Number,
      required: false,
      default: 0
    },
    taxAmount: {
      type: Number,
      required: false,
      default: 0
    },
    discount: {
      type: Number,
      required: false,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    amountPaid: {
      type: Number,
      required: true,
      default: 0
    },
    balance: {
      type: Number,
      required: true
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'viewed', 'paid', 'partially_paid', 'overdue', 'cancelled'],
      required: true,
      default: 'draft'
    },
    notes: {
      type: String,
      required: false
    },
    terms: {
      type: String,
      required: false
    },
    isRecurring: {
      type: Boolean,
      default: false
    },
    recurringSchedule: {
      frequency: {
        type: String,
        enum: ['weekly', 'monthly', 'quarterly', 'yearly'],
        required: function() { return this.isRecurring; }
      },
      nextDate: {
        type: Date,
        required: function() { return this.isRecurring; }
      },
      endDate: {
        type: Date,
        required: false
      }
    },
    payments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
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

// Estimate Schema
const estimateSchema = mongoose.Schema(
  {
    estimateNumber: {
      type: String,
      required: true,
      unique: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    items: [
      {
        description: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        },
        unitPrice: {
          type: Number,
          required: true
        },
        amount: {
          type: Number,
          required: true
        },
        taxable: {
          type: Boolean,
          default: true
        }
      }
    ],
    subtotal: {
      type: Number,
      required: true
    },
    taxRate: {
      type: Number,
      required: false,
      default: 0
    },
    taxAmount: {
      type: Number,
      required: false,
      default: 0
    },
    discount: {
      type: Number,
      required: false,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    expiryDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'accepted', 'declined', 'expired', 'converted'],
      required: true,
      default: 'draft'
    },
    notes: {
      type: String,
      required: false
    },
    terms: {
      type: String,
      required: false
    },
    convertedToInvoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
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

// Dispute Schema
const disputeSchema = mongoose.Schema(
  {
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['new', 'under_review', 'won', 'lost', 'accepted'],
      required: true,
      default: 'new'
    },
    evidence: {
      customerName: String,
      customerEmail: String,
      billingAddress: String,
      receiptCopy: String,
      customerSignature: String,
      customerCommunication: String,
      serviceDescription: String,
      serviceDate: Date,
      shippingDocumentation: String,
      shippingAddress: String,
      deliveryDate: Date,
      refundPolicy: String,
      refundPolicyDisclosure: String,
      cancellationPolicy: String,
      cancellationPolicyDisclosure: String,
      termsOfService: String,
      termsOfServiceAcceptance: String
    },
    openedDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: true
    },
    resolvedDate: {
      type: Date,
      required: false
    },
    notes: {
      type: String,
      required: false
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  },
  {
    timestamps: true
  }
);

// Payment Link Schema
const paymentLinkSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    amount: {
      type: Number,
      required: false // Can be null for customer-defined amount
    },
    currency: {
      type: String,
      required: true,
      default: 'USD'
    },
    allowCustomAmount: {
      type: Boolean,
      default: false
    },
    minAmount: {
      type: Number,
      required: function() { return this.allowCustomAmount; }
    },
    maxAmount: {
      type: Number,
      required: false
    },
    linkId: {
      type: String,
      required: true,
      unique: true
    },
    url: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    },
    expiryDate: {
      type: Date,
      required: false
    },
    limitUses: {
      type: Boolean,
      default: false
    },
    maxUses: {
      type: Number,
      required: function() { return this.limitUses; }
    },
    currentUses: {
      type: Number,
      default: 0
    },
    redirectUrl: {
      type: String,
      required: false
    },
    items: [{
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
      },
      name: String,
      quantity: Number,
      price: Number
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

// Subscription Schema
const subscriptionSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    plan: {
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: false
      },
      amount: {
        type: Number,
        required: true
      },
      interval: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        required: true
      },
      intervalCount: {
        type: Number,
        required: true,
        default: 1
      }
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'paused', 'incomplete', 'incomplete_expired', 'trialing', 'unpaid'],
      required: true,
      default: 'active'
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    currentPeriodStart: {
      type: Date,
      required: true,
      default: Date.now
    },
    currentPeriodEnd: {
      type: Date,
      required: true
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    },
    canceledAt: {
      type: Date,
      required: false
    },
    endedAt: {
      type: Date,
      required: false
    },
    paymentMethod: {
      type: String,
      required: true
    },
    items: [{
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
      },
      name: String,
      quantity: Number,
      price: Number
    }],
    invoices: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice'
    }],
    metadata: {
      type: Map,
      of: String
    }
  },
  {
    timestamps: true
  }
);

// Risk Rule Schema
const riskRuleSchema = mongoose.Schema(
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
      required: true,
      default: true
    },
    action: {
      type: String,
      enum: ['block', 'flag', 'review'],
      required: true
    },
    conditions: [{
      field: {
        type: String,
        required: true
      },
      operator: {
        type: String,
        enum: ['equals', 'not_equals', 'contains', 'not_contains', 'greater_than', 'less_than', 'in', 'not_in'],
        required: true
      },
      value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
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

// Create models
const Transaction = mongoose.model('Transaction', transactionSchema);
const Order = mongoose.model('Order', orderSchema);
const Invoice = mongoose.model('Invoice', invoiceSchema);
const Estimate = mongoose.model('Estimate', estimateSchema);
const Dispute = mongoose.model('Dispute', disputeSchema);
const PaymentLink = mongoose.model('PaymentLink', paymentLinkSchema);
const Subscription = mongoose.model('Subscription', subscriptionSchema);
const RiskRule = mongoose.model('RiskRule', riskRuleSchema);

export { 
  Transaction, 
  Order, 
  Invoice, 
  Estimate, 
  Dispute, 
  PaymentLink, 
  Subscription, 
  RiskRule 
};
