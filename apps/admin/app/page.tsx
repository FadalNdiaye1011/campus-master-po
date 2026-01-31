'use client'

import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard/page';
import UsersPage from './pages/Users/page';
import CoursesPage from "@/app/pages/Courses/page";
import ModulesPage from "@/app/pages/Modules/page";
import MatieresPage from "@/app/pages/Matieres/page";
import DepartmentsPage from "@/app/pages/Departments/page";
import SemestersPage from "@/app/pages/Semesters/page";
import StatisticsPage from "@/app/pages/Statistics/page";
import SettingsPage from "@/app/pages/Settings/page";

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const pageTitles: Record<string, string> = {
        dashboard: 'Tableau de bord',
        users: 'Gestion des utilisateurs',
        courses: 'Gestion des cours',
        modules: 'Gestion des modules',
        matieres: 'Gestion des matieres',
        departments: 'Gestion des départements',
        semesters: 'Gestion des semestres',
        statistics: 'Statistiques',
        settings: 'Paramètres'
    };

    const renderPage = () => {
        switch(currentPage) {
            case 'dashboard': return <Dashboard />;
            case 'users': return <UsersPage />;
            case 'courses': return <CoursesPage />;
            case 'modules': return <ModulesPage />;
            case 'matieres': return <MatieresPage />;
            case 'departments': return <DepartmentsPage />;
            case 'semesters': return <SemestersPage />;
            case 'statistics': return <StatisticsPage />;
            case 'settings': return <SettingsPage />;
            default: return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar
                    setIsMobileOpen={setIsMobileOpen}
                    pageTitle={pageTitles[currentPage]}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {renderPage()}
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default App;