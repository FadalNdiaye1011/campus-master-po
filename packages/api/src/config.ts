// packages/api/src/config.ts

import type { ApiConfig } from './types';

/**
 * Configuration par défaut de l'API
 * Peut être surchargée par les variables d'environnement
 */
export const API_CONFIG: ApiConfig = {
    baseUrl: 'https://campusmaster-campusmaster-v1.onrender.com',
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 secondes
};

/**
 * Crée une configuration API personnalisée
 *
 * @param baseUrl - L'URL de base de l'API
 * @param headers - Les headers HTTP personnalisés
 * @param timeout - Le timeout en millisecondes
 * @returns Une configuration API complète
 *
 * @example
 * ```typescript
 * const config = createApiConfig('https://api.example.com', {
 *   'Authorization': 'Bearer token123'
 * });
 * ```
 */
export function createApiConfig(
    baseUrl: string,
    headers?: Record<string, string>,
    timeout?: number
): ApiConfig {
    return {
        baseUrl,
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            ...headers,
        },
        timeout: timeout || 30000,
    };
}

/**
 * Récupère la configuration API depuis les variables d'environnement
 *
 * Variables d'environnement supportées:
 * - NEXT_PUBLIC_API_URL: URL de base de l'API
 * - NEXT_PUBLIC_API_TIMEOUT: Timeout en millisecondes
 *
 * @returns Une configuration API basée sur les variables d'environnement
 *
 * @example
 * ```typescript
 * // .env
 * NEXT_PUBLIC_API_URL=https://api.staging.example.com
 * NEXT_PUBLIC_API_TIMEOUT=60000
 *
 * // Dans votre code
 * const config = getApiConfigFromEnv();
 * ```
 */
export function getApiConfigFromEnv(): ApiConfig {
    return {
        baseUrl: API_CONFIG.baseUrl,
        headers: API_CONFIG.headers,
        timeout:  API_CONFIG.timeout,
    };
}

/**
 * Configurations pré-définies pour différents environnements
 */
export const API_CONFIGS = {
    production: createApiConfig('https://campusmaster-campusmaster-v1.onrender.com'),
    staging: createApiConfig('https://staging-api.campusmaster.com'),
    development: createApiConfig('http://localhost:8000'),
    local: createApiConfig('http://localhost:3000/api'),
} as const;

/**
 * Type helper pour les environnements disponibles
 */
export type ApiEnvironment = keyof typeof API_CONFIGS;

/**
 * Récupère la configuration pour un environnement spécifique
 *
 * @param env - L'environnement cible
 * @returns La configuration API pour cet environnement
 *
 * @example
 * ```typescript
 * const config = getApiConfigForEnvironment('staging');
 * ```
 */
export function getApiConfigForEnvironment(env: ApiEnvironment): ApiConfig {
    return API_CONFIGS[env];
}