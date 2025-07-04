import React, { useState } from 'react';
import { Plus, Check, X, Settings, Globe, Calendar, Mail, Database, Zap, ExternalLink } from 'lucide-react';

interface Integration {
  id: number;
  name: string;
  description: string;
  category: 'calendar' | 'email' | 'website' | 'database' | 'automation' | 'communication';
  status: 'connected' | 'available' | 'error';
  icon: string;
  features: string[];
  lastSync?: string;
  setupUrl?: string;
}

const Integrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 1,
      name: 'Google Calendar',
      description: 'Sync appointments and meetings with your Google Calendar',
      category: 'calendar',
      status: 'connected',
      icon: '📅',
      features: ['Two-way sync', 'Meeting reminders', 'Automatic scheduling'],
      lastSync: '2024-01-16T10:30:00Z',
    },
    {
      id: 2,
      name: 'Gmail Integration',
      description: 'Send emails directly from CRM and track email interactions',
      category: 'email',
      status: 'connected',
      icon: '📧',
      features: ['Email tracking', 'Template management', 'Auto-logging'],
      lastSync: '2024-01-16T09:15:00Z',
    },
    {
      id: 3,
      name: 'Website Forms',
      description: 'Capture leads from your website contact forms',
      category: 'website',
      status: 'connected',
      icon: '🌐',
      features: ['Lead capture', 'Form analytics', 'Auto-assignment'],
      lastSync: '2024-01-16T08:45:00Z',
    },
    {
      id: 4,
      name: 'Zapier',
      description: 'Connect with 5000+ apps through Zapier automation',
      category: 'automation',
      status: 'available',
      icon: '⚡',
      features: ['Workflow automation', 'Data sync', 'Custom triggers'],
      setupUrl: 'https://zapier.com/apps/gdpilia/integrations',
    },
    {
      id: 5,
      name: 'Slack',
      description: 'Get CRM notifications and updates in your Slack channels',
      category: 'communication',
      status: 'available',
      icon: '💬',
      features: ['Real-time notifications', 'Deal updates', 'Team collaboration'],
      setupUrl: 'https://slack.com/apps/gdpilia',
    },
    {
      id: 6,
      name: 'Microsoft Outlook',
      description: 'Sync with Outlook calendar and email',
      category: 'email',
      status: 'available',
      icon: '📮',
      features: ['Calendar sync', 'Email integration', 'Contact sync'],
      setupUrl: 'https://outlook.com/gdpilia',
    },
    {
      id: 7,
      name: 'Salesforce',
      description: 'Import data from Salesforce CRM',
      category: 'database',
      status: 'error',
      icon: '☁️',
      features: ['Data migration', 'Contact import', 'Deal sync'],
      lastSync: '2024-01-15T14:20:00Z',
    },
    {
      id: 8,
      name: 'HubSpot',
      description: 'Sync marketing data and contacts with HubSpot',
      category: 'database',
      status: 'available',
      icon: '🎯',
      features: ['Marketing automation', 'Lead scoring', 'Analytics sync'],
      setupUrl: 'https://hubspot.com/integrations/gdpilia',
    },
  ]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'calendar':
        return <Calendar size={20} className="text-blue-600" />;
      case 'email':
        return <Mail size={20} className="text-green-600" />;
      case 'website':
        return <Globe size={20} className="text-purple-600" />;
      case 'database':
        return <Database size={20} className="text-orange-600" />;
      case 'automation':
        return <Zap size={20} className="text-yellow-600" />;
      case 'communication':
        return <Settings size={20} className="text-pink-600" />;
      default:
        return <Settings size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'available':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <Check size={16} className="text-green-600" />;
      case 'available':
        return <Plus size={16} className="text-blue-600" />;
      case 'error':
        return <X size={16} className="text-red-600" />;
      default:
        return <Settings size={16} className="text-gray-600" />;
    }
  };

  const categories = [
    { id: 'all', name: 'All Integrations', count: integrations.length },
    { id: 'calendar', name: 'Calendar', count: integrations.filter(i => i.category === 'calendar').length },
    { id: 'email', name: 'Email', count: integrations.filter(i => i.category === 'email').length },
    { id: 'website', name: 'Website', count: integrations.filter(i => i.category === 'website').length },
    { id: 'database', name: 'Database', count: integrations.filter(i => i.category === 'database').length },
    { id: 'automation', name: 'Automation', count: integrations.filter(i => i.category === 'automation').length },
    { id: 'communication', name: 'Communication', count: integrations.filter(i => i.category === 'communication').length },
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(integration => integration.category === selectedCategory);

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const availableCount = integrations.filter(i => i.status === 'available').length;
  const errorCount = integrations.filter(i => i.status === 'error').length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Integrations</h3>
          <p className="text-sm text-gray-600">Connect GDPilia with your favorite tools and services</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>Request Integration</span>
        </button>
      </div>

      {/* Integration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Integrations</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{integrations.length}</p>
            </div>
            <div className="bg-blue-500 rounded-lg p-3">
              <Settings size={24} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Connected</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{connectedCount}</p>
            </div>
            <div className="bg-green-500 rounded-lg p-3">
              <Check size={24} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{availableCount}</p>
            </div>
            <div className="bg-blue-500 rounded-lg p-3">
              <Plus size={24} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Issues</p>
              <p className="text-2xl font-bold text-red-600 mt-2">{errorCount}</p>
            </div>
            <div className="bg-red-500 rounded-lg p-3">
              <X size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <div key={integration.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">{integration.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    {getCategoryIcon(integration.category)}
                    <span className="text-sm text-gray-600 capitalize">{integration.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(integration.status)}`}>
                  {getStatusIcon(integration.status)}
                  <span className="capitalize">{integration.status}</span>
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

            <div className="space-y-2 mb-4">
              <h5 className="text-sm font-medium text-gray-900">Features:</h5>
              <ul className="space-y-1">
                {integration.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {integration.lastSync && (
              <div className="text-xs text-gray-500 mb-4">
                Last sync: {new Date(integration.lastSync).toLocaleString()}
              </div>
            )}

            <div className="flex items-center justify-between">
              {integration.status === 'connected' ? (
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Configure
                  </button>
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                    Disconnect
                  </button>
                </div>
              ) : integration.status === 'available' ? (
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2">
                  <Plus size={16} />
                  <span>Connect</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                    Fix Issue
                  </button>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Retry
                  </button>
                </div>
              )}
              
              {integration.setupUrl && (
                <a
                  href={integration.setupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <Settings size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
          <p className="text-gray-600">Try selecting a different category or request a new integration.</p>
        </div>
      )}
    </div>
  );
};

export default Integrations;