// packages/api/src/types/teacher-announcement.types.ts

export type AnnouncementPriority = 'BASSE' | 'NORMALE' | 'HAUTE' | 'URGENTE';

export interface TeacherAnnouncement {
    id: number;
    titre: string;
    contenu: string;
    datePublication: string;
    priorite: AnnouncementPriority;
    coursId: number;
    coursNom: string;
    tuteurId: number;
    tuteurNom: string;
    createdAt: string;
}

export interface CreateAnnouncementRequest {
    titre: string;
    contenu: string;
    priorite: AnnouncementPriority;
    coursId: number;
    tuteurId: number;
}

export interface UpdateAnnouncementRequest {
    titre: string;
    contenu: string;
    priorite: AnnouncementPriority;
    coursId: number;
    tuteurId: number;
}