// packages/api/src/services/moduleService.ts

import { ParentService } from '../parent-service';
import type {
    Module,
    CreateModuleRequest,
    UpdateModuleRequest,
} from '../types/module.types';

const API_CONFIG = {
    baseUrl: '',
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    },
};

export class ModuleService extends ParentService {
    private static instance: ModuleService;

    constructor() {
        super(API_CONFIG);
    }

    static getInstance(): ModuleService {
        if (!ModuleService.instance) {
            ModuleService.instance = new ModuleService();
        }
        return ModuleService.instance;
    }

    /**
     * Récupère tous les modules
     */
    static async getModules(): Promise<Module[]> {
        const service = ModuleService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📥 Fetching modules');

        const response = await service.gethttp.get<Module[]>(
            '/api/proxy/modules',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Crée un nouveau module
     */
    static async createModule(data: CreateModuleRequest): Promise<Module> {
        const service = ModuleService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('➕ Creating module:', data.libelle);

        const response = await service.gethttp.post<Module>(
            '/api/proxy/modules',
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
     * Met à jour un module
     */
    static async updateModule(moduleId: number, data: UpdateModuleRequest): Promise<Module> {
        const service = ModuleService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('✏️ Updating module:', moduleId);

        const response = await service.gethttp.put<Module>(
            `/api/proxy/modules/${moduleId}`,
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
     * Supprime un module
     */
    static async deleteModule(moduleId: number): Promise<void> {
        const service = ModuleService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('🗑️ Deleting module:', moduleId);

        await service.gethttp.delete<void>(
            `/api/proxy/modules/${moduleId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
    }

    /**
     * Active un module
     */
    static async activateModule(moduleId: number): Promise<Module> {
        const service = ModuleService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('✅ Activating module:', moduleId);

        const response = await service.gethttp.put<Module>(
            `/api/proxy/modules/${moduleId}/activer`,
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
     * Désactive un module
     */
    static async deactivateModule(moduleId: number): Promise<Module> {
        const service = ModuleService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('❌ Deactivating module:', moduleId);

        const response = await service.gethttp.put<Module>(
            `/api/proxy/modules/${moduleId}/desactiver`,
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