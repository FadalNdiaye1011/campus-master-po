// packages/api/src/services/userService.ts

import { ParentService } from '../parent-service';
import type {
    User,
    CreateUserRequest,
    UpdateUserRequest,
    UserResponse,
} from '../types/user.types';

const API_CONFIG = {
    baseUrl: '', // Vide pour utiliser le proxy local
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    },
};

export class UserService extends ParentService {
    private static instance: UserService;

    constructor() {
        super(API_CONFIG);
    }

    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    /**
     * Récupère la liste des utilisateurs (plus de pagination)
     */
    static async getUsers(): Promise<User[]> {
        const service = UserService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📥 Fetching users');

        const response = await service.gethttp.get<User[]>(
            `/api/proxy/users`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Recherche des utilisateurs par mot-clé (plus de pagination)
     */
    static async searchUsers(keyword: string): Promise<User[]> {
        const service = UserService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('🔍 Searching users:', keyword);

        const response = await service.gethttp.get<User[]>(
            `/api/proxy/users?keyword=${encodeURIComponent(keyword)}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Crée un nouvel utilisateur
     */
    static async createUser(data: CreateUserRequest): Promise<UserResponse> {
        const service = UserService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('➕ Creating user:', data.email);

        const response = await service.gethttp.post<UserResponse>(
            '/api/proxy/users',
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
     * Met à jour un utilisateur
     */
    static async updateUser(userId: number, data: UpdateUserRequest): Promise<User> {
        const service = UserService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('✏️ Updating user:', userId);

        const response = await service.gethttp.put<User>(
            `/api/proxy/users/${userId}`,
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
     * Supprime un utilisateur
     */
    static async deleteUser(userId: number): Promise<void> {
        const service = UserService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('🗑️ Deleting user:', userId);

        await service.gethttp.delete<void>(
            `/api/proxy/users/${userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
    }
}