'use client';

import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    BookOpen,
    Download,
    Calendar,
    FileText,
    CheckCircle,
    Clock,
    Award,
    AlertCircle,
} from 'lucide-react';
import { StatisticsService, Statistics } from '@repo/api';

const StatisticsPage: React.FC = () => {
    const [stats, setStats] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    /**
     * Charge les statistiques
     */
    const loadStatistics = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('📥 Chargement des statistiques...');

            const response = await StatisticsService.getStatistics();

            console.log('✅ Statistiques chargées:', response);

            setStats(response);
        } catch (err: any) {
            console.error('❌ Erreur chargement statistiques:', err);
            setError(err.message || 'Erreur lors du chargement des statistiques');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Charge au montage
     */
    useEffect(() => {
        loadStatistics();
    }, []);

    /**
     * Calcule le pourcentage
     */
    const calculatePercentage = (value: number, total: number) => {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4" />
                    <p className="text-gray-600">Chargement des statistiques...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-6">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg p-4">
                    Aucune statistique disponible
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Statistiques</h1>
                    <p className="text-gray-600 mt-1">Analyses et données de performance</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={loadStatistics}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        <Calendar size={20} />
                        Actualiser
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Download size={20} />
                        Exporter
                    </button>
                </div>
            </div>

            {/* Stats Cards Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="text-blue-600" size={24} />
                        </div>
                        <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              {stats.nombreEtudiantsActifs} actifs
            </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        {stats.nombreEtudiants}
                    </div>
                    <div className="text-gray-600">Total étudiants</div>
                    <div className="mt-2 text-sm text-gray-500">
                        {stats.nombreEtudiantsInactifs} inactifs
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <BookOpen className="text-green-600" size={24} />
                        </div>
                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {stats.nombreModules} modules
            </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        {stats.nombreCours}
                    </div>
                    <div className="text-gray-600">Cours disponibles</div>
                    <div className="mt-2 text-sm text-gray-500">
                        {stats.nombreEnseignants} enseignants
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Award className="text-purple-600" size={24} />
                        </div>
                        <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              {stats.tauxReussite}%
            </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        {stats.moyenneGenerale.toFixed(1)}/20
                    </div>
                    <div className="text-gray-600">Moyenne générale</div>
                    <div className="mt-2 text-sm text-gray-500">
                        {stats.nombreEtudiantsReussis} réussis
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <FileText className="text-orange-600" size={24} />
                        </div>
                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {stats.tauxRemiseDevoirs}%
            </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        {stats.nombreDevoirsTotal}
                    </div>
                    <div className="text-gray-600">Total devoirs</div>
                    <div className="mt-2 text-sm text-gray-500">
                        {stats.nombreDevoirsRendus} rendus
                    </div>
                </div>
            </div>

            {/* Devoirs Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Statut des devoirs</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                        <FileText className="mx-auto text-blue-600 mb-3" size={32} />
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                            {stats.nombreDevoirsTotal}
                        </div>
                        <div className="text-gray-700 font-medium">Total</div>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                        <CheckCircle className="mx-auto text-green-600 mb-3" size={32} />
                        <div className="text-3xl font-bold text-green-600 mb-2">
                            {stats.nombreDevoirsRendus}
                        </div>
                        <div className="text-gray-700 font-medium">Rendus</div>
                        <div className="text-sm text-green-600 mt-1">
                            {stats.tauxRemiseDevoirs}% du total
                        </div>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                        <Clock className="mx-auto text-orange-600 mb-3" size={32} />
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                            {stats.nombreDevoirsEnAttente}
                        </div>
                        <div className="text-gray-700 font-medium">En attente</div>
                        <div className="text-sm text-orange-600 mt-1">
                            {calculatePercentage(stats.nombreDevoirsEnAttente, stats.nombreDevoirsTotal)}% du total
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance and Success Rate */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance par matière */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Performance par matière</h2>
                        <BarChart3 className="text-gray-400" size={20} />
                    </div>

                    {Object.keys(stats.performanceParMatiere).length > 0 ? (
                        <div className="space-y-4">
                            {Object.entries(stats.performanceParMatiere).map(([matiere, moyenne], index) => {
                                const colors = [
                                    'bg-blue-500',
                                    'bg-green-500',
                                    'bg-purple-500',
                                    'bg-orange-500',
                                    'bg-pink-500',
                                ];
                                const color = colors[index % colors.length];

                                return (
                                    <div key={matiere}>
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="font-medium text-gray-900">{matiere}</span>
                                            <span className="text-gray-600 font-bold">{moyenne.toFixed(1)}/20</span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${color} rounded-full transition-all duration-500`}
                                                style={{ width: `${(moyenne / 20) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <BookOpen className="mx-auto mb-2" size={32} />
                            <p>Aucune donnée de performance disponible</p>
                        </div>
                    )}
                </div>

                {/* Répartition des résultats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Répartition des résultats</h2>
                        <TrendingUp className="text-gray-400" size={20} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-3xl font-bold text-green-600">
                                {stats.nombreEtudiantsReussis}
                            </div>
                            <div className="text-sm text-gray-600">Réussis</div>
                            <div className="text-xs text-green-600 mt-1">
                                {stats.tauxReussite}%
                            </div>
                        </div>

                        <div className="text-center p-4 bg-red-50 rounded-lg">
                            <div className="text-3xl font-bold text-red-600">
                                {stats.nombreEtudiantsEchoues}
                            </div>
                            <div className="text-sm text-gray-600">Échoués</div>
                            <div className="text-xs text-red-600 mt-1">
                                {100 - stats.tauxReussite}%
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-600 mb-1">Taux de réussite</div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {stats.tauxReussite}%
                                </div>
                            </div>
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                <Award className="text-blue-600" size={32} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nombre d'étudiants par matière */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Étudiants par matière</h2>
                    <Users className="text-gray-400" size={20} />
                </div>

                {Object.keys(stats.nombreEtudiantsParMatiere).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(stats.nombreEtudiantsParMatiere).map(([matiere, nombre], index) => {
                            const colors = [
                                { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
                                { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
                                { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
                                { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
                                { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200' },
                            ];
                            const colorSet = colors[index % colors.length];

                            return (
                                <div
                                    key={matiere}
                                    className={`p-4 ${colorSet.bg} border ${colorSet.border} rounded-lg`}
                                >
                                    <div className={`text-2xl font-bold ${colorSet.text} mb-2`}>
                                        {nombre}
                                    </div>
                                    <div className="text-sm font-medium text-gray-700">{matiere}</div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <Users className="mx-auto mb-2" size={32} />
                        <p>Aucune donnée d'inscription disponible</p>
                    </div>
                )}
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Résumé global</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                                <div className="text-2xl font-bold">{stats.nombreEtudiants}</div>
                                <div className="text-blue-100 text-sm">Étudiants</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.nombreCours}</div>
                                <div className="text-blue-100 text-sm">Cours</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.moyenneGenerale.toFixed(1)}</div>
                                <div className="text-blue-100 text-sm">Moyenne</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.tauxReussite}%</div>
                                <div className="text-blue-100 text-sm">Réussite</div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <BarChart3 size={64} className="text-white/30" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;
