import React from 'react';
import { Home, Menu, Bell, ChevronRight } from 'lucide-react';

interface TopbarProps {
    setIsMobileOpen: (open: boolean) => void;
    pageTitle?: string;
}

const Topbar: React.FC<TopbarProps> = ({ setIsMobileOpen, pageTitle = 'Tableau de bord' }) => {
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
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                    <Bell size={20} className="text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="hidden md:flex items-center gap-4">
                    <div className="text-right">
                        <div className="font-medium text-gray-800">Admin</div>
                        <div className="text-sm text-gray-500">Administrateur</div>
                    </div>
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        A
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;