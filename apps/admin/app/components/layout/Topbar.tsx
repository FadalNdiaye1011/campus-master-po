import React, { useState, useEffect } from 'react';
import { Home, Menu, Bell, ChevronRight, LogOut } from 'lucide-react';

interface TopbarProps {
    setIsMobileOpen: (open: boolean) => void;
    pageTitle?: string;
}

interface UserData {
    id: string;
    email: string;
    name: string;
    role: string;
}

const Topbar: React.FC<TopbarProps> = ({ setIsMobileOpen, pageTitle = 'Tableau de bord' }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        // Récupérer les données utilisateur depuis localStorage
        const authUserStr = localStorage.getItem('auth_user');
        if (authUserStr) {
            try {
                const userData = JSON.parse(authUserStr);
                setUser(userData);
                console.log('👤 Utilisateur chargé:', userData);
            } catch (error) {
                console.error('❌ Erreur parsing auth_user:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        // Supprimer les données d'authentification
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');

        // Rediriger vers la page de connexion
        window.location.href = '/';
    };

    // Fonction pour obtenir les initiales
    const getInitials = (name: string): string => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Fonction pour traduire le rôle
    const getRoleLabel = (role: string): string => {
        const roleMap: { [key: string]: string } = {
            'admin': 'Administrateur',
            'student': 'Étudiant',
            'professor': 'Enseignant',
            'ADMIN': 'Administrateur',
            'STUDENT': 'Étudiant',
            'PROFESSOR': 'Enseignant',
        };
        return roleMap[role] || role;
    };

    return (
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Ouvrir le menu"
            >
                <Menu size={24} className="text-gray-700" />
            </button>

            <div className="hidden lg:flex items-center gap-4">
                <h1 className="text-xl font-bold text-gray-800">{pageTitle}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Home size={14} />
                    <ChevronRight size={14} />
                    <span>{pageTitle}</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                    <Bell size={20} className="text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {user && (
                    <div className="hidden md:flex items-center gap-4 relative">
                        <div className="text-right">
                            <div className="font-medium text-gray-800">{user.name}</div>
                            <div className="text-sm text-gray-500">{getRoleLabel(user.role)}</div>
                        </div>

                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold hover:shadow-lg transition transform hover:scale-105"
                        >
                            {getInitials(user.name)}
                        </button>

                        {/* Menu déroulant */}
                        {showUserMenu && (
                            <>
                                {/* Overlay pour fermer le menu */}
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowUserMenu(false)}
                                />

                                {/* Menu */}
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                        <div className="text-xs text-gray-400 mt-1">{getRoleLabel(user.role)}</div>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-red-50 text-red-600 transition"
                                    >
                                        <LogOut size={18} />
                                        <span className="font-medium">Déconnexion</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Version mobile du user */}
                {user && (
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="md:hidden w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold relative"
                    >
                        {getInitials(user.name)}

                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowUserMenu(false)}
                                />

                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                        <div className="text-xs text-gray-400 mt-1">{getRoleLabel(user.role)}</div>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-red-50 text-red-600 transition"
                                    >
                                        <LogOut size={18} />
                                        <span className="font-medium">Déconnexion</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </button>
                )}
            </div>
        </header>
    );
};

export default Topbar;