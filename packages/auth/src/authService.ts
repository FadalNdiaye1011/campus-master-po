import { ParentService } from '@repo/api';

const API_CONFIG = {
    baseUrl: '', // Vide = active le proxy automatiquement
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    },
};

// Configuration des URLs par environnement
const getAppUrls = () => {
    // Détection basée sur l'hostname au lieu de NODE_ENV
    const isLocal = typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1');

    if (isLocal) {
        // URLs locales pour développement
        return {
            auth: 'http://localhost:3000',
            admin: 'http://localhost:3001',
            student: 'http://localhost:3003',
            teacher: 'http://localhost:3002',
        };
    }

    // URLs de production Vercel
    return {
        auth: process.env.NEXT_PUBLIC_AUTH_URL || 'https://campus-master-po-auth.vercel.app',
        admin: process.env.NEXT_PUBLIC_ADMIN_URL || 'https://campus-master-po-admin.vercel.app',
        student: process.env.NEXT_PUBLIC_STUDENT_URL || 'https://campus-master-po-student-portal.vercel.app',
        teacher: process.env.NEXT_PUBLIC_TEACHER_URL || 'https://campus-master-po-teacher-portal.vercel.app',
    };
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

    /**
     * Retourne l'URL de l'app selon le rôle (production ou dev)
     */
    static getUrlForRole(role: string): string {
        const urls = getAppUrls();

        switch (role) {
            case 'admin':
                return urls.admin;
            case 'student':
                return urls.student;
            case 'professor':
            case 'teacher':
                return urls.teacher;
            default:
                return urls.auth;
        }
    }

    /**
     * Redirige vers l'app appropriée selon le rôle
     */
    static redirectToRoleApp(role: string): void {
        if (typeof window === 'undefined') return;

        const url = this.getUrlForRole(role);
        const user = this.getCurrentUser();
        const token = this.getToken();

        // Construire l'URL avec les données d'authentification
        const authData = encodeURIComponent(JSON.stringify({
            user,
            token
        }));

        window.location.href = `${url}?auth=${authData}`;
    }

    /**
     * @deprecated Utiliser getUrlForRole() à la place
     */
    static getPortForRole(role: string): number {
        console.warn('⚠️ getPortForRole est déprécié, utilisez getUrlForRole()');
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