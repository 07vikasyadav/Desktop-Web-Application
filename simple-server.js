const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001; // Changed to different port

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockData = {
  orders: [
    { id: 'ORD001', customer: 'John Doe', product: 'Wooden Chair', total: 2500, status: 'Confirmed', date: '2025-09-01' },
    { id: 'ORD002', customer: 'Jane Smith', product: 'Dining Table', total: 1800, status: 'Processing', date: '2025-09-02' }
  ],
  products: [
    { id: 'PRD001', name: 'Wooden Chair', price: 150, stock: 25, status: 'Active' },
    { id: 'PRD002', name: 'Dining Table', price: 800, stock: 10, status: 'Active' }
  ],
  payments: [
    { id: 'PAY001', order_id: 'ORD001', method: 'Card', amount: 2500, status: 'Success', date: '2025-09-01' },
    { id: 'PAY002', order_id: 'ORD002', method: 'UPI', amount: 900, status: 'Success', date: '2025-09-02' }
  ],
  customOrders: [
    { id: 'CUSTORD001', customer: 'Alice Johnson', product: 'Custom Bookshelf', status: 'Design Phase', cost: 3000, delivery: '2025-10-15' }
  ],
  stats: {
    totalOrders: 2,
    pendingOrders: 1,
    totalProducts: 2,
    lowStockProducts: 0,
    lowStockItems: 0,
    totalRevenue: 4300,
    monthlyRevenue: 4300,
    todaySales: 2500,
    totalCustomOrders: 1,
    totalCustomers: 3,
    completedOrders: 1
  }
};

// API Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is working' });
});

app.get('/api/orders', (req, res) => {
  res.json({ success: true, data: mockData.orders });
});

app.get('/api/products', (req, res) => {
  res.json({ success: true, data: mockData.products });
});

app.get('/api/payments', (req, res) => {
  res.json({ success: true, data: mockData.payments });
});

app.get('/api/custom-orders', (req, res) => {
  res.json({ success: true, data: mockData.customOrders });
});

app.get('/api/dashboard/stats', (req, res) => {
  res.json({ success: true, data: mockData.stats });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Simple Backend Server running on port', PORT);
  console.log('📊 API Base URL: http://127.0.0.1:' + PORT + '/api');
  console.log('🏥 Health Check: http://127.0.0.1:' + PORT + '/health');
});

// Handle errors gracefully
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});
