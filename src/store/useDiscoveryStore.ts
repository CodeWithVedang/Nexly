/// <reference types="vite/client" />
import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import mqtt from 'mqtt';

export interface DiscoveredUser {
  id: string; // The Peer ID
  username: string;
  bio: string;
  hobbies: string[];
  lastSeen?: number;
}

interface DiscoveryStore {
  activeUsers: DiscoveredUser[];
  client: mqtt.MqttClient | null;
  connectToDiscovery: () => void;
  disconnectFromDiscovery: () => void;
}

const TOPIC = 'nexly/discovery/users';

export const useDiscoveryStore = create<DiscoveryStore>((set, get) => ({
  activeUsers: [],
  client: null,
  connectToDiscovery: () => {
    const profile = useAuthStore.getState().profile;
    if (!profile) return;

    if (get().client) {
      get().client?.end();
    }

    // Connect to public MQTT broker over WebSockets
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

    client.on('connect', () => {
      console.log('Connected to Public Discovery Network');
      client.subscribe(TOPIC);
      
      // Broadcast our presence every 10 seconds
      const broadcastPresence = () => {
        if (client.connected) {
          client.publish(TOPIC, JSON.stringify({ 
            id: profile.id,
            username: profile.username,
            bio: profile.bio,
            hobbies: profile.hobbies,
            lastSeen: Date.now()
          }));
        }
      };

      broadcastPresence();
      const interval = setInterval(broadcastPresence, 10000);
      
      // Cleanup interval on disconnect
      client.on('close', () => clearInterval(interval));
    });

    client.on('message', (topic, message) => {
      if (topic === TOPIC) {
        try {
          const user: DiscoveredUser = JSON.parse(message.toString());
          if (user.id === profile.id) return; // Ignore self
          
          set((state) => {
            const existing = state.activeUsers.findIndex(u => u.id === user.id);
            const now = Date.now();
            let newUsers = [...state.activeUsers];
            
            if (existing >= 0) {
              newUsers[existing] = { ...user, lastSeen: now };
            } else {
              newUsers.push({ ...user, lastSeen: now });
            }
            
            // Clean up stale users (not seen in 30 seconds)
            newUsers = newUsers.filter(u => now - (u.lastSeen || now) < 30000);
            
            return { activeUsers: newUsers };
          });
        } catch(e) {}
      }
    });

    client.on('close', () => {
      console.log('Disconnected from Discovery Network');
      set({ client: null });
    });

    set({ client });
  },
  disconnectFromDiscovery: () => {
    get().client?.end();
    set({ client: null, activeUsers: [] });
  }
}));
