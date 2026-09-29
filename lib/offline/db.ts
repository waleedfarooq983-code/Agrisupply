import Dexie, { Table } from 'dexie';

export interface OfflineLog {
  id?: number;
  action: string;
  payload: any;
  status: 'pending' | 'synced' | 'failed';
  ts: number;
}

class AgriDB extends Dexie {
  logs!: Table<OfflineLog, number>;
  constructor() {
    super('agrisupply');
    this.version(1).stores({ logs: '++id, status, ts' });
  }
}

export const db: AgriDB = typeof window !== 'undefined' ? new AgriDB() : (null as any);