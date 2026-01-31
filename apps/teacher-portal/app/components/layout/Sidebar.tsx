import React from 'react';
import {
    Home, BookOpen, FileText, Users, MessageSquare, Settings, LogOut,
    X, ChevronRight,Megaphone
} from 'lucide-react';
import {AuthService} from "@repo/auth/src";

interface TeacherSidebarProps {
    currentPage: string;
    setCurrentPage: (page: string) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
    teacherName?: string;
    teacherEmail?: string;
}

const TeacherSidebar: React.FC<TeacherSidebarProps> = ({
                                                           currentPage,
                                                           setCurrentPage,
                                                           isMobileOpen,
                                                           setIsMobileOpen,
                                                           teacherName = 'Dr. Fatou Ndiaye',
                                                           teacherEmail = 'fatou.ndiaye@campus.sn'
                                                       }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Tableau de bord', icon: Home },
        { id: 'annonces', label: 'Mes Annonces', icon: Megaphone },
        { id: 'courses', label: 'Mes cours', icon: BookOpen },
        { id: 'assignments', label: 'Devoirs', icon: FileText },
        { id: 'students', label: 'Étudiants', icon: Users },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'settings', label: 'Paramètres', icon: Settings },
    ];

    const handleLogout = () => {
        AuthService.logout();
        window.location.href = 'http://localhost:3000';
    };

    return (
        <>
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transform transition-transform duration-300 lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-blue-700 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">CampusMaster</h1>
                        <p className="text-blue-200 text-sm mt-1">Enseignant</p>
                    </div>
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="lg:hidden p-2 hover:bg-blue-700 rounded-lg"
                        aria-label="Fermer le menu"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {menuItems.map(item => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setCurrentPage(item.id);
                                    setIsMobileOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentPage === item.id ? 'bg-white text-blue-900 font-semibold shadow-lg' : 'hover:bg-blue-700 hover:text-white'}`}
                                aria-current={currentPage === item.id ? 'page' : undefined}
                            >
                                <Icon size={20} />
                                <span className="text-left">{item.label}</span>
                                {currentPage === item.id && (
                                    <ChevronRight className="ml-auto" size={16} />
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-6 border-t border-blue-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-white text-blue-900 rounded-full flex items-center justify-center font-bold text-lg">
                            {teacherName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <div className="font-semibold truncate">{teacherName}</div>
                            <div className="text-sm text-blue-200 truncate">{teacherEmail}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg transition"
                    >
                        <LogOut size={18} />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default TeacherSidebar;