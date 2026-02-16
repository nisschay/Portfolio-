/**
 * API Client
 * Centralized API communication with type safety
 */

import { API_URL } from './constants';
import type {
  Project,
  ProjectListItem,
  BlogPost,
  BlogPostListItem,
  Contact,
  CreateContactInput,
  CreateProjectInput,
  CreateBlogPostInput,
  LoginInput,
  LoginResponse,
  Admin,
  DashboardStats,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

// ============================================
// HTTP CLIENT
// ============================================

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token');
    }
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.error?.message || 'An error occurred');
      (error as Error & { code?: string }).code = data.error?.code;
      throw error;
    }

    return data;
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Upload file
  async upload<T>(endpoint: string, file: File, fieldName = 'image'): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const token = this.getToken();
    const headers: HeadersInit = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    return data;
  }

  // ============================================
  // CONVENIENCE METHODS FOR ADMIN PAGES
  // ============================================

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: Admin }> {
    const response = await this.post<ApiResponse<{ token: string; user: Admin }>>('/auth/login', { email, password });
    if (typeof window !== 'undefined' && response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
    }
    return response.data;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    const response = await this.get<ApiResponse<Project[]>>('/admin/projects');
    return response.data;
  }

  async createProject(data: CreateProjectInput, _token?: string): Promise<Project> {
    const response = await this.post<ApiResponse<Project>>('/admin/projects', data);
    return response.data;
  }

  async updateProject(id: string, data: Partial<CreateProjectInput>, _token?: string): Promise<Project> {
    const response = await this.put<ApiResponse<Project>>(`/admin/projects/${id}`, data);
    return response.data;
  }

  async deleteProject(id: string, _token?: string): Promise<void> {
    await this.delete(`/admin/projects/${id}`);
  }

  // Blog Posts
  async getBlogPosts(): Promise<{ data: BlogPost[] }> {
    const response = await this.get<ApiResponse<BlogPost[]>>('/admin/blog');
    return { data: response.data };
  }

  async createBlogPost(data: CreateBlogPostInput, _token?: string): Promise<BlogPost> {
    const response = await this.post<ApiResponse<BlogPost>>('/admin/blog', data);
    return response.data;
  }

  async updateBlogPost(id: string, data: Partial<CreateBlogPostInput>, _token?: string): Promise<BlogPost> {
    const response = await this.put<ApiResponse<BlogPost>>(`/admin/blog/${id}`, data);
    return response.data;
  }

  async deleteBlogPost(id: string, _token?: string): Promise<void> {
    await this.delete(`/admin/blog/${id}`);
  }

  // Contacts
  async getContacts(_token?: string): Promise<Contact[]> {
    const response = await this.get<ApiResponse<Contact[]>>('/admin/contact');
    return response.data;
  }

  async updateContact(id: string, data: { read: boolean }, _token?: string): Promise<Contact> {
    const response = await this.put<ApiResponse<Contact>>(`/admin/contact/${id}`, data);
    return response.data;
  }

  async deleteContact(id: string, _token?: string): Promise<void> {
    await this.delete(`/admin/contact/${id}`);
  }

  // Contact form submission
  async submitContact(data: CreateContactInput): Promise<{ id: string }> {
    const response = await this.post<ApiResponse<{ id: string }>>('/contact', data);
    return response.data;
  }
}

export const api = new ApiClient(API_URL);

// ============================================
// PUBLIC API METHODS
// ============================================

// Projects
export async function getProjects(params?: {
  category?: string;
  featured?: boolean;
  limit?: number;
}): Promise<ProjectListItem[]> {
  const searchParams = new URLSearchParams();
  if (params?.category && params.category !== 'all') {
    searchParams.set('category', params.category);
  }
  if (params?.featured !== undefined) {
    searchParams.set('featured', String(params.featured));
  }
  if (params?.limit) {
    searchParams.set('limit', String(params.limit));
  }

  const query = searchParams.toString();
  const endpoint = `/projects${query ? `?${query}` : ''}`;
  const response = await api.get<ApiResponse<ProjectListItem[]>>(endpoint);
  return response.data;
}

export async function getProject(slug: string): Promise<Project> {
  const response = await api.get<ApiResponse<Project>>(`/projects/${slug}`);
  return response.data;
}

// Blog
export async function getBlogPosts(params?: {
  page?: number;
  limit?: number;
  tag?: string;
  search?: string;
}): Promise<PaginatedResponse<BlogPostListItem>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.tag) searchParams.set('tag', params.tag);
  if (params?.search) searchParams.set('search', params.search);

  const query = searchParams.toString();
  const endpoint = `/blog${query ? `?${query}` : ''}`;
  return api.get<PaginatedResponse<BlogPostListItem>>(endpoint);
}

