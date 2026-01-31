import { User, Course, Department, Semester } from '../types';

export const mockUsers: User[] = [
    { id: 1, nom: 'Diallo', prenom: 'Amadou', email: 'amadou@example.com', role: 'Étudiant', departement: 'Informatique', statut: 'Actif', dateInscription: '2024-01-15' },
    { id: 2, nom: 'Ndiaye', prenom: 'Fatou', email: 'fatou@example.com', role: 'Enseignant', departement: 'Mathématiques', statut: 'Actif', dateInscription: '2023-09-01' },
    { id: 3, nom: 'Sarr', prenom: 'Moussa', email: 'moussa@example.com', role: 'Étudiant', departement: 'Physique', statut: 'Inactif', dateInscription: '2024-02-20' },
    { id: 4, nom: 'Fall', prenom: 'Aïcha', email: 'aicha@example.com', role: 'Enseignant', departement: 'Informatique', statut: 'Actif', dateInscription: '2022-10-10' },
    { id: 5, nom: 'Ba', prenom: 'Ousmane', email: 'ousmane@example.com', role: 'Étudiant', departement: 'Chimie', statut: 'Actif', dateInscription: '2024-03-05' },
];

export const popularCourses: Course[] = [
    { id: 1, titre: 'Analyse de Données', enseignant: 'Fatou Ndiaye', departement: 'Informatique', etudiants: 45 },
    { id: 2, titre: 'Algèbre Linéaire', enseignant: 'Fatou Ndiaye', departement: 'Mathématiques', etudiants: 38 },
    { id: 3, titre: 'Mécanique Quantique', enseignant: 'Aïcha Fall', departement: 'Physique', etudiants: 25 },
    { id: 4, titre: 'Programmation Web', enseignant: 'Aïcha Fall', departement: 'Informatique', etudiants: 52 },
];

export const mockDepartments: Department[] = [
    { id: 1, nom: 'Informatique', responsable: 'Dr. Aïcha Fall', etudiants: 120, enseignants: 8, cours: 15 },
    { id: 2, nom: 'Mathématiques', responsable: 'Dr. Fatou Ndiaye', etudiants: 85, enseignants: 6, cours: 12 },
    { id: 3, nom: 'Physique', responsable: 'Dr. Moussa Sarr', etudiants: 65, enseignants: 5, cours: 10 },
    { id: 4, nom: 'Chimie', responsable: 'Dr. Amadou Diallo', etudiants: 55, enseignants: 4, cours: 8 },
];

export const mockSemesters: Semester[] = [
    { id: 1, nom: 'Semestre 1 2024-2025', dateDebut: '2024-09-01', dateFin: '2025-01-31', statut: 'En cours' },
    { id: 2, nom: 'Semestre 2 2023-2024', dateDebut: '2024-02-01', dateFin: '2024-06-30', statut: 'Terminé' },
    { id: 3, nom: 'Semestre 2 2024-2025', dateDebut: '2025-02-01', dateFin: '2025-06-30', statut: 'À venir' },
];