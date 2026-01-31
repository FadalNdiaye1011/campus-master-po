// packages/api/src/types/semester.types.ts

export interface Semester {
    id: number;
    code: string;
    libelle: string;
    anneeAcademique: string;
    dateDebut: string;
    dateFin: string;
    actif: boolean;
    nombreModules: number;
    createdAt: string;
}

export interface CreateSemesterRequest {
    code: string;
    libelle: string;
    anneeAcademique: string;
    dateDebut: string;
    dateFin: string;
}

export interface UpdateSemesterRequest {
    code: string;
    libelle: string;
    anneeAcademique: string;
    dateDebut: string;
    dateFin: string;
}