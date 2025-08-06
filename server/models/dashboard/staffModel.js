import mongoose from 'mongoose';

// Team Member Schema (extends User model)
const teamMemberSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    employeeId: {
      type: String,
      required: true,
      unique: true
    },
    position: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: false
    },
    hireDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on_leave', 'terminated'],
      default: 'active'
    },
    contactInfo: {
      phone: String,
      emergencyContact: {
        name: String,
        relationship: String,
        phone: String
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
      }
    },
    payRate: {
      type: Number,
      required: false
    },
    payType: {
      type: String,
      enum: ['hourly', 'salary', 'commission', 'mixed'],
      required: false
    },
    taxInfo: {
      ssn: String, // Encrypted
      taxWithholding: String,
      w4Status: String
    },
    bankInfo: {
      accountType: String,
      accountNumber: String, // Encrypted
      routingNumber: String, // Encrypted
      bankName: String
    },
    permissions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permission'
    }],
    locations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location'
    }],
    documents: [{
      name: String,
      type: String,
      url: String,
      uploadDate: Date
    }],
    notes: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

// Permission Schema
const permissionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: false
    },
    category: {
      type: String,
      required: true
    },
    actions: [{
      resource: {
        type: String,
        required: true
      },
      allowedActions: [{
        type: String,
        enum: ['view', 'create', 'update', 'delete', 'approve', 'export', 'import', 'all'],
        required: true
      }]
    }],
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

// Schedule Schema
const scheduleSchema = mongoose.Schema(
  {
    name: {
      type: String,
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
    shifts: [{
      teamMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamMember',
        required: true
      },
      position: String,
      startTime: {
        type: Date,
        required: true
      },
      endTime: {
        type: Date,
        required: true
      },
      breakDuration: {
        type: Number, // in minutes
        default: 0
      },
      notes: String,
      status: {
        type: String,
        enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'missed', 'swapped'],
        default: 'scheduled'
      }
    }],
    isPublished: {
      type: Boolean,
      default: false
    },
    publishedDate: {
      type: Date,
      required: false
    },
    totalHours: {
      type: Number,
      required: false
    },
    laborCost: {
      type: Number,
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

// Availability Schema
const availabilitySchema = mongoose.Schema(
  {
    teamMember: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember',
      required: true
    },
    dayOfWeek: {
      type: Number, // 0 = Sunday, 1 = Monday, etc.
      required: true
    },
    startTime: {
      type: String, // HH:MM format
      required: true
    },
    endTime: {
      type: String, // HH:MM format
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    notes: {
      type: String,
      required: false
    },
    effectiveDate: {
      type: Date,
      required: false
    },
    expirationDate: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true
  }
);

// Time Off Request Schema
const timeOffRequestSchema = mongoose.Schema(
  {
    teamMember: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember',
      required: true
    },
    requestType: {
      type: String,
      enum: ['vacation', 'sick', 'personal', 'other'],
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
    startTime: {
      type: String, // HH:MM format
      required: false // Only required for partial day
    },
    endTime: {
      type: String, // HH:MM format
      required: false // Only required for partial day
    },
    isFullDay: {
      type: Boolean,
      default: true
    },
    reason: {
      type: String,
      required: false
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'denied', 'canceled'],
      default: 'pending'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    approvalDate: {
      type: Date,
      required: false
    },
    notes: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

// Timecard Schema
const timecardSchema = mongoose.Schema(
  {
    teamMember: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember',
      required: true
    },
    shift: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule.shifts',
      required: false
    },
    clockInTime: {
      type: Date,
      required: true
    },
    clockOutTime: {
      type: Date,
      required: false
    },
    breaks: [{
      startTime: {
        type: Date,
        required: true
      },
      endTime: {
        type: Date,
        required: false
      },
      duration: {
        type: Number, // in minutes
        required: false
      },
      isPaid: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        enum: ['meal', 'rest', 'other'],
        default: 'meal'
      }
    }],
    totalHours: {
      type: Number,
      required: false
    },
    regularHours: {
      type: Number,
      required: false
    },
    overtimeHours: {
      type: Number,
      required: false
    },
    doubletime: {
      type: Number,
      required: false
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'approved', 'edited'],
      default: 'open'
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: false
    },
    notes: {
      type: String,
      required: false
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    approvalDate: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true
  }
);

// Announcement Schema
const announcementSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
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
    audience: {
      type: String,
      enum: ['all', 'location', 'department', 'position', 'specific'],
      default: 'all'
    },
    locations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location'
    }],
    departments: [String],
    positions: [String],
    teamMembers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember'
    }],
    attachments: [{
      name: String,
      url: String,
      type: String
    }],
    isActive: {
      type: Boolean,
      default: true
    },
    requiresAcknowledgement: {
      type: Boolean,
      default: false
    },
    acknowledgements: [{
      teamMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamMember'
      },
      date: {
        type: Date,
        default: Date.now
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

// Commission Schema
const commissionSchema = mongoose.Schema(
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
      enum: ['percentage', 'fixed', 'tiered', 'progressive'],
      required: true
    },
    value: {
      type: Number,
      required: function() { return this.type !== 'tiered' && this.type !== 'progressive'; }
    },
    tiers: [{
      threshold: Number,
      value: Number,
      isPercentage: {
        type: Boolean,
        default: true
      }
    }],
    applicableTo: {
      type: String,
      enum: ['all', 'category', 'item', 'service'],
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
    services: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    }],
    teamMembers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember'
    }],
    isActive: {
      type: Boolean,
      default: true
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
const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
const Permission = mongoose.model('Permission', permissionSchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);
const Availability = mongoose.model('Availability', availabilitySchema);
const TimeOffRequest = mongoose.model('TimeOffRequest', timeOffRequestSchema);
const Timecard = mongoose.model('Timecard', timecardSchema);
const Announcement = mongoose.model('Announcement', announcementSchema);
const Commission = mongoose.model('Commission', commissionSchema);

export {
  TeamMember,
  Permission,
  Schedule,
  Availability,
  TimeOffRequest,
  Timecard,
  Announcement,
  Commission
};
