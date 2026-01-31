// packages/api/src/services/semesterService.ts

import { ParentService } from '../parent-service';
import type {
    Semester,
    CreateSemesterRequest,
    UpdateSemesterRequest,
} from '../types/semester.types';

const API_CONFIG = {
    baseUrl: '',
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    },
};

export class SemesterService extends ParentService {
    private static instance: SemesterService;

    constructor() {
        super(API_CONFIG);
    }

    static getInstance(): SemesterService {
        if (!SemesterService.instance) {
            SemesterService.instance = new SemesterService();
        }
        return SemesterService.instance;
    }

    /**
     * Récupère tous les semestres
     */
    static async getSemesters(): Promise<Semester[]> {
        const service = SemesterService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📥 Fetching semesters');

        const response = await service.gethttp.get<Semester[]>(
            '/api/proxy/semesters',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Récupère les semestres actifs uniquement
     */
    static async getActiveSemesters(): Promise<Semester[]> {
        const service = SemesterService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📥 Fetching active semesters');

        const response = await service.gethttp.get<Semester[]>(
            '/api/proxy/semesters/actifs',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Crée un nouveau semestre
     */
    static async createSemester(data: CreateSemesterRequest): Promise<Semester> {
        const service = SemesterService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('➕ Creating semester:', data.libelle);

        const response = await service.gethttp.post<Semester>(
            '/api/proxy/semesters',
            data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Met à jour un semestre
     */
    static async updateSemester(semesterId: number, data: UpdateSemesterRequest): Promise<Semester> {
        const service = SemesterService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('✏️ Updating semester:', semesterId);

        const response = await service.gethttp.put<Semester>(
            `/api/proxy/semesters/${semesterId}`,
            data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Supprime un semestre
     */
    static async deleteSemester(semesterId: number): Promise<void> {
        const service = SemesterService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('🗑️ Deleting semester:', semesterId);

        await service.gethttp.delete<void>(
            `/api/proxy/semesters/${semesterId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
    }

    /**
     * Active un semestre
     */
    static async activateSemester(semesterId: number): Promise<Semester> {
        const service = SemesterService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('✅ Activating semester:', semesterId);

        const response = await service.gethttp.put<Semester>(
            `/api/proxy/semesters/${semesterId}/activer`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Désactive un semestre
     */
    static async deactivateSemester(semesterId: number): Promise<Semester> {
        const service = SemesterService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('❌ Deactivating semester:', semesterId);

        const response = await service.gethttp.put<Semester>(
            `/api/proxy/semesters/${semesterId}/desactiver`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }
}