import { create } from 'zustand';
import { getDB, Contact } from '../lib/idb';

interface ContactsStore {
  contacts: Contact[];
  pendingRequests: Contact[];
  loadContacts: () => Promise<void>;
  addContact: (contact: Contact) => Promise<void>;
  removeContact: (id: string) => Promise<void>;
  addPendingRequest: (request: Contact) => Promise<void>;
  acceptRequest: (id: string) => Promise<void>;
  rejectRequest: (id: string) => Promise<void>;
}

export const useContactsStore = create<ContactsStore>((set, get) => ({
  contacts: [],
  pendingRequests: [],
  loadContacts: async () => {
    const db = await getDB();
    const contacts = await db.getAll('contacts');
    const pendingRequests = await db.getAll('pending_requests');
    set({ contacts, pendingRequests });
  },
  addContact: async (contact) => {
    const db = await getDB();
    await db.put('contacts', contact);
    set((state) => ({ contacts: [...state.contacts.filter(c => c.id !== contact.id), contact] }));
  },
  removeContact: async (id) => {
    const db = await getDB();
    await db.delete('contacts', id);
    set((state) => ({ contacts: state.contacts.filter(c => c.id !== id) }));
  },
  addPendingRequest: async (request) => {
    const { contacts, pendingRequests } = get();
    // Don't add if already a contact
    if (contacts.find(c => c.id === request.id)) return;
    // Don't add if already pending
    if (pendingRequests.find(r => r.id === request.id)) return;
    
    const db = await getDB();
    await db.put('pending_requests', request);
    set((state) => ({ pendingRequests: [...state.pendingRequests, request] }));
  },
  acceptRequest: async (id) => {
    const request = get().pendingRequests.find(r => r.id === id);
    if (!request) return;
    
    const db = await getDB();
    await db.put('contacts', request);
    await db.delete('pending_requests', id);
    
    set((state) => ({
      contacts: [...state.contacts, request],
      pendingRequests: state.pendingRequests.filter(r => r.id !== id)
    }));
  },
  rejectRequest: async (id) => {
    const db = await getDB();
    await db.delete('pending_requests', id);
    set((state) => ({ pendingRequests: state.pendingRequests.filter(r => r.id !== id) }));
  }
}));
