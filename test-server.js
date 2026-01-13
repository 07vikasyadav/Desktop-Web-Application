const express = require('express');
const cors = require('cors');

// Simple test server without database
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Mock data (same as frontend)
const mockOrders = [
  { id: 'ORD001', customer: 'Amit Sharma', product: 'Wooden Chair', qty: 2, total: 3000, status: 'Delivered', date: '2025-08-02' },
  { id: 'ORD002', customer: 'Rina Kumar', product: 'Office Table', qty: 1, total: 8000, status: 'In Progress', date: '2025-08-11' },
  { id: 'ORD003', customer: 'Sunil Verma', product: 'Custom Wardrobe', qty: 1, total: 25000, status: 'Pending', date: '2025-08-12' },
  { id: 'ORD004', customer: 'Priya Singh', product: 'Dining Set', qty: 1, total: 35000, status: 'Delivered', date: '2025-08-15' },
];

const mockProducts = [
  { id: 1, name: 'Wooden Chair', description: 'Comfortable wooden chair', price: 1500, stock: 50, customizable: true },
  { id: 2, name: 'Office Table', description: 'Modern office table', price: 8000, stock: 15, customizable: false },
  { id: 3, name: 'Custom Wardrobe', description: 'Made-to-order wardrobe', price: 25000, stock: 5, customizable: true },
  { id: 4, name: 'Dining Set', description: '6-seater dining set', price: 35000, stock: 8, customizable: true },
];

// Test endpoints
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Inaam Furniture Test API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    data: mockOrders
  });
});

app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: mockProducts
  });
});

// Add missing endpoints
app.get('/api/payments', (req, res) => {
  const mockPayments = [
    { id: 'PAY001', orderId: 'ORD001', amount: 3000, method: 'Cash', date: '2025-08-02', status: 'Completed' },
    { id: 'PAY002', orderId: 'ORD002', amount: 8000, method: 'Card', date: '2025-08-11', status: 'Pending' },
  ];
  res.json({
    success: true,
    data: mockPayments
  });
});

app.get('/api/custom-orders', (req, res) => {
  const mockCustomOrders = [
    { 
      id: 'CUSTORD001', 
      customer: 'Rajesh Kumar', 
      productName: 'Custom L-shaped Sofa', 
      material: 'Premium Leather', 
      dimensions: '8ft x 6ft x 3ft', 
      estimatedCost: 45000, 
      status: 'In Progress',
      date: '2025-08-10'
    }
  ];
  res.json({
    success: true,
    data: mockCustomOrders
  });
});

app.get('/api/dashboard/stats', (req, res) => {
  const pendingOrders = mockOrders.filter(order => order.status === 'Pending').length;
  const todayRevenue = mockOrders
    .filter(order => order.date === new Date().toISOString().split('T')[0])
    .reduce((sum, order) => sum + order.total, 0);
  
  res.json({
    success: true,
    data: {
      totalOrders: mockOrders.length,
      pendingOrders,
      todayRevenue,
      totalProducts: mockProducts.length,
      lowStockItems: mockProducts.filter(p => p.stock < 10).length,
      customOrdersInProgress: 2,
      totalCustomOrders: 2,
      recentOrders: mockOrders.slice(0, 3)
    }
  });
});

// POST endpoints for adding data
app.post('/api/products', (req, res) => {
  const newProduct = {
    id: mockProducts.length + 1,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock_quantity,
    customizable: req.body.is_customizable
  };
  mockProducts.push(newProduct);
  console.log('✅ New product added:', newProduct);
  res.json({
    success: true,
    data: newProduct
  });
});

app.post('/api/orders', (req, res) => {
  const newOrder = {
    id: `ORD${String(mockOrders.length + 1).padStart(3, '0')}`,
    customer: 'New Customer',
    product: 'New Product',
    qty: req.body.items?.[0]?.quantity || 1,
    total: req.body.total_amount,
    status: req.body.order_status || 'Pending',
    date: new Date().toISOString().split('T')[0]
  };
  mockOrders.push(newOrder);
  console.log('✅ New order added:', newOrder);
  res.json({
    success: true,
    data: newOrder
  });
});

app.post('/api/payments', (req, res) => {
  const newPayment = {
    id: `PAY${String(mockOrders.length + 1).padStart(3, '0')}`,
    orderId: req.body.order_id,
    amount: req.body.amount,
    method: req.body.method,
    date: req.body.paid_on || new Date().toISOString().split('T')[0],
    status: req.body.status || 'Completed'
  };
  console.log('✅ New payment added:', newPayment);
  res.json({
    success: true,
    data: newPayment
  });
});

app.post('/api/custom-orders', (req, res) => {
  const newCustomOrder = {
    id: `CUSTORD${String(mockOrders.length + 1).padStart(3, '0')}`,
    customer: 'New Customer',
    productName: req.body.product_name,
    material: req.body.material_requested,
    dimensions: req.body.dimensions,
    estimatedCost: req.body.estimated_cost,
    status: req.body.status || 'Design Phase',
    date: new Date().toISOString().split('T')[0]
  };
  console.log('✅ New custom order added:', newCustomOrder);
  res.json({
    success: true,
    data: newCustomOrder
  });
});

app.listen(PORT, () => {
  console.log('🧪 Test Backend Server running on port', PORT);
  console.log('📊 API Base URL: http://localhost:' + PORT + '/api');
  console.log('🏥 Health Check: http://localhost:' + PORT + '/api/health');
  console.log('📝 Note: This is a test server with mock data. Configure MySQL and run the main server for full functionality.');
});
