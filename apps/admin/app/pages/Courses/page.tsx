'use client'

import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Eye, Trash2, BookOpen, Users, Calendar, Building } from 'lucide-react';
import { popularCourses } from '../../data/mockData';

const CoursesPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCourses = popularCourses.filter(course =>
        course.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.enseignant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.departement.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestion des cours</h1>
                    <p className="text-gray-600 mt-1">Gérez tous les cours et programmes</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <Plus size={20} />
                    Ajouter un cours
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <BookOpen size={24} />
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">+12%</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">45</div>
                    <div className="text-lg font-medium">Cours actifs</div>
                    <p className="text-blue-100 text-sm mt-2">Total des cours en cours</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Users size={24} />
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">+8%</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">1,245</div>
                    <div className="text-lg font-medium">Étudiants inscrits</div>
                    <p className="text-green-100 text-sm mt-2">Total des inscriptions</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Calendar size={24} />
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">+5%</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">4</div>
                    <div className="text-lg font-medium">Départements</div>
                    <p className="text-purple-100 text-sm mt-2">Départements actifs</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher un cours..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap">
                            <Filter size={20} />
                            Filtres
                        </button>
                        <button className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Exporter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Cours</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Enseignant</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Département</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Étudiants</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Taux de complétion</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {filteredCourses.map((course, index) => (
                            <tr key={course.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                            <BookOpen size={18} className="text-white" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{course.titre}</div>
                                            <div className="text-sm text-gray-500">CRS-{100 + index}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-800 text-sm font-medium">
                          {course.enseignant.split(' ')[0].charAt(0)}{course.enseignant.split(' ')[1].charAt(0)}
                        </span>
                                        </div>
                                        <span className="text-gray-900">{course.enseignant}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Building size={16} className="text-gray-400" />
                                        <span className="text-gray-700">{course.departement}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-lg font-bold text-gray-900">{course.etudiants}</div>
                                    <div className="text-sm text-gray-500">étudiants</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-500 rounded-full"
                                                style={{ width: `${Math.min(100, 70 + index * 10)}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                        {Math.min(100, 70 + index * 10)}%
                      </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg">
                                            <Edit size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                        Affichage de 1 à {filteredCourses.length} cours
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Précédent</button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Suivant</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursesPage;