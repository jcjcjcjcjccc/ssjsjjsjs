import React, { useState, useEffect } from 'react';
import { Plus, Mail, Phone, Building, MapPin, Edit, Trash2, Users, X, AlertCircle, CheckCircle, User, Loader2, Wifi, WifiOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useOrganization } from '../contexts/OrganizationContext';
import { contactService, Contact, CreateContactData, UpdateContactData } from '../services/contactService';

interface ContactsProps {
  searchTerm: string;
}

const Contacts: React.FC<ContactsProps> = ({ searchTerm }) => {
  const { t } = useLanguage();
  const { currentOrganization } = useOrganization();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
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

  const [formData, setFormData] = useState<Omit<CreateContactData, 'organisation_id'>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    location: '',
    status: 'Active',
  });

  // Load contacts on component mount and when organization changes
  useEffect(() => {
    if (currentOrganization) {
      loadContacts();
    } else {
      setContacts([]);
      setLoading(false);
    }
  }, [currentOrganization]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const contactsData = await contactService.getContacts();
      setContacts(contactsData);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error('Failed to load contacts:', err);
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

    if (error?.message?.includes('email')) {
      return 'Format d\'email invalide.';
    }

    // Generic error message
    return error?.message || 'Une erreur inattendue s\'est produite. Veuillez réessayer.';
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.position || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const generateAvatar = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      location: '',
      status: 'Active',
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
    if (!formData.name.trim()) {
      return 'Le nom est obligatoire.';
    }
    if (!formData.email.trim()) {
      return 'L\'email est obligatoire.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Format d\'email invalide.';
    }
    if (formData.name.trim().length < 2) {
      return 'Le nom doit contenir au moins 2 caractères.';
    }
    return null;
  };

  const handleAddContact = async () => {
    const validationError = validateForm();
    if (validationError) {
      showErrorMessage(validationError);
      return;
    }

    try {
      setOperationLoading(prev => ({ ...prev, create: true }));
      await contactService.createContact(formData);
      await loadContacts(); // Reload contacts
      resetForm();
      setShowAddModal(false);
      showSuccessMessage('Contact créé avec succès ! 🎉');
    } catch (err) {
      console.error('Failed to create contact:', err);
      const errorMessage = getErrorMessage(err);
      showErrorMessage(`Échec de la création : ${errorMessage}`);
    } finally {
      setOperationLoading(prev => ({ ...prev, create: false }));
    }
  };

  const handleEditContact = async () => {
    const validationError = validateForm();
    if (validationError) {
      showErrorMessage(validationError);
      return;
    }

    if (!selectedContact) {
      showErrorMessage('Aucun contact sélectionné.');
      return;
    }

    try {
      setOperationLoading(prev => ({ ...prev, update: true }));
      await contactService.updateContact(selectedContact.id, formData);
      await loadContacts(); // Reload contacts
      setShowEditModal(false);
      setSelectedContact(null);
      resetForm();
      showSuccessMessage('Contact mis à jour avec succès ! ✅');
    } catch (err) {
      console.error('Failed to update contact:', err);
      const errorMessage = getErrorMessage(err);
      showErrorMessage(`Échec de la mise à jour : ${errorMessage}`);
    } finally {
      setOperationLoading(prev => ({ ...prev, update: false }));
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) {
      showErrorMessage('Aucun contact sélectionné.');
      return;
    }

    try {
      setOperationLoading(prev => ({ ...prev, delete: true }));
      await contactService.deleteContact(selectedContact.id);
      await loadContacts(); // Reload contacts
      setShowDeleteModal(false);
      setSelectedContact(null);
      showSuccessMessage('Contact supprimé avec succès ! 🗑️');
    } catch (err) {
      console.error('Failed to delete contact:', err);
      const errorMessage = getErrorMessage(err);
      showErrorMessage(`Échec de la suppression : ${errorMessage}`);
    } finally {
      setOperationLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const openEditModal = (contact: Contact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      company: contact.company || '',
      position: contact.position || '',
      location: contact.location || '',
      status: contact.status,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (contact: Contact) => {
    setSelectedContact(contact);
    setShowDeleteModal(true);
  };

  const retryLoadContacts = () => {
    setError(null);
    loadContacts();
  };

  if (!currentOrganization) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Building size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune organisation</h3>
          <p className="text-gray-600">Vous devez être membre d'une organisation pour gérer les contacts.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
          <p className="text-gray-600">Chargement des contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t('allContacts')}</h3>
          <p className="text-sm text-gray-600">
            {t('manageContacts')} - Organisation: {currentOrganization.name}
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
          <span>{t('addContact')}</span>
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
              onClick={retryLoadContacts}
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

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-semibold">
                  {generateAvatar(contact.name)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                  <p className="text-sm text-gray-600">{contact.position || 'Position non renseignée'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => openEditModal(contact)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Modifier le contact"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => openDeleteModal(contact)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Supprimer le contact"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Building size={14} />
                <span>{contact.company || 'Entreprise non renseignée'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail size={14} />
                <span className="truncate">{contact.email}</span>
              </div>
              {contact.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone size={14} />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.location && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin size={14} />
                  <span>{contact.location}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                {contact.status}
              </span>
              <span className="text-xs text-gray-500">
                Créé le {new Date(contact.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun contact trouvé</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Essayez d\'ajuster vos termes de recherche ou ajoutez un nouveau contact.'
              : 'Commencez par ajouter votre premier contact.'
            }
          </p>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{t('addNewContact')}</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={operationLoading.create}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')} *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le nom complet"
                  disabled={operationLoading.create}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')} *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez l'adresse email"
                  disabled={operationLoading.create}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le numéro de téléphone"
                  disabled={operationLoading.create}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('position')}</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le titre du poste"
                  disabled={operationLoading.create}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('location')}</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez la localisation"
                  disabled={operationLoading.create}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('status')}</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={operationLoading.create}
                >
                  <option value="Active">Actif</option>
                  <option value="Inactive">Inactif</option>
                  <option value="Pending">En attente</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={operationLoading.create}
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleAddContact}
                disabled={!formData.name || !formData.email || operationLoading.create}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {operationLoading.create ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Création...</span>
                  </>
                ) : (
                  <span>{t('addContact')}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {showEditModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{t('editContact')}</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={operationLoading.update}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')} *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le nom complet"
                  disabled={operationLoading.update}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')} *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez l'adresse email"
                  disabled={operationLoading.update}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le numéro de téléphone"
                  disabled={operationLoading.update}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('position')}</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le titre du poste"
                  disabled={operationLoading.update}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('location')}</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez la localisation"
                  disabled={operationLoading.update}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('status')}</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={operationLoading.update}
                >
                  <option value="Active">Actif</option>
                  <option value="Inactive">Inactif</option>
                  <option value="Pending">En attente</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={operationLoading.update}
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleEditContact}
                disabled={!formData.name || !formData.email || operationLoading.update}
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
      {showDeleteModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{t('deleteContact')}</h3>
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
                Êtes-vous sûr de vouloir supprimer <strong>{selectedContact.name}</strong> ? 
                Toutes les données associées seront définitivement perdues.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={operationLoading.delete}
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDeleteContact}
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

export default Contacts;