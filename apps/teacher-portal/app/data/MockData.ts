import { Course, Assignment, Submission, Student, Conversation, Message } from '../types';

export const mockCourses: Course[] = [
    { id: 1, titre: 'Analyse de Données', semestre: 'S1 2024', etudiants: 45, devoirs: 8, supports: 12, statut: 'Actif' },
    { id: 2, titre: 'Programmation Web', semestre: 'S1 2024', etudiants: 52, devoirs: 6, supports: 15, statut: 'Actif' },
    { id: 3, titre: 'Base de Données', semestre: 'S2 2024', etudiants: 38, devoirs: 5, supports: 10, statut: 'Inactif' },
];

export const mockAssignments: Assignment[] = [
    { id: 1, titre: 'TP Final', cours: 'Analyse de Données', dateLimite: '2024-12-20', soumissions: 35, total: 45, corrigees: 20, statut: 'En cours' },
    { id: 2, titre: 'Projet Web', cours: 'Programmation Web', dateLimite: '2024-12-15', soumissions: 48, total: 52, corrigees: 48, statut: 'Corrigé' },
    { id: 3, titre: 'TP Midterm', cours: 'Analyse de Données', dateLimite: '2024-11-30', soumissions: 45, total: 45, corrigees: 45, statut: 'Corrigé' },
    { id: 4, titre: 'Exercices SQL', cours: 'Base de Données', dateLimite: '2024-12-25', soumissions: 12, total: 38, corrigees: 0, statut: 'En cours' },
];

export const mockSubmissions: Submission[] = [
    { id: 1, etudiant: 'Amadou Diallo', email: 'amadou@example.com', fichier: 'TP_Amadou.pdf', dateSoumission: '2024-12-10 14:30', note: null, statut: 'À corriger' },
    { id: 2, etudiant: 'Fatou Ndiaye', email: 'fatou@example.com', fichier: 'TP_Fatou.zip', dateSoumission: '2024-12-09 10:15', note: 18, statut: 'Corrigé' },
    { id: 3, etudiant: 'Moussa Sarr', email: 'moussa@example.com', fichier: 'TP_Moussa.pdf', dateSoumission: '2024-12-11 16:45', note: null, statut: 'À corriger' },
    { id: 4, etudiant: 'Aïcha Fall', email: 'aicha@example.com', fichier: 'TP_Aicha.pdf', dateSoumission: '2024-12-08 09:20', note: 16, statut: 'Corrigé' },
    { id: 5, etudiant: 'Ousmane Ba', email: 'ousmane@example.com', fichier: 'TP_Ousmane.zip', dateSoumission: '2024-12-10 11:30', note: null, statut: 'À corriger' },
];

export const mockStudents: Student[] = [
    { id: 1, nom: 'Diallo', prenom: 'Amadou', email: 'amadou@example.com', cours: 'Analyse de Données', moyenne: 14.5, presence: 92 },
    { id: 2, nom: 'Ndiaye', prenom: 'Fatou', email: 'fatou@example.com', cours: 'Programmation Web', moyenne: 16.8, presence: 95 },
    { id: 3, nom: 'Sarr', prenom: 'Moussa', email: 'moussa@example.com', cours: 'Analyse de Données', moyenne: 12.3, presence: 88 },
    { id: 4, nom: 'Fall', prenom: 'Aïcha', email: 'aicha@example.com', cours: 'Programmation Web', moyenne: 15.2, presence: 90 },
    { id: 5, nom: 'Ba', prenom: 'Ousmane', email: 'ousmane@example.com', cours: 'Base de Données', moyenne: 13.7, presence: 85 },
];

export const mockConversations: Conversation[] = [
    { id: 1, nom: 'Amadou Diallo', dernier: 'Bonjour, concernant le TP...', date: '10:30', nonLu: 2, isGroup: false },
    { id: 2, nom: 'Fatou Ndiaye', dernier: 'Merci pour les corrections', date: 'Hier', nonLu: 0, isGroup: false },
    { id: 3, nom: 'Groupe - Analyse de Données', dernier: 'Question sur l\'exercice 3', date: '15:45', nonLu: 5, isGroup: true },
];

export const mockMessages: Message[] = [
    { id: 1, sender: 'Amadou Diallo', content: 'Bonjour professeur, j\'ai une question concernant le TP final.', time: '10:30', isOwn: false },
    { id: 2, sender: 'Vous', content: 'Bonjour Amadou, je suis disponible. Quelle est votre question ?', time: '10:32', isOwn: true },
    { id: 3, sender: 'Amadou Diallo', content: 'Je ne comprends pas la partie sur les régressions linéaires.', time: '10:33', isOwn: false },
    { id: 4, sender: 'Vous', content: 'Je vais vous envoyer un exemple détaillé par email.', time: '10:35', isOwn: true },
];