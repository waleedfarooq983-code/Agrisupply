'use client';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import type { Shipment } from '@/lib/types';

const statusColor: Record<string, string> = {
  harvested: 'bg-yellow-100 text-yellow-800',
  in_transit: 'bg-blue-100 text-blue-800',
  warehouse: 'bg-purple-100 text-purple-800',
  quality_check: 'bg-orange-100 text-orange-800',
  dispatched: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-green-100 text-green-800',
};

interface ShipmentsResponse {
  data: Shipment[];
  total: number;
  page: number;
  limit: number;
}

export function ShipmentsTable() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const limit = 10;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const { data, isLoading } = useQuery<ShipmentsResponse>({
    queryKey: ['shipments', page, debouncedQ, status, sortBy, order],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        q: debouncedQ,
        status,
        sortBy,
        order,
      });
      const res = await fetch(`/api/shipments?${params}`);
      return res.json();
    },
  });

  const rows: Shipment[] = data?.data || [];
  const total = data?.total || 0;
  const pages = Math.ceil(total / limit);

  function toggleSort(col: string) {
    if (sortBy === col) setOrder(order === 'asc' ? 'desc' : 'asc');
    else {
      setSortBy(col);
      setOrder('asc');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search ID, crop, city…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={status || 'all'}
          onValueChange={(v) => {
            setStatus(v === 'all' ? '' : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="harvested">Harvested</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
            <SelectItem value="quality_check">Quality Check</SelectItem>
            <SelectItem value="dispatched">Dispatched</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-x-auto bg-white">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {[
                { key: 'id', label: 'ID' },
                { key: 'crop', label: 'Crop' },
                { key: 'quantityKg', label: 'Qty (kg)' },
                { key: 'status', label: 'Status' },
                { key: 'origin', label: 'Origin' },
                { key: 'destination', label: 'Destination' },
                { key: 'tempC', label: 'Temp °C' },
              ].map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortBy === col.key &&
                      (order === 'asc' ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={7} className="p-3">
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))}

            {!isLoading &&
              rows.map((s) => (
                <tr key={s.id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs">{s.id}</td>
                  <td className="px-4 py-3">{s.crop}</td>
                  <td className="px-4 py-3">{s.quantityKg.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs capitalize ${
                        statusColor[s.status] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {String(s.status).replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">{s.origin}</td>
                  <td className="px-4 py-3">{s.destination}</td>
                  <td className="px-4 py-3">{s.tempC.toFixed(1)}</td>
                </tr>
              ))}

            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  No shipments match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-sm text-slate-500">
          Page {page} of {pages || 1} · {total} total
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}