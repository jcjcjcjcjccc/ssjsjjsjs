import React, { useState } from 'react';
import { TrendingUp, Users, Target, DollarSign, Calendar, BarChart3, PieChart, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Analytics: React.FC = () => {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const kpiData = [
    {
      title: 'Chiffre d\'affaires Total',
      value: '1 247 500€',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Nouveaux Contacts',
      value: '342',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Taux de Conversion',
      value: '24.8%',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: Target,
      color: 'bg-purple-500',
    },
    {
      title: 'Valeur Moyenne des Affaires',
      value: '12 450€',
      change: '-3.2%',
      changeType: 'negative' as const,
      icon: BarChart3,
      color: 'bg-orange-500',
    },
  ];

  const salesData = [
    { month: 'Jan', revenue: 85000, deals: 12, contacts: 45 },
    { month: 'Fév', revenue: 92000, deals: 15, contacts: 52 },
    { month: 'Mar', revenue: 78000, deals: 11, contacts: 38 },
    { month: 'Avr', revenue: 105000, deals: 18, contacts: 61 },
    { month: 'Mai', revenue: 118000, deals: 22, contacts: 73 },
    { month: 'Jun', revenue: 134000, deals: 25, contacts: 84 },
  ];

  const pipelineData = [
    { stage: 'Prospection', value: 230000, count: 45, color: '#3B82F6' },
    { stage: 'Qualification', value: 180000, count: 32, color: '#EAB308' },
    { stage: 'Proposition', value: 290000, count: 18, color: '#F97316' },
    { stage: 'Négociation', value: 340000, count: 12, color: '#10B981' },
    { stage: 'Conclu Gagné', value: 160000, count: 8, color: '#8B5CF6' },
  ];

  const topPerformers = [
    { name: 'Sarah Johnson', deals: 15, revenue: 245000, conversion: 68 },
    { name: 'Michael Chen', deals: 12, revenue: 198000, conversion: 62 },
    { name: 'Emily Rodriguez', deals: 10, revenue: 156000, conversion: 58 },
    { name: 'David Kim', deals: 8, revenue: 134000, conversion: 55 },
  ];

  const activityData = [
    { type: 'Appels', count: 156, change: '+12%' },
    { type: 'Emails', count: 342, change: '+8%' },
    { type: 'Réunions', count: 89, change: '+15%' },
    { type: 'Tâches', count: 234, change: '+5%' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Tableau de Bord Analytique</h3>
          <p className="text-sm text-gray-600">Suivez les performances et insights de votre entreprise</p>
        </div>
        <div className="flex items-center space-x-2">
          {[
            { key: '7d', label: '7 Jours' },
            { key: '30d', label: '30 Jours' },
            { key: '90d', label: '90 Jours' },
            { key: '1y', label: '1 An' },
          ].map((range) => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key as any)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === range.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">vs période précédente</span>
                  </div>
                </div>
                <div className={`${kpi.color} rounded-lg p-3`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Tendance du Chiffre d'Affaires</h4>
            <TrendingUp size={20} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {salesData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">{data.month}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{(data.revenue / 1000).toFixed(0)}k€</div>
                  <div className="text-sm text-gray-500">{data.deals} affaires</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Répartition du Pipeline</h4>
            <PieChart size={20} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {pipelineData.map((stage, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: stage.color }}
                  ></div>
                  <span className="font-medium text-gray-900">{stage.stage}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{(stage.value / 1000).toFixed(0)}k€</div>
                  <div className="text-sm text-gray-500">{stage.count} affaires</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Meilleurs Performeurs</h4>
            <Users size={20} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-semibold">
                    {performer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{performer.name}</div>
                    <div className="text-sm text-gray-500">{performer.deals} affaires conclues</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{(performer.revenue / 1000).toFixed(0)}k€</div>
                  <div className="text-sm text-green-600">{performer.conversion}% conversion</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Résumé d'Activité</h4>
            <Activity size={20} className="text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {activityData.map((activity, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{activity.count}</div>
                <div className="text-sm text-gray-600 mb-1">{activity.type}</div>
                <div className="text-xs text-green-600 font-medium">{activity.change}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Charts Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Aperçu des Performances Mensuelles</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">1,24M€</div>
            <div className="text-sm text-gray-600">Chiffre d'Affaires Total</div>
            <div className="text-xs text-green-600 mt-1">↑ 15,3% par rapport au mois dernier</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">156</div>
            <div className="text-sm text-gray-600">Affaires Conclues</div>
            <div className="text-xs text-green-600 mt-1">↑ 12,8% par rapport au mois dernier</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">24,8%</div>
            <div className="text-sm text-gray-600">Taux de Conversion</div>
            <div className="text-xs text-green-600 mt-1">↑ 2,1% par rapport au mois dernier</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;