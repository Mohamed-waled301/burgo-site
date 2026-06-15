import { Router } from 'express';
import { readDB, writeDB, Order, OrderItem } from '../utils/db';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// In-memory flag for notifications
let hasNewOrder = false;
let lastNewOrderId = '';

// GET all orders (Protected - sorted by newest first)
router.get('/', authenticateJWT, (req, res) => {
  const db = readDB();
  const sorted = [...db.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(sorted);
});

// GET the new order notification flag (Protected)
router.get('/new-flag', authenticateJWT, (req, res) => {
  res.json({ hasNew: hasNewOrder, orderId: lastNewOrderId });
});

// POST to clear the new order flag (Protected)
router.post('/clear-flag', authenticateJWT, (req, res) => {
  hasNewOrder = false;
  res.json({ success: true });
});

// POST a new order (Public)
router.post('/', (req, res) => {
  const db = readDB();
  const { customerName, phone, address, governorate, notes, items, paymentMethod } = req.body;

  if (!customerName || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'الاسم والموبايل والعنوان والمنتجات مطلوبة لإتمام الطلب' });
  }

  // Generate 5-digit random order number
  const orderId = Math.floor(10000 + Math.random() * 90000).toString();

  // Calculate total price based on product records
  let computedTotal = 0;
  const processedItems: OrderItem[] = items.map((item: any) => {
    const originalProd = db.products.find(p => p.id === Number(item.id));
    let price = originalProd ? originalProd.price : item.price;

    // Apply discount if active
    if (originalProd && originalProd.discount) {
      const disc = originalProd.discount;
      let isExpired = false;
      if (disc.expiryDate) {
        isExpired = new Date(disc.expiryDate).getTime() < Date.now();
      }
      if (!isExpired) {
        if (disc.type === 'percent') {
          price = price * (1 - disc.value / 100);
        } else {
          price = Math.max(0, price - disc.value);
        }
      }
    }

    const qty = Number(item.quantity) || 1;
    computedTotal += price * qty;

    return {
      id: item.id,
      name: item.name,
      price: price,
      quantity: qty,
      image: item.image || '🍔'
    };
  });

  const newOrder: Order = {
    id: orderId,
    customerName,
    phone,
    address,
    governorate: governorate || '',
    notes: notes || '',
    items: processedItems,
    total: computedTotal,
    paymentMethod: paymentMethod || 'cod',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  db.orders.push(newOrder);
  writeDB(db);

  // Set notification flags for admin dashboard polling
  hasNewOrder = true;
  lastNewOrderId = orderId;

  res.status(201).json(newOrder);
});

// PATCH update order status (Protected)
router.patch('/:id/status', authenticateJWT, (req, res) => {
  const db = readDB();
  const orderId = req.params.id;
  const { status } = req.body;

  const validStatuses = ['pending', 'preparing', 'shipping', 'delivered', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'حالة الطلب غير صالحة' });
  }

  const index = db.orders.findIndex(o => o.id === orderId);
  if (index === -1) {
    return res.status(404).json({ error: 'الطلب غير موجود' });
  }

  db.orders[index].status = status;
  writeDB(db);

  res.json(db.orders[index]);
});

export default router;
