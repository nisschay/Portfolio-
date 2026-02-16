'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { SpinnerIcon } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.login(data.email, data.password);
      
      // Store token
      localStorage.setItem('admin_token', response.token);
      
      // Redirect to dashboard
      router.push('/admin/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-semibold text-ink mb-2">
            Admin Login
          </h1>
          <p className="text-secondary">
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-alt rounded-2xl p-8 shadow-sm"
        >
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className={cn(
                'w-full px-4 py-3 bg-base border rounded-lg outline-none transition-all duration-300',
                'focus:border-accent focus:ring-2 focus:ring-accent/20',
                errors.email ? 'border-red-500' : 'border-ink/10'
              )}
              placeholder="admin@nisschay.dev"
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-8">
            <label htmlFor="password" className="block text-sm font-medium text-ink mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password')}
              className={cn(
                'w-full px-4 py-3 bg-base border rounded-lg outline-none transition-all duration-300',
                'focus:border-accent focus:ring-2 focus:ring-accent/20',
                errors.password ? 'border-red-500' : 'border-ink/10'
              )}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full py-3.5 bg-ink text-base font-medium rounded-lg transition-all duration-300',
              'hover:bg-ink/90 focus:ring-2 focus:ring-ink/20',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <SpinnerIcon className="w-5 h-5 animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Back to site */}
        <p className="mt-6 text-center text-sm text-secondary">
          <a href="/" className="text-accent hover:underline">
            Back to website
          </a>
        </p>
      </motion.div>
    </div>
  );
}
