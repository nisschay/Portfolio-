import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const unread = searchParams.get('unread');

    const where: { read?: boolean } = {};
    if (unread === 'true') {
      where.read = false;
    }

    const messages = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: messages });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch contacts' } },
      { status: 500 }
    );
  }
}
