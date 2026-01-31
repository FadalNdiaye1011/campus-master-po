// apps/admin/app/components/semesters/SemesterForm.tsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Semester, SemesterService, CreateSemesterRequest, UpdateSemesterRequest } from '@repo/api';

interface SemesterFormProps {
    semester: Semester | null;
    onClose: () => void;
    onSuccess: () => void;
}

const SemesterForm: React.FC<SemesterFormProps> = ({ semester, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        code: semester?.code || '',
        libelle: semester?.libelle || '',
        anneeAcademique: semester?.anneeAcademique || '',
        dateDebut: semester?.dateDebut || '',
        dateFin: semester?.dateFin || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (semester) {
                // Modification
                console.log('✏️ Modification semestre:', semester.id);

                const updateData: UpdateSemesterRequest = {
                    code: formData.code,
                    libelle: formData.libelle,
                    anneeAcademique: formData.anneeAcademique,
                    dateDebut: formData.dateDebut,
                    dateFin: formData.dateFin,
                };

                await SemesterService.updateSemester(semester.id, updateData);
                console.log('✅ Semestre modifié avec succès');
                alert('Semestre modifié avec succès');
            } else {
                // Création
                console.log('➕ Création semestre');

                const createData: CreateSemesterRequest = {
                    code: formData.code,
                    libelle: formData.libelle,
                    anneeAcademique: formData.anneeAcademique,
                    dateDebut: formData.dateDebut,
                    dateFin: formData.dateFin,
                };

                const response = await SemesterService.createSemester(createData);
                console.log('✅ Semestre créé avec succès:', response.id);
                alert('Semestre créé avec succès');
            }

            onSuccess();
        } catch (err: any) {
            console.error('❌ Erreur formulaire:', err);
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                        {semester ? 'Modifier le semestre' : 'Nouveau semestre'}
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
                            <label className="block text-sm font-medium mb-2">Code *</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: SEM1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Année académique *</label>
                            <input
                                type="text"
                                name="anneeAcademique"
                                value={formData.anneeAcademique}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: 2024/2025"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Libellé *</label>
                        <input
                            type="text"
                            name="libelle"
                            value={formData.libelle}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Semestre 1"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Date de début *</label>
                            <input
                                type="date"
                                name="dateDebut"
                                value={formData.dateDebut}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Date de fin *</label>
                            <input
                                type="date"
                                name="dateFin"
                                value={formData.dateFin}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {semester && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Statut actuel</span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        semester.actif
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                  {semester.actif ? 'Actif' : 'Inactif'}
                </span>
                            </div>
                        </div>
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
                                    {semester ? 'Modification...' : 'Création...'}
                </span>
                            ) : semester ? (
                                'Mettre à jour'
                            ) : (
                                'Créer le semestre'
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

export default SemesterForm;