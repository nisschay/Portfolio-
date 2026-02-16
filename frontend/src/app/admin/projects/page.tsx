'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Project } from '@/types';
import { SpinnerIcon } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

function AdminProjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(searchParams.get('new') === 'true');
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchProjects();
  }, [router]);

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      await api.deleteProject(id, token);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  return (
    <div className="min-h-screen bg-base">
      <header className="bg-alt border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/admin/dashboard" className="text-secondary hover:text-ink">←</a>
            <h1 className="font-serif text-xl font-semibold text-ink">Projects</h1>
          </div>
          <button
            onClick={() => { setEditingProject(null); setShowForm(true); }}
            className="px-4 py-2 bg-ink text-base text-sm rounded-lg hover:bg-ink/90"
          >
            + New Project
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {showForm ? (
          <ProjectForm
            project={editingProject}
            onSuccess={() => { setShowForm(false); fetchProjects(); }}
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
                  <th className="px-6 py-3 text-left text-sm font-medium text-ink">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-ink">Featured</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-ink">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-ink/[0.02]">
                    <td className="px-6 py-4 text-sm text-ink">{project.title}</td>
                    <td className="px-6 py-4 text-sm text-secondary">{project.category}</td>
                    <td className="px-6 py-4 text-sm">{project.featured ? '⭐' : '—'}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => { setEditingProject(project); setShowForm(true); }}
                        className="text-sm text-accent hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
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

export default function AdminProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-base flex items-center justify-center"><SpinnerIcon className="w-8 h-8 animate-spin" /></div>}>
      <AdminProjectsContent />
    </Suspense>
  );
}

function ProjectForm({
  project,
  onSuccess,
  onCancel,
}: {
  project: Project | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    description: project?.description || '',
    longDescription: project?.longDescription || '',
    imageUrl: project?.imageUrl || '',
    tags: project?.tags?.join(', ') || '',
    category: project?.category || 'fullstack',
    year: project?.year || new Date().getFullYear(),
    demoUrl: project?.demoUrl || '',
    githubUrl: project?.githubUrl || '',
    featured: project?.featured || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        longDescription: formData.longDescription,
        imageUrl: formData.imageUrl || null,
        tags: formData.tags.split(',').map((s: string) => s.trim()).filter(Boolean),
        category: formData.category as 'ml' | 'fullstack' | 'data',
        year: formData.year,
        demoUrl: formData.demoUrl || null,
        githubUrl: formData.githubUrl || null,
        featured: formData.featured,
      };

      if (project) {
        await api.updateProject(project.id, payload, token);
      } else {
        await api.createProject(payload, token);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save project:', error);
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
          {project ? 'Edit Project' : 'New Project'}
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
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as 'ml' | 'fullstack' | 'data' })}
          className="px-4 py-3 bg-base border border-ink/10 rounded-lg"
          required
        >
          <option value="fullstack">Full Stack</option>
          <option value="ml">ML / AI</option>
          <option value="data">Data</option>
        </select>
        <input
          type="number"
          placeholder="Year"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
          className="px-4 py-3 bg-base border border-ink/10 rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="px-4 py-3 bg-base border border-ink/10 rounded-lg"
        />
        <input
          type="text"
          placeholder="Demo URL"
          value={formData.demoUrl}
          onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
          className="px-4 py-3 bg-base border border-ink/10 rounded-lg"
        />
        <input
          type="text"
          placeholder="GitHub URL"
          value={formData.githubUrl}
          onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
          className="px-4 py-3 bg-base border border-ink/10 rounded-lg"
        />
      </div>

      <input
        type="text"
        placeholder="Image URL"
        value={formData.imageUrl}
        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        className="w-full px-4 py-3 bg-base border border-ink/10 rounded-lg"
      />

      <textarea
        placeholder="Short Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full px-4 py-3 bg-base border border-ink/10 rounded-lg resize-none"
        rows={2}
        required
      />

      <textarea
        placeholder="Full Description"
        value={formData.longDescription}
        onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
        className="w-full px-4 py-3 bg-base border border-ink/10 rounded-lg resize-none"
        rows={6}
        required
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.featured}
          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          className="w-4 h-4"
        />
        <span className="text-sm">Featured project</span>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-full py-3 bg-ink text-base font-medium rounded-lg',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isSubmitting ? 'Saving...' : 'Save Project'}
      </button>
    </motion.form>
  );
}
