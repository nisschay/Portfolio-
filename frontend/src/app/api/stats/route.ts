import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [projectCount, blogCount] = await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count({ where: { published: true } }),
    ]);

    return NextResponse.json({
      success: true,
      data: { projects: projectCount, blogPosts: blogCount },
    });
  } catch {
    return NextResponse.json({ success: false, error: { message: 'Failed to fetch stats' } }, { status: 500 });
  }
}
