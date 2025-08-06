# Dashboard API Documentation

This document provides details about the Dashboard API endpoints for the application.

## Base URL

All API endpoints are prefixed with: `/api/dashboard`

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Many endpoints also require admin privileges, which are checked via middleware.

## Items and Services API

### Items

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/items` | Get all items (with pagination, filtering, sorting) | Private/Admin |
| GET | `/items/:id` | Get single item by ID | Private/Admin |
| POST | `/items` | Create a new item | Private/Admin |
| PUT | `/items/:id` | Update an item | Private/Admin |
| DELETE | `/items/:id` | Delete an item | Private/Admin |
| PUT | `/items/:id/inventory` | Update item inventory | Private/Admin |

### Categories

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/items/categories` | Get all categories | Private/Admin |
| GET | `/items/categories/:id` | Get single category | Private/Admin |
| POST | `/items/categories` | Create a new category | Private/Admin |
| PUT | `/items/categories/:id` | Update a category | Private/Admin |
| DELETE | `/items/categories/:id` | Delete a category | Private/Admin |

### Modifiers

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/items/modifiers` | Get all modifiers | Private/Admin |
| GET | `/items/modifiers/:id` | Get single modifier | Private/Admin |
| POST | `/items/modifiers` | Create a new modifier | Private/Admin |
| PUT | `/items/modifiers/:id` | Update a modifier | Private/Admin |
| DELETE | `/items/modifiers/:id` | Delete a modifier | Private/Admin |

### Services

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/items/services` | Get all services | Private/Admin |
| GET | `/items/services/:id` | Get single service | Private/Admin |
| POST | `/items/services` | Create a new service | Private/Admin |
| PUT | `/items/services/:id` | Update a service | Private/Admin |
| DELETE | `/items/services/:id` | Delete a service | Private/Admin |

### Discounts

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/items/discounts` | Get all discounts | Private/Admin |
| GET | `/items/discounts/:id` | Get single discount | Private/Admin |
| POST | `/items/discounts` | Create a new discount | Private/Admin |
| PUT | `/items/discounts/:id` | Update a discount | Private/Admin |
| DELETE | `/items/discounts/:id` | Delete a discount | Private/Admin |

## Payments and Invoices API

### Transactions

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/payments/transactions` | Get all transactions | Private/Admin |
| GET | `/payments/transactions/:id` | Get single transaction | Private/Admin |
| POST | `/payments/transactions` | Create a new transaction | Private/Admin |
| PUT | `/payments/transactions/:id` | Update transaction status | Private/Admin |
| POST | `/payments/transactions/:id/refund` | Process refund for transaction | Private/Admin |

### Orders

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/payments/orders` | Get all orders | Private/Admin |
| GET | `/payments/orders/:id` | Get single order | Private/Admin |
| POST | `/payments/orders` | Create a new order | Private/Admin |
| PUT | `/payments/orders/:id` | Update order status | Private/Admin |
| DELETE | `/payments/orders/:id` | Cancel an order | Private/Admin |

### Invoices

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/payments/invoices` | Get all invoices | Private/Admin |
| GET | `/payments/invoices/:id` | Get single invoice | Private/Admin |
| POST | `/payments/invoices` | Create a new invoice | Private/Admin |
| PUT | `/payments/invoices/:id` | Update invoice | Private/Admin |
| DELETE | `/payments/invoices/:id` | Delete invoice | Private/Admin |
| PUT | `/payments/invoices/:id/status` | Update invoice status | Private/Admin |
| POST | `/payments/invoices/:id/payment` | Record payment for invoice | Private/Admin |

### Estimates

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/payments/estimates` | Get all estimates | Private/Admin |
| GET | `/payments/estimates/:id` | Get single estimate | Private/Admin |
| POST | `/payments/estimates` | Create a new estimate | Private/Admin |
| PUT | `/payments/estimates/:id` | Update estimate | Private/Admin |
| DELETE | `/payments/estimates/:id` | Delete estimate | Private/Admin |
| POST | `/payments/estimates/:id/convert` | Convert estimate to invoice | Private/Admin |

### Payment Links

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/payments/links` | Get all payment links | Private/Admin |
| GET | `/payments/links/:id` | Get single payment link | Private/Admin |
| POST | `/payments/links` | Create a new payment link | Private/Admin |
| PUT | `/payments/links/:id` | Update payment link | Private/Admin |
| DELETE | `/payments/links/:id` | Delete payment link | Private/Admin |

