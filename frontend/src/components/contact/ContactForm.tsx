'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { SpinnerIcon } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await api.submitContact(data);
      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className={cn(
            'w-full px-4 py-3 bg-alt border rounded-lg outline-none transition-all duration-300',
            'focus:border-accent focus:ring-2 focus:ring-accent/20',
            errors.name ? 'border-red-500' : 'border-ink/10'
          )}
          placeholder="Your name"
        />
        {errors.name && (
          <p className="mt-1.5 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={cn(
            'w-full px-4 py-3 bg-alt border rounded-lg outline-none transition-all duration-300',
            'focus:border-accent focus:ring-2 focus:ring-accent/20',
            errors.email ? 'border-red-500' : 'border-ink/10'
          )}
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-ink mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          {...register('subject')}
          className={cn(
            'w-full px-4 py-3 bg-alt border rounded-lg outline-none transition-all duration-300',
            'focus:border-accent focus:ring-2 focus:ring-accent/20',
            errors.subject ? 'border-red-500' : 'border-ink/10'
          )}
          placeholder="What's this about?"
        />
        {errors.subject && (
          <p className="mt-1.5 text-sm text-red-500">{errors.subject.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink mb-2">
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          {...register('message')}
          className={cn(
            'w-full px-4 py-3 bg-alt border rounded-lg outline-none transition-all duration-300 resize-none',
            'focus:border-accent focus:ring-2 focus:ring-accent/20',
            errors.message ? 'border-red-500' : 'border-ink/10'
          )}
          placeholder="Tell me about your project..."
        />
        {errors.message && (
          <p className="mt-1.5 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-full py-4 bg-ink text-base font-medium rounded-lg transition-all duration-300',
          'hover:bg-ink/90 focus:ring-2 focus:ring-ink/20',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <SpinnerIcon className="w-5 h-5 animate-spin" />
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </button>

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
          >
            Thank you for your message! I&apos;ll get back to you soon.
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
          >
            Something went wrong. Please try again or email me directly.
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
