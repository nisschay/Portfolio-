/**
 * JWT Authentication Middleware
 * Verifies JWT tokens and attaches admin user to request
 */

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ApiError } from './errorHandler.js';

const prisma = new PrismaClient();

// Extend Express Request type to include admin
declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

interface JwtPayload {
  adminId: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Middleware to verify JWT token and authenticate admin
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No authentication token provided');
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw ApiError.unauthorized('No authentication token provided');
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw ApiError.internal('JWT secret not configured');
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Fetch admin from database
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId },
      select: { id: true, email: true, name: true },
    });

    if (!admin) {
      throw ApiError.unauthorized('Admin not found');
    }

    // Attach admin to request
    req.admin = admin;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(ApiError.unauthorized('Invalid authentication token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(ApiError.unauthorized('Authentication token has expired'));
    } else {
      next(error);
    }
  }
}

/**
 * Optional authentication - doesn't fail if no token
 */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return next();
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return next();
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId },
      select: { id: true, email: true, name: true },
    });

    if (admin) {
      req.admin = admin;
    }
    
    next();
  } catch {
    // Silently ignore auth errors for optional auth
    next();
  }
}
