// apps/admin/app/components/departments/DepartmentForm.tsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
    Department,
    DepartmentService,
    CreateDepartmentRequest,
    UpdateDepartmentRequest,
} from '@repo/api';

interface DepartmentFormProps {
    department: Department | null;
    onClose: () => void;
    onSuccess: () => void;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
                                                           department,
                                                           onClose,
                                                           onSuccess,
                                                       }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        libelle: department?.libelle || '',
        description: department?.description || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (department) {
                // Modification
                console.log('✏️ Modification département:', department.id);

                const updateData: UpdateDepartmentRequest = {
                    libelle: formData.libelle,
                    description: formData.description,
                };

                await DepartmentService.updateDepartment(department.id, updateData);
                console.log('✅ Département modifié avec succès');
                alert('Département modifié avec succès');
            } else {
                // Création
                console.log('➕ Création département');

                const createData: CreateDepartmentRequest = {
                    libelle: formData.libelle,
                    description: formData.description,
                };

                const response = await DepartmentService.createDepartment(createData);
                console.log('✅ Département créé avec succès:', response.id);
                alert('Département créé avec succès');
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
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
                        {department ? 'Modifier le département' : 'Nouveau département'}
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

                    <div>
                        <label className="block text-sm font-medium mb-2">Libellé *</label>
                        <input
                            type="text"
                            name="libelle"
                            value={formData.libelle}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Informatique"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Description du département..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    {department ? 'Modification...' : 'Création...'}
                </span>
                            ) : department ? (
                                'Mettre à jour'
                            ) : (
                                'Créer le département'
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

export default DepartmentForm;