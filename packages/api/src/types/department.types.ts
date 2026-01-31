// packages/api/src/types/department.types.ts

export interface Department {
    id: number;
    libelle: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDepartmentRequest {
    libelle: string;
    description: string;
}

export interface UpdateDepartmentRequest {
    libelle: string;
    description: string;
}