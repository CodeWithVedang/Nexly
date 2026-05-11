import { useAuthStore } from '../store/useAuthStore';
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
}