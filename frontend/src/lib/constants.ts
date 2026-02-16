/**
 * Application Constants
 */

// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Site Information
export const SITE_NAME = 'Nisschay Khandelwal';
export const SITE_DESCRIPTION = 'ML Engineer & Full-Stack Developer specializing in machine learning, AI, and modern web development.';
export const SITE_AUTHOR = 'Nisschay Khandelwal';

// Navigation Links
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
] as const;

// Social Links
export const SOCIAL_LINKS = [
  { href: 'https://github.com/nisschay', label: 'GitHub', icon: 'github' as const },
  { href: 'https://linkedin.com/in/nisschay', label: 'LinkedIn', icon: 'linkedin' as const },
  { href: 'https://twitter.com/nisschay', label: 'Twitter', icon: 'twitter' as const },
];

// Project Categories
export const PROJECT_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'ml', label: 'ML / AI' },
  { value: 'fullstack', label: 'Full Stack' },
  { value: 'data', label: 'Data' },
] as const;

// Category Labels
export const CATEGORY_LABELS: Record<string, string> = {
  ml: 'ML / AI',
  fullstack: 'Full Stack',
  data: 'Data',
};

// Animation Variants for Framer Motion
export const ANIMATION_VARIANTS = {
  fadeUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
} as const;

// Transition Defaults
export const TRANSITIONS = {
  default: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  slow: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  fast: { duration: 0.2, ease: [0.25, 1, 0.5, 1] },
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
