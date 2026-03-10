import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { orders } = await request.json();

    if (!Array.isArray(orders)) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Orders must be an array' } },
        { status: 400 }
      );
    }

    await Promise.all(
      orders.map(({ id, order }: { id: string; order: number }) =>
        prisma.project.update({
          where: { id },
          data: { order },
        })
      )
    );

    return NextResponse.json({ success: true, message: 'Projects reordered successfully' });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to reorder projects' } },
      { status: 500 }
    );
  }
}
