// packages/api/src/types/teacher-course.types.ts

export interface TeacherCourse {
    id: number;
    titre: string;
    description: string;
    semestre: string;
    tuteurId: number;
    tuteurNom: string;
    departementId: number | null;
    departementNom: string | null;
    nombreSupports: number;
    nombreDevoirs: number;
    createdAt: string;
}

export interface CreateTeacherCourseRequest {
    titre: string;
    description: string;
    semestre: string;
    tuteurId: number;
    departementId: number;
}

export interface UpdateTeacherCourseRequest {
    titre: string;
    description: string;
    semestre: string;
    tuteurId: number;
    departementId: number;
}

export interface CourseStats {
    coursId: number;
    coursNom: string;
    nombreEtudiants: number;
    nombreSupports: number;
    nombreDevoirs: number;
    devoirsEnAttente: number;
    devoirsEvalues: number;
    moyenneGenerale: number;
    tauxRendu: number;
}

export interface CourseStudent {
    id: number;
    numeroEtudiant: string;
    userId: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    status: string;
    departementId: number;
    departementNom: string;
    profilValide: boolean;
}

export interface CourseAssignment {
    id: number;
    titre: string;
    description: string;
    dateLimite: string;
    coursId: number;
    coursNom: string;
    nombreSubmissions: number;
    isSubmitted: boolean;
    createdAt: string;
}

export interface CourseSupport {
    id: number;
    titre: string;
    description: string;
    urlFichier: string;
    typeFichier: string;
    coursId: number;
    coursNom: string;
    tailleFichier: number;
    createdAt: string;
}

export interface CourseAnnouncement {
    id: number;
    titre: string;
    contenu: string;
    coursId: number;
    coursNom: string;
    createdAt: string;
}