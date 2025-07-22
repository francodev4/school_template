import React, { useState } from 'react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')

  // Exemple de données de configuration
  const [settings, setSettings] = useState({
    schoolName: 'Collège Saint-Joseph',
    address: '123 Rue de l\'École',
    phone: '01 23 45 67 89',
    email: 'contact@college-stjoseph.fr',
    academicYear: '2023-2024',
    notificationsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    backupFrequency: 'daily',
    theme: 'light',
    language: 'fr'
  })

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Paramètres</h1>

      {/* Onglets */}
      <div className="mb-6 border-b">
        <div className="flex space-x-8">
          <button
            className={`pb-4 px-2 ${
              activeTab === 'general'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('general')}
          >
            Général
          </button>
          <button
            className={`pb-4 px-2 ${
              activeTab === 'notifications'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button
            className={`pb-4 px-2 ${
              activeTab === 'security'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('security')}
          >
            Sécurité
          </button>
          <button
            className={`pb-4 px-2 ${
              activeTab === 'system'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('system')}
          >
            Système
          </button>
        </div>
      </div>

      {/* Contenu des paramètres */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Paramètres Généraux</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'établissement
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={settings.schoolName}
                  onChange={(e) => handleSettingChange('schoolName', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={settings.address}
                  onChange={(e) => handleSettingChange('address', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={settings.phone}
                  onChange={(e) => handleSettingChange('phone', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg"
                  value={settings.email}
                  onChange={(e) => handleSettingChange('email', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Année scolaire
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={settings.academicYear}
                  onChange={(e) => handleSettingChange('academicYear', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Langue
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Paramètres de Notifications</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Activer les notifications</h3>
                  <p className="text-sm text-gray-500">Recevoir des notifications du système</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.notificationsEnabled}
                    onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Notifications par email</h3>
                  <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Notifications SMS</h3>
                  <p className="text-sm text-gray-500">Recevoir des notifications par SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.smsNotifications}
                    onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Paramètres de Sécurité</h2>
            
            <div className="space-y-4">
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Changer le mot de passe
              </button>
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Configurer l'authentification à deux facteurs
              </button>
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Gérer les permissions des utilisateurs
              </button>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Paramètres Système</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Sauvegarde automatique</h3>
                  <p className="text-sm text-gray-500">Sauvegarder automatiquement les données</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.autoBackup}
                    onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fréquence de sauvegarde
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={settings.backupFrequency}
                  onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                >
                  <option value="hourly">Toutes les heures</option>
                  <option value="daily">Quotidienne</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuelle</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thème
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="system">Système</option>
                </select>
              </div>

              <button className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                Réinitialiser tous les paramètres
              </button>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="mt-6 flex justify-end space-x-4">
          <button className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
            Annuler
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings 