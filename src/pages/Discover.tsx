import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDiscoveryStore } from '../store/useDiscoveryStore';
import { usePeerStore } from '../store/usePeerStore';

export default function Discover() {
  const navigate = useNavigate();
  const { activeUsers, connectToDiscovery, disconnectFromDiscovery } = useDiscoveryStore();
  const { connectToPeer } = usePeerStore();
  const [manualPeerId, setManualPeerId] = useState('');

  useEffect(() => {
    connectToDiscovery();
    return () => {
      disconnectFromDiscovery();
    };
  }, [connectToDiscovery, disconnectFromDiscovery]);

  const handleConnect = (peerId: string) => {
    navigate(`/chat/${peerId}`);
  };

  const handleManualConnect = async () => {
    if (!manualPeerId) return;
    try {
      await connectToPeer(manualPeerId);
      handleConnect(manualPeerId);
    } catch (e) {
      console.error('Failed to connect to peer', e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 pt-24 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black">Discover Network</h1>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-bold">
          <Activity className="w-4 h-4 animate-pulse" /> Live
        </div>
      </div>
      
      <p className="text-muted-foreground mb-8 leading-relaxed">
        Active users currently online in the ephemeral network. Click connect to establish a direct, end-to-end encrypted peer channel.
      </p>

      {/* Manual connection input */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter Peer ID"
          value={manualPeerId}
          onChange={(e) => setManualPeerId(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none text-foreground"
        />
        <button
          onClick={handleManualConnect}
          className="px-4 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition"
        >
          Connect
        </button>
      </div>

      {activeUsers.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-white/5 rounded-3xl border border-white/10 p-12 text-center">
          <Activity className="w-12 h-12 mb-4 opacity-50" />
          <p className="font-medium text-lg">Looking for peers...</p>
          <p className="text-sm">You are currently the only one online. Invite a friend to join!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20 overflow-y-auto">
          {activeUsers.map((user, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={user.id}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-xl">{user.username}</h3>
                  {user.bio && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{user.bio}</p>}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {(user.hobbies || []).map((h) => (
                  <span key={h} className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                    {h}
                  </span>
                ))}
              </div>

              <div className="mt-auto">
                <button 
                  onClick={() => handleConnect(user.id)}
                  className="w-full py-3 rounded-xl bg-primary/20 text-primary font-bold hover:bg-primary hover:text-white transition shadow-lg flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" /> Connect Securely
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}