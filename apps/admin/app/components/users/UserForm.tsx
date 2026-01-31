import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { User, UserService, CreateUserRequest, UpdateUserRequest, DepartmentService, Department } from '@repo/api';

interface UserFormProps {
    user: User | null;
    onClose: () => void;
    onSuccess: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loadingDepartments, setLoadingDepartments] = useState(false);

    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        password: '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phoneNumber: user?.phoneNumber || '',
        role: (user?.roles[0] || 'STUDENT') as 'STUDENT' | 'PROFESSOR' | 'ADMIN',
        status: user?.status || 'ACTIVE',
        departementId: '',
        numeroEtudiant: '',
        specialisation: '',
        avatarUrl: '',
    });

    /**
     * Charge les départements au montage
     */
    useEffect(() => {
        const loadDepartments = async () => {
            try {
                setLoadingDepartments(true);
                console.log('📥 Chargement des départements...');
                const depts = await DepartmentService.getDepartments();
                setDepartments(depts);
                console.log('✅ Départements chargés:', depts.length);
            } catch (err: any) {
                console.error('❌ Erreur chargement départements:', err);
            } finally {
                setLoadingDepartments(false);
            }
        };

        loadDepartments();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (user) {
                // Modification
                console.log('✏️ Modification utilisateur:', user.id);

                const updateData: UpdateUserRequest = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phoneNumber: formData.phoneNumber,
                    role: formData.role,
                    status: formData.status as 'ACTIVE' | 'INACTIVE',
                    avatarUrl: formData.avatarUrl || undefined,
                };

                await UserService.updateUser(user.id, updateData);
                console.log('✅ Utilisateur modifié avec succès');
                alert('Utilisateur modifié avec succès');
            } else {
                // Création
                console.log('➕ Création utilisateur');

                if (!formData.password) {
                    setError('Le mot de passe est requis pour créer un utilisateur');
                    setLoading(false);
                    return;
                }

                const createData: CreateUserRequest = {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phoneNumber: formData.phoneNumber,
                    role: formData.role,
                    departementId: formData.departementId || undefined,
                    numeroEtudiant: formData.numeroEtudiant || undefined,
                    specialisation: formData.specialisation || undefined,
                };

                const response = await UserService.createUser(createData);
                console.log('✅ Utilisateur créé avec succès:', response.userId);
                alert('Utilisateur créé avec succès');
            }

            onSuccess();
        } catch (err: any) {
            console.error('❌ Erreur formulaire:', err);
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                    <h2 className="text-xl font-bold">
                        {user ? 'Modifier utilisateur' : 'Nouvel utilisateur'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        aria-label="Fermer"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Prénom *</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Nom *</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {!user && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Nom d'utilisateur *
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={!!user}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                    </div>

                    {!user && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Mot de passe *
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required={!user}
                                minLength={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Minimum 6 caractères"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">Téléphone *</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Rôle *</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="STUDENT">Étudiant</option>
                                <option value="PROFESSOR">Enseignant</option>
                                <option value="ADMIN">Administrateur</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Statut *</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="ACTIVE">Actif</option>
                                <option value="INACTIVE">Inactif</option>
                            </select>
                        </div>
                    </div>

                    {/* Champs spécifiques pour les étudiants */}
                    {!user && formData.role === 'STUDENT' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Département {departments.length > 0 && '*'}
                                </label>
                                {loadingDepartments ? (
                                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-gray-500">Chargement des départements...</span>
                                    </div>
                                ) : departments.length > 0 ? (
                                    <select
                                        name="departementId"
                                        value={formData.departementId}
                                        onChange={handleChange}
                                        required={formData.role === 'STUDENT'}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Sélectionnez un département</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.libelle}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-yellow-50">
                                        <p className="text-sm text-yellow-800">
                                            Aucun département disponible. Veuillez en créer un d'abord.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Numéro étudiant
                                </label>
                                <input
                                    type="text"
                                    name="numeroEtudiant"
                                    value={formData.numeroEtudiant}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: 202400001"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Spécialisation
                                </label>
                                <input
                                    type="text"
                                    name="specialisation"
                                    value={formData.specialisation}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: Développement Web"
                                />
                            </div>
                        </>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    {user ? 'Modification...' : 'Création...'}
                                </span>
                            ) : user ? (
                                'Mettre à jour'
                            ) : (
                                "Créer l'utilisateur"
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;