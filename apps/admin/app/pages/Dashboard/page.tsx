import React from 'react';
import {
    Plus, Users as UsersIcon, User, Book, Building,
    BookOpen, BarChart3, Settings
} from 'lucide-react';
import { mockUsers, popularCourses } from '../../data/mockData';

const Dashboard: React.FC = () => {
    const mainStats = [
        {
            label: 'Étudiants',
            value: '325',
            icon: UsersIcon,
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
            trend: '+12%',
            description: 'Total des étudiants inscrits'
        },
        {
            label: 'Enseignants',
            value: '23',
            icon: User,
            color: 'bg-gradient-to-br from-green-500 to-green-600',
            trend: '+5%',
            description: 'Total des enseignants'
        },
        {
            label: 'Cours actifs',
            value: '45',
            icon: Book,
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
            trend: '+8%',
            description: 'Cours en cours'
        },
        {
            label: 'Départements',
            value: '4',
            icon: Building,
            color: 'bg-gradient-to-br from-orange-500 to-orange-600',
            trend: '+0%',
            description: 'Départements actifs'
        },
    ];

    const enrollmentData = [85, 92, 78, 88];
    const months = ['Sept', 'Oct', 'Nov', 'Déc'];

    return (
        <div className="space-y-6 p-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tableau de bord</h1>
                    <p className="text-gray-600 mt-1">Bienvenue dans le panneau d administration CampusMaster</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                        <Plus size={18} />
                        <span className="hidden sm:inline">Ajouter</span>
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Exporter les données
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainStats.map((stat, index) => {
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
                                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
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
                            <h2 className="text-xl font-bold text-gray-900">Inscriptions récentes</h2>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Voir tout
                            </button>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {mockUsers.map((user) => (
                            <div
                                key={user.id}
                                className="p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${user.role === 'Étudiant' ? 'bg-blue-500' : 'bg-green-500'}`}>
                                        {user.prenom.charAt(0)}{user.nom.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 truncate">
                                                    {user.prenom} {user.nom}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {user.role} • {user.departement}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-900">{user.dateInscription}</div>
                                                <span className={`inline-block px-2 py-1 text-xs rounded-full ${user.statut === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {user.statut}
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Cours populaires</h2>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Voir tout
                            </button>
                        </div>

                        <div className="space-y-4">
                            {popularCourses.map((course) => (
                                <div
                                    key={course.id}
                                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                            <BookOpen size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{course.titre}</h3>
                                            <p className="text-sm text-gray-600">{course.enseignant}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900">{course.etudiants}</div>
                                        <div className="text-sm text-gray-500">étudiants</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Inscriptions par mois</h2>
                        <div className="flex items-end justify-between h-48">
                            {enrollmentData.map((value, index) => (
                                <div key={index} className="flex flex-col items-center flex-1">
                                    <div
                                        className="w-12 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all hover:opacity-90 cursor-pointer"
                                        style={{ height: `${value}%` }}
                                        title={`${value}% d'inscriptions`}
                                    />
                                    <div className="mt-2 text-sm font-medium text-gray-700">{months[index]}</div>
                                    <div className="text-xs text-gray-500">{value}%</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center transition-all hover:shadow-md">
                        <UsersIcon className="text-blue-600 mb-2" size={24} />
                        <span className="font-medium text-gray-900">Ajouter un étudiant</span>
                        <span className="text-sm text-gray-500 mt-1">Nouvelle inscription</span>
                    </button>

                    <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center transition-all hover:shadow-md">
                        <BookOpen className="text-green-600 mb-2" size={24} />
                        <span className="font-medium text-gray-900">Créer un cours</span>
                        <span className="text-sm text-gray-500 mt-1">Nouveau programme</span>
                    </button>

                    <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center transition-all hover:shadow-md">
                        <BarChart3 className="text-purple-600 mb-2" size={24} />
                        <span className="font-medium text-gray-900">Voir les rapports</span>
                        <span className="text-sm text-gray-500 mt-1">Analytique détaillée</span>
                    </button>

                    <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center transition-all hover:shadow-md">
                        <Settings className="text-orange-600 mb-2" size={24} />
                        <span className="font-medium text-gray-900">Paramètres</span>
                        <span className="text-sm text-gray-500 mt-1">Configuration système</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;