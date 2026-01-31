'use client';

import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Users,
    Clock,
    FileText,
    Plus,
    Search,
    Filter,
    RefreshCw,
    CheckCircle,
    Calendar,
    User,
    Building,
    X,
    AlertCircle,
} from 'lucide-react';
import {
    StudentCourseService,
    StudentCourse,
    StudentAssignment,
    CourseEnrollment,
} from '@repo/api';

const StudentCoursesPage: React.FC = () => {
    const [availableCourses, setAvailableCourses] = useState<StudentCourse[]>([]);
    const [enrolledCourses, setEnrolledCourses] = useState<CourseEnrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [activeTab, setActiveTab] = useState<'available' | 'enrolled'>('available');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<StudentCourse | null>(null);

    /**
     * Charge les cours
     */
    const loadCourses = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('📥 Chargement cours...');

            const [available, enrolled] = await Promise.all([
                StudentCourseService.getAvailableCourses(),
                StudentCourseService.getMyEnrolledCourses(),
            ]);

            setAvailableCourses(available);
            setEnrolledCourses(enrolled);

            console.log('✅ Cours chargés:', { available: available.length, enrolled: enrolled.length });
        } catch (err: any) {
            console.error('❌ Erreur chargement cours:', err);
            setError(err.message || 'Erreur lors du chargement des cours');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    /**
     * Inscription à un cours
     */
    const handleEnroll = async (courseId: number) => {
        if (!confirm('Voulez-vous vous inscrire à ce cours ?')) {
            return;
        }

        try {
            await StudentCourseService.enrollInCourse(courseId);
            alert('Inscription réussie !');
            loadCourses();
        } catch (err: any) {
            console.error('❌ Erreur inscription:', err);
            alert(err.message || 'Erreur lors de l\'inscription');
        }
    };

    /**
     * Vérifie si l'étudiant est déjà inscrit à un cours
     */
    const isEnrolled = (courseId: number): boolean => {
        return enrolledCourses.some((enrollment) => enrollment.coursId === courseId);
    };

    /**
     * Filtrage des cours
     */
    const filteredAvailableCourses = availableCourses.filter((course) =>
        course.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tuteurNom.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredEnrolledCourses = enrolledCourses.filter((enrollment) => {
        const course = availableCourses.find((c) => c.id === enrollment.coursId);
        if (!course) return false;
        return (
            course.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            enrollment.coursNom.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

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
     * Stats
     */
    const stats = {
        available: availableCourses.length,
        enrolled: enrolledCourses.length,
        totalAssignments: availableCourses.reduce((sum, c) => sum + c.nombreDevoirs, 0),
        totalSupports: availableCourses.reduce((sum, c) => sum + c.nombreSupports, 0),
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mes Cours</h1>
                    <p className="text-gray-600 mt-1">
                        Explorez les cours disponibles et gérez vos inscriptions
                    </p>
                </div>
                <button
                    onClick={loadCourses}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    disabled={loading}
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    Actualiser
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.available}</div>
                            <div className="text-gray-600">Cours disponibles</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="text-green-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.enrolled}</div>
                            <div className="text-gray-600">Mes inscriptions</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FileText className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.totalAssignments}</div>
                            <div className="text-gray-600">Total devoirs</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <FileText className="text-orange-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.totalSupports}</div>
                            <div className="text-gray-600">Total supports</div>
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

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="border-b border-gray-200">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('available')}
                            className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition ${
                                activeTab === 'available'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Cours disponibles ({stats.available})
                        </button>
                        <button
                            onClick={() => setActiveTab('enrolled')}
                            className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition ${
                                activeTab === 'enrolled'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Mes inscriptions ({stats.enrolled})
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="p-6 border-b border-gray-100">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Rechercher un cours..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4" />
                        <p className="text-gray-600">Chargement...</p>
                    </div>
                )}

                {/* Course List */}
                {!loading && (
                    <div className="p-6">
                        {activeTab === 'available' ? (
                            filteredAvailableCourses.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <BookOpen className="mx-auto mb-2" size={48} />
                                    <p>Aucun cours disponible</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredAvailableCourses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                        {course.titre}
                                                    </h3>
                                                    {course.departementNom && (
                                                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 mb-3">
                              {course.departementNom}
                            </span>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {course.description}
                                            </p>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar size={14} />
                                                    <span>{course.semestre}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <User size={14} />
                                                    <span>{course.tuteurNom}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-sm mb-4">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <FileText size={14} />
                                                    <span>{course.nombreDevoirs} devoirs</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <BookOpen size={14} />
                                                    <span>{course.nombreSupports} supports</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedCourse(course)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                                                >
                                                    Détails
                                                </button>
                                                {isEnrolled(course.id) ? (
                                                    <button
                                                        disabled
                                                        className="flex-1 px-4 py-2 bg-green-100 text-green-800 rounded-lg cursor-not-allowed text-sm flex items-center justify-center gap-2"
                                                    >
                                                        <CheckCircle size={16} />
                                                        Inscrit
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEnroll(course.id)}
                                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center justify-center gap-2"
                                                    >
                                                        <Plus size={16} />
                                                        S'inscrire
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            filteredEnrolledCourses.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <CheckCircle className="mx-auto mb-2" size={48} />
                                    <p>Aucune inscription</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredEnrolledCourses.map((enrollment) => {
                                        const course = availableCourses.find((c) => c.id === enrollment.coursId);
                                        if (!course) return null;

                                        return (
                                            <div
                                                key={enrollment.id}
                                                className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                            {course.titre}
                                                        </h3>
                                                        <div className="flex items-center gap-2">
                                                            {course.departementNom && (
                                                                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                  {course.departementNom}
                                </span>
                                                            )}
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                <CheckCircle size={12} />
                                Inscrit
                              </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                    {course.description}
                                                </p>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Calendar size={14} />
                                                        <span>{course.semestre}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <User size={14} />
                                                        <span>{course.tuteurNom}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Clock size={14} />
                                                        <span>Inscrit le {formatDate(enrollment.dateInscription)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-sm mb-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <FileText size={14} />
                                                        <span>{course.nombreDevoirs} devoirs</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <BookOpen size={14} />
                                                        <span>{course.nombreSupports} supports</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => setSelectedCourse(course)}
                                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                                                >
                                                    Accéder au cours
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* Course Detail Modal */}
            {selectedCourse && (
                <CourseDetailModal
                    course={selectedCourse}
                    isEnrolled={isEnrolled(selectedCourse.id)}
                    onClose={() => setSelectedCourse(null)}
                    onEnroll={handleEnroll}
                />
            )}
        </div>
    );
};

const CourseDetailModal: React.FC<{
    course: StudentCourse;
    isEnrolled: boolean;
    onClose: () => void;
    onEnroll: (courseId: number) => void;
}> = ({ course, isEnrolled, onClose, onEnroll }) => {
    const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
    const [loadingAssignments, setLoadingAssignments] = useState(true);

    useEffect(() => {
        const loadAssignments = async () => {
            try {
                setLoadingAssignments(true);
                const data = await StudentCourseService.getCourseAssignments(course.id);
                setAssignments(data);
            } catch (err: any) {
                console.error('❌ Erreur chargement devoirs:', err);
            } finally {
                setLoadingAssignments(false);
            }
        };

        loadAssignments();
    }, [course.id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold">{course.titre}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        aria-label="Fermer"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Course Info */}
                    <div className="bg-gray-50 rounded-xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-gray-400" />
                                <div>
                                    <div className="text-sm text-gray-600">Semestre</div>
                                    <div className="font-medium">{course.semestre}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <User size={18} className="text-gray-400" />
                                <div>
                                    <div className="text-sm text-gray-600">Enseignant</div>
                                    <div className="font-medium">{course.tuteurNom}</div>
                                </div>
                            </div>
                            {course.departementNom && (
                                <div className="flex items-center gap-2">
                                    <Building size={18} className="text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-600">Département</div>
                                        <div className="font-medium">{course.departementNom}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Description</h3>
                            <p className="text-gray-600">{course.description}</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <FileText className="text-blue-600 mb-2" size={24} />
                            <div className="text-2xl font-bold text-gray-900">{course.nombreDevoirs}</div>
                            <div className="text-sm text-gray-600">Devoirs</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                            <BookOpen className="text-green-600 mb-2" size={24} />
                            <div className="text-2xl font-bold text-gray-900">{course.nombreSupports}</div>
                            <div className="text-sm text-gray-600">Supports</div>
                        </div>
                    </div>

                    {/* Assignments */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Devoirs du cours</h3>
                        {loadingAssignments ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600" />
                            </div>
                        ) : assignments.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <FileText className="mx-auto mb-2" size={48} />
                                <p>Aucun devoir pour ce cours</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {assignments.map((assignment) => (
                                    <div
                                        key={assignment.id}
                                        className="border border-gray-200 rounded-lg p-4"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900">{assignment.titre}</h4>
                                            {assignment.isSubmitted && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          <CheckCircle size={12} />
                          Rendu
                        </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} />
                                                <span>Limite: {formatDate(assignment.dateLimite)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users size={14} />
                                                <span>{assignment.nombreSubmissions} soumission(s)</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <div className="flex gap-3">
                        {isEnrolled ? (
                            <button
                                disabled
                                className="flex-1 px-4 py-3 bg-green-100 text-green-800 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                            >
                                <CheckCircle size={20} />
                                Déjà inscrit
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    onEnroll(course.id);
                                    onClose();
                                }}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium"
                            >
                                <Plus size={20} />
                                S'inscrire au cours
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentCoursesPage;