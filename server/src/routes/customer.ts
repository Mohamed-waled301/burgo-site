import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readDB, writeDB, User, UserProfile } from '../utils/db';
import { JWT_SECRET } from '../config';
import { authenticateCustomer, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// ─── Helper: generate a simple unique ID (mongo-style but without ObjectId dep)
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

// ─── POST /api/customer/register ─────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { fullName, address, phoneNumber, username, password } = req.body;

  // Input validation
  if (!fullName || !username || !password) {
    return res.status(400).json({ error: 'Full name, username, and password are required' });
  }
  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  if (phoneNumber && !/^01[0125][0-9]{8}$/.test(phoneNumber)) {
    return res.status(400).json({ error: 'Enter a valid Egyptian phone number' });
  }

  try {
    const db = readDB();

    // Unique username check
    const existing = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Hash password (10 salt rounds)
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: generateId(),
      fullName: fullName.trim(),
      address: (address || '').trim(),
      phoneNumber: (phoneNumber || '').trim(),
      username: username.trim().toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    writeDB(db);

    // Return JWT + public profile (never return passwordHash)
    const token = jwt.sign(
      { role: 'customer', userId: newUser.id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const profile: UserProfile = {
      id: newUser.id,
      fullName: newUser.fullName,
      address: newUser.address,
      phoneNumber: newUser.phoneNumber,
      username: newUser.username,
      createdAt: newUser.createdAt,
    };

    return res.status(201).json({ token, user: profile });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error during registration' });
  }
});

// ─── POST /api/customer/login ─────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const db = readDB();
    const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { role: 'customer', userId: user.id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const profile: UserProfile = {
      id: user.id,
      fullName: user.fullName,
      address: user.address,
      phoneNumber: user.phoneNumber,
      username: user.username,
      createdAt: user.createdAt,
    };

    return res.json({ token, user: profile });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

// ─── GET /api/customer/me (Protected) ────────────────────────────────────────
router.get('/me', authenticateCustomer, (req: AuthenticatedRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const profile: UserProfile = {
    id: user.id,
    fullName: user.fullName,
    address: user.address,
    phoneNumber: user.phoneNumber,
    username: user.username,
    createdAt: user.createdAt,
  };

  return res.json(profile);
});

// ─── PUT /api/customer/me (Protected) — update profile ───────────────────────
router.put('/me', authenticateCustomer, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { fullName, address, phoneNumber } = req.body;

  try {
    const db = readDB();
    const idx = db.users.findIndex(u => u.id === userId);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });

    if (fullName !== undefined) db.users[idx].fullName = fullName.trim();
    if (address !== undefined) db.users[idx].address = address.trim();
    if (phoneNumber !== undefined) db.users[idx].phoneNumber = phoneNumber.trim();

    writeDB(db);

    const u = db.users[idx];
    const profile: UserProfile = {
      id: u.id, fullName: u.fullName, address: u.address,
      phoneNumber: u.phoneNumber, username: u.username, createdAt: u.createdAt
    };
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ error: 'Server error updating profile' });
  }
});

export default router;
