export type ShipmentStatus =
  | 'harvested'
  | 'in_transit'
  | 'warehouse'
  | 'quality_check'
  | 'dispatched'
  | 'delivered';

export interface Shipment {
  id: string;
  tenantId: string;
  crop: string;
  quantityKg: number;
  status: ShipmentStatus;
  farmerName: string;
  transporterName?: string;
  warehouseName?: string;
  retailerName?: string;
  origin: string;
  destination: string;
  tempC: number;
  createdAt: string;
  updatedAt: string;
}