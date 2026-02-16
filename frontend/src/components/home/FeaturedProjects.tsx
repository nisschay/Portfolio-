'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon } from '@/components/ui/Icons';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProjectListItem } from '@/types';
import { getImageUrl } from '@/lib/utils';

interface FeaturedProjectsProps {
  projects: ProjectListItem[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <SectionHeader
          title="Featured Work"
          subtitle="A selection of projects that showcase my expertise in machine learning, AI, and full-stack development."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {projects.slice(0, 4).map((project, index) => (
            <motion.article
              key={project.id}
              variants={itemVariants}
              className={`group relative ${
                index === 0 ? 'md:col-span-2' : ''
              }`}
            >
              <Link href={`/projects/${project.slug}`}>
                <div
                  className={`relative overflow-hidden rounded-2xl bg-alt ${
                    index === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'
                  }`}
                >
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
                              opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                  />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-medium text-base/80 bg-base/10 
                                   backdrop-blur-sm rounded-full border border-base/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-serif text-2xl md:text-3xl font-semibold text-base mb-2">
                      {project.title}
                    </h3>

                    <p className="text-base/70 text-sm md:text-base line-clamp-2 mb-4">
                      {project.description}
                    </p>

                    <div
                      className="inline-flex items-center gap-2 text-accent text-sm font-medium 
                                opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 
                                transition-all duration-300"
                    >
                      View Project
                      <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-ink hover:text-accent transition-colors"
          >
            <span className="border-b border-current pb-1">View All Projects</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
