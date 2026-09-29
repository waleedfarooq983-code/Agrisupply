import { NextRequest, NextResponse } from 'next/server';
import { shipments } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const q = (searchParams.get('q') || '').toLowerCase();
  const status = searchParams.get('status') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const order = searchParams.get('order') || 'desc';

  let data = [...shipments];

  if (q) {
    data = data.filter(
      (s) =>
        s.id.toLowerCase().includes(q) ||
        s.crop.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q)
    );
  }

  if (status) data = data.filter((s) => s.status === status);

  data.sort((a: any, b: any) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    if (av < bv) return order === 'asc' ? -1 : 1;
    if (av > bv) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const total = data.length;
  const paged = data.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ data: paged, total, page, limit });
}