'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Building, Edit, Trash2, Search } from 'lucide-react';
import { DepartmentService, Department } from '@repo/api';
import DepartmentForm from '../../components/departments/DepartmentForm';

const DepartmentsPage: React.FC = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [editDepartment, setEditDepartment] = useState<Department | null>(null);

    const [searchQuery, setSearchQuery] = useState('');

    /**
     * Charge les départements
     */
    const loadDepartments = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('📥 Chargement des départements...');

            const response = await DepartmentService.getDepartments();

            console.log('✅ Départements chargés:', response);

            setDepartments(response);
        } catch (err: any) {
            console.error('❌ Erreur chargement départements:', err);
            setError(err.message || 'Erreur lors du chargement des départements');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Charge au montage
     */
    useEffect(() => {
        loadDepartments();
    }, []);

    /**
     * Filtre les départements
     */
    const filteredDepartments = departments.filter(
        (dept) =>
            dept.libelle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dept.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /**
     * Supprime un département
     */
    const handleDelete = async (departmentId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) {
            return;
        }

        try {
            console.log('🗑️ Suppression département:', departmentId);
            await DepartmentService.deleteDepartment(departmentId);
            alert('Département supprimé avec succès');
            loadDepartments();
        } catch (err: any) {
            console.error('❌ Erreur suppression:', err);
            alert(err.message || 'Erreur lors de la suppression');
        }
    };

    /**
     * Ouvre le formulaire d'édition
     */
    const handleEdit = (department: Department) => {
        console.log('✏️ Édition département:', department);
        setEditDepartment(department);
        setShowForm(true);
    };

    /**
     * Callback après création/modification réussie
     */
    const handleFormSuccess = () => {
        setShowForm(false);
        setEditDepartment(null);
        loadDepartments();
    };

    /**
     * Format de date
     */
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Gestion des départements
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {departments.length} département{departments.length > 1 ? 's' : ''} au total
                    </p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditDepartment(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={20} />
                    Ajouter département
                </button>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Total des départements</h3>
                        <p className="text-3xl font-bold">{departments.length}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <Building size={32} />
                    </div>
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
                        placeholder="Rechercher un département..."
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

            {/* Grid of Departments */}
            {!loading && filteredDepartments.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredDepartments.map((dept) => (
                        <div
                            key={dept.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Building size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {dept.libelle}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Créé le {formatDate(dept.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <p className="text-gray-600 line-clamp-3">{dept.description}</p>
                            </div>

                            {/* Info */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">ID:</span>
                                        <span className="ml-2 font-medium text-gray-900">#{dept.id}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Mise à jour:</span>
                                        <span className="ml-2 font-medium text-gray-900">
                      {new Date(dept.updatedAt).toLocaleDateString('fr-FR')}
                    </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleEdit(dept)}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                >
                                    <Edit size={16} />
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleDelete(dept.id)}
                                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={16} />
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && filteredDepartments.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Building className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Aucun département
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {searchQuery
                            ? 'Aucun département trouvé pour cette recherche'
                            : 'Commencez par créer votre premier département'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={() => {
                                setShowForm(true);
                                setEditDepartment(null);
                            }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <Plus size={20} />
                            Créer un département
                        </button>
                    )}
                </div>
            )}

            {/* Statistics Section */}
            {!loading && departments.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Statistiques des départements
                    </h2>
                    <div className="space-y-4">
                        {departments.map((dept, index) => (
                            <div key={dept.id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-900">{dept.libelle}</span>
                                    <span className="text-sm text-gray-600">
                    Créé il y a{' '}
                                        {Math.floor(
                                            (new Date().getTime() - new Date(dept.createdAt).getTime()) /
                                            (1000 * 3600 * 24)
                                        )}{' '}
                                        jours
                  </span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${((index + 1) / departments.length) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal */}
            {showForm && (
                <DepartmentForm
                    department={editDepartment}
                    onClose={() => {
                        setShowForm(false);
                        setEditDepartment(null);
                    }}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default DepartmentsPage;
