import { Suspense } from 'react';
import { getBlogPosts, getBlogTags } from '@/lib/api';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on machine learning, software engineering, and building products. Technical deep-dives and lessons learned.',
};

export const revalidate = 60;

interface Props {
  searchParams: { tag?: string; page?: string };
}

async function getBlogData(tag?: string, page?: string) {
  try {
    const [postsResponse, tags] = await Promise.all([
      getBlogPosts({
        tag,
        page: page ? parseInt(page, 10) : 1,
        limit: 9,
      }),
      getBlogTags(),
    ]);
    return { posts: postsResponse, tags };
  } catch (error) {
    console.error('Failed to fetch blog data:', error);
    return {
      posts: { data: [], pagination: { page: 1, limit: 9, total: 0, totalPages: 0, hasMore: false }, success: true },
      tags: [],
    };
  }
}

export default async function BlogPage({ searchParams }: Props) {
  const { posts, tags } = await getBlogData(searchParams.tag, searchParams.page);

  return (
    <section className="min-h-screen py-32 px-6 bg-base">
      <div className="max-w-container mx-auto">
        {/* Header */}
        <SectionHeader
          title="The Blog"
          subtitle="Thoughts & Insights"
          className="mb-12"
        />
        
        {/* Blog Grid */}
        <Suspense
          fallback={
            <div className="animate-pulse space-y-8">
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 w-20 bg-border rounded-full" />
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-border rounded-lg" />
                ))}
              </div>
            </div>
          }
        >
          <BlogGrid 
            posts={posts.data} 
            tags={tags}
            activeTag={searchParams.tag}
            pagination={posts.pagination}
          />
        </Suspense>
      </div>
    </section>
  );
}
