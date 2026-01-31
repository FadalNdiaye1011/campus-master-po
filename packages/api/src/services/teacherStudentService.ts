// packages/api/src/services/teacherStudentService.ts

import { ParentService } from '../parent-service';
import type {
    TeacherStudent,
    StudentProgress,
} from '../types/teacher-student.types';

const API_CONFIG = {
    baseUrl: '',
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    },
};

export class TeacherStudentService extends ParentService {
    private static instance: TeacherStudentService;

    constructor() {
        super(API_CONFIG);
    }

    static getInstance(): TeacherStudentService {
        if (!TeacherStudentService.instance) {
            TeacherStudentService.instance = new TeacherStudentService();
        }
        return TeacherStudentService.instance;
    }

    /**
     * Récupère tous les étudiants
     */
    static async getAllStudents(): Promise<TeacherStudent[]> {
        const service = TeacherStudentService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📥 Fetching all students');

        const response = await service.gethttp.get<TeacherStudent[]>(
            '/api/proxy/teacher/students',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Récupère la progression d'un étudiant
     */
    static async getStudentProgress(studentId: number): Promise<StudentProgress> {
        const service = TeacherStudentService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📊 Fetching student progress:', studentId);

        const response = await service.gethttp.get<StudentProgress>(
            `/api/proxy/teacher/students/${studentId}/progress`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }
}