import { ParentService } from '../parent-service';
import type {
    Department,
    CreateDepartmentRequest,
    UpdateDepartmentRequest,
} from '../types/department.types';

const API_CONFIG = {
    baseUrl: '',
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    },
};

export class DepartmentService extends ParentService {
    private static instance: DepartmentService;

    constructor() {
        super(API_CONFIG);
    }

    static getInstance(): DepartmentService {
        if (!DepartmentService.instance) {
            DepartmentService.instance = new DepartmentService();
        }
        return DepartmentService.instance;
    }

    /**
     * Récupère tous les départements
     */
    static async getDepartments(): Promise<Department[]> {
        const service = DepartmentService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📥 Fetching departments');

        const response = await service.gethttp.get<Department[]>(
            '/api/proxy/departments',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Récupère un département par ID
     */
    static async getDepartmentById(departmentId: number): Promise<Department> {
        const service = DepartmentService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📥 Fetching department:', departmentId);

        const response = await service.gethttp.get<Department>(
            `/api/proxy/departments/${departmentId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Crée un nouveau département
     */
    static async createDepartment(data: CreateDepartmentRequest): Promise<Department> {
        const service = DepartmentService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('➕ Creating department:', data.libelle);

        const response = await service.gethttp.post<Department>(
            '/api/proxy/departments',
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
     * Met à jour un département
     */
    static async updateDepartment(
        departmentId: number,
        data: UpdateDepartmentRequest
    ): Promise<Department> {
        const service = DepartmentService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('✏️ Updating department:', departmentId);

        const response = await service.gethttp.put<Department>(
            `/api/proxy/departments/${departmentId}`,
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
     * Supprime un département
     */
    static async deleteDepartment(departmentId: number): Promise<void> {
        const service = DepartmentService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('🗑️ Deleting department:', departmentId);

        await service.gethttp.delete<void>(
            `/api/proxy/departments/${departmentId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
    }
}