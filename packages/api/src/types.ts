export interface ApiConfig {
    baseUrl: string;
    headers?: Record<string, string>;
    timeout?: number; // Optionnel: timeout en millisecondes
}

export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}