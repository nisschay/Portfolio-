/**
 * Express Server Entry Point
 * Main application setup with middleware and routes
 */

import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import projectRoutes from './routes/projects.js';
import blogRoutes from './routes/blog.js';
import contactRoutes from './routes/contact.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 5000;

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet for security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000'), // 1 hour
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5'),
  message: {
    error: 'Too many contact submissions. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// BODY PARSING & STATIC FILES
// ============================================

// JSON and URL-encoded body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Public routes
app.use('/api/projects', generalLimiter, projectRoutes);
app.use('/api/blog', generalLimiter, blogRoutes);
app.use('/api/contact', contactLimiter, contactRoutes);
app.use('/api/auth', generalLimiter, authRoutes);

// Admin routes
app.use('/api/admin', generalLimiter, adminRoutes);

// Public stats endpoint
app.get('/api/stats', generalLimiter, async (_req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const [projectCount, blogCount] = await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count({ where: { published: true } }),
    ]);
    
    await prisma.$disconnect();
    
    res.json({
      projects: projectCount,
      blogPosts: blogCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Portfolio API Server                                 ║
║                                                           ║
║   Environment: ${process.env.NODE_ENV || 'development'}                           ║
║   Port: ${PORT}                                            ║
║   URL: http://localhost:${PORT}                            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
