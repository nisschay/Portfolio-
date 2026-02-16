'use client';

import { useState, useEffect, useCallback } from 'react';
import { getBlogPosts } from '@/lib/api';
import { BlogPostListItem, PaginatedResponse } from '@/types';

interface UseBlogOptions {
  tag?: string;
  page?: number;
  limit?: number;
}

interface UseBlogReturn {
  posts: BlogPostListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useBlog(options: UseBlogOptions = {}): UseBlogReturn {
  const { tag, page = 1, limit = 10 } = options;
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [pagination, setPagination] = useState<UseBlogReturn['pagination']>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: PaginatedResponse<BlogPostListItem> = await getBlogPosts({ page, limit, tag });
      
      setPosts(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
    } finally {
      setIsLoading(false);
    }
  }, [tag, page, limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    pagination,
    isLoading,
    error,
    refetch: fetchPosts,
  };
}
