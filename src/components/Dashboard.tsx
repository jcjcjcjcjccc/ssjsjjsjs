import React, { useState } from 'react';
import { Users, Target, CheckSquare, TrendingUp, DollarSign, Clock, ArrowUpRight, Sparkles, Zap, Plus, X, Building, Mail, Phone, MapPin, Calendar, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { authService } from '../services/authService';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  location: string;
  status: 'hot' | 'warm' | 'cold';
}

interface Opportunity {
  id: number;
  title: string;
  company: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  closeDate: string;
  contact: string;
  description: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assignee: string;
  relatedTo: string;
  type: 'call' | 'email' | 'meeting' | 'follow-up' | 'other';
}

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  
  // Get user data from auth service
  const currentUser = authService.getStoredUser();
  const userDisplayName = authService.getUserDisplayName();
  
  // Modal states
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showCreateOpportunityModal, setShowCreateOpportunityModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Form data states
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    location: '',
    status: 'warm' as 'hot' | 'warm' | 'cold',
  });

  const [opportunityFormData, setOpportunityFormData] = useState({
    title: '',
    company: '',
    value: '',
    stage: 'prospecting' as Opportunity['stage'],
    probability: '',
    closeDate: '',
    contact: '',
    description: '',
  });

  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    status: 'pending' as Task['status'],
    dueDate: '',
    assignee: '',
    relatedTo: '',
    type: 'other' as Task['type'],
  });

  const stats = [
    {
      title: t('totalContacts'),
      value: '2,847',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
    },
    {
      title: t('activeOpportunities'),
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: Target,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'from-emerald-50 to-teal-50',
    },
    {
      title: t('pendingTasks'),
      value: '23',
      change: '-5%',
      changeType: 'negative',
      icon: CheckSquare,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
    },
    {
      title: t('revenuePipeline'),
      value: '$1.2M',
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'contact',
      title: 'New contact added',
      description: 'Sarah Johnson from TechCorp',
      time: '2 hours ago',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      type: 'opportunity',
      title: 'Deal moved to negotiation',
      description: 'Enterprise Software License - $50k',
      time: '4 hours ago',
      icon: Target,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      id: 3,
      type: 'task',
      title: 'Follow-up call completed',
      description: 'Called ProSoft Ltd regarding proposal',
      time: '1 day ago',
      icon: CheckSquare,
      color: 'from-orange-500 to-amber-500',
    },
    {
      id: 4,
      type: 'opportunity',
      title: 'New opportunity created',
      description: 'Cloud Migration Services - $120k',
      time: '2 days ago',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const pipelineStages = [
    { stage: 'Prospecting', count: 45, amount: '$230k', color: 'from-slate-400 to-slate-500', progress: 20 },
    { stage: 'Qualification', count: 32, amount: '$180k', color: 'from-blue-400 to-blue-500', progress: 35 },
    { stage: 'Proposal', count: 18, amount: '$290k', color: 'from-yellow-400 to-orange-500', progress: 60 },
    { stage: 'Negotiation', count: 12, amount: '$340k', color: 'from-emerald-400 to-emerald-500', progress: 80 },
    { stage: 'Closed Won', count: 8, amount: '$160k', color: 'from-green-400 to-green-500', progress: 100 },
  ];

  // Reset form functions
  const resetContactForm = () => {
    setContactFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      location: '',
      status: 'warm',
    });
  };

  const resetOpportunityForm = () => {
    setOpportunityFormData({
      title: '',
      company: '',
      value: '',
      stage: 'prospecting',
      probability: '',
      closeDate: '',
      contact: '',
      description: '',
    });
  };

  const resetTaskForm = () => {
    setTaskFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      dueDate: '',
      assignee: '',
      relatedTo: '',
      type: 'other',
    });
  };

  // Handle form submissions
  const handleAddContact = () => {
    if (!contactFormData.name || !contactFormData.email) return;

    // Here you would typically save to your data store
    console.log('Adding contact:', contactFormData);
    
    // Show success message (you could implement a toast notification)
    alert('Contact added successfully!');
    
    resetContactForm();
    setShowAddContactModal(false);
  };

  const handleCreateOpportunity = () => {
    if (!opportunityFormData.title || !opportunityFormData.company || !opportunityFormData.value) return;

    // Here you would typically save to your data store
    console.log('Creating opportunity:', opportunityFormData);
    
    // Show success message
    alert('Opportunity created successfully!');
    
    resetOpportunityForm();
    setShowCreateOpportunityModal(false);
  };

  const handleAddTask = () => {
    if (!taskFormData.title || !taskFormData.dueDate) return;

    // Here you would typically save to your data store
    console.log('Adding task:', taskFormData);
    
    // Show success message
    alert('Task added successfully!');
    
    resetTaskForm();
    setShowAddTaskModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden glass-effect rounded-3xl p-8 border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-pink-600/10"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              Bon retour, {userDisplayName} ! 👋
            </h1>
            <p className="text-slate-600 text-lg">{t('welcomeDescription')}</p>
            {currentUser && (
              <div className="mt-4 flex items-center space-x-4 text-sm text-slate-500">
                <span>📧 {currentUser.email}</span>
                {currentUser.organisation_id && (
                  <span>🏢 Organisation #{currentUser.organisation_id}</span>
                )}
                <span>📅 Membre depuis {new Date(currentUser.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center animate-float">
                <Zap size={40} className="text-white" />
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-2 animate-pulse">
                <Sparkles size={16} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="metric-card group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={28} className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`text-sm font-bold ${
                    stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                  <ArrowUpRight size={16} className={stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-500 rotate-90'} />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-2">vs last month</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pipeline Overview */}
        <div className="glass-effect rounded-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('salesPipeline')}</h3>
              <p className="text-slate-600">Track your deals through each stage</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="space-y-6">
            {pipelineStages.map((stage, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${stage.color}`}></div>
                    <span className="font-semibold text-slate-900">{stage.stage}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{stage.amount}</div>
                    <div className="text-sm text-slate-500">{stage.count} deals</div>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stage.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${stage.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="glass-effect rounded-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('recentActivities')}</h3>
              <p className="text-slate-600">Stay updated with latest actions</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
              <Clock size={24} className="text-emerald-600" />
            </div>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50/50 transition-colors group">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${activity.color} group-hover:scale-110 transition-transform`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{activity.title}</p>
                    <p className="text-slate-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-slate-500 mt-2 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-effect rounded-2xl p-8 border border-white/20">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('quickActions')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => {
              resetContactForm();
              setShowAddContactModal(true);
            }}
            className="btn-primary flex items-center justify-center space-x-3 py-4 group"
          >
            <Users size={20} className="group-hover:scale-110 transition-transform" />
            <span>{t('addNewContact')}</span>
          </button>
          <button 
            onClick={() => {
              resetOpportunityForm();
              setShowCreateOpportunityModal(true);
            }}
            className="btn-primary flex items-center justify-center space-x-3 py-4 group"
          >
            <Target size={20} className="group-hover:scale-110 transition-transform" />
            <span>{t('createOpportunity')}</span>
          </button>
          <button 
            onClick={() => {
              resetTaskForm();
              setShowAddTaskModal(true);
            }}
            className="btn-primary flex items-center justify-center space-x-3 py-4 group"
          >
            <CheckSquare size={20} className="group-hover:scale-110 transition-transform" />
            <span>{t('addTask')}</span>
          </button>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-3">
                  <Users size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{t('addNewContact')}</h3>
              </div>
              <button
                onClick={() => setShowAddContactModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('name')} *</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={contactFormData.name}
                    onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('email')} *</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={contactFormData.email}
                    onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('phone')}</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={contactFormData.phone}
                    onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <div className="relative">
                  <Building size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={contactFormData.company}
                    onChange={(e) => setContactFormData({ ...contactFormData, company: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('position')}</label>
                <input
                  type="text"
                  value={contactFormData.position}
                  onChange={(e) => setContactFormData({ ...contactFormData, position: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter job title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('location')}</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={contactFormData.location}
                    onChange={(e) => setContactFormData({ ...contactFormData, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('status')}</label>
                <select
                  value={contactFormData.status}
                  onChange={(e) => setContactFormData({ ...contactFormData, status: e.target.value as 'hot' | 'warm' | 'cold' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="hot">Hot Lead</option>
                  <option value="warm">Warm Lead</option>
                  <option value="cold">Cold Lead</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowAddContactModal(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleAddContact}
                disabled={!contactFormData.name || !contactFormData.email}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('addContact')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Opportunity Modal */}
      {showCreateOpportunityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-3">
                  <Target size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{t('createOpportunity')}</h3>
              </div>
              <button
                onClick={() => setShowCreateOpportunityModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Opportunity Title *</label>
                <input
                  type="text"
                  value={opportunityFormData.title}
                  onChange={(e) => setOpportunityFormData({ ...opportunityFormData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter opportunity title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                <div className="relative">
                  <Building size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={opportunityFormData.company}
                    onChange={(e) => setOpportunityFormData({ ...opportunityFormData, company: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Value *</label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={opportunityFormData.value}
                    onChange={(e) => setOpportunityFormData({ ...opportunityFormData, value: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter opportunity value"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                <select
                  value={opportunityFormData.stage}
                  onChange={(e) => setOpportunityFormData({ ...opportunityFormData, stage: e.target.value as Opportunity['stage'] })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="prospecting">Prospecting</option>
                  <option value="qualification">Qualification</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="closed-won">Closed Won</option>
                  <option value="closed-lost">Closed Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Probability (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={opportunityFormData.probability}
                  onChange={(e) => setOpportunityFormData({ ...opportunityFormData, probability: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter probability (0-100)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Close Date</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={opportunityFormData.closeDate}
                    onChange={(e) => setOpportunityFormData({ ...opportunityFormData, closeDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={opportunityFormData.contact}
                    onChange={(e) => setOpportunityFormData({ ...opportunityFormData, contact: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter contact name"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={opportunityFormData.description}
                  onChange={(e) => setOpportunityFormData({ ...opportunityFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter opportunity description"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowCreateOpportunityModal(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleCreateOpportunity}
                disabled={!opportunityFormData.title || !opportunityFormData.company || !opportunityFormData.value}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('createOpportunity')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-3">
                  <CheckSquare size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{t('addTask')}</h3>
              </div>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                <input
                  type="text"
                  value={taskFormData.title}
                  onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter task title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={taskFormData.description}
                  onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter task description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={taskFormData.type}
                  onChange={(e) => setTaskFormData({ ...taskFormData, type: e.target.value as Task['type'] })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={taskFormData.priority}
                  onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value as Task['priority'] })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={taskFormData.status}
                  onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value as Task['status'] })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={taskFormData.dueDate}
                    onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={taskFormData.assignee}
                    onChange={(e) => setTaskFormData({ ...taskFormData, assignee: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter assignee name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Related To</label>
                <input
                  type="text"
                  value={taskFormData.relatedTo}
                  onChange={(e) => setTaskFormData({ ...taskFormData, relatedTo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter related company or contact"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleAddTask}
                disabled={!taskFormData.title || !taskFormData.dueDate}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('addTask')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;