import { create } from 'zustand';
import Peer, { DataConnection } from 'peerjs';
import { useChatStore } from './useChatStore';
import { v4 as uuidv4 } from 'uuid';

interface PeerStore {
  peer: Peer | null;
  connections: Record<string, DataConnection>;
  initPeer: (id: string) => void;
  connectToPeer: (id: string) => Promise<DataConnection>;
  sendMessage: (peerId: string, text: string) => void;
  disconnectAll: () => void;
}

export const usePeerStore = create<PeerStore>((set, get) => ({
  peer: null,
  connections: {},
  initPeer: (id) => {
    if (get().peer) return;
    const peer = new Peer(id, {
      config: {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      }
    });
    
    peer.on('connection', (conn) => {
      set((state) => ({ connections: { ...state.connections, [conn.peer]: conn } }));
      
      conn.on('data', (data) => {
        // Handle incoming message
        const payload = data as { text: string; id: string; timestamp: number };
        useChatStore.getState().addMessage({
          id: payload.id || uuidv4(),
          peerId: conn.peer,
          text: payload.text,
          timestamp: payload.timestamp || Date.now(),
          isSender: false,
          status: 'delivered'
        });
      });

      conn.on('close', () => {
        set((state) => {
          const newConns = { ...state.connections };
          delete newConns[conn.peer];
          return { connections: newConns };
        });
      });
    });

    set({ peer });
  },
  connectToPeer: (id) => {
    return new Promise((resolve, reject) => {
      const { peer, connections } = get();
      if (!peer) return reject("Peer not initialized");
      if (connections[id]) {
        resolve(connections[id]);
        return;
      }

      const conn = peer.connect(id);
      conn.on('open', () => {
        set((state) => ({ connections: { ...state.connections, [id]: conn } }));
        resolve(conn);
      });
      
      conn.on('data', (data) => {
        const payload = data as { text: string; id: string; timestamp: number };
        useChatStore.getState().addMessage({
          id: payload.id || uuidv4(),
          peerId: id,
          text: payload.text,
          timestamp: payload.timestamp || Date.now(),
          isSender: false,
          status: 'delivered'
        });
      });
      
      conn.on('error', (err) => {
        console.error("Connection error:", err);
      });
    });
  },
  sendMessage: (peerId, text) => {
    const conn = get().connections[peerId];
    const msgId = uuidv4();
    const timestamp = Date.now();
    
    // Add to local UI instantly
    useChatStore.getState().addMessage({
      id: msgId,
      peerId,
      text,
      timestamp,
      isSender: true,
      status: 'sent'
    });

    // Send over WebRTC
    if (conn && conn.open) {
      conn.send({ text, id: msgId, timestamp });
    } else {
      // Try to connect then send
      get().connectToPeer(peerId).then((newConn) => {
        newConn.send({ text, id: msgId, timestamp });
      }).catch(e => console.error("Failed to connect for sending", e));
    }
  },
  disconnectAll: () => {
    const { peer, connections } = get();
    Object.values(connections).forEach(c => c.close());
    if (peer) {
      peer.destroy();
    }
    set({ peer: null, connections: {} });
  }
}));