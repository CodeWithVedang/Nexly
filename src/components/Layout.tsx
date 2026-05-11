import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Compass, MessageSquare, User, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { usePeerStore } from '../store/usePeerStore';
import { useEffect } from 'react';

export default function Layout() {
  const location = useLocation();
  const { logout, profile } = useAuthStore();
  const { initPeer } = usePeerStore();

  useEffect(() => {
    if (profile?.id) {
      initPeer(profile.id);
    }
    return () => {
      // In a real app we might not disconnect on unmount of Layout 
      // but keeping it running while authenticated is correct.
    };
  }, [profile?.id, initPeer]);

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
                className={`flex items-center gap-4 p-3 rounded-xl transition-all ${active ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`}
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
            className={`p-2 rounded-full ${location.pathname.startsWith(item.path) ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
          >
            {item.icon}
          </Link>
        ))}
      </nav>
    </div>
  );
}