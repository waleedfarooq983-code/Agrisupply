import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shipmentId = searchParams.get('shipmentId') || 'SH-1000';
  const now = Date.now();
  const points = Array.from({ length: 30 }, (_, i) => ({
    id: `${shipmentId}-${i}`,
    shipmentId,
    tempC: 4 + Math.sin(i / 3) * 2 + Math.random() * 1.5,
    humidity: 60 + Math.random() * 15,
    ts: new Date(now - (30 - i) * 60000).toISOString(),
  }));
  return NextResponse.json({ data: points });
}