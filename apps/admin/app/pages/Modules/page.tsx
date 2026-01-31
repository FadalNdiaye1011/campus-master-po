'use client';

import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Edit, Trash2, Search, Power, PowerOff, Building, Calendar, Award } from 'lucide-react';
import { ModuleService, Module } from '@repo/api';
import ModuleForm from '../../components/modules/ModuleForm';

const ModulesPage: React.FC = () => {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [editModule, setEditModule] = useState<Module | null>(null);

    const [searchQuery, setSearchQuery] = useState('');

    /**
     * Charge les modules
     */
    const loadModules = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('📥 Chargement des modules...');

            const response = await ModuleService.getModules();

            console.log('✅ Modules chargés:', response);

            setModules(response);
        } catch (err: any) {
            console.error('❌ Erreur chargement modules:', err);
            setError(err.message || 'Erreur lors du chargement des modules');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Charge au montage
     */
    useEffect(() => {
        loadModules();
    }, []);

    /**
     * Filtre les modules
     */
    const filteredModules = modules.filter(
        (mod) =>
            mod.libelle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mod.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mod.departementNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mod.semestreLibelle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /**
     * Supprime un module
     */
    const handleDelete = async (moduleId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
            return;
        }

        try {
            console.log('🗑️ Suppression module:', moduleId);
            await ModuleService.deleteModule(moduleId);
            alert('Module supprimé avec succès');
            loadModules();
        } catch (err: any) {
            console.error('❌ Erreur suppression:', err);
            alert(err.message || 'Erreur lors de la suppression');
        }
    };

    /**
     * Active/Désactive un module
     */
    const handleToggleActive = async (module: Module) => {
        try {
            if (module.actif) {
                console.log('❌ Désactivation module:', module.id);
                await ModuleService.deactivateModule(module.id);
                alert('Module désactivé avec succès');
            } else {
                console.log('✅ Activation module:', module.id);
                await ModuleService.activateModule(module.id);
                alert('Module activé avec succès');
            }
            loadModules();
        } catch (err: any) {
            console.error('❌ Erreur activation/désactivation:', err);
            alert(err.message || "Erreur lors de l'opération");
        }
    };

    /**
     * Ouvre le formulaire d'édition
     */
    const handleEdit = (module: Module) => {
        console.log('✏️ Édition module:', module);
        setEditModule(module);
        setShowForm(true);
    };

    /**
     * Callback après création/modification réussie
     */
    const handleFormSuccess = () => {
        setShowForm(false);
        setEditModule(null);
        loadModules();
    };

    /**
     * Calcule les stats
     */
    const activeModules = modules.filter((m) => m.actif).length;
    const inactiveModules = modules.filter((m) => m.actif === false).length;
    const totalCredits = modules.reduce((sum, m) => sum + m.credits, 0);

    /**
     * Format de date
     */
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Gestion des modules
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {modules.length} module{modules.length > 1 ? 's' : ''} au total
                    </p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditModule(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={20} />
                    Ajouter un module
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <BookOpen size={24} />
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Actifs</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{activeModules}</div>
                    <div className="text-lg font-medium">Modules actifs</div>
                    <p className="text-blue-100 text-sm mt-2">En cours d'enseignement</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Award size={24} />
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Total</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{totalCredits}</div>
                    <div className="text-lg font-medium">Crédits totaux</div>
                    <p className="text-green-100 text-sm mt-2">Tous les modules</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Calendar size={24} />
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Inactifs</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{inactiveModules}</div>
                    <div className="text-lg font-medium">Modules inactifs</div>
                    <p className="text-purple-100 text-sm mt-2">Non disponibles</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="Rechercher un module..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600" />
                    <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
            )}

            {/* Table */}
            {!loading && filteredModules.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Module
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Département
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Semestre
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Crédits
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Statut
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {filteredModules.map((mod) => (
                                <tr key={mod.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                <BookOpen size={18} className="text-white" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{mod.libelle}</div>
                                                <div className="text-sm text-gray-500">{mod.code}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Building size={16} className="text-gray-400" />
                                            <span className="text-gray-700">{mod.departementNom}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-gray-400" />
                                            <span className="text-gray-700">{mod.semestreLibelle}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Award size={16} className="text-gray-400" />
                                            <span className="text-lg font-bold text-gray-900">{mod.credits}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                      <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                              mod.actif
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {mod.actif ? 'Actif' : 'Inactif'}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(mod)}
                                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                                                title="Modifier"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(mod)}
                                                className={`p-2 rounded-lg transition ${
                                                    mod.actif
                                                        ? 'hover:bg-red-50 text-red-600'
                                                        : 'hover:bg-green-50 text-green-600'
                                                }`}
                                                title={mod.actif ? 'Désactiver' : 'Activer'}
                                            >
                                                {mod.actif ? <PowerOff size={16} /> : <Power size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(mod.id)}
                                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!loading && filteredModules.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Aucun module
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {searchQuery
                            ? 'Aucun module trouvé pour cette recherche'
                            : 'Commencez par créer votre premier module'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={() => {
                                setShowForm(true);
                                setEditModule(null);
                            }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <Plus size={20} />
                            Créer un module
                        </button>
                    )}
                </div>
            )}

            {/* Modal */}
            {showForm && (
                <ModuleForm
                    module={editModule}
                    onClose={() => {
                        setShowForm(false);
                        setEditModule(null);
                    }}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default ModulesPage;
