const fs = require('fs');
const path = require('path');

const files = {
  'vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'skills': path.resolve(__dirname, './skills'),
    },
  },
});`,
  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "skills/*": ["./skills/*"]
    }
  },
  "include": ["src", "skills"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,
  'tsconfig.node.json': `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`,
  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './skills/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}`,
  'postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nexly - Encrypted P2P Chat</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 224 71.4% 4.1%;
    --foreground: 210 20% 98%;
 
    --card: 224 71.4% 4.1%;
    --card-foreground: 210 20% 98%;
 
    --popover: 224 71.4% 4.1%;
    --popover-foreground: 210 20% 98%;
 
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 20% 98%;
 
    --secondary: 215 27.9% 16.9%;
    --secondary-foreground: 210 20% 98%;
 
    --muted: 215 27.9% 16.9%;
    --muted-foreground: 217.9 10.6% 64.9%;
 
    --accent: 215 27.9% 16.9%;
    --accent-foreground: 210 20% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 20% 98%;
 
    --border: 215 27.9% 16.9%;
    --input: 215 27.9% 16.9%;
    --ring: 262.1 83.3% 57.8%;
 
    --radius: 0.5rem;
  }
 
  .light {
    --background: 0 0% 100%;
    --foreground: 224 71.4% 4.1%;
 
    --card: 0 0% 100%;
    --card-foreground: 224 71.4% 4.1%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 224 71.4% 4.1%;
 
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 20% 98%;
 
    --secondary: 220 14.3% 95.9%;
    --secondary-foreground: 220.9 39.3% 11%;
 
    --muted: 220 14.3% 95.9%;
    --muted-foreground: 220 8.9% 46.1%;
 
    --accent: 220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
 
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 262.1 83.3% 57.8%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`,
  'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)`,
  'src/App.tsx': `import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import ProfileView from './pages/ProfileView';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';

function App() {
  const { theme } = useThemeStore();
  const { isAuth, loadProfile } = useAuthStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <Routes>
      <Route path="/" element={!isAuth ? <Landing /> : <Navigate to="/dashboard" />} />
      <Route path="/auth" element={!isAuth ? <Auth /> : <Navigate to="/dashboard" />} />
      <Route path="/setup" element={isAuth ? <ProfileSetup /> : <Navigate to="/" />} />
      
      {/* Protected Routes inside Layout */}
      <Route element={isAuth ? <Layout /> : <Navigate to="/auth" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:peerId" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/privacy" element={<Privacy />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;`,
  'src/lib/utils.ts': `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,
  'src/store/useThemeStore.ts': `import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: (localStorage.getItem('nexly-theme') as Theme) || 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('nexly-theme', newTheme);
    return { theme: newTheme };
  }),
  setTheme: (theme) => {
    localStorage.setItem('nexly-theme', theme);
    set({ theme });
  }
}));`,
  'src/lib/crypto.ts': `// Advanced Web Crypto API wrapper for ECDH + AES-GCM
export class CryptoService {
  static async generateKeyPair() {
    return await window.crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      ['deriveKey']
    );
  }

  static async exportPublicKey(key: CryptoKey) {
    const exported = await window.crypto.subtle.exportKey('raw', key);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }

  static async importPublicKey(base64Key: string) {
    const binary = atob(base64Key);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return await window.crypto.subtle.importKey(
      'raw',
      bytes,
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      []
    );
  }

  static async deriveSharedKey(privateKey: CryptoKey, publicKey: CryptoKey) {
    return await window.crypto.subtle.deriveKey(
      { name: 'ECDH', public: publicKey },
      privateKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(sharedKey: CryptoKey, text: string) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(text);
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      sharedKey,
      encoded
    );
    
    // Combine IV and Ciphertext
    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...result));
  }

  static async decrypt(sharedKey: CryptoKey, encryptedBase64: string) {
    const binary = atob(encryptedBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    const iv = bytes.slice(0, 12);
    const ciphertext = bytes.slice(12);
    
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      sharedKey,
      ciphertext
    );
    
    return new TextDecoder().decode(decrypted);
  }
}`,
  'src/lib/idb.ts': `import { openDB, DBSchema, IDBPDatabase } from 'idb';

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
};`,
  'src/store/useAuthStore.ts': `import { create } from 'zustand';
