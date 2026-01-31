import React from 'react';
import { X, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { User } from '@repo/api';

interface UserDetailsProps {
    user: User;
    onClose: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, onClose }) => {
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Détails de l'utilisateur</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        aria-label="Fermer"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Avatar et nom */}
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-gray-600">@{user.username}</p>
                        </div>
                    </div>

                    {/* Informations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <Mail className="text-gray-400 mt-1" size={20} />
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Phone className="text-gray-400 mt-1" size={20} />
                            <div>
                                <p className="text-sm text-gray-600">Téléphone</p>
                                <p className="font-medium">{user.phoneNumber}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Shield className="text-gray-400 mt-1" size={20} />
                            <div>
                                <p className="text-sm text-gray-600">Rôle</p>
                                <p className="font-medium">
                                    {user.roles.map((role) => {
                                        const roles: Record<string, string> = {
                                            STUDENT: 'Étudiant',
                                            PROFESSOR: 'Enseignant',
                                            ADMIN: 'Administrateur',
                                        };
                                        return roles[role] || role;
                                    }).join(', ')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Calendar className="text-gray-400 mt-1" size={20} />
                            <div>
                                <p className="text-sm text-gray-600">Date de création</p>
                                <p className="font-medium">{formatDate(user.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Statut */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Statut</span>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    user.status === 'ACTIVE'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                {user.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
              </span>
                        </div>
                    </div>

                    {/* Dernière connexion */}
                    {user.lastLogin && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                                <span className="font-medium">Dernière connexion :</span>{' '}
                                {formatDate(user.lastLogin)}
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;