import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Lock, ShieldCheck } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { usePeerStore } from '../store/usePeerStore';
import { useDiscoveryStore } from '../store/useDiscoveryStore';
export default function Chat() {
  const { peerId } = useParams();
  const { messages, loadMessages, setActivePeerId } = useChatStore();
  const { activeUsers } = useDiscoveryStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const { connectToPeer, sendMessage } = usePeerStore();

  const activePeer = activeUsers.find(u => u.id === peerId);
  const displayName = activePeer?.username || 'Encrypted Peer';
  const displayInitials = displayName.slice(0,2).toUpperCase();

  useEffect(() => {
    if (peerId) {
      loadMessages(peerId);
      connectToPeer(peerId).catch(console.error);
    } else {
      setActivePeerId(null);
    }
    return () => setActivePeerId(null);
  }, [peerId, loadMessages, connectToPeer, setActivePeerId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !peerId) return;

    sendMessage(peerId, input);
    setInput('');
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
            {displayInitials}
          </div>
          <div>
            <h2 className="font-bold">{displayName}</h2>
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
            className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] p-4 rounded-2xl ${msg.isSender ? 'bg-primary text-white rounded-tr-sm' : 'bg-white/10 text-foreground rounded-tl-sm'}`}>
              <p className="break-words">{msg.text}</p>
              <div className={`text-[10px] mt-1 text-right ${msg.isSender ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
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
import { MessageSquare } from 'lucide-react';