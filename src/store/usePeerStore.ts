import { create } from 'zustand';
import Peer, { DataConnection } from 'peerjs';
import { useChatStore, Message } from './useChatStore';
import { useAuthStore } from './useAuthStore';
import { useContactsStore } from './useContactsStore';
import { v4 as uuidv4 } from 'uuid';

interface PeerStore {
  peer: Peer | null;
  connections: Record<string, DataConnection>;
  initPeer: (id: string) => void;
  connectToPeer: (id: string, metadata?: any) => Promise<DataConnection>;
  sendMessage: (peerId: string, text: string) => void;
  sendTyping: (peerId: string, isTyping: boolean) => void;
  disconnectAll: () => void;
}

export const usePeerStore = create<PeerStore>((set, get) => ({
  peer: null,
  connections: {},
  initPeer: (id) => {
    if (get().peer) return;
    console.log("Initializing Peer with ID:", id);
    const peer = new Peer(id, {
      config: {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      }
    });
    
    peer.on('connection', (conn) => {
      console.log("Incoming connection from:", conn.peer);
      
      // Handle incoming connection metadata
      if (conn.metadata && conn.metadata.type === 'request' && conn.metadata.profile) {
        const { contacts, addPendingRequest } = useContactsStore.getState();
        if (!contacts.find(c => c.id === conn.metadata.profile.id)) {
          console.log("Adding pending request from:", conn.metadata.profile.username);
          addPendingRequest(conn.metadata.profile);
        }
      }

      conn.on('open', () => {
        console.log("Incoming connection opened from:", conn.peer);
        set((state) => ({ connections: { ...state.connections, [conn.peer]: conn } }));
      });
      
      conn.on('data', (data: any) => {
        const chatStore = useChatStore.getState();
        if (data.type === 'typing') {
          chatStore.setTypingStatus(conn.peer, data.isTyping);
          return;
        }

        console.log("Received data from:", conn.peer, data);
        const msg: Message = {
          id: data.id || crypto.randomUUID(),
          peerId: conn.peer,
          text: data.text,
          timestamp: data.timestamp || Date.now(),
          isSender: false,
          status: 'sent'
        };
        chatStore.addMessage(msg);
      });

      conn.on('close', () => {
        console.log("Connection closed from:", conn.peer);
        set((state) => {
          const newConns = { ...state.connections };
          delete newConns[conn.peer];
          return { connections: newConns };
        });
      });
      
      conn.on('error', (err) => {
        console.error("Connection error:", err);
      });
    });

    peer.on('error', (err) => {
      console.error("Peer error:", err);
    });

    set({ peer });
  },
  connectToPeer: (id, extraMetadata = {}) => {
    return new Promise((resolve, reject) => {
      const { peer, connections } = get();
      if (!peer) {
        console.error("Cannot connect, peer not initialized");
        return reject("Peer not initialized");
      }
      if (connections[id] && connections[id].open) {
        console.log("Already connected to:", id);
        resolve(connections[id]);
        return;
      }

      console.log("Attempting to connect to:", id);
      const profile = useAuthStore.getState().profile;
      const metadata = {
        type: 'request',
        profile: profile ? {
          id: profile.id,
          username: profile.username,
          bio: profile.bio,
          hobbies: profile.hobbies
        } : null,
        ...extraMetadata
      };

      const conn = peer.connect(id, { metadata, reliable: true });
      
      conn.on('open', () => {
        console.log("Successfully connected to:", id);
        set((state) => ({ connections: { ...state.connections, [id]: conn } }));
        
        // Setup incoming data handler
        conn.on('data', (data: any) => {
          const chatStore = useChatStore.getState();
          if (data.type === 'typing') {
            chatStore.setTypingStatus(id, data.isTyping);
            return;
          }

          console.log("Received data (initiated connection) from:", id, data);
          const msg: Message = {
            id: data.id || crypto.randomUUID(),
            peerId: id,
            text: data.text,
            timestamp: data.timestamp || Date.now(),
            isSender: false,
            status: 'sent'
          };
          chatStore.addMessage(msg);
        });
        resolve(conn);
      });
      
      conn.on('error', (err) => {
        console.error("Connection error while connecting to:", id, err);
        reject(err);
      });
    });
  },
  sendMessage: (peerId, text) => {
    console.log("Sending message to:", peerId, "Text:", text);
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
      console.log("Connection is open, sending data...");
      conn.send({ type: 'message', text, id: msgId, timestamp });
    } else {
      console.log("Connection not open, attempting to connect first...");
      // Try to connect then send
      get().connectToPeer(peerId).then((newConn) => {
        console.log("Connected, sending data...");
        newConn.send({ type: 'message', text, id: msgId, timestamp });
      }).catch(e => console.error("Failed to connect for sending", e));
    }
  },
  sendTyping: (peerId, isTyping) => {
    const conn = get().connections[peerId];
    if (conn && conn.open) {
      conn.send({ type: 'typing', isTyping });
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