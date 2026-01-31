'use client';

import React, { useState, useEffect } from 'react';
import {
    FileText,
    Clock,
    CheckCircle,
    AlertCircle,
    Calendar,
    User,
    RefreshCw,
    Search,
    Filter,
    Upload,
} from 'lucide-react';
import {
    StudentCourseService,
    StudentCourse,
    StudentAssignment,
} from '@repo/api';
import SubmitAssignmentModal from '../../components/assignments/SubmitAssignmentModal';

const StudentAssignmentsPage: React.FC = () => {
    const [courses, setCourses] = useState<StudentCourse[]>([]);
    const [allAssignments, setAllAssignments] = useState<StudentAssignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('Tous');
    const [selectedAssignment, setSelectedAssignment] = useState<StudentAssignment | null>(null);

    /**
     * Charge les devoirs
     */
    const loadAssignments = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('📥 Chargement devoirs...');

            // Récupère les cours disponibles
            const availableCourses = await StudentCourseService.getAvailableCourses();
            setCourses(availableCourses);

            // Récupère tous les devoirs de tous les cours
            const assignmentsPromises = availableCourses.map((course) =>
                StudentCourseService.getCourseAssignments(course.id)
            );

            const assignmentsArrays = await Promise.all(assignmentsPromises);
            const assignments = assignmentsArrays.flat();

            setAllAssignments(assignments);

            console.log('✅ Devoirs chargés:', assignments.length);
        } catch (err: any) {
            console.error('❌ Erreur chargement devoirs:', err);
            setError(err.message || 'Erreur lors du chargement des devoirs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAssignments();
    }, []);

    /**
     * Filtrage des devoirs
     */
    const statuses = ['Tous', 'À rendre', 'Rendu', 'En retard'];

    const filteredAssignments = allAssignments.filter((assignment) => {
        const matchesSearch =
            assignment.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.coursNom.toLowerCase().includes(searchQuery.toLowerCase());

        const isExpired = new Date(assignment.dateLimite) < new Date();
        const isSubmitted = assignment.isSubmitted;

        let matchesStatus = true;
        if (selectedStatus === 'À rendre') {
            matchesStatus = !isSubmitted && !isExpired;
        } else if (selectedStatus === 'Rendu') {
            matchesStatus = isSubmitted === true;
        } else if (selectedStatus === 'En retard') {
            matchesStatus = !isSubmitted && isExpired;
        }

        return matchesSearch && matchesStatus;
    });

    /**
     * Format de date
     */
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    /**
     * Retourne le style selon le statut
     */
    const getAssignmentStatus = (assignment: StudentAssignment) => {
        const isExpired = new Date(assignment.dateLimite) < new Date();
        const isSubmitted = assignment.isSubmitted;

        if (isSubmitted) {
            return {
                label: 'Rendu',
                bg: 'bg-green-50',
                border: 'border-green-200',
                badge: 'bg-green-100 text-green-800',
                icon: <CheckCircle size={20} className="text-green-600" />,
            };
        } else if (isExpired) {
            return {
                label: 'En retard',
                bg: 'bg-red-50',
                border: 'border-red-200',
                badge: 'bg-red-100 text-red-800',
                icon: <AlertCircle size={20} className="text-red-600" />,
            };
        } else {
            return {
                label: 'À rendre',
                bg: 'bg-yellow-50',
                border: 'border-yellow-200',
                badge: 'bg-yellow-100 text-yellow-800',
                icon: <Clock size={20} className="text-yellow-600" />,
            };
        }
    };

    /**
     * Stats
     */
    const stats = {
        total: allAssignments.length,
        toSubmit: allAssignments.filter(
            (a) => !a.isSubmitted && new Date(a.dateLimite) >= new Date()
        ).length,
        submitted: allAssignments.filter((a) => a.isSubmitted).length,
        late: allAssignments.filter(
            (a) => !a.isSubmitted && new Date(a.dateLimite) < new Date()
        ).length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mes Devoirs</h1>
                    <p className="text-gray-600 mt-1">
                        Gérez vos devoirs et soumissions
                    </p>
                </div>
                <button
                    onClick={loadAssignments}
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
                            <FileText className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-gray-600">Total devoirs</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Clock className="text-yellow-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.toSubmit}</div>
                            <div className="text-gray-600">À rendre</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="text-green-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.submitted}</div>
                            <div className="text-gray-600">Rendus</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="text-red-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.late}</div>
                            <div className="text-gray-600">En retard</div>
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

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                    <div className="flex-1 w-full">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Rechercher un devoir..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 w-full lg:w-auto">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="flex-1 lg:flex-none px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4" />
                    <p className="text-gray-600">Chargement...</p>
                </div>
            )}

            {/* Assignments List */}
            {!loading && filteredAssignments.length > 0 && (
                <div className="space-y-4">
                    {filteredAssignments.map((assignment) => {
                        const status = getAssignmentStatus(assignment);
                        return (
                            <div
                                key={assignment.id}
                                className={`${status.bg} border ${status.border} rounded-xl p-6 transition-shadow hover:shadow-md`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3 flex-1">
                                        {status.icon}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {assignment.titre}
                                                </h3>
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.badge}`}>
                          {status.label}
                        </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">
                                                {assignment.description}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <FileText size={14} />
                                                    <span>{assignment.coursNom}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User size={14} />
                                                    <span>{assignment.tuteurNom}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    <span>{formatDate(assignment.dateLimite)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedAssignment(assignment)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
                                    >
                                        <Upload size={16} />
                                        {assignment.isSubmitted ? 'Modifier' : 'Soumettre'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredAssignments.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchQuery || selectedStatus !== 'Tous'
                            ? 'Aucun devoir trouvé'
                            : 'Aucun devoir'}
                    </h3>
                    <p className="text-gray-600">
                        {searchQuery || selectedStatus !== 'Tous'
                            ? 'Essayez de modifier vos filtres de recherche'
                            : 'Aucun devoir disponible pour le moment'}
                    </p>
                </div>
            )}

            {/* Submit Modal */}
            {selectedAssignment && (
                <SubmitAssignmentModal
                    assignment={selectedAssignment}
                    onClose={() => setSelectedAssignment(null)}
                    onSuccess={() => {
                        setSelectedAssignment(null);
                        loadAssignments();
                    }}
                />
            )}
        </div>
    );
};

export default StudentAssignmentsPage;