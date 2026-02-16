'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { BlogPost } from '@/types';
import { SpinnerIcon } from '@/components/ui/Icons';
import { cn, formatDate } from '@/lib/utils';

function AdminBlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(searchParams.get('new') === 'true');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchPosts();
  }, [router]);

  const fetchPosts = async () => {
    try {
      const response = await api.getBlogPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      await api.deleteBlogPost(id, token);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-base">
      <header className="bg-alt border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/admin/dashboard" className="text-secondary hover:text-ink">←</a>
            <h1 className="font-serif text-xl font-semibold text-ink">Blog Posts</h1>
          </div>
          <button
            onClick={() => { setEditingPost(null); setShowForm(true); }}
            className="px-4 py-2 bg-ink text-base text-sm rounded-lg hover:bg-ink/90"
          >
            + New Post
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {showForm ? (
          <BlogForm
            post={editingPost}
            onSuccess={() => { setShowForm(false); fetchPosts(); }}
            onCancel={() => setShowForm(false)}
          />
        ) : isLoading ? (
          <div className="flex justify-center py-12">
            <SpinnerIcon className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : (
          <div className="bg-alt rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-ink/5">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-ink">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-ink">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-ink">Date</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-ink">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-ink/[0.02]">
                    <td className="px-6 py-4 text-sm text-ink">{post.title}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'px-2 py-1 text-xs rounded-full',
                        post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      )}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => { setEditingPost(post); setShowForm(true); }}
                        className="text-sm text-accent hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminBlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-base flex items-center justify-center"><SpinnerIcon className="w-8 h-8 animate-spin" /></div>}>
      <AdminBlogContent />
    </Suspense>
  );
}

function BlogForm({
  post,
  onSuccess,
  onCancel,
}: {
  post: BlogPost | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    coverImage: post?.coverImage || '',
    tags: post?.tags.join(', ') || '',
    published: post?.published || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (post) {
        await api.updateBlogPost(post.id, payload, token);
      } else {
        await api.createBlogPost(payload, token);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-alt rounded-xl p-6 space-y-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-serif text-xl font-semibold">
          {post ? 'Edit Post' : 'New Post'}
        </h2>
        <button type="button" onClick={onCancel} className="text-secondary hover:text-ink">
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="px-4 py-3 bg-base border border-ink/10 rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="Slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="px-4 py-3 bg-base border border-ink/10 rounded-lg"
          required
        />
      </div>

      <input
        type="text"
        placeholder="Cover Image URL"
        value={formData.coverImage}
        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
        className="w-full px-4 py-3 bg-base border border-ink/10 rounded-lg"
      />

      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        className="w-full px-4 py-3 bg-base border border-ink/10 rounded-lg"
      />

      <textarea
        placeholder="Excerpt"
        value={formData.excerpt}
        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
        className="w-full px-4 py-3 bg-base border border-ink/10 rounded-lg resize-none"
        rows={2}
        required
      />

      <textarea
        placeholder="Content (HTML supported)"
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        className="w-full px-4 py-3 bg-base border border-ink/10 rounded-lg resize-none font-mono text-sm"
        rows={12}
        required
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.published}
          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
          className="w-4 h-4"
        />
        <span className="text-sm">Publish immediately</span>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-full py-3 bg-ink text-base font-medium rounded-lg',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isSubmitting ? 'Saving...' : 'Save Post'}
      </button>
    </motion.form>
  );
}
