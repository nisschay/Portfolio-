import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { tags: true },
    });

    const allTags = posts.flatMap((post) => post.tags);
    const uniqueTags = Array.from(new Set(allTags)).sort();

    return NextResponse.json({
      success: true,
      data: uniqueTags,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch tags' } },
      { status: 500 }
    );
  }
}
