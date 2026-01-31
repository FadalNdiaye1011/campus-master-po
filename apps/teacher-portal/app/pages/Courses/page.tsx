'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    BookOpen,
    Users,
    FileText,
    Calendar,
    RefreshCw,
    BarChart3,
    Megaphone,
    FolderOpen,
    X,
    TrendingUp,
    Clock,
    CheckCircle,
} from 'lucide-react';
import {
    TeacherCourseService,
    TeacherCourse,
    CourseStats,
    CourseStudent,
    CourseAssignment,
    CourseSupport,
    CourseAnnouncement,
} from '@repo/api';
import CourseForm from '../../components/courses/CourseForm';
import AddSupportModal from '../../components/supports/AddSupportModal';

type TabType = 'overview' | 'stats' | 'students' | 'assignments' | 'supports' | 'announcements';

const TeacherCoursesPage: React.FC = () => {
    const [courses, setCourses] = useState<TeacherCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [editCourse, setEditCourse] = useState<TeacherCourse | null>(null);

    const [selectedCourse, setSelectedCourse] = useState<TeacherCourse | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    // Données du cours sélectionné
    const [courseStats, setCourseStats] = useState<CourseStats | null>(null);
    const [courseStudents, setCourseStudents] = useState<CourseStudent[]>([]);
    const [courseAssignments, setCourseAssignments] = useState<CourseAssignment[]>([]);
    const [courseSupports, setCourseSupports] = useState<CourseSupport[]>([]);
    const [courseAnnouncements, setCourseAnnouncements] = useState<CourseAnnouncement[]>([]);

    const [loadingDetails, setLoadingDetails] = useState(false);

    // Modal pour ajouter un support
    const [showAddSupport, setShowAddSupport] = useState(false);

    /**
     * Charge les cours
     */
    const loadCourses = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('📥 Chargement des cours...');

            const response = await TeacherCourseService.getMyCourses();

            console.log('✅ Cours chargés:', response);

            setCourses(response);
        } catch (err: any) {
            console.error('❌ Erreur chargement cours:', err);
            setError(err.message || 'Erreur lors du chargement des cours');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Charge au montage
     */
    useEffect(() => {
        loadCourses();
    }, []);

    /**
     * Charge les détails d'un cours selon l'onglet actif
     */
    const loadCourseDetails = async (course: TeacherCourse, tab: TabType) => {
        if (tab === 'overview') return;

        setLoadingDetails(true);

        try {
            switch (tab) {
                case 'stats':
                    const stats = await TeacherCourseService.getCourseStats(course.id);
                    setCourseStats(stats);
                    break;

                case 'students':
                    const students = await TeacherCourseService.getCourseStudents(course.id);
                    setCourseStudents(students);
                    break;

                case 'assignments':
                    const assignments = await TeacherCourseService.getCourseAssignments(course.id);
                    setCourseAssignments(assignments);
                    break;

                case 'supports':
                    const supports = await TeacherCourseService.getCourseSupports(course.id);
                    setCourseSupports(supports);
                    break;

                case 'announcements':
                    const announcements = await TeacherCourseService.getCourseAnnouncements(course.id);
                    setCourseAnnouncements(announcements);
                    break;
            }
        } catch (err: any) {
            console.error('❌ Erreur chargement détails:', err);
            alert(err.message || 'Erreur lors du chargement des détails');
        } finally {
            setLoadingDetails(false);
        }
    };

    /**
     * Gère le changement d'onglet
     */
    useEffect(() => {
        if (selectedCourse) {
            loadCourseDetails(selectedCourse, activeTab);
        }
    }, [activeTab, selectedCourse]);

    /**
     * Supprime un cours
     */
    const handleDeleteCourse = async (courseId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
            return;
        }

        try {
            console.log('🗑️ Suppression cours:', courseId);
            await TeacherCourseService.deleteCourse(courseId);
            alert('Cours supprimé avec succès');
            loadCourses();
        } catch (err: any) {
            console.error('❌ Erreur suppression:', err);
            alert(err.message || 'Erreur lors de la suppression');
        }
    };

    /**
     * Ouvre le formulaire d'édition
     */
    const handleEdit = (course: TeacherCourse) => {
        console.log('✏️ Édition cours:', course);
        setEditCourse(course);
        setShowForm(true);
    };

    /**
     * Ouvre les détails du cours
     */
    const handleViewDetails = (course: TeacherCourse) => {
        setSelectedCourse(course);
        setActiveTab('overview');
    };

    /**
     * Callback après création/modification réussie
     */
    const handleFormSuccess = () => {
        setShowForm(false);
        setEditCourse(null);
        loadCourses();
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
     * Rendu du contenu des onglets
     */
    const renderTabContent = () => {
        if (!selectedCourse) return null;

        if (loadingDetails) {
            return (
                <div className="flex items-center justify-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600" />
                </div>
            );
        }

        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="text-gray-600">{selectedCourse.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium text-gray-700 mb-1">Semestre</h4>
                                <p className="text-gray-900">{selectedCourse.semestre}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-1">Département</h4>
                                <p className="text-gray-900">{selectedCourse.departementNom || 'Non défini'}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-1">Enseignant</h4>
                                <p className="text-gray-900">{selectedCourse.tuteurNom}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-1">Créé le</h4>
                                <p className="text-gray-900">{formatDate(selectedCourse.createdAt)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <FileText className="text-blue-600 mb-2" size={24} />
                                <div className="text-2xl font-bold text-gray-900">{selectedCourse.nombreDevoirs}</div>
                                <div className="text-sm text-gray-600">Devoirs</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <BookOpen className="text-green-600 mb-2" size={24} />
                                <div className="text-2xl font-bold text-gray-900">{selectedCourse.nombreSupports}</div>
                                <div className="text-sm text-gray-600">Supports</div>
                            </div>
                        </div>
                    </div>
                );

            case 'stats':
                if (!courseStats) return <div>Aucune statistique disponible</div>;
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
                                <Users size={32} className="mb-4" />
                                <div className="text-3xl font-bold mb-2">{courseStats.nombreEtudiants}</div>
                                <div className="text-blue-100">Étudiants inscrits</div>
                            </div>

                            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
                                <TrendingUp size={32} className="mb-4" />
                                <div className="text-3xl font-bold mb-2">{courseStats.moyenneGenerale.toFixed(1)}/20</div>
                                <div className="text-green-100">Moyenne générale</div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
                                <CheckCircle size={32} className="mb-4" />
                                <div className="text-3xl font-bold mb-2">{courseStats.tauxRendu}%</div>
                                <div className="text-purple-100">Taux de rendu</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white border rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Total devoirs</div>
                                <div className="text-2xl font-bold text-gray-900">{courseStats.nombreDevoirs}</div>
                            </div>
                            <div className="bg-white border rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">En attente</div>
                                <div className="text-2xl font-bold text-orange-600">{courseStats.devoirsEnAttente}</div>
                            </div>
                            <div className="bg-white border rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Évalués</div>
                                <div className="text-2xl font-bold text-green-600">{courseStats.devoirsEvalues}</div>
                            </div>
                        </div>
                    </div>
                );

            case 'students':
                return (
                    <div className="space-y-4">
                        {courseStudents.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Users className="mx-auto mb-2" size={48} />
                                <p>Aucun étudiant inscrit</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {courseStudents.map((student) => (
                                    <div key={student.id} className="bg-white border rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-800 font-bold text-lg">
                                                    {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">
                                                    {student.firstName} {student.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">{student.numeroEtudiant}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm space-y-1">
                                            <div className="text-gray-600">{student.email}</div>
                                            <div className="text-gray-600">{student.phoneNumber}</div>
                                            {student.departementNom && (
                                                <div className="mt-2">
                                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                                        {student.departementNom}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'assignments':
                return (
                    <div className="space-y-4">
                        {courseAssignments.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <FileText className="mx-auto mb-2" size={48} />
                                <p>Aucun devoir</p>
                            </div>
                        ) : (
                            courseAssignments.map((assignment) => (
                                <div key={assignment.id} className="bg-white border rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{assignment.titre}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                            assignment.isSubmitted
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-orange-100 text-orange-800'
                                        }`}>
                                            {assignment.isSubmitted ? 'Rendu' : 'En attente'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Clock size={16} />
                                            <span>Limite: {formatDateTime(assignment.dateLimite)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users size={16} />
                                            <span>{assignment.nombreSubmissions} soumission(s)</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                );

            case 'supports':
                return (
                    <div className="space-y-4">
                        {/* Bouton Ajouter un support */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowAddSupport(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <Plus size={20} />
                                Ajouter un support
                            </button>
                        </div>

                        {courseSupports.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <FolderOpen className="mx-auto mb-2" size={48} />
                                <p>Aucun support pédagogique</p>
                            </div>
                        ) : (
                            courseSupports.map((support) => (
                                <div key={support.id} className="bg-white border rounded-lg p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <BookOpen size={24} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{support.titre}</h4>
                                            <p className="text-sm text-gray-600">{support.description}</p>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                <span>{support.typeFichier}</span>
                                                <span>{(support.tailleFichier / 1024).toFixed(2)} KB</span>
                                                <span>{formatDate(support.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <a
                                        href={support.urlFichier}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Télécharger
                                    </a>
                                </div>
                            ))
                        )}
                    </div>
                );

            case 'announcements':
                return (
                    <div className="space-y-4">
                        {courseAnnouncements.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Megaphone className="mx-auto mb-2" size={48} />
                                <p>Aucune annonce</p>
                            </div>
                        ) : (
                            courseAnnouncements.map((announcement) => (
                                <div key={announcement.id} className="bg-white border rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">{announcement.titre}</h4>
                                    <p className="text-gray-600 mb-3">{announcement.contenu}</p>
                                    <div className="text-xs text-gray-500">
                                        Publié le {formatDateTime(announcement.createdAt)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mes Cours</h1>
                    <p className="text-gray-600 mt-1">
                        Gérez vos cours et contenus pédagogiques • {courses.length} cours au total
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
                            setEditCourse(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus size={20} />
                        Créer un cours
                    </button>
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

            {/* Grid of Courses */}
            {!loading && !selectedCourse && courses.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                            <BookOpen size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{course.titre}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar size={14} />
                                                <span>{course.semestre}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {course.departementNom && (
                                        <div className="mt-2">
                                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                                {course.departementNom}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleEdit(course)}
                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                                        title="Modifier"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCourse(course.id)}
                                        className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                                        title="Supprimer"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {course.description}
                            </p>

                            {/* Stats */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FileText size={16} />
                                        <span>Devoirs</span>
                                    </div>
                                    <span className="font-medium text-gray-900">{course.nombreDevoirs}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <BookOpen size={16} />
                                        <span>Supports</span>
                                    </div>
                                    <span className="font-medium text-gray-900">{course.nombreSupports}</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-4 border-t border-gray-100">
                                <div className="text-xs text-gray-500 mb-3">
                                    Créé le {formatDate(course.createdAt)}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleViewDetails(course)}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                                >
                                    Voir détails
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Course Details Modal */}
            {selectedCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.titre}</h2>
                                <p className="text-gray-600">{selectedCourse.semestre}</p>
                            </div>
                            <button
                                onClick={() => setSelectedCourse(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                                aria-label="Fermer"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-200 sticky top-[88px] bg-white z-10">
                            <div className="flex overflow-x-auto">
                                {[
                                    { id: 'overview', label: 'Vue d\'ensemble', icon: BookOpen },
                                    { id: 'stats', label: 'Statistiques', icon: BarChart3 },
                                    { id: 'students', label: 'Étudiants', icon: Users },
                                    { id: 'assignments', label: 'Devoirs', icon: FileText },
                                    { id: 'supports', label: 'Supports', icon: FolderOpen },
                                    { id: 'announcements', label: 'Annonces', icon: Megaphone },
                                ].map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as TabType)}
                                            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                                                activeTab === tab.id
                                                    ? 'border-blue-600 text-blue-600'
                                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                            }`}
                                        >
                                            <Icon size={18} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!loading && courses.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Aucun cours
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Commencez par créer votre premier cours
                    </p>
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setEditCourse(null);
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus size={20} />
                        Créer un cours
                    </button>
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <CourseForm
                    course={editCourse}
                    onClose={() => {
                        setShowForm(false);
                        setEditCourse(null);
                    }}
                    onSuccess={handleFormSuccess}
                />
            )}

            {/* Modal Add Support */}
            {showAddSupport && selectedCourse && (
                <AddSupportModal
                    courseId={selectedCourse.id}
                    courseName={selectedCourse.titre}
                    onClose={() => setShowAddSupport(false)}
                    onSuccess={() => {
                        setShowAddSupport(false);
                        loadCourseDetails(selectedCourse, 'supports');
                    }}
                />
            )}
        </div>
    );
};

export default TeacherCoursesPage;