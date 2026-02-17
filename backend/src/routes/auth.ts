/**
 * Authentication Routes
 * Login/logout endpoints for admin users
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateBody, loginSchema } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/auth/login
 * Authenticate admin and return JWT token
 */
router.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw ApiError.internal('JWT secret not configured');
    }

    const token = jwt.sign(
      {
        adminId: admin.id,
        email: admin.email,
      },
      jwtSecret,
      {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string,
      } as jwt.SignOptions
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/logout
 * Logout (client-side token removal)
 */
router.post('/logout', (_req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * GET /api/auth/me
 * Get current authenticated admin
 */
router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    data: req.admin,
  });
});

/**
 * POST /api/auth/change-password
 * Change admin password
 */
router.post('/change-password', authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw ApiError.badRequest('Current and new password are required');
    }

    if (newPassword.length < 8) {
      throw ApiError.badRequest('New password must be at least 8 characters');
    }

    const admin = await prisma.admin.findUnique({
      where: { id: req.admin!.id },
    });

    if (!admin) {
      throw ApiError.notFound('Admin');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, admin.password);
    
    if (!isValidPassword) {
      throw ApiError.unauthorized('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashedPassword },
    });

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
