// apps/admin/app/components/modules/ModuleForm.tsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
    Module,
    ModuleService,
    CreateModuleRequest,
    UpdateModuleRequest,
    DepartmentService,
    Department,
    SemesterService,
    Semester,
} from '@repo/api';

interface ModuleFormProps {
    module: Module | null;
    onClose: () => void;
    onSuccess: () => void;
}

const ModuleForm: React.FC<ModuleFormProps> = ({ module, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [departments, setDepartments] = useState<Department[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    const [formData, setFormData] = useState({
        code: module?.code || '',
        libelle: module?.libelle || '',
        description: module?.description || '',
        credits: module?.credits || 3,
        semestreId: module?.semestreId || '',
        departementId: module?.departementId || '',
    });

    /**
     * Charge les départements et semestres au montage
     */
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoadingData(true);
                console.log('📥 Chargement départements et semestres...');

                const [depts, sems] = await Promise.all([
                    DepartmentService.getDepartments(),
                    SemesterService.getSemesters(),
                ]);

                setDepartments(depts);
                setSemesters(sems);
                console.log('✅ Données chargées:', depts.length, 'depts,', sems.length, 'sems');
            } catch (err: any) {
                console.error('❌ Erreur chargement données:', err);
                setError('Erreur lors du chargement des données');
            } finally {
                setLoadingData(false);
            }
        };

        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (module) {
                // Modification
                console.log('✏️ Modification module:', module.id);

                const updateData: UpdateModuleRequest = {
                    code: formData.code,
                    libelle: formData.libelle,
                    description: formData.description,
                    credits: Number(formData.credits),
                    semestreId: Number(formData.semestreId),
                    departementId: Number(formData.departementId),
                };

                await ModuleService.updateModule(module.id, updateData);
                console.log('✅ Module modifié avec succès');
                alert('Module modifié avec succès');
            } else {
                // Création
                console.log('➕ Création module');

                const createData: CreateModuleRequest = {
                    code: formData.code,
                    libelle: formData.libelle,
                    description: formData.description,
                    credits: Number(formData.credits),
                    semestreId: Number(formData.semestreId),
                    departementId: Number(formData.departementId),
                };

                const response = await ModuleService.createModule(createData);
                console.log('✅ Module créé avec succès:', response.id);
                alert('Module créé avec succès');
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
                        {module ? 'Modifier le module' : 'Nouveau module'}
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

                    {loadingData && (
                        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            Chargement des données...
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
                                placeholder="Ex: MOD001"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Crédits *</label>
                            <input
                                type="number"
                                name="credits"
                                value={formData.credits}
                                onChange={handleChange}
                                required
                                min="1"
                                max="10"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            placeholder="Ex: Programmation Web"
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
                            placeholder="Description du module..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Semestre *</label>
                            <select
                                name="semestreId"
                                value={formData.semestreId}
                                onChange={handleChange}
                                required
                                disabled={loadingData}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            >
                                <option value="">Sélectionnez un semestre</option>
                                {semesters.map((sem) => (
                                    <option key={sem.id} value={sem.id}>
                                        {sem.libelle} ({sem.anneeAcademique})
                                    </option>
                                ))}
                            </select>
                            {!loadingData && semesters.length === 0 && (
                                <p className="mt-2 text-sm text-yellow-600">
                                    Aucun semestre disponible
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Département *</label>
                            <select
                                name="departementId"
                                value={formData.departementId}
                                onChange={handleChange}
                                required
                                disabled={loadingData}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            >
                                <option value="">Sélectionnez un département</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.libelle}
                                    </option>
                                ))}
                            </select>
                            {!loadingData && departments.length === 0 && (
                                <p className="mt-2 text-sm text-yellow-600">
                                    Aucun département disponible
                                </p>
                            )}
                        </div>
                    </div>

                    {module && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Statut actuel</span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        module.actif
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                  {module.actif ? 'Actif' : 'Inactif'}
                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading || loadingData}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    {module ? 'Modification...' : 'Création...'}
                </span>
                            ) : module ? (
                                'Mettre à jour'
                            ) : (
                                'Créer le module'
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

export default ModuleForm;