import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;
    const message = await prisma.contact.findUnique({ where: { id } });

    if (!message) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Contact message not found' } },
        { status: 404 }
      );
    }

    // Mark as read
    if (!message.read) {
      await prisma.contact.update({
        where: { id },
        data: { read: true },
      });
    }

    return NextResponse.json({
      success: true,
      data: { ...message, read: true },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch contact' } },
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
    const { read } = await request.json();

    const message = await prisma.contact.update({
      where: { id },
      data: { read: read ?? true },
    });

    return NextResponse.json({
      success: true,
      message: `Message marked as ${message.read ? 'read' : 'unread'}`,
      data: message,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to update contact' } },
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

    await prisma.contact.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Contact message deleted successfully' });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to delete contact' } },
      { status: 500 }
    );
  }
}
