import React from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

const Settings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{t('settings')}</h3>
        <p className="text-sm text-gray-600">{t('preferences')}</p>
      </div>

      {/* Language Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-500 rounded-lg p-3">
            <Globe size={24} className="text-white" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{t('language')}</h4>
            <p className="text-sm text-gray-600">{t('selectLanguage')}</p>
          </div>
        </div>

        <div className="space-y-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-300 ${
                language === lang.code
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{lang.flag}</span>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{lang.name}</div>
                  <div className="text-sm text-gray-500">{lang.code.toUpperCase()}</div>
                </div>
              </div>
              {language === lang.code && (
                <div className="bg-blue-500 rounded-full p-1">
                  <Check size={16} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Settings Sections */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Paramètres Supplémentaires</h4>
        <p className="text-gray-600">Plus d'options de paramètres seront disponibles ici dans les futures mises à jour.</p>
      </div>
    </div>
  );
};

export default Settings;