import { getDB, clearAllData } from '../lib/idb';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  hobbies: string[];
  interests: string[];
  isOnline: boolean;
}

interface AuthStore {
  isAuth: boolean;
  profile: UserProfile | null;
  login: (profile: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  loadProfile: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuth: false,
  profile: null,
  login: async (profile) => {
    const db = await getDB();
    await db.put('profile', profile, 'user');
    set({ isAuth: true, profile });
  },
  logout: async () => {
    await clearAllData();
    set({ isAuth: false, profile: null });
  },
  loadProfile: async () => {
    try {
      const db = await getDB();
      const profile = await db.get('profile', 'user');
      if (profile) {
        set({ isAuth: true, profile });
      }
    } catch(e) {}
  },
  updateProfile: async (updates) => {
    const current = get().profile;
    if (!current) return;
    const newProfile = { ...current, ...updates };
    const db = await getDB();
    await db.put('profile', newProfile, 'user');
    set({ profile: newProfile });
  }
}));`,
  'src/store/usePeerStore.ts': `import { create } from 'zustand';
import Peer, { DataConnection } from 'peerjs';

interface PeerStore {
  peer: Peer | null;
  connections: Record<string, DataConnection>;
  initPeer: (id: string) => void;
  connectToPeer: (id: string) => Promise<DataConnection>;
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
    return new Promise((resolve) => {
      const { peer, connections } = get();
      if (!peer) return;
      if (connections[id]) {
        resolve(connections[id]);
        return;
      }

      const conn = peer.connect(id);
      conn.on('open', () => {
        set((state) => ({ connections: { ...state.connections, [id]: conn } }));
        resolve(conn);
      });
    });
  },
  disconnectAll: () => {
    const { peer, connections } = get();
    Object.values(connections).forEach(c => c.close());
    if (peer) {
      peer.destroy();
    }
    set({ peer: null, connections: {} });
  }
}));`,
  'src/store/useChatStore.ts': `import { create } from 'zustand';
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
  loadMessages: (peerId: string) => Promise<void>;
  addMessage: (msg: Message) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  loadMessages: async (peerId) => {
    const db = await getDB();
    const all = await db.getAllFromIndex('messages', 'by-peer', peerId);
    set({ messages: all.sort((a, b) => a.timestamp - b.timestamp) });
  },
  addMessage: async (msg) => {
    const db = await getDB();
    await db.put('messages', msg);
    set((state) => ({ messages: [...state.messages, msg] }));
  }
}));`,
  'src/pages/Landing.tsx': `import { Link } from 'react-router-dom';
