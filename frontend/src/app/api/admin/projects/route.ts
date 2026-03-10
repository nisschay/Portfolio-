import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { createProjectSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, data: projects });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch projects' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const parsed = createProjectSchema.safeParse(body);

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

    const project = await prisma.project.create({
      data,
    });

    return NextResponse.json(
      { success: true, message: 'Project created successfully', data: project },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to create project' } },
      { status: 500 }
    );
  }
}
