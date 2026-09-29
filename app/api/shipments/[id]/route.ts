import { NextRequest, NextResponse } from 'next/server';
import { shipments } from '@/lib/mock-data';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const s = shipments.find((x) => x.id === params.id);
  if (!s) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  Object.assign(s, body, { updatedAt: new Date().toISOString() });
  return NextResponse.json(s);
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const s = shipments.find((x) => x.id === params.id);
  if (!s) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(s);
}