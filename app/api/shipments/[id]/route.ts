import { NextRequest, NextResponse } from 'next/server';
import { shipments } from '@/lib/mock-data';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const s = shipments.find((x) => x.id === id);
  if (!s) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  Object.assign(s, body, { updatedAt: new Date().toISOString() });
  return NextResponse.json(s);
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const s = shipments.find((x) => x.id === id);
  if (!s) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(s);
}
