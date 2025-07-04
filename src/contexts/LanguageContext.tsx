import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  fr: {
    // Navigation
    dashboard: 'Tableau de bord',
    contacts: 'Contacts',
    opportunities: 'Opportunités',
    tasks: 'Tâches',
    calendar: 'Calendrier',
    email: 'Campagnes Email',
    analytics: 'Analyses',
    integrations: 'Intégrations',
    settings: 'Paramètres',
    organizations: 'Organisations',
    
    // Dashboard
    welcomeBack: 'Bon retour, GDP Admin ! 👋',
    welcomeDescription: "Voici ce qui se passe avec votre entreprise aujourd'hui",
    totalContacts: 'Total des Contacts',
    activeOpportunities: 'Opportunités Actives',
    pendingTasks: 'Tâches en Attente',
    revenuePipeline: 'Pipeline de Revenus',
    salesPipeline: 'Pipeline de Ventes',
    recentActivities: 'Activités Récentes',
    quickActions: 'Actions Rapides',
    addNewContact: 'Ajouter un Contact',
    createOpportunity: 'Créer une Opportunité',
    addTask: 'Ajouter une Tâche',
    
    // Common
    search: 'Rechercher',
    searchWithAI: 'Rechercher avec IA...',
    add: 'Ajouter',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    update: 'Mettre à jour',
    create: 'Créer',
    close: 'Fermer',
    confirm: 'Confirmer',
    
    // Settings
    language: 'Langue',
    english: 'English',
    french: 'Français',
    preferences: 'Préférences',
    selectLanguage: 'Sélectionner la langue',
    
    // Organizations
    switchOrganization: 'Changer d\'organisation',
    currentOrganization: 'Organisation actuelle',
    joinOrganization: 'Rejoindre une organisation',
    createOrganization: 'Créer une organisation',
    
    // Landing Page
    signIn: 'Se connecter',
    signUp: 'S\'inscrire',
    getStarted: 'Commencer',
    welcomeBackTitle: 'Bon retour',
    createAccount: 'Créer un compte',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    company: 'Entreprise',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    dontHaveAccount: 'Vous n\'avez pas de compte ?',
    
    // Hero Section
    heroTitle: 'Transformez Votre',
    heroSubtitle: 'Croissance d\'Entreprise',
    heroDescription: 'Rationalisez votre processus de vente, gérez les relations clients et augmentez les revenus avec notre plateforme CRM intelligente conçue pour les entreprises modernes.',
    startFreeTrial: 'Essai Gratuit',
    watchDemo: 'Voir la Démo',
    freeTrial: 'Essai gratuit de 14 jours',
    noCreditCard: 'Aucune carte de crédit requise',
    cancelAnytime: 'Annuler à tout moment',
    
    // Features
    featuresTitle: 'Tout ce dont vous avez besoin pour',
    featuresSubtitle: 'Réussir',
    featuresDescription: 'Des fonctionnalités puissantes conçues pour vous aider à gérer les clients, conclure des affaires et développer votre entreprise.',
    
    // Feature Items
    contactManagement: 'Gestion des Contacts',
    contactManagementDesc: 'Organisez et gérez tous vos contacts professionnels en un seul endroit centralisé avec recherche et filtrage avancés.',
    salesPipelineFeature: 'Pipeline de Ventes',
    salesPipelineDesc: 'Suivez les opportunités à travers chaque étape de votre processus de vente avec une gestion visuelle du pipeline.',
    smartScheduling: 'Planification Intelligente',
    smartSchedulingDesc: 'Planifiez des rendez-vous, réunions et suivis avec une gestion de calendrier intégrée.',
    emailCampaignsFeature: 'Campagnes Email',
    emailCampaignsDesc: 'Créez et gérez des campagnes email ciblées avec des analyses avancées et de l\'automatisation.',
    advancedAnalytics: 'Analyses Avancées',
    advancedAnalyticsDesc: 'Obtenez des insights approfondis sur les performances de votre entreprise avec des rapports et tableaux de bord complets.',
    enterpriseSecurity: 'Sécurité Entreprise',
    enterpriseSecurityDesc: 'Sécurité de niveau bancaire avec chiffrement, contrôles d\'accès sécurisés et normes de conformité.',
    
    // Testimonials
    testimonialsTitle: 'Approuvé par des',
    testimonialsSubtitle: 'Milliers',
    testimonialsDescription: 'Découvrez ce que nos clients disent de GDPilia',
    
    // Pricing
    pricingTitle: 'Tarification Simple et',
    pricingSubtitle: 'Transparente',
    pricingDescription: 'Choisissez le plan qui correspond aux besoins de votre entreprise',
    mostPopular: 'Le Plus Populaire',
    
    // CTA
    ctaTitle: 'Prêt à',
    ctaSubtitle: 'Transformer',
    ctaEnd: 'Votre Entreprise ?',
    ctaDescription: 'Rejoignez des milliers d\'entreprises qui utilisent déjà GDPilia pour augmenter leurs revenus et rationaliser leurs opérations.',
    
    // Contacts
    allContacts: 'Tous les Contacts',
    manageContacts: 'Gérez vos contacts professionnels et relations',
    addContact: 'Ajouter un Contact',
    addNewContact: 'Ajouter un Nouveau Contact',
    editContact: 'Modifier le Contact',
    deleteContact: 'Supprimer le Contact',
    name: 'Nom',
    phone: 'Téléphone',
    position: 'Poste',
    location: 'Localisation',
    status: 'Statut',
    
    // Tasks
    tasksReminders: 'Tâches et Rappels',
    manageTasks: 'Gérez vos tâches et restez au courant des activités importantes',
    addTask: 'Ajouter une Tâche',
    addNewTask: 'Ajouter une Nouvelle Tâche',
    editTask: 'Modifier la Tâche',
    deleteTask: 'Supprimer la Tâche',
    title: 'Titre',
    description: 'Description',
    priority: 'Priorité',
    dueDate: 'Date d\'échéance',
    assignee: 'Assigné à',
    relatedTo: 'Lié à',
    
    // Calendar
    calendarAppointments: 'Calendrier et Rendez-vous',
    scheduleAppointments: 'Planifiez et gérez vos rendez-vous',
    scheduleAppointment: 'Planifier un Rendez-vous',
    addNewAppointment: 'Ajouter un Nouveau Rendez-vous',
    editAppointment: 'Modifier le Rendez-vous',
    deleteAppointment: 'Supprimer le Rendez-vous',
    
    // Opportunities
    salesPipelineTitle: 'Pipeline de Ventes',
    trackOpportunities: 'Suivez et gérez vos opportunités de vente',
    addOpportunity: 'Ajouter une Opportunité',
    addNewOpportunity: 'Ajouter une Nouvelle Opportunité',
    editOpportunity: 'Modifier l\'Opportunité',
    deleteOpportunity: 'Supprimer l\'Opportunité',
    
    // Email
    emailCampaigns: 'Campagnes Email',
    manageEmailCampaigns: 'Créez et gérez vos campagnes de marketing par email',
    createCampaign: 'Créer une Campagne',
    
    // Analytics
    analyticsReports: 'Analyses et Rapports',
    trackPerformance: 'Suivez les performances et insights de votre entreprise',
    
    // Integrations
    integrationsTitle: 'Intégrations',
    connectTools: 'Connectez GDPilia avec vos outils et services préférés',
    requestIntegration: 'Demander une Intégration',
  },
  en: {
    // Navigation
    dashboard: 'Dashboard',
    contacts: 'Contacts',
    opportunities: 'Opportunities',
    tasks: 'Tasks',
    calendar: 'Calendar',
    email: 'Email Campaigns',
    analytics: 'Analytics',
    integrations: 'Integrations',
    settings: 'Settings',
    organizations: 'Organizations',
    
    // Dashboard
    welcomeBack: 'Welcome back, GDP Admin! 👋',
    welcomeDescription: "Here's what's happening with your business today",
    totalContacts: 'Total Contacts',
    activeOpportunities: 'Active Opportunities',
    pendingTasks: 'Pending Tasks',
    revenuePipeline: 'Revenue Pipeline',
    salesPipeline: 'Sales Pipeline',
    recentActivities: 'Recent Activities',
    quickActions: 'Quick Actions',
    addNewContact: 'Add New Contact',
    createOpportunity: 'Create Opportunity',
    addTask: 'Add Task',
    
    // Common
    search: 'Search',
    searchWithAI: 'Search with AI...',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    update: 'Update',
    create: 'Create',
    close: 'Close',
    confirm: 'Confirm',
    
    // Settings
    language: 'Language',
    english: 'English',
    french: 'Français',
    preferences: 'Preferences',
    selectLanguage: 'Select Language',
    
    // Organizations
    switchOrganization: 'Switch Organization',
    currentOrganization: 'Current Organization',
    joinOrganization: 'Join Organization',
    createOrganization: 'Create Organization',
    
    // Landing Page
    signIn: 'Sign In',
    signUp: 'Sign Up',
    getStarted: 'Get Started',
    welcomeBackTitle: 'Welcome Back',
    createAccount: 'Create Account',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    company: 'Company',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: 'Don\'t have an account?',
    
    // Hero Section
    heroTitle: 'Transform Your',
    heroSubtitle: 'Business Growth',
    heroDescription: 'Streamline your sales process, manage customer relationships, and boost revenue with our intelligent CRM platform designed for modern businesses.',
    startFreeTrial: 'Start Free Trial',
    watchDemo: 'Watch Demo',
    freeTrial: '14-day free trial',
    noCreditCard: 'No credit card required',
    cancelAnytime: 'Cancel anytime',
    
    // Features
    featuresTitle: 'Everything You Need to',
    featuresSubtitle: 'Succeed',
    featuresDescription: 'Powerful features designed to help you manage customers, close deals, and grow your business.',
    
    // Feature Items
    contactManagement: 'Contact Management',
    contactManagementDesc: 'Organize and manage all your business contacts in one centralized location with advanced search and filtering.',
    salesPipelineFeature: 'Sales Pipeline',
    salesPipelineDesc: 'Track opportunities through every stage of your sales process with visual pipeline management.',
    smartScheduling: 'Smart Scheduling',
    smartSchedulingDesc: 'Schedule appointments, meetings, and follow-ups with integrated calendar management.',
    emailCampaignsFeature: 'Email Campaigns',
    emailCampaignsDesc: 'Create and manage targeted email campaigns with advanced analytics and automation.',
    advancedAnalytics: 'Advanced Analytics',
    advancedAnalyticsDesc: 'Get deep insights into your business performance with comprehensive reporting and dashboards.',
    enterpriseSecurity: 'Enterprise Security',
    enterpriseSecurityDesc: 'Bank-level security with encryption, secure access controls, and compliance standards.',
    
    // Testimonials
    testimonialsTitle: 'Trusted by',
    testimonialsSubtitle: 'Thousands',
    testimonialsDescription: 'See what our customers are saying about GDPilia',
    
    // Pricing
    pricingTitle: 'Simple,',
    pricingSubtitle: 'Transparent Pricing',
    pricingDescription: 'Choose the plan that fits your business needs',
    mostPopular: 'Most Popular',
    
    // CTA
    ctaTitle: 'Ready to',
    ctaSubtitle: 'Transform',
    ctaEnd: 'Your Business?',
    ctaDescription: 'Join thousands of businesses already using GDPilia to grow their revenue and streamline operations.',
    
    // Contacts
    allContacts: 'All Contacts',
    manageContacts: 'Manage your business contacts and relationships',
    addContact: 'Add Contact',
    addNewContact: 'Add New Contact',
    editContact: 'Edit Contact',
    deleteContact: 'Delete Contact',
    name: 'Name',
    phone: 'Phone',
    position: 'Position',
    location: 'Location',
    status: 'Status',
    
    // Tasks
    tasksReminders: 'Tasks & Reminders',
    manageTasks: 'Manage your tasks and stay on top of important activities',
    addTask: 'Add Task',
    addNewTask: 'Add New Task',
    editTask: 'Edit Task',
    deleteTask: 'Delete Task',
    title: 'Title',
    description: 'Description',
    priority: 'Priority',
    dueDate: 'Due Date',
    assignee: 'Assignee',
    relatedTo: 'Related To',
    
    // Calendar
    calendarAppointments: 'Calendar & Appointments',
    scheduleAppointments: 'Schedule and manage your appointments',
    scheduleAppointment: 'Schedule Appointment',
    addNewAppointment: 'Add New Appointment',
    editAppointment: 'Edit Appointment',
    deleteAppointment: 'Delete Appointment',
    
    // Opportunities
    salesPipelineTitle: 'Sales Pipeline',
    trackOpportunities: 'Track and manage your sales opportunities',
    addOpportunity: 'Add Opportunity',
    addNewOpportunity: 'Add New Opportunity',
    editOpportunity: 'Edit Opportunity',
    deleteOpportunity: 'Delete Opportunity',
    
    // Email
    emailCampaigns: 'Email Campaigns',
    manageEmailCampaigns: 'Create and manage your email marketing campaigns',
    createCampaign: 'Create Campaign',
    
    // Analytics
    analyticsReports: 'Analytics & Reports',
    trackPerformance: 'Track your business performance and insights',
    
    // Integrations
    integrationsTitle: 'Integrations',
    connectTools: 'Connect GDPilia with your favorite tools and services',
    requestIntegration: 'Request Integration',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('gdpilia-language');
    return (saved as Language) || 'fr'; // French as default
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('gdpilia-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['fr']] || key;
  };

  useEffect(() => {
    localStorage.setItem('gdpilia-language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};