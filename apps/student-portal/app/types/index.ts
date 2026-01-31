export type User = {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: 'Étudiant' | 'Enseignant' | 'Administrateur';
    departement: string;
    statut: 'Actif' | 'Inactif';
    dateInscription: string;
};

export type Course = {
    id: number;
    titre: string;
    enseignant: string;
    departement: string;
    etudiants: number;
};

export type Department = {
    id: number;
    nom: string;
    responsable: string;
    etudiants: number;
    enseignants: number;
    cours: number;
};

export type Semester = {
    id: number;
    nom: string;
    dateDebut: string;
    dateFin: string;
    statut: 'En cours' | 'Terminé' | 'À venir';
};

export type MenuItem = {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
};