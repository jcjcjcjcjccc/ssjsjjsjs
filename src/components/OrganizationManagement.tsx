import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Mail, 
  Phone, 
  MapPin,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useOrganization } from '../contexts/OrganizationContext';
import { organizationService, Organization as ApiOrganization, CreateOrganizationData, UpdateOrganizationData } from '../services/organizationService';
import { authService } from '../services/authService';

const OrganizationManagement: React.FC = () => {
  const { currentOrganization, updateOrganization, loading: contextLoading } = useOrganization();
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
  });

  const [createFormData, setCreateFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
  });

  // Initialize form data when organization loads
  useEffect(() => {
    if (currentOrganization) {
      setEditFormData({
        name: currentOrganization.name || '',
        email: currentOrganization.email || '',
        address: currentOrganization.address || '',
        phone: currentOrganization.phone || '',
      });
    }
  }, [currentOrganization]);

  const resetCreateForm = () => {
    setCreateFormData({
      name: '',
      email: '',
      address: '',
      phone: '',
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    // Reset form data
    if (currentOrganization) {
      setEditFormData({
        name: currentOrganization.name || '',
        email: currentOrganization.email || '',
        address: currentOrganization.address || '',
        phone: currentOrganization.phone || '',
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!currentOrganization) return;

    try {
      setLoading(true);
      setError(null);

      const updateData: UpdateOrganizationData = {
        name: editFormData.name,
        email: editFormData.email,
        address: editFormData.address,
        phone: editFormData.phone,
      };

      const updatedOrg = await organizationService.updateOrganization(currentOrganization.id, updateData);
      
      // Update the organization in context
      updateOrganization({
        ...currentOrganization,
        ...updatedOrg,
        avatar: currentOrganization.avatar,
        role: currentOrganization.role,
        memberCount: currentOrganization.memberCount,
        plan: currentOrganization.plan,
      });

      setIsEditing(false);
      setSuccess('Organisation mise à jour avec succès');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to update organization:', err);
      setError(err instanceof Error ? err.message : 'Échec de la mise à jour de l\'organisation');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async () => {
    try {
      setLoading(true);
      setError(null);

      const createData: CreateOrganizationData = {
        name: createFormData.name,
        email: createFormData.email,
        address: createFormData.address,
        phone: createFormData.phone,
      };

      await organizationService.createOrganization(createData);
      
      setShowCreateModal(false);
      resetCreateForm();
      setSuccess('Organisation créée avec succès');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to create organization:', err);
      setError(err instanceof Error ? err.message : 'Échec de la création de l\'organisation');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrganization = async () => {
    if (!currentOrganization) return;

    try {
      setLoading(true);
      setError(null);

      await organizationService.deleteOrganization(currentOrganization.id);
      
      setShowDeleteModal(false);
      setSuccess('Organisation supprimée avec succès');
      
      // Note: In a real app, you might want to redirect the user or handle this differently
      // since they no longer have an organization
    } catch (err) {
      console.error('Failed to delete organization:', err);
      setError(err instanceof Error ? err.message : 'Échec de la suppression de l\'organisation');
    } finally {
      setLoading(false);
    }
  };

  if (contextLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!currentOrganization) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Building size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune organisation trouvée</h3>
          <p className="text-gray-600 mb-6">Vous n'êtes actuellement membre d'aucune organisation.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Plus size={20} />
            <span>Créer une Organisation</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestion de l'Organisation</h3>
          <p className="text-sm text-gray-600">Gérez les informations de votre organisation</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nouvelle Organisation</span>
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-800">{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle size={20} className="text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Organization Details */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl w-16 h-16 flex items-center justify-center text-white font-bold text-xl">
              {currentOrganization.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{currentOrganization.name}</h2>
              <p className="text-gray-600">Organisation #{currentOrganization.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Edit size={16} />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Trash2 size={16} />
                  <span>Supprimer</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={16} />
                  <span>{loading ? 'Enregistrement...' : 'Enregistrer'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Organization Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de l'Organisation</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'organisation</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Building size={20} className="text-blue-600" />
                  <span className="font-medium text-gray-900">{currentOrganization.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail size={20} className="text-green-600" />
                  <span className="text-gray-900">{currentOrganization.email || 'Non renseigné'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone size={20} className="text-purple-600" />
                  <span className="text-gray-900">{currentOrganization.phone || 'Non renseigné'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
              {isEditing ? (
                <textarea
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin size={20} className="text-red-600 mt-0.5" />
                  <span className="text-gray-900">{currentOrganization.address || 'Non renseignée'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Organization Stats */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Users size={24} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Membres</p>
                    <p className="text-2xl font-bold text-blue-600">{currentOrganization.memberCount || 1}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Calendar size={24} className="text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Créée le</p>
                    <p className="text-lg font-semibold text-green-600">
                      {currentOrganization.created_at 
                        ? new Date(currentOrganization.created_at).toLocaleDateString('fr-FR')
                        : 'Non disponible'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Building size={24} className="text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Plan</p>
                    <p className="text-lg font-semibold text-purple-600 capitalize">
                      {currentOrganization.plan || 'Professionnel'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le nom de l'organisation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={createFormData.email}
                  onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez l'email de l'organisation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={createFormData.phone}
                  onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le numéro de téléphone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <textarea
                  value={createFormData.address}
                  onChange={(e) => setCreateFormData({ ...createFormData, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez l'adresse de l'organisation"
                />
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
                disabled={!createFormData.name || !createFormData.email || loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Création...' : 'Créer l\'Organisation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Supprimer l'Organisation</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Êtes-vous sûr de vouloir supprimer <strong>{currentOrganization.name}</strong> ? 
                Cette action ne peut pas être annulée et supprimera toutes les données associées.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteOrganization}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationManagement;