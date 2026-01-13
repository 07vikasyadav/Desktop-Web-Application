# Inaam Furniture Backend API

Node.js + Express + MySQL backend for Inaam Furniture Shop Management system.

## Setup Instructions

### 1. Prerequisites
- Node.js installed
- MySQL server running
- MySQL database access

### 2. Configuration
1. Update `.env` file with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=inaam_furniture_db
DB_PORT=3306
```

### 3. Database Setup
```bash
# Initialize database and tables
npm run init-db
```

### 4. Start Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### 5. API Endpoints

#### Base URL: `http://localhost:5000/api`

**Orders:**
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order
- `DELETE /orders/:id` - Delete order

**Products:**
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

**Custom Orders:**
- `GET /custom-orders` - Get all custom orders
- `POST /custom-orders` - Create new custom order
- `PUT /custom-orders/:id` - Update custom order
- `DELETE /custom-orders/:id` - Delete custom order

**Payments:**
- `GET /payments` - Get all payments
- `POST /payments` - Record new payment
- `PUT /payments/:id` - Update payment
- `DELETE /payments/:id` - Delete payment

**Dashboard:**
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /dashboard/monthly-sales` - Get monthly sales data
- `GET /dashboard/product-analytics` - Get product analytics

**Users:**
- `POST /users/register` - Register new user
- `POST /users/login` - User login
- `GET /users` - Get all users
- `PUT /users/:id` - Update user

### 6. Database Schema
- **Users**: user_id, name, email, password, phone, role
- **Products**: product_id, name, description, price, stock_quantity, is_customizable
- **Orders**: order_id, user_id, total_amount, order_status, payment_status, order_date
- **Order_Items**: item_id, order_id, product_id, quantity, price
- **CustomOrders**: custom_order_id, user_id, product_name, dimensions, material_requested, estimated_cost
- **Payments**: payment_id, order_id, method, amount, status, paid_on
- **Customer**: customer_id, user_id, full_address, city, state, pincode
- **SupplierMaterials**: supplier_material_id, name, contact, address, unit, price_per_unit
- **InventoryMovements**: movement_id, product_id, quantity_change, reason, date

### 7. Sample Data
The database initialization includes sample data for all tables to get you started.
