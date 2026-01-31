// export { AuthService } from './authService';
// export { MOCK_USERS, MOCK_PASSWORD } from './mockData';
// export type { User, UserRole, LoginCredentials, AuthResponse } from './type';


export { AuthService } from './authService';
export { ParentService } from '@repo/api';
export { HttpClient } from '@repo/api';
export { API_CONFIG, createApiConfig, getApiConfigFromEnv } from './config';
export type {
    User,
    UserRole,
    LoginCredentials,
    AuthResponse,
    ApiConfig,
    ApiLoginResponse
} from './type';



