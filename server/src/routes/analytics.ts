import { Router } from 'express';
import { readDB } from '../utils/db';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.get('/', authenticateJWT, (req, res) => {
  const db = readDB();
  const orders = db.orders;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  
  const activeOrders = orders.filter(o => o.status !== 'cancelled');
  const revenue = activeOrders.reduce((sum, o) => sum + o.total, 0);
  const averageOrderValue = totalOrders > 0 ? Number((revenue / totalOrders).toFixed(2)) : 0;

  // Find top selling product
  const productCounts: { [name: string]: number } = {};
  orders.forEach(order => {
    if (order.status !== 'cancelled') {
      order.items.forEach(item => {
        productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
      });
    }
  });

  let topProduct = 'لا يوجد طلبات / No Orders';
  let maxCount = 0;
  Object.entries(productCounts).forEach(([name, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topProduct = name;
    }
  });

  // Group orders by day of week (for the last 7 days)
  const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayIndex = d.getDay();
    const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
    
    // Count orders on this date (local date comparison)
    const count = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate.toDateString() === d.toDateString();
    }).length;

    const rev = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate.toDateString() === d.toDateString() && o.status !== 'cancelled';
    }).reduce((sum, o) => sum + o.total, 0);

    chartData.push({
      date: dateStr,
      dayAr: dayNames[dayIndex],
      dayEn: dayNamesEn[dayIndex],
      orders: count,
      revenue: rev
    });
  }

  res.json({
    totalOrders,
    pendingOrders,
    revenue,
    averageOrderValue,
    topProduct,
    chartData
  });
});

export default router;