export async function getBlogPost(slug: string): Promise<{
  data: BlogPost;
  related: BlogPostListItem[];
}> {
  const response = await api.get<{
    success: boolean;
    data: BlogPost;
    related: BlogPostListItem[];
  }>(`/blog/${slug}`);
  return { data: response.data, related: response.related };
}

export async function getBlogTags(): Promise<string[]> {
  const response = await api.get<ApiResponse<string[]>>('/blog/tags');
  return response.data;
}

// Contact
export async function submitContact(data: CreateContactInput): Promise<{ id: string }> {
  const response = await api.post<ApiResponse<{ id: string; createdAt: string }>>('/contact', data);
  return response.data;
}

// Stats
export async function getStats(): Promise<{ projects: number; blogPosts: number }> {
  const response = await api.get<ApiResponse<{ projects: number; blogPosts: number }>>('/stats');
  return response.data;
}

// ============================================
// AUTH API METHODS
// ============================================

export async function login(credentials: LoginInput): Promise<LoginResponse> {
  const response = await api.post<ApiResponse<LoginResponse> & { data: LoginResponse }>('/auth/login', credentials);
  
  // Store token
  if (typeof window !== 'undefined' && response.data.token) {
    localStorage.setItem('admin_token', response.data.token);
  }
  
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token');
  }
}

export async function getCurrentAdmin(): Promise<Admin | null> {
  try {
    const response = await api.get<ApiResponse<Admin>>('/auth/me');
    return response.data;
  } catch {
    return null;
  }
}

// ============================================
// ADMIN API METHODS
// ============================================

// Dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard');
  return response.data;
}

// Admin Projects
export async function getAdminProjects(): Promise<Project[]> {
  const response = await api.get<ApiResponse<Project[]>>('/admin/projects');
  return response.data;
}

export async function getAdminProject(id: string): Promise<Project> {
  const response = await api.get<ApiResponse<Project>>(`/admin/projects/${id}`);
  return response.data;
}

export async function createProject(data: CreateProjectInput): Promise<Project> {
  const response = await api.post<ApiResponse<Project>>('/admin/projects', data);
  return response.data;
}

export async function updateProject(id: string, data: Partial<CreateProjectInput>): Promise<Project> {
  const response = await api.put<ApiResponse<Project>>(`/admin/projects/${id}`, data);
  return response.data;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/admin/projects/${id}`);
}

export async function uploadProjectImage(file: File): Promise<{ url: string }> {
  const response = await api.upload<ApiResponse<{ url: string; filename: string }>>('/admin/projects/upload', file);
  return response.data;
}

// Admin Blog
export async function getAdminBlogPosts(): Promise<BlogPost[]> {
  const response = await api.get<ApiResponse<BlogPost[]>>('/admin/blog');
  return response.data;
}

export async function getAdminBlogPost(id: string): Promise<BlogPost> {
  const response = await api.get<ApiResponse<BlogPost>>(`/admin/blog/${id}`);
  return response.data;
}

export async function createBlogPost(data: CreateBlogPostInput): Promise<BlogPost> {
  const response = await api.post<ApiResponse<BlogPost>>('/admin/blog', data);
  return response.data;
}

export async function updateBlogPost(id: string, data: Partial<CreateBlogPostInput>): Promise<BlogPost> {
  const response = await api.put<ApiResponse<BlogPost>>(`/admin/blog/${id}`, data);
  return response.data;
}

export async function deleteBlogPost(id: string): Promise<void> {
  await api.delete(`/admin/blog/${id}`);
}

export async function uploadBlogImage(file: File): Promise<{ url: string }> {
  const response = await api.upload<ApiResponse<{ url: string; filename: string }>>('/admin/blog/upload', file);
  return response.data;
}

// Admin Contact
export async function getAdminContacts(unread?: boolean): Promise<Contact[]> {
  const endpoint = unread ? '/admin/contact?unread=true' : '/admin/contact';
  const response = await api.get<ApiResponse<Contact[]>>(endpoint);
  return response.data;
}

export async function getAdminContact(id: string): Promise<Contact> {
  const response = await api.get<ApiResponse<Contact>>(`/admin/contact/${id}`);
  return response.data;
}

export async function markContactAsRead(id: string, read = true): Promise<Contact> {
  const response = await api.put<ApiResponse<Contact>>(`/admin/contact/${id}`, { read });
  return response.data;
}

export async function deleteContact(id: string): Promise<void> {
  await api.delete(`/admin/contact/${id}`);
}
