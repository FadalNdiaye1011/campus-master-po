export type Course = {
    id: number;
    titre: string;
    semestre: string;
    etudiants: number;
    devoirs: number;
    supports: number;
    statut: 'Actif' | 'Inactif';
};

export type Assignment = {
    id: number;
    titre: string;
    cours: string;
    dateLimite: string;
    soumissions: number;
    total: number;
    corrigees: number;
    statut: 'En cours' | 'Corrigé';
};

export type Submission = {
    id: number;
    etudiant: string;
    email: string;
    fichier: string;
    dateSoumission: string;
    note: number | null;
    statut: 'À corriger' | 'Corrigé';
};

export type Student = {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    cours: string;
    moyenne: number;
    presence: number;
};

export type Conversation = {
    id: number;
    nom: string;
    dernier: string;
    date: string;
    nonLu: number;
    isGroup: boolean;
};

export type Message = {
    id: number;
    sender: string;
    content: string;
    time: string;
    isOwn: boolean;
};