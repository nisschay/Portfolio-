'use client';

import { ProjectCard } from './ProjectCard';
import { ProjectListItem } from '@/types';

interface ProjectGridProps {
  projects: ProjectListItem[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-secondary text-lg">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
