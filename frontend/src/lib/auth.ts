import { NextResponse } from 'next/server';
import { supabaseAdmin } from './supabase-admin';

export async function verifyAuth(request: Request): Promise<{ userId: string; email: string } | NextResponse> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'No authentication token provided' } },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } },
      { status: 401 }
    );
  }

  return { userId: user.id, email: user.email! };
}

export function errorResponse(message: string, status: number, code = 'INTERNAL_ERROR') {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status }
  );
}
