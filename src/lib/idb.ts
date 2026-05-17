import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Contact {
  id: string;
  username: string;
  bio?: string;
  hobbies?: string[];
  lastSeen?: number;
}

interface NexlyDB extends DBSchema {
  profile: {
    key: string;
    value: any;
  };
  contacts: {
    key: string;
    value: Contact;
  };
  pending_requests: {
    key: string;
    value: Contact;
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
    dbPromise = openDB<NexlyDB>('nexly-db', 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore('profile');
          const msgStore = db.createObjectStore('messages', { keyPath: 'id' });
          msgStore.createIndex('by-peer', 'peerId');
        }
        if (oldVersion < 2) {
          db.createObjectStore('contacts', { keyPath: 'id' });
          db.createObjectStore('pending_requests', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

export const clearAllData = async () => {
  const db = await getDB();
  await db.clear('profile');
  await db.clear('messages');
  await db.clear('contacts');
  await db.clear('pending_requests');
  // Extra safety wipe
  localStorage.clear();
  sessionStorage.clear();
};