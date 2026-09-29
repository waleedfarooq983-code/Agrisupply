import { ShipmentsTable } from '@/components/tables/ShipmentsTable';

export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Shipments</h1>
      <ShipmentsTable />
    </div>
  );
}