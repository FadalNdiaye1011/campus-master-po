'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Mail,
    Phone,
    Eye,
    TrendingUp,
    Users,
    BookOpen,
    BarChart,
    CheckCircle,
    Clock,
    Download,
    ChevronDown,
    MessageSquare,
    RefreshCw,
    X,
} from 'lucide-react';
import {
    TeacherStudentService,
    TeacherStudent,
    StudentProgress,
} from '@repo/api';

const TeacherStudentsPage: React.FC = () => {
    const [students, setStudents] = useState<TeacherStudent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('Tous');
    const [selectedStudent, setSelectedStudent] = useState<TeacherStudent | null>(null);

    /**
     * Charge les étudiants
     */
    const loadStudents = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('📥 Chargement étudiants...');

            const response = await TeacherStudentService.getAllStudents();

            console.log('✅ Étudiants chargés:', response);

            setStudents(response);
        } catch (err: any) {
            console.error('❌ Erreur chargement étudiants:', err);
            setError(err.message || 'Erreur lors du chargement des étudiants');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    /**
     * Filtrage des étudiants
     */
    const departments = ['Tous', ...Array.from(new Set(students.map(s => s.departementNom).filter(Boolean)))];

    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.numeroEtudiant.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDepartment =
            selectedDepartment === 'Tous' || student.departementNom === selectedDepartment;

        return matchesSearch && matchesDepartment;
    });

    /**
     * Calcul des stats
     */
    const stats = {
        total: students.length,
        active: students.filter(s => s.status === 'ACTIVE').length,
        validated: students.filter(s => s.profilValide).length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mes étudiants</h1>
                    <p className="text-gray-600 mt-1">Gérez et suivez vos étudiants</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={loadStudents}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        disabled={loading}
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        Actualiser
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <Download size={20} />
                        Exporter
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-gray-600">Total étudiants</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="text-green-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
                            <div className="text-gray-600">Actifs</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.validated}</div>
                            <div className="text-gray-600">Profils validés</div>
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

            {/* Students Table */}
            {!loading && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                            <div className="flex-1 w-full">
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un étudiant..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 w-full lg:w-auto">
                                <div className="relative flex-1 lg:flex-none">
                                    <select
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                    >
                                        {departments.map((dept) => (
                                            <option key={dept || 'all'} value={dept || ''}>
                                                {dept || 'Tous'}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                        size={20}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {filteredStudents.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Users className="mx-auto mb-2" size={48} />
                            <p>Aucun étudiant trouvé</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                        Étudiant
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                        Contact
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                        Département
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                        Statut
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                        Profil
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-800 font-medium">
                              {student.firstName.charAt(0)}
                                {student.lastName.charAt(0)}
                            </span>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {student.firstName} {student.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{student.numeroEtudiant}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail size={14} className="text-gray-400" />
                                                    <span className="text-gray-600">{student.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone size={14} className="text-gray-400" />
                                                    <span className="text-gray-600">{student.phoneNumber}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.departementNom ? (
                                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            {student.departementNom}
                          </span>
                                            ) : (
                                                <span className="text-sm text-gray-400">Non défini</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                        <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                                student.status === 'ACTIVE'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {student.status}
                        </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.profilValide ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={12} />
                            Validé
                          </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock size={12} />
                            En attente
                          </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedStudent(student)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                                                    title="Voir détails"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                                                    <MessageSquare size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Affichage de {filteredStudents.length} sur {students.length} étudiants
                        </div>
                    </div>
                </div>
            )}

            {/* Student Detail Modal */}
            {selectedStudent && (
                <StudentDetailModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                />
            )}
        </div>
    );
};

const StudentDetailModal: React.FC<{
    student: TeacherStudent;
    onClose: () => void;
}> = ({ student, onClose }) => {
    const [progress, setProgress] = useState<StudentProgress | null>(null);
    const [loadingProgress, setLoadingProgress] = useState(true);

    useEffect(() => {
        const loadProgress = async () => {
            try {
                setLoadingProgress(true);
                const data = await TeacherStudentService.getStudentProgress(student.id);
                setProgress(data);
            } catch (err: any) {
                console.error('❌ Erreur chargement progression:', err);
            } finally {
                setLoadingProgress(false);
            }
        };

        loadProgress();
    }, [student.id]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                    <h2 className="text-xl font-bold">Détails de l'étudiant</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        aria-label="Fermer"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6 mb-8">
                        {/* Profile Card */}
                        <div className="lg:w-1/3">
                            <div className="bg-gray-50 rounded-xl p-6 text-center">
                                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-blue-800 font-bold">
                    {student.firstName.charAt(0)}
                      {student.lastName.charAt(0)}
                  </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {student.firstName} {student.lastName}
                                </h3>
                                <p className="text-gray-600 mb-2">{student.email}</p>
                                <p className="text-sm text-gray-500 mb-4">{student.numeroEtudiant}</p>
                                <div className="space-y-2">
                                    {student.departementNom && (
                                        <div className="flex items-center justify-center gap-2">
                                            <BookOpen size={16} className="text-gray-400" />
                                            <span className="text-gray-700">{student.departementNom}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-center gap-2">
                                        <Phone size={16} className="text-gray-400" />
                                        <span className="text-gray-700">{student.phoneNumber}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Stats */}
                        <div className="lg:w-2/3 space-y-6">
                            {loadingProgress ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600" />
                                </div>
                            ) : progress ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-blue-50 p-4 rounded-xl">
                                            <div className="text-sm text-gray-600 mb-1">Moyenne générale</div>
                                            <div className="text-3xl font-bold text-blue-600">
                                                {progress.moyenneGenerale.toFixed(1)}/20
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {progress.moyenneGenerale >= 15
                                                    ? 'Excellent'
                                                    : progress.moyenneGenerale >= 12
                                                        ? 'Très bien'
                                                        : progress.moyenneGenerale >= 10
                                                            ? 'Satisfaisant'
                                                            : 'À améliorer'}
                                            </div>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-xl">
                                            <div className="text-sm text-gray-600 mb-1">Taux d'assiduité</div>
                                            <div className="text-3xl font-bold text-green-600">
                                                {progress.tauxAssiduité}%
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {progress.tauxAssiduité >= 90
                                                    ? 'Exemplaire'
                                                    : progress.tauxAssiduité >= 75
                                                        ? 'Régulier'
                                                        : 'Irrégulier'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                                        <h4 className="font-bold text-gray-900 mb-4">Statistiques</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                <div className="text-gray-700">Cours inscrits</div>
                                                <span className="font-bold text-gray-900">
                          {progress.nombreCoursInscrits}
                        </span>
                                            </div>
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                <div className="text-gray-700">Devoirs rendus</div>
                                                <span className="font-bold text-green-600">
                          {progress.nombreDevoirsRendus}
                        </span>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <div className="text-gray-700">Devoirs en retard</div>
                                                <span className="font-bold text-red-600">
                          {progress.nombreDevoirsEnRetard}
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <BarChart className="mx-auto mb-2" size={48} />
                                    <p>Aucune donnée de progression disponible</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Contacter l'étudiant
                        </button>
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

export default TeacherStudentsPage;