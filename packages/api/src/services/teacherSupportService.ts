import { ParentService } from '../parent-service';
import type {
    TeacherSupport,
    CreateSupportRequest,
    FileUploadResponse,
} from '../types/teacher-support.types';

const API_CONFIG = {
    baseUrl: '',
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    },
};

export class TeacherSupportService extends ParentService {
    private static instance: TeacherSupportService;

    constructor() {
        super(API_CONFIG);
    }

    static getInstance(): TeacherSupportService {
        if (!TeacherSupportService.instance) {
            TeacherSupportService.instance = new TeacherSupportService();
        }
        return TeacherSupportService.instance;
    }

    /**
     * Upload un fichier de support
     */
    static async uploadFile(file: File): Promise<string> {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        if (!token) {
            throw new Error('Token manquant');
        }

        console.log('📤 Uploading support file:', file.name);

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/proxy/teacher/upload/support', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${errorText}`);
        }

        const data: FileUploadResponse = await response.json();

        // Extrait l'URL du fichier depuis la réponse
        const fileUrl = data.url || data.fileUrl || data.path || Object.values(data)[0];

        if (!fileUrl || typeof fileUrl !== 'string') {
            throw new Error('URL du fichier non trouvée dans la réponse');
        }

        console.log('✅ File uploaded:', fileUrl);
        return fileUrl;
    }

    /**
     * Crée un nouveau support pédagogique
     */
    static async createSupport(data: CreateSupportRequest): Promise<TeacherSupport> {
        const service = TeacherSupportService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('➕ Creating support');

        const response = await service.gethttp.post<TeacherSupport>(
            '/api/proxy/teacher/supports',
            data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Récupère tous les supports d'un cours
     */
    static async getCourseSupports(courseId: number): Promise<TeacherSupport[]> {
        const service = TeacherSupportService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📥 Fetching supports for course:', courseId);

        const response = await service.gethttp.get<TeacherSupport[]>(
            `/api/proxy/teacher/courses/${courseId}/supports`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }
}