### Subscriptions

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/payments/subscriptions` | Get all subscriptions | Private/Admin |
| GET | `/payments/subscriptions/:id` | Get single subscription | Private/Admin |
| POST | `/payments/subscriptions` | Create a new subscription | Private/Admin |
| PUT | `/payments/subscriptions/:id` | Update subscription | Private/Admin |
| PUT | `/payments/subscriptions/:id/status` | Update subscription status | Private/Admin |
| DELETE | `/payments/subscriptions/:id` | Cancel subscription | Private/Admin |

### Disputes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/payments/disputes` | Get all disputes | Private/Admin |
| GET | `/payments/disputes/:id` | Get single dispute | Private/Admin |
| POST | `/payments/disputes` | Create a new dispute | Private/Admin |
| PUT | `/payments/disputes/:id` | Update dispute | Private/Admin |
| PUT | `/payments/disputes/:id/status` | Update dispute status | Private/Admin |

### Risk Rules

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/payments/risk-rules` | Get all risk rules | Private/Admin |
| GET | `/payments/risk-rules/:id` | Get single risk rule | Private/Admin |
| POST | `/payments/risk-rules` | Create a new risk rule | Private/Admin |
| PUT | `/payments/risk-rules/:id` | Update risk rule | Private/Admin |
| DELETE | `/payments/risk-rules/:id` | Delete risk rule | Private/Admin |

## Customers API

### Customers

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/customers` | Get all customers | Private/Admin |
| GET | `/customers/:id` | Get single customer | Private/Admin |
| POST | `/customers` | Create a new customer | Private/Admin |
| PUT | `/customers/:id` | Update a customer | Private/Admin |
| DELETE | `/customers/:id` | Delete a customer | Private/Admin |

### Feedback

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/customers/feedback` | Get all feedback | Private/Admin |
| GET | `/customers/feedback/:id` | Get single feedback | Private/Admin |
| POST | `/customers/feedback` | Create a new feedback | Private/Admin |
| PUT | `/customers/feedback/:id` | Update feedback | Private/Admin |
| DELETE | `/customers/feedback/:id` | Delete feedback | Private/Admin |

### Contracts

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/customers/contracts` | Get all contracts | Private/Admin |
| GET | `/customers/contracts/:id` | Get single contract | Private/Admin |
| POST | `/customers/contracts` | Create a new contract | Private/Admin |
| PUT | `/customers/contracts/:id` | Update contract | Private/Admin |
| PUT | `/customers/contracts/:id/status` | Update contract status | Private/Admin |
| DELETE | `/customers/contracts/:id` | Delete contract | Private/Admin |

### Contract Templates

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/customers/contract-templates` | Get all contract templates | Private/Admin |
| GET | `/customers/contract-templates/:id` | Get single contract template | Private/Admin |
| POST | `/customers/contract-templates` | Create a new contract template | Private/Admin |
| PUT | `/customers/contract-templates/:id` | Update contract template | Private/Admin |
| DELETE | `/customers/contract-templates/:id` | Delete contract template | Private/Admin |

### Contract Clauses

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/customers/contract-clauses` | Get all contract clauses | Private/Admin |
| GET | `/customers/contract-clauses/:id` | Get single contract clause | Private/Admin |
| POST | `/customers/contract-clauses` | Create a new contract clause | Private/Admin |
| PUT | `/customers/contract-clauses/:id` | Update contract clause | Private/Admin |
| DELETE | `/customers/contract-clauses/:id` | Delete contract clause | Private/Admin |

