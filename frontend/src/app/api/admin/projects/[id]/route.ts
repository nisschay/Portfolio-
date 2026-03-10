import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { updateProjectSchema } from '@/lib/validations';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: project });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch project' } },
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
    const parsed = updateProjectSchema.safeParse(body);

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
      metrics: parsed.data.metrics === null ? undefined : parsed.data.metrics,
    };

    const project = await prisma.project.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, message: 'Project updated successfully', data: project });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to update project' } },
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
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } },
        { status: 404 }
      );
    }

    // Delete associated image from Supabase Storage if it exists
    if (project.imageUrl && project.imageUrl.includes('supabase')) {
      const path = project.imageUrl.split('/storage/v1/object/public/uploads/')[1];
      if (path) {
        await supabaseAdmin.storage.from('uploads').remove([path]);
      }
    }

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to delete project' } },
      { status: 500 }
    );
  }
}
