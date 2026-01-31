import { HttpClient } from './http-client';
import { ApiConfig } from './types';

export class ParentService {
    private http: HttpClient;
    private baseUrl: string;
    private useProxy: boolean;

    constructor(config: ApiConfig) {
        this.baseUrl = config.baseUrl;

        // Détecter si on doit utiliser le proxy
        // Si baseUrl est vide ou si on est côté client, on utilise le proxy
        this.useProxy = !config.baseUrl || (typeof window !== 'undefined' && config.baseUrl.includes('campusmaster'));

        this.http = new HttpClient({
            baseUrl: config.baseUrl,
            headers: config.headers || {},
        });

        console.log('🔧 ParentService initialisé:', {
            baseUrl: config.baseUrl,
            useProxy: this.useProxy,
            environment: typeof window !== 'undefined' ? 'browser' : 'server'
        });
    }

    get gethttp() {
        return this.http;
    }

    /**
     * Transforme l'URI en ajoutant le préfixe proxy si nécessaire
     */
    private transformUri(uri: string): string {
        // Si on n'utilise pas le proxy, retourner l'URI tel quel
        if (!this.useProxy) {
            return uri;
        }

        // Si l'URI commence déjà par /api/proxy, ne pas modifier
        if (uri.startsWith('/api/proxy')) {
            return uri;
        }

        // Mapper les URIs backend vers les proxies Next.js
        const proxyMapping: Record<string, string> = {
            '/api/auth/login': '/api/proxy/login',
            '/api/auth/register': '/api/proxy/register',
            '/api/auth/profile': '/api/proxy/profile',
            // Ajoute d'autres mappings ici au besoin
        };

        // Vérifier si on a un mapping exact
        if (proxyMapping[uri]) {
            console.log(`🔄 Proxy mapping: ${uri} → ${proxyMapping[uri]}`);
            return proxyMapping[uri];
        }

        // Sinon, transformer automatiquement /api/* en /api/proxy/*
        if (uri.startsWith('/api/')) {
            const proxied = uri.replace('/api/', '/api/proxy/');
            console.log(`🔄 Auto proxy: ${uri} → ${proxied}`);
            return proxied;
        }

        return uri;
    }

    async getData<T>(uri: string): Promise<T> {
        const transformedUri = this.transformUri(uri);
        const response = await this.http.get<T>(transformedUri);
        console.log(response);
        return response;
    }

    async postData<E, R>(uri: string, data: E): Promise<R> {
        console.log('📤 POST data:', data);
        const transformedUri = this.transformUri(uri);
        const response = await this.http.post<R>(transformedUri, data);
        console.log('📥 Response:', response);
        return response;
    }

    async putData<E, R>(uri: string, data: E): Promise<R> {
        const transformedUri = this.transformUri(uri);
        const response = await this.http.put<R>(transformedUri, data);
        console.log(response);
        return response;
    }

    async deleteData<R>(uri: string, id: string | number): Promise<R> {
        const transformedUri = this.transformUri(`${uri}/${id}`);
        const response = await this.http.delete<R>(transformedUri);
        return response;
    }

    async show<T>(uri: string, id: string | number): Promise<T> {
        const transformedUri = this.transformUri(`${uri}/${id}`);
        const response = await this.http.get<T>(transformedUri);
        console.log(response);
        return response;
    }

    async getRole(uri: string): Promise<string> {
        return this.getData<string>(uri);
    }
}