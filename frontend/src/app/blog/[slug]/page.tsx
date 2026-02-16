import { notFound } from 'next/navigation';
import { getBlogPost, getBlogPosts } from '@/lib/api';
import { BlogPostDetail } from '@/components/blog/BlogPostDetail';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { data: post } = await getBlogPost(params.slug);
    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.publishedAt || undefined,
        authors: [post.author],
        images: post.ogImage || post.coverImage ? [post.ogImage || post.coverImage!] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
      },
    };
  } catch {
    return {
      title: 'Blog Post Not Found',
    };
  }
}

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts({ limit: 100 });
    return posts.data.map((post) => ({
      slug: post.slug,
    }));
  } catch {
    return [];
  }
}

export const revalidate = 60;

export default async function BlogPostPage({ params }: Props) {
  try {
    const { data: post } = await getBlogPost(params.slug);
    
    return <BlogPostDetail post={post} />;
  } catch {
    notFound();
  }
}
