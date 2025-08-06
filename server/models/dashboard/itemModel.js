import mongoose from 'mongoose';

// Item Schema
const itemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: false
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    },
    sku: {
      type: String,
      required: false,
      unique: true
    },
    barcode: {
      type: String,
      required: false
    },
    cost: {
      type: Number,
      required: false,
      default: 0
    },
    taxRate: {
      type: Number,
      required: false,
      default: 0
    },
    modifiers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Modifier'
    }],
    attributes: [{
      name: String,
      value: String
    }],
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit'
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Category Schema
const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: false
    },
    image: {
      type: String,
      required: false
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    },
    sortOrder: {
      type: Number,
      required: false,
      default: 0
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

// Modifier Schema
const modifierSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    options: [{
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true,
        default: 0
      },
      isDefault: {
        type: Boolean,
        default: false
      }
    }],
    required: {
      type: Boolean,
      default: false
    },
    multiSelect: {
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

// Unit Schema
const unitSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    abbreviation: {
      type: String,
      required: true
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

// Service Schema
const serviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    duration: {
      type: Number, // in minutes
      required: true,
      default: 60
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    },
    resources: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource'
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

// Resource Schema
const resourceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
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

// Discount Schema
const discountSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: false
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    endDate: {
      type: Date,
      required: false
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    },
    applicableTo: {
      type: String,
      enum: ['all', 'category', 'item'],
      required: true,
      default: 'all'
    },
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }],
    items: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
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
const Item = mongoose.model('Item', itemSchema);
const Category = mongoose.model('Category', categorySchema);
const Modifier = mongoose.model('Modifier', modifierSchema);
const Unit = mongoose.model('Unit', unitSchema);
const Service = mongoose.model('Service', serviceSchema);
const Resource = mongoose.model('Resource', resourceSchema);
const Discount = mongoose.model('Discount', discountSchema);

export { Item, Category, Modifier, Unit, Service, Resource, Discount };
