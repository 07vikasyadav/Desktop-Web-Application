import React from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  LinearProgress
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useAppContext } from '../context/AppContext';
import ConnectionStatus from '../components/ConnectionStatus';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const { orders, products, getDashboardStats } = useAppContext();
  const stats = getDashboardStats() || {};

  const statsData = [
    {
      title: 'Today Sales',
      value: `₹ ${(stats.todaySales || 0).toLocaleString()}`,
      subtitle: `${stats.totalOrders || 0} orders • ${stats.totalCustomOrders || 0} custom orders`,
      icon: <AttachMoneyIcon />,
      color: '#4caf50'
    },
    {
      title: 'Pending Orders',
      value: (stats.pendingOrders || 0).toString(),
      subtitle: 'Awaiting payment or delivery',
      icon: <PendingActionsIcon />,
      color: '#ff9800'
    },
    {
      title: 'Low Stock Items',
      value: (stats.lowStockProducts || 0).toString(),
      subtitle: 'Products under reorder level',
      icon: <InventoryIcon />,
      color: '#f44336'
    },
    {
      title: 'Custom Orders Active',
      value: (stats.totalCustomOrders || 0).toString(),
      subtitle: 'Orders in progress',
      icon: <TrendingUpIcon />,
      color: '#2196f3'
    }
  ];

  // Get recent orders (last 5) - with safety check
  const safeOrders = Array.isArray(orders) ? orders : [];
  const recentOrders = safeOrders.slice(-5).reverse();

  // Get low stock products - with safety check
  const safeProducts = Array.isArray(products) ? products : [];
  const lowStockProducts = safeProducts.filter(product => (product?.stock || 0) < 10);

  const suppliersData = [
    { name: 'Teak Wood', supplier: 'Nagpur Timber Co', price: '₹1200 / Cubic Ft' },
    { name: 'Plywood', supplier: 'City Plywood', price: '₹450 / Sheet' },
  ];

  // --- Prepare data for charts (last 14 days) ---
  const DAYS = 14;
  const labels = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' }));
  }

  const ordersArray = Array.isArray(orders) ? orders : [];

  // revenue per day
  const revenueByLabel = labels.map((lab, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (DAYS - 1 - idx));
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const sum = ordersArray.reduce((sum, o) => {
      const dateStr = o.date || o.order_date || o.createdAt || o.order_created_at || o.paid_on;
      const od = dateStr ? new Date(dateStr) : null;
      if (!od || isNaN(od)) return sum;
      const t = od.getTime();
      if (t >= dayStart && t < dayEnd) {
        const amt = Number(o.total ?? o.total_amount ?? o.amount ?? 0);
        return sum + (isNaN(amt) ? 0 : amt);
      }
      return sum;
    }, 0);
    return sum;
  });

  // bookings per day split by status (Confirmed / Pending)
  const confirmedByLabel = labels.map((lab, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (DAYS - 1 - idx));
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const count = ordersArray.reduce((count, o) => {
      const dateStr = o.date || o.order_date || o.createdAt || o.order_created_at || o.paid_on;
      const od = dateStr ? new Date(dateStr) : null;
      if (!od || isNaN(od)) return count;
      const t = od.getTime();
      if (t >= dayStart && t < dayEnd) {
        const status = (o.status || o.order_status || '').toLowerCase();
        if (status === 'delivered' || status === 'completed' || status === 'confirmed' || status === 'paid') return count + 1;
      }
      return count;
    }, 0);
    return count;
  });

  const pendingByLabel = labels.map((lab, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (DAYS - 1 - idx));
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const count = ordersArray.reduce((count, o) => {
      const dateStr = o.date || o.order_date || o.createdAt || o.order_created_at || o.paid_on;
      const od = dateStr ? new Date(dateStr) : null;
      if (!od || isNaN(od)) return count;
      const t = od.getTime();
      if (t >= dayStart && t < dayEnd) {
        const status = (o.status || o.order_status || '').toLowerCase();
        if (status === 'pending' || status === 'awaiting' || status === '') return count + 1;
      }
      return count;
    }, 0);
    return count;
  });

  const revenueLineData = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: revenueByLabel,
        fill: false,
        borderColor: '#6a5acd',
        backgroundColor: '#6a5acd',
        tension: 0.2,
        pointRadius: 4
      }
    ]
  };

  const bookingsBarData = {
    labels,
    datasets: [
      {
        label: 'Confirmed',
        data: confirmedByLabel,
        backgroundColor: '#4caf50'
      },
      {
        label: 'Pending',
        data: pendingByLabel,
        backgroundColor: '#ffca28'
      }
    ]
  };

  const revenueOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  const bookingsOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="textSecondary">
          / Overview - Live Data
        </Typography>
      </Box>

      {/* Connection Status */}
      <ConnectionStatus />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={1} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ color: stat.color, mr: 1 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  {stat.title}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {stat.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} md={8}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Orders
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Latest {recentOrders.length} orders
                </Typography>
              </Box>
              <Button variant="contained" size="small">
                View all orders
              </Button>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell>₹ {order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label={order.status} 
                          color={order.status === 'Delivered' ? 'success' : order.status === 'Pending' ? 'warning' : 'info'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Revenue & Bookings Charts */}
          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Revenue Overview
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Revenue trends (last {DAYS} days)
            </Typography>
            <div style={{ height: 180 }}>
              <Line data={revenueLineData} options={revenueOptions} />
            </div>
          </Paper>

          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Bookings Overview
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Confirmed vs Pending (last {DAYS} days)
            </Typography>
            <div style={{ height: 180 }}>
              <Bar data={bookingsBarData} options={bookingsOptions} />
            </div>
          </Paper>

          {/* Inventory Overview */}
          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Inventory Overview
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Stock levels & alerts
                </Typography>
              </Box>
              <Typography variant="caption" color="textSecondary">Live Data</Typography>
            </Box>

            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2">{item.stock} pcs</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(item.stock / 50) * 100} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      bgcolor: '#f0f0f0',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: item.stock < 10 ? '#f44336' : '#4caf50'
                      }
                    }} 
                  />
                  {item.stock < 10 && (
                    <Typography variant="caption" color="error" sx={{ fontWeight: 500 }}>
                      Low stock — reorder suggested
                    </Typography>
                  )}
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">All products are well stocked</Typography>
            )}
          </Paper>

          {/* Revenue Overview (replaces Top Suppliers + Quick Stats) */}
          <Paper elevation={1} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Revenue Overview
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Real-time revenue metrics
                </Typography>
              </Box>
              <Typography variant="caption" color="textSecondary">Live Data</Typography>
            </Box>

            {/* Compute revenue figures from orders */}
            {(() => {
              // orders may be in different shapes; try to extract numeric amount
              const safeOrdersAll = Array.isArray(orders) ? orders : [];
              const totalRevenue = safeOrdersAll.reduce((sum, o) => {
                const amt = Number(o.total ?? o.total_amount ?? o.amount ?? 0);
                return sum + (isNaN(amt) ? 0 : amt);
              }, 0);

              // Monthly revenue: sum orders in current month
              const now = new Date();
              const month = now.getMonth();
              const year = now.getFullYear();
              const monthlyRevenue = safeOrdersAll.reduce((sum, o) => {
                const dateStr = o.date || o.order_date || o.createdAt || o.order_created_at || o.paid_on;
                const d = dateStr ? new Date(dateStr) : null;
                if (!d || isNaN(d.getTime())) return sum;
                if (d.getMonth() === month && d.getFullYear() === year) {
                  const amt = Number(o.total ?? o.total_amount ?? o.amount ?? 0);
                  return sum + (isNaN(amt) ? 0 : amt);
                }
                return sum;
              }, 0);

              // Previous month revenue for simple comparison
              const prevMonth = (month === 0) ? 11 : month - 1;
              const prevYear = (month === 0) ? year - 1 : year;
              const prevMonthlyRevenue = safeOrdersAll.reduce((sum, o) => {
                const dateStr = o.date || o.order_date || o.createdAt || o.order_created_at || o.paid_on;
                const d = dateStr ? new Date(dateStr) : null;
                if (!d || isNaN(d.getTime())) return sum;
                if (d.getMonth() === prevMonth && d.getFullYear() === prevYear) {
                  const amt = Number(o.total ?? o.total_amount ?? o.amount ?? 0);
                  return sum + (isNaN(amt) ? 0 : amt);
                }
                return sum;
              }, 0);

              const growth = prevMonthlyRevenue === 0 ? 100 : ((monthlyRevenue - prevMonthlyRevenue) / (prevMonthlyRevenue || 1)) * 100;

              return (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>₹ {totalRevenue.toLocaleString()}</Typography>
                  <Typography variant="body2" color="textSecondary">Total revenue</Typography>

                  <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>₹ {monthlyRevenue.toLocaleString()}</Typography>
                      <Typography variant="caption" color="textSecondary">This month</Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>₹ {prevMonthlyRevenue.toLocaleString()}</Typography>
                      <Typography variant="caption" color="textSecondary">Prev month</Typography>
                    </Box>
                    <Box sx={{ ml: 1 }}>
                      <Chip label={`${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`} color={growth >= 0 ? 'success' : 'error'} size="small" />
                    </Box>
                  </Box>
                </Box>
              );
            })()}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
