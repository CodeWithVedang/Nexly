import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Lock, ShieldCheck, MessageSquare, Check, X, User } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { usePeerStore } from '../store/usePeerStore';
import { useDiscoveryStore } from '../store/useDiscoveryStore';
import { useContactsStore } from '../store/useContactsStore';

export default function Chat() {
  const { peerId } = useParams();
  const navigate = useNavigate();
  const { messages, loadMessages, setActivePeerId } = useChatStore();
  const { profile } = useAuthStore();
  const { initPeer, connectToPeer, sendMessage } = usePeerStore();
  const { activeUsers } = useDiscoveryStore();
  const { contacts, pendingRequests, loadContacts, acceptRequest, rejectRequest } = useContactsStore();
  
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile?.id) {
      initPeer(profile.id);
    }
  }, [profile?.id, initPeer]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  // Merge discovered user details with contact details
  const activePeer = activeUsers.find(u => u.id === peerId) || contacts.find(c => c.id === peerId);
  const displayName = activePeer?.username || 'Encrypted Peer';
  const displayInitials = displayName.slice(0, 2).toUpperCase();

  useEffect(() => {
    if (peerId) {
      loadMessages(peerId);
      setActivePeerId(peerId);
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
      <div className="h-screen max-w-4xl mx-auto border-x border-white/5 bg-background p-6 overflow-y-auto">
        <h1 className="text-3xl font-black mb-8 flex items-center gap-2">
          <MessageSquare className="text-primary" /> Chats & Connections
        </h1>

        {pendingRequests.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-primary">Pending Requests</h2>
            <div className="space-y-3">
              {pendingRequests.map(req => (
                <div key={req.id} className="p-4 rounded-2xl bg-white/5 border border-primary/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {req.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold">{req.username}</h3>
                      <p className="text-sm text-muted-foreground">{req.bio || 'Wants to connect'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => acceptRequest(req.id)}
                      className="p-2 bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white rounded-xl transition"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => rejectRequest(req.id)}
                      className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><User className="w-5 h-5"/> Your Contacts</h2>
          {contacts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-white/5 rounded-3xl border border-white/5">
              <p>No contacts yet.</p>
              <button 
                onClick={() => navigate('/discover')}
                className="mt-4 px-6 py-2 bg-primary/20 text-primary rounded-full font-bold hover:bg-primary hover:text-white transition"
              >
                Discover People
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map(contact => (
                <div 
                  key={contact.id} 
                  onClick={() => navigate(`/chat/${contact.id}`)}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 cursor-pointer transition flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {contact.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold">{contact.username}</h3>
                    <p className="text-sm text-muted-foreground">Tap to chat securely</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col max-w-4xl mx-auto border-x border-white/5 relative bg-background">
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