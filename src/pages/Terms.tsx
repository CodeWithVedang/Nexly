import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-16 lg:px-32 xl:px-48">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 mb-8">
          Terms & Conditions
        </h1>
        
        <div className="prose prose-invert prose-lg max-w-none space-y-6 text-muted-foreground">
          <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-foreground">1. Age Requirement</h2>
          <p>
            You must be at least 18 years of age to use Nexly. By using the platform, you represent and warrant that you meet this age requirement.
          </p>

          <h2 className="text-2xl font-bold text-foreground">2. Ephemeral Data & Local Storage</h2>
          <p>
            Nexly operates purely on a peer-to-peer (P2P) basis. We do not store your chats or contact lists on any central server. All data is stored locally in your browser (via IndexedDB). If you clear your browser data or uninstall the application, your account and all associated data will be permanently deleted and cannot be recovered.
          </p>

          <h2 className="text-2xl font-bold text-foreground">3. User Conduct</h2>
          <p>
            You agree not to use Nexly for any unlawful purpose or in any way that interrupts, damages, or impairs the service. Nexly is designed for private, encrypted communication, but users are responsible for the content they broadcast over the P2P network.
          </p>

          <h2 className="text-2xl font-bold text-foreground">4. Disclaimer of Warranties</h2>
          <p>
            The service is provided "as is" and "as available". Nexly makes no warranties, either express or implied, about the reliability or uptime of the P2P matching servers or the successful transmission of encrypted messages.
          </p>
          
          <div className="mt-12 pt-8 border-t border-white/10">
            <a href="/" className="text-primary hover:underline font-bold">Return Home</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
