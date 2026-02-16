'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Project } from '@/types';

interface UseProjectsOptions {
  category?: string;
  featured?: boolean;
}

interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useProjects(options: UseProjectsOptions = {}): UseProjectsReturn {
  const { category, featured } = options;
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let data = await api.getProjects();

      // Filter by category
      if (category && category !== 'all') {
        data = data.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }

      // Filter by featured
      if (featured !== undefined) {
        data = data.filter((p) => p.featured === featured);
      }

      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
    } finally {
      setIsLoading(false);
    }
  }, [category, featured]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects,
  };
}
