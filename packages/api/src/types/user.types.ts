// packages/api/src/types/user.types.ts

export type UserRole = 'STUDENT' | 'PROFESSOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    status: UserStatus;
    roles: UserRole[];
    createdAt: string;
    lastLogin: string | null;
    avatarUrl?: string;
}

export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: UserRole;
    departementId?: string;
    numeroEtudiant?: string;
    specialisation?: string;
}

export interface UpdateUserRequest {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: UserRole;
    status: UserStatus;
    avatarUrl?: string;
}

export interface UserResponse {
    email: string;
    firstName: string;
    lastName: string;
    refreshToken: string;
    role: UserRole;
    token: string;
    type: string;
    userId: number;
    username: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: {
        offset: number;
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        unpaged: boolean;
    };
    size: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    totalElements: number;
    totalPages: number;
}