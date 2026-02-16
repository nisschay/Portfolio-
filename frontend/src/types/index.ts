/**
 * TypeScript Type Definitions
 */

// ============================================
// PROJECT TYPES
// ============================================

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  tags: string[];
  category: 'ml' | 'fullstack' | 'data';
  year: number;
  featured: boolean;
  imageUrl: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  metrics: Record<string, string> | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectListItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  category: 'ml' | 'fullstack' | 'data';
  year: number;
  featured: boolean;
  imageUrl: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  metrics: Record<string, string> | null;
}

export type ProjectCategory = 'all' | 'ml' | 'fullstack' | 'data';

export interface CreateProjectInput {
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  tags: string[];
  category: 'ml' | 'fullstack' | 'data';
  year: number;
  featured?: boolean;
  imageUrl?: string | null;
  demoUrl?: string | null;
  githubUrl?: string | null;
  metrics?: Record<string, string> | null;
  order?: number;
}

// ============================================
// BLOG TYPES
// ============================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
  views: number;
  readTime: number;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  author: string;
  tags: string[];
  publishedAt: string | null;
  readTime: number;
  views: number;
}

export interface CreateBlogPostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  author?: string;
  tags?: string[];
  published?: boolean;
  readTime?: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
}

// ============================================
// CONTACT TYPES
// ============================================

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface CreateContactInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// ============================================
// ADMIN TYPES
// ============================================

export interface Admin {
  id: string;
  email: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export interface DashboardStats {
  projects: number;
  blogPosts: {
    total: number;
    published: number;
    drafts: number;
  };
  contacts: {
    total: number;
    unread: number;
  };
  recentContacts: Contact[];
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ============================================
// UI COMPONENT TYPES
// ============================================

export type ProjectCardSize = 'small' | 'medium' | 'large' | 'wide';

export interface NavLink {
  href: string;
  label: string;
}

export interface SocialLink {
  href: string;
  label: string;
  icon: 'github' | 'linkedin' | 'twitter';
}
