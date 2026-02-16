/**
 * Request Validation Middleware
 * Uses Zod schemas to validate request data
 */

import type { Request, Response, NextFunction } from 'express';
import { z, type ZodSchema } from 'zod';
import { ApiError } from './errorHandler.js';

/**
 * Create validation middleware for request body
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        next(ApiError.badRequest('Validation failed', { errors: details }));
      } else {
        next(error);
      }
    }
  };
}

/**
 * Create validation middleware for query parameters
 */
export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query) as typeof req.query;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        next(ApiError.badRequest('Invalid query parameters', { errors: details }));
      } else {
        next(error);
      }
    }
  };
}

/**
 * Create validation middleware for URL parameters
 */
export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params) as typeof req.params;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        next(ApiError.badRequest('Invalid URL parameters', { errors: details }));
      } else {
        next(error);
      }
    }
  };
}

// ============================================
// VALIDATION SCHEMAS
// ============================================

// Project schemas
export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().min(1, 'Description is required').max(500),
  longDescription: z.string().optional().default(''),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  category: z.enum(['ml', 'fullstack', 'data']),
  year: z.number().int().min(2000).max(2100),
  featured: z.boolean().optional().default(false),
  imageUrl: z.string().url().optional().nullable(),
  demoUrl: z.string().url().optional().nullable(),
  githubUrl: z.string().url().optional().nullable(),
  metrics: z.record(z.string()).optional().nullable(),
  order: z.number().int().optional().default(0),
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectQuerySchema = z.object({
  category: z.enum(['ml', 'fullstack', 'data']).optional(),
  featured: z.string().transform((v) => v === 'true').optional(),
  limit: z.string().transform((v) => parseInt(v, 10)).optional(),
});

// Blog schemas
export const createBlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  slug: z.string().min(1, 'Slug is required').max(300).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500),
  content: z.string().min(1, 'Content is required'),
  coverImage: z.string().url().optional().nullable(),
  author: z.string().optional().default('Nisschay Khandelwal'),
  tags: z.array(z.string()).optional().default([]),
  published: z.boolean().optional().default(false),
  readTime: z.number().int().min(1).optional().default(5),
  metaTitle: z.string().max(70).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
  ogImage: z.string().url().optional().nullable(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export const blogQuerySchema = z.object({
  page: z.string().transform((v) => parseInt(v, 10)).optional().default('1'),
  limit: z.string().transform((v) => parseInt(v, 10)).optional().default('10'),
  tag: z.string().optional(),
  search: z.string().optional(),
  published: z.string().transform((v) => v === 'true').optional(),
});

// Contact schemas
export const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ID parameter schema
export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});
