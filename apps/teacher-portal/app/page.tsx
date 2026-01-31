'use client'

import React, { useState } from 'react';
import TeacherDashboard from "@/app/pages/Dashboard/page";
import TeacherSidebar from "@/app/components/layout/Sidebar";
import TeacherTopbar from "@/app/components/layout/TopBar";
import TeacherFooter from "@/app/components/layout/Footer";
import TeacherCoursesPage from "@/app/pages/Courses/page";
import TeacherAssignmentsPage from "@/app/pages/Assignments/page";
import TeacherStudentsPage from "@/app/pages/Students/page";
import TeacherMessagesPage from "@/app/pages/Messages/page";
import TeacherSettingsPage from "@/app/pages/Settings/page";
import TeacherAnnouncementsPage from "@/app/pages/Annonces/page";


const TeacherApp: React.FC = () => {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const pageTitles: Record<string, string> = {
        dashboard: 'Tableau de bord',
        courses: 'Mes cours',
        annonces: 'Mes annonces',
        assignments: 'Devoirs',
        students: 'Étudiants',
        messages: 'Messages',
        settings: 'Paramètres'
    };

    const pageComponents: Record<string, React.FC> = {
        dashboard: TeacherDashboard,
        courses: TeacherCoursesPage,
        annonces:TeacherAnnouncementsPage,
        assignments: TeacherAssignmentsPage,
        students: TeacherStudentsPage,
        messages: TeacherMessagesPage,
        settings: TeacherSettingsPage,
    };

    const CurrentPageComponent = pageComponents[currentPage] || TeacherDashboard;

    return (
        <div className="flex h-screen bg-gray-50">
            <TeacherSidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <TeacherTopbar
                    setIsMobileOpen={setIsMobileOpen}
                    pageTitle={pageTitles[currentPage]}
                    showSearch={currentPage !== 'messages'}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <CurrentPageComponent />
                </main>

                <TeacherFooter />
            </div>
        </div>
    );
};

export default TeacherApp;