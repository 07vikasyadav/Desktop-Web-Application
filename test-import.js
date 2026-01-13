// Test file to check if apiService imports correctly
import { apiService } from './services/apiService';

console.log('Testing apiService import...');
console.log('apiService:', apiService);
console.log('apiService.orders:', apiService?.orders);
console.log('typeof apiService:', typeof apiService);

if (apiService) {
  console.log('✅ apiService imported successfully');
} else {
  console.log('❌ apiService is undefined');
}
