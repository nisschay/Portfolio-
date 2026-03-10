import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  return NextResponse.json({
    success: true,
    data: {
      id: authResult.userId,
      email: authResult.email,
      name: 'Admin',
    },
  });
}
