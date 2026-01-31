import React from 'react';
import {
    BookOpen, Users, FileText, Clock, TrendingUp,
    Download, Calendar, CheckCircle, AlertCircle
} from 'lucide-react';
import { mockCourses, mockAssignments, mockSubmissions } from '../../data/MockData';

const TeacherDashboard: React.FC = () => {
    const stats = [
        {
            label: 'Mes cours',
            value: '3',
            icon: BookOpen,
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
            trend: '+1',
            description: 'Cours actifs'
        },
        {
            label: 'Étudiants',
            value: '135',
            icon: Users,
            color: 'bg-gradient-to-br from-green-500 to-green-600',
            trend: '+12',
            description: 'Total inscrits'
        },
        {
            label: 'Devoirs actifs',
            value: '12',
            icon: FileText,
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
            trend: '+2',
            description: 'À gérer'
        },
        {
            label: 'À corriger',
            value: '8',
            icon: Clock,
            color: 'bg-gradient-to-br from-orange-500 to-orange-600',
            trend: '-3',
            description: 'Soumissions'
        },
    ];

    const pendingAssignments = mockAssignments.filter(a => a.statut === 'En cours');
    const recentSubmissions = mockSubmissions.slice(0, 5);

    return (
        <div className="space-y-6 p-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tableau de bord</h1>
                    <p className="text-gray-600 mt-1">Bienvenue Dr. Fatou Ndiaye</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                        <Download size={18} />
                        <span className="hidden sm:inline">Exporter</span>
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Vue d'ensemble
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <Icon size={24} className="text-white" />
                                </div>
                                <span className={`text-sm font-medium px-2 py-1 rounded ${
                                    stat.trend.startsWith('+')
                                        ? 'text-green-600 bg-green-50'
                                        : 'text-red-600 bg-red-50'
                                }`}>
                  {stat.trend}
                </span>
                            </div>
                            <div className="mb-2">
                                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                <div className="text-lg font-semibold text-gray-700">{stat.label}</div>
                            </div>
                            <p className="text-sm text-gray-500">{stat.description}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Devoirs à corriger</h2>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Voir tout
                            </button>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {pendingAssignments.map(assignment => (
                            <div key={assignment.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{assignment.titre}</h3>
                                        <p className="text-sm text-gray-600">{assignment.cours}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-blue-600">
                                            {assignment.soumissions - assignment.corrigees}
                                        </div>
                                        <div className="text-sm text-gray-500">à corriger</div>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        <span>Échéance: {assignment.dateLimite}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users size={14} />
                                        <span>{assignment.soumissions}/{assignment.total}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Mes cours</h2>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Voir tout
                            </button>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {mockCourses.map(course => (
                            <div key={course.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{course.titre}</h3>
                                        <p className="text-sm text-gray-600">{course.semestre}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-blue-600">{course.etudiants}</div>
                                        <div className="text-sm text-gray-500">étudiants</div>
                                    </div>
                                </div>
                                <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                                    <div className="text-center p-2 bg-blue-50 rounded">
                                        <div className="font-bold text-blue-600">{course.devoirs}</div>
                                        <div className="text-gray-600">Devoirs</div>
                                    </div>
                                    <div className="text-center p-2 bg-green-50 rounded">
                                        <div className="font-bold text-green-600">{course.supports}</div>
                                        <div className="text-gray-600">Supports</div>
                                    </div>
                                    <div className={`text-center p-2 rounded ${
                                        course.statut === 'Actif' ? 'bg-green-50' : 'bg-gray-100'
                                    }`}>
                                        <div className={`font-bold ${course.statut === 'Actif' ? 'text-green-600' : 'text-gray-600'}`}>
                                            {course.statut}
                                        </div>
                                        <div className="text-gray-600">Statut</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Soumissions récentes</h2>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Voir tout
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Étudiant</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Cours</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Fichier</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Statut</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {recentSubmissions.map(sub => (
                            <tr key={sub.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-800 font-medium">
                          {sub.etudiant.split(' ').map(n => n[0]).join('')}
                        </span>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{sub.etudiant}</div>
                                            <div className="text-sm text-gray-500">{sub.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    {sub.id <= 2 ? 'Analyse de Données' : 'Programmation Web'}
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                                        <Download size={14} />
                                        {sub.fichier}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{sub.dateSoumission}</td>
                                <td className="px-6 py-4">
                                    {sub.statut === 'Corrigé' ? (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800">
                        <CheckCircle size={14} />
                        <span className="text-sm font-medium">Corrigé {sub.note}/20</span>
                      </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                        <AlertCircle size={14} />
                        <span className="text-sm font-medium">À corriger</span>
                      </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                                        Noter
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;