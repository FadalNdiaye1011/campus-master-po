// packages/api/src/services/teacherCourseService.ts

import { ParentService } from '../parent-service';
import type {
    TeacherCourse,
    CreateTeacherCourseRequest,
    UpdateTeacherCourseRequest,
    CourseStats,
    CourseStudent,
    CourseAssignment,
    CourseSupport,
    CourseAnnouncement,
} from '../types/teacher-course.types';

const API_CONFIG = {
    baseUrl: '',
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
    },
};

export class TeacherCourseService extends ParentService {
    private static instance: TeacherCourseService;

    constructor() {
        super(API_CONFIG);
    }

    static getInstance(): TeacherCourseService {
        if (!TeacherCourseService.instance) {
            TeacherCourseService.instance = new TeacherCourseService();
        }
        return TeacherCourseService.instance;
    }

    /**
     * Récupère l'ID du tuteur depuis le localStorage
     */
    private static getTuteurId(): number {

        // return 2
        if (typeof window === 'undefined') {
            return 0;
        }

        // Tentative 1: auth_user
        const authUserStr = localStorage.getItem('auth_user');
        if (authUserStr) {
            try {
                const user = JSON.parse(authUserStr);
                const id = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
                console.log('✅ Tuteur ID:', id);
                return id || 0;
            } catch (err) {
                console.error('❌ Error parsing auth_user:', err);
            }
        }

        // Tentative 2: user
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                const id = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
                return id || 0;
            } catch (err) {
                console.error('❌ Error parsing user:', err);
            }
        }

        console.error('❌ Could not find tuteur ID');
        return 0;
    }

    static async getMyCourses(): Promise<TeacherCourse[]> {
        const service = TeacherCourseService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';
        const tuteurId = this.getTuteurId();

        if (tuteurId === 0) {
            throw new Error('ID du tuteur introuvable. Veuillez vous reconnecter.');
        }

        console.log('📥 Fetching teacher courses for tuteur:', tuteurId);

        const response = await service.gethttp.get<TeacherCourse[]>(
            `/api/proxy/teacher/courses/tuteur/${tuteurId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    static async createCourse(data: Omit<CreateTeacherCourseRequest, 'tuteurId'>): Promise<TeacherCourse> {
        const service = TeacherCourseService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';
        const tuteurId = this.getTuteurId();

        if (tuteurId === 0) {
            throw new Error('ID du tuteur introuvable. Veuillez vous reconnecter.');
        }

        console.log('➕ Creating teacher course');

        const requestData: CreateTeacherCourseRequest = {
            ...data,
            tuteurId,
        };

        const response = await service.gethttp.post<TeacherCourse>(
            '/api/proxy/teacher/courses',
            requestData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    static async updateCourse(
        courseId: number,
        data: Omit<UpdateTeacherCourseRequest, 'tuteurId'>
    ): Promise<TeacherCourse> {
        const service = TeacherCourseService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';
        const tuteurId = this.getTuteurId();

        if (tuteurId === 0) {
            throw new Error('ID du tuteur introuvable. Veuillez vous reconnecter.');
        }

        console.log('✏️ Updating teacher course:', courseId);

        const requestData: UpdateTeacherCourseRequest = {
            ...data,
            tuteurId,
        };

        const response = await service.gethttp.put<TeacherCourse>(
            `/api/proxy/teacher/courses/${courseId}`,
            requestData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    static async deleteCourse(courseId: number): Promise<void> {
        const service = TeacherCourseService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('🗑️ Deleting teacher course:', courseId);

        await service.gethttp.delete<void>(
            `/api/proxy/teacher/courses/${courseId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
    }

    static async getCourseStats(courseId: number): Promise<CourseStats> {
        const service = TeacherCourseService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📊 Fetching course stats:', courseId);

        const response = await service.gethttp.get<CourseStats>(
            `/api/proxy/teacher/courses/${courseId}/stats`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    static async getCourseStudents(courseId: number): Promise<CourseStudent[]> {
        const service = TeacherCourseService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('👥 Fetching course students:', courseId);

        const response = await service.gethttp.get<CourseStudent[]>(
            `/api/proxy/teacher/courses/${courseId}/students`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    static async getCourseAssignments(courseId: number): Promise<CourseAssignment[]> {
        const service = TeacherCourseService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📝 Fetching course assignments:', courseId);

        const response = await service.gethttp.get<CourseAssignment[]>(
            `/api/proxy/teacher/courses/${courseId}/assignments`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    static async getCourseSupports(courseId: number): Promise<CourseSupport[]> {
        const service = TeacherCourseService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📚 Fetching course supports:', courseId);

        const response = await service.gethttp.get<CourseSupport[]>(
            `/api/proxy/teacher/courses/${courseId}/supports`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }

    static async getCourseAnnouncements(courseId: number): Promise<CourseAnnouncement[]> {
        const service = TeacherCourseService.getInstance();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';

        console.log('📢 Fetching course announcements:', courseId);

        const response = await service.gethttp.get<CourseAnnouncement[]>(
            `/api/proxy/teacher/courses/${courseId}/announcements`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response;
    }
}