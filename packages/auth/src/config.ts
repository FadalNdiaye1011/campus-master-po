import { ApiConfig } from './type';

// Configuration par défaut
const DEFAULT_BASE_URL = 'https://campusmaster-campusmaster-v1.onrender.com';

export const API_CONFIG: ApiConfig = {
    baseUrl: DEFAULT_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
};

// Fonction helper pour créer une config avec une URL personnalisée
export const createApiConfig = (baseUrl?: string): ApiConfig => ({
    ...API_CONFIG,
    baseUrl: baseUrl || API_CONFIG.baseUrl,
});

// Fonction pour obtenir l'URL depuis l'environnement (côté client Next.js)
export const getApiConfigFromEnv = (): ApiConfig => {
    const baseUrl = typeof window !== 'undefined'
        ? (window as any).NEXT_PUBLIC_API_URL
        : DEFAULT_BASE_URL;

    return createApiConfig(baseUrl);
};