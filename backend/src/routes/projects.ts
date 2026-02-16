/**
 * Projects Routes
 * Public API endpoints for projects
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/projects
 * List all projects with optional filtering
 */
router.get('/', async (req, res, next) => {
  try {
    const { category, featured, limit } = req.query;

    // Build filter conditions
    const where: {
      category?: string;
      featured?: boolean;
    } = {};

    if (category && typeof category === 'string') {
      where.category = category;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    // Fetch projects
    const projects = await prisma.project.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { year: 'desc' },
      ],
      take: limit ? parseInt(limit as string, 10) : undefined,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        tags: true,
        category: true,
        year: true,
        featured: true,
        imageUrl: true,
        demoUrl: true,
        githubUrl: true,
        metrics: true,
      },
    });

    res.json({
      success: true,
      data: projects,
      count: projects.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/projects/:slug
 * Get a single project by slug
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;

    const project = await prisma.project.findUnique({
      where: { slug },
    });

    if (!project) {
      throw ApiError.notFound('Project');
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
