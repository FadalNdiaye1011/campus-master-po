import React from 'react';
import { Menu, Bell, Search, Home, ChevronRight } from 'lucide-react';

interface TeacherTopbarProps {
    setIsMobileOpen: (open: boolean) => void;
    pageTitle?: string;
    showSearch?: boolean;
}

const TeacherTopbar: React.FC<TeacherTopbarProps> = ({
                                                         setIsMobileOpen,
                                                         pageTitle = 'Tableau de bord',
                                                         showSearch = true
                                                     }) => {
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

            <div className="flex-1 max-w-xl mx-4">
                {showSearch && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Rechercher"
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                    <Bell size={20} className="text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="hidden md:flex items-center gap-4">
                    <div className="text-right">
                        <div className="font-medium text-gray-800">Dr. Fatou Ndiaye</div>
                        <div className="text-sm text-gray-500">Enseignant</div>
                    </div>
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        FN
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TeacherTopbar;