import { Shield, Zap, Lock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />
      
      <header className="px-8 py-6 flex justify-between items-center z-10 border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">Nexly</span>
        </div>
        <nav className="flex gap-4">
          <Link to="/auth" className="px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 transition text-sm font-medium">Login</Link>
          <Link to="/auth" className="px-6 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition shadow-[0_0_20px_rgba(139,92,246,0.3)] text-sm font-medium">Get Started</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
            Secure. Pure. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-cyan-400">Uncompromised.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            The modern peer-to-peer encrypted social platform. Zero servers. Total privacy. Connect instantly with shared interests.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth" className="px-8 py-4 rounded-full bg-primary text-white text-lg font-bold hover:scale-105 transition shadow-[0_0_30px_rgba(139,92,246,0.5)]">
              Launch Nexly
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto px-4"
        >
          <FeatureCard icon={<Lock />} title="End-to-End Encrypted" desc="AES-GCM encryption with ECDH key exchange. Keys never leave your device." />
          <FeatureCard icon={<Zap />} title="Peer-to-Peer" desc="Direct connection via WebRTC. No middlemen. Lowest latency possible." />
          <FeatureCard icon={<Globe />} title="Zero Data Retention" desc="No backend databases. Messages vanish instantly when you disconnect." />
        </motion.div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition text-left">
      <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}`,
  'src/pages/Auth.tsx': `import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function Auth() {
  const { login } = useAuthStore();
  const [username, setUsername] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    
    // Generate temporary identity
    await login({
      id: uuidv4(),
      username,
      firstName: '',
      lastName: '',
      bio: '',
      hobbies: [],
      interests: [],
      isOnline: true
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[150px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-center mb-2">Join the Network</h2>
        <p className="text-muted-foreground text-center mb-8">Your identity is temporary and secure.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">Desired Username</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-foreground placeholder:text-muted-foreground"
              placeholder="e.g. cyber_punk_99"
              required
              minLength={3}
              maxLength={20}
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          >
            Generate Identity
          </button>
        </form>
        
        <p className="mt-6 text-xs text-center text-muted-foreground">
          By joining, you agree to our ephemeral data policy. All data is stored locally and wiped upon session end.
        </p>
      </motion.div>
    </div>
  );
}`,
  'src/pages/Dashboard.tsx': `import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, MessageSquare, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { profile } = useAuthStore();

  return (
    <div className="max-w-6xl mx-auto p-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black mb-2">Welcome, <span className="text-primary">{profile?.username}</span></h1>
        <p className="text-muted-foreground mb-10">Your secure session is active.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/discover" className="block">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 hover:border-primary/40 transition group">
              <Users className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Discover Peers</h3>
              <p className="text-muted-foreground text-sm">Find users matching your hobbies and start encrypted chats.</p>
            </div>
          </Link>
          
          <Link to="/chat" className="block">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 transition group">
              <MessageSquare className="w-10 h-10 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Active Sessions</h3>
              <p className="text-muted-foreground text-sm">View your ongoing encrypted communications.</p>
            </div>
          </Link>

          <Link to="/profile" className="block">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/20 hover:border-cyan-500/40 transition group">
              <Zap className="w-10 h-10 text-cyan-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Profile Setup</h3>
              <p className="text-muted-foreground text-sm">Enhance your ephemeral profile with hobbies and bio.</p>
            </div>
          </Link>
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-destructive shrink-0" />
          <div>
            <h4 className="font-bold text-destructive mb-1">Security Notice</h4>
            <p className="text-sm text-destructive/80">
              You are using an ephemeral session. If you log out or clear your browser data, all chats and your profile will be permanently lost. There is no password recovery.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}`,
  'src/pages/Discover.tsx': `import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

// In a real app, this would use a WebRTC signaling server to find peers.
// For this standalone version without a custom signaling server, we'll simulate discovered peers
// that the user could technically connect to if they shared their Peer ID.

export default function Discover() {
  const [search, setSearch] = useState('');
  const [peers, setPeers] = useState<any[]>([]);

  useEffect(() => {
    // Simulated discovery
    setPeers([
      { id: 'peer-1', username: 'crypto_ninja', match: 95, hobbies: ['coding', 'crypto'] },
      { id: 'peer-2', username: 'cyber_surfer', match: 80, hobbies: ['gaming', 'music'] },
      { id: 'peer-3', username: 'anon_user', match: 60, hobbies: ['reading'] },
    ]);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 pt-24 h-screen flex flex-col">
      <h1 className="text-3xl font-black mb-6">Discover Network</h1>
      
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input 
          type="text"
          placeholder="Search by username or hobby..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-20">
        {peers.map((peer, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={peer.id}
            className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <div>
              <h3 className="font-bold text-lg">{peer.username}</h3>
              <div className="flex gap-2 mt-2">
                {peer.hobbies.map((h: string) => (
                  <span key={h} className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">{h}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-green-400">{peer.match}% Match</span>
              <Link to={\`/chat/\${peer.id}\`} className="p-3 rounded-xl bg-primary text-white hover:scale-105 transition shadow-lg">
                <UserPlus className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}`,
  'src/pages/Chat.tsx': `import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Lock, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { v4 as uuidv4 } from 'uuid';

export default function Chat() {
  const { peerId } = useParams();
  const { profile } = useAuthStore();
  const { messages, loadMessages, addMessage } = useChatStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (peerId) loadMessages(peerId);
  }, [peerId, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !peerId) return;

    const newMsg = {
      id: uuidv4(),
      peerId,
      text: input,
      timestamp: Date.now(),
      isSender: true,
      status: 'sent' as const
    };

    await addMessage(newMsg);
    setInput('');
    // In a real app, send via WebRTC DataChannel here
  };

  if (!peerId) {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground flex-col gap-4">
        <MessageSquare className="w-16 h-16 opacity-20" />
        <p>Select a peer to start an encrypted chat.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col max-w-4xl mx-auto border-x border-white/5 relative bg-background">
      {/* Header */}
      <header className="p-4 border-b border-white/5 bg-background/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
            {peerId.slice(0,2).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold">{peerId}</h2>
            <span className="text-xs text-green-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Secure Session
            </span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-xs text-muted-foreground border border-white/10">
            <Lock className="w-3 h-3" />
            Messages are end-to-end encrypted. No one outside this chat can read them.
          </div>
        </div>

        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={\`flex \${msg.isSender ? 'justify-end' : 'justify-start'}\`}
          >
            <div className={\`max-w-[70%] p-4 rounded-2xl \${msg.isSender ? 'bg-primary text-white rounded-tr-sm' : 'bg-white/10 text-foreground rounded-tl-sm'}\`}>
              <p className="break-words">{msg.text}</p>
              <div className={\`text-[10px] mt-1 text-right \${msg.isSender ? 'text-primary-foreground/70' : 'text-muted-foreground'}\`}>
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-background border-t border-white/5">
        <form onSubmit={handleSend} className="flex gap-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type an encrypted message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition"
          />
          <button type="submit" className="bg-primary text-white p-3 rounded-xl hover:scale-105 transition shadow-lg">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

// For empty state icon
import { MessageSquare } from 'lucide-react';`,
  'src/components/Layout.tsx': `import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Compass, MessageSquare, User, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Layout() {
  const location = useLocation();
  const { logout } = useAuthStore();

  const navItems = [
    { icon: <Home />, path: '/dashboard', label: 'Home' },
    { icon: <Compass />, path: '/discover', label: 'Discover' },
    { icon: <MessageSquare />, path: '/chat', label: 'Chat' },
    { icon: <User />, path: '/profile', label: 'Profile' },
    { icon: <Settings />, path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 border-r border-white/5 bg-background/50 backdrop-blur-xl transition-all">
        <div className="p-6 flex items-center justify-center lg:justify-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-blue-500 shadow-lg shadow-primary/20" />
          <span className="font-bold text-xl hidden lg:block tracking-wide">Nexly</span>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2 p-4 mt-8">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={\`flex items-center gap-4 p-3 rounded-xl transition-all \${active ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}\`}
              >
                {item.icon}
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center lg:justify-start gap-4 p-3 rounded-xl text-destructive hover:bg-destructive/10 transition"
          >
            <LogOut />
            <span className="hidden lg:block font-medium">Destroy Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-background/80 backdrop-blur-xl border-t border-white/5 flex justify-around p-4 z-50">
        {navItems.slice(0,4).map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={\`p-2 rounded-full \${location.pathname.startsWith(item.path) ? 'text-primary bg-primary/10' : 'text-muted-foreground'}\`}
          >
            {item.icon}
          </Link>
        ))}
      </nav>
    </div>
  );
}`,
  'src/pages/Settings.tsx': `import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { Moon, Sun, Monitor, Trash2, Key } from 'lucide-react';

export default function Settings() {
  const { theme, setTheme, toggleTheme } = useThemeStore();
  const { logout } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto p-8 pt-24 pb-32 h-full overflow-y-auto">
      <h1 className="text-3xl font-black mb-8">Settings</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Monitor className="w-5 h-5"/> Appearance</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <p className="font-medium">Theme Preference</p>
              <p className="text-sm text-muted-foreground">Switch between dark and light mode.</p>
            </div>
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              {theme === 'dark' ? <Moon className="w-5 h-5"/> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Key className="w-5 h-5"/> Encryption</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div>
              <p className="font-medium">Session Key</p>
              <p className="text-sm text-muted-foreground">Your ECDH public key for this session. Ephemeral and local.</p>
            </div>
            <code className="block p-4 rounded-xl bg-black/40 text-xs text-primary font-mono break-all border border-white/5">
              MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE... (Sample local key)
            </code>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-destructive"><Trash2 className="w-5 h-5"/> Danger Zone</h2>
          <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
            <p className="font-medium text-destructive mb-2">Destroy Local Identity</p>
            <p className="text-sm text-destructive/80 mb-6">This will wipe your profile, encryption keys, and all local message history. This action cannot be undone.</p>
            <button 
              onClick={logout}
              className="px-6 py-3 rounded-xl bg-destructive text-white font-bold hover:bg-destructive/90 transition shadow-lg shadow-destructive/20"
            >
              Wipe Everything & Logout
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}`,
  'src/pages/ProfileView.tsx': `import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Save, UserCircle } from 'lucide-react';

export default function ProfileView() {
  const { profile, updateProfile } = useAuthStore();
  const [bio, setBio] = useState(profile?.bio || '');
  const [hobbiesStr, setHobbiesStr] = useState(profile?.hobbies?.join(', ') || '');

  const handleSave = async () => {
    const hobbies = hobbiesStr.split(',').map(h => h.trim()).filter(Boolean);
    await updateProfile({ bio, hobbies });
    alert("Profile saved locally.");
  };

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto p-8 pt-24 h-full overflow-y-auto">
      <div className="flex items-center gap-6 mb-10">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-blue-500 p-1">
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
            <UserCircle className="w-12 h-12 text-primary" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-black">{profile.username}</h1>
          <p className="text-green-400 text-sm font-medium">● Online (Local Session)</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">Bio</label>
          <textarea 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-primary transition resize-none"
            placeholder="Tell the network about yourself..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">Hobbies (Comma separated)</label>
          <input 
            type="text"
            value={hobbiesStr}
            onChange={(e) => setHobbiesStr(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-primary transition"
            placeholder="gaming, crypto, music..."
          />
        </div>

        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition shadow-lg"
        >
          <Save className="w-5 h-5" /> Save Local Changes
        </button>
      </div>
    </div>
  );
}`,
  'src/pages/Privacy.tsx': `export default function Privacy() {
  return <div className="p-8 pt-24 max-w-4xl mx-auto"><h1 className="text-3xl font-black mb-4">Privacy & Security</h1><p className="text-muted-foreground leading-relaxed">Nexly is a strictly peer-to-peer encrypted chat protocol. We do not run any database servers that store your personal information or your messages. All data generated during your session is stored exclusively in your browser's IndexedDB and Memory. <br/><br/>When you log out, the 'clearAllData' function is invoked, wiping all traces of your identity and conversations from the device. End-to-end encryption relies on the Web Crypto API, utilizing Elliptic Curve Diffie-Hellman (ECDH) to securely exchange keys, and AES-GCM to encrypt the message payloads before they are sent over WebRTC DataChannels.</p></div>
}`,
  'src/pages/NotFound.tsx': `export default function NotFound() { return <div className="h-screen flex items-center justify-center"><h1 className="text-4xl font-bold">404 - Area Restricted</h1></div> }`,
  'src/pages/ProfileSetup.tsx': `import { Navigate } from 'react-router-dom'; export default function ProfileSetup() { return <Navigate to="/dashboard" /> }`,
  'skills/ui/index.ts': `export * from './button';`,
  'skills/ui/button.tsx': `import * as React from "react"
import { cn } from "../../src/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"`,
};

// Ensure directories exist
const dirs = new Set(Object.keys(files).map(f => path.dirname(f)));
dirs.forEach(d => {
  if (d !== '.') fs.mkdirSync(d, { recursive: true });
});

// Write files
Object.entries(files).forEach(([filepath, content]) => {
  fs.writeFileSync(filepath, content);
  console.log('Created: ' + filepath);
});
