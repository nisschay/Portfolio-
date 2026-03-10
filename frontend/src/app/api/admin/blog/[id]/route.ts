import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { updateBlogPostSchema } from '@/lib/validations';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({ where: { id } });

    if (!post) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Blog post not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch blog post' } },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateBlogPostSchema.safeParse(body);

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

    const currentPost = await prisma.blogPost.findUnique({ where: { id } });
    if (!currentPost) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Blog post not found' } },
        { status: 404 }
      );
    }

    const data = { ...parsed.data } as Record<string, unknown>;
    if (parsed.data.published && !currentPost.published) {
      data.publishedAt = new Date();
    }

    const post = await prisma.blogPost.update({ where: { id }, data });

    return NextResponse.json({ success: true, message: 'Blog post updated successfully', data: post });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to update blog post' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({ where: { id } });

    if (!post) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Blog post not found' } },
        { status: 404 }
      );
    }

    if (post.coverImage && post.coverImage.includes('supabase')) {
      const path = post.coverImage.split('/storage/v1/object/public/uploads/')[1];
      if (path) {
        await supabaseAdmin.storage.from('uploads').remove([path]);
      }
    }

    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to delete blog post' } },
      { status: 500 }
    );
  }
}
