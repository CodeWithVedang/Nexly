import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { Moon, Sun, Monitor, Trash2, Key } from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useThemeStore();
  const { logout } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto p-8 pt-24 pb-32 h-full overflow-y-auto">
      <h1 className="text-3xl font-black mb-8">Settings</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Monitor className="w-5 h-5"/> Appearance</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <p className="font-medium">Theme Preference</p>
              <p className="text-sm text-muted-foreground">Switch between dark and light mode.</p>
            </div>
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              {theme === 'dark' ? <Moon className="w-5 h-5"/> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Key className="w-5 h-5"/> Encryption</h2>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div>
              <p className="font-medium">Session Key</p>
              <p className="text-sm text-muted-foreground">Your ECDH public key for this session. Ephemeral and local.</p>
            </div>
            <code className="block p-4 rounded-xl bg-black/40 text-xs text-primary font-mono break-all border border-white/5">
              MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE... (Sample local key)
            </code>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-destructive"><Trash2 className="w-5 h-5"/> Danger Zone</h2>
          <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
            <p className="font-medium text-destructive mb-2">Destroy Local Identity</p>
            <p className="text-sm text-destructive/80 mb-6">This will wipe your profile, encryption keys, and all local message history. This action cannot be undone.</p>
            <button 
              onClick={logout}
              className="px-6 py-3 rounded-xl bg-destructive text-white font-bold hover:bg-destructive/90 transition shadow-lg shadow-destructive/20"
            >
              Wipe Everything & Logout
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}