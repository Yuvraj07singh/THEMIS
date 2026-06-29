import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../db.js';
import { HttpError } from '../middleware/errors.js';
import { requireAuth } from '../middleware/auth.js';
import { audit } from '../services/audit.js';

const router = Router();

// Brute-force protection on auth endpoints
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });

const signupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  role: z.enum(['CA', 'LAWYER', 'INDIVIDUAL']),
  firmName: z.string().trim().max(150).optional(),
  jobTitle: z.string().trim().max(100).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, firmId: user.firmId };
}

router.post('/signup', authLimiter, async (req, res, next) => {
  try {
    const data = signupSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new HttpError(409, 'An account with this email already exists. Please log in.');

    const passwordHash = await bcrypt.hash(data.password, 12);

    // CA and Lawyer accounts belong to a firm; individuals do not
    let firmId = null;
    if (data.role === 'CA' || data.role === 'LAWYER') {
      const firm = await prisma.firm.create({
        data: {
          name: data.firmName || `${data.name}'s Practice`,
          type: data.role === 'CA' ? 'CA' : 'LAW',
        },
      });
      firmId = firm.id;
    }

    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash, role: data.role, firmId, jobTitle: data.jobTitle || null },
    });

    req.user = user;
    await audit(req, 'SIGNUP', 'User', user.id, { role: user.role });

    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    // Same error for unknown email and wrong password — prevents account enumeration
    if (!user) throw new HttpError(401, 'Invalid email or password');

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) throw new HttpError(401, 'Invalid email or password');

    req.user = user;
    await audit(req, 'LOGIN', 'User', user.id);

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
