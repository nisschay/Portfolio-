/**
 * Blog Routes
 * Public API endpoints for blog posts
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/blog
 * List all published blog posts with pagination
 */
router.get('/', async (req, res, next) => {
  try {
    const {
      page = '1',
      limit = '10',
      tag,
      search,
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter conditions
    const where: {
      published: boolean;
      tags?: { has: string };
      OR?: Array<{ title: { contains: string; mode: 'insensitive' } } | { excerpt: { contains: string; mode: 'insensitive' } }>;
    } = {
      published: true,
    };

    if (tag && typeof tag === 'string') {
      where.tags = { has: tag };
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch posts and total count
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limitNum,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          author: true,
          tags: true,
          publishedAt: true,
          readTime: true,
          views: true,
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasMore: pageNum < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/blog/tags
 * Get all unique tags from published posts
 */
router.get('/tags', async (_req, res, next) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { tags: true },
    });

    // Extract and deduplicate tags
    const allTags = posts.flatMap((post) => post.tags);
    const uniqueTags = [...new Set(allTags)].sort();

    res.json({
      success: true,
      data: uniqueTags,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/blog/:slug
 * Get a single blog post by slug
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post || !post.published) {
      throw ApiError.notFound('Blog post');
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    // Get related posts (same tags)
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
        id: { not: post.id },
        tags: { hasSome: post.tags },
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        readTime: true,
      },
    });

    res.json({
      success: true,
      data: post,
      related: relatedPosts,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
