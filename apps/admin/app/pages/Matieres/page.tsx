'use client';

import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Edit, Trash2, Search, Power, PowerOff, Award, Clock } from 'lucide-react';
import { MatiereService, Matiere } from '@repo/api';
import MatiereForm from '../../components/matieres/MatiereForm';

const MatieresPage: React.FC = () => {
    const [matieres, setMatieres] = useState<Matiere[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [editMatiere, setEditMatiere] = useState<Matiere | null>(null);

    const [searchQuery, setSearchQuery] = useState('');

    /**
     * Charge les matières
     */
    const loadMatieres = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('📥 Chargement des matières...');

            const response = await MatiereService.getMatieres();

            console.log('✅ Matières chargées:', response);

            setMatieres(response);
        } catch (err: any) {
            console.error('❌ Erreur chargement matières:', err);
            setError(err.message || 'Erreur lors du chargement des matières');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Charge au montage
     */
    useEffect(() => {
        loadMatieres();
    }, []);

    /**
     * Filtre les matières
     */
    const filteredMatieres = matieres.filter(
        (mat) =>
            mat.libelle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mat.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mat.moduleLibelle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /**
     * Supprime une matière
     */
    const handleDelete = async (matiereId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
            return;
        }

        try {
            console.log('🗑️ Suppression matière:', matiereId);
            await MatiereService.deleteMatiere(matiereId);
            alert('Matière supprimée avec succès');
            loadMatieres();
        } catch (err: any) {
            console.error('❌ Erreur suppression:', err);
            alert(err.message || 'Erreur lors de la suppression');
        }
    };

    /**
     * Active/Désactive une matière
     */
    const handleToggleActive = async (matiere: Matiere) => {
        try {
            if (matiere.actif) {
                console.log('❌ Désactivation matière:', matiere.id);
                await MatiereService.deactivateMatiere(matiere.id);
                alert('Matière désactivée avec succès');
            } else {
                console.log('✅ Activation matière:', matiere.id);
                await MatiereService.activateMatiere(matiere.id);
                alert('Matière activée avec succès');
            }
            loadMatieres();
        } catch (err: any) {
            console.error('❌ Erreur activation/désactivation:', err);
            alert(err.message || "Erreur lors de l'opération");
        }
    };

    /**
     * Ouvre le formulaire d'édition
     */
    const handleEdit = (matiere: Matiere) => {
        console.log('✏️ Édition matière:', matiere);
        setEditMatiere(matiere);
        setShowForm(true);
    };

    /**
     * Callback après création/modification réussie
     */
    const handleFormSuccess = () => {
        setShowForm(false);
        setEditMatiere(null);
        loadMatieres();
    };

    /**
     * Calcule les stats
     */
    const activeMatieres = matieres.filter((m) => m.actif).length;
    const inactiveMatieres = matieres.filter((m) => m.actif === false).length;
    const totalVolumeHoraire = matieres.reduce((sum, m) => sum + m.volumeHoraire, 0);
    const totalCoefficients = matieres.reduce((sum, m) => sum + m.coefficient, 0);

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
                        Gestion des matières
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {matieres.length} matière{matieres.length > 1 ? 's' : ''} au total
                    </p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditMatiere(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={20} />
                    Ajouter une matière
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <BookOpen size={24} />
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Actives</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{activeMatieres}</div>
                    <div className="text-lg font-medium">Matières actives</div>
                    <p className="text-blue-100 text-sm mt-2">En cours d'enseignement</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Clock size={24} />
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Total</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{totalVolumeHoraire}h</div>
                    <div className="text-lg font-medium">Volume horaire</div>
                    <p className="text-green-100 text-sm mt-2">Toutes les matières</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Award size={24} />
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Total</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{totalCoefficients}</div>
                    <div className="text-lg font-medium">Coefficients</div>
                    <p className="text-purple-100 text-sm mt-2">Somme totale</p>
                </div>

                <div className="bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <BookOpen size={24} />
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Inactives</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{inactiveMatieres}</div>
                    <div className="text-lg font-medium">Matières inactives</div>
                    <p className="text-gray-100 text-sm mt-2">Non disponibles</p>
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
                        placeholder="Rechercher une matière..."
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
            {!loading && filteredMatieres.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Matière
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Module
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Coefficient
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Volume horaire
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
                            {filteredMatieres.map((mat) => (
                                <tr key={mat.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                <BookOpen size={18} className="text-white" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{mat.libelle}</div>
                                                <div className="text-sm text-gray-500">{mat.code}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {mat.moduleLibelle}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Award size={16} className="text-gray-400" />
                                            <span className="text-lg font-bold text-gray-900">{mat.coefficient}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-gray-400" />
                                            <span className="text-lg font-bold text-gray-900">{mat.volumeHoraire}h</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                      <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                              mat.actif
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {mat.actif ? 'Active' : 'Inactive'}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(mat)}
                                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                                                title="Modifier"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(mat)}
                                                className={`p-2 rounded-lg transition ${
                                                    mat.actif
                                                        ? 'hover:bg-red-50 text-red-600'
                                                        : 'hover:bg-green-50 text-green-600'
                                                }`}
                                                title={mat.actif ? 'Désactiver' : 'Activer'}
                                            >
                                                {mat.actif ? <PowerOff size={16} /> : <Power size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(mat.id)}
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
            {!loading && filteredMatieres.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Aucune matière
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {searchQuery
                            ? 'Aucune matière trouvée pour cette recherche'
                            : 'Commencez par créer votre première matière'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={() => {
                                setShowForm(true);
                                setEditMatiere(null);
                            }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <Plus size={20} />
                            Créer une matière
                        </button>
                    )}
                </div>
            )}

            {/* Details Section */}
            {!loading && filteredMatieres.length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Répartition par module
                    </h2>
                    <div className="space-y-4">
                        {/* Group by module */}
                        {Array.from(new Set(matieres.map((m) => m.moduleLibelle))).map((module) => {
                            const matieresInModule = matieres.filter((m) => m.moduleLibelle === module);
                            const totalHours = matieresInModule.reduce((sum, m) => sum + m.volumeHoraire, 0);

                            return (
                                <div key={module} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900">{module}</span>
                                        <span className="text-sm text-gray-600">
                      {matieresInModule.length} matière{matieresInModule.length > 1 ? 's' : ''} • {totalHours}h
                    </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${(totalHours / totalVolumeHoraire) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Modal */}
            {showForm && (
                <MatiereForm
                    matiere={editMatiere}
                    onClose={() => {
                        setShowForm(false);
                        setEditMatiere(null);
                    }}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default MatieresPage;
