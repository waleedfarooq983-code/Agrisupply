'use client';
import { MetricsDeck } from '@/components/charts/MetricsDeck';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { toast } from 'sonner';

export default function ReportsPage() {
  async function downloadPDF() {
    const res = await fetch('/api/shipments?limit=60');
    const { data } = await res.json();

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('AgriSupply — Compliance Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Tenant: t1`, 14, 34);

    autoTable(doc, {
      startY: 42,
      head: [['ID', 'Crop', 'Qty (kg)', 'Status', 'Origin', 'Destination', 'Temp °C']],
      body: data.map((s: any) => [
        s.id,
        s.crop,
        s.quantityKg,
        s.status,
        s.origin,
        s.destination,
        s.tempC.toFixed(1),
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [16, 185, 129] },
    });

    doc.save(`agrisupply-report-${Date.now()}.pdf`);
    toast.success('PDF downloaded');
  }

  async function downloadCSV() {
    const res = await fetch('/api/shipments?limit=60');
    const { data } = await res.json();

    const csv = Papa.unparse(
      data.map((s: any) => ({
        ID: s.id,
        Crop: s.crop,
        QuantityKg: s.quantityKg,
        Status: s.status,
        Origin: s.origin,
        Destination: s.destination,
        TempC: s.tempC.toFixed(1),
        CreatedAt: s.createdAt,
      }))
    );

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agrisupply-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex gap-2">
          <Button onClick={downloadPDF} variant="outline">
            Download PDF
          </Button>
          <Button onClick={downloadCSV}>Download CSV</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Compliance Invoice Preview</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Generate a signed PDF report containing every shipment line item, its
          current status, and temperature compliance data.
        </CardContent>
      </Card>

      <MetricsDeck />
    </div>
  );
}