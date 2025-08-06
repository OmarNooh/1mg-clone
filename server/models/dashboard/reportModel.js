import mongoose from 'mongoose';

// Sales Report Schema
const salesReportSchema = mongoose.Schema(
  {
    reportDate: {
      type: Date,
      required: true
    },
    reportType: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'],
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: false
    },
    totalSales: {
      type: Number,
      required: true,
      default: 0
    },
    netSales: {
      type: Number,
      required: true,
      default: 0
    },
    taxCollected: {
      type: Number,
      required: true,
      default: 0
    },
    discounts: {
      type: Number,
      required: true,
      default: 0
    },
    refunds: {
      type: Number,
      required: true,
      default: 0
    },
    orderCount: {
      type: Number,
      required: true,
      default: 0
    },
    averageOrderValue: {
      type: Number,
      required: true,
      default: 0
    },
    paymentMethods: [{
      method: String,
      amount: Number,
      count: Number
    }],
    hourlyBreakdown: [{
      hour: Number,
      sales: Number,
      orders: Number
    }],
    categories: [{
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      },
      name: String,
      sales: Number,
      quantity: Number,
      percentage: Number
    }],
    topItems: [{
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
      },
      name: String,
      sales: Number,
      quantity: Number,
      percentage: Number
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

// Item Sales Report Schema
const itemSalesReportSchema = mongoose.Schema(
  {
    reportDate: {
      type: Date,
      required: true
    },
    reportType: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'],
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: false
    },
    items: [{
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
      },
      name: String,
      sku: String,
      category: String,
      quantity: Number,
      grossSales: Number,
      discounts: Number,
      netSales: Number,
      cost: Number,
      profit: Number,
      profitMargin: Number
    }],
    totals: {
      quantity: Number,
      grossSales: Number,
      discounts: Number,
      netSales: Number,
      cost: Number,
      profit: Number,
      averageProfitMargin: Number
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

// Tax Report Schema
const taxReportSchema = mongoose.Schema(
  {
    reportDate: {
      type: Date,
      required: true
    },
    reportType: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'],
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: false
    },
    taxRates: [{
      name: String,
      rate: Number,
      taxableAmount: Number,
      taxCollected: Number,
      orderCount: Number
    }],
    totals: {
      taxableAmount: Number,
      taxCollected: Number,
      orderCount: Number
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

// Inventory Report Schema
const inventoryReportSchema = mongoose.Schema(
  {
    reportDate: {
      type: Date,
      required: true
    },
    reportType: {
      type: String,
      enum: ['snapshot', 'movement', 'valuation', 'aging'],
      required: true
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: false
    },
    items: [{
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
      },
      name: String,
      sku: String,
      category: String,
      quantity: Number,
      cost: Number,
      value: Number,
      reorderPoint: Number,
      reorderStatus: {
        type: String,
        enum: ['ok', 'low', 'critical', 'out_of_stock']
      },
      daysInStock: Number // For aging reports
    }],
    totals: {
      itemCount: Number,
      totalQuantity: Number,
      totalValue: Number,
      lowStockItems: Number,
      outOfStockItems: Number
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

// Staff Sales Report Schema
const staffSalesReportSchema = mongoose.Schema(
  {
    reportDate: {
      type: Date,
      required: true
    },
    reportType: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'],
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: false
    },
    staff: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: String,
      orderCount: Number,
      sales: Number,
      refunds: Number,
      netSales: Number,
      averageOrderValue: Number,
      itemsSold: Number,
      hoursWorked: Number,
      salesPerHour: Number
    }],
    totals: {
      orderCount: Number,
      sales: Number,
      refunds: Number,
      netSales: Number,
      averageOrderValue: Number,
      itemsSold: Number,
      hoursWorked: Number,
      averageSalesPerHour: Number
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

// Custom Report Schema
const customReportSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    reportType: {
      type: String,
      required: true
    },
    filters: {
      type: mongoose.Schema.Types.Mixed,
      required: false
    },
    columns: [{
      field: String,
      label: String,
      dataType: String,
      format: String,
      visible: {
        type: Boolean,
        default: true
      }
    }],
    sortBy: {
      field: String,
      direction: {
        type: String,
        enum: ['asc', 'desc'],
        default: 'asc'
      }
    },
    groupBy: [String],
    calculations: [{
      type: {
        type: String,
        enum: ['sum', 'avg', 'min', 'max', 'count']
      },
      field: String,
      label: String
    }],
    isPublic: {
      type: Boolean,
      default: false
    },
    schedule: {
      isScheduled: {
        type: Boolean,
        default: false
      },
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly']
      },
      dayOfWeek: Number, // 0 = Sunday, 1 = Monday, etc.
      dayOfMonth: Number,
      time: String, // HH:MM format
      recipients: [String], // Email addresses
      lastSent: Date
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

// Activity Log Schema
const activityLogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      required: true
    },
    entityType: {
      type: String,
      required: true
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      required: false
    },
    ipAddress: {
      type: String,
      required: false
    },
    userAgent: {
      type: String,
      required: false
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

// Create models
const SalesReport = mongoose.model('SalesReport', salesReportSchema);
const ItemSalesReport = mongoose.model('ItemSalesReport', itemSalesReportSchema);
const TaxReport = mongoose.model('TaxReport', taxReportSchema);
const InventoryReport = mongoose.model('InventoryReport', inventoryReportSchema);
const StaffSalesReport = mongoose.model('StaffSalesReport', staffSalesReportSchema);
const CustomReport = mongoose.model('CustomReport', customReportSchema);
const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export {
  SalesReport,
  ItemSalesReport,
  TaxReport,
  InventoryReport,
  StaffSalesReport,
  CustomReport,
  ActivityLog
};
