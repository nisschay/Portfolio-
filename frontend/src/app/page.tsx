import { Suspense } from 'react';
import { Hero } from '@/components/home/Hero';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { getProjects } from '@/lib/api';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nisschay Khandelwal | ML Engineer & Full-Stack Developer',
  description: 'Portfolio of Nisschay Khandelwal - Machine Learning Engineer and Full-Stack Developer specializing in AI, neural networks, and modern web development.',
};

// Revalidate every 60 seconds
export const revalidate = 60;

async function getFeaturedProjects() {
  try {
    const projects = await getProjects({ featured: true, limit: 4 });
    return projects;
  } catch (error) {
    console.error('Failed to fetch featured projects:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <>
      {/* Hero Section */}
      <Hero />
      
      {/* Featured Projects Section */}
      <Suspense 
        fallback={
          <section className="py-24 px-6 bg-base-alt">
            <div className="max-w-container mx-auto">
              <div className="animate-pulse space-y-8">
                <div className="h-12 w-64 bg-border rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-64 bg-border rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </section>
        }
      >
        <FeaturedProjects projects={featuredProjects} />
      </Suspense>
    </>
  );
}
