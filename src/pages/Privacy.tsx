import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-16 lg:px-32 xl:px-48">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 mb-8">
          Privacy Policy
        </h1>
        
        <div className="prose prose-invert prose-lg max-w-none space-y-6 text-muted-foreground">
          <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-foreground">1. Serverless & Privacy First</h2>
          <p>
            Nexly is fundamentally designed to protect your privacy. We do not use any centralized servers to store your messages, contacts, or profile. All data generated during your use of the application is securely written only to your device's local browser storage (IndexedDB).
          </p>

          <h2 className="text-2xl font-bold text-foreground">2. Ephemeral Connectivity</h2>
          <p>
            We use public MQTT and WebRTC signaling servers purely for the purpose of helping you discover other users and establish a direct connection. We do not log, record, or track these signaling packets. Once a peer-to-peer connection is established, the network traffic is routed directly between you and your peer using WebRTC DTLS-SRTP encryption.
          </p>

          <h2 className="text-2xl font-bold text-foreground">3. What Data Do We Collect?</h2>
          <p>
            <strong>None.</strong> We do not ask for an email, phone number, or password. Your profile consists of a temporary username and optional bio/hobbies that are broadcasted strictly to potential peers when you are actively using the application.
          </p>

          <h2 className="text-2xl font-bold text-foreground">4. Deleting Your Data</h2>
          <p>
            Because we do not store your data, "deleting your account" simply means you clear your browser's site data for Nexly or use the "Destroy Session" option. Doing so will instantly and irretrievably wipe your identity, contacts, and chat history.
          </p>
          
          <div className="mt-12 pt-8 border-t border-white/10">
            <a href="/" className="text-primary hover:underline font-bold">Return Home</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}