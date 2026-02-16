import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom color palette
      colors: {
        base: {
          DEFAULT: '#fdfcfa',
          alt: '#f9f7f4',
          warm: '#f5f2ed',
        },
        ink: {
          DEFAULT: '#1a1916',
          soft: '#4a4845',
          muted: '#7a7774',
        },
        accent: {
          DEFAULT: '#c4956a',
          hover: '#b8845a',
          gold: '#d4a574',
        },
        border: {
          DEFAULT: 'rgba(26, 25, 22, 0.08)',
          strong: 'rgba(26, 25, 22, 0.15)',
        },
      },
      // Custom fonts
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Custom animations
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'cursor-pulse': 'cursorPulse 2s ease-in-out infinite',
        'bar-pulse': 'barPulse 2s ease-in-out infinite',
        'node-pulse': 'nodePulse 3s ease-in-out infinite',
        'scroll-indicator': 'scrollIndicator 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        cursorPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        barPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        nodePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.3)', opacity: '1' },
        },
        scrollIndicator: {
          '0%, 100%': { opacity: '0.3', transform: 'scaleY(0.5)' },
          '50%': { opacity: '1', transform: 'scaleY(1)' },
        },
      },
      // Custom transitions
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      // Typography
      letterSpacing: {
        'extra-wide': '0.2em',
      },
      // Container
      maxWidth: {
        'container': '1400px',
      },
    },
  },
  plugins: [],
};

export default config;
