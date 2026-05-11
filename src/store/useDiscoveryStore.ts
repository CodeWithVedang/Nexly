/// <reference types="vite/client" />
import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';

export interface DiscoveredUser {
  id: string; // The Peer ID
  username: string;
  bio: string;
  hobbies: string[];
}

interface DiscoveryStore {
  activeUsers: DiscoveredUser[];
  ws: WebSocket | null;
  connectToDiscovery: () => void;
  disconnectFromDiscovery: () => void;
}

export const useDiscoveryStore = create<DiscoveryStore>((set, get) => ({
  activeUsers: [],
  ws: null,
  connectToDiscovery: () => {
    const profile = useAuthStore.getState().profile;
    if (!profile) return;

    if (get().ws) {
      get().ws?.close();
    }

    // Connect to local discovery server (in production this would be your deployed wss URL)
    const wsUrl = import.meta.env.VITE_WS_URL || `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Connected to Discovery Server');
      // Broadcast our presence, including our Peer ID (which is profile.id in this setup)
      ws.send(JSON.stringify({ 
        type: 'join', 
        user: {
          id: profile.id,
          username: profile.username,
          bio: profile.bio,
          hobbies: profile.hobbies
        } 
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'users_update') {
          // Filter out ourselves
          const others = data.users.filter((u: DiscoveredUser) => u.id !== profile.id);
          set({ activeUsers: others });
        }
      } catch(e) {}
    };

    ws.onclose = () => {
      console.log('Disconnected from Discovery Server');
      set({ ws: null, activeUsers: [] });
    };

    set({ ws });
  },
  disconnectFromDiscovery: () => {
    get().ws?.close();
    set({ ws: null, activeUsers: [] });
  }
}));
