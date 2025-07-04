import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, Calendar, User, Building, TrendingUp, Edit, Trash2, X, AlertCircle, CheckCircle, Loader2, Wifi, WifiOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useOrganization } from '../contexts/OrganizationContext';
import { opportunityService, Opportunity, CreateOpportunityData, UpdateOpportunityData } from '../services/opportunityService';

interface OpportunitiesProps {
  searchTerm: string;
}

const Opportunities: React.FC<OpportunitiesProps> = ({ searchTerm }) => {
  const { t } = useLanguage();
  const { currentOrganization } = useOrganization();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [operationLoading, setOperationLoading] = useState<{
    create: boolean;
    update: boolean;
    delete: boolean;
  }>({
    create: false,
    update: false,
    delete: false,
  });

  const [formData, setFormData] = useState<Omit<CreateOpportunityData, 'organisation_id'>>({
    title: '',
    company: '',
    value: 0,
    stage: 'Prospecting',
    probability: 0,
    close_date: '',
    contact: '',
    description: '',
  });

  const stages = [
    { id: 'Prospecting', name: 'Prospecting', color: 'bg-gray-100 text-gray-800' },
    { id: 'Qualification', name: 'Qualification', color: 'bg-blue-100 text-blue-800' },
    { id: 'Proposal', name: 'Proposal', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'Negotiation', name: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
    { id: 'Closed Won', name: 'Closed Won', color: 'bg-green-100 text-green-800' },
    { id: 'Closed Lost', name: 'Closed Lost', color: 'bg-red-100 text-red-800' },
  ];

  // Load opportunities on component mount and when organization changes
  useEffect(() => {
    if (currentOrganization) {
      loadOpportunities();
    } else {
      setOpportunities([]);
      setLoading(false);
    }
  }, [currentOrganization]);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const opportunitiesData = await opportunityService.getOpportunities();
      setOpportunities(opportunitiesData);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error('Failed to load opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (error: any): string => {
    // Network connectivity check
    if (!navigator.onLine) {
      return 'Pas de connexion internet. Vérifiez votre connexion et réessayez.';
    }

    // Handle different types of errors
    if (error?.response?.status) {
      switch (error.response.status) {
        case 400:
          return error.response.data?.message || 'Données invalides. Vérifiez vos informations.';
        case 401:
          return 'Session expirée. Veuillez vous reconnecter.';
        case 403:
          return 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
        case 404:
          return 'Ressource non trouvée. Elle a peut-être été supprimée.';
        case 422:
          return 'Données de validation incorrectes. Vérifiez tous les champs requis.';
        case 429:
          return 'Trop de requêtes. Veuillez patienter un moment.';
        case 500:
          return 'Erreur serveur. Nos équipes ont été notifiées.';
        case 502:
        case 503:
        case 504:
          return 'Service temporairement indisponible. Réessayez dans quelques minutes.';
        default:
          return error.response.data?.message || 'Une erreur inattendue s\'est produite.';
      }
    }

    // Timeout errors
    if (error?.name === 'AbortError' || error?.code === 'ECONNABORTED') {
      return 'Délai d\'attente dépassé. Vérifiez votre connexion.';
    }

    // Validation errors
    if (error?.message?.includes('required')) {
      return 'Certains champs obligatoires sont manquants.';
    }

    if (error?.message?.includes('value')) {
      return 'La valeur de l\'opportunité doit être un nombre valide.';
    }

    // Generic error message
    return error?.message || 'Une erreur inattendue s\'est produite. Veuillez réessayer.';
  };

  const filteredOpportunities = opportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStageColor = (stage: string) => {
    const stageConfig = stages.find(s => s.id === stage);
    return stageConfig ? stageConfig.color : 'bg-gray-100 text-gray-800';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-green-600';
    if (probability >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      value: 0,
      stage: 'Prospecting',
      probability: 0,
      close_date: '',
      contact: '',
      description: '',
    });
  };

  const showSuccessMessage = (message: string) => {
    setSuccess(message);
    setError(null);
    setTimeout(() => setSuccess(null), 4000);
  };

  const showErrorMessage = (message: string) => {
    setError(message);
    setSuccess(null);
    setTimeout(() => setError(null), 6000);
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) {
      return 'Le titre est obligatoire.';
    }
    if (!formData.company.trim()) {
      return 'Le nom de l\'entreprise est obligatoire.';
    }
    if (!formData.value || formData.value <= 0) {
      return 'La valeur doit être supérieure à 0.';
    }
    if (formData.probability < 0 || formData.probability > 100) {
      return 'La probabilité doit être entre 0 et 100.';
    }
    if (formData.title.trim().length < 3) {
      return 'Le titre doit contenir au moins 3 caractères.';
    }
    if (formData.contact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact) && !formData.contact.includes(' ')) {
      // If contact looks like an email, validate it
      if (formData.contact.includes('@')) {
        return 'Format d\'email invalide pour le contact.';
      }
    }
    return null;
  };

  const handleAddOpportunity = async () => {
    const validationError = validateForm();
    if (validationError) {
      showErrorMessage(validationError);
      return;
    }

    try {
      setOperationLoading(prev => ({ ...prev, create: true }));
      await opportunityService.createOpportunity(formData);
      await loadOpportunities(); // Reload opportunities
      resetForm();
      setShowAddModal(false);
      showSuccessMessage('Opportunité créée avec succès ! 🎉');
    } catch (err) {
      console.error('Failed to create opportunity:', err);
      const errorMessage = getErrorMessage(err);
      showErrorMessage(`Échec de la création : ${errorMessage}`);
    } finally {
      setOperationLoading(prev => ({ ...prev, create: false }));
    }
  };

  const handleEditOpportunity = async () => {
    const validationError = validateForm();
    if (validationError) {
      showErrorMessage(validationError);
      return;
    }

    if (!selectedOpportunity) {
      showErrorMessage('Aucune opportunité sélectionnée.');
      return;
    }

    try {
      setOperationLoading(prev => ({ ...prev, update: true }));
      await opportunityService.updateOpportunity(selectedOpportunity.id, formData);
      await loadOpportunities(); // Reload opportunities
      setShowEditModal(false);
      setSelectedOpportunity(null);
      resetForm();
      showSuccessMessage('Opportunité mise à jour avec succès ! ✅');
    } catch (err) {
      console.error('Failed to update opportunity:', err);
      const errorMessage = getErrorMessage(err);
      showErrorMessage(`Échec de la mise à jour : ${errorMessage}`);
    } finally {
      setOperationLoading(prev => ({ ...prev, update: false }));
    }
  };

  const handleDeleteOpportunity = async () => {
    if (!selectedOpportunity) {
      showErrorMessage('Aucune opportunité sélectionnée.');
      return;
    }

    try {
      setOperationLoading(prev => ({ ...prev, delete: true }));
      await opportunityService.deleteOpportunity(selectedOpportunity.id);
      await loadOpportunities(); // Reload opportunities
      setShowDeleteModal(false);
      setSelectedOpportunity(null);
      showSuccessMessage('Opportunité supprimée avec succès ! 🗑️');
    } catch (err) {
      console.error('Failed to delete opportunity:', err);
      const errorMessage = getErrorMessage(err);
      showErrorMessage(`Échec de la suppression : ${errorMessage}`);
    } finally {
      setOperationLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const openEditModal = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setFormData({
      title: opportunity.title,
      company: opportunity.company,
      value: opportunity.value,
      stage: opportunity.stage,
      probability: opportunity.probability,
      close_date: opportunity.close_date,
      contact: opportunity.contact,
      description: opportunity.description,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowDeleteModal(true);
  };

  const retryLoadOpportunities = () => {
    setError(null);
    loadOpportunities();
  };

  if (!currentOrganization) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Building size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune organisation</h3>
          <p className="text-gray-600">Vous devez être membre d'une organisation pour gérer les opportunités.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
          <p className="text-gray-600">Chargement des opportunités...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Pipeline de Ventes</h3>
          <p className="text-sm text-gray-600">
            Suivez et gérez vos opportunités de vente - Organisation: {currentOrganization.name}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          disabled={operationLoading.create}
        >
          {operationLoading.create ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Plus size={20} />
          )}
          <span>Ajouter une Opportunité</span>
        </button>
      </div>

      {/* Network Status Indicator */}
      {!navigator.onLine && (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center space-x-2">
          <WifiOff size={20} className="text-orange-600" />
          <span className="text-orange-800">Mode hors ligne - Certaines fonctionnalités peuvent être limitées</span>
        </div>
      )}

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2 animate-fade-in">
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-800">{success}</span>
          <button
            onClick={() => setSuccess(null)}
            className="ml-auto text-green-600 hover:text-green-800"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 animate-fade-in">
          <AlertCircle size={20} className="text-red-600" />
          <div className="flex-1">
            <span className="text-red-800">{error}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={retryLoadOpportunities}
              className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-100 transition-colors"
            >
              Réessayer
            </button>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Pipeline Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stages.map((stage) => {
          const stageOpps = filteredOpportunities.filter(opp => opp.stage === stage.id);
          const stageValue = stageOpps.reduce((sum, opp) => sum + opp.value, 0);
          
          return (
            <div key={stage.id} className={`${stage.color} rounded-lg p-4`}>
              <h4 className="font-medium text-gray-900 text-sm mb-2">{stage.name}</h4>
              <p className="text-2xl font-bold text-gray-900">{stageOpps.length}</p>
              <p className="text-sm text-gray-600">{(stageValue / 1000).toFixed(0)}k€</p>
            </div>
          );
        })}
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOpportunities.map((opportunity) => (
          <div key={opportunity.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{opportunity.title}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building size={14} />
                  <span>{opportunity.company}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(opportunity.stage)}`}>
                  {opportunity.stage}
                </span>
                <button 
                  onClick={() => openEditModal(opportunity)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Modifier l'opportunité"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => openDeleteModal(opportunity)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Supprimer l'opportunité"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{opportunity.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <DollarSign size={16} className="text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Valeur</p>
                  <p className="font-semibold">{opportunity.value.toLocaleString()}€</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp size={16} className={getProbabilityColor(opportunity.probability)} />
                <div>
                  <p className="text-sm text-gray-600">Probabilité</p>
                  <p className={`font-semibold ${getProbabilityColor(opportunity.probability)}`}>
                    {opportunity.probability}%
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Date de clôture</p>
                  <p className="font-semibold">{new Date(opportunity.close_date).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <User size={16} className="text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-semibold text-sm truncate">{opportunity.contact}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${opportunity.probability}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 ml-2">{opportunity.probability}%</span>
            </div>
          </div>
        ))}
      </div>

      {filteredOpportunities.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune opportunité trouvée</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Essayez d\'ajuster vos termes de recherche ou ajoutez une nouvelle opportunité.'
              : 'Commencez par ajouter votre première opportunité.'
            }
          </p>
        </div>
      )}

      {/* Add Opportunity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Ajouter une Nouvelle Opportunité</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={operationLoading.create}
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le titre de l'opportunité"
                  disabled={operationLoading.create}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le nom de l'entreprise"
                  disabled={operationLoading.create}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valeur (€) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez la valeur de l'opportunité"
                  disabled={operationLoading.create}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Étape</label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={operationLoading.create}
                >
                  {stages.map(stage => (
                    <option key={stage.id} value={stage.id}>{stage.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Probabilité (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez la probabilité (0-100)"
                  disabled={operationLoading.create}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de clôture</label>
                <input
                  type="date"
                  value={formData.close_date}
                  onChange={(e) => setFormData({ ...formData, close_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={operationLoading.create}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez l'email ou nom du contact"
                  disabled={operationLoading.create}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez la description de l'opportunité"
                  disabled={operationLoading.create}
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={operationLoading.create}
              >
                Annuler
              </button>
              <button
                onClick={handleAddOpportunity}
                disabled={!formData.title || !formData.company || !formData.value || operationLoading.create}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {operationLoading.create ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Création...</span>
                  </>
                ) : (
                  <span>Ajouter l'Opportunité</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Opportunity Modal */}
      {showEditModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Modifier l'Opportunité</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={operationLoading.update}
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le titre de l'opportunité"
                  disabled={operationLoading.update}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le nom de l'entreprise"
                  disabled={operationLoading.update}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valeur (€) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez la valeur de l'opportunité"
                  disabled={operationLoading.update}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Étape</label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={operationLoading.update}
                >
                  {stages.map(stage => (
                    <option key={stage.id} value={stage.id}>{stage.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Probabilité (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez la probabilité (0-100)"
                  disabled={operationLoading.update}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de clôture</label>
                <input
                  type="date"
                  value={formData.close_date}
                  onChange={(e) => setFormData({ ...formData, close_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={operationLoading.update}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez l'email ou nom du contact"
                  disabled={operationLoading.update}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez la description de l'opportunité"
                  disabled={operationLoading.update}
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={operationLoading.update}
              >
                Annuler
              </button>
              <button
                onClick={handleEditOpportunity}
                disabled={!formData.title || !formData.company || !formData.value || operationLoading.update}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {operationLoading.update ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Mise à jour...</span>
                  </>
                ) : (
                  <span>Mettre à jour</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Supprimer l'Opportunité</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={operationLoading.delete}
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle size={24} className="text-red-500" />
                <div>
                  <h4 className="font-medium text-gray-900">Confirmer la suppression</h4>
                  <p className="text-sm text-gray-600">Cette action est irréversible</p>
                </div>
              </div>
              <p className="text-gray-600">
                Êtes-vous sûr de vouloir supprimer <strong>{selectedOpportunity.title}</strong> ? 
                Toutes les données associées seront définitivement perdues.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={operationLoading.delete}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteOpportunity}
                disabled={operationLoading.delete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {operationLoading.delete ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Suppression...</span>
                  </>
                ) : (
                  <span>Supprimer</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Opportunities;