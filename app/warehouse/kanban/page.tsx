import { Kanban } from '@/components/kanban/Kanban';

export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Supply Pipeline</h1>
      <Kanban />
    </div>
  );
}