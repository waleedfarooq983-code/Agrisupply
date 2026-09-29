'use client';
import { useEffect, useState } from 'react';
import { db } from './db';

export function useOfflineQueue() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!db) return;
    const update = async () => setCount(await db.logs.where('status').equals('pending').count());
    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  }, []);
  return count;
}

export async function queueOffline(action: string, payload: any) {
  if (!db) return;
  await db.logs.add({ action, payload, status: 'pending', ts: Date.now() });
}

export async function flushQueue() {
  if (!db) return;
  const pending = await db.logs.where('status').equals('pending').toArray();
  for (const log of pending) {
    try {
      await fetch('/api/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: log.action, payload: log.payload }) });
      await db.logs.update(log.id!, { status: 'synced' });
    } catch {
      await db.logs.update(log.id!, { status: 'failed' });
    }
  }
}