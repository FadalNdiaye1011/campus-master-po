export interface Matiere {
    id: number;
    code: string;
    libelle: string;
    description: string;
    coefficient: number;
    volumeHoraire: number;
    actif: boolean;
    moduleId: number;
    moduleLibelle: string;
    nombreCours: number;
    createdAt: string;
}

export interface CreateMatiereRequest {
    code: string;
    libelle: string;
    description: string;
    coefficient: number;
    volumeHoraire: number;
    moduleId: number;
}

export interface UpdateMatiereRequest {
    code: string;
    libelle: string;
    description: string;
    coefficient: number;
    volumeHoraire: number;
    moduleId: number;
}