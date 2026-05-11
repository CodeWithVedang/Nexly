import { useState } from 'react';
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
}