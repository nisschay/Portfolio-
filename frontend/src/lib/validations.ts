import { z } from 'zod';

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

export const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
