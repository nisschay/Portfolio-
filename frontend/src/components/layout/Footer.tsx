'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SOCIAL_LINKS, NAV_LINKS } from '@/lib/constants';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/ui/Icons';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // Hide footer on admin pages
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-ink text-base py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-serif text-2xl font-semibold tracking-tight hover:text-accent transition-colors"
            >
              Nisschay.
            </Link>
            <p className="mt-4 text-base/60 text-sm max-w-xs">
              ML/AI Engineer & Full-Stack Developer crafting intelligent digital
              experiences with precision and creativity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-sans text-sm font-medium tracking-wider uppercase mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base/60 hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-sans text-sm font-medium tracking-wider uppercase mb-4">
              Connect
            </h3>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => {
                const Icon = iconMap[social.icon];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-base/20 flex items-center justify-center 
                             hover:bg-accent hover:border-accent transition-all duration-300 group"
                    aria-label={`Follow on ${social.label}`}
                  >
                    <Icon className="w-4 h-4 text-base/60 group-hover:text-ink transition-colors" />
                  </a>
                );
              })}
            </div>
            <p className="mt-6 text-base/40 text-xs">
              nisschay@example.com
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-base/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-base/40 text-xs">
            © {currentYear} Nisschay Khandelwal. All rights reserved.
          </p>
          <p className="text-base/40 text-xs">
            Built with Next.js, crafted with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
