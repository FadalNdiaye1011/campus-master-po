// packages/api/src/http-client.ts

import { ApiConfig } from './types';

export class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public data?: any,
        public isNetworkError: boolean = false
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export class HttpClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;

    constructor(config: ApiConfig) {
        this.baseUrl = config.baseUrl;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...config.headers,
        };
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        console.log('🌐 HTTP Request:', {
            method: options.method || 'GET',
            url,
            headers: { ...this.defaultHeaders, ...options.headers },
            body: options.body,
        });

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...this.defaultHeaders,
                    ...(options.headers || {}),
                },
            });

            console.log('📡 HTTP Response:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                url: response.url,
            });

            // Gestion des erreurs HTTP
            if (!response.ok) {
                let errorData: any;
                const contentType = response.headers.get('content-type');

                try {
                    if (contentType && contentType.includes('application/json')) {
                        errorData = await response.json();
                        console.error('❌ Erreur API (JSON):', errorData);
                    } else {
                        errorData = await response.text();
                        console.error('❌ Erreur API (Text):', errorData);
                    }
                } catch (parseError) {
                    console.error('❌ Impossible de parser l\'erreur:', parseError);
                    errorData = { message: response.statusText };
                }

                throw new ApiError(
                    errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
                    response.status,
                    errorData,
                    false
                );
            }

            // Gestion des réponses vides
            const contentType = response.headers.get('content-type');

            if (response.status === 204 || response.status === 205) {
                console.log('✅ Réponse vide (204/205)');
                return {} as T;
            }

            if (contentType && contentType.includes('application/json')) {
                const jsonData = await response.json();
                console.log('✅ Réponse JSON:', jsonData);
                return jsonData;
            }

            if (contentType && contentType.includes('text/')) {
                const textData = await response.text();
                console.log('✅ Réponse Text:', textData);
                return textData as unknown as T;
            }

            // Fallback pour d'autres types de contenu
            const blobData = await response.blob();
            console.log('✅ Réponse Blob:', blobData);
            return blobData as unknown as T;

        } catch (error: any) {
            // Erreur réseau (pas de réponse du serveur)
            if (error instanceof ApiError) {
                // C'est déjà une ApiError, on la relance
                throw error;
            }

            // Erreur réseau brute (CORS, timeout, connexion refusée, etc.)
            console.error('❌ Erreur réseau complète:', {
                name: error.name,
                message: error.message,
                stack: error.stack,
                url,
            });

            // Déterminer le type d'erreur réseau
            let errorMessage = 'Erreur de connexion au serveur';

            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage = '🔴 ERREUR RÉSEAU: Impossible de contacter le serveur.\n\n' +
                    'Causes possibles:\n' +
                    '1. Le serveur est hors ligne\n' +
                    '2. Problème de CORS (Cross-Origin Resource Sharing)\n' +
                    '3. L\'URL est incorrecte\n' +
                    '4. Pas de connexion Internet\n\n' +
                    `URL tentée: ${url}`;
            } else if (error.name === 'AbortError') {
                errorMessage = '⏱️ La requête a pris trop de temps (timeout)';
            }

            throw new ApiError(
                errorMessage,
                undefined,
                {
                    originalError: error.message,
                    url,
                    type: 'NETWORK_ERROR'
                },
                true
            );
        }
    }

    async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'GET',
            ...options,
        });
    }

    async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    }

    async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    }

    async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            ...options,
        });
    }

    async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    }

    setHeader(key: string, value: string): void {
        this.defaultHeaders[key] = value;
    }

    removeHeader(key: string): void {
        delete this.defaultHeaders[key];
    }
}