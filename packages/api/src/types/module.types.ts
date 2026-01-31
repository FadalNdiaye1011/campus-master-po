// packages/api/src/types/module.types.ts

export interface Module {
    id: number;
    code: string;
    libelle: string;
    description: string;
    credits: number;
    actif: boolean;
    semestreId: number;
    semestreLibelle: string;
    departementId: number;
    departementNom: string;
    nombreMatieres: number;
    createdAt: string;
}

export interface CreateModuleRequest {
    code: string;
    libelle: string;
    description: string;
    credits: number;
    semestreId: number;
    departementId: number;
}

export interface UpdateModuleRequest {
    code: string;
    libelle: string;
    description: string;
    credits: number;
    semestreId: number;
    departementId: number;
}