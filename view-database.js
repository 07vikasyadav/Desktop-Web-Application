const { pool } = require('./config/database');

async function viewDatabaseData() {
  try {
    console.log('🗄️ INAAM FURNITURE DATABASE VIEWER');
    console.log('='.repeat(80));

    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database successfully!\n');
    connection.release();

    // Show all tables
    console.log('📋 AVAILABLE TABLES:');
    const [tables] = await pool.execute('SHOW TABLES');
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${Object.values(table)[0]}`);
    });
    console.log('\n' + '='.repeat(80) + '\n');

    // View Users table
    console.log('👥 USERS TABLE:');
    try {
      const [users] = await pool.execute(`
        SELECT user_id, name, email, phone, role, created_at 
        FROM Users 
        ORDER BY created_at DESC
      `);
      
      if (users.length === 0) {
        console.log('📝 No users found in database');
      } else {
        console.log(`Found ${users.length} users:`);
        console.table(users);
      }
    } catch (error) {
      console.log('❌ Users table not found or error:', error.message);
    }
    console.log('\n' + '='.repeat(80) + '\n');

    // View Products table
    console.log('📦 PRODUCTS TABLE:');
    try {
      const [products] = await pool.execute(`
        SELECT product_id, name, price, stock_quantity, category_id, status 
        FROM Products 
        LIMIT 10
      `);
      
      if (products.length === 0) {
        console.log('📝 No products found in database');
      } else {
        console.log(`Found ${products.length} products (showing first 10):`);
        console.table(products);
      }
    } catch (error) {
      console.log('❌ Products table not found or error:', error.message);
    }
    console.log('\n' + '='.repeat(80) + '\n');

    // View Orders table
    console.log('🛒 ORDERS TABLE:');
    try {
      const [orders] = await pool.execute(`
        SELECT order_id, user_id, total_amount, order_status, payment_status, order_date 
        FROM Orders 
        ORDER BY order_date DESC 
        LIMIT 10
      `);
      
      if (orders.length === 0) {
        console.log('📝 No orders found in database');
      } else {
        console.log(`Found ${orders.length} orders (showing latest 10):`);
        console.table(orders);
      }
    } catch (error) {
      console.log('❌ Orders table not found or error:', error.message);
    }
    console.log('\n' + '='.repeat(80) + '\n');

    // View Admins table
    console.log('👨‍💼 ADMINS TABLE:');
    try {
      const [admins] = await pool.execute(`
        SELECT admin_id, username, email, created_at 
        FROM Admins 
        ORDER BY created_at DESC
      `);
      
      if (admins.length === 0) {
        console.log('📝 No admins found in database');
      } else {
        console.log(`Found ${admins.length} admins:`);
        console.table(admins);
      }
    } catch (error) {
      console.log('❌ Admins table not found or error:', error.message);
    }

    // Database statistics
    console.log('\n' + '='.repeat(80) + '\n');
    console.log('📊 DATABASE STATISTICS:');
    
    const stats = [];
    const tableNames = ['Users', 'Products', 'Orders', 'Payments', 'CustomOrders', 'Admins'];
    
    for (const tableName of tableNames) {
      try {
        const [countResult] = await pool.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
        stats.push({
          Table: tableName,
          Records: countResult[0].count
        });
      } catch (error) {
        stats.push({
          Table: tableName,
          Records: 'Table not found'
        });
      }
    }
    
    console.table(stats);

    console.log('\n✅ Database viewing completed successfully!');

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure MySQL server is running');
    console.log('2. Check your database credentials in backend/.env file');
    console.log('3. Verify database name: inaam_furniture_db');
    console.log('4. Ensure the database exists');
    console.log('5. Try: mysql -u root -p');
  } finally {
    if (pool) {
      await pool.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the database viewer
viewDatabaseData();