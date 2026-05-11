import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Save, UserCircle } from 'lucide-react';

export default function ProfileView() {
  const { profile, updateProfile } = useAuthStore();
  const [bio, setBio] = useState(profile?.bio || '');
  const [hobbiesStr, setHobbiesStr] = useState(profile?.hobbies?.join(', ') || '');

  const handleSave = async () => {
    const hobbies = hobbiesStr.split(',').map(h => h.trim()).filter(Boolean);
    await updateProfile({ bio, hobbies });
    alert("Profile saved locally.");
  };

  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto p-8 pt-24 h-full overflow-y-auto">
      <div className="flex items-center gap-6 mb-10">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-blue-500 p-1">
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
            <UserCircle className="w-12 h-12 text-primary" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-black">{profile.username}</h1>
          <p className="text-green-400 text-sm font-medium">● Online (Local Session)</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">Bio</label>
          <textarea 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-primary transition resize-none"
            placeholder="Tell the network about yourself..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">Hobbies (Comma separated)</label>
          <input 
            type="text"
            value={hobbiesStr}
            onChange={(e) => setHobbiesStr(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-primary transition"
            placeholder="gaming, crypto, music..."
          />
        </div>

        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition shadow-lg"
        >
          <Save className="w-5 h-5" /> Save Local Changes
        </button>
      </div>
    </div>
  );
}