### Marketing Campaigns

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/customers/campaigns` | Get all marketing campaigns | Private/Admin |
| GET | `/customers/campaigns/:id` | Get single marketing campaign | Private/Admin |
| POST | `/customers/campaigns` | Create a new marketing campaign | Private/Admin |
| PUT | `/customers/campaigns/:id` | Update marketing campaign | Private/Admin |
| PUT | `/customers/campaigns/:id/status` | Update campaign status | Private/Admin |
| DELETE | `/customers/campaigns/:id` | Delete marketing campaign | Private/Admin |

### Loyalty Programs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/customers/loyalty/programs` | Get all loyalty programs | Private/Admin |
| GET | `/customers/loyalty/programs/:id` | Get single loyalty program | Private/Admin |
| POST | `/customers/loyalty/programs` | Create a new loyalty program | Private/Admin |
| PUT | `/customers/loyalty/programs/:id` | Update loyalty program | Private/Admin |
| DELETE | `/customers/loyalty/programs/:id` | Delete loyalty program | Private/Admin |

### Loyalty Customers

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/customers/loyalty/members` | Get all loyalty members | Private/Admin |
| GET | `/customers/loyalty/members/:id` | Get single loyalty member | Private/Admin |
| POST | `/customers/loyalty/members` | Create a new loyalty member | Private/Admin |
| PUT | `/customers/loyalty/members/:id` | Update loyalty member | Private/Admin |
| PUT | `/customers/loyalty/members/:id/points` | Update loyalty points | Private/Admin |
| DELETE | `/customers/loyalty/members/:id` | Delete loyalty member | Private/Admin |

### Loyalty Promotions

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/customers/loyalty/promotions` | Get all loyalty promotions | Private/Admin |
| GET | `/customers/loyalty/promotions/:id` | Get single loyalty promotion | Private/Admin |
| POST | `/customers/loyalty/promotions` | Create a new loyalty promotion | Private/Admin |
| PUT | `/customers/loyalty/promotions/:id` | Update loyalty promotion | Private/Admin |
| DELETE | `/customers/loyalty/promotions/:id` | Delete loyalty promotion | Private/Admin |

## Reports API

### Sales Reports

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/reports/sales` | Get sales reports | Private/Admin |
| GET | `/reports/sales/:id` | Get single sales report | Private/Admin |
| POST | `/reports/sales/generate` | Generate a new sales report | Private/Admin |

### Item Sales Reports

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/reports/item-sales` | Get item sales reports | Private/Admin |
| GET | `/reports/item-sales/:id` | Get single item sales report | Private/Admin |
| POST | `/reports/item-sales/generate` | Generate a new item sales report | Private/Admin |

### Tax Reports

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/reports/tax` | Get tax reports | Private/Admin |
| GET | `/reports/tax/:id` | Get single tax report | Private/Admin |
| POST | `/reports/tax/generate` | Generate a new tax report | Private/Admin |

### Inventory Reports

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/reports/inventory` | Get inventory reports | Private/Admin |
| GET | `/reports/inventory/:id` | Get single inventory report | Private/Admin |
| POST | `/reports/inventory/generate` | Generate a new inventory report | Private/Admin |

### Staff Sales Reports

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/reports/staff-sales` | Get staff sales reports | Private/Admin |
| GET | `/reports/staff-sales/:id` | Get single staff sales report | Private/Admin |
| POST | `/reports/staff-sales/generate` | Generate a new staff sales report | Private/Admin |

### Custom Reports

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/reports/custom` | Get custom reports | Private/Admin |
| GET | `/reports/custom/:id` | Get single custom report | Private/Admin |
| POST | `/reports/custom` | Create a new custom report | Private/Admin |
| PUT | `/reports/custom/:id` | Update custom report | Private/Admin |
| DELETE | `/reports/custom/:id` | Delete custom report | Private/Admin |
| POST | `/reports/custom/:id/generate` | Generate a custom report | Private/Admin |

### Activity Logs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/reports/activity` | Get activity logs | Private/Admin |
| GET | `/reports/activity/:id` | Get single activity log | Private/Admin |

## Staff API

### Team Members

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/staff` | Get all team members | Private/Admin |
| GET | `/staff/:id` | Get single team member | Private/Admin |
| POST | `/staff` | Create a new team member | Private/Admin |
| PUT | `/staff/:id` | Update a team member | Private/Admin |
| DELETE | `/staff/:id` | Delete a team member | Private/Admin |

### Permissions

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/staff/permissions/all` | Get all permissions | Private/Admin |
| POST | `/staff/permissions` | Create a new permission | Private/Admin |

