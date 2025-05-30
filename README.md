# E-commerce Admin API

A backend API for e-commerce admin dashboard built with Node.js, Express.js, and MongoDB.

## Features

- Product management
- Inventory tracking with low stock alerts
- Sales analytics with period comparisons
- Admin authentication
- Rate limiting and security best practices

## Technologies

- Node.js (ES Modules)
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- Winston for logging
- Helmet for security
- Rate limiting

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Run the server: `npm run dev` (development) or `npm start` (production)
5. Seed the database: `npm run seed`

## API Documentation

### Authentication
- `POST /api/auth/login` - Admin login

### Products
- `GET /api/products` - Get all products (with pagination)
- `POST /api/products` - Create a new product (Admin only)
- `GET /api/products/:id` - Get product details

### Inventory
- `GET /api/inventory` - Get inventory status (with low stock filter)
- `PUT /api/inventory/:id` - Update inventory (Admin only)
- `GET /api/inventory/history/:productId` - Get inventory history

### Sales
- `GET /api/sales` - Get sales with filters (date range, product, category)
- `GET /api/sales/analytics` - Get sales analytics (daily, weekly, monthly, yearly)
