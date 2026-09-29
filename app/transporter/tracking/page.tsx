import { TrackingMap } from '@/components/maps/TrackingMap';

export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Live Tracking & Geofencing</h1>
      <TrackingMap />
    </div>
  );
}