import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
    TeacherAnnouncement,
    TeacherAnnouncementService,
    TeacherCourseService,
    TeacherCourse,
    AnnouncementPriority,
} from '@repo/api';

interface AnnouncementFormProps {
    announcement: TeacherAnnouncement | null;
    onClose: () => void;
    onSuccess: () => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
                                                               announcement,
                                                               onClose,
                                                               onSuccess,
                                                           }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [courses, setCourses] = useState<TeacherCourse[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);

    const [formData, setFormData] = useState({
        titre: announcement?.titre || '',
        contenu: announcement?.contenu || '',
        priorite: (announcement?.priorite || 'NORMALE') as AnnouncementPriority,
        coursId: announcement?.coursId?.toString() || '',
    });

    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoadingCourses(true);
                const coursData = await TeacherCourseService.getMyCourses();
                setCourses(coursData);
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
            if (announcement) {
                await TeacherAnnouncementService.updateAnnouncement(announcement.id, {
                    titre: formData.titre,
                    contenu: formData.contenu,
                    priorite: formData.priorite,
                    coursId: Number(formData.coursId),
                });

                alert('Annonce modifiée avec succès');
            } else {
                await TeacherAnnouncementService.createAnnouncement({
                    titre: formData.titre,
                    contenu: formData.contenu,
                    priorite: formData.priorite,
                    coursId: Number(formData.coursId),
                });

                alert('Annonce créée avec succès');
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
                        {announcement ? 'Modifier l\'annonce' : 'Créer une annonce'}
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
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Titre *</label>
                        <input
                            type="text"
                            name="titre"
                            value={formData.titre}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Changement de salle"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Contenu *</label>
                        <textarea
                            name="contenu"
                            value={formData.contenu}
                            onChange={handleChange}
                            required
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Message de l'annonce..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Priorité *</label>
                        <select
                            name="priorite"
                            value={formData.priorite}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="BASSE">Basse</option>
                            <option value="NORMALE">Normale</option>
                            <option value="HAUTE">Haute</option>
                            <option value="URGENTE">Urgente</option>
                        </select>
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
                                    {announcement ? 'Modification...' : 'Création...'}
                </span>
                            ) : announcement ? (
                                'Mettre à jour'
                            ) : (
                                'Publier l\'annonce'
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

export default AnnouncementForm;