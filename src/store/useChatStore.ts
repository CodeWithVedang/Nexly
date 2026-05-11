import { create } from 'zustand';
import { getDB } from '../lib/idb';

export interface Message {
  id: string;
  peerId: string;
  text: string;
  timestamp: number;
  isSender: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

interface ChatStore {
  messages: Message[];
  activePeerId: string | null;
  setActivePeerId: (id: string | null) => void;
  loadMessages: (peerId: string) => Promise<void>;
  addMessage: (msg: Message) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  activePeerId: null,
  setActivePeerId: (id) => set({ activePeerId: id }),
  loadMessages: async (peerId) => {
    const db = await getDB();
    const all = await db.getAllFromIndex('messages', 'by-peer', peerId);
    set({ messages: all.sort((a, b) => a.timestamp - b.timestamp), activePeerId: peerId });
  },
  addMessage: async (msg) => {
    const db = await getDB();
    await db.put('messages', msg);
    
    // Only update live UI if the message belongs to the currently active chat
    if (get().activePeerId === msg.peerId) {
      set((state) => ({ messages: [...state.messages, msg] }));
    }
  }
}));