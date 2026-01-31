import { ParentService } from '@repo/api';

const API_CONFIG = {
    baseUrl: '', // Vide = active le proxy automatiquement
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    },
};

export class AuthService extends ParentService {
    private static instance: AuthService;

    constructor() {
        super(API_CONFIG);
    }

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    /**
     * Authentifie un utilisateur via l'API
     * Le proxy est géré automatiquement par ParentService !
     */
    static async login<E, R>(endpoint: string, credentials: E): Promise<R> {
        console.log('🔐 AuthService.login - Début');
        console.log('📦 Credentials:', credentials);

        try {
            const service = AuthService.getInstance();

            // Appeler directement l'endpoint - le proxy est automatique !
            const response = await service.postData<E, R>(endpoint, credentials);
            console.log('✅ Réponse reçue:', response);

            return response;
        } catch (error: any) {
            console.error('❌ Erreur dans AuthService.login:', error);

            // Gérer les erreurs spécifiques
            if (error.status === 401) {
                throw new Error('Email ou mot de passe incorrect');
            }

            if (error.status === 400) {
                throw new Error(error.data?.message || 'Données invalides');
            }

            // Erreur générique
            throw new Error(
                error.data?.message ||
                error.message ||
                'Une erreur est survenue lors de la connexion'
            );
        }
    }

    static saveUserToLocalStorage(user: any, token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
            localStorage.setItem('auth_user', JSON.stringify(user));
            console.log('💾 Données sauvegardées dans localStorage');
        }
    }

    static getCurrentUser(): any | null {
        if (typeof window === 'undefined') return null;

        const userStr = localStorage.getItem('auth_user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }

    static getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('auth_token');
    }

    static isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('auth_token');
    }

    static hasRole(role: string): boolean {
        const user = this.getCurrentUser();
        return user?.role === role;
    }

    static logout(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        console.log('🚪 Déconnexion effectuée');
    }

    static getUserFromUrl(): any | null {
        if (typeof window === 'undefined') return null;

        const params = new URLSearchParams(window.location.search);
        const authData = params.get('auth');

        if (!authData) return null;

        try {
            const data = JSON.parse(decodeURIComponent(authData));
            this.saveUserToLocalStorage(data.user || data, data.token);
            window.history.replaceState({}, '', window.location.pathname);
            console.log('✅ Utilisateur récupéré depuis URL');
            return data.user || data;
        } catch (error) {
            console.error('❌ Erreur lors du parsing de l\'auth URL:', error);
            return null;
        }
    }

    static getPortForRole(role: string): number {
        switch (role) {
            case 'admin':
                return 3001;
            case 'student':
                return 3003;
            case 'professor':
                return 3002;
            default:
                return 3000;
        }
    }
}