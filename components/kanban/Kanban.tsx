'use client';
import { useEffect, useState } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from '@dnd-kit/core';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Shipment, ShipmentStatus } from '@/lib/types';

const COLUMNS: { id: ShipmentStatus; label: string; color: string }[] = [
  { id: 'harvested', label: 'Harvested', color: 'border-yellow-400' },
  { id: 'in_transit', label: 'In Transit', color: 'border-blue-400' },
  { id: 'warehouse', label: 'Warehouse', color: 'border-purple-400' },
  { id: 'quality_check', label: 'Quality Check', color: 'border-orange-400' },
  { id: 'dispatched', label: 'Dispatched', color: 'border-cyan-400' },
  { id: 'delivered', label: 'Delivered', color: 'border-green-400' },
];

function Card({ item }: { item: Shipment }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white border rounded-lg p-3 cursor-grab active:cursor-grabbing shadow-sm"
    >
      <div className="font-mono text-xs text-slate-500">{item.id}</div>
      <div className="font-medium">{item.crop}</div>
      <div className="text-xs text-slate-500">
        {item.quantityKg} kg · {item.origin}→{item.destination}
      </div>
    </div>
  );
}

function Column({
  id,
  label,
  color,
  items,
}: {
  id: ShipmentStatus;
  label: string;
  color: string;
  items: Shipment[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border-t-4 ${color} bg-slate-50 p-3 min-w-64 flex-1 ${
        isOver ? 'ring-2 ring-blue-400' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">{label}</h3>
        <Badge variant="secondary">{items.length}</Badge>
      </div>
      <div className="space-y-2 min-h-24">
        {items.map((it) => (
          <Card key={it.id} item={it} />
        ))}
      </div>
    </div>
  );
}

export function Kanban() {
  const [items, setItems] = useState<Shipment[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/shipments?limit=60')
      .then((r) => r.json())
      .then((d) => {
        setItems(d.data || []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  async function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over) return;

    const id = active.id as string;
    const newStatus = over.id as ShipmentStatus;
    const item = items.find((i) => i.id === id);
    if (!item || item.status === newStatus) return;

    const prev = items;
    setItems(
      items.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );

    try {
      const res = await fetch(`/api/shipments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success(`${id} → ${newStatus.replace('_', ' ')}`);
    } catch {
      setItems(prev);
      toast.error('Update failed');
    }
  }

  if (!loaded) return <div className="text-slate-500">Loading board…</div>;

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            label={col.label}
            color={col.color}
            items={items.filter((i) => i.status === col.id)}
          />
        ))}
      </div>
    </DndContext>
  );
}