'use client'

import React, { useState } from 'react';
import { Save, Bell, Shield, Users, Globe, Mail, Lock, Database, Key, Cpu } from 'lucide-react';

const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState({
        // Général
        institutionName: 'CampusMaster',
        contactEmail: 'contact@campus.sn',
        academicYear: '2024-2025',
        timezone: 'GMT+1 (Dakar)',
        language: 'fr',

        // Sécurité
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordPolicy: 'strong',
        ipWhitelist: '',

        // Notifications
        emailNotifications: true,
        systemAlerts: true,
        enrollmentAlerts: true,
        gradeAlerts: true,

        // API
        apiEnabled: true,
        apiRateLimit: 1000,
        corsOrigins: 'https://app.campusmaster.sn',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setSettings(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setSettings(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleNumberChange = (name: string, value: string) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
            setSettings(prev => ({
                ...prev,
                [name]: numValue
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Paramètres sauvegardés:', settings);
        // Ici, vous ajouteriez l'appel API pour sauvegarder les paramètres
        alert('Paramètres sauvegardés avec succès !');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Paramètres système</h1>
                    <p className="text-gray-600 mt-1">Configurez les paramètres de la plateforme</p>
                </div>
                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Save size={20} />
                    Sauvegarder
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section Général */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Globe className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Général</h2>
                            <p className="text-gray-600 text-sm">Paramètres généraux de la plateforme</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nom de l'institution *</label>
                            <input
                                type="text"
                                name="institutionName"
                                value={settings.institutionName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Email de contact *</label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={settings.contactEmail}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Année académique *</label>
                            <input
                                type="text"
                                name="academicYear"
                                value={settings.academicYear}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Fuseau horaire</label>
                            <select
                                name="timezone"
                                value={settings.timezone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="GMT+1 (Dakar)">GMT+1 (Dakar)</option>
                                <option value="GMT+0 (Londres)">GMT+0 (Londres)</option>
                                <option value="GMT+2 (Paris)">GMT+2 (Paris)</option>
                                <option value="GMT-5 (New York)">GMT-5 (New York)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Langue</label>
                            <select
                                name="language"
                                value={settings.language}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="fr">Français</option>
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="ar">العربية</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section Sécurité */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Shield className="text-red-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Sécurité</h2>
                            <p className="text-gray-600 text-sm">Paramètres de sécurité et d'accès</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium text-gray-900">Authentification à deux facteurs</div>
                                <div className="text-sm text-gray-600">Sécurisez les comptes administrateurs</div>
                            </div>
                            <label className="relative inline-block w-14 h-7 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="twoFactorAuth"
                                    checked={settings.twoFactorAuth}
                                    onChange={handleInputChange}
                                    className="sr-only peer"
                                />
                                <div className="w-full h-full bg-gray-300 peer-checked:bg-blue-600 rounded-full peer transition"></div>
                                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full peer-checked:translate-x-7 transition"></div>
                            </label>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <label className="block text-sm font-medium mb-2">Délai d'expiration de session (minutes)</label>
                            <input
                                type="range"
                                name="sessionTimeout"
                                min="5"
                                max="120"
                                value={settings.sessionTimeout}
                                onChange={(e) => handleNumberChange('sessionTimeout', e.target.value)}
                                className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-600 mt-2">
                                <span>5 min</span>
                                <span className="font-medium">{settings.sessionTimeout} min</span>
                                <span>120 min</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Politique de mot de passe</label>
                            <select
                                name="passwordPolicy"
                                value={settings.passwordPolicy}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="weak">Faible (6 caractères)</option>
                                <option value="medium">Moyenne (8 caractères, majuscule)</option>
                                <option value="strong">Forte (12 caractères, complexe)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Whitelist IP (optionnel)</label>
                            <textarea
                                name="ipWhitelist"
                                value={settings.ipWhitelist}
                                onChange={handleInputChange}
                                placeholder="Saisir les adresses IP séparées par des virgules"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                {/* Section Notifications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Bell className="text-green-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                            <p className="text-gray-600 text-sm">Configuration des alertes et notifications</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium text-gray-900">Notifications par email</div>
                                <div className="text-sm text-gray-600">Recevoir les alertes par email</div>
                            </div>
                            <label className="relative inline-block w-12 h-6 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="emailNotifications"
                                    checked={settings.emailNotifications}
                                    onChange={handleInputChange}
                                    className="sr-only peer"
                                />
                                <div className="w-full h-full bg-gray-300 peer-checked:bg-blue-600 rounded-full peer transition"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium text-gray-900">Alertes système</div>
                                <div className="text-sm text-gray-600">Notifications système importantes</div>
                            </div>
                            <label className="relative inline-block w-12 h-6 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="systemAlerts"
                                    checked={settings.systemAlerts}
                                    onChange={handleInputChange}
                                    className="sr-only peer"
                                />
                                <div className="w-full h-full bg-gray-300 peer-checked:bg-blue-600 rounded-full peer transition"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium text-gray-900">Alertes d'inscription</div>
                                <div className="text-sm text-gray-600">Nouveaux étudiants inscrits</div>
                            </div>
                            <label className="relative inline-block w-12 h-6 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="enrollmentAlerts"
                                    checked={settings.enrollmentAlerts}
                                    onChange={handleInputChange}
                                    className="sr-only peer"
                                />
                                <div className="w-full h-full bg-gray-300 peer-checked:bg-blue-600 rounded-full peer transition"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium text-gray-900">Alertes de notes</div>
                                <div className="text-sm text-gray-600">Publications de nouvelles notes</div>
                            </div>
                            <label className="relative inline-block w-12 h-6 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="gradeAlerts"
                                    checked={settings.gradeAlerts}
                                    onChange={handleInputChange}
                                    className="sr-only peer"
                                />
                                <div className="w-full h-full bg-gray-300 peer-checked:bg-blue-600 rounded-full peer transition"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Section API */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Key className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">API et Intégrations</h2>
                            <p className="text-gray-600 text-sm">Configuration de l'API et des intégrations</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium text-gray-900">API REST activée</div>
                                <div className="text-sm text-gray-600">Activer l'accès à l'API REST</div>
                            </div>
                            <label className="relative inline-block w-14 h-7 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="apiEnabled"
                                    checked={settings.apiEnabled}
                                    onChange={handleInputChange}
                                    className="sr-only peer"
                                />
                                <div className="w-full h-full bg-gray-300 peer-checked:bg-blue-600 rounded-full peer transition"></div>
                                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full peer-checked:translate-x-7 transition"></div>
                            </label>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <label className="block text-sm font-medium mb-2">Limite de requêtes API (par heure)</label>
                            <input
                                type="range"
                                name="apiRateLimit"
                                min="100"
                                max="5000"
                                step="100"
                                value={settings.apiRateLimit}
                                onChange={(e) => handleNumberChange('apiRateLimit', e.target.value)}
                                className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-600 mt-2">
                                <span>100</span>
                                <span className="font-medium">{settings.apiRateLimit}</span>
                                <span>5000</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Origines CORS autorisées</label>
                            <textarea
                                name="corsOrigins"
                                value={settings.corsOrigins}
                                onChange={handleInputChange}
                                placeholder="https://votredomaine.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                                rows={3}
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Saisir les domaines séparés par des virgules. Ex: https://app.campusmaster.sn,https://admin.campusmaster.sn
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SettingsPage;