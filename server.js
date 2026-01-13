const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Initialize Prisma Client
const prisma = new PrismaClient();

// Import routes
const ordersRoutes = require('./routes/orders');
const productsRoutes = require('./routes/products');
const customOrdersRoutes = require('./routes/customOrders');
const paymentsRoutes = require('./routes/payments');
const usersRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Declare server and io at module level so they're accessible in shutdown handlers
let server = null;
let io = null;

// CORS configuration - MUST be before other middleware
app.use(cors({
  origin: '*', // Allow all origins in Electron
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// Body parsing middleware - MUST be before routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware - log EVERY request
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl || req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Request Body:', JSON.stringify(req.body).substring(0, 500));
  }
  if (req.query && Object.keys(req.query).length > 0) {
    console.log('🔍 Query Params:', req.query);
  }
  next();
});

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/custom-orders', customOrdersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoints (both /health and /api/health) - verify DB connection
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      success: true,
      db: true,
      status: 'OK',
      message: 'Server is running and database is connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({ 
      success: true,
      db: false,
      status: 'OK',
      message: 'Server is running but database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      success: true,
      db: true,
      status: 'OK', 
      message: 'Inaam Furniture Backend API is running and database is connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({ 
      success: true,
      db: false,
      status: 'OK', 
      message: 'API is running but database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Debug route for quick verification
app.post('/debug/test-insert', async (req, res) => {
  try {
    console.log('🔧 Debug test-insert called');
    
    // Test database connection first
    await prisma.$queryRaw`SELECT 1`;
    
    // Try to create a minimal test product
    const testProduct = await prisma.Products.create({
      data: {
        product_id: `TEST${Date.now()}`,
        name: 'Test Product',
        description: 'Debug test product',
        price: '100',
        stock_quantity: '1',
        category_id: 'CAT001',
        status: 'active',
        is_customizable: 'false'
      }
    });
    
    console.log('✅ Debug test-insert successful:', testProduct.product_id);
    
    // Clean up - delete the test product
    await prisma.Products.delete({
      where: { product_id: testProduct.product_id }
    });
    
    res.json({
      success: true,
      message: 'Database insert test successful',
      testProductId: testProduct.product_id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Debug test-insert failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database insert test failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler - log what was requested
app.use('*', (req, res) => {
  console.error('❌ 404 - Route not found:', req.method, req.originalUrl || req.path);
  res.status(404).json({ 
    success: false, 
    message: `API endpoint not found: ${req.method} ${req.originalUrl || req.path}`,
    availableRoutes: [
      'GET /health',
      'GET /api/health',
      'POST /api/products',
      'POST /api/orders',
      'POST /api/payments',
      'POST /api/custom-orders'
    ]
  });
});

// Start server
const startServer = async () => {
  try {
    // Test Prisma connection
    try {
      await prisma.$connect();
      console.log('✅ Database connected successfully (Prisma)');
      app.locals.dbConnected = true;
    } catch (error) {
      console.warn('⚠️ Database connection failed:', error.message);
      console.warn('⚠️ Server will run but database operations may fail');
      app.locals.dbConnected = false;
    }

    const serverInstance = app.listen(PORT, '127.0.0.1', () => {
      console.log('🚀 Server running at http://127.0.0.1:5000');
      console.log('📊 API Base URL: http://127.0.0.1:' + PORT + '/api');
      console.log('🏥 Health Check: http://127.0.0.1:' + PORT + '/health');
      console.log('🏥 API Health: http://127.0.0.1:' + PORT + '/api/health');
      console.log('🔧 Debug Test: POST http://127.0.0.1:' + PORT + '/debug/test-insert');
    }).on('error', (err) => {
      console.error('❌ Server failed to start:', err);
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please stop other services or use a different port.`);
      }
    });

    // Assign to module-level variable so graceful shutdown can access it
    server = serverInstance;

    // Attach socket.io for realtime updates
    try {
      const { Server } = require('socket.io');
      io = new Server(server, {
        cors: {
          origin: '*'
        }
      });

      io.on('connection', (socket) => {
        console.log('🔌 Socket connected:', socket.id);
        socket.on('disconnect', () => console.log('🔌 Socket disconnected:', socket.id));
      });

      // Expose io on app.locals so routes can emit events
      app.locals.io = io;
      console.log('🔔 Socket.IO enabled for realtime events');
    } catch (err) {
      console.warn('⚠️ Socket.IO not available:', err.message);
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Don't exit the process, just log the error
});

// Graceful shutdown helper
const gracefulShutdown = async (signal) => {
  try {
    console.log(`🛑 Received ${signal} - performing graceful shutdown...`);

    // Prevent multiple calls
    if (app.locals._shuttingDown) {
      console.log('⚠️ Shutdown already in progress, ignoring duplicate signal');
      return;
    }
    app.locals._shuttingDown = true;

    // Stop accepting new connections
    if (server) {
      console.log('🧭 Closing HTTP server...');
      await new Promise((resolve) => {
        server.close((err) => {
          if (err) console.error('❌ Error closing server:', err);
          else console.log('✅ HTTP server closed');
          resolve();
        });
      });
    }

    // Close Socket.IO if present
    if (io) {
      try {
        console.log('🔌 Closing Socket.IO server...');
        // io.close() will stop the server and close all connections
        await io.close();
        console.log('✅ Socket.IO closed');
      } catch (err) {
        console.warn('⚠️ Error closing Socket.IO:', err && err.message ? err.message : err);
      }
    }

    // Disconnect Prisma (release DB connections)
    try {
      console.log('🧾 Disconnecting Prisma client...');
      await prisma.$disconnect();
      console.log('✅ Prisma disconnected');
    } catch (err) {
      console.warn('⚠️ Error disconnecting Prisma:', err && err.message ? err.message : err);
    }

    // Attempt to flush stdout/stderr (best-effort)
    try {
      if (process.stdout && typeof process.stdout.end === 'function') {
        try { process.stdout.end(); } catch (e) { /* ignore */ }
      }
      if (process.stderr && typeof process.stderr.end === 'function') {
        try { process.stderr.end(); } catch (e) { /* ignore */ }
      }
    } catch (e) {
      // ignore
    }

    console.log('🧹 Graceful shutdown complete. Exiting.');
    // Use a short timeout to allow logs to flush
    setTimeout(() => process.exit(0), 200);
  } catch (err) {
    console.error('❌ Error during graceful shutdown:', err);
    process.exit(1);
  }
};

// Hook signals for graceful shutdown
['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((sig) => {
  process.on(sig, async () => {
    await gracefulShutdown(sig);
  });
});

// Ensure we also try to shutdown on normal exit
process.on('exit', (code) => {
  console.log(`⚠️ Process exit event with code: ${code}`);
});

// If an uncaught exception occurs, attempt graceful shutdown then exit
process.on('uncaughtException', async (err) => {
  console.error('❌ Uncaught Exception (caught by handler):', err);
  await gracefulShutdown('uncaughtException');
});
