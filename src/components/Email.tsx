import React, { useState } from 'react';
import { Plus, Mail, Send, Users, Eye, BarChart3, Calendar, Edit, Trash2 } from 'lucide-react';

interface EmailCampaign {
  id: number;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'active';
  recipients: number;
  openRate: number;
  clickRate: number;
  sentDate?: string;
  scheduledDate?: string;
  type: 'newsletter' | 'promotional' | 'follow-up' | 'announcement';
}

interface EmailProps {
  searchTerm: string;
}

const Email: React.FC<EmailProps> = ({ searchTerm }) => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([
    {
      id: 1,
      name: 'Q1 Product Updates Newsletter',
      subject: 'Exciting New Features Coming Your Way!',
      content: 'Dear valued customer, we are excited to share our latest product updates...',
      status: 'sent',
      recipients: 1250,
      openRate: 68.5,
      clickRate: 12.3,
      sentDate: '2024-01-15',
      type: 'newsletter',
    },
    {
      id: 2,
      name: 'Enterprise Solution Promotion',
      subject: 'Special Offer: 30% Off Enterprise Plans',
      content: 'Limited time offer for our enterprise customers...',
      status: 'active',
      recipients: 450,
      openRate: 72.1,
      clickRate: 18.7,
      sentDate: '2024-01-12',
      type: 'promotional',
    },
    {
      id: 3,
      name: 'Follow-up: Demo Attendees',
      subject: 'Thank you for attending our demo',
      content: 'Thank you for taking the time to attend our product demonstration...',
      status: 'scheduled',
      recipients: 85,
      openRate: 0,
      clickRate: 0,
      scheduledDate: '2024-01-18',
      type: 'follow-up',
    },
    {
      id: 4,
      name: 'New Integration Announcement',
      subject: 'Now Available: Google Calendar Integration',
      content: 'We are pleased to announce our new Google Calendar integration...',
      status: 'draft',
      recipients: 0,
      openRate: 0,
      clickRate: 0,
      type: 'announcement',
    },
  ]);

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'newsletter':
        return '📰';
      case 'promotional':
        return '🎯';
      case 'follow-up':
        return '🔄';
      case 'announcement':
        return '📢';
      default:
        return '📧';
    }
  };

  const totalSent = campaigns.reduce((sum, campaign) => sum + (campaign.status === 'sent' || campaign.status === 'active' ? campaign.recipients : 0), 0);
  const avgOpenRate = campaigns.filter(c => c.status === 'sent' || c.status === 'active').reduce((sum, c) => sum + c.openRate, 0) / campaigns.filter(c => c.status === 'sent' || c.status === 'active').length || 0;
  const avgClickRate = campaigns.filter(c => c.status === 'sent' || c.status === 'active').reduce((sum, c) => sum + c.clickRate, 0) / campaigns.filter(c => c.status === 'sent' || c.status === 'active').length || 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Email Campaigns</h3>
          <p className="text-sm text-gray-600">Create and manage your email marketing campaigns</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Email Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{filteredCampaigns.length}</p>
            </div>
            <div className="bg-blue-500 rounded-lg p-3">
              <Mail size={24} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emails Sent</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-green-500 rounded-lg p-3">
              <Send size={24} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Open Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{avgOpenRate.toFixed(1)}%</p>
            </div>
            <div className="bg-orange-500 rounded-lg p-3">
              <Eye size={24} className="text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Click Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{avgClickRate.toFixed(1)}%</p>
            </div>
            <div className="bg-purple-500 rounded-lg p-3">
              <BarChart3 size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getTypeIcon(campaign.type)}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                  <p className="text-sm text-gray-600">{campaign.subject}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
                <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                  <Edit size={16} />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{campaign.content}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Recipients</p>
                  <p className="font-semibold">{campaign.recipients.toLocaleString()}</p>
                </div>
              </div>
              {campaign.status === 'sent' || campaign.status === 'active' ? (
                <>
                  <div className="flex items-center space-x-2">
                    <Eye size={16} className="text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Open Rate</p>
                      <p className="font-semibold text-green-600">{campaign.openRate}%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 size={16} className="text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Click Rate</p>
                      <p className="font-semibold text-purple-600">{campaign.clickRate}%</p>
                    </div>
                  </div>
                </>
              ) : null}
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">
                    {campaign.status === 'scheduled' ? 'Scheduled' : campaign.status === 'sent' || campaign.status === 'active' ? 'Sent' : 'Created'}
                  </p>
                  <p className="font-semibold">
                    {campaign.scheduledDate ? new Date(campaign.scheduledDate).toLocaleDateString() : 
                     campaign.sentDate ? new Date(campaign.sentDate).toLocaleDateString() : 'Draft'}
                  </p>
                </div>
              </div>
            </div>

            {(campaign.status === 'sent' || campaign.status === 'active') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Open Rate</span>
                  <span className="font-medium">{campaign.openRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${campaign.openRate}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Click Rate</span>
                  <span className="font-medium">{campaign.clickRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${campaign.clickRate}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <Mail size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
          <p className="text-gray-600">Try adjusting your search terms or create a new campaign.</p>
        </div>
      )}
    </div>
  );
};

export default Email;