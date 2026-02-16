'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPostListItem } from '@/types';
import { CalendarIcon, ClockIcon, ArrowRightIcon } from '@/components/ui/Icons';
import { formatDate, getImageUrl } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPostListItem;
  index?: number;
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  const readTime = post.readTime;

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
      <Link href={`/blog/${post.slug}`}>
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-alt mb-5">
          {post.coverImage ? (
            <Image
              src={getImageUrl(post.coverImage)}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5" />
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium text-accent"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl md:text-2xl font-semibold text-ink group-hover:text-accent transition-colors mb-3 line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-secondary text-sm line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-secondary">
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5" />
            {post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}
          </span>
          <span className="flex items-center gap-1.5">
            <ClockIcon className="w-3.5 h-3.5" />
            {readTime} min read
          </span>
        </div>

        {/* Read More (hidden by default) */}
        <div
          className="mt-4 inline-flex items-center gap-2 text-accent text-sm font-medium 
                    opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 
                    transition-all duration-300"
        >
          Read Article
          <ArrowRightIcon className="w-4 h-4" />
        </div>
      </Link>
    </motion.article>
  );
}
