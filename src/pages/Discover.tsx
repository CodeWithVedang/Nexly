import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo, AnimatePresence } from 'framer-motion';
import { UserPlus, Activity, X, Heart, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDiscoveryStore, DiscoveredUser } from '../store/useDiscoveryStore';
import { usePeerStore } from '../store/usePeerStore';
import { useContactsStore } from '../store/useContactsStore';

const SwipeCard = ({ 
  user, 
  onSwipe, 
  isTop 
}: { 
  user: DiscoveredUser, 
  onSwipe: (dir: 'left' | 'right', user: DiscoveredUser) => void,
  isTop: boolean
}) => {
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = async (_: any, info: PanInfo) => {
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe('right', user);
    } else if (info.offset.x < -swipeThreshold) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.3 } });
      onSwipe('left', user);
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  return (
    <motion.div
      className="absolute inset-0 w-full h-[60vh] max-h-[600px] min-h-[400px] bg-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing flex flex-col"
      style={{
        x,
        rotate,
        opacity: isTop ? 1 : 0.5,
        scale: isTop ? 1 : 0.95,
        zIndex: isTop ? 10 : 0
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background overlay matching tinder style */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/90 z-10 pointer-events-none" />

      {/* LIKE / NOPE Indicators */}
      <motion.div 
        style={{ opacity: likeOpacity }} 
        className="absolute top-12 left-8 border-4 border-green-500 text-green-500 font-black text-4xl px-4 py-2 rounded-xl rotate-[-15deg] z-20 uppercase tracking-wider"
      >
        LIKE
      </motion.div>
      <motion.div 
        style={{ opacity: nopeOpacity }} 
        className="absolute top-12 right-8 border-4 border-red-500 text-red-500 font-black text-4xl px-4 py-2 rounded-xl rotate-[15deg] z-20 uppercase tracking-wider"
      >
        NOPE
      </motion.div>

      {/* Image Placeholder (or actual image if present) */}
      <div className="w-full h-2/3 bg-primary/20 flex items-center justify-center relative">
        <UserPlus className="w-24 h-24 text-primary/50" />
      </div>

      {/* User Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
        <h2 className="text-3xl font-black mb-1">{user.username} <span className="font-normal text-xl text-white/80"></span></h2>
        {user.bio && <p className="text-white/80 line-clamp-2 mb-4">{user.bio}</p>}
        <div className="flex flex-wrap gap-2">
          {(user.hobbies || []).map((h: string) => (
            <span key={h} className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md">
              {h}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function Discover() {
  const navigate = useNavigate();
  const { activeUsers, connectToDiscovery, disconnectFromDiscovery } = useDiscoveryStore();
  const { connectToPeer } = usePeerStore();
  
  // Track users we have swiped away
  const [swipedIds, setSwipedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    connectToDiscovery();
    return () => {
      disconnectFromDiscovery();
    };
  }, [connectToDiscovery, disconnectFromDiscovery]);

  const handleConnect = async (user: DiscoveredUser) => {
    try {
      useContactsStore.getState().addContact(user);
      await connectToPeer(user.id);
      navigate(`/chat/${user.id}`);
    } catch (e) {
      console.error('Failed to connect to peer', e);
    }
  };

  const handleSwipe = (dir: 'left' | 'right', user: DiscoveredUser) => {
    setSwipedIds(prev => {
      const newSet = new Set(prev);
      newSet.add(user.id);
      return newSet;
    });

    if (dir === 'right') {
      // It's a match! Or at least an attempt to connect
      handleConnect(user);
    }
  };

  const currentUsers = activeUsers.filter(u => !swipedIds.has(u.id));

  return (
    <div className="max-w-md mx-auto p-4 pt-16 h-screen flex flex-col overflow-hidden relative">
      <div className="flex items-center justify-between mb-8 px-2">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">Discover</h1>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-bold shadow-[0_0_15px_rgba(var(--primary),0.3)]">
          <Activity className="w-4 h-4 animate-pulse" /> {currentUsers.length} Live
        </div>
      </div>
      
      <div className="flex-1 relative w-full flex items-center justify-center">
        {currentUsers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center p-8 bg-white/5 rounded-3xl border border-white/10 w-full"
          >
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-black mb-2">You're out of peers!</h3>
            <p className="text-muted-foreground mb-6">
              Wait for more people to join the ephemeral network.
            </p>
            <button 
              onClick={() => setSwipedIds(new Set())}
              className="px-6 py-3 rounded-full bg-primary/20 text-primary font-bold hover:bg-primary hover:text-white transition"
            >
              Rewind Swipes
            </button>
          </motion.div>
        ) : (
          <div className="relative w-full h-[60vh] max-h-[600px] min-h-[400px]">
            <AnimatePresence>
              {currentUsers.map((user, i) => (
                <SwipeCard 
                  key={user.id} 
                  user={user} 
                  onSwipe={handleSwipe} 
                  isTop={i === 0} 
                />
              )).reverse()}
            </AnimatePresence>
          </div>
        )}
      </div>

      {currentUsers.length > 0 && (
        <div className="flex justify-center items-center gap-6 mt-8 mb-4">
          <button 
            onClick={() => handleSwipe('left', currentUsers[0])}
            className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition transform hover:scale-110 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button 
            onClick={() => handleConnect(currentUsers[0])}
            className="w-12 h-12 rounded-full bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition transform hover:scale-110 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          <button 
            onClick={() => handleSwipe('right', currentUsers[0])}
            className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition transform hover:scale-110 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
          >
            <Heart className="w-8 h-8" fill="currentColor" />
          </button>
        </div>
      )}
    </div>
  );
}