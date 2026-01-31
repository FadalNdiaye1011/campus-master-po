export interface TeacherAssignment {
    id: number;
    titre: string;
    description: string;
    dateLimite: string;
    coursId: number;
    coursNom: string;
    nombreSubmissions: number;
    isSubmitted: boolean | null;
    createdAt: string;
}

export interface CreateAssignmentRequest {
    titre: string;
    description: string;
    dateLimite: string;
    coursId: number;
}

export interface UpdateAssignmentRequest {
    titre: string;
    description: string;
    dateLimite: string;
    coursId: number;
}

export interface AssignmentSubmission {
    id: number;
    dateSoumission: string;
    note: number;
    feedback: string;
    fichierUrl: string;
    devoirId: number;
    devoirTitre: string;
    etudiantId: number;
    etudiantUserId: number;
    etudiantNom: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}

export interface EvaluateSubmissionRequest {
    note: number;
    feedback: string;
}