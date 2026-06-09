import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Page imports
import Home from './pages/Home';
import Worlds from './pages/Worlds';
import WorldDetail from './pages/WorldDetail';
import Sims from './pages/Sims';
import SimDetail from './pages/SimDetail';
import Families from './pages/Families';
import Relations from './pages/Relations';
import Statistics from './pages/Statistics';
import Navbar from './components/Navbar';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#A3B95A]/30 border-t-[#A3B95A] rounded-full animate-spin" />
          <p className="text-[#A3B95A] font-heading text-sm tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar darkMode={darkMode} toggleDark={() => setDarkMode(!darkMode)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/worlds" element={<Worlds />} />
        <Route path="/worlds/:worldName" element={<WorldDetail />} />
        <Route path="/sims" element={<Sims />} />
        <Route path="/sims/:simName" element={<SimDetail />} />
        <Route path="/families" element={<Families />} />
        <Route path="/relations" element={<Relations />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;