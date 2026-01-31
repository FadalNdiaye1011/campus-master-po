// packages/api/src/types/teacher-student.types.ts

export interface TeacherStudent {
    id: number;
    numeroEtudiant: string;
    userId: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    status: string;
    departementId: number | null;
    departementNom: string | null;
    profilValide: boolean;
}

export interface StudentProgress {
    etudiantId: number;
    etudiantUserId: number;
    etudiantNom: string;
    numeroEtudiant: string;
    nombreCoursInscrits: number;
    nombreDevoirsRendus: number;
    nombreDevoirsEnRetard: number;
    moyenneGenerale: number;
    tauxAssiduité: number;
}