import { Link } from 'react-router-dom';
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
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto px-4 w-full"
        >
          <FeatureCard icon={<Lock />} title="End-to-End Encrypted" desc="AES-GCM encryption with ECDH key exchange. Keys never leave your device." />
          <FeatureCard icon={<Zap />} title="Peer-to-Peer" desc="Direct connection via WebRTC. No middlemen. Lowest latency possible." />
          <FeatureCard icon={<Globe />} title="Zero Data Retention" desc="No backend databases. Messages vanish instantly when you disconnect." />
        </motion.div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground z-10 border-t border-white/5 bg-background/50 backdrop-blur-md">
        <div className="flex justify-center gap-6">
          <Link to="/privacy" className="hover:text-primary transition">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-primary transition">Terms & Conditions</Link>
        </div>
        <p className="mt-4">&copy; {new Date().getFullYear()} Nexly. All rights reserved.</p>
      </footer>
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
}