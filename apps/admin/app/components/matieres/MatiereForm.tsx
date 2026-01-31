// apps/admin/app/components/matieres/MatiereForm.tsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
    Matiere,
    MatiereService,
    CreateMatiereRequest,
    UpdateMatiereRequest,
    ModuleService,
    Module,
} from '@repo/api';

interface MatiereFormProps {
    matiere: Matiere | null;
    onClose: () => void;
    onSuccess: () => void;
}

const MatiereForm: React.FC<MatiereFormProps> = ({ matiere, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [modules, setModules] = useState<Module[]>([]);
    const [loadingModules, setLoadingModules] = useState(false);

    const [formData, setFormData] = useState({
        code: matiere?.code || '',
        libelle: matiere?.libelle || '',
        description: matiere?.description || '',
        coefficient: matiere?.coefficient || 1,
        volumeHoraire: matiere?.volumeHoraire || 1,
        moduleId: matiere?.moduleId || '',
    });

    /**
     * Charge les modules au montage
     */
    useEffect(() => {
        const loadModules = async () => {
            try {
                setLoadingModules(true);
                console.log('📥 Chargement modules...');
                const mods = await ModuleService.getModules();
                setModules(mods);
                console.log('✅ Modules chargés:', mods.length);
            } catch (err: any) {
                console.error('❌ Erreur chargement modules:', err);
                setError('Erreur lors du chargement des modules');
            } finally {
                setLoadingModules(false);
            }
        };

        loadModules();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (matiere) {
                // Modification
                console.log('✏️ Modification matière:', matiere.id);

                const updateData: UpdateMatiereRequest = {
                    code: formData.code,
                    libelle: formData.libelle,
                    description: formData.description,
                    coefficient: Number(formData.coefficient),
                    volumeHoraire: Number(formData.volumeHoraire),
                    moduleId: Number(formData.moduleId),
                };

                await MatiereService.updateMatiere(matiere.id, updateData);
                console.log('✅ Matière modifiée avec succès');
                alert('Matière modifiée avec succès');
            } else {
                // Création
                console.log('➕ Création matière');

                const createData: CreateMatiereRequest = {
                    code: formData.code,
                    libelle: formData.libelle,
                    description: formData.description,
                    coefficient: Number(formData.coefficient),
                    volumeHoraire: Number(formData.volumeHoraire),
                    moduleId: Number(formData.moduleId),
                };

                const response = await MatiereService.createMatiere(createData);
                console.log('✅ Matière créée avec succès:', response.id);
                alert('Matière créée avec succès');
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
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
                        {matiere ? 'Modifier la matière' : 'Nouvelle matière'}
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

                    {loadingModules && (
                        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            Chargement des modules...
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
                                placeholder="Ex: MAT001"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Module *</label>
                            <select
                                name="moduleId"
                                value={formData.moduleId}
                                onChange={handleChange}
                                required
                                disabled={loadingModules}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            >
                                <option value="">Sélectionnez un module</option>
                                {modules.map((mod) => (
                                    <option key={mod.id} value={mod.id}>
                                        {mod.libelle}
                                    </option>
                                ))}
                            </select>
                            {!loadingModules && modules.length === 0 && (
                                <p className="mt-2 text-sm text-yellow-600">
                                    Aucun module disponible
                                </p>
                            )}
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
                            placeholder="Ex: Mathématiques Appliquées"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Description de la matière..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Coefficient *</label>
                            <input
                                type="number"
                                name="coefficient"
                                value={formData.coefficient}
                                onChange={handleChange}
                                required
                                min="1"
                                max="10"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Volume horaire *</label>
                            <input
                                type="number"
                                name="volumeHoraire"
                                value={formData.volumeHoraire}
                                onChange={handleChange}
                                required
                                min="1"
                                max="200"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="En heures"
                            />
                        </div>
                    </div>

                    {matiere && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Statut actuel</span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        matiere.actif
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                  {matiere.actif ? 'Active' : 'Inactive'}
                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading || loadingModules}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    {matiere ? 'Modification...' : 'Création...'}
                </span>
                            ) : matiere ? (
                                'Mettre à jour'
                            ) : (
                                'Créer la matière'
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

export default MatiereForm;