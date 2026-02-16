import { Suspense } from 'react';
import { getProjects } from '@/lib/api';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { ProjectFilter } from '@/components/projects/ProjectFilter';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore my portfolio of ML/AI and full-stack development projects, featuring neural networks, web applications, and data engineering solutions.',
};

export const revalidate = 60;

async function getAllProjects() {
  try {
    return await getProjects();
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <section className="min-h-screen py-32 px-6 bg-base-alt">
      <div className="max-w-container mx-auto">
        {/* Header */}
        <SectionHeader
          title="All Projects"
          subtitle="Selected Work"
          className="mb-12"
        />
        
        {/* Filter and Grid */}
        <Suspense
          fallback={
            <div className="animate-pulse space-y-8">
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-24 bg-border rounded-full" />
                ))}
              </div>
              <div className="grid grid-cols-12 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="col-span-12 md:col-span-6 lg:col-span-4 h-64 bg-border rounded-lg" />
                ))}
              </div>
            </div>
          }
        >
          <ProjectGrid projects={projects} />
        </Suspense>
      </div>
    </section>
  );
}
