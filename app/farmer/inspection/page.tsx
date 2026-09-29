import { InspectionForm } from '@/components/forms/InspectionForm';

export default function Page() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold">Quality Inspection</h1>
      <p className="text-slate-500 text-sm">
        Fill in the multi-step form. Works offline — will sync when reconnected.
      </p>
      <InspectionForm />
    </div>
  );
}