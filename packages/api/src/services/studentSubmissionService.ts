import { ParentService } from '../parent-service';
import type {
    StudentSubmission,
    CreateSubmissionRequest,
    UpdateSubmissionRequest,
    FileUploadResponse,
} from '../types/student-submission.types';

const API_CONFIG = {
    baseUrl: '',
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    },
};

export class StudentSubmissionService extends ParentService {
    private static instance: StudentSubmissionService;

    constructor() {
        super(API_CONFIG);
    }

    static getInstance(): StudentSubmissionService {
        if (!StudentSubmissionService.instance) {
            StudentSubmissionService.instance = new StudentSubmissionService();
        }
        return StudentSubmissionService.instance;
    }

    /**
     * Récupère l'ID de l'utilisateur depuis le localStorage
     */
    private static getUserId(): number {
        if (typeof window === 'undefined') {
            return 0;
        }

        const authUserStr = localStorage.getItem('auth_user');
        if (authUserStr) {
            try {
                const user = JSON.parse(authUserStr);
                const id = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
                return id || 0;
            } catch (err) {
                console.error('❌ Error parsing auth_user:', err);
            }
        }

        return 0;
    }

    /**
     * Upload un fichier pour un devoir
     */
    static async uploadFile(file: File): Promise<string> {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        if (!token) {
            throw new Error('Token manquant');
        }

        console.log('📤 Uploading file:', file.name);

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/proxy/student/upload/devoir', {
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
     * Soumet un devoir
     */
    static async submitAssignment(data: CreateSubmissionRequest): Promise<StudentSubmission> {
        const service = StudentSubmissionService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';
        const userId = this.getUserId();

        if (userId === 0) {
            throw new Error('ID utilisateur introuvable. Veuillez vous reconnecter.');
        }

        console.log('➕ Submitting assignment');

        const response = await service.gethttp.post<StudentSubmission>(
            `/api/proxy/student/submit/user/${userId}`,
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
     * Met à jour une soumission
     */
    static async updateSubmission(
        submissionId: number,
        data: UpdateSubmissionRequest
    ): Promise<StudentSubmission> {
        const service = StudentSubmissionService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';
        const userId = this.getUserId();

        if (userId === 0) {
            throw new Error('ID utilisateur introuvable. Veuillez vous reconnecter.');
        }

        console.log('✏️ Updating submission:', submissionId);

        const response = await service.gethttp.put<StudentSubmission>(
            `/api/proxy/student/submit/${submissionId}/user/${userId}`,
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
     * Récupère l'historique des soumissions pour un devoir
     */
    static async getSubmissionHistory(assignmentId: number): Promise<StudentSubmission[]> {
        const service = StudentSubmissionService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';
        const userId = this.getUserId();

        if (userId === 0) {
            throw new Error('ID utilisateur introuvable. Veuillez vous reconnecter.');
        }

        console.log('📥 Fetching submission history for assignment:', assignmentId);

        const response = await service.gethttp.get<StudentSubmission[]>(
            `/api/proxy/student/submit/assignment/${assignmentId}/user/${userId}/history`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Récupère une soumission spécifique
     */
    static async getSubmission(submissionId: number): Promise<StudentSubmission> {
        const service = StudentSubmissionService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📥 Fetching submission:', submissionId);

        const response = await service.gethttp.get<StudentSubmission>(
            `/api/proxy/student/submit/${submissionId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }
}