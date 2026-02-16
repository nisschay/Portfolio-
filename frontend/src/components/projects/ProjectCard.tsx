'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon } from '@/components/ui/Icons';
import { ProjectListItem } from '@/types';
import { getImageUrl } from '@/lib/utils';

interface ProjectCardProps {
  project: ProjectListItem;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      <Link href={`/projects/${project.slug}`}>
        <div className="relative overflow-hidden rounded-2xl bg-alt aspect-[4/3]">
          {project.imageUrl ? (
            <Image
              src={getImageUrl(project.imageUrl)}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5" />
          )}

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />

          {/* Hover Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <p className="text-base/70 text-sm line-clamp-2 mb-2">
              {project.description}
            </p>
            <div className="inline-flex items-center gap-2 text-accent text-sm font-medium">
              View Project
              <ArrowRightIcon className="w-4 h-4" />
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span
              className="px-3 py-1 text-xs font-medium text-ink bg-base/90 
                       backdrop-blur-sm rounded-full"
            >
              {project.category}
            </span>
          </div>

          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-4 right-4">
              <span
                className="px-3 py-1 text-xs font-medium text-base bg-accent 
                         rounded-full"
              >
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Card Info */}
        <div className="mt-4">
          <h3 className="font-serif text-xl font-semibold text-ink group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="text-xs text-secondary"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-xs text-secondary">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
