// Export all dashboard models from a single file for easier imports

// Item and Services Models
import { 
  Item, 
  Category, 
  Modifier, 
  Unit, 
  Service, 
  Resource, 
  Discount 
} from './itemModel.js';

// Payment and Invoice Models
import { 
  Transaction, 
  Order, 
  Invoice, 
  Estimate, 
  Dispute, 
  PaymentLink, 
  Subscription, 
  RiskRule 
} from './paymentModel.js';

// Customer Models
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
} from './customerModel.js';

// Report Models
import {
  SalesReport,
  ItemSalesReport,
  TaxReport,
  InventoryReport,
  StaffSalesReport,
  CustomReport,
  ActivityLog
} from './reportModel.js';

// Staff Models
import {
  TeamMember,
  Permission,
  Schedule,
  Availability,
  TimeOffRequest,
  Timecard,
  Announcement,
  Commission
} from './staffModel.js';

// Settings Models
import {
  BusinessSettings,
  Location,
  PaymentSettings,
  NotificationSettings,
  FulfillmentSettings,
  Device,
  Integration
} from './settingsModel.js';

// Export all models
export {
  // Item and Services
  Item,
  Category,
  Modifier,
  Unit,
  Service,
  Resource,
  Discount,
  
  // Payment and Invoice
  Transaction,
  Order,
  Invoice,
  Estimate,
  Dispute,
  PaymentLink,
  Subscription,
  RiskRule,
  
  // Customer
  Customer,
  Feedback,
  Contract,
  ContractTemplate,
  ContractClause,
  MarketingCampaign,
  LoyaltyProgram,
  LoyaltyCustomer,
  LoyaltyPromotion,
  
  // Report
  SalesReport,
  ItemSalesReport,
  TaxReport,
  InventoryReport,
  StaffSalesReport,
  CustomReport,
  ActivityLog,
  
  // Staff
  TeamMember,
  Permission,
  Schedule,
  Availability,
  TimeOffRequest,
  Timecard,
  Announcement,
  Commission,
  
  // Settings
  BusinessSettings,
  Location,
  PaymentSettings,
  NotificationSettings,
  FulfillmentSettings,
  Device,
  Integration
};
