import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface NexlyDB extends DBSchema {
  profile: {
    key: string;
    value: any;
  };
  messages: {
    key: string;
    value: {
      id: string;
      peerId: string;
      text: string;
      timestamp: number;
      isSender: boolean;
      status: 'sending' | 'sent' | 'delivered' | 'read';
    };
    indexes: { 'by-peer': string };
  };
}

let dbPromise: Promise<IDBPDatabase<NexlyDB>> | null = null;

export const getDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB<NexlyDB>('nexly-db', 1, {
      upgrade(db) {
        db.createObjectStore('profile');
        const msgStore = db.createObjectStore('messages', { keyPath: 'id' });
        msgStore.createIndex('by-peer', 'peerId');
      },
    });
  }
  return dbPromise;
};

export const clearAllData = async () => {
  const db = await getDB();
  await db.clear('profile');
  await db.clear('messages');
  // Extra safety wipe
  localStorage.clear();
  sessionStorage.clear();
};