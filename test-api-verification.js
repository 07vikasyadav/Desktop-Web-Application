/**
 * API Verification Test Script
 * Tests all POST endpoints to verify data persistence
 */

const axios = require('axios');

const API_BASE = 'http://127.0.0.1:5000';
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Test results
const results = {
  health: { passed: false, message: '' },
  debug: { passed: false, message: '' },
  product: { passed: false, message: '', productId: null },
  order: { passed: false, message: '', orderId: null },
  payment: { passed: false, message: '', paymentId: null },
  customOrder: { passed: false, message: '', customOrderId: null }
};

// Colors for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testHealth() {
  log('\n🔍 Testing Health Endpoint...', 'blue');
  try {
    const response = await api.get('/health');
    if (response.data.success && response.data.db) {
      results.health = { passed: true, message: 'Health check passed - DB connected' };
      log('✅ Health check: PASSED', 'green');
      return true;
    } else {
      results.health = { passed: false, message: 'Health check failed - DB not connected' };
      log('❌ Health check: FAILED - DB not connected', 'red');
      return false;
    }
  } catch (error) {
    results.health = { passed: false, message: `Health check failed: ${error.message}` };
    log(`❌ Health check: FAILED - ${error.message}`, 'red');
    return false;
  }
}

async function testDebugInsert() {
  log('\n🔧 Testing Debug Insert Endpoint...', 'blue');
  try {
    const response = await api.post('/debug/test-insert');
    if (response.data.success) {
      results.debug = { passed: true, message: 'Debug insert test passed' };
      log('✅ Debug insert: PASSED', 'green');
      return true;
    } else {
      results.debug = { passed: false, message: 'Debug insert test failed' };
      log('❌ Debug insert: FAILED', 'red');
      return false;
    }
  } catch (error) {
    results.debug = { passed: false, message: `Debug insert failed: ${error.message}` };
    log(`❌ Debug insert: FAILED - ${error.message}`, 'red');
    return false;
  }
}

async function testCreateProduct() {
  log('\n📦 Testing Product Creation...', 'blue');
  try {
    const productData = {
      name: `Test Product ${Date.now()}`,
      description: 'Test product for verification',
      price: 1500,
      stock_quantity: 10,
      category_id: 'CAT001',
      is_customizable: false
    };

    const response = await api.post('/api/products', productData);
    
    if (response.data.success && response.data.data) {
      results.product = { 
        passed: true, 
        message: 'Product created successfully',
        productId: response.data.data.product_id
      };
      log(`✅ Product creation: PASSED (ID: ${response.data.data.product_id})`, 'green');
      return response.data.data.product_id;
    } else {
      results.product = { passed: false, message: 'Product creation failed - no data returned' };
      log('❌ Product creation: FAILED - no data returned', 'red');
      return null;
    }
  } catch (error) {
    results.product = { 
      passed: false, 
      message: `Product creation failed: ${error.response?.data?.message || error.message}` 
    };
    log(`❌ Product creation: FAILED - ${error.response?.data?.message || error.message}`, 'red');
    return null;
  }
}

async function testCreateOrder(productId) {
  log('\n📋 Testing Order Creation...', 'blue');
  try {
    const orderData = {
      user_id: 'USR001',
      items: [{
        product_id: productId || 'PRD001',
        quantity: '2',
        price: '1500.00'
      }],
      total_amount: '3000.00',
      order_status: 'Pending',
      payment_status: 'Pending'
    };

    const response = await api.post('/api/orders', orderData);
    
    if (response.data.success && response.data.data) {
      results.order = { 
        passed: true, 
        message: 'Order created successfully',
        orderId: response.data.data.order_id
      };
      log(`✅ Order creation: PASSED (ID: ${response.data.data.order_id})`, 'green');
      return response.data.data.order_id;
    } else {
      results.order = { passed: false, message: 'Order creation failed - no data returned' };
      log('❌ Order creation: FAILED - no data returned', 'red');
      return null;
    }
  } catch (error) {
    results.order = { 
      passed: false, 
      message: `Order creation failed: ${error.response?.data?.message || error.message}` 
    };
    log(`❌ Order creation: FAILED - ${error.response?.data?.message || error.message}`, 'red');
    if (error.response?.data) {
      log(`   Details: ${JSON.stringify(error.response.data)}`, 'yellow');
    }
    return null;
  }
}

