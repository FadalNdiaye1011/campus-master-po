'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    Calendar,
    Download,
    RefreshCw,
    ArrowLeft,
} from 'lucide-react';
import {
    TeacherCourseService,
    TeacherCourse,
    TeacherAssignment,
    TeacherAssignmentService,
    AssignmentSubmission,
} from '@repo/api';
import AssignmentForm from '../../components/assignments/AssignmentForm';

type ViewMode = 'list' | 'grading';

const TeacherAssignmentsPage: React.FC = () => {
    const [courses, setCourses] = useState<TeacherCourse[]>([]);
    const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [editAssignment, setEditAssignment] = useState<TeacherAssignment | null>(null);

    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedAssignment, setSelectedAssignment] = useState<TeacherAssignment | null>(null);
    const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);

    const [grades, setGrades] = useState<Record<number, { note: number; feedback: string }>>({});

    /**
     * Charge les cours
     */
    const loadCourses = async () => {
        try {
            const response = await TeacherCourseService.getMyCourses();
            setCourses(response);

            // Extraire tous les devoirs de tous les cours
            const allAssignments = await Promise.all(
                response.map(course => TeacherCourseService.getCourseAssignments(course.id))
            );

            setAssignments(allAssignments.flat());
        } catch (err: any) {
            console.error('❌ Erreur chargement:', err);
            setError(err.message || 'Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    /**
     * Charge les soumissions d'un devoir
     */
    const loadSubmissions = async (assignment: TeacherAssignment) => {
        try {
            setLoadingSubmissions(true);
            const subs = await TeacherAssignmentService.getAssignmentSubmissions(assignment.id);
            setSubmissions(subs);

            // Initialiser les notes
            const initialGrades: Record<number, { note: number; feedback: string }> = {};
            subs.forEach(sub => {
                initialGrades[sub.id] = {
                    note: sub.note || 0,
                    feedback: sub.feedback || '',
                };
            });
            setGrades(initialGrades);
        } catch (err: any) {
            console.error('❌ Erreur chargement soumissions:', err);
            alert(err.message || 'Erreur lors du chargement des soumissions');
        } finally {
            setLoadingSubmissions(false);
        }
    };

    /**
     * Supprime un devoir
     */
    const handleDelete = async (assignmentId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce devoir ?')) {
            return;
        }

        try {
            await TeacherAssignmentService.deleteAssignment(assignmentId);
            alert('Devoir supprimé avec succès');
            loadCourses();
        } catch (err: any) {
            console.error('❌ Erreur suppression:', err);
            alert(err.message || 'Erreur lors de la suppression');
        }
    };

    /**
     * Ouvre le formulaire d'édition
     */
    const handleEdit = (assignment: TeacherAssignment) => {
        setEditAssignment(assignment);
        setShowForm(true);
    };

    /**
     * Ouvre l'interface de correction
     */
    const handleGrade = (assignment: TeacherAssignment) => {
        setSelectedAssignment(assignment);
        setViewMode('grading');
        loadSubmissions(assignment);
    };

    /**
     * Callback après création/modification réussie
     */
    const handleFormSuccess = () => {
        setShowForm(false);
        setEditAssignment(null);
        loadCourses();
    };

    /**
     * Évalue une soumission
     */
    const handleEvaluate = async (submissionId: number) => {
        const gradeData = grades[submissionId];

        if (!gradeData || gradeData.note === null || !gradeData.feedback) {
            alert('Veuillez saisir une note et un feedback');
            return;
        }

        try {
            await TeacherAssignmentService.evaluateSubmission(
                submissionId,
                gradeData.note,
                gradeData.feedback
            );
            alert('Note enregistrée avec succès');

            // Recharger les soumissions
            if (selectedAssignment) {
                loadSubmissions(selectedAssignment);
            }
        } catch (err: any) {
            console.error('❌ Erreur évaluation:', err);
            alert(err.message || 'Erreur lors de l\'évaluation');
        }
    };

    /**
     * Met à jour une note
     */
    const handleGradeChange = (submissionId: number, field: 'note' | 'feedback', value: string | number) => {
        setGrades(prev => ({
            ...prev,
            [submissionId]: {
                ...prev[submissionId],
                [field]: value,
            },
        }));
    };

    /**
     * Format de date
     */
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    /**
     * Format de date avec heure
     */
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    /**
     * Calcul des stats
     */
    const totalAssignments = assignments.length;
    const totalSubmissions = assignments.reduce((sum, a) => sum + a.nombreSubmissions, 0);

    if (viewMode === 'grading' && selectedAssignment) {
        return (
            <div className="space-y-6">
                {/* Header Grading */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setViewMode('list')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                    >
                        <ArrowLeft size={20} />
                        Retour aux devoirs
                    </button>
                </div>

                {/* Assignment Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {selectedAssignment.titre}
                            </h1>
                            <p className="text-gray-600 mt-1">{selectedAssignment.coursNom}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Date limite: {formatDate(selectedAssignment.dateLimite)}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600 mb-1">Soumissions</div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {selectedAssignment.nombreSubmissions}
                                </div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600 mb-1">Corrigées</div>
                                <div className="text-2xl font-bold text-green-600">
                                    {submissions.filter(s => s.note > 0).length}
                                </div>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600 mb-1">À corriger</div>
                                <div className="text-2xl font-bold text-yellow-600">
                                    {submissions.filter(s => s.note === 0).length}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="p-4 bg-gray-50 rounded-lg mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Consignes</h3>
                        <p className="text-gray-600">{selectedAssignment.description}</p>
                    </div>

                    {/* Submissions Table */}
                    {loadingSubmissions ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600" />
                        </div>
                    ) : submissions.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <FileText className="mx-auto mb-2" size={48} />
                            <p>Aucune soumission pour ce devoir</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                        Étudiant
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                        Date soumission
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                        Fichier
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                        Note /20
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                        Feedback
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {submissions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{sub.etudiantNom}</div>
                                            <div className="text-sm text-gray-500">ID: {sub.etudiantId}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDateTime(sub.dateSoumission)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {sub.fichierUrl ? (
                                                <a
                                                    href={sub.fichierUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                                                >
                                                    <Download size={14} />
                                                    <span className="text-sm">Télécharger</span>
                                                </a>
                                            ) : (
                                                <span className="text-sm text-gray-400">Aucun fichier</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                value={grades[sub.id]?.note ?? ''}
                                                onChange={(e) => handleGradeChange(sub.id, 'note', parseFloat(e.target.value))}
                                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0"
                                                min="0"
                                                max="20"
                                                step="0.5"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={grades[sub.id]?.feedback ?? ''}
                                                onChange={(e) => handleGradeChange(sub.id, 'feedback', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Feedback..."
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleEvaluate(sub.id)}
                                                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                                            >
                                                Enregistrer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Gestion des devoirs
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Créez et gérez les devoirs de vos cours
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={loadCourses}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        disabled={loading}
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        Actualiser
                    </button>
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setEditAssignment(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus size={20} />
                        Créer un devoir
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{totalAssignments}</div>
                            <div className="text-gray-600">Devoirs au total</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="text-green-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{totalSubmissions}</div>
                            <div className="text-gray-600">Soumissions</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Clock className="text-yellow-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
                            <div className="text-gray-600">Cours actifs</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="text-red-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {assignments.filter(a => new Date(a.dateLimite) < new Date()).length}
                            </div>
                            <div className="text-gray-600">Expirés</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4" />
                    <p className="text-gray-600">Chargement...</p>
                </div>
            )}

            {/* Assignments Table */}
            {!loading && assignments.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">Tous les devoirs</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Titre
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Cours
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Date limite
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Soumissions
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {assignments.map((assignment) => (
                                <tr key={assignment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{assignment.titre}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {assignment.coursNom}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            <span className="text-sm">{formatDate(assignment.dateLimite)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {assignment.nombreSubmissions}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleGrade(assignment)}
                                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                            >
                                                Corriger
                                            </button>
                                            <button
                                                onClick={() => handleEdit(assignment)}
                                                className="p-1 hover:bg-gray-100 rounded-lg"
                                                title="Modifier"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(assignment.id)}
                                                className="p-1 hover:bg-red-50 text-red-600 rounded-lg"
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
                </div>
            )}

            {/* Empty state */}
            {!loading && assignments.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Aucun devoir
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Commencez par créer votre premier devoir
                    </p>
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setEditAssignment(null);
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus size={20} />
                        Créer un devoir
                    </button>
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <AssignmentForm
                    assignment={editAssignment}
                    onClose={() => {
                        setShowForm(false);
                        setEditAssignment(null);
                    }}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default TeacherAssignmentsPage;