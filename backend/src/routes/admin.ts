/**
 * Admin Routes
 * Protected CRUD endpoints for projects, blog posts, and contact messages
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';
import {
  validateBody,
  validateParams,
  createProjectSchema,
  updateProjectSchema,
  createBlogPostSchema,
  updateBlogPostSchema,
  idParamSchema,
} from '../middleware/validation.js';
import { uploadProjectImage, uploadBlogImage, getUploadUrl, deleteUploadedFile } from '../middleware/upload.js';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();
const prisma = new PrismaClient();

// All admin routes require authentication
router.use(authenticate);

// ============================================
// DASHBOARD
// ============================================

/**
 * GET /api/admin/dashboard
 * Get dashboard statistics
 */
router.get('/dashboard', async (_req, res, next) => {
  try {
    const [
      projectCount,
      blogPostCount,
      publishedPostCount,
      contactCount,
      unreadContactCount,
      recentContacts,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.contact.count(),
      prisma.contact.count({ where: { read: false } }),
      prisma.contact.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          read: true,
          createdAt: true,
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        projects: projectCount,
        blogPosts: {
          total: blogPostCount,
          published: publishedPostCount,
          drafts: blogPostCount - publishedPostCount,
        },
        contacts: {
          total: contactCount,
          unread: unreadContactCount,
        },
        recentContacts,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// PROJECTS CRUD
// ============================================

/**
 * GET /api/admin/projects
 * List all projects (including unpublished)
 */
router.get('/projects', async (_req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/projects/:id
 * Get a single project by ID
 */
router.get('/projects/:id', validateParams(idParamSchema), async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
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

/**
 * POST /api/admin/projects
 * Create a new project
 */
router.post('/projects', validateBody(createProjectSchema), async (req, res, next) => {
  try {
    const project = await prisma.project.create({
      data: req.body,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/projects/:id
 * Update an existing project
 */
router.put('/projects/:id', validateParams(idParamSchema), validateBody(updateProjectSchema), async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.update({
      where: { id },
      data: req.body,
    });

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/projects/:id
 * Delete a project
 */
router.delete('/projects/:id', validateParams(idParamSchema), async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw ApiError.notFound('Project');
    }

    // Delete associated image if exists
    if (project.imageUrl) {
      await deleteUploadedFile(project.imageUrl).catch(console.error);
    }

    await prisma.project.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/projects/upload
 * Upload project image
 */
router.post('/projects/upload', uploadProjectImage.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      throw ApiError.badRequest('No image file provided');
    }

    const imageUrl = getUploadUrl(req.file.filename, 'projects');

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: imageUrl,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/projects/reorder
 * Reorder projects
 */
router.put('/projects/reorder', async (req, res, next) => {
  try {
    const { orders } = req.body;

    if (!Array.isArray(orders)) {
      throw ApiError.badRequest('Orders must be an array');
    }

    // Update order for each project
    await Promise.all(
      orders.map(({ id, order }: { id: string; order: number }) =>
        prisma.project.update({
          where: { id },
          data: { order },
        })
      )
    );

    res.json({
      success: true,
      message: 'Projects reordered successfully',
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// BLOG CRUD
// ============================================

/**
 * GET /api/admin/blog
 * List all blog posts (including drafts)
 */
router.get('/blog', async (_req, res, next) => {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/blog/:id
 * Get a single blog post by ID
 */
router.get('/blog/:id', validateParams(idParamSchema), async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      throw ApiError.notFound('Blog post');
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/blog
 * Create a new blog post
 */
router.post('/blog', validateBody(createBlogPostSchema), async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      publishedAt: req.body.published ? new Date() : null,
    };

    const post = await prisma.blogPost.create({
      data,
    });

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/blog/:id
 * Update an existing blog post
 */
router.put('/blog/:id', validateParams(idParamSchema), validateBody(updateBlogPostSchema), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get current post to check publish status change
    const currentPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!currentPost) {
      throw ApiError.notFound('Blog post');
    }

    // Set publishedAt if transitioning to published
    const data = { ...req.body };
    if (req.body.published && !currentPost.published) {
      data.publishedAt = new Date();
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data,
    });

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/blog/:id
 * Delete a blog post
 */
router.delete('/blog/:id', validateParams(idParamSchema), async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      throw ApiError.notFound('Blog post');
    }

    // Delete associated cover image if exists
    if (post.coverImage) {
      await deleteUploadedFile(post.coverImage).catch(console.error);
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/blog/upload
 * Upload blog image
 */
router.post('/blog/upload', uploadBlogImage.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      throw ApiError.badRequest('No image file provided');
    }

    const imageUrl = getUploadUrl(req.file.filename, 'blog');

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: imageUrl,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// CONTACT MESSAGES
// ============================================

/**
 * GET /api/admin/contact
 * List all contact messages
 */
router.get('/contact', async (req, res, next) => {
  try {
    const { unread } = req.query;

    const where: { read?: boolean } = {};
    if (unread === 'true') {
      where.read = false;
    }

    const messages = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/contact/:id
 * Get a single contact message
 */
router.get('/contact/:id', validateParams(idParamSchema), async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await prisma.contact.findUnique({
      where: { id },
    });

    if (!message) {
      throw ApiError.notFound('Contact message');
    }

    // Mark as read
    if (!message.read) {
      await prisma.contact.update({
        where: { id },
        data: { read: true },
      });
    }

    res.json({
      success: true,
      data: { ...message, read: true },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/contact/:id
 * Mark contact message as read/unread
 */
router.put('/contact/:id', validateParams(idParamSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { read } = req.body;

    const message = await prisma.contact.update({
      where: { id },
      data: { read: read ?? true },
    });

    res.json({
      success: true,
      message: `Message marked as ${message.read ? 'read' : 'unread'}`,
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/contact/:id
 * Delete a contact message
 */
router.delete('/contact/:id', validateParams(idParamSchema), async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.contact.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Contact message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
