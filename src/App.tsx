import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { OrganizationProvider } from './contexts/OrganizationContext';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Opportunities from './components/Opportunities';
import Tasks from './components/Tasks';
import Calendar from './components/Calendar';
import Email from './components/Email';
import Analytics from './components/Analytics';
import Integrations from './components/Integrations';
import Settings from './components/Settings';
import JoinOrganization from './components/JoinOrganization';
import { authService } from './services/authService';

export type View = 'dashboard' | 'contacts' | 'opportunities' | 'tasks' | 'calendar' | 'email' | 'analytics' | 'integrations' | 'settings' | 'join-organization';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = authService.isAuthenticated();
        if (isAuth) {
          // Verify token is still valid by getting user data
          const user = await authService.getCurrentUser();
          if (user) {
            setIsAuthenticated(true);
            console.log('User authenticated:', user);
            
            // Check if first time login
            if (authService.isFirstTimeLogin()) {
              console.log('First time login detected');
              // You can redirect to onboarding or show welcome message
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid tokens
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setActiveView('dashboard');
      setSearchTerm('');
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'contacts':
        return <Contacts searchTerm={searchTerm} />;
      case 'opportunities':
        return <Opportunities searchTerm={searchTerm} />;
      case 'tasks':
        return <Tasks searchTerm={searchTerm} />;
      case 'calendar':
        return <Calendar searchTerm={searchTerm} />;
      case 'email':
        return <Email searchTerm={searchTerm} />;
      case 'analytics':
        return <Analytics />;
      case 'integrations':
        return <Integrations />;
      case 'settings':
        return <Settings />;
      case 'join-organization':
        return <JoinOrganization searchTerm={searchTerm} />;
      default:
        return <Dashboard />;
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LanguageProvider>
        <LandingPage onLogin={handleLogin} />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <OrganizationProvider>
        <div className="min-h-screen bg-mesh flex">
          <Sidebar activeView={activeView} onViewChange={setActiveView} />
          <div className="flex-1 flex flex-col lg:ml-0">
            <Header 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm}
              activeView={activeView}
              onViewChange={setActiveView}
              onLogout={handleLogout}
            />
            <main className="flex-1 overflow-auto p-4 lg:p-6">
              <div className="max-w-7xl mx-auto">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </OrganizationProvider>
    </LanguageProvider>
  );
}

export default App;