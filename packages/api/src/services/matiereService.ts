import { ParentService } from '../parent-service';
import type {
    Matiere,
    CreateMatiereRequest,
    UpdateMatiereRequest,
} from '../types/matiere.types';

const API_CONFIG = {
    baseUrl: '',
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    },
};

export class MatiereService extends ParentService {
    private static instance: MatiereService;

    constructor() {
        super(API_CONFIG);
    }

    static getInstance(): MatiereService {
        if (!MatiereService.instance) {
            MatiereService.instance = new MatiereService();
        }
        return MatiereService.instance;
    }

    static async getMatieres(): Promise<Matiere[]> {
        const service = MatiereService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📥 Fetching matieres');

        const response = await service.gethttp.get<Matiere[]>(
            '/api/proxy/matieres',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    static async createMatiere(data: CreateMatiereRequest): Promise<Matiere> {
        const service = MatiereService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('➕ Creating matiere:', data.libelle);

        const response = await service.gethttp.post<Matiere>(
            '/api/proxy/matieres',
            data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    static async updateMatiere(matiereId: number, data: UpdateMatiereRequest): Promise<Matiere> {
        const service = MatiereService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('✏️ Updating matiere:', matiereId);

        const response = await service.gethttp.put<Matiere>(
            `/api/proxy/matieres/${matiereId}`,
            data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    static async deleteMatiere(matiereId: number): Promise<void> {
        const service = MatiereService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('🗑️ Deleting matiere:', matiereId);

        await service.gethttp.delete<void>(
            `/api/proxy/matieres/${matiereId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
    }

    static async activateMatiere(matiereId: number): Promise<Matiere> {
        const service = MatiereService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('✅ Activating matiere:', matiereId);

        const response = await service.gethttp.put<Matiere>(
            `/api/proxy/matieres/${matiereId}/activer`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    static async deactivateMatiere(matiereId: number): Promise<Matiere> {
        const service = MatiereService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('❌ Deactivating matiere:', matiereId);

        const response = await service.gethttp.put<Matiere>(
            `/api/proxy/matieres/${matiereId}/desactiver`,
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