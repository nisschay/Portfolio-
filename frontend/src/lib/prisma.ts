import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function getPrismaDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;

  // Supabase transaction pooler needs pgbouncer mode for Prisma prepared statements.
  if (!url.includes('pooler.supabase.com')) {
    return url;
  }

  const separator = url.includes('?') ? '&' : '?';
  let normalized = url;

  if (!/([?&])pgbouncer=true(&|$)/.test(normalized)) {
    normalized = `${normalized}${separator}pgbouncer=true`;
  }

  if (!/([?&])connection_limit=\d+(&|$)/.test(normalized)) {
    normalized = `${normalized}${normalized.includes('?') ? '&' : '?'}connection_limit=1`;
  }

  return normalized;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getPrismaDatabaseUrl(),
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
