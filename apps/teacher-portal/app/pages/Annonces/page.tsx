'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Megaphone,
    AlertCircle,
    Info,
    AlertTriangle,
    Clock,
    RefreshCw,
    Search,
    Filter,
} from 'lucide-react';
import {
    TeacherAnnouncementService,
    TeacherAnnouncement,
    AnnouncementPriority,
} from '@repo/api';
import AnnouncementForm from '../../components/announcements/AnnouncementForm';

const TeacherAnnouncementsPage: React.FC = () => {
    const [announcements, setAnnouncements] = useState<TeacherAnnouncement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [editAnnouncement, setEditAnnouncement] = useState<TeacherAnnouncement | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPriority, setSelectedPriority] = useState<string>('Toutes');

    /**
     * Charge les annonces
     */
    const loadAnnouncements = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('📥 Chargement annonces...');

            const response = await TeacherAnnouncementService.getMyAnnouncements();

            console.log('✅ Annonces chargées:', response);

            setAnnouncements(response);
        } catch (err: any) {
            console.error('❌ Erreur chargement annonces:', err);
            setError(err.message || 'Erreur lors du chargement des annonces');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnnouncements();
    }, []);

    /**
     * Supprime une annonce
     */
    const handleDelete = async (announcementId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
            return;
        }

        try {
            await TeacherAnnouncementService.deleteAnnouncement(announcementId);
            alert('Annonce supprimée avec succès');
            loadAnnouncements();
        } catch (err: any) {
            console.error('❌ Erreur suppression:', err);
            alert(err.message || 'Erreur lors de la suppression');
        }
    };

    /**
     * Ouvre le formulaire d'édition
     */
    const handleEdit = (announcement: TeacherAnnouncement) => {
        setEditAnnouncement(announcement);
        setShowForm(true);
    };

    /**
     * Callback après création/modification réussie
     */
    const handleFormSuccess = () => {
        setShowForm(false);
        setEditAnnouncement(null);
        loadAnnouncements();
    };

    /**
     * Filtrage des annonces
     */
    const priorities = ['Toutes', 'BASSE', 'NORMALE', 'HAUTE', 'URGENTE'];

    const filteredAnnouncements = announcements.filter((announcement) => {
        const matchesSearch =
            announcement.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            announcement.contenu.toLowerCase().includes(searchQuery.toLowerCase()) ||
            announcement.coursNom.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPriority =
            selectedPriority === 'Toutes' || announcement.priorite === selectedPriority;

        return matchesSearch && matchesPriority;
    });

    /**
     * Format de date
     */
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    /**
     * Retourne le style et l'icône selon la priorité
     */
    const getPriorityStyle = (priorite: AnnouncementPriority) => {
        switch (priorite) {
            case 'URGENTE':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    text: 'text-red-800',
                    badge: 'bg-red-100 text-red-800',
                    icon: <AlertCircle size={20} className="text-red-600" />,
                };
            case 'HAUTE':
                return {
                    bg: 'bg-orange-50',
                    border: 'border-orange-200',
                    text: 'text-orange-800',
                    badge: 'bg-orange-100 text-orange-800',
                    icon: <AlertTriangle size={20} className="text-orange-600" />,
                };
            case 'NORMALE':
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    text: 'text-blue-800',
                    badge: 'bg-blue-100 text-blue-800',
                    icon: <Info size={20} className="text-blue-600" />,
                };
            case 'BASSE':
                return {
                    bg: 'bg-gray-50',
                    border: 'border-gray-200',
                    text: 'text-gray-800',
                    badge: 'bg-gray-100 text-gray-800',
                    icon: <Info size={20} className="text-gray-600" />,
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    border: 'border-gray-200',
                    text: 'text-gray-800',
                    badge: 'bg-gray-100 text-gray-800',
                    icon: <Info size={20} className="text-gray-600" />,
                };
        }
    };

    /**
     * Calcul des stats
     */
    const stats = {
        total: announcements.length,
        urgentes: announcements.filter((a) => a.priorite === 'URGENTE').length,
        hautes: announcements.filter((a) => a.priorite === 'HAUTE').length,
        normales: announcements.filter((a) => a.priorite === 'NORMALE').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Mes annonces
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Gérez vos annonces et communiquez avec vos étudiants
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={loadAnnouncements}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        disabled={loading}
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        Actualiser
                    </button>
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setEditAnnouncement(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus size={20} />
                        Nouvelle annonce
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Megaphone className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-gray-600">Total annonces</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="text-red-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.urgentes}</div>
                            <div className="text-gray-600">Urgentes</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="text-orange-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.hautes}</div>
                            <div className="text-gray-600">Priorité haute</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Info className="text-green-600" size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.normales}</div>
                            <div className="text-gray-600">Normales</div>
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

            {/* Filters */}
            {!loading && (
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
                                    placeholder="Rechercher une annonce..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 w-full lg:w-auto">
                            <select
                                value={selectedPriority}
                                onChange={(e) => setSelectedPriority(e.target.value)}
                                className="flex-1 lg:flex-none px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {priorities.map((priority) => (
                                    <option key={priority} value={priority}>
                                        {priority === 'Toutes' ? 'Toutes priorités' : priority}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Announcements List */}
            {!loading && filteredAnnouncements.length > 0 && (
                <div className="space-y-4">
                    {filteredAnnouncements.map((announcement) => {
                        const style = getPriorityStyle(announcement.priorite);
                        return (
                            <div
                                key={announcement.id}
                                className={`${style.bg} border ${style.border} rounded-xl p-6 transition-shadow hover:shadow-md`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3 flex-1">
                                        {style.icon}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {announcement.titre}
                                                </h3>
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${style.badge}`}>
                          {announcement.priorite}
                        </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                <span className="font-medium">{announcement.coursNom}</span>
                                                <span className="flex items-center gap-1">
                          <Clock size={14} />
                                                    {formatDate(announcement.datePublication)}
                        </span>
                                            </div>
                                            <p className="text-gray-700 whitespace-pre-wrap">
                                                {announcement.contenu}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => handleEdit(announcement)}
                                            className="p-2 hover:bg-white/50 rounded-lg text-gray-600 transition"
                                            title="Modifier"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(announcement.id)}
                                            className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition"
                                            title="Supprimer"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredAnnouncements.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Megaphone className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchQuery || selectedPriority !== 'Toutes'
                            ? 'Aucune annonce trouvée'
                            : 'Aucune annonce'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {searchQuery || selectedPriority !== 'Toutes'
                            ? 'Essayez de modifier vos filtres de recherche'
                            : 'Commencez par créer votre première annonce'}
                    </p>
                    {!searchQuery && selectedPriority === 'Toutes' && (
                        <button
                            onClick={() => {
                                setShowForm(true);
                                setEditAnnouncement(null);
                            }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <Plus size={20} />
                            Créer une annonce
                        </button>
                    )}
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <AnnouncementForm
                    announcement={editAnnouncement}
                    onClose={() => {
                        setShowForm(false);
                        setEditAnnouncement(null);
                    }}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default TeacherAnnouncementsPage;