const http = require('http');

// Test API endpoints
// Enhanced to detect rate-limit responses (429 / 'rate_limited' / 'exceeded your Copilot token usage')
// - If rate-limited, show a friendly message instead of raw server error
// - Wait 2000ms and retry once on rate-limit
// - Preserve timeout handling and sequential testing
const testEndpoint = (path) => {
  const maxRetries = 1; // retry once on rate-limited
  const retryDelayMs = 2000;

  const attempt = (attemptsLeft) => {
    return new Promise((resolve) => {
      let data = '';
      const req = http.get(`http://127.0.0.1:5000${path}`, (res) => {
        res.on('data', chunk => {
          try {
            data += chunk;
          } catch (e) {
            // Ensure we never crash if data chunk is unexpected
            data = String(data) + String(chunk);
          }
        });

        res.on('end', () => {
          // Guard data to be a string
          const body = typeof data === 'string' ? data : String(data || '');
          const lcBody = body.toLowerCase();
          const status = res.statusCode || 0;

          // Detect rate-limit by status or body content
          const isRateLimited = (status === 429) || lcBody.includes('rate_limited') || lcBody.includes('exceeded your copilot token usage');

          if (isRateLimited) {
            console.log(`⚠️ ${path}: Rate limit reached. Please wait 1–2 minutes and try again.`);

            if (attemptsLeft > 0) {
              // Retry once after delay
              setTimeout(() => {
                resolve(attempt(attemptsLeft - 1));
              }, retryDelayMs);
              return;
            }

            // No retries left, resolve with a standardized message (do not expose raw server body)
            resolve(null);
            return;
          }

          // Normal successful output - print summary but avoid leaking large raw server errors
          const preview = body.length > 100 ? body.substring(0, 100) + '...' : body;
          console.log(`✅ ${path}: ${status} - ${preview}`);
          resolve(body);
        });
      });

      req.on('error', (err) => {
        // For network-level errors, preserve user-friendly output but do not crash
        console.log(`❌ ${path}: ${err.message}`);
        resolve(null);
      });

      // Keep original timeout behavior
      req.setTimeout(5000, () => {
        console.log(`⏰ ${path}: Timeout`);
        req.destroy();
        resolve(null);
      });
    });
  };

  return attempt(maxRetries);
};

async function testAPI() {
  console.log('🧪 Testing Backend API...');

  await testEndpoint('/health');
  await testEndpoint('/api/health');
  await testEndpoint('/api/orders');
  await testEndpoint('/api/payments');

  console.log('🏁 API Test completed');
}

testAPI();
