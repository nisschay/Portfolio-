import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    const where: { category?: string; featured?: boolean } = {};

    if (category) {
      where.category = category;
    }
    if (featured === 'true') {
      where.featured = true;
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { year: 'desc' },
      ],
      take: limit ? parseInt(limit, 10) : undefined,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        tags: true,
        category: true,
        year: true,
        featured: true,
        imageUrl: true,
        demoUrl: true,
        githubUrl: true,
        metrics: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch projects' } },
      { status: 500 }
    );
  }
}
