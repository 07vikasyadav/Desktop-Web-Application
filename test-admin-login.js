#!/usr/bin/env node
/**
 * Quick Test Script for Admin Login System
 * Tests all endpoints: health check, login success, login failure
 * Run this after starting the backend server
 * 
 * Usage: node test-admin-login.js
 */

const http = require('http');

const BASE_URL = 'http://127.0.0.1:5000';

const testEndpoint = (method, path, body = null) => {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(BASE_URL + path);
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            const ok = res.statusCode >= 200 && res.statusCode < 300;
            console.log(`${ok ? '✅' : '❌'} ${method} ${path} (${res.statusCode})`);
            console.log('   Response:', JSON.stringify(json, null, 2));
            resolve(json);
          } catch (e) {
            console.log(`❌ ${method} ${path} - Invalid JSON response`);
            console.log('   Raw:', data);
            resolve(null);
          }
        });
      });

      req.on('error', (err) => {
        console.log(`❌ ${method} ${path} - ${err.message}`);
        resolve(null);
      });

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    } catch (err) {
      console.log(`❌ ${method} ${path} - ${err.message}`);
      resolve(null);
    }
  });
};

async function runTests() {
  console.log('🧪 Admin Login System Tests\n');
  console.log(`Testing backend at: ${BASE_URL}\n`);

  console.log('--- Test 1: Health Check ---');
  await testEndpoint('GET', '/health');
  console.log();

  console.log('--- Test 2: Login with Valid Credentials (admin/admin123) ---');
  await testEndpoint('POST', '/api/auth/login', {
    username: 'admin',
    password: 'admin123'
  });
  console.log();

  console.log('--- Test 3: Login with Invalid Password ---');
  await testEndpoint('POST', '/api/auth/login', {
    username: 'admin',
    password: 'wrongpassword'
  });
  console.log();

  console.log('--- Test 4: Login with Invalid Username ---');
  await testEndpoint('POST', '/api/auth/login', {
    username: 'nonexistent',
    password: 'admin123'
  });
  console.log();

  console.log('--- Test 5: Login Missing Password ---');
  await testEndpoint('POST', '/api/auth/login', {
    username: 'admin'
  });
  console.log();

  console.log('✅ Tests completed!');
}

runTests();
