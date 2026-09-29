export type Role = 'farmer' | 'transporter' | 'warehouse' | 'retailer';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  tenantId: string;
}

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

export interface SensorReading {
  id: string;
  shipmentId: string;
  tempC: number;
  humidity: number;
  ts: string;
}
