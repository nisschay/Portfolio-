import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const [
      projectCount,
      blogPostCount,
      publishedPostCount,
      contactCount,
      unreadContactCount,
      recentContacts,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.contact.count(),
      prisma.contact.count({ where: { read: false } }),
      prisma.contact.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          read: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        projects: projectCount,
        blogPosts: {
          total: blogPostCount,
          published: publishedPostCount,
          drafts: blogPostCount - publishedPostCount,
        },
        contacts: {
          total: contactCount,
          unread: unreadContactCount,
        },
        recentContacts,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch dashboard stats' } },
      { status: 500 }
    );
  }
}
