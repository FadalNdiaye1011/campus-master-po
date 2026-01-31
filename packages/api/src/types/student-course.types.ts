// packages/api/src/types/student-course.types.ts

export interface StudentCourse {
    id: number;
    titre: string;
    description: string;
    semestre: string;
    tuteurId: number;
    tuteurUserId: number;
    tuteurNom: string;
    departementId: number | null;
    departementNom: string | null;
    nombreSupports: number;
    nombreDevoirs: number;
    createdAt: string;
}

export interface StudentAssignment {
    id: number;
    titre: string;
    description: string;
    dateLimite: string;
    coursId: number;
    coursNom: string;
    coursSemestre: string;
    tuteurId: number;
    tuteurUserId: number;
    tuteurNom: string;
    nombreSubmissions: number;
    isSubmitted: boolean | null;
    createdAt: string;
}

export interface CourseEnrollment {
    id: number;
    dateInscription: string;
    etudiantId: number;
    etudiantUserId: number;
    etudiantNom: string;
    coursId: number;
    coursNom: string;
}