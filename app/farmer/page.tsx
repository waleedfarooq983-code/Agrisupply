'use client';
import { useQuery } from '@tanstack/react-query';
import { Package, TrendingUp, Thermometer, Truck, ArrowUpRight } from 'lucide-react';
import type { Shipment } from '@/lib/types';

export default function FarmerHome() {
  const { data } = useQuery<{ data: Shipment[]; total: number }>({
    queryKey: ['farmer-stats'],
    queryFn: async () => {
      const res = await fetch('/api/shipments?limit=60');
      return res.json();
    },
  });

  const shipments = data?.data || [];
  const total = data?.total || 0;
  const inTransit = shipments.filter((s) => s.status === 'in_transit').length;
  const avgTemp =
    shipments.reduce((a, s) => a + s.tempC, 0) / (shipments.length || 1);
  const delivered = shipments.filter((s) => s.status === 'delivered').length;

  const cards = [
    {
      label: 'Total Shipments',
      value: total,
      icon: Package,
      tint: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      label: 'In Transit',
      value: inTransit,
      icon: Truck,
      tint: 'from-orange-500 to-orange-600',
      bg: 'bg-orange-50',
      text: 'text-orange-600',
    },
    {
      label: 'Avg Temperature',
      value: `${avgTemp.toFixed(1)}°C`,
      icon: Thermometer,
      tint: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
    },
    {
      label: 'Delivered',
      value: delivered,
      icon: TrendingUp,
      tint: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Farmer Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Welcome back, Rajesh — here&apos;s today&apos;s overview.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live data
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="group relative bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`h-11 w-11 rounded-xl bg-gradient-to-br ${c.tint} flex items-center justify-center shadow-sm`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {c.label}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
                {c.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent activity card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Shipments</h2>
          <a
            href="/farmer/shipments"
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
          >
            View all →
          </a>
        </div>
        <div className="divide-y divide-slate-100">
          {shipments.slice(0, 5).map((s) => (
            <div
              key={s.id}
              className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Package className="h-4 w-4 text-slate-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {s.crop}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {s.id}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900">
                  {s.quantityKg.toLocaleString()} kg
                </div>
                <div className="text-xs text-slate-500">
                  {s.origin} → {s.destination}
                </div>
              </div>
            </div>
          ))}
          {shipments.length === 0 && (
            <div className="px-5 py-8 text-center text-slate-500 text-sm">
              Loading…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}