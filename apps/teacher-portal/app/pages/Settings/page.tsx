'use client'

import React, { useState } from 'react';
import {
    Save, User, Mail, Phone, Building, Lock, Bell,
    Globe, Download, Upload, Shield, Key, Clock,
    Eye, EyeOff, Calendar
} from 'lucide-react';

const TeacherSettingsPage: React.FC = () => {
    const [settings, setSettings] = useState({
        // Informations personnelles
        prenom: 'Fatou',
        nom: 'Ndiaye',
        email: 'fatou.ndiaye@campus.sn',
        telephone: '+221 77 123 45 67',
        departement: 'Mathématiques',
        bureau: 'Bâtiment A, Bureau 203',

        // Paramètres de compte
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showPassword: false,

        // Notifications
        emailNotifications: true,
        pushNotifications: true,
        assignmentAlerts: true,
        messageAlerts: true,
        gradeAlerts: false,

        // Préférences
        language: 'fr',
        timezone: 'GMT+1 (Dakar)',
        dateFormat: 'DD/MM/YYYY',
        theme: 'light',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setSettings(prev => ({ ...prev, [name]: checked }));
        } else {
            setSettings(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Paramètres sauvegardés:', settings);
        alert('Paramètres sauvegardés avec succès !');
    };

    const togglePasswordVisibility = () => {
        setSettings(prev => ({ ...prev, showPassword: !prev.showPassword }));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Paramètres</h1>
                    <p className="text-gray-600 mt-1">Gérez vos préférences et informations</p>
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
                {/* Informations personnelles */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <User className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Informations personnelles</h2>
                            <p className="text-gray-600 text-sm">Mettez à jour vos informations de contact</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Prénom</label>
                            <input
                                type="text"
                                name="prenom"
                                value={settings.prenom}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Nom</label>
                            <input
                                type="text"
                                name="nom"
                                value={settings.nom}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={settings.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Téléphone</label>
                            <input
                                type="tel"
                                name="telephone"
                                value={settings.telephone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Département</label>
                            <input
                                type="text"
                                name="departement"
                                value={settings.departement}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Bureau</label>
                            <input
                                type="text"
                                name="bureau"
                                value={settings.bureau}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Sécurité du compte */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Shield className="text-red-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Sécurité du compte</h2>
                            <p className="text-gray-600 text-sm">Modifiez votre mot de passe et paramètres de sécurité</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Mot de passe actuel</label>
                            <div className="relative">
                                <input
                                    type={settings.showPassword ? 'text' : 'password'}
                                    name="currentPassword"
                                    value={settings.currentPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {settings.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Nouveau mot de passe</label>
                                <input
                                    type={settings.showPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    value={settings.newPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Confirmer le mot de passe</label>
                                <input
                                    type={settings.showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={settings.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Conseils de sécurité</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Utilisez au moins 8 caractères</li>
                                <li>• Combinez lettres majuscules et minuscules</li>
                                <li>• Ajoutez des chiffres et symboles spéciaux</li>
                                <li>• Évitez les mots de passe courants</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Bell className="text-green-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                            <p className="text-gray-600 text-sm">Configurez vos préférences de notification</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium text-gray-900">Notifications par email</div>
                                <div className="text-sm text-gray-600">Recevoir des emails pour les mises à jour</div>
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

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium text-gray-900">Alertes de nouveaux devoirs</div>
                                <div className="text-sm text-gray-600">Soumissions d'étudiants</div>
                            </div>
                            <label className="relative inline-block w-12 h-6 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="assignmentAlerts"
                                    checked={settings.assignmentAlerts}
                                    onChange={handleInputChange}
                                    className="sr-only peer"
                                />
                                <div className="w-full h-full bg-gray-300 peer-checked:bg-blue-600 rounded-full peer transition"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium text-gray-900">Notifications de messages</div>
                                <div className="text-sm text-gray-600">Nouveaux messages des étudiants</div>
                            </div>
                            <label className="relative inline-block w-12 h-6 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="messageAlerts"
                                    checked={settings.messageAlerts}
                                    onChange={handleInputChange}
                                    className="sr-only peer"
                                />
                                <div className="w-full h-full bg-gray-300 peer-checked:bg-blue-600 rounded-full peer transition"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium text-gray-900">Alertes de notes</div>
                                <div className="text-sm text-gray-600">Publication de nouvelles notes</div>
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

                {/* Préférences */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Globe className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Préférences</h2>
                            <p className="text-gray-600 text-sm">Personnalisez votre expérience</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            </select>
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
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Format de date</label>
                            <select
                                name="dateFormat"
                                value={settings.dateFormat}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Thème</label>
                            <select
                                name="theme"
                                value={settings.theme}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="light">Clair</option>
                                <option value="dark">Sombre</option>
                                <option value="auto">Automatique</option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default TeacherSettingsPage;