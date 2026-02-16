'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

interface Stats {
  projects: number;
  blogPosts: number;
  messages: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ projects: 0, blogPosts: 0, messages: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const [projects, posts, contacts] = await Promise.all([
          api.getProjects(),
          api.getBlogPosts(),
          api.getContacts(token),
        ]);

        setStats({
          projects: projects.length,
          blogPosts: posts.data.length,
          messages: contacts.length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  const menuItems = [
    { label: 'Projects', href: '/admin/projects', count: stats.projects, icon: '📁' },
    { label: 'Blog Posts', href: '/admin/blog', count: stats.blogPosts, icon: '📝' },
    { label: 'Messages', href: '/admin/contacts', count: stats.messages, icon: '✉️' },
  ];

  return (
    <div className="min-h-screen bg-base">
      {/* Header */}
      <header className="bg-alt border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl font-semibold text-ink">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-secondary hover:text-ink transition-colors"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-ink text-base rounded-lg hover:bg-ink/90 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-3xl font-semibold text-ink mb-8">
            Welcome back, Admin
          </h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={item.href}>
                  <div className="bg-alt rounded-xl p-6 border border-ink/5 hover:border-accent/30 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{item.icon}</span>
                      <span className="text-3xl font-serif font-semibold text-ink">
                        {isLoading ? '-' : item.count}
                      </span>
                    </div>
                    <h3 className="font-medium text-ink group-hover:text-accent transition-colors">
                      {item.label}
                    </h3>
                    <p className="text-sm text-secondary mt-1">
                      Manage {item.label.toLowerCase()}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-alt rounded-xl p-6 border border-ink/5">
            <h3 className="font-serif text-xl font-semibold text-ink mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/projects?new=true"
                className="px-4 py-2 bg-ink text-base text-sm rounded-lg hover:bg-ink/90 transition-colors"
              >
                + New Project
              </Link>
              <Link
                href="/admin/blog?new=true"
                className="px-4 py-2 bg-ink text-base text-sm rounded-lg hover:bg-ink/90 transition-colors"
              >
                + New Blog Post
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