async function testCreatePayment(orderId) {
  log('\n💳 Testing Payment Creation...', 'blue');
  try {
    if (!orderId) {
      results.payment = { passed: false, message: 'Skipped - no order ID available' };
      log('⚠️ Payment creation: SKIPPED (no order ID)', 'yellow');
      return null;
    }

    const paymentData = {
      orderId: orderId,
      amount: 1500,
      method: 'Cash',
      status: 'Completed'
    };

    const response = await api.post('/api/payments', paymentData);
    
    if (response.data.success && response.data.data) {
      results.payment = { 
        passed: true, 
        message: 'Payment created successfully',
        paymentId: response.data.data.payment_id
      };
      log(`✅ Payment creation: PASSED (ID: ${response.data.data.payment_id})`, 'green');
      return response.data.data.payment_id;
    } else {
      results.payment = { passed: false, message: 'Payment creation failed - no data returned' };
      log('❌ Payment creation: FAILED - no data returned', 'red');
      return null;
    }
  } catch (error) {
    results.payment = { 
      passed: false, 
      message: `Payment creation failed: ${error.response?.data?.message || error.message}` 
    };
    log(`❌ Payment creation: FAILED - ${error.response?.data?.message || error.message}`, 'red');
    return null;
  }
}

async function testCreateCustomOrder() {
  log('\n🎨 Testing Custom Order Creation...', 'blue');
  try {
    const customOrderData = {
      user_id: 'USR001',
      productName: `Custom Test Product ${Date.now()}`,
      description: 'Test custom order',
      dimensions: '6ft x 4ft x 3ft',
      material_requested: 'Oak Wood',
      estimated_cost: 25000,
      status: 'Design Phase'
    };

    const response = await api.post('/api/custom-orders', customOrderData);
    
    if (response.data.success && response.data.data) {
      results.customOrder = { 
        passed: true, 
        message: 'Custom order created successfully',
        customOrderId: response.data.data.custom_order_id
      };
      log(`✅ Custom order creation: PASSED (ID: ${response.data.data.custom_order_id})`, 'green');
      return response.data.data.custom_order_id;
    } else {
      results.customOrder = { passed: false, message: 'Custom order creation failed - no data returned' };
      log('❌ Custom order creation: FAILED - no data returned', 'red');
      return null;
    }
  } catch (error) {
    results.customOrder = { 
      passed: false, 
      message: `Custom order creation failed: ${error.response?.data?.message || error.message}` 
    };
    log(`❌ Custom order creation: FAILED - ${error.response?.data?.message || error.message}`, 'red');
    return null;
  }
}

async function runAllTests() {
  log('\n' + '='.repeat(60), 'blue');
  log('🚀 Starting API Verification Tests', 'blue');
  log('='.repeat(60), 'blue');

  // Test 1: Health check
  const healthOk = await testHealth();
  if (!healthOk) {
    log('\n⚠️ Health check failed. Some tests may fail.', 'yellow');
  }

  // Test 2: Debug insert
  await testDebugInsert();

  // Test 3: Create product
  const productId = await testCreateProduct();

  // Test 4: Create order (requires product)
  const orderId = await testCreateOrder(productId);

  // Test 5: Create payment (requires order)
  await testCreatePayment(orderId);

  // Test 6: Create custom order
  await testCreateCustomOrder();

  // Print summary
  log('\n' + '='.repeat(60), 'blue');
  log('📊 TEST SUMMARY', 'blue');
  log('='.repeat(60), 'blue');

  const allTests = [
    { name: 'Health Check', result: results.health },
    { name: 'Debug Insert', result: results.debug },
    { name: 'Product Creation', result: results.product },
    { name: 'Order Creation', result: results.order },
    { name: 'Payment Creation', result: results.payment },
    { name: 'Custom Order Creation', result: results.customOrder }
  ];

  let passedCount = 0;
  allTests.forEach(test => {
    const status = test.result.passed ? '✅ PASSED' : '❌ FAILED';
    const color = test.result.passed ? 'green' : 'red';
    log(`${status.padEnd(12)} - ${test.name}`, color);
    if (!test.result.passed) {
      log(`            ${test.result.message}`, 'yellow');
    }
  });

  passedCount = allTests.filter(t => t.result.passed).length;
  log(`\n📈 Results: ${passedCount}/${allTests.length} tests passed`, 
      passedCount === allTests.length ? 'green' : 'yellow');

  if (passedCount === allTests.length) {
    log('\n🎉 All tests passed! API is working correctly.', 'green');
    process.exit(0);
  } else {
    log('\n⚠️ Some tests failed. Check the errors above.', 'yellow');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  log(`\n💥 Test runner crashed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

