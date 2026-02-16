'use client';

import { BlogCard } from './BlogCard';
import { BlogPostListItem } from '@/types';

interface BlogGridProps {
  posts: BlogPostListItem[];
  tags?: string[];
  activeTag?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function BlogGrid({ posts }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-secondary text-lg">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
      {posts.map((post, index) => (
        <BlogCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}
