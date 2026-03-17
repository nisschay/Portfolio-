'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, TagIcon } from '@/components/ui/Icons';
import { formatDate, calculateReadTime, getImageUrl } from '@/lib/utils';

interface BlogPostDetailProps {
  post: BlogPost;
}

export function BlogPostDetail({ post }: BlogPostDetailProps) {
  const readTime = calculateReadTime(post.content);
  const [showCoverImage, setShowCoverImage] = useState(true);

  return (
    <section className="min-h-screen pt-32 md:pt-36 pb-24 px-6 bg-base">
      <div className="max-w-2xl mx-auto">

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-secondary hover:text-accent transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-ink mb-6"
        >
          {post.title}
        </motion.h1>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-6 text-sm text-secondary mb-6"
        >
          <span className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
          <span className="flex items-center gap-2">
            <ClockIcon className="w-4 h-4" />
            {readTime} min read
          </span>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium text-accent bg-accent/10 rounded-full"
            >
              <TagIcon className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Cover Image — full column width */}
        {post.coverImage && showCoverImage && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative aspect-video rounded-2xl overflow-hidden bg-alt mb-12"
          >
            <Image
              src={getImageUrl(post.coverImage)}
              alt={post.title}
              fill
              className="object-contain"
              priority
              onError={() => setShowCoverImage(false)}
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="prose prose-lg max-w-none [&>*]:max-w-full"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 pt-8 border-t border-ink/10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-secondary text-sm">
              Thanks for reading! Share this article if you found it helpful.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-accent hover:text-ink transition-colors text-sm"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              More articles
            </Link>
          </div>
        </motion.footer>

      </div>
    </section>
  );
}
