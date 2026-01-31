export type UserRole = 'admin' | 'student' | 'professor';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    token?: string;
    error?: string;
}

export interface ApiConfig {
    baseUrl: string;
    headers?: Record<string, string>;
}

// Réponse de l'API backend
export interface ApiLoginResponse {
    user: User;
    token: string;
    // Ajoutez d'autres champs selon votre API
}