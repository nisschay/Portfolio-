'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types';
import { ArrowLeftIcon, ExternalLinkIcon, GithubIcon } from '@/components/ui/Icons';
import { getImageUrl } from '@/lib/utils';

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const hasHtmlDescription = /<[^>]+>/.test(project.longDescription);

  return (
    <article className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20">
      {/* Header */}
      <header className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-secondary hover:text-ink transition-colors mb-8"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Projects
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          <span className="px-3 py-1 text-sm font-medium text-ink bg-alt rounded-full">
            {project.category}
          </span>
          {project.featured && (
            <span className="px-3 py-1 text-sm font-medium text-base bg-accent rounded-full">
              Featured
            </span>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-ink mb-6"
        >
          {project.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-secondary text-lg md:text-xl max-w-3xl"
        >
          {project.description}
        </motion.p>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-4 mt-8"
        >
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-base rounded-full 
                       hover:bg-ink/90 transition-colors"
            >
              <ExternalLinkIcon className="w-4 h-4" />
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-ink/20 text-ink rounded-full 
                       hover:border-accent hover:text-accent transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              Source Code
            </a>
          )}
        </motion.div>
      </header>

      {/* Featured Image */}
      {project.imageUrl && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative aspect-video rounded-2xl overflow-hidden bg-alt mb-16"
        >
          <Image
            src={getImageUrl(project.imageUrl)}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <h2 className="font-serif text-2xl font-semibold text-ink mb-6">
            About the Project
          </h2>
          {hasHtmlDescription ? (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: project.longDescription }}
            />
          ) : (
            <div className="prose prose-lg">
              {project.longDescription.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-secondary mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-8"
        >
          {/* Technologies */}
          <div>
            <h3 className="font-sans text-sm font-medium tracking-wider uppercase text-secondary mb-4">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-sm bg-alt text-ink rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <h3 className="font-sans text-sm font-medium tracking-wider uppercase text-secondary mb-4">
              Completed
            </h3>
            <p className="text-ink">
              {new Date(project.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
        </motion.aside>
      </div>
    </article>
  );
}
