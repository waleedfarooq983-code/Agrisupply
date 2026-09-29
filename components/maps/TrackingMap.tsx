'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MapPin, Navigation } from 'lucide-react';

interface GeoPoint {
  lat: number;
  lng: number;
  name: string;
}

const ROUTE: GeoPoint[] = [
  { lat: 31.5204, lng: 74.3587, name: 'Lahore Farm' },
  { lat: 31.4187, lng: 73.0791, name: 'Faisalabad Hub' },
  { lat: 30.1575, lng: 71.5249, name: 'Multan Warehouse' },
];

const GEOFENCE_RADIUS_M = 20000;

function distanceM(a: GeoPoint, b: GeoPoint) {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

export function TrackingMap() {
  const [pos, setPos] = useState<GeoPoint>(ROUTE[0]);
  const [routeIdx, setRouteIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [insideGeofence, setInsideGeofence] = useState(false);
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) {
          const nextIdx = (routeIdx + 1) % ROUTE.length;
          setRouteIdx(nextIdx);
          const from = ROUTE[nextIdx];
          const to = ROUTE[(nextIdx + 1) % ROUTE.length];
          setPos({ lat: from.lat, lng: from.lng, name: from.name });
          return 0;
        }
        const from = ROUTE[routeIdx];
        const to = ROUTE[(routeIdx + 1) % ROUTE.length];
        const lat = from.lat + (to.lat - from.lat) * p;
        const lng = from.lng + (to.lng - from.lng) * p;
        setPos({ lat, lng, name: from.name });
        return p + 0.02;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [routeIdx]);

  useEffect(() => {
    const target = ROUTE[(routeIdx + 1) % ROUTE.length];
    const dist = distanceM(pos, target);
    const inside = dist < GEOFENCE_RADIUS_M;

    if (inside && !insideGeofence) {
      const msg = `Entered geofence: ${target.name}`;
      setEvents((e) => [msg, ...e].slice(0, 6));
      toast.success(msg);
    }
    setInsideGeofence(inside);
  }, [pos, routeIdx, insideGeofence]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Navigation className="h-4 w-4" /> Live Truck Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gradient-to-br from-sky-100 to-emerald-100 rounded-lg h-[400px] overflow-hidden">
            <svg
              viewBox="0 0 100 60"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              {ROUTE.map((p, i) => {
                if (i === 0) return null;
                const prev = ROUTE[i - 1];
                const x1 = ((prev.lng - 70) / 5) * 100;
                const y1 = 60 - ((prev.lat - 29) / 4) * 60;
                const x2 = ((p.lng - 70) / 5) * 100;
                const y2 = 60 - ((p.lat - 29) / 4) * 60;
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#059669"
                    strokeWidth="0.5"
                    strokeDasharray="2 1"
                  />
                );
              })}
            </svg>

            {ROUTE.map((p, i) => {
              const x = ((p.lng - 70) / 5) * 100;
              const y = 60 - ((p.lat - 29) / 4) * 60;
              return (
                <div
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <MapPin className="h-5 w-5 text-slate-700 mx-auto" />
                  <div className="text-[10px] font-semibold mt-1 bg-white/80 px-1 rounded">
                    {p.name}
                  </div>
                </div>
              );
            })}

            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
              style={{
                left: `${((pos.lng - 70) / 5) * 100}%`,
                top: `${60 - ((pos.lat - 29) / 4) * 60}%`,
              }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg ring-4 ring-blue-300/50">
                <Navigation className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Truck Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Position</span>
              <span className="font-mono">
                {pos.lat.toFixed(4)}, {pos.lng.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Next stop</span>
              <span>{ROUTE[(routeIdx + 1) % ROUTE.length].name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Geofence</span>
              {insideGeofence ? (
                <Badge className="bg-emerald-500 hover:bg-emerald-500">Inside</Badge>
              ) : (
                <Badge variant="outline">Outside</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Event Log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[220px] overflow-auto">
            {events.length === 0 && (
              <p className="text-sm text-slate-500">No events yet.</p>
            )}
            {events.map((e, i) => (
              <div key={i} className="text-xs bg-slate-50 rounded p-2">
                {e}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}