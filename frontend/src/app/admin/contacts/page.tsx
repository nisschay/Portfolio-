'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Contact } from '@/types';
import { SpinnerIcon, MailIcon } from '@/components/ui/Icons';
import { cn, formatDate } from '@/lib/utils';

export default function AdminContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchContacts(token);
  }, [router]);

  const fetchContacts = async (token: string) => {
    try {
      const data = await api.getContacts(token);
      setContacts(data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkRead = async (contact: Contact) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      await api.updateContact(contact.id, { read: true }, token);
      setContacts(contacts.map((c) => (c.id === contact.id ? { ...c, read: true } : c)));
      if (selectedContact?.id === contact.id) {
        setSelectedContact({ ...contact, read: true });
      }
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      await api.deleteContact(id, token);
      setContacts(contacts.filter((c) => c.id !== id));
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const unreadCount = contacts.filter((c) => !c.read).length;

  return (
    <div className="min-h-screen bg-base">
      <header className="bg-alt border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/admin/dashboard" className="text-secondary hover:text-ink">←</a>
            <h1 className="font-serif text-xl font-semibold text-ink">
              Messages {unreadCount > 0 && <span className="text-accent">({unreadCount})</span>}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <SpinnerIcon className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-16">
            <MailIcon className="w-12 h-12 mx-auto text-secondary mb-4" />
            <p className="text-secondary">No messages yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message List */}
            <div className="lg:col-span-1 bg-alt rounded-xl overflow-hidden">
              <div className="divide-y divide-ink/5 max-h-[600px] overflow-y-auto">
                {contacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setSelectedContact(contact);
                      if (!contact.read) handleMarkRead(contact);
                    }}
                    className={cn(
                      'w-full px-4 py-4 text-left hover:bg-ink/[0.02] transition-colors',
                      selectedContact?.id === contact.id && 'bg-ink/5',
                      !contact.read && 'border-l-2 border-accent'
                    )}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={cn('text-sm', !contact.read && 'font-semibold text-ink')}>
                        {contact.name}
                      </span>
                      <span className="text-xs text-secondary">
                        {formatDate(contact.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-secondary truncate">{contact.subject}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2">
              {selectedContact ? (
                <motion.div
                  key={selectedContact.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-alt rounded-xl p-6"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="font-serif text-xl font-semibold text-ink mb-1">
                        {selectedContact.subject}
                      </h2>
                      <p className="text-sm text-secondary">
                        From: {selectedContact.name} &lt;{selectedContact.email}&gt;
                      </p>
                      <p className="text-xs text-secondary mt-1">
                        {formatDate(selectedContact.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(selectedContact.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <p className="text-secondary whitespace-pre-wrap">
                      {selectedContact.message}
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-ink/10">
                    <a
                      href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-base text-sm rounded-lg hover:bg-ink/90"
                    >
                      <MailIcon className="w-4 h-4" />
                      Reply via Email
                    </a>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-alt rounded-xl p-6 text-center text-secondary">
                  Select a message to view
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
