import { ParentService } from '../parent-service';
import type {
    TeacherAnnouncement,
    CreateAnnouncementRequest,
    UpdateAnnouncementRequest,
} from '../types/teacher-announcement.types';

const API_CONFIG = {
    baseUrl: '',
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    },
};

export class TeacherAnnouncementService extends ParentService {
    private static instance: TeacherAnnouncementService;

    constructor() {
        super(API_CONFIG);
    }

    static getInstance(): TeacherAnnouncementService {
        if (!TeacherAnnouncementService.instance) {
            TeacherAnnouncementService.instance = new TeacherAnnouncementService();
        }
        return TeacherAnnouncementService.instance;
    }

    /**
     * Récupère l'ID du tuteur depuis le localStorage
     */
    private static getTuteurId(): number {
        if (typeof window === 'undefined') {
            return 0;
        }

        const authUserStr = localStorage.getItem('auth_user');
        if (authUserStr) {
            try {
                const user = JSON.parse(authUserStr);
                const id = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
                return id || 0;
            } catch (err) {
                console.error('❌ Error parsing auth_user:', err);
            }
        }

        return 0;
    }

    /**
     * Récupère toutes les annonces de l'enseignant
     */
    static async getMyAnnouncements(): Promise<TeacherAnnouncement[]> {
        const service = TeacherAnnouncementService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';
        const tuteurId = this.getTuteurId();

        if (tuteurId === 0) {
            throw new Error('ID du tuteur introuvable. Veuillez vous reconnecter.');
        }

        console.log('📥 Fetching announcements for tuteur:', tuteurId);

        const response = await service.gethttp.get<TeacherAnnouncement[]>(
            `/api/proxy/teacher/announcements/user/${tuteurId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Crée une nouvelle annonce
     */
    static async createAnnouncement(
        data: Omit<CreateAnnouncementRequest, 'tuteurId'>
    ): Promise<TeacherAnnouncement> {
        const service = TeacherAnnouncementService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';
        const tuteurId = this.getTuteurId();

        if (tuteurId === 0) {
            throw new Error('ID du tuteur introuvable. Veuillez vous reconnecter.');
        }

        console.log('➕ Creating announcement');

        const requestData: CreateAnnouncementRequest = {
            ...data,
            tuteurId,
        };

        const response = await service.gethttp.post<TeacherAnnouncement>(
            '/api/proxy/teacher/announcements',
            requestData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Met à jour une annonce
     */
    static async updateAnnouncement(
        announcementId: number,
        data: Omit<UpdateAnnouncementRequest, 'tuteurId'>
    ): Promise<TeacherAnnouncement> {
        const service = TeacherAnnouncementService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';
        const tuteurId = this.getTuteurId();

        if (tuteurId === 0) {
            throw new Error('ID du tuteur introuvable. Veuillez vous reconnecter.');
        }

        console.log('✏️ Updating announcement:', announcementId);

        const requestData: UpdateAnnouncementRequest = {
            ...data,
            tuteurId,
        };

        const response = await service.gethttp.put<TeacherAnnouncement>(
            `/api/proxy/teacher/announcements/${announcementId}`,
            requestData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Supprime une annonce
     */
    static async deleteAnnouncement(announcementId: number): Promise<void> {
        const service = TeacherAnnouncementService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('🗑️ Deleting announcement:', announcementId);

        await service.gethttp.delete<void>(
            `/api/proxy/teacher/announcements/${announcementId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
    }
}