'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { toast } from 'sonner';

interface Reading {
  ts: string;
  tempC: number;
}

export function IoTStream({ shipmentId = 'SH-1000' }: { shipmentId?: string }) {
  const [readings, setReadings] = useState<Reading[]>([]);

  useEffect(() => {
    let alive = true;
    fetch(`/api/sensors?shipmentId=${shipmentId}`)
      .then((r) => r.json())
      .then((d) => alive && setReadings(d.data));

    const interval = setInterval(() => {
      setReadings((prev) => {
        const next: Reading = {
          ts: new Date().toLocaleTimeString(),
          tempC: 4 + Math.sin(Date.now() / 10000) * 2 + Math.random() * 1.5,
        };
        const updated = [...prev.slice(-29), next];
        if (next.tempC > 8) toast.warning(`High temp alert: ${next.tempC.toFixed(1)}°C`);
        return updated;
      });
    }, 2000);

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [shipmentId]);

  const latest = readings[readings.length - 1];
  const isAlert = latest && latest.tempC > 8;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Current Temp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {latest ? latest.tempC.toFixed(1) : '—'}°C
            </div>
            {isAlert ? (
              <Badge variant="destructive" className="mt-2">
                ALERT
              </Badge>
            ) : (
              <Badge className="mt-2 bg-emerald-500 hover:bg-emerald-500">Normal</Badge>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Readings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{readings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isAlert ? '⚠️' : '✅'}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Live Temperature Stream — {shipmentId}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={readings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ts" hide />
              <YAxis domain={[0, 12]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tempC"
                stroke={isAlert ? '#ef4444' : '#3b82f6'}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}