### Schedules

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/staff/:id/schedule` | Get team member schedule | Private/Admin |
| POST | `/staff/:id/schedule` | Create schedule for team member | Private/Admin |

### Availability

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/staff/:id/availability` | Get team member availability | Private/Admin |
| PUT | `/staff/:id/availability` | Update team member availability | Private/Admin |

### Time Off Requests

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/staff/time-off/all` | Get all time off requests | Private/Admin |
| POST | `/staff/:id/time-off` | Create time off request | Private |
| PUT | `/staff/time-off/:id` | Approve/reject time off request | Private/Admin |

### Timecards

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/staff/:id/timecards` | Get timecards for a team member | Private/Admin |
| POST | `/staff/:id/timecards` | Create timecard | Private |
| PUT | `/staff/:id/timecards/:timecardId` | Update timecard (clock out) | Private |

### Announcements

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/staff/announcements/all` | Get all announcements | Private |
| POST | `/staff/announcements` | Create announcement | Private/Admin |

### Commissions

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/staff/:id/commissions` | Get commissions for a team member | Private/Admin |
| POST | `/staff/:id/commissions` | Create commission | Private/Admin |

## Settings API

### Business Settings

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/settings/business` | Get business settings | Private/Admin |
| PUT | `/settings/business` | Create or update business settings | Private/Admin |

### Locations

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/settings/locations` | Get all locations | Private/Admin |
| GET | `/settings/locations/:id` | Get single location | Private/Admin |
| POST | `/settings/locations` | Create a location | Private/Admin |
| PUT | `/settings/locations/:id` | Update a location | Private/Admin |
| DELETE | `/settings/locations/:id` | Delete a location | Private/Admin |

### Payment Settings

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/settings/payment` | Get payment settings | Private/Admin |
| PUT | `/settings/payment` | Create or update payment settings | Private/Admin |

### Notification Settings

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/settings/notifications` | Get notification settings | Private/Admin |
| PUT | `/settings/notifications` | Create or update notification settings | Private/Admin |

### Fulfillment Settings

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/settings/fulfillment` | Get fulfillment settings | Private/Admin |
| PUT | `/settings/fulfillment` | Create or update fulfillment settings | Private/Admin |

### Devices

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/settings/devices` | Get all devices | Private/Admin |
| GET | `/settings/devices/:id` | Get single device | Private/Admin |
| POST | `/settings/devices` | Register a device | Private/Admin |
| PUT | `/settings/devices/:id` | Update a device | Private/Admin |
| DELETE | `/settings/devices/:id` | Delete a device | Private/Admin |

### Integrations

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/settings/integrations` | Get all integrations | Private/Admin |
| GET | `/settings/integrations/:id` | Get single integration | Private/Admin |
| POST | `/settings/integrations` | Create an integration | Private/Admin |
| PUT | `/settings/integrations/:id` | Update an integration | Private/Admin |
| DELETE | `/settings/integrations/:id` | Delete an integration | Private/Admin |
| POST | `/settings/integrations/:id/test` | Test an integration connection | Private/Admin |

## Request and Response Formats

### Pagination

For endpoints that return lists, pagination is supported with the following query parameters:

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 10)

Example: `/api/dashboard/customers?page=2&limit=20`

### Filtering

Many list endpoints support filtering with query parameters:

Example: `/api/dashboard/items?category=electronics&minPrice=100&maxPrice=500`

### Sorting

Sort results using the `sort` query parameter:

Example: `/api/dashboard/orders?sort=-createdAt` (descending by creation date)

### Response Format

Successful responses follow this format:

```json
{
  "data": [...],  // The requested data
  "pagination": {  // Only for paginated responses
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalItems": 48
  }
}
```

Error responses follow this format:

```json
{
  "message": "Error message description"
}
```

## Authentication Errors

- 401 Unauthorized: Missing or invalid token
- 403 Forbidden: Valid token but insufficient permissions

## Common HTTP Status Codes

- 200 OK: Successful request
- 201 Created: Resource successfully created
- 400 Bad Request: Invalid request parameters
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server-side error
