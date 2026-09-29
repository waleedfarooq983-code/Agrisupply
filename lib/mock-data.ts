import { User, Shipment, ShipmentStatus } from './types';

export const users: User[] = [
  { id: 'u1', email: 'farmer@agri.com', password: 'demo123', name: 'Rajesh Kumar', role: 'farmer', tenantId: 't1' },
  { id: 'u2', email: 'transporter@agri.com', password: 'demo123', name: 'Amit Singh', role: 'transporter', tenantId: 't1' },
  { id: 'u3', email: 'warehouse@agri.com', password: 'demo123', name: 'Priya Sharma', role: 'warehouse', tenantId: 't1' },
  { id: 'u4', email: 'retailer@agri.com', password: 'demo123', name: 'Vikram Mehta', role: 'retailer', tenantId: 't1' },
];

const crops = ['Wheat', 'Rice', 'Tomato', 'Potato', 'Milk', 'Mango', 'Onion', 'Spinach'];
const cities = ['Lahore', 'Karachi', 'Islamabad', 'Multan', 'Faisalabad', 'Peshawar', 'Quetta'];
const statuses: ShipmentStatus[] = ['harvested', 'in_transit', 'warehouse', 'quality_check', 'dispatched', 'delivered'];

export const shipments: Shipment[] = Array.from({ length: 60 }, (_, i) => {
  const crop = crops[i % crops.length];
  const origin = cities[i % cities.length];
  const destination = cities[(i + 3) % cities.length];
  return {
    id: `SH-${1000 + i}`,
    tenantId: 't1',
    crop,
    quantityKg: 500 + Math.floor(Math.random() * 5000),
    status: statuses[i % statuses.length],
    farmerName: 'Rajesh Kumar',
    transporterName: 'Amit Singh',
    warehouseName: i % 2 === 0 ? 'Central Cold Storage' : undefined,
    retailerName: 'Fresh Mart',
    origin,
    destination,
    tempC: 2 + Math.random() * 8,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - i * 3600000).toISOString(),
  };
});