import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { createBlogPostSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: posts });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch blog posts' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const parsed = createBlogPostSchema.safeParse(body);

    if (!parsed.success) {
      const details = parsed.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Validation failed', details: { errors: details } } },
        { status: 400 }
      );
    }

    const data = {
      ...parsed.data,
      publishedAt: parsed.data.published ? new Date() : null,
    };

    const post = await prisma.blogPost.create({ data });

    return NextResponse.json(
      { success: true, message: 'Blog post created successfully', data: post },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to create blog post' } },
      { status: 500 }
    );
  }
}
