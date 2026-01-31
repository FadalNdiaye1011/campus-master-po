// packages/api/src/services/studentCourseService.ts

import { ParentService } from '../parent-service';
import type {
    StudentCourse,
    StudentAssignment,
    CourseEnrollment,
} from '../types/student-course.types';

const API_CONFIG = {
    baseUrl: '',
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    },
};

export class StudentCourseService extends ParentService {
    private static instance: StudentCourseService;

    constructor() {
        super(API_CONFIG);
    }

    static getInstance(): StudentCourseService {
        if (!StudentCourseService.instance) {
            StudentCourseService.instance = new StudentCourseService();
        }
        return StudentCourseService.instance;
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
     * Récupère tous les cours disponibles
     */
    static async getAvailableCourses(): Promise<StudentCourse[]> {
        const service = StudentCourseService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📥 Fetching available courses');

        const response = await service.gethttp.get<StudentCourse[]>(
            '/api/proxy/student/courses',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Récupère les cours auxquels l'étudiant est inscrit
     */
    static async getMyEnrolledCourses(): Promise<CourseEnrollment[]> {
        const service = StudentCourseService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';
        const userId = this.getUserId();

        if (userId === 0) {
            throw new Error('ID utilisateur introuvable. Veuillez vous reconnecter.');
        }

        console.log('📥 Fetching enrolled courses for user:', userId);

        const response = await service.gethttp.get<CourseEnrollment[]>(
            `/api/proxy/student/my-courses/user/${userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * S'inscrit à un cours
     */
    static async enrollInCourse(courseId: number): Promise<CourseEnrollment> {
        const service = StudentCourseService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';
        const userId = this.getUserId();

        if (userId === 0) {
            throw new Error('ID utilisateur introuvable. Veuillez vous reconnecter.');
        }

        console.log('➕ Enrolling in course:', courseId);

        const response = await service.gethttp.post<CourseEnrollment>(
            `/api/proxy/student/enrollment/user/${userId}/course/${courseId}`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Récupère tous les devoirs d'un cours
     */
    static async getCourseAssignments(courseId: number): Promise<StudentAssignment[]> {
        const service = StudentCourseService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📝 Fetching assignments for course:', courseId);

        const response = await service.gethttp.get<StudentAssignment[]>(
            `/api/proxy/student/courses/${courseId}/assignments`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    /**
     * Récupère les devoirs actifs (non expirés) d'un cours
     */
    static async getActiveCourseAssignments(courseId: number): Promise<StudentAssignment[]> {
        const service = StudentCourseService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📝 Fetching active assignments for course:', courseId);

        const response = await service.gethttp.get<StudentAssignment[]>(
            `/api/proxy/student/courses/${courseId}/assignments/active`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }
}