'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Eye, Trash2, RefreshCw, Users as UsersIcon } from 'lucide-react';
import { UserService, User } from '@repo/api';
import UserForm from '../../components/users/UserForm';
import UserDetails from '../../components/users/UserDetails';

const UsersPage: React.FC = () => {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [searchQuery, setSearchQuery] = useState('');

    /**
     * Charge les utilisateurs
     */
    const loadUsers = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('📥 Chargement des utilisateurs...');

            const response = await UserService.getUsers();

            console.log('✅ Utilisateurs chargés:', response.length);

            setAllUsers(response);
            setFilteredUsers(response);
        } catch (err: any) {
            console.error('❌ Erreur chargement users:', err);
            setError(err.message || 'Erreur lors du chargement des utilisateurs');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Charge au montage
     */
    useEffect(() => {
        loadUsers();
    }, []);

    /**
     * Filtre local quand la recherche change
     */
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(allUsers);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = allUsers.filter(user =>
                user.firstName.toLowerCase().includes(query) ||
                user.lastName.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.username.toLowerCase().includes(query) ||
                user.phoneNumber.toLowerCase().includes(query)
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, allUsers]);

    /**
     * Supprime un utilisateur
     */
    const handleDelete = async (userId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            return;
        }

        try {
            console.log('🗑️ Suppression utilisateur:', userId);
            await UserService.deleteUser(userId);
            alert('Utilisateur supprimé avec succès');
            loadUsers();
        } catch (err: any) {
            console.error('❌ Erreur suppression:', err);
            alert(err.message || 'Erreur lors de la suppression');
        }
    };

    /**
     * Ouvre le formulaire d'édition
     */
    const handleEdit = (user: User) => {
        console.log('✏️ Édition utilisateur:', user);
        setEditUser(user);
        setShowForm(true);
    };

    /**
     * Affiche les détails
     */
    const handleViewDetails = (user: User) => {
        console.log('👁️ Affichage détails utilisateur:', user);
        setSelectedUser(user);
        setShowDetails(true);
    };

    /**
     * Callback après création/modification réussie
     */
    const handleFormSuccess = () => {
        setShowForm(false);
        setEditUser(null);
        loadUsers();
    };

    /**
     * Traduit le rôle en français
     */
    const translateRole = (role: string): string => {
        const roles: Record<string, string> = {
            'STUDENT': 'Étudiant',
            'PROFESSOR': 'Enseignant',
            'ADMIN': 'Administrateur',
        };
        return roles[role] || role;
    };

    /**
     * Traduit le statut en français
     */
    const translateStatus = (status: string): string => {
        const statuses: Record<string, string> = {
            'ACTIVE': 'Actif',
            'INACTIVE': 'Inactif',
            'PENDING': 'En attente',
        };
        return statuses[status] || status;
    };

    /**
     * Couleur du badge statut
     */
    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800';
            case 'INACTIVE':
                return 'bg-gray-100 text-gray-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Gestion des utilisateurs
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {allUsers.length} utilisateur{allUsers.length > 1 ? 's' : ''} au total
                        {searchQuery && ` • ${filteredUsers.length} résultat${filteredUsers.length > 1 ? 's' : ''}`}
                    </p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditUser(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={20} />
                    Ajouter utilisateur
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <UsersIcon size={32} />
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                            {allUsers.filter(u => u.roles.includes('STUDENT')).length}
                        </span>
                    </div>
                    <div className="text-3xl font-bold mb-2">Étudiants</div>
                    <div className="text-blue-100">Total des étudiants</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <UsersIcon size={32} />
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                            {allUsers.filter(u => u.roles.includes('PROFESSOR')).length}
                        </span>
                    </div>
                    <div className="text-3xl font-bold mb-2">Enseignants</div>
                    <div className="text-green-100">Total des enseignants</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <UsersIcon size={32} />
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                            {allUsers.filter(u => u.roles.includes('ADMIN')).length}
                        </span>
                    </div>
                    <div className="text-3xl font-bold mb-2">Administrateurs</div>
                    <div className="text-purple-100">Total des admins</div>
                </div>
            </div>

            {/* Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {/* Barre de recherche */}
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full relative">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Rechercher un utilisateur (nom, email, username, téléphone)..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={loadUsers}
                        className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap"
                        disabled={loading}
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        Actualiser
                    </button>
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
                {!loading && filteredUsers.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Nom complet
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Téléphone
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Rôle
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
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div>
                                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                                            <div className="text-gray-500">@{user.username}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {user.phoneNumber}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                user.roles.includes('STUDENT')
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : user.roles.includes('PROFESSOR')
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-purple-100 text-purple-800'
                                            }`}
                                        >
                                            {translateRole(user.roles[0])}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                            {translateStatus(user.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                                                title="Modifier"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleViewDetails(user)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                                                title="Voir les détails"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
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
                )}

                {/* Empty state */}
                {!loading && filteredUsers.length === 0 && (
                    <div className="p-12 text-center">
                        <UsersIcon className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-600">
                            {searchQuery
                                ? 'Aucun utilisateur trouvé pour cette recherche'
                                : 'Aucun utilisateur'}
                        </p>
                    </div>
                )}

                {/* Footer info */}
                {!loading && filteredUsers.length > 0 && (
                    <div className="p-6 border-t border-gray-100">
                        <div className="text-sm text-gray-600">
                            Affichage de {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
                            {searchQuery && ` sur ${allUsers.length} au total`}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showForm && (
                <UserForm
                    user={editUser}
                    onClose={() => {
                        setShowForm(false);
                        setEditUser(null);
                    }}
                    onSuccess={handleFormSuccess}
                />
            )}

            {showDetails && selectedUser && (
                <UserDetails
                    user={selectedUser}
                    onClose={() => {
                        setShowDetails(false);
                        setSelectedUser(null);
                    }}
                />
            )}
        </div>
    );
};

export default UsersPage;