// packages/api/src/services/teacherAssignmentService.ts

import { ParentService } from '../parent-service';
import type {
    TeacherAssignment,
    CreateAssignmentRequest,
    UpdateAssignmentRequest,
    AssignmentSubmission,
} from '../types/teacher-assignment.types';

const API_CONFIG = {
    baseUrl: '',
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    },
};

export class TeacherAssignmentService extends ParentService {
    private static instance: TeacherAssignmentService;

    constructor() {
        super(API_CONFIG);
    }

    static getInstance(): TeacherAssignmentService {
        if (!TeacherAssignmentService.instance) {
            TeacherAssignmentService.instance = new TeacherAssignmentService();
        }
        return TeacherAssignmentService.instance;
    }

    /**
     * Crée un nouveau devoir
     */
    static async createAssignment(data: CreateAssignmentRequest): Promise<TeacherAssignment> {
        const service = TeacherAssignmentService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('➕ Creating assignment:', data.titre);

        const response = await service.gethttp.post<TeacherAssignment>(
            '/api/proxy/teacher/assignments',
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
     * Met à jour un devoir
     */
    static async updateAssignment(
        assignmentId: number,
        data: UpdateAssignmentRequest
    ): Promise<TeacherAssignment> {
        const service = TeacherAssignmentService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('✏️ Updating assignment:', assignmentId);

        const response = await service.gethttp.put<TeacherAssignment>(
            `/api/proxy/teacher/assignments/${assignmentId}`,
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
     * Supprime un devoir
     */
    static async deleteAssignment(assignmentId: number): Promise<void> {
        const service = TeacherAssignmentService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('🗑️ Deleting assignment:', assignmentId);

        await service.gethttp.delete<void>(
            `/api/proxy/teacher/assignments/${assignmentId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
    }

    /**
     * Récupère toutes les soumissions d'un devoir
     */
    static async getAssignmentSubmissions(assignmentId: number): Promise<AssignmentSubmission[]> {
        const service = TeacherAssignmentService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📥 Fetching submissions for assignment:', assignmentId);

        const response = await service.gethttp.get<AssignmentSubmission[]>(
            `/api/proxy/teacher/assignments/${assignmentId}/submissions`,
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
    static async getSubmission(submissionId: number): Promise<AssignmentSubmission> {
        const service = TeacherAssignmentService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📥 Fetching submission:', submissionId);

        const response = await service.gethttp.get<AssignmentSubmission>(
            `/api/proxy/teacher/submissions/${submissionId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Évalue une soumission
     */
    static async evaluateSubmission(
        submissionId: number,
        note: number,
        feedback: string
    ): Promise<AssignmentSubmission> {
        const service = TeacherAssignmentService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('✅ Evaluating submission:', submissionId);

        const response = await service.gethttp.put<AssignmentSubmission>(
            `/api/proxy/teacher/submissions/${submissionId}/evaluate?note=${note}&feedback=${encodeURIComponent(feedback)}`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }
}