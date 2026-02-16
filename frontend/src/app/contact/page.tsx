'use client';

import { ContactForm } from '@/components/contact/ContactForm';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { motion } from 'framer-motion';
import { SOCIAL_LINKS, TRANSITIONS } from '@/lib/constants';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/ui/Icons';

export default function ContactPage() {
  const iconMap = {
    github: GithubIcon,
    linkedin: LinkedinIcon,
    twitter: TwitterIcon,
  };

  return (
    <section className="min-h-screen py-32 px-6 bg-base">
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={TRANSITIONS.default}
          >
            <SectionHeader
              title="Let's Connect"
              subtitle="Get In Touch"
              className="mb-8"
            />
            
            <p className="text-ink-soft text-lg leading-relaxed mb-8 max-w-md">
              I'm always interested in new opportunities, collaborations, and 
              interesting conversations. Whether you have a project in mind or 
              just want to say hello, feel free to reach out.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-6 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...TRANSITIONS.default, delay: 0.2 }}
              >
                <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">
                  Email
                </span>
                <a 
                  href="mailto:hello@nisschay.dev"
                  className="block text-lg text-ink hover:text-accent transition-colors mt-1"
                >
                  hello@nisschay.dev
                </a>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...TRANSITIONS.default, delay: 0.3 }}
              >
                <span className="text-xs font-medium uppercase tracking-widest text-ink-muted">
                  Location
                </span>
                <p className="text-lg text-ink mt-1">
                  San Francisco, CA
                </p>
              </motion.div>
            </div>
            
            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITIONS.default, delay: 0.4 }}
            >
              <span className="text-xs font-medium uppercase tracking-widest text-ink-muted block mb-4">
                Connect
              </span>
              <div className="flex gap-4">
                {SOCIAL_LINKS.map((link) => {
                  const Icon = iconMap[link.icon];
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full border border-border-strong flex items-center justify-center text-ink-soft hover:bg-ink hover:text-base hover:border-ink transition-all duration-300"
                      aria-label={link.label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...TRANSITIONS.default, delay: 0.2 }}
          >
            <div className="bg-base-alt border border-border rounded-lg p-8 md:p-10">
              <h3 className="font-serif text-2xl mb-6">Send a Message</h3>
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
