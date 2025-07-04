import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building, 
  Edit, 
  Save, 
  Settings, 
  LogOut, 
  CheckCircle,
  Star
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useOrganization } from '../contexts/OrganizationContext';
import { authService } from '../services/authService';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountSettings: () => void;
  onLogout: () => void;
  onStatsClick: (statType: string) => void;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  position: string;
  memberSince: string;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
  isOpen, 
  onClose, 
  onAccountSettings, 
  onLogout,
  onStatsClick 
}) => {
  const { t } = useLanguage();
  const { currentOrganization } = useOrganization();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Get current user data from auth service
  const currentUser = authService.getStoredUser();
  const userDisplayName = authService.getUserDisplayName();
  const userInitials = authService.getUserInitials();
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: currentUser?.name || userDisplayName,
    email: currentUser?.email || '',
    phone: '+33 1 23 45 67 89', // Default phone - you might want to add this to user model
    location: 'Paris, France', // Default location - you might want to add this to user model
    position: 'Utilisateur', // Default position - you might want to add this to user model
    memberSince: currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'Janvier 2024',
  });
  
  const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);

  const handleEditProfile = () => {
    setEditedProfile(userProfile);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    try {
      // Update the profile via auth service
      await authService.updateProfile({
        name: editedProfile.name,
        email: editedProfile.email,
      });
      
      setUserProfile(editedProfile);
      setIsEditingProfile(false);
      console.log('Profile saved:', editedProfile);
    } catch (error) {
      console.error('Failed to save profile:', error);
      // You might want to show an error message to the user
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(userProfile);
    setIsEditingProfile(false);
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

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'Entreprise';
      case 'professional':
        return 'Professionnel';
      case 'starter':
        return 'Débutant';
      default:
        return plan;
    }
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

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-xl">{userInitials}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{userProfile.name}</h2>
              <p className="text-blue-100">{userProfile.position}</p>
              <p className="text-blue-200 text-sm">{currentOrganization?.name}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Personal Information */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Informations Personnelles</h3>
              {!isEditingProfile ? (
                <button 
                  onClick={handleEditProfile}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg"
                >
                  <Edit size={16} />
                  <span className="text-sm font-medium">Modifier</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    <X size={16} />
                    <span className="text-sm font-medium">Annuler</span>
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors px-3 py-2 rounded-lg"
                  >
                    <Save size={16} />
                    <span className="text-sm font-medium">Enregistrer</span>
                  </button>
                </div>
              )}
            </div>

            {!isEditingProfile ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Mail size={20} className="text-blue-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900 truncate">{userProfile.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Phone size={20} className="text-green-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-medium text-gray-900 truncate">{userProfile.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <MapPin size={20} className="text-red-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600">Localisation</p>
                    <p className="font-medium text-gray-900 truncate">{userProfile.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Calendar size={20} className="text-purple-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600">Membre depuis</p>
                    <p className="font-medium text-gray-900 truncate">{userProfile.memberSince}</p>
                  </div>
                </div>
                {currentUser?.email_verified_at && (
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                    <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-600">Email vérifié</p>
                      <p className="font-medium text-green-700 text-sm">
                        {new Date(currentUser.email_verified_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Poste</label>
                  <input
                    type="text"
                    value={editedProfile.position}
                    onChange={(e) => setEditedProfile({ ...editedProfile, position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                  <input
                    type="text"
                    value={editedProfile.location}
                    onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Organization Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Organisation Actuelle</h3>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3">
                  <Building size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{currentOrganization?.name}</h4>
                  <p className="text-blue-600 font-medium capitalize">{currentOrganization?.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Plan</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPlanBadge(currentOrganization?.plan || '')}`}>
                    {getPlanLabel(currentOrganization?.plan || '')}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Membres</p>
                  <p className="font-medium text-gray-900">{currentOrganization?.memberCount}</p>
                </div>
              </div>
              {currentUser?.organisation_id && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-sm text-gray-600">ID Organisation</p>
                  <p className="font-mono text-sm text-gray-900">{currentUser.organisation_id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Statistiques Rapides</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onStatsClick('contacts')}
                className="text-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-all duration-300 group hover:shadow-lg transform hover:scale-105"
              >
                <div className="text-2xl font-bold text-green-600 group-hover:scale-110 transition-transform">156</div>
                <div className="text-sm text-gray-600">Contacts</div>
              </button>
              <button
                onClick={() => onStatsClick('opportunities')}
                className="text-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 group hover:shadow-lg transform hover:scale-105"
              >
                <div className="text-2xl font-bold text-blue-600 group-hover:scale-110 transition-transform">23</div>
                <div className="text-sm text-gray-600">Opportunités</div>
              </button>
              <button
                onClick={() => onStatsClick('tasks')}
                className="text-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-300 group hover:shadow-lg transform hover:scale-105"
              >
                <div className="text-2xl font-bold text-purple-600 group-hover:scale-110 transition-transform">12</div>
                <div className="text-sm text-gray-600">Tâches</div>
              </button>
              <button
                onClick={() => onStatsClick('appointments')}
                className="text-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all duration-300 group hover:shadow-lg transform hover:scale-105"
              >
                <div className="text-2xl font-bold text-orange-600 group-hover:scale-110 transition-transform">8</div>
                <div className="text-sm text-gray-600">Rendez-vous</div>
              </button>
            </div>
          </div>

          {/* Actions */}
          {!isEditingProfile && (
            <div className="space-y-3">
              <button 
                onClick={onAccountSettings}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Settings size={20} />
                <span>Paramètres du Compte</span>
              </button>
              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <LogOut size={20} />
                <span>Se Déconnecter</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;