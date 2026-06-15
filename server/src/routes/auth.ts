import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET } from '../config';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, username });
  }

  return res.status(400).json({ error: 'الاسم أو كلمة المرور غير صحيحة' });
});

export default router;
