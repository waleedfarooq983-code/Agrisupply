import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('[SYNC RECEIVED]', body);
  return NextResponse.json({ ok: true, receivedAt: new Date().toISOString() });
}