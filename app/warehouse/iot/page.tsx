import { IoTStream } from '@/components/charts/IoTStream';

export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">IoT Cold-Storage Monitoring</h1>
      <IoTStream />
    </div>
  );
}