export interface TeacherSupport {
    id: number;
    titre: string;
    description: string;
    urlFichier: string;
    typeFichier: string;
    coursId: number;
    coursNom: string;
    tailleFichier: number | null;
    createdAt: string;
}

export interface CreateSupportRequest {
    titre: string;
    description: string;
    urlFichier: string;
    typeFichier: string;
    coursId: number;
}

export interface FileUploadResponse {
    url?: string;
    fileUrl?: string;
    path?: string;
    [key: string]: any;
}