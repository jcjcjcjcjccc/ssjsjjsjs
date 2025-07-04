import React, { useState } from 'react';
import { 
  Building, 
  Search, 
  Users, 
  Crown, 
  Shield, 
  User, 
  Plus, 
  Send, 
  Check, 
  X, 
  Clock, 
  Mail, 
  Globe, 
  MapPin, 
  Star,
  Filter,
  ArrowRight,
  Eye,
  UserPlus,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useOrganization, Organization } from '../contexts/OrganizationContext';

interface JoinOrganizationProps {
  searchTerm: string;
}

interface PublicOrganization {
  id: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  memberCount: number;
  plan: 'starter' | 'professional' | 'enterprise';
  avatar: string;
  isPublic: boolean;
  website?: string;
  email?: string;
  rating: number;
  verified: boolean;
  tags: string[];
  joinRequests: number;
  activeMembers: number;
  foundedYear: number;
}

interface JoinRequest {
  id: string;
  organizationId: string;
  organizationName: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  message: string;
  responseMessage?: string;
  responseDate?: string;
}

interface Invitation {
  id: string;
  organizationId: string;
  organizationName: string;
  organizationAvatar: string;
  inviterName: string;
  inviterRole: string;
  role: 'admin' | 'member';
  message: string;
  inviteDate: string;
  expiryDate: string;
  status: 'pending' | 'accepted' | 'declined';
}

