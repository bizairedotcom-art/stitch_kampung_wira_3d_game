import type { LearnerBundleResponse, SyncQueueItem } from '@/types/api';
import type { LearnerProfile, ParentAccount } from '@/types/user';

const DB_NAME = 'kampung-wira-offline-db';
const DB_VERSION = 2;
const BUNDLE_STORE = 'bundles';
const QUEUE_STORE = 'syncQueue';
const AUTH_STORE = 'localAuth';

export interface StoredLocalParent extends ParentAccount {
  passwordSaltHash: string;
}

export interface LocalAuthSessionRecord {
  key: 'current_session';
  parentId: string;
  activeLearnerId: string | null;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not available'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(BUNDLE_STORE)) {
        db.createObjectStore(BUNDLE_STORE, { keyPath: 'learner.id' });
      }
      if (!db.objectStoreNames.contains(QUEUE_STORE)) {
        db.createObjectStore(QUEUE_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(AUTH_STORE)) {
        db.createObjectStore(AUTH_STORE, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// In-memory fallback when running in SSR / unit tests without IndexedDB
const memoryBundles = new Map<string, LearnerBundleResponse>();
const memoryAuth = new Map<string, unknown>();
const memoryQueue = new Map<string, SyncQueueItem>();

export async function saveOfflineBundle(bundle: LearnerBundleResponse): Promise<void> {
  memoryBundles.set(bundle.learner.id, bundle);
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(BUNDLE_STORE, 'readwrite');
      tx.objectStore(BUNDLE_STORE).put(bundle);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Memory fallback already updated
  }
}

export async function loadOfflineBundle(learnerId: string): Promise<LearnerBundleResponse | null> {
  try {
    const db = await openDb();
    const res = await new Promise<LearnerBundleResponse | null>((resolve, reject) => {
      const tx = db.transaction(BUNDLE_STORE, 'readonly');
      const req = tx.objectStore(BUNDLE_STORE).get(learnerId);
      req.onsuccess = () => resolve((req.result as LearnerBundleResponse | undefined) ?? null);
      req.onerror = () => reject(req.error);
    });
    if (res) {
      memoryBundles.set(learnerId, res);
      return res;
    }
  } catch {
    // Fall back to memory map
  }
  return memoryBundles.get(learnerId) ?? null;
}

export async function listBundlesByParent(parentId: string): Promise<LearnerProfile[]> {
  try {
    const db = await openDb();
    const all = await new Promise<LearnerBundleResponse[]>((resolve, reject) => {
      const tx = db.transaction(BUNDLE_STORE, 'readonly');
      const req = tx.objectStore(BUNDLE_STORE).getAll();
      req.onsuccess = () => resolve((req.result as LearnerBundleResponse[]) || []);
      req.onerror = () => reject(req.error);
    });
    return all.filter((b) => b.learner.parentId === parentId).map((b) => b.learner);
  } catch {
    return Array.from(memoryBundles.values())
      .filter((b) => b.learner.parentId === parentId)
      .map((b) => b.learner);
  }
}

export async function putLocalAuthRecord<T>(key: string, value: T): Promise<void> {
  memoryAuth.set(key, value);
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(AUTH_STORE, 'readwrite');
      tx.objectStore(AUTH_STORE).put({ key, value });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Memory fallback already updated
  }
}

export async function getLocalAuthRecord<T>(key: string): Promise<T | null> {
  try {
    const db = await openDb();
    const record = await new Promise<{ key: string; value: T } | undefined>((resolve, reject) => {
      const tx = db.transaction(AUTH_STORE, 'readonly');
      const req = tx.objectStore(AUTH_STORE).get(key);
      req.onsuccess = () => resolve(req.result as { key: string; value: T } | undefined);
      req.onerror = () => reject(req.error);
    });
    if (record) {
      memoryAuth.set(key, record.value);
      return record.value;
    }
  } catch {
    // Fall back to memory map
  }
  return (memoryAuth.get(key) as T | undefined) ?? null;
}

export async function deleteLocalAuthRecord(key: string): Promise<void> {
  memoryAuth.delete(key);
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(AUTH_STORE, 'readwrite');
      tx.objectStore(AUTH_STORE).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Memory fallback already updated
  }
}

export async function enqueueSyncItem(item: SyncQueueItem): Promise<void> {
  memoryQueue.set(item.id, item);
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(QUEUE_STORE, 'readwrite');
      tx.objectStore(QUEUE_STORE).put(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Graceful fallback
  }
}

export async function listSyncQueue(learnerId?: string): Promise<SyncQueueItem[]> {
  try {
    const db = await openDb();
    const items = await new Promise<SyncQueueItem[]>((resolve, reject) => {
      const tx = db.transaction(QUEUE_STORE, 'readonly');
      const req = tx.objectStore(QUEUE_STORE).getAll();
      req.onsuccess = () => resolve((req.result as SyncQueueItem[]) || []);
      req.onerror = () => reject(req.error);
    });
    return learnerId ? items.filter((i) => i.learnerId === learnerId) : items;
  } catch {
    const items = Array.from(memoryQueue.values());
    return learnerId ? items.filter((i) => i.learnerId === learnerId) : items;
  }
}

export async function removeSyncedItems(ids: string[]): Promise<void> {
  if (!ids.length) return;
  for (const id of ids) memoryQueue.delete(id);
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(QUEUE_STORE, 'readwrite');
      const store = tx.objectStore(QUEUE_STORE);
      for (const id of ids) store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Graceful fallback
  }
}
