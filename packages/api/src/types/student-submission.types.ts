export interface StudentSubmission {
    id: number;
    dateSoumission: string;
    note: number | null;
    feedback: string | null;
    fichierUrl: string;
    devoirId: number;
    devoirTitre: string;
    etudiantId: number;
    etudiantUserId: number;
    etudiantNom: string;
    version: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSubmissionRequest {
    devoirId: number;
    fichierUrl: string;
}

export interface UpdateSubmissionRequest {
    devoirId: number;
    fichierUrl: string;
}

export interface FileUploadResponse {
    url?: string;
    fileUrl?: string;
    path?: string;
    [key: string]: any;
}