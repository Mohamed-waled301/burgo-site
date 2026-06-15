import { Router } from 'express';
import { readDB, writeDB, Product } from '../utils/db';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// GET all products
router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.products);
});

// POST a new product (Protected)
router.post('/', authenticateJWT, (req, res) => {
  const db = readDB();
  const { name, description, price, badge, image, category, ingredients, prepSteps, discount } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'الاسم والسعر مطلوبان' });
  }

  const nextId = db.products.length > 0 ? Math.max(...db.products.map(p => p.id)) + 1 : 1;

  const newProduct: Product = {
    id: nextId,
    name,
    description: description || '',
    price: Number(price),
    badge: badge || null,
    image: image || '🍔',
    category: category || 'classic',
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    prepSteps: Array.isArray(prepSteps) ? prepSteps : [],
    discount: discount || null
  };

  db.products.push(newProduct);
  writeDB(db);

  res.status(201).json(newProduct);
});

// PUT update a product (Protected)
router.put('/:id', authenticateJWT, (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  const index = db.products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }

  const { name, description, price, badge, image, category, ingredients, prepSteps, discount } = req.body;

  const updatedProduct = {
    ...db.products[index],
    name: name !== undefined ? name : db.products[index].name,
    description: description !== undefined ? description : db.products[index].description,
    price: price !== undefined ? Number(price) : db.products[index].price,
    badge: badge !== undefined ? badge : db.products[index].badge,
    image: image !== undefined ? image : db.products[index].image,
    category: category !== undefined ? category : db.products[index].category,
    ingredients: ingredients !== undefined ? (Array.isArray(ingredients) ? ingredients : []) : db.products[index].ingredients,
    prepSteps: prepSteps !== undefined ? (Array.isArray(prepSteps) ? prepSteps : []) : db.products[index].prepSteps,
    discount: discount !== undefined ? discount : db.products[index].discount
  };

  db.products[index] = updatedProduct;
  writeDB(db);

  res.json(updatedProduct);
});

// DELETE a product (Protected)
router.delete('/:id', authenticateJWT, (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  const index = db.products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }

  db.products.splice(index, 1);
  writeDB(db);

  res.json({ message: 'تم حذف المنتج بنجاح' });
});

export default router;
