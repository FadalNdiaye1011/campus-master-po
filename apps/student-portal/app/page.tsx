

'use client'

import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/TopBar';
import Footer from './components/layout/Footer';

import StudentCoursesPage from "@/app/pages/Cours/page";
import StudentAssignmentsPage from "@/app/pages/Devoirs/page";


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const pageTitles: Record<string, string> = {
    dashboard: 'Tableau de bord',
    users: 'Gestion des utilisateurs',
    courses: 'Gestion des cours',
    assignments: 'Gestion des devoirs',
    modules: 'Gestion des modules',
    matieres: 'Gestion des matieres',
    departments: 'Gestion des départements',
    semesters: 'Gestion des semestres',
    statistics: 'Statistiques',
    settings: 'Paramètres'
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'courses': return <StudentCoursesPage />;
      case 'assignments': return <StudentAssignmentsPage />;

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