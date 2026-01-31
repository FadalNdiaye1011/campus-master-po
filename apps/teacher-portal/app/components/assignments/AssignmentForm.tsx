// apps/teacher-portal/app/components/assignments/AssignmentForm.tsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
    TeacherAssignment,
    TeacherAssignmentService,
    TeacherCourseService,
    TeacherCourse,
} from '@repo/api';

interface AssignmentFormProps {
    assignment: TeacherAssignment | null;
    onClose: () => void;
    onSuccess: () => void;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({ assignment, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [courses, setCourses] = useState<TeacherCourse[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);

    const [formData, setFormData] = useState({
        titre: assignment?.titre || '',
        description: assignment?.description || '',
        dateLimite: assignment?.dateLimite ? assignment.dateLimite.split('T')[0] : '',
        coursId: assignment?.coursId?.toString() || '',
    });

    /**
     * Charge les cours au montage
     */
    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoadingCourses(true);
                console.log('📥 Chargement cours...');
                const coursData = await TeacherCourseService.getMyCourses();
                setCourses(coursData);
                console.log('✅ Cours chargés:', coursData.length);
            } catch (err: any) {
                console.error('❌ Erreur chargement cours:', err);
                setError('Erreur lors du chargement des cours');
            } finally {
                setLoadingCourses(false);
            }
        };

        loadCourses();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const isoDate = new Date(formData.dateLimite).toISOString();

            if (assignment) {
                // Modification
                console.log('✏️ Modification devoir:', assignment.id);

                await TeacherAssignmentService.updateAssignment(assignment.id, {
                    titre: formData.titre,
                    description: formData.description,
                    dateLimite: isoDate,
                    coursId: Number(formData.coursId),
                });

                console.log('✅ Devoir modifié avec succès');
                alert('Devoir modifié avec succès');
            } else {
                // Création
                console.log('➕ Création devoir');

                await TeacherAssignmentService.createAssignment({
                    titre: formData.titre,
                    description: formData.description,
                    dateLimite: isoDate,
                    coursId: Number(formData.coursId),
                });

                console.log('✅ Devoir créé avec succès');
                alert('Devoir créé avec succès');
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
                        {assignment ? 'Modifier le devoir' : 'Créer un devoir'}
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

                    {loadingCourses && (
                        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            Chargement des cours...
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">Cours *</label>
                        <select
                            name="coursId"
                            value={formData.coursId}
                            onChange={handleChange}
                            required
                            disabled={loadingCourses}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        >
                            <option value="">Sélectionnez un cours</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.titre}
                                </option>
                            ))}
                        </select>
                        {!loadingCourses && courses.length === 0 && (
                            <p className="mt-2 text-sm text-yellow-600">
                                Aucun cours disponible
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Titre du devoir *</label>
                        <input
                            type="text"
                            name="titre"
                            value={formData.titre}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: TP Final"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Consignes *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Instructions pour les étudiants..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Date limite *</label>
                        <input
                            type="date"
                            name="dateLimite"
                            value={formData.dateLimite}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading || loadingCourses}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    {assignment ? 'Modification...' : 'Création...'}
                </span>
                            ) : assignment ? (
                                'Mettre à jour'
                            ) : (
                                'Créer le devoir'
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

export default AssignmentForm;