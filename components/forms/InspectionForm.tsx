'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { queueOffline } from '@/lib/offline/queue';
import { CheckCircle2, Camera, Loader2 } from 'lucide-react';

const STEPS = ['Basic Info', 'Quality Check', 'Documentation'];

export function InspectionForm() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    shipmentId: '',
    crop: '',
    inspector: '',
    condition: '',
    moisture: '',
    notes: '',
    images: [] as string[],
  });

  function validateStep() {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.shipmentId.trim()) e.shipmentId = 'Shipment ID is required';
      if (!form.crop.trim()) e.crop = 'Crop type is required';
      if (!form.inspector.trim()) e.inspector = 'Inspector name is required';
    }
    if (step === 1) {
      if (!form.condition) e.condition = 'Condition is required';
      if (!form.moisture) e.moisture = 'Moisture level is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onImage(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const urls = await Promise.all(
      files.map(
        (f) =>
          new Promise<string>((resolve) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result as string);
            r.readAsDataURL(f);
          })
      )
    );
    setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
  }

  async function submit() {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      if (!navigator.onLine) {
        await queueOffline('inspection', form);
        toast.success('Saved offline — will sync when online');
      } else {
        await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'inspection', payload: form }),
        });
        toast.success('Inspection submitted');
      }
      setForm({
        shipmentId: '',
        crop: '',
        inspector: '',
        condition: '',
        moisture: '',
        notes: '',
        images: [],
      });
      setStep(0);
    } catch {
      await queueOffline('inspection', form);
      toast.warning('Network failed — saved offline');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quality Inspection — Step {step + 1} of {STEPS.length}</CardTitle>
        <div className="flex gap-2 mt-2">
          {STEPS.map((s, i) => (
            <Badge key={s} variant={i <= step ? 'default' : 'secondary'}>
              {s}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 0 && (
          <>
            <div>
              <Label>Shipment ID *</Label>
              <Input
                value={form.shipmentId}
                onChange={(e) => setForm({ ...form, shipmentId: e.target.value })}
                placeholder="SH-1001"
              />
              {errors.shipmentId && (
                <p className="text-xs text-red-500 mt-1">{errors.shipmentId}</p>
              )}
            </div>
            <div>
              <Label>Crop Type *</Label>
              <Select value={form.crop} onValueChange={(v) => setForm({ ...form, crop: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  {['Wheat', 'Rice', 'Tomato', 'Potato', 'Milk', 'Mango', 'Onion', 'Spinach'].map(
                    (c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {errors.crop && <p className="text-xs text-red-500 mt-1">{errors.crop}</p>}
            </div>
            <div>
              <Label>Inspector Name *</Label>
              <Input
                value={form.inspector}
                onChange={(e) => setForm({ ...form, inspector: e.target.value })}
                placeholder="Your name"
              />
              {errors.inspector && (
                <p className="text-xs text-red-500 mt-1">{errors.inspector}</p>
              )}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <Label>Condition *</Label>
              <Select
                value={form.condition}
                onValueChange={(v) => setForm({ ...form, condition: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assess condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
              {errors.condition && (
                <p className="text-xs text-red-500 mt-1">{errors.condition}</p>
              )}
            </div>

            {form.condition === 'poor' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                ⚠️ Poor condition requires supervisor approval. Please add detailed notes.
              </div>
            )}

            <div>
              <Label>Moisture Level *</Label>
              <Input
                type="number"
                value={form.moisture}
                onChange={(e) => setForm({ ...form, moisture: e.target.value })}
                placeholder="e.g. 12"
              />
              {errors.moisture && (
                <p className="text-xs text-red-500 mt-1">{errors.moisture}</p>
              )}
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any additional observations…"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <Label>Photo Evidence</Label>
              <label className="mt-2 flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-slate-50">
                <Camera className="h-5 w-5 text-slate-500" />
                <span className="text-sm text-slate-500">Tap to capture / upload</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  onChange={onImage}
                  className="hidden"
                />
              </label>
              {form.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {form.images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={src}
                      alt={`evidence-${i}`}
                      className="rounded border h-24 w-full object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded p-3 text-sm">
              <div className="font-medium mb-1">Summary</div>
              <div className="text-slate-600 space-y-1 text-xs">
                <div>Shipment: {form.shipmentId || '—'}</div>
                <div>Crop: {form.crop || '—'}</div>
                <div>Inspector: {form.inspector || '—'}</div>
                <div>Condition: {form.condition || '—'}</div>
                <div>Moisture: {form.moisture || '—'}</div>
                <div>Images: {form.images.length}</div>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={back} disabled={step === 0}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next}>Next</Button>
          ) : (
            <Button onClick={submit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Submit Inspection
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}