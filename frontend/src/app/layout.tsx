import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Cursor } from '@/components/layout/Cursor';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants';

// Load fonts with Next.js font optimization
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
});

// Metadata
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ML Engineer & Full-Stack Developer`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'Machine Learning',
    'Full Stack Developer',
    'ML Engineer',
    'React',
    'Next.js',
    'Python',
    'Node.js',
    'Portfolio',
    'Nisschay Khandelwal',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ML Engineer & Full-Stack Developer`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | ML Engineer & Full-Stack Developer`,
    description: SITE_DESCRIPTION,
    creator: '@nisschay',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${cormorant.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-base text-ink overflow-x-hidden">
        {/* Custom Cursor */}
        <Cursor />
        
        {/* Background Decorations */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Gradient Lines */}
          <div className="absolute inset-0">
            {[10, 30, 50, 70, 90].map((position) => (
              <div
                key={position}
                className="absolute top-0 h-full w-px opacity-50"
                style={{
                  left: `${position}%`,
                  background: `linear-gradient(
                    180deg,
                    transparent 0%,
                    rgba(26, 25, 22, 0.08) 20%,
                    rgba(26, 25, 22, 0.15) 50%,
                    rgba(26, 25, 22, 0.08) 80%,
                    transparent 100%
                  )`,
                }}
              />
            ))}
          </div>
          
          {/* Geometric Pattern */}
          <div className="absolute top-1/5 right-[5%] w-48 h-48 opacity-[0.03]">
            <div className="absolute inset-0 border border-ink rotate-45" />
            <div className="absolute inset-[15%] border border-ink rotate-45" />
          </div>
        </div>
        
        {/* Navigation */}
        <Navbar />
        
        {/* Main Content */}
        <main className="relative z-10">
          {children}
        </main>
        
        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
