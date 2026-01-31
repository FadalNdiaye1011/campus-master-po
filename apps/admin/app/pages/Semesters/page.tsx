'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Calendar, Clock, CheckCircle, XCircle, Power, PowerOff, Trash2 } from 'lucide-react';
import { SemesterService, Semester } from '@repo/api';
import SemesterForm from '../../components/semesters/SemesterForm';

const SemestersPage: React.FC = () => {
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [editSemester, setEditSemester] = useState<Semester | null>(null);

    const [searchQuery, setSearchQuery] = useState('');

    /**
     * Charge les semestres
     */
    const loadSemesters = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('📥 Chargement des semestres...');

            const response = await SemesterService.getSemesters();

            console.log('✅ Semestres chargés:', response);

            setSemesters(response);
        } catch (err: any) {
            console.error('❌ Erreur chargement semestres:', err);
            setError(err.message || 'Erreur lors du chargement des semestres');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Charge au montage
     */
    useEffect(() => {
        loadSemesters();
    }, []);

    /**
     * Filtre les semestres
     */
    const filteredSemesters = semesters.filter(sem =>
        sem.libelle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sem.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sem.anneeAcademique.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /**
     * Supprime un semestre
     */
    const handleDelete = async (semesterId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce semestre ?')) {
            return;
        }

        try {
            console.log('🗑️ Suppression semestre:', semesterId);
            await SemesterService.deleteSemester(semesterId);
            alert('Semestre supprimé avec succès');
            loadSemesters();
        } catch (err: any) {
            console.error('❌ Erreur suppression:', err);
            alert(err.message || 'Erreur lors de la suppression');
        }
    };

    /**
     * Active/Désactive un semestre
     */
    const handleToggleActive = async (semester: Semester) => {
        try {
            if (semester.actif) {
                console.log('❌ Désactivation semestre:', semester.id);
                await SemesterService.deactivateSemester(semester.id);
                alert('Semestre désactivé avec succès');
            } else {
                console.log('✅ Activation semestre:', semester.id);
                await SemesterService.activateSemester(semester.id);
                alert('Semestre activé avec succès');
            }
            loadSemesters();
        } catch (err: any) {
            console.error('❌ Erreur activation/désactivation:', err);
            alert(err.message || 'Erreur lors de l\'opération');
        }
    };

    /**
     * Ouvre le formulaire d'édition
     */
    const handleEdit = (semester: Semester) => {
        console.log('✏️ Édition semestre:', semester);
        setEditSemester(semester);
        setShowForm(true);
    };

    /**
     * Callback après création/modification réussie
     */
    const handleFormSuccess = () => {
        setShowForm(false);
        setEditSemester(null);
        loadSemesters();
    };

    /**
     * Calcule les stats
     */
    const activeSemesters = semesters.filter(s => s.actif).length;
    const inactiveSemesters = semesters.filter(s => !s.actif).length;

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

    /**
     * Calcule la durée en mois
     */
    const calculateDuration = (dateDebut: string, dateFin: string) => {
        const start = new Date(dateDebut);
        const end = new Date(dateFin);
        const months = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24 * 30));
        return months;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Gestion des semestres
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {semesters.length} semestre{semesters.length > 1 ? 's' : ''} au total
                    </p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditSemester(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={20} />
                    Ajouter semestre
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="text-green-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{activeSemesters}</div>
                            <div className="text-gray-600">Semestre{activeSemesters > 1 ? 's' : ''} actif{activeSemesters > 1 ? 's' : ''}</div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">Actuellement en cours</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <XCircle className="text-gray-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{inactiveSemesters}</div>
                            <div className="text-gray-600">Semestre{inactiveSemesters > 1 ? 's' : ''} inactif{inactiveSemesters > 1 ? 's' : ''}</div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">Non actifs</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{semesters.length}</div>
                            <div className="text-gray-600">Total</div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">Tous les semestres</div>
                </div>
            </div>

            {/* Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {/* Barre de recherche */}
                <div className="p-6 border-b border-gray-100">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Rechercher un semestre..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="p-4 bg-red-50 border-b border-red-100 text-red-700">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600" />
                        <p className="mt-4 text-gray-600">Chargement...</p>
                    </div>
                )}

                {/* Table */}
                {!loading && filteredSemesters.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Semestre
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Code
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Période
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Durée
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
                            {filteredSemesters.map((sem) => {
                                const duration = calculateDuration(sem.dateDebut, sem.dateFin);

                                return (
                                    <tr key={sem.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                    <Calendar size={18} className="text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{sem.libelle}</div>
                                                    <div className="text-sm text-gray-500">{sem.anneeAcademique}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                          {sem.code}
                        </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="text-gray-900">{formatDate(sem.dateDebut)}</div>
                                                <div className="text-gray-500">→ {formatDate(sem.dateFin)}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-gray-400" />
                                                <span className="text-gray-900">{duration} mois</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                        <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                                sem.actif
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {sem.actif ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            {sem.actif ? 'Actif' : 'Inactif'}
                        </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(sem)}
                                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                                                    title="Modifier"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(sem)}
                                                    className={`p-2 rounded-lg transition ${
                                                        sem.actif
                                                            ? 'hover:bg-red-50 text-red-600'
                                                            : 'hover:bg-green-50 text-green-600'
                                                    }`}
                                                    title={sem.actif ? 'Désactiver' : 'Activer'}
                                                >
                                                    {sem.actif ? <PowerOff size={16} /> : <Power size={16} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(sem.id)}
                                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Empty state */}
                {!loading && filteredSemesters.length === 0 && (
                    <div className="p-12 text-center">
                        <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-600">
                            {searchQuery
                                ? 'Aucun semestre trouvé pour cette recherche'
                                : 'Aucun semestre'}
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showForm && (
                <SemesterForm
                    semester={editSemester}
                    onClose={() => {
                        setShowForm(false);
                        setEditSemester(null);
                    }}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default SemestersPage;
