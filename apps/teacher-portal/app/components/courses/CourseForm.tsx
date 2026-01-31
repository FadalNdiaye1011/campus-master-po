// apps/teacher-portal/app/components/courses/CourseForm.tsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
    TeacherCourse,
    TeacherCourseService,
    DepartmentService,
    Department,
} from '@repo/api';

interface CourseFormProps {
    course: TeacherCourse | null;
    onClose: () => void;
    onSuccess: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [departments, setDepartments] = useState<Department[]>([]);
    const [loadingDepartments, setLoadingDepartments] = useState(false);

    const [formData, setFormData] = useState({
        titre: course?.titre || '',
        description: course?.description || '',
        semestre: course?.semestre || '',
        departementId: course?.departementId?.toString() || '',
    });

    /**
     * Charge les départements au montage
     */
    useEffect(() => {
        const loadDepartments = async () => {
            try {
                setLoadingDepartments(true);
                console.log('📥 Chargement départements...');
                const depts = await DepartmentService.getDepartments();
                setDepartments(depts);
                console.log('✅ Départements chargés:', depts.length);
            } catch (err: any) {
                console.error('❌ Erreur chargement départements:', err);
                setError('Erreur lors du chargement des départements');
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
            if (course) {
                // Modification
                console.log('✏️ Modification cours:', course.id);

                await TeacherCourseService.updateCourse(course.id, {
                    titre: formData.titre,
                    description: formData.description,
                    semestre: formData.semestre,
                    departementId: Number(formData.departementId),
                });

                console.log('✅ Cours modifié avec succès');
                alert('Cours modifié avec succès');
            } else {
                // Création
                console.log('➕ Création cours');

                await TeacherCourseService.createCourse({
                    titre: formData.titre,
                    description: formData.description,
                    semestre: formData.semestre,
                    departementId: Number(formData.departementId),
                });

                console.log('✅ Cours créé avec succès');
                alert('Cours créé avec succès');
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
                        {course ? 'Modifier le cours' : 'Créer un cours'}
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

                    {loadingDepartments && (
                        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            Chargement des départements...
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">Titre du cours *</label>
                        <input
                            type="text"
                            name="titre"
                            value={formData.titre}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Analyse de données"
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
                            placeholder="Description du cours..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Semestre *</label>
                            <input
                                type="text"
                                name="semestre"
                                value={formData.semestre}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: S1 2024-2025"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Département *</label>
                            <select
                                name="departementId"
                                value={formData.departementId}
                                onChange={handleChange}
                                required
                                disabled={loadingDepartments}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            >
                                <option value="">Sélectionnez un département</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.libelle}
                                    </option>
                                ))}
                            </select>
                            {!loadingDepartments && departments.length === 0 && (
                                <p className="mt-2 text-sm text-yellow-600">
                                    Aucun département disponible
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading || loadingDepartments}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    {course ? 'Modification...' : 'Création...'}
                </span>
                            ) : course ? (
                                'Mettre à jour'
                            ) : (
                                'Créer le cours'
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

export default CourseForm;