import React, { useState } from 'react';
import { LayoutDashboard, Users, Target, CheckSquare, Calendar, Mail, BarChart3, Settings, Zap, Link, Sparkles, Menu, X, Building, ChevronDown, Check, UserPlus, Cog } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useOrganization } from '../contexts/OrganizationContext';
import { authService } from '../services/authService';
import type { View } from '../App';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOrganizations, setShowOrganizations] = useState(false);
  const { t } = useLanguage();
  const { currentOrganization, organizations } = useOrganization();
  
  // Get user data from auth service
  const currentUser = authService.getStoredUser();
  const userDisplayName = authService.getUserDisplayName();
  const userInitials = authService.getUserInitials();

  const menuItems = [
    { id: 'dashboard' as View, label: t('dashboard'), icon: LayoutDashboard },
    { id: 'contacts' as View, label: t('contacts'), icon: Users },
    { id: 'opportunities' as View, label: t('opportunities'), icon: Target },
    { id: 'tasks' as View, label: t('tasks'), icon: CheckSquare },
    { id: 'calendar' as View, label: t('calendar'), icon: Calendar },
    { id: 'email' as View, label: t('email'), icon: Mail },
    { id: 'analytics' as View, label: t('analytics'), icon: BarChart3 },
    { id: 'integrations' as View, label: t('integrations'), icon: Link },
  ];

  const handleNavigation = (viewId: View) => {
    console.log(`Clicking on: ${viewId}`);
    onViewChange(viewId);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'text-yellow-500';
      case 'admin':
        return 'text-blue-500';
      case 'member':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      case 'professional':
        return 'bg-blue-100 text-blue-800';
      case 'starter':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 bg-slate-900 text-white p-3 rounded-xl shadow-lg hover:bg-slate-800 transition-colors"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-72 
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white 
        flex flex-col overflow-hidden
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent pointer-events-none"></div>
        
        {/* Logo */}
        <div className="relative p-6 lg:p-8 border-b border-slate-700/50">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-3 shadow-2xl">
                <Zap size={28} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-1">
                <Sparkles size={12} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">GDPilia</h1>
              <p className="text-sm text-slate-400 font-medium">CRM Alimenté par IA</p>
            </div>
          </div>
        </div>

        {/* Organization Selector */}
        <div className="relative p-4 lg:p-6 border-b border-slate-700/50">
          {currentOrganization ? (
            <div className="w-full p-3 rounded-xl bg-slate-800/50">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl p-2">
                  <span className="text-white font-bold text-sm">{currentOrganization.avatar}</span>
                </div>
                <div className="text-left flex-1">
                  <p className="text-white font-semibold text-sm truncate">{currentOrganization.name}</p>
                  <p className={`text-xs capitalize ${getRoleColor(currentOrganization.role || 'member')}`}>
                    {currentOrganization.role || 'member'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full p-3 rounded-xl bg-slate-800/50 border-2 border-dashed border-slate-600">
              <div className="text-center">
                <Building size={24} className="mx-auto text-slate-400 mb-2" />
                <p className="text-slate-400 text-sm">Aucune organisation</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 lg:p-6 space-y-2 relative z-10 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative z-20 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105' 
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:transform hover:scale-105'
                }`}
                style={{ pointerEvents: 'auto' }}
              >
                <div className="relative">
                  <Icon size={22} className={`transition-all duration-300 ${isActive ? 'drop-shadow-lg' : ''}`} />
                  {isActive && (
                    <div className="absolute inset-0 bg-white/20 rounded-lg blur-xl"></div>
                  )}
                </div>
                <span className="font-semibold text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Settings & User */}
        <div className="relative p-4 lg:p-6 border-t border-slate-700/50 space-y-4 z-10">
          <button 
            onClick={() => handleNavigation('organization-management')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeView === 'organization-management'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:transform hover:scale-105'
            }`}
          >
            <Cog size={22} />
            <span className="font-semibold text-sm">Organisation</span>
            {activeView === 'organization-management' && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </button>

          <button 
            onClick={() => handleNavigation('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeView === 'settings'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:transform hover:scale-105'
            }`}
          >
            <Settings size={22} />
            <span className="font-semibold text-sm">{t('settings')}</span>
            {activeView === 'settings' && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </button>
          
          {/* User Profile */}
          <div className="glass-effect rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl p-2 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{userInitials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{userDisplayName}</p>
                <p className="text-slate-400 text-xs truncate">{currentUser?.email || currentOrganization?.name}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent pointer-events-none"></div>
      </div>
    </>
  );
};

export default Sidebar;