const JoinOrganization: React.FC<JoinOrganizationProps> = ({ searchTerm }) => {
  const { t } = useLanguage();
  const { addOrganization, setCurrentOrganization } = useOrganization();
  
  const [activeTab, setActiveTab] = useState<'discover' | 'requests' | 'invitations'>('discover');
  const [selectedOrganization, setSelectedOrganization] = useState<PublicOrganization | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const [publicOrganizations] = useState<PublicOrganization[]>([
    {
      id: 'org-1',
      name: 'TechCorp Solutions',
      description: 'Leader en solutions technologiques innovantes pour les entreprises modernes. Nous développons des logiciels sur mesure et des plateformes cloud.',
      industry: 'Technologie',
      location: 'Paris, France',
      memberCount: 156,
      plan: 'enterprise',
      avatar: 'TC',
      isPublic: true,
      website: 'https://techcorp-solutions.com',
      email: 'contact@techcorp-solutions.com',
      rating: 4.8,
      verified: true,
      tags: ['SaaS', 'Cloud', 'IA', 'Développement'],
      joinRequests: 23,
      activeMembers: 142,
      foundedYear: 2018,
    },
    {
      id: 'org-2',
      name: 'Digital Marketing Pro',
      description: 'Agence de marketing digital spécialisée dans la croissance des startups et PME. Expertise en SEO, publicité en ligne et stratégie de contenu.',
      industry: 'Marketing',
      location: 'Lyon, France',
      memberCount: 89,
      plan: 'professional',
      avatar: 'DM',
      isPublic: true,
      website: 'https://digitalmarketingpro.fr',
      rating: 4.6,
      verified: true,
      tags: ['SEO', 'Publicité', 'Contenu', 'Analytics'],
      joinRequests: 15,
      activeMembers: 78,
      foundedYear: 2020,
    },
    {
      id: 'org-3',
      name: 'Green Energy Innovations',
      description: 'Pionnier dans les solutions d\'énergie renouvelable et la technologie verte. Nous créons un avenir durable pour tous.',
      industry: 'Énergie',
      location: 'Marseille, France',
      memberCount: 234,
      plan: 'enterprise',
      avatar: 'GE',
      isPublic: true,
      website: 'https://greenenergy-innovations.com',
      email: 'info@greenenergy-innovations.com',
      rating: 4.9,
      verified: true,
      tags: ['Solaire', 'Éolien', 'Durable', 'Innovation'],
      joinRequests: 45,
      activeMembers: 198,
      foundedYear: 2015,
    },
    {
      id: 'org-4',
      name: 'FinTech Startup Hub',
      description: 'Incubateur et accélérateur pour les startups fintech. Nous aidons les entrepreneurs à révolutionner les services financiers.',
      industry: 'Finance',
      location: 'Toulouse, France',
      memberCount: 67,
      plan: 'professional',
      avatar: 'FS',
      isPublic: true,
      rating: 4.4,
      verified: false,
      tags: ['Blockchain', 'Paiements', 'Crypto', 'Innovation'],
      joinRequests: 31,
      activeMembers: 52,
      foundedYear: 2021,
    },
    {
      id: 'org-5',
      name: 'Healthcare Solutions',
      description: 'Solutions technologiques pour le secteur de la santé. Nous développons des outils pour améliorer les soins aux patients.',
      industry: 'Santé',
      location: 'Nice, France',
      memberCount: 123,
      plan: 'enterprise',
      avatar: 'HS',
      isPublic: true,
      website: 'https://healthcare-solutions.fr',
      email: 'contact@healthcare-solutions.fr',
      rating: 4.7,
      verified: true,
      tags: ['Télémédecine', 'IA Médicale', 'Données', 'Innovation'],
      joinRequests: 18,
      activeMembers: 108,
      foundedYear: 2017,
    },
    {
      id: 'org-6',
      name: 'Creative Design Studio',
      description: 'Studio de design créatif spécialisé dans l\'identité de marque, le design UX/UI et les campagnes visuelles innovantes.',
      industry: 'Design',
      location: 'Bordeaux, France',
      memberCount: 45,
      plan: 'starter',
      avatar: 'CD',
      isPublic: true,
      rating: 4.5,
      verified: false,
      tags: ['Branding', 'UX/UI', 'Graphisme', 'Créativité'],
      joinRequests: 12,
      activeMembers: 38,
      foundedYear: 2022,
    },
  ]);

  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([
    {
      id: 'req-1',
      organizationId: 'org-1',
      organizationName: 'TechCorp Solutions',
      status: 'pending',
      requestDate: '2024-01-15',
      message: 'Je suis développeur full-stack avec 5 ans d\'expérience et je souhaiterais rejoindre votre équipe innovante.',
    },
    {
      id: 'req-2',
      organizationId: 'org-2',
      organizationName: 'Digital Marketing Pro',
      status: 'approved',
      requestDate: '2024-01-10',
      message: 'Spécialiste en SEO et marketing de contenu, j\'aimerais contribuer à vos projets.',
      responseMessage: 'Bienvenue dans l\'équipe ! Nous sommes ravis de vous avoir parmi nous.',
      responseDate: '2024-01-12',
    },
    {
      id: 'req-3',
      organizationId: 'org-4',
      organizationName: 'FinTech Startup Hub',
      status: 'rejected',
      requestDate: '2024-01-08',
      message: 'Entrepreneur passionné par la fintech, je souhaite rejoindre votre incubateur.',
      responseMessage: 'Merci pour votre intérêt. Malheureusement, nous ne pouvons pas accepter votre demande pour le moment.',
      responseDate: '2024-01-14',
    },
  ]);

  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: 'inv-1',
      organizationId: 'org-3',
      organizationName: 'Green Energy Innovations',
      organizationAvatar: 'GE',
      inviterName: 'Marie Dubois',
      inviterRole: 'Directrice RH',
      role: 'member',
      message: 'Nous avons été impressionnés par votre profil et aimerions vous inviter à rejoindre notre équipe de développement durable.',
      inviteDate: '2024-01-16',
      expiryDate: '2024-01-30',
      status: 'pending',
    },
    {
      id: 'inv-2',
      organizationId: 'org-5',
      organizationName: 'Healthcare Solutions',
      organizationAvatar: 'HS',
      inviterName: 'Dr. Pierre Martin',
      inviterRole: 'CTO',
      role: 'admin',
      message: 'Votre expertise en technologie médicale serait un atout précieux pour notre équipe. Nous vous proposons un poste d\'administrateur.',
      inviteDate: '2024-01-14',
      expiryDate: '2024-01-28',
      status: 'pending',
    },
  ]);

  const [newOrgData, setNewOrgData] = useState({
    name: '',
    description: '',
    industry: '',
    location: '',
    website: '',
    email: '',
    isPublic: true,
  });

  const industries = [
    'Technologie',
    'Marketing',
    'Finance',
    'Santé',
    'Énergie',
    'Design',
    'Éducation',
    'Commerce',
    'Consulting',
    'Autre',
  ];

  const locations = [
    'Paris, France',
    'Lyon, France',
    'Marseille, France',
    'Toulouse, France',
    'Nice, France',
    'Bordeaux, France',
    'Lille, France',
    'Autre',
  ];

  const filteredOrganizations = publicOrganizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesIndustry = industryFilter === 'all' || org.industry === industryFilter;
    const matchesPlan = planFilter === 'all' || org.plan === planFilter;
    const matchesLocation = locationFilter === 'all' || org.location === locationFilter;
    
    return matchesSearch && matchesIndustry && matchesPlan && matchesLocation;
  });

  const getPlanColor = (plan: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'approved':
      case 'accepted':
        return 'Approuvé';
      case 'rejected':
      case 'declined':
        return 'Refusé';
      default:
        return status;
    }
  };

  const handleJoinRequest = () => {
    if (!selectedOrganization || !joinMessage.trim()) return;

    const newRequest: JoinRequest = {
      id: `req-${Date.now()}`,
      organizationId: selectedOrganization.id,
      organizationName: selectedOrganization.name,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0],
      message: joinMessage,
    };

    setJoinRequests([newRequest, ...joinRequests]);
    setJoinMessage('');
    setShowJoinModal(false);
    setSelectedOrganization(null);
  };

  const handleInvitationResponse = (invitationId: string, response: 'accepted' | 'declined') => {
    const invitation = invitations.find(inv => inv.id === invitationId);
    if (!invitation) return;

    if (response === 'accepted') {
      // Add organization to user's organizations
      const newOrg: Organization = {
        id: invitation.organizationId,
        name: invitation.organizationName,
        role: invitation.role,
        avatar: invitation.organizationAvatar,
        memberCount: 0, // This would be fetched from the server
        plan: 'professional', // This would be fetched from the server
      };
      
      addOrganization(newOrg);
      setCurrentOrganization(newOrg);
    }

    setInvitations(invitations.map(inv =>
      inv.id === invitationId
        ? { ...inv, status: response }
        : inv
    ));
  };

  const handleCreateOrganization = () => {
    if (!newOrgData.name || !newOrgData.description) return;

    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: newOrgData.name,
      role: 'owner',
      avatar: newOrgData.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2),
      memberCount: 1,
      plan: 'starter',
    };

    addOrganization(newOrg);
    setCurrentOrganization(newOrg);
    setNewOrgData({
      name: '',
      description: '',
      industry: '',
      location: '',
      website: '',
      email: '',
      isPublic: true,
    });
    setShowCreateModal(false);
  };

  const renderDiscoverTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h4 className="font-semibold text-gray-900">Filtres</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secteur</label>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les secteurs</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les plans</option>
              <option value="starter">Débutant</option>
              <option value="professional">Professionnel</option>
              <option value="enterprise">Entreprise</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les localisations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrganizations.map((org) => (
          <div key={org.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl w-16 h-16 flex items-center justify-center text-white font-bold text-xl">
                  {org.avatar}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{org.name}</h3>
                    {org.verified && (
                      <CheckCircle size={16} className="text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{org.industry}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <MapPin size={12} />
                      <span>{org.location}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < Math.floor(org.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                        />
                      ))}
                      <span className="text-xs text-gray-600 ml-1">{org.rating}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(org.plan)}`}>
                      {getPlanLabel(org.plan)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3">{org.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {org.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div>
                <div className="font-semibold text-gray-900">{org.memberCount}</div>
                <div className="text-xs text-gray-600">Membres</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">{org.activeMembers}</div>
                <div className="text-xs text-gray-600">Actifs</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">{org.foundedYear}</div>
                <div className="text-xs text-gray-600">Fondée</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {org.website && (
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Globe size={16} />
                  </a>
                )}
                {org.email && (
                  <a
                    href={`mailto:${org.email}`}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Mail size={16} />
                  </a>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedOrganization(org)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors flex items-center space-x-1"
                >
                  <Eye size={14} />
                  <span>Voir</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedOrganization(org);
                    setShowJoinModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
                >
                  <UserPlus size={16} />
                  <span>Rejoindre</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrganizations.length === 0 && (
        <div className="text-center py-12">
          <Building size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune organisation trouvée</h3>
          <p className="text-gray-600">Essayez d'ajuster vos filtres ou créez votre propre organisation.</p>
        </div>
      )}
    </div>
  );

  const renderRequestsTab = () => (
    <div className="space-y-4">
      {joinRequests.length === 0 ? (
        <div className="text-center py-12">
          <Send size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande envoyée</h3>
          <p className="text-gray-600">Vos demandes d'adhésion apparaîtront ici.</p>
        </div>
      ) : (
        joinRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{request.organizationName}</h3>
                <p className="text-sm text-gray-600">Demande envoyée le {new Date(request.requestDate).toLocaleDateString('fr-FR')}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                {getStatusLabel(request.status)}
              </span>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Votre message :</h4>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{request.message}</p>
            </div>

            {request.responseMessage && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Réponse de l'organisation :</h4>
                <p className="text-gray-600 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                  {request.responseMessage}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Répondu le {request.responseDate ? new Date(request.responseDate).toLocaleDateString('fr-FR') : ''}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                {request.status === 'pending' && (
                  <>
                    <Clock size={14} />
                    <span>En attente de réponse</span>
                  </>
                )}
                {request.status === 'approved' && (
                  <>
                    <CheckCircle size={14} className="text-green-500" />
                    <span>Demande approuvée</span>
                  </>
                )}
                {request.status === 'rejected' && (
                  <>
                    <AlertCircle size={14} className="text-red-500" />
                    <span>Demande refusée</span>
                  </>
                )}
              </div>
              {request.status === 'approved' && (
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                  Rejoindre maintenant
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderInvitationsTab = () => (
    <div className="space-y-4">
      {invitations.filter(inv => inv.status === 'pending').length === 0 ? (
        <div className="text-center py-12">
          <Mail size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune invitation en attente</h3>
          <p className="text-gray-600">Les invitations d'organisations apparaîtront ici.</p>
        </div>
      ) : (
        invitations.filter(inv => inv.status === 'pending').map((invitation) => (
          <div key={invitation.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl w-12 h-12 flex items-center justify-center text-white font-bold">
                  {invitation.organizationAvatar}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{invitation.organizationName}</h3>
                  <p className="text-sm text-gray-600">
                    Invité par {invitation.inviterName} ({invitation.inviterRole})
                  </p>
                  <p className="text-xs text-gray-500">
                    Reçu le {new Date(invitation.inviteDate).toLocaleDateString('fr-FR')} • 
                    Expire le {new Date(invitation.expiryDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                invitation.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {invitation.role === 'admin' ? 'Administrateur' : 'Membre'}
              </span>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Message d'invitation :</h4>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                {invitation.message}
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => handleInvitationResponse(invitation.id, 'declined')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Décliner
              </button>
              <button
                onClick={() => handleInvitationResponse(invitation.id, 'accepted')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Check size={16} />
                <span>Accepter</span>
              </button>
            </div>
          </div>
        ))
      )}

      {/* Processed Invitations */}
      {invitations.filter(inv => inv.status !== 'pending').length > 0 && (
        <div className="mt-8">
          <h4 className="font-semibold text-gray-900 mb-4">Invitations traitées</h4>
          <div className="space-y-4">
            {invitations.filter(inv => inv.status !== 'pending').map((invitation) => (
              <div key={invitation.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg w-10 h-10 flex items-center justify-center text-white font-bold text-sm">
                      {invitation.organizationAvatar}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{invitation.organizationName}</h5>
                      <p className="text-sm text-gray-600">
                        {invitation.status === 'accepted' ? 'Invitation acceptée' : 'Invitation déclinée'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                    {getStatusLabel(invitation.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Rejoindre une Organisation</h3>
          <p className="text-sm text-gray-600">Découvrez et rejoignez des organisations qui correspondent à vos intérêts</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Créer une Organisation</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('discover')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'discover'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Découvrir ({filteredOrganizations.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'requests'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Mes Demandes ({joinRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('invitations')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'invitations'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Invitations ({invitations.filter(inv => inv.status === 'pending').length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'discover' && renderDiscoverTab()}
      {activeTab === 'requests' && renderRequestsTab()}
      {activeTab === 'invitations' && renderInvitationsTab()}

      {/* Join Organization Modal */}
      {showJoinModal && selectedOrganization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Rejoindre {selectedOrganization.name}</h3>
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setSelectedOrganization(null);
                  setJoinMessage('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl w-16 h-16 flex items-center justify-center text-white font-bold text-xl">
                  {selectedOrganization.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{selectedOrganization.name}</h4>
                  <p className="text-gray-600">{selectedOrganization.industry} • {selectedOrganization.location}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(selectedOrganization.plan)}`}>
                      {getPlanLabel(selectedOrganization.plan)}
                    </span>
                    {selectedOrganization.verified && (
                      <span className="flex items-center space-x-1 text-xs text-blue-600">
                        <CheckCircle size={12} />
                        <span>Vérifiée</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{selectedOrganization.description}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message de motivation *
              </label>
              <textarea
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Expliquez pourquoi vous souhaitez rejoindre cette organisation et ce que vous pouvez apporter..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Ce message sera envoyé aux administrateurs de l'organisation.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setSelectedOrganization(null);
                  setJoinMessage('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleJoinRequest}
                disabled={!joinMessage.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send size={16} />
                <span>Envoyer la demande</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Organization Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Créer une Nouvelle Organisation</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'organisation *</label>
                <input
                  type="text"
                  value={newOrgData.name}
                  onChange={(e) => setNewOrgData({ ...newOrgData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le nom de votre organisation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newOrgData.description}
                  onChange={(e) => setNewOrgData({ ...newOrgData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez votre organisation et ses objectifs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secteur</label>
                  <select
                    value={newOrgData.industry}
                    onChange={(e) => setNewOrgData({ ...newOrgData, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez un secteur</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                  <select
                    value={newOrgData.location}
                    onChange={(e) => setNewOrgData({ ...newOrgData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez une localisation</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                  <input
                    type="url"
                    value={newOrgData.website}
                    onChange={(e) => setNewOrgData({ ...newOrgData, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://votre-site.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email de contact</label>
                  <input
                    type="email"
                    value={newOrgData.email}
                    onChange={(e) => setNewOrgData({ ...newOrgData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="contact@votre-organisation.com"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newOrgData.isPublic}
                  onChange={(e) => setNewOrgData({ ...newOrgData, isPublic: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">
                  Rendre cette organisation publique (visible dans l'annuaire)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateOrganization}
                disabled={!newOrgData.name || !newOrgData.description}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Créer l'Organisation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinOrganization;