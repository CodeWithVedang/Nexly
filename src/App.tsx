import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import ProfileView from './pages/ProfileView';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';

function App() {
  const { theme } = useThemeStore();
  const { isAuth, loadProfile } = useAuthStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <Routes>
      <Route path="/" element={!isAuth ? <Landing /> : <Navigate to="/dashboard" />} />
      <Route path="/auth" element={!isAuth ? <Auth /> : <Navigate to="/dashboard" />} />
      <Route path="/setup" element={isAuth ? <ProfileSetup /> : <Navigate to="/" />} />
      
      {/* Protected Routes inside Layout */}
      <Route element={isAuth ? <Layout /> : <Navigate to="/auth" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:peerId" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/privacy" element={<Privacy />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;