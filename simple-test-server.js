const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => {
  console.log('Health endpoint called!');
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Simple server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('❌ Server error:', err);
});

console.log('Server setup complete');

// Prevent process from